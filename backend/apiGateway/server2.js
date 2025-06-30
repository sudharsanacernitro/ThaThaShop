const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const http = require('http'); // For HTTP server and WS upgrade
const { createProxyServer } = require('http-proxy'); // For WebSocket proxy

const CircuitBreaker = require('opossum'); // Import Opossum

const logger = require('./logging'); // Your custom logger (assuming it exists and works)
const rateLimiter = require("./middlewares/ratelimiter"); // Your rate limiter (assuming it exists)

const app = express();
const server = http.createServer(app); // Create HTTP server for Express and WS upgrade

// Load configuration
const configPath = path.join(__dirname, 'serviceConfig.yaml');
const config = yaml.load(fs.readFileSync(configPath, 'utf8'));

 const cors = require('cors'); 
  const cookieParser = require('cookie-parser'); 
// --- Global Circuit Breaker Options (can be overridden per service in config) ---
const DEFAULT_CIRCUIT_BREAKER_OPTIONS = {
    timeout: 5000, // If proxy operation takes longer than 5 seconds, consider it a failure.
    errorThresholdPercentage: 50, // If 50% of requests fail, open the circuit.
    volumeThreshold: 10, // Minimum number of requests before the circuit considers opening.
    resetTimeout: function (failureCount) {
        const baseTimeout = 5000; // Start with 5 seconds for the first reset attempt
        const maxTimeout = 60000; // Max 1 minute for reset timeout
        const calculatedTimeout = baseTimeout * Math.pow(2, failureCount - 1);
        return Math.min(calculatedTimeout, maxTimeout);
    }
};

// --- Store Circuit Breaker Instances ---
// This map will hold a CircuitBreaker for each unique target service (IP:Port)
// We'll use the target URL as the key for the breaker map.
const serviceBreakers = new Map();

// --- Utility Function to Create and Manage Circuit Breakers ---
/**
 * Creates or retrieves a CircuitBreaker-wrapped proxy function for a specific target.
 * @param {string} serviceName Friendly name for logging.
 * @param {string} targetUrl The base URL of the target microservice (e.g., 'http://localhost:3001').
 * @param {Object} [routeOptions] Route-specific options from YAML (e.g., method, route)
 * @param {Object} [serviceCbOptions] Service-level circuit breaker options from YAML.
 * @returns {CircuitBreaker} An Opossum CircuitBreaker instance.
 */
function getOrCreateServiceProxyBreaker(serviceName, targetUrl, routeName, serviceCbOptions = {}) {
    const breakerKey = `${serviceName}-${targetUrl}`; // Unique key for this breaker
    let breaker = serviceBreakers.get(breakerKey);

    if (breaker) {
        return breaker;
    }

    // Merge default options with service-specific options
    const mergedOptions = { ...DEFAULT_CIRCUIT_BREAKER_OPTIONS, ...serviceCbOptions };

    // Create a new proxy middleware instance for this specific target.
    const proxyMiddlewareInstance = createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        selfHandleResponse: true, // Crucial: Tells http-proxy-middleware NOT to send response automatically
        logLevel: 'warn', // Only log warnings/errors from http-proxy-middleware itself
        onError: (err, req, res, target) => {
            logger.error(`[${serviceName}:${routeName} Proxy Error] Request to ${target} failed: ${err.message}`);
            // This error is handled by the promise rejection in proxyOperation
        }
    });

    // This is the function that Opossum will wrap.
    // It encapsulates the actual proxying logic.
    const proxyOperation = (req, res, next) => {
        return new Promise((resolve, reject) => {
            // Pass the request to the http-proxy-middleware instance.
            // When selfHandleResponse is true, it doesn't call res.end() or res.status().
            proxyMiddlewareInstance(req, res, (err) => {
                // This 'err' usually indicates an error *setting up* the proxy.
                if (err) {
                    logger.error(`[${serviceName}:${routeName} Proxy Setup Error]`, err);
                    return reject(err);
                }
                // If no setup error, the proxy middleware is now waiting for the target response.
            });

            // Listen for events from the proxy to determine success or failure
            req.on('proxyRes', (proxyRes, req, res) => {
                // Pipe the response from the target service back to the client.
                proxyRes.pipe(res);

                proxyRes.on('end', () => {
                    // Consider 2xx and 3xx status codes as successful for the circuit breaker.
                    if (proxyRes.statusCode >= 200 && proxyRes.statusCode < 400) {
                        resolve(); // Proxy operation successful
                    } else {
                        // Consider 4xx or 5xx from the target service as a failure for the circuit breaker.
                        reject(new Error(`Upstream service responded with status ${proxyRes.statusCode}`));
                    }
                });
            });

            // Listen for network errors during the proxy request (e.g., target service down)
            req.on('error', (err) => {
                logger.error(`[${serviceName}:${routeName} Network Error] Request to target failed: ${err.message}`);
                reject(err);
            });
        });
    };

    breaker = new CircuitBreaker(proxyOperation, mergedOptions);

    // --- Circuit Breaker Event Listeners (for monitoring) ---
    breaker.on('open', () => logger.warn(`🚨 [${serviceName}] Circuit Breaker OPEN! All requests will fail fast to ${targetUrl}.`));
    breaker.on('halfOpen', () => logger.info(`🟡 [${serviceName}] Circuit Breaker HALF_OPEN! Attempting a single request to ${targetUrl}.`));
    breaker.on('close', () => logger.info(`✅ [${serviceName}] Circuit Breaker CLOSED! Service ${targetUrl} back to normal.`));
    breaker.on('fire', () => logger.debug(`🔥 Attempting to proxy request to ${serviceName} (${targetUrl})...`));
    breaker.on('success', () => logger.debug(`✨ Successfully proxied request to ${serviceName} (${targetUrl}).`));
    breaker.on('reject', (err) => logger.error(`❌ [${serviceName}] Circuit Breaker REJECTED: ${err.message}. Not even trying to proxy to ${targetUrl}.`));
    breaker.on('timeout', () => logger.warn(`⏰ [${serviceName}] proxy request to ${targetUrl} TIMED OUT.`));
    breaker.on('failure', (err) => logger.error(`💔 [${serviceName}] proxy request to ${targetUrl} FAILED: ${err.message}`));

    serviceBreakers.set(breakerKey, breaker);
    return breaker;
}

