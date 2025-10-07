const express = require('express');

const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { validateRequest } = require('../middleware/validation');
const { rateLimiter } = require('../middleware/rateLimiter');
const { authenticate } = require('../middleware/auth');

// @desc    Test auth routes
// @route   GET /api/auth/test
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes working!',
    availableRoutes: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'POST /api/auth/send-otp',
      'POST /api/auth/verify-otp',
      'POST /api/auth/refresh-token',
      'POST /api/auth/logout',
      'POST /api/auth/forgot-password',
      'POST /api/auth/reset-password',
      'POST /api/auth/verify-email'
    ]
  });
});

// Validation rules
const registerValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid phone number'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase and number'),
  body('userType')
    .isIn(['tenant', 'landlord', 'agent'])
    .withMessage('User type must be tenant, landlord, or agent')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Implemented authentication routes
router.post(
  '/register',
  registerValidation,
  validateRequest,
  authController.register
);

router.post(
  '/login',
  loginValidation,
  validateRequest,
  authController.login
);

router.post(
  '/send-otp',
  body('phone').isMobilePhone('en-IN').withMessage('Please provide a valid phone number'),
  validateRequest,
  authController.sendOTP
);

router.post(
  '/verify-otp',
  [
    body('phone').isMobilePhone('en-IN').withMessage('Please provide a valid phone number'),
    body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be a 6-digit number')
  ],
  validateRequest,
  authController.verifyOTP
);

router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

router.post(
  '/forgot-password',
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  validateRequest,
  authController.forgotPassword
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
  ],
  validateRequest,
  authController.resetPassword
);

router.post(
  '/verify-email',
  body('token').notEmpty().withMessage('Verification token is required'),
  validateRequest,
  authController.verifyEmail
);

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', authenticate, authController.getMe);

module.exports = router;
