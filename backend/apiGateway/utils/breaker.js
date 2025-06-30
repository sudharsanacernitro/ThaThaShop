const { createProxyMiddleware } = require('http-proxy-middleware');
const CircuitBreaker = require('opossum');
const { DEFAULT_CIRCUIT_BREAKER_OPTIONS } = require('../config/circuitBreaker.config');

const serviceBreakers = new Map();

function createProxyBreakerMiddleware(targetUrl, pathRewriteRules = {}, breakerOptions = {}) {
    const breakerKey = targetUrl;
    let breaker = serviceBreakers.get(breakerKey);

    if (!breaker) {
        const mergedOptions = { ...DEFAULT_CIRCUIT_BREAKER_OPTIONS, ...breakerOptions };

        const proxyResHandlers = new WeakMap();

        const proxyMiddlewareInstance = createProxyMiddleware({
            target: targetUrl,
            changeOrigin: true,
            pathRewrite: pathRewriteRules,
            // selfHandleResponse: true,
            logLevel: 'debug',

            onProxyRes: (proxyRes, req, res) => {
                const chunks = [];

                proxyRes.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                proxyRes.on('end', () => {
                    const body = Buffer.concat(chunks);
                    console.log(`[onProxyRes] Response from ${targetUrl}: ${proxyRes.statusCode}`);

                    if (!res.headersSent) {
                        res.writeHead(proxyRes.statusCode, proxyRes.headers);
                    }
                    res.end(body);

                    const handler = proxyResHandlers.get(res);
                    if (handler) {
                        if (proxyRes.statusCode >= 200 && proxyRes.statusCode < 400) {
                            handler.resolve();
                        } else {
                            handler.reject(new Error(`Upstream responded with status ${proxyRes.statusCode}`));
                        }
                        proxyResHandlers.delete(res);
                    }
                });

                proxyRes.on('error', (err) => {
                    console.error(`[onProxyRes Error] ${err.message}`);
                    const handler = proxyResHandlers.get(res);
                    if (handler) {
                        handler.reject(err);
                        proxyResHandlers.delete(res);
                    }
                });
            },

            onError: (err, req, res) => {
                console.error(`[Proxy Error to ${targetUrl}] - onError: ${err.message}`);
                if (!res.headersSent) {
                    res.writeHead(502, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Proxy error', detail: err.message }));
                }
            }
        });

        const proxyOperation = (req, res) => {
            return new Promise((resolve, reject) => {
                console.log(`[proxyOperation] Forwarding request to ${targetUrl} -> ${req.method} ${req.url}`);

                proxyResHandlers.set(res, { resolve, reject });

                try {
                    proxyMiddlewareInstance(req, res, (err) => {
                        if (err) {
                            console.error(`[ProxyMiddlewareInstance Error] ${err.message}`);
                            reject(err);
                        }
                        return resolve(); // success if no error
                    });

                    req.on('error', reject);
                    res.on('error', reject);
                } catch (err) {
                    console.error(`[proxyOperation Exception] ${err.message}`);
                    reject(err);
                }
            });
        };

        breaker = new CircuitBreaker(proxyOperation, mergedOptions);

        // Circuit breaker event logs
        breaker.on('open', () => console.warn(`🚨 Circuit Breaker OPEN for ${targetUrl}!`));
        breaker.on('halfOpen', () => console.info(`🟡 Circuit Breaker HALF_OPEN for ${targetUrl}. Testing...`));
        breaker.on('close', () => console.info(`✅ Circuit Breaker CLOSED for ${targetUrl}. Service recovered.`));
        breaker.on('fire', () => console.log(`🔥 Firing breaker for ${targetUrl}.`));
        breaker.on('success', () => console.log(`✨ Success via breaker for ${targetUrl}.`));
        breaker.on('reject', (err) => console.error(`❌ Breaker REJECTED for ${targetUrl}: ${err.message}`));
        breaker.on('timeout', () => console.warn(`⏰ Timeout via breaker for ${targetUrl}.`));
        breaker.on('failure', (err) => console.error(`💔 Failure via breaker for ${targetUrl}: ${err.message}`));

        serviceBreakers.set(breakerKey, breaker);
    }

    return async (req, res) => {
        try {
            await breaker.fire(req, res); // don't pass next
        } catch (err) {
            console.error(`[CircuitBreaker Catch] Request to ${targetUrl} failed: ${err.message}`);
            if (!res.headersSent) {
                res.status(503).json({
                    message: 'Service temporarily unavailable. Please try again later.',
                    details: err.message,
                    circuitStatus: breaker.status,
                });
            }
        }
    };
}

module.exports = {
    createProxyBreakerMiddleware
};
