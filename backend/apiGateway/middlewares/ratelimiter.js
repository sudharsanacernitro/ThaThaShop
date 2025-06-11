const Redis = require('ioredis');
const { RateLimiterRedis } = require('rate-limiter-flexible');

const redisClient = new Redis({
  host: 'redis', // change to 'localhost' if not in Docker
  port: 6379,
});

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rlflx',
  points: 100,           // 100 requests
  duration: 900,         // per 15 minutes
  blockDuration: 600     // block for 10 minutes if limit is exceeded
});

async function rateLimitMiddleware(req, res, next) {
  const ip = req.ip;

  try {
    const isBanned = await redisClient.get(`banned:${ip}`);
    if (isBanned) {
      return res.status(403).send('Access denied. You are temporarily banned.');
    }

    await rateLimiter.consume(ip);
    next();
  } catch (rejRes) {
    await redisClient.set(`banned:${ip}`, 'true', 'EX', 600); // ban for 10 minutes
    res.status(429).send('Too Many Requests. Rate limit exceeded.');
  }
}

module.exports = rateLimitMiddleware;
