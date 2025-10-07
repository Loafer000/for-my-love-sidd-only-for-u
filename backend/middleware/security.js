// Enhanced Security Middleware for Critical Endpoints
const SecurityValidator = require('../security/validator');
const securityConfig = require('../security/config');
const rateLimit = require('express-rate-limit');

// SQL Injection Protection
const sqlInjectionProtection = (req, res, next) => {
  const checkFields = ['query', 'params', 'body'];
  
  for (const field of checkFields) {
    if (req[field]) {
      for (const [key, value] of Object.entries(req[field])) {
        if (typeof value === 'string' && SecurityValidator.detectSQLInjection(value)) {
          console.error(`🚨 SQL Injection attempt detected: ${key}=${value} from IP: ${req.ip}`);
          return res.status(400).json({
            success: false,
            message: 'Invalid input detected',
            code: 'SECURITY_VIOLATION'
          });
        }
      }
    }
  }
  next();
};

// XSS Protection
const xssProtection = (req, res, next) => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ];

  const checkObject = (obj) => {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        for (const pattern of xssPatterns) {
          if (pattern.test(value)) {
            console.error(`🚨 XSS attempt detected: ${key}=${value} from IP: ${req.ip}`);
            return false;
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        if (!checkObject(value)) return false;
      }
    }
    return true;
  };

  if (req.body && !checkObject(req.body)) {
    return res.status(400).json({
      success: false,
      message: 'Potentially harmful content detected',
      code: 'XSS_DETECTED'
    });
  }

  next();
};

// Input Validation Middleware
const validateInput = (req, res, next) => {
  // Sanitize common fields
  if (req.body) {
    const sanitizedBody = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'string') {
        sanitizedBody[key] = SecurityValidator.sanitizeInput(value);
      } else {
        sanitizedBody[key] = value;
      }
    }
    req.body = sanitizedBody;
  }
  next();
};

// File Upload Security
const fileUploadSecurity = (req, res, next) => {
  if (req.file) {
    const validation = SecurityValidator.validateFileUpload(req.file);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error,
        code: 'FILE_VALIDATION_FAILED'
      });
    }
  }

  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      const validation = SecurityValidator.validateFileUpload(file);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.error,
          code: 'FILE_VALIDATION_FAILED'
        });
      }
    }
  }

  next();
};

// Rate Limiting Configurations
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
    code: 'RATE_LIMIT_AUTH'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.error(`🚨 Rate limit exceeded for auth: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again in 15 minutes.',
      code: 'RATE_LIMIT_AUTH',
      retryAfter: Math.ceil(15 * 60)
    });
  }
});

const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    code: 'RATE_LIMIT_API'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  message: {
    success: false,
    message: 'Too many file uploads. Please try again in an hour.',
    code: 'RATE_LIMIT_UPLOAD'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Security Headers Middleware
const securityHeaders = (req, res, next) => {
  const headers = securityConfig.getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  next();
};

// CSRF Protection for state-changing operations
const csrfProtection = (req, res, next) => {
  const methods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  
  if (methods.includes(req.method)) {
    const origin = req.headers.origin;
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'https://localhost:3000'
    ];

    if (!origin || !allowedOrigins.includes(origin)) {
      console.error(`🚨 CSRF attempt detected from origin: ${origin} IP: ${req.ip}`);
      return res.status(403).json({
        success: false,
        message: 'CSRF protection: Invalid origin',
        code: 'CSRF_INVALID_ORIGIN'
      });
    }
  }
  next();
};

// IP Whitelist/Blacklist (for admin endpoints)
const ipFilter = (whitelist = [], blacklist = []) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;

    // Check blacklist first
    if (blacklist.length > 0 && blacklist.includes(clientIP)) {
      console.error(`🚨 Blocked IP attempt: ${clientIP}`);
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        code: 'IP_BLOCKED'
      });
    }

    // Check whitelist if defined
    if (whitelist.length > 0 && !whitelist.includes(clientIP)) {
      console.error(`🚨 Non-whitelisted IP attempt: ${clientIP}`);
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        code: 'IP_NOT_WHITELISTED'
      });
    }

    next();
  };
};

module.exports = {
  sqlInjectionProtection,
  xssProtection,
  validateInput,
  fileUploadSecurity,
  authRateLimit,
  apiRateLimit,
  uploadRateLimit,
  securityHeaders,
  csrfProtection,
  ipFilter
};