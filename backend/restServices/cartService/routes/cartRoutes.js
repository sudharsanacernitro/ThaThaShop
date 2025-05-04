const express = require('express');
const router = express.Router();
const { getProductsByCategory,getProductById} = require('../controllers/prodcutController');

const authenticateToken = require('../middleware/auth');

router.post('/add', authenticateToken,getProductsByCategory);
router.post('/del', authenticateToken, getProductById);
router.get('/list', authenticateToken, getProductById);


module.exports = router;
