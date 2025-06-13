const Redis = require('ioredis');
const redis = new Redis();

async function writeToStream() {
  await redis.xadd(
    'delivery_stream', // Stream name
    '*',               // Auto-generated ID
    'agentId', 'agent123',
    'lat', '11.02',
    'lng', '77.01',
    'timestamp', Date.now().toString()
  );
}

writeToStream();
