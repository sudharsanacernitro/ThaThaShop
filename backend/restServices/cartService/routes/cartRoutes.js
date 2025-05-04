const express = require('express');
const router = express.Router();
const { addToCart, deleteFromCart, listCartItems } = require('../controllers/cartController');
const authenticateToken = require('../middleware/auth');

router.post('/add', authenticateToken,addToCart);
router.post('/del', authenticateToken, deleteFromCart);
router.get('/list', authenticateToken, listCartItems);


module.exports = router;
