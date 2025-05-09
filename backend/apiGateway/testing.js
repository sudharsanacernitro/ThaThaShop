// hashPassword.js

const bcrypt = require('bcrypt');

// Change this password to anything you want to hash
const plainPassword = '139';
const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    console.log('Plain Password:', password);
    console.log('Hashed Password:', hashed);
  } catch (err) {
    console.error('Error hashing password:', err);
  }
};

hashPassword(plainPassword);
