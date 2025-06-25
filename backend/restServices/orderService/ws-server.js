const WebSocket = require('ws');

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

module.exports={broadcast}