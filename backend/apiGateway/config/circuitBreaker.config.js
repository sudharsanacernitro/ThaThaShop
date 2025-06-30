const DEFAULT_CIRCUIT_BREAKER_OPTIONS = {
    timeout: 10000,                 // Timeout per request
    errorThresholdPercentage: 50,  // % of failures before opening
    volumeThreshold: 10,           // # of requests before enabling breaker
    resetTimeout: 5000             // 5 seconds before retrying (static)
};

module.exports = { DEFAULT_CIRCUIT_BREAKER_OPTIONS };
