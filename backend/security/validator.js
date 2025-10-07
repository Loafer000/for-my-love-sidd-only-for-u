// Enhanced Input Validation and Security Utilities
const validator = require('validator');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

class SecurityValidator {
  // Sanitize and validate user inputs
  static sanitizeInput(input, type = 'string') {
    if (typeof input !== 'string') {
      input = String(input);
    }

    // Basic XSS protection
    input = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    input = input.replace(/javascript:/gi, '');
    input = input.replace(/on\w+\s*=/gi, '');

    switch (type) {
    case 'email':
      return validator.isEmail(input) ? validator.normalizeEmail(input) : null;
    case 'password': {
      // Password must be at least 8 chars, contain uppercase, lowercase, number, special char
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(input) ? input : null;
    }
    case 'phone':
      return validator.isMobilePhone(input) ? input : null;
    case 'alphanumeric':
      return validator.isAlphanumeric(input) ? input : null;
    default:
      return validator.escape(input);
    }
  }

  // Validate property data
  static validateProperty(propertyData) {
    const errors = [];

    if (!propertyData.title || propertyData.title.length < 3) {
      errors.push('Property title must be at least 3 characters');
    }

    if (!propertyData.price || propertyData.price < 0) {
      errors.push('Property price must be a positive number');
    }

    if (!propertyData.location || propertyData.location.length < 5) {
      errors.push('Property location must be at least 5 characters');
    }

    if (propertyData.email && !validator.isEmail(propertyData.email)) {
      errors.push('Invalid email format');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized: {
        title: this.sanitizeInput(propertyData.title),
        description: this.sanitizeInput(propertyData.description),
        location: this.sanitizeInput(propertyData.location),
        price: parseFloat(propertyData.price),
        email: propertyData.email ? this.sanitizeInput(propertyData.email, 'email') : null
      }
    };
  }

  // Rate limiting configurations
  static createRateLimit(windowMs = 15 * 60 * 1000, max = 100) {
    return rateLimit({
      windowMs,
      max,
      message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      },
      standardHeaders: true,
      legacyHeaders: false
    });
  }

  // Security headers configuration
  static securityHeaders() {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ['\'self\''],
          styleSrc: ['\'self\'', '\'unsafe-inline\'', 'https://fonts.googleapis.com'],
          fontSrc: ['\'self\'', 'https://fonts.gstatic.com'],
          imgSrc: ['\'self\'', 'data:', 'https:'],
          scriptSrc: ['\'self\''],
          connectSrc: ['\'self\''],
          frameSrc: ['\'none\''],
          objectSrc: ['\'none\''],
          upgradeInsecureRequests: []
        }
      },
      crossOriginEmbedderPolicy: false
    });
  }

  // Check for SQL injection patterns - FIXED REGEX
  static detectSQLInjection(input) {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/i,
      /('|\\')|(;)|(--)|(\b(OR|AND)\b.*=)/i,
      /(\b(xp_|sp_|cmd|shell|exec)\b)/i
    ];

    return sqlPatterns.some((pattern) => pattern.test(input));
  }

  // Validate JWT token format (without verifying signature - that's done in auth middleware)
  static validateJWTFormat(token) {
    if (!token) return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    try {
      // Check if header and payload are valid base64
      JSON.parse(Buffer.from(parts[0], 'base64url'));
      JSON.parse(Buffer.from(parts[1], 'base64url'));
      return true;
    } catch {
      return false;
    }
  }

  // File upload validation
  static validateFileUpload(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
      return { valid: false, error: 'Invalid file type. Only JPEG, JPG, PNG, and WebP are allowed.' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File too large. Maximum size is 5MB.' };
    }

    return { valid: true };
  }
}

module.exports = SecurityValidator;
