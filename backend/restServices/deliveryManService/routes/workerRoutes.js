const express = require('express');
const router = express.Router();
const { updateLocation } = require('../controllers/workerController');
const authenticateToken = require('../middleware/auth');

router.post('/updateLocation', authenticateToken,updateLocation);



module.exports = router;
