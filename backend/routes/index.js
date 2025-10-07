const express = require('express');

const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const propertyRoutes = require('./properties');
const bookingRoutes = require('./bookings');
const paymentRoutes = require('./payments');
const uploadRoutes = require('./upload');
const notificationRoutes = require('./notifications');
const chatRoutes = require('./chat');
const reviewRoutes = require('./reviews');
const analyticsRoutes = require('./analytics');
const landlordRoutes = require('./landlord');

// Import new advanced features routes
const financialRoutes = require('./financial');
const maintenanceRoutes = require('./maintenance');
const aiRoutes = require('./ai');
const tenantRoutes = require('./tenant');
const agentRoutes = require('./agent');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ConnectSpace API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API status endpoint
router.get('/status', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'All systems operational',
    services: {
      database: 'connected',
      authentication: 'active',
      fileUpload: 'ready',
      paymentGateway: 'configured'
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/upload', uploadRoutes);
router.use('/notifications', notificationRoutes);
router.use('/chat', chatRoutes);
router.use('/reviews', reviewRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/landlord', landlordRoutes);

// Mount new advanced features routes
router.use('/financial', financialRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/ai', aiRoutes);
router.use('/tenant', tenantRoutes);
router.use('/agent', agentRoutes);

// API documentation endpoint
router.get('/docs', (req, res) => {
  res.status(200).json({
    title: 'ConnectSpace API Documentation',
    version: '1.0.0',
    baseUrl: `${req.protocol}://${req.get('host')}/api`,
    endpoints: {
      authentication: {
        'POST /auth/register': 'User registration',
        'POST /auth/login': 'User login',
        'GET /auth/me': 'Get current user profile',
        'POST /auth/logout': 'User logout',
        'POST /auth/refresh': 'Refresh access token',
        'POST /auth/forgot-password': 'Request password reset',
        'POST /auth/reset-password': 'Reset password',
        'POST /auth/verify-email': 'Verify email address',
        'POST /auth/send-otp': 'Send OTP for phone verification',
        'POST /auth/verify-otp': 'Verify OTP'
      },
      users: {
        'GET /users/profile': 'Get user profile',
        'PUT /users/profile': 'Update user profile',
        'POST /users/upload-avatar': 'Upload profile picture',
        'GET /users/:id': 'Get user by ID',
        'PUT /users/change-password': 'Change password'
      },
      properties: {
        'GET /properties': 'List properties with filters',
        'POST /properties': 'Create new property',
        'GET /properties/:id': 'Get property details',
        'PUT /properties/:id': 'Update property',
        'DELETE /properties/:id': 'Delete property',
        'GET /properties/search': 'Advanced property search',
        'GET /properties/nearby': 'Find nearby properties'
      },
      bookings: {
        'GET /bookings': 'List user bookings',
        'POST /bookings': 'Create new booking',
        'GET /bookings/:id': 'Get booking details',
        'PUT /bookings/:id': 'Update booking',
        'POST /bookings/:id/approve': 'Approve booking (landlord)',
        'POST /bookings/:id/reject': 'Reject booking (landlord)',
        'POST /bookings/:id/cancel': 'Cancel booking'
      },
      payments: {
        'GET /payments': 'List payments',
        'POST /payments/initiate': 'Initiate payment',
        'POST /payments/verify': 'Verify payment',
        'GET /payments/:id': 'Get payment details',
        'POST /payments/:id/refund': 'Process refund'
      },
      upload: {
        'POST /upload/image': 'Upload single image',
        'POST /upload/images': 'Upload multiple images',
        'POST /upload/document': 'Upload document',
        'DELETE /upload/:publicId': 'Delete uploaded file'
      }
    },
    status: 'All endpoints ready for integration'
  });
});

module.exports = router;
