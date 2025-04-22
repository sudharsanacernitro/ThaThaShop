const express = require('express');
const router = express.Router();
const path = require('path');


const User = require('../models/userModel');


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("/login endpoint called");
    try {

      const user = await User.findOne({ email,password });

      if (user) {
        req.session.loggedIn = true;
        req.session.email = email;
        res.sendStatus(200);
      } 
      else {
        res.sendStatus(400);
      }

    } catch (err) {
      res.status(500).json({ error: err.message });
    }

 
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
