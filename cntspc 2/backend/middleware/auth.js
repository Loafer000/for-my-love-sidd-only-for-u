const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT Token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Check if user is landlord
const isLandlord = (req, res, next) => {
  if (req.user.userType !== 'landlord') {
    return res.status(403).json({ message: 'Access denied. Landlord only.' });
  }
  next();
};

// Check if user is tenant
const isTenant = (req, res, next) => {
  if (req.user.userType !== 'tenant') {
    return res.status(403).json({ message: 'Access denied. Tenant only.' });
  }
  next();
};

module.exports = { auth, isLandlord, isTenant };