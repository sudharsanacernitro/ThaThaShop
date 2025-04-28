const User = require('./models/user');

// Pure login function
async function login(email, password) {
  try {

    console.log(email, password);
    
    const user = await User.findOne({ email, password });

    if (user) {
      console.log("User found");
      return { success: true, message: "Login successful", user: { email: user.email, id: user._id } };
    } else {
      console.log("User not found");

      return { success: false, message: "Invalid email or password" };
    }
  } catch (err) {
    console.log("Error found");
    console.error(err);
    return { success: false, message: err.message };
  }
}

// Pure signup function
async function signup(userData) {
  try {
    const user = await User.create(userData);
    return { success: true, message: "Signup successful", user: { email: user.email, id: user._id } };
  } catch (err) {
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
