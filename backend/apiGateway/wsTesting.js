const WebSocket = require('ws');

function startWebSocketServer(port = 8080) {
  const wss = new WebSocket.Server({ port });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.send('Welcome client!');

    ws.on('message', (message) => {
      console.log('Received:', message);
      ws.send(`Echo: ${message}`);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  console.log(`WebSocket server running on ws://localhost:${port}`);
}

module.exports = startWebSocketServer;
