const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

// const JWT_SECRET="eren139";


async function login(email, password) {
  try {

    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: "Invalid email or password" };
    }

    // const JWT_SECRET = process.env.JWT_SECRET;

    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    return {
      success: true,
      token
      };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

// Pure signup function
async function signup(email, password) {
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    password = hashedPassword;

    const user = await User.create({email: email, password: hashedPassword});

    return {
      success: true,
      message: "Signup successful",
      user: { email: user.email, id: user._id }
    };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  }
}

function logout() {
  // No session to destroy, simply return success
  return { success: true, message: "Logout successful" };
}

module.exports = {
  login,
  signup,
  logout
};
