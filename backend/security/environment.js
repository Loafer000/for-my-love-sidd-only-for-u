// Environment Variables Security Check
require('dotenv').config();

const requiredEnvVars = {
  // Database
  MONGODB_URI: {
    required: true,
    description: 'MongoDB connection string',
    secure: true
  },

  // Authentication & Security
  JWT_SECRET: {
    required: true,
    description: 'JWT signing secret',
    secure: true,
    minLength: 32
  },
  JWT_REFRESH_SECRET: {
    required: true,
    description: 'JWT refresh token secret',
    secure: true,
    minLength: 32
  },
  SESSION_SECRET: {
    required: true,
    description: 'Session signing secret',
    secure: true,
    minLength: 32
  },
  ENCRYPTION_KEY: {
    required: true,
    description: 'AES encryption key',
    secure: true,
    minLength: 64
  },

  // Email Configuration
  EMAIL_USER: {
    required: true,
    description: 'Email service username',
    secure: false
  },
  EMAIL_PASS: {
    required: true,
    description: 'Email service password',
    secure: true
  },
  EMAIL_FROM: {
    required: true,
    description: 'From email address',
    secure: false
  },

  // Payment Gateway
  STRIPE_SECRET_KEY: {
    required: true,
    description: 'Stripe secret key',
    secure: true
  },
  STRIPE_WEBHOOK_SECRET: {
    required: true,
    description: 'Stripe webhook secret',
    secure: true
  },

  // File Storage
  CLOUDINARY_CLOUD_NAME: {
    required: false,
    description: 'Cloudinary cloud name',
    secure: false
  },
  CLOUDINARY_API_KEY: {
    required: false,
    description: 'Cloudinary API key',
    secure: false
  },
  CLOUDINARY_API_SECRET: {
    required: false,
    description: 'Cloudinary API secret',
    secure: true
  },

  // Application
  NODE_ENV: {
    required: true,
    description: 'Application environment',
    secure: false,
    allowedValues: ['development', 'production', 'test']
  },
  PORT: {
    required: false,
    description: 'Application port',
    secure: false,
    default: '5000'
  },
  FRONTEND_URL: {
    required: true,
    description: 'Frontend application URL',
    secure: false
  },

  // Security Configuration
  BCRYPT_ROUNDS: {
    required: false,
    description: 'BCrypt hashing rounds',
    secure: false,
    default: '12'
  },
  JWT_EXPIRE: {
    required: false,
    description: 'JWT token expiration',
    secure: false,
    default: '24h'
  },
  JWT_REFRESH_EXPIRE: {
    required: false,
    description: 'JWT refresh token expiration',
    secure: false,
    default: '7d'
  }
};

class EnvironmentValidator {
  static validate() {
    const results = {
      valid: true,
      errors: [],
      warnings: [],
      missing: [],
      insecure: []
    };

    console.log('\n🔐 ENVIRONMENT SECURITY VALIDATION\n');
    console.log('=====================================\n');

    Object.entries(requiredEnvVars).forEach(([key, config]) => {
      const value = process.env[key];
      const hasValue = value !== undefined && value !== '';

      // Check required variables
      if (config.required && !hasValue) {
        results.errors.push(`❌ Missing required environment variable: ${key}`);
        results.missing.push(key);
        results.valid = false;
      }

      // Use default if not set
      if (!hasValue && config.default) {
        process.env[key] = config.default;
        results.warnings.push(`⚠️  Using default value for ${key}: ${config.default}`);
      }

      if (hasValue) {
        // Check minimum length for secure variables
        if (config.minLength && value.length < config.minLength) {
          results.errors.push(`❌ ${key} must be at least ${config.minLength} characters long`);
          results.valid = false;
        }

        // Check allowed values
        if (config.allowedValues && !config.allowedValues.includes(value)) {
          results.errors.push(`❌ ${key} must be one of: ${config.allowedValues.join(', ')}`);
          results.valid = false;
        }

        // Check for insecure values
        if (config.secure) {
          const insecurePatterns = [
            /^(test|example|demo|sample|default)$/i,
            /^(123|password|secret|key)$/i,
            /^[a-zA-Z]{1,10}$/, // Too simple
            /^[0-9]{1,10}$/ // Only numbers
          ];

          if (insecurePatterns.some((pattern) => pattern.test(value))) {
            results.warnings.push(`⚠️  ${key} appears to use an insecure/default value`);
            results.insecure.push(key);
          }
        }

        // Display status
        const status = config.secure
          ? `✓ ${key}: ${value.substring(0, 4)}${'*'.repeat(Math.max(0, value.length - 4))}`
          : `✓ ${key}: ${value}`;
        console.log(status);
      } else if (!config.required) {
        console.log(`- ${key}: (optional, not set)`);
      }
    });

    // Additional security checks
    this.checkProductionSecurity(results);
    this.displayResults(results);

    return results;
  }

