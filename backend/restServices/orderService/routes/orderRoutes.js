const express = require('express');
const router = express.Router();
const { placeOrder ,getOrdersByUserId ,displayOrder} = require('../controllers/orderController');

const userAuthenticateToken = require('../middleware/userAuth');
const adminAuthenticateToken = require('../middleware/adminAuth');

router.post('/placeOrder', userAuthenticateToken,placeOrder);
router.get('/getOrdersByUserId',adminAuthenticateToken,  getOrdersByUserId);
router.post('/displayOrder', displayOrder);

module.exports = router;
