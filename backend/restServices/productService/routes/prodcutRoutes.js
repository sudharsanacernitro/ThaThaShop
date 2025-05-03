const express = require('express');
const router = express.Router();
const { getProductsByCategory,getProductById} = require('../controllers/prodcutController');

const authenticateToken = require('../middleware/auth');

router.post('/list', authenticateToken,getProductsByCategory);
router.get('/id/:id', authenticateToken, getProductById);

module.exports = router;
