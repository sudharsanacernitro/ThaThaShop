const { createProxyMiddleware } = require('http-proxy-middleware');
const CircuitBreaker = require('opossum');
const {DEFAULT_CIRCUIT_BREAKER_OPTIONS} = require('./config/circuitBreaker.config');


const serviceBreakers = new Map();

function createProxyBreakerMiddleware(targetUrl, pathRewriteRules={}, breakerOptions = {}) {
    const breakerKey = targetUrl;
    let breaker = serviceBreakers.get(breakerKey);

    if (!breaker) {
        const mergedOptions = { ...DEFAULT_CIRCUIT_BREAKER_OPTIONS, ...breakerOptions };

        const proxyMiddlewareInstance = createProxyMiddleware({
            target: targetUrl,
            changeOrigin: true,
            pathRewrite: pathRewriteRules,
            selfHandleResponse: true,
            logLevel: 'warn',
            onError: (err, req, res, target) => {
                console.error(`[Proxy Error to ${targetUrl}] - onError: ${err.message}`);
            },
        });

        const proxyOperation = (req, res, next) => {
            return new Promise((resolve, reject) => {
                proxyMiddlewareInstance(req, res, (err) => {
                    if (err) {
                        console.error(`[Proxy Setup Error to ${targetUrl}] - ${err.message}`);
                        return reject(err);
                    }
                });

                req.on('proxyRes', (proxyRes, req, res) => {
                    proxyRes.pipe(res);

                    proxyRes.on('end', () => {
                        if (proxyRes.statusCode >= 200 && proxyRes.statusCode < 400) {
                            resolve();
                        } else {
                            reject(new Error(`Upstream service responded with status ${proxyRes.statusCode}`));
                        }
                    });
                });

                req.on('error', (err) => {
                    console.error(`[Network Error to ${targetUrl}] - ${err.message}`);
                    reject(err);
                });
            });
        };

        breaker = new CircuitBreaker(proxyOperation, mergedOptions);

        breaker.on('open', () => console.warn(`🚨 Circuit Breaker OPEN for ${targetUrl}!`));
        breaker.on('halfOpen', () => console.info(`🟡 Circuit Breaker HALF_OPEN for ${targetUrl}. Testing...`));
        breaker.on('close', () => console.info(`✅ Circuit Breaker CLOSED for ${targetUrl}. Service recovered.`));
        breaker.on('fire', () => console.log(`🔥 Firing breaker for ${targetUrl}.`));
        breaker.on('success', () => console.log(`✨ Success via breaker for ${targetUrl}.`));
        breaker.on('reject', (err) => console.error(`❌ Breaker REJECTED for ${targetUrl}: ${err.message}.`));
        breaker.on('timeout', () => console.warn(`⏰ Timeout via breaker for ${targetUrl}.`));
        breaker.on('failure', (err) => console.error(`💔 Failure via breaker for ${targetUrl}: ${err.message}.`));

        serviceBreakers.set(breakerKey, breaker);
    }

    return async (req, res, next) => {
        try {
            await breaker.fire(req, res, next);
        } catch (err) {
            console.error(`Proxy request to ${targetUrl} failed via circuit breaker: ${err.message}`);

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


module.exports ={
    createProxyBreakerMiddleware
};