const express = require('express');

const {createProxyBreakerMiddleware} = require('./utils/breaker');
const { AUTH_SERVICE_URL, PRODUCT_SERVICE_URL, CART_SERVICE_URL, ORDER_SERVICE_URL, WORKER_SERVICE_URL } = require('./config/services.config');

// const errorHandler = require('./utils/errorHandler');
// const rateLimiter = require('./middlewares/rateLimit');
// const authenticate = require('./middlewares/auth');
const app = express();
const cors = require('cors');

app.set('trust proxy', 1); // Or 'loopback', or true

const cookieParser = require('cookie-parser');
app.use(cookieParser());
require('./utils/secretsLoader');

const path=require('path');
app.use(express.static(path.join(__dirname, 'public')));



app.use(cors({
  origin: ['http://localhost:3000','https://frontend.localhost'], // Replace with your frontend URL
  credentials: true,
}));

app.use('/auth', createProxyBreakerMiddleware(AUTH_SERVICE_URL+'/auth'));
app.use('/product', createProxyBreakerMiddleware(PRODUCT_SERVICE_URL+'/product'));
app.use('/cart', createProxyBreakerMiddleware(CART_SERVICE_URL+'/cart'));
app.use('/order', createProxyBreakerMiddleware(ORDER_SERVICE_URL+'/order'));
app.use('/worker', createProxyBreakerMiddleware(WORKER_SERVICE_URL+'/worker'));


const http = require('http');
const server = http.createServer(app);
const { createProxyServer } = require('http-proxy');
const wsProxy = createProxyServer({ ws: true });

server.on('upgrade', (req, socket, head) => {
  const pathname = req.url;

  if (pathname.startsWith('/ws/client')) {
    wsProxy.ws(req, socket, head, { target: 'http://orderservice:8080' });
  }else {
    socket.destroy(); // Unknown WS path
  }

  console.log("websocket proxy called");

});




const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Gateway running on http://localhost:${PORT}`);
});