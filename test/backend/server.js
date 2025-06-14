const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 4000 });
const {writeToStream}=require('./streamer');

wss.on('connection', (ws) => {
  console.log('🚛 Vehicle connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log('📥 Received GPS:', data);

    writeToStream(data.lat,data.lng);
    
  });

  ws.on('close', () => console.log('❌ Vehicle disconnected'));
});
