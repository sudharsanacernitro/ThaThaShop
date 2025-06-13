const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 4000 });

wss.on('connection', (ws) => {
  console.log('🚛 Vehicle connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('📥 Received GPS:', data);
    // TODO: store in Redis or broadcast to clients
  });

  ws.on('close', () => console.log('❌ Vehicle disconnected'));
});
