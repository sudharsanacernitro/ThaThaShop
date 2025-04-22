const express = require('express');
const router = express.Router();
const path = require('path');


const User = require('../models/userModel');


router.post('/signup', async (req, res) => {


    
   try {
       const user = await User.create(req.body);
       res.status(200).json(user);
     } catch (err) {

        console.log(err.message);
       res.status(400).json({ error: err.message });
     }

 
});



module.exports = router;
