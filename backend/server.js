const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config({ path: './.env' });

// Import database connection
const connectDB = require('./config/database');

// Import security configurations
const { EnvironmentValidator } = require('./security/environment');
const securityConfig = require('./security/config');
const {
  securityHeaders,
  sqlInjectionProtection,
  xssProtection,
  validateInput,
  csrfProtection
} = require('./middleware/security');

// Import routes - Step 4 Implementation
// Individual route imports removed, using centralized routing

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Initialize Express app
const app = express();

// Validate environment variables first (CRITICAL for production)
console.log('\n🔐 STARTING SECURITY VALIDATION...\n');
const validation = EnvironmentValidator.validate();
if (!validation.valid && process.env.NODE_ENV === 'production') {
  console.error('🚨 CRITICAL: Environment validation failed in production!');
  process.exit(1);
}

// Connect to database
if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('your-connection-string')) {
  connectDB();
} else {
  console.log('⚠️  Database connection skipped - using Atlas connection later');
}

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\''],
      styleSrc: ['\'self\'', '\'unsafe-inline\'', 'https://fonts.googleapis.com'],
      fontSrc: ['\'self\'', 'https://fonts.gstatic.com'],
      imgSrc: ['\'self\'', 'data:', 'https://res.cloudinary.com', 'https://maps.googleapis.com'],
      scriptSrc: ['\'self\'']
    }
  }
}));

// CORS configuration - Allow all localhost ports in development
const corsOptions = {
  origin(origin, callback) {
    // In development, allow all localhost origins
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow all localhost origins in development
      if (origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
    }

    // For production, use specific allowed origins
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003'
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Enhanced security middleware (CRITICAL for production)
app.use(securityHeaders);
app.use(sqlInjectionProtection);
app.use(xssProtection);
app.use(validateInput);
app.use(csrfProtection);

// Session configuration with MongoDB store
app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/connectspace'
  }),
  ...securityConfig.SESSION_CONFIG
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

app.use('/api/', limiter);

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ConnectSpace API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: require('./package.json').version
  });
});

// API Routes - Step 4 Implementation
const apiRoutes = require('./routes/index');

app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ConnectSpace API',
    version: require('./package.json').version,
    documentation: '/api/health'
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 ConnectSpace Server Running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV}
📊 Health Check: http://localhost:${PORT}/api/health
📝 API Base: http://localhost:${PORT}/api
⏰ Started at: ${new Date().toLocaleString()}
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated successfully');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  console.log('💥 Unhandled Promise Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
