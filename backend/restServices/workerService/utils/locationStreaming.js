// streamer.js
const redis = require('../config/redis'); // singleton instance

async function writeToStream(lat, lon , workerId) {
  try {
    await redis.xadd(
      'delivery_stream',
      '*',
      'agentId', 'agent123',
      'workerId', workerId,
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
