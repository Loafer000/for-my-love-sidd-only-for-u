const rateLimit = require('express-rate-limit');

// Create different rate limiters for different endpoints
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Rate limiters for different operations
const rateLimiter = {
  // General authentication (15 requests per 15 minutes)
  auth: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    15,
    'Too many authentication requests, please try again later'
  ),
  
  // Login attempts (5 attempts per 15 minutes)
  login: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5,
    'Too many login attempts, please try again later'
  ),
  
  // Registration (3 attempts per hour)
  register: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    3,
    'Too many registration attempts, please try again later'
  ),
  
  // OTP requests (5 per 10 minutes)
  otp: createRateLimiter(
    10 * 60 * 1000, // 10 minutes
    5,
    'Too many OTP requests, please try again later'
  ),
  
  // Password reset (3 per hour)
  password: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    3,
    'Too many password reset attempts, please try again later'
  ),
  
  // File upload (20 per hour)
  upload: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    20,
    'Too many file upload requests, please try again later'
  ),
  
  // API requests (100 per 15 minutes)
  api: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    100,
    'Too many API requests, please try again later'
  )
};

module.exports = {
  rateLimiter
};