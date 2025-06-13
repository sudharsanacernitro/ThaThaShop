const Redis = require('ioredis');
const redis = new Redis();

async function readStream(lastId = '$') {
  while (true) {
    const streams = await redis.xread(
      'BLOCK', 0,              // Wait indefinitely for new data
      'STREAMS', 'delivery_stream', lastId
    );

    if (streams) {
      const [stream, messages] = streams[0];
      for (const [id, fields] of messages) {
        const data = {};
        for (let i = 0; i < fields.length; i += 2) {
          data[fields[i]] = fields[i + 1];
        }
        console.log(`New update from ${data.agentId} @ ${data.lat},${data.lng}`);
        lastId = id;
      }
    }
  }
}

readStream('0');  // Start from beginning, or use '$' for new only
