// Read Redis stream and broadcast updates
const redis=require('./config/redis');
const {broadcast} =require('./ws-server');

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

          console.log(`📍 ${data.agentId} @ ${data.lat},${data.lng} - ${data.timestamp}`);
          broadcast(data); // send to all clients
          lastId = id;
        }
      }
    }
  } catch (err) {
    console.error('❗ Error reading from Redis stream:', err);
    setTimeout(() => readStream(lastId), 1000); // Retry
  }
}

module.exports={readStream};