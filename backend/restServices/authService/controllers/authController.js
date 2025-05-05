const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const {sendEmailMessage} = require('../utils/emailHandler');

// Login controller
async function login(req, res) {
  const { email, password } = req.body;
  console.log("Login called");
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 3600000
    });

    const emailPayload = {
      to: user.email,
      subject: 'Login Notification',
      text: 'You have successfully logged in.',
      html: `<p>You have successfully logged in.</p>`,
    };
    
    sendEmailMessage(emailPayload);

    return res.status(200).json({ success: true, token:token });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

// Signup controller
async function signup(req, res) {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: { email: user.email, id: user._id }
    });
  } catch (err) {
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
  logout
};
