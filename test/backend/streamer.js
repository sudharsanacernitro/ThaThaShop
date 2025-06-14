// streamer.js
const redis = require('./redisConfig'); // singleton instance

async function writeToStream(lat, lon) {
  try {
    await redis.xadd(
      'delivery_stream',
      '*',
      'agentId', 'agent123',
      'lat', lat,
      'lng', lon,
      'timestamp', Date.now().toString()
    );
    console.log('✅ Stream write successful');
  } catch (err) {
    console.error('❌ Redis write error:', err);
  }
}

module.exports = { writeToStream };