// --- Express Middleware for Proxying with Circuit Breaker ---
/**
 * Express middleware to proxy requests using a given Opossum Circuit Breaker.
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {Function} next Express next middleware function.
 * @param {CircuitBreaker} breaker The Opossum CircuitBreaker instance for the target service.
 */
async function proxyWithCircuitBreakerMiddleware(req, res, next, breaker) {
    try {
        // Fire the circuit breaker. It will call our 'proxyOperation' function
        // defined inside getOrCreateServiceProxyBreaker.
        await breaker.fire(req, res, next);
        // If fire() resolves, it means the proxy operation was successful,
        // and the response has already been sent by the `proxyRes.pipe(res)` call.
    } catch (err) {
        // This catch block handles:
        // 1. Opossum rejecting the request (circuit is OPEN).
        // 2. The proxyOperation rejecting (e.g., target service 4xx/5xx response, network error, timeout).
        logger.error(`Proxy request to ${req.path} failed via circuit breaker: ${err.message}`);

        // Ensure headers haven't been sent yet to avoid errors.
        if (!res.headersSent) {
            // Send a 503 (Service Unavailable) because the upstream service is unhealthy
            // or the circuit is open.
            res.status(503).json({
                message: `Service temporarily unavailable. Please try again later.`,
                details: err.message,
                circuitStatus: breaker.status, // Provide current circuit status
            });
        }
    }
}

// --- Apply General Middleware ---
app.use(cors({
    origin: ['http://localhost:3000', 'https://frontend.localhost'], // Replace with your frontend URL
    credentials: true,
}));
app.set('trust proxy', 1);
app.use(cookieParser());
require('./utils/secretsLoader'); // Assuming this correctly loads secrets
app.use(express.static(path.join(__dirname, 'public')));
// app.use(rateLimiter); // Uncomment if you want to apply global rate limiting

// --- Setup HTTP Proxy with Circuit Breakers based on serviceConfig.yaml ---
for (const [serviceName, serviceConfig] of Object.entries(config.routes)) {
    const subServices = serviceConfig.subServices;
    const ip = serviceConfig.IP || 'localhost';
    const port = serviceConfig.port;
    const targetUrl = `http://${ip}:${port}`;
    const serviceCbOptions = serviceConfig.circuitBreakerOptions || {}; // Allow CB options in YAML

    logger.info(`Configuring routes for service: ${serviceName} at ${targetUrl}`);

    for (const [routeName, { route, method }] of Object.entries(subServices)) {
        logger.info(`  - Registering route ${route} [${method}] for ${serviceName}`);

        // Get or create the circuit breaker for this specific target service
        const breaker = getOrCreateServiceProxyBreaker(
            serviceName,
            targetUrl,
            routeName,
            serviceCbOptions
        );

        // Register the Express route using our circuit breaker middleware
        app[method.toLowerCase()](
            route,
            (req, res, next) => proxyWithCircuitBreakerMiddleware(req, res, next, breaker)
        );
    }
}

// --- WebSocket Proxy Setup ---
const wsProxy = createProxyServer({ ws: true });

wsProxy.on('error', (err, req, socket) => {
    logger.error(`[WebSocket Proxy Error] Failed to proxy WS connection: ${err.message}`);
    // You might want to handle this more gracefully, e.g., destroy socket with an error code
    socket.destroy();
});

server.on('upgrade', (req, socket, head) => {
    const pathname = req.url;

    // Example for orderservice WebSocket
    if (pathname.startsWith('/ws/client')) {
        const targetWs = 'ws://orderservice:8080'; // Note: Use 'ws://' for WS targets
        logger.info(`Proxying WebSocket connection to ${targetWs}`);
        // For WS, circuit breaking is harder for the persistent connection.
        // The CB would primarily apply to the *initial upgrade request*.
        // If orderservice is frequently down, you might want to prevent WS upgrades for a period.
        // A simple approach: use the HTTP breaker for the main service path to inform WS attempts.
        // For now, we'll just proxy directly.
        wsProxy.ws(req, socket, head, { target: targetWs });
    } else {
        logger.warn(`Unknown WebSocket path requested: ${pathname}. Destroying socket.`);
        socket.destroy(); // Unknown WS path
    }
});

// --- Server Startup ---
const PORT = 5000;
server.listen(PORT, () => {
    logger.info(`API Gateway running at http://localhost:${PORT}`);
    logger.info(`Loaded configuration from ${configPath}`);
});

// --- Graceful Shutdown (Optional but Recommended) ---
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: Closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        // Optionally close other resources like Redis connections for rate limiter
        // ...
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    logger.info('SIGINT signal received: Closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        // Optionally close other resources
        // ...
        process.exit(0);
    });
});