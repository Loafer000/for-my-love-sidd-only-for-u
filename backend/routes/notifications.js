const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

// @desc    Test notification routes
// @route   GET /api/notifications/test
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Notification routes working!',
    availableRoutes: [
      'POST   /api/notifications/sms',
      'POST   /api/notifications/email', 
      'GET    /api/notifications/history',
    ],
  });
});

// Validation rules
const smsValidation = [
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('message').notEmpty().withMessage('Message content is required'),
  body('type').optional().isIn(['general', 'booking_confirmation', 'payment_reminder']).withMessage('Invalid notification type')
];

const emailValidation = [
  body('to').isEmail().withMessage('Valid email address is required'),
  body('subject').notEmpty().withMessage('Email subject is required'),
  body('htmlContent').optional().notEmpty().withMessage('Email content is required'),
  body('textContent').optional().notEmpty().withMessage('Email content is required'),
  body('type').optional().isIn(['general', 'booking_confirmation', 'payment_receipt']).withMessage('Invalid notification type')
];

// Routes
router.post('/sms', authenticate, smsValidation, validateRequest, notificationController.sendSMSNotification);
router.post('/email', authenticate, emailValidation, validateRequest, notificationController.sendEmailNotification);
router.get('/history', authenticate, notificationController.getNotificationHistory);

module.exports = router;