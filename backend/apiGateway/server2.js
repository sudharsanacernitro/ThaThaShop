const express = require('express');

const {createProxyBreakerMiddleware} = require('./utils/breaker');
const { AUTH_SERVICE_URL, PRODUCT_SERVICE_URL, CART_SERVICE_URL, ORDER_SERVICE_URL, WORKER_SERVICE_URL } = require('./config/services.config');

// const errorHandler = require('./utils/errorHandler');
// const rateLimiter = require('./middlewares/rateLimit');
// const authenticate = require('./middlewares/auth');
const app = express();
const cors = require('cors');




app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/auth', createProxyBreakerMiddleware(AUTH_SERVICE_URL));
app.use('/product', createProxyBreakerMiddleware(PRODUCT_SERVICE_URL));
app.use('/cart', createProxyBreakerMiddleware(CART_SERVICE_URL));
app.use('/order', createProxyBreakerMiddleware(ORDER_SERVICE_URL));
app.use('/worker', createProxyBreakerMiddleware(WORKER_SERVICE_URL));






const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Gateway running on http://localhost:${PORT}`);
});