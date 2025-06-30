const DEFAULT_CIRCUIT_BREAKER_OPTIONS = {
    timeout: 10000,
    errorThresholdPercentage: 50,
    volumeThreshold: 10,
    // resetTimeout: function (failureCount) {
    //     const baseTimeout = 5000;
    //     const maxTimeout = 60000;
    //     const calculatedTimeout = baseTimeout * Math.pow(2, failureCount - 1);
    //     return Math.min(calculatedTimeout, maxTimeout);
    // }
};

module.exports={DEFAULT_CIRCUIT_BREAKER_OPTIONS};