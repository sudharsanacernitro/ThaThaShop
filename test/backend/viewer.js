const Redis = require('ioredis');
const redis = new Redis();

async function readStream(lastId = '$') {
  try {
    while (true) {
      const streams = await redis.xread('BLOCK', 0, 'STREAMS', 'delivery_stream', lastId);

      if (streams) {
        const [stream, messages] = streams[0];
        for (const [id, fields] of messages) {
          const data = {};
          for (let i = 0; i < fields.length; i += 2) {
            data[fields[i]] = fields[i + 1];
          }

          console.log(`📍 New update from ${data.agentId} @ ${data.lat},${data.lng} - ${data.timestamp}`);
          lastId = id;
        }
      }
    }
  } catch (err) {
    console.error('Error reading from Redis stream:', err);
    setTimeout(() => readStream(lastId), 1000); // retry
  }
}


readStream('$');  // Start from beginning, or use '$' for new only