  static checkProductionSecurity(results) {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      console.log('\n🏭 PRODUCTION SECURITY CHECKS\n');
      console.log('===============================\n');

      // Check for development values in production
      const devPatterns = [
        { key: 'FRONTEND_URL', pattern: /localhost|127\.0\.0\.1/ },
        { key: 'MONGODB_URI', pattern: /localhost|127\.0\.0\.1/ }
      ];

      devPatterns.forEach(({ key, pattern }) => {
        const value = process.env[key];
        if (value && pattern.test(value)) {
          results.errors.push(`❌ PRODUCTION: ${key} should not contain localhost/127.0.0.1`);
          results.valid = false;
        }
      });

      // Check SSL/HTTPS requirements
      if (process.env.FRONTEND_URL && !process.env.FRONTEND_URL.startsWith('https://')) {
        results.warnings.push('⚠️  PRODUCTION: FRONTEND_URL should use HTTPS');
      }

      // Check secure cookie settings
      if (!process.env.SECURE_COOKIES || process.env.SECURE_COOKIES !== 'true') {
        results.warnings.push('⚠️  PRODUCTION: Consider setting SECURE_COOKIES=true');
      }
    }
  }

  static displayResults(results) {
    console.log('\n📊 VALIDATION RESULTS\n');
    console.log('=====================\n');

    if (results.valid) {
      console.log('✅ Environment validation PASSED\n');
    } else {
      console.log('❌ Environment validation FAILED\n');
    }

    if (results.errors.length > 0) {
      console.log('🚨 ERRORS (must fix):');
      results.errors.forEach((error) => console.log(`  ${error}`));
      console.log('');
    }

    if (results.warnings.length > 0) {
      console.log('⚠️  WARNINGS (should fix):');
      results.warnings.forEach((warning) => console.log(`  ${warning}`));
      console.log('');
    }

    if (results.insecure.length > 0) {
      console.log('🔓 INSECURE VALUES DETECTED:');
      console.log('  These environment variables may be using default or insecure values:');
      results.insecure.forEach((key) => {
        const config = requiredEnvVars[key];
        console.log(`  - ${key}: ${config.description}`);
      });
      console.log('');
    }

    if (results.missing.length > 0) {
      console.log('📋 MISSING REQUIRED VARIABLES:');
      results.missing.forEach((key) => {
        const config = requiredEnvVars[key];
        console.log(`  - ${key}: ${config.description}`);
      });
      console.log('');
    }

    console.log('💡 SECURITY RECOMMENDATIONS:\n');
    console.log('1. Use strong, randomly generated secrets (32+ characters)');
    console.log('2. Never commit .env files to version control');
    console.log('3. Use different secrets for different environments');
    console.log('4. Rotate secrets regularly in production');
    console.log('5. Use environment-specific configuration management');
    console.log('6. Enable HTTPS in production');
    console.log('7. Use secure session and cookie settings\n');
  }

  static generateSecrets() {
    const crypto = require('crypto');

    console.log('\n🔑 GENERATED SECURE SECRETS\n');
    console.log('Copy these to your .env file:\n');
    console.log('# Authentication & Security');
    console.log(`JWT_SECRET=${crypto.randomBytes(64).toString('hex')}`);
    console.log(`JWT_REFRESH_SECRET=${crypto.randomBytes(64).toString('hex')}`);
    console.log(`SESSION_SECRET=${crypto.randomBytes(64).toString('hex')}`);
    console.log(`ENCRYPTION_KEY=${crypto.randomBytes(32).toString('hex')}`);
    console.log('');
    console.log('# Security Configuration');
    console.log('BCRYPT_ROUNDS=12');
    console.log('JWT_EXPIRE=24h');
    console.log('JWT_REFRESH_EXPIRE=7d');
    console.log('SECURE_COOKIES=true');
    console.log('');
  }
}

// Auto-validate on require
const validation = EnvironmentValidator.validate();

// Exit if critical errors in production
if (!validation.valid && process.env.NODE_ENV === 'production') {
  console.error('\n🚨 CRITICAL: Environment validation failed in production!');
  console.error('Application cannot start with missing or invalid configuration.');
  process.exit(1);
}

module.exports = {
  EnvironmentValidator,
  validation,
  requiredEnvVars
};
