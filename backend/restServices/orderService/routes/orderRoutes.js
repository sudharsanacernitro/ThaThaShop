const express = require('express');
const router = express.Router();
const { placeOrder ,getOrdersByUserId} = require('../controllers/orderController');

const userAuthenticateToken = require('../middleware/userAuth');
const adminAuthenticateToken = require('../middleware/adminAuth');

router.post('/placeOrder', userAuthenticateToken,placeOrder);
router.get('/getOrdersByUserId',  getOrdersByUserId);

module.exports = router;
