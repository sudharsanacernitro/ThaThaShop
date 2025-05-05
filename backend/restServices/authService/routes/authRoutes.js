const express = require('express');
const router = express.Router();
const { login, signup, logout , verifyEmail} = require('../controllers/authController');

router.post('/login', login);
router.post('/register', signup);
router.post('/logout', logout);
router.get('/verifyEmail/:userId', verifyEmail);

module.exports = router;
