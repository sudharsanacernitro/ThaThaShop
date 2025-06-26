const express = require('express');
const router = express.Router();
const { placeOrder ,getOrdersByUserId ,displayOrder ,updateOrder,myOrder} = require('../controllers/orderController');

const userAuthenticateToken = require('../middleware/userAuth');
const adminAuthenticateToken = require('../middleware/adminAuth');

//admin routes
router.get('/getOrdersByUserId',adminAuthenticateToken,  getOrdersByUserId);
router.post('/displayOrder', displayOrder);
router.post('/updateOrder', updateOrder);


// client(user) routes

router.post('/placeOrder', userAuthenticateToken,placeOrder);
router.post('/myorder',userAuthenticateToken,)

module.exports = router;
