const jwt = require('jsonwebtoken');


const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  console.log("Token from cookies:", req.cookies);
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if(req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(401).json({ message: 'Invalid token' });

  }

};

module.exports = authenticateToken;