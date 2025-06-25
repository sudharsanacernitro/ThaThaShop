const Redis = require('ioredis');
const redis = new Redis('redis://redis:6379');

module.exports = redis;
