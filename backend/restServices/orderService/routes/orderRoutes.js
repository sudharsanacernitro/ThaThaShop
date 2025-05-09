const express = require('express');
const router = express.Router();
const { placeOrder } = require('../controllers/orderController');

const authenticateToken = require('../middleware/auth');

router.post('/placeOrder', authenticateToken,placeOrder);
// router.get('/id/:id', authenticateToken, getProductById);

module.exports = router;
