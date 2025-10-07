const jwt = require('jsonwebtoken');
const { User } = require('../models');
const SecurityValidator = require('../security/validator');
const securityConfig = require('../security/config');

// Authenticate user (required)
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        code: 'TOKEN_MISSING'
      });
    }

    // Validate JWT format before verification
    if (!SecurityValidator.validateJWTFormat(token)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }

    // Verify token with enhanced error handling
    const decoded = jwt.verify(token, process.env.JWT_SECRET || securityConfig.JWT_SECRET);

    // Check token expiration
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password -refreshTokens');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid. User not found.',
        code: 'USER_NOT_FOUND'
      });
    }

    // Enhanced account status checks
    if (user.isDeleted || user.status === 'suspended' || user.status === 'banned') {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated or suspended',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    // Check for suspicious login patterns
    const currentTime = new Date();
    const lastLogin = user.lastLoginAt;
    if (lastLogin && (currentTime - lastLogin) < 1000) { // Less than 1 second
      console.warn(`🚨 Suspicious rapid login detected: ${user.email}`);
    }

    // Update last seen
    user.lastSeenAt = currentTime;
    await user.save({ validateBeforeSave: false });

    // Add user to request object with security context
    req.user = user;
    req.authContext = {
      tokenIssuedAt: decoded.iat,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip || req.connection.remoteAddress
    };

    // Log successful authentication for security monitoring
    console.log(`🔐 Authentication successful: ${user.email} from ${req.ip || 'unknown IP'}`);

    next();
  } catch (error) {
    console.error('Authentication error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Optional authentication (user can be null)
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.userId).select('-password -refreshTokens');

    if (user && !user.isDeleted) {
      req.user = user;
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user
    req.user = null;
    next();
  }
};

// Authorize specific user types
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!roles.includes(req.user.userType)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Required role: ${roles.join(' or ')}`
    });
  }

  next();
};

// Check if user owns the resource
const checkOwnership = (Model, param = 'id', ownerField = 'owner') => async (req, res, next) => {
  try {
    const resourceId = req.params[param];
    const resource = await Model.findById(resourceId);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check ownership
    const ownerId = typeof resource[ownerField] === 'object'
      ? resource[ownerField].toString()
      : resource[ownerField];

    if (ownerId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    }

    // Add resource to request for use in controller
    req.resource = resource;
    next();
  } catch (error) {
    console.error('Ownership check error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization failed'
    });
  }
};

// Check if user is verified
const requireVerification = (type = 'email') => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const isVerified = type === 'email'
    ? req.user.emailVerified
    : req.user.phoneVerified;

  if (!isVerified) {
    return res.status(403).json({
      success: false,
      message: `${type} verification required`,
      code: 'VERIFICATION_REQUIRED',
      verificationType: type
    });
  }

  next();
};

// Check if user account is complete
const requireCompleteProfile = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const requiredFields = ['firstName', 'lastName', 'phone', 'email'];
  const missingFields = requiredFields.filter((field) => !req.user[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Complete your profile to continue',
      code: 'INCOMPLETE_PROFILE',
      missingFields
    });
  }

  next();
};

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  checkOwnership,
  requireVerification,
  requireCompleteProfile
};
