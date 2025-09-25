const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Generate refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken
};