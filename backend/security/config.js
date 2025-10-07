const crypto = require('crypto');
const bcrypt = require('bcryptjs');

class SecurityConfig {
  constructor() {
    // Security constants
    this.JWT_SECRET = process.env.JWT_SECRET || this.generateSecretKey();
    this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || this.generateSecretKey();
    this.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || this.generateEncryptionKey();
    this.BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    
    // Session configuration
    this.SESSION_CONFIG = {
      secret: process.env.SESSION_SECRET || this.generateSecretKey(),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        httpOnly: true, // Prevent XSS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'strict' // CSRF protection
      }
    };

    // CORS configuration
    this.CORS_CONFIG = {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    };

    // Rate limiting
    this.RATE_LIMITS = {
      auth: { windowMs: 15 * 60 * 1000, max: 5 }, // 5 attempts per 15 minutes
      api: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 requests per 15 minutes
      upload: { windowMs: 60 * 60 * 1000, max: 10 } // 10 uploads per hour
    };
  }

  // Generate cryptographically secure secret key
  generateSecretKey(length = 64) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Generate encryption key for AES
  generateEncryptionKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Hash password with bcrypt
  async hashPassword(password) {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    return await bcrypt.hash(password, this.BCRYPT_ROUNDS);
  }

  // Verify password
  async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // Encrypt sensitive data
  encrypt(text) {
    if (!text) return null;
    
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(this.ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  // Decrypt sensitive data
  decrypt(encryptedData) {
    if (!encryptedData) return null;
    
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(this.ENCRYPTION_KEY, 'hex');
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const authTag = Buffer.from(encryptedData.authTag, 'hex');
    
    const decipher = crypto.createDecipher(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // Generate secure token
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Validate environment variables
  validateEnvironment() {
    const required = [
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
      'ENCRYPTION_KEY',
      'SESSION_SECRET',
      'MONGODB_URI'
    ];

    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.warn('⚠️  Missing environment variables:', missing.join(', '));
      console.warn('⚠️  Using generated keys - CHANGE IN PRODUCTION!');
    }

    return missing.length === 0;
  }

  // Security headers
  getSecurityHeaders() {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  }
}

module.exports = new SecurityConfig();