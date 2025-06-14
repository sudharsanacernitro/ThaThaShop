const Redis = require('ioredis');
const WebSocket = require('ws');
const redis = new Redis();

const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

// Store connected clients
wss.on('connection', (ws) => {
  console.log('🔌 Client connected via WebSocket');
  clients.push(ws);

  ws.on('close', () => {
    console.log('❌ Client disconnected');
    clients = clients.filter(client => client !== ws);
  });
});

// Broadcast to all connected clients
function broadcast(data) {
  const json = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json);
    }
  });
}

// Read Redis stream and broadcast updates
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

readStream('$'); // Start from latest
