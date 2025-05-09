const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const {sendEmailMessage} = require('../utils/emailHandler');
const { logging } = require('../utils/logging');
const { logLevel } = require('kafkajs');


// Login controller
async function login(req, res) {
  const { email, password } = req.body;
  console.log("Login called");
  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password) )) {

      logging({ message: `[Login failed]${email}- Invalid username or password`,logLevel: 1});
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if(user.isVerified === false) {
      logging({ message: `[Login failed]${email}- user not verified`,logLevel: 1});
      return res.status(401).json({ success: false, message: "Email not verified" });
    }


    const token = jwt.sign(
      { id: user._id, email: user.email , role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 3600000
    });

    logging({ message: `[Login success]${email}- ${user._id}`,logLevel: 0});
    return res.status(200).json({ success: true ,userRole:user.role});

  } catch (err) {

    logging({ message: `[Login failed]${email}- ${err.message}`,logLevel: 2});
    return res.status(500).json({ success: false, message: err.message });

  }
}

// Signup controller
async function signup(req, res) {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    const verificationLink = `http://localhost:5000/auth/verifyEmail/${user._id}`;
    const emailPayload = {
      to: user.email,
      subject: 'Email Verification',
      text: 'Please verify your email address.',
      html: `
      <h2>Welcome to ThaThaShop!</h2>
      <p>Please verify your email by clicking the button below:</p>
      <a href="${verificationLink}" style="padding:10px 20px; background:#4CAF50; color:white; text-decoration:none;">Verify Email</a>
      <p>If the button doesn't work, click or paste this link in your browser:</p>
      <p>${verificationLink}</p>
    `
    };
    
    sendEmailMessage(emailPayload);
    
    logging({ message: `[Signup success]${email}- ${user._id}`,logLevel: 0});
    return res.status(201).json({
      success: true,
      message: 'Signup successful. Verification email sent.',
    });

  } catch (err) {
    logging({ message: `[Signup failed]${email}- ${err.message}`,logLevel: 2});
    return res.status(500).json({ success: false, message: err.message });
  }
}

// Email verification controller
async function verifyEmail(req, res) {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.isVerified = true;
    await user.save();
    return res.status(200).redirect('http://localhost:3000/login'); 
  }
  catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }         

}

// Logout controller
function logout(req, res) {
  return res.status(200).json({ success: true, message: "Logout successful" });
}

module.exports = {
  login,
  signup,
  verifyEmail,
  logout
};
