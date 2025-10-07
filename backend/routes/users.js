const express = require('express');

const router = express.Router();
const { body, param } = require('express-validator');
const multer = require('multer');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

// Multer configuration for file uploads
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @desc    Test user routes
// @route   GET /api/users/test
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'User routes working!',
    availableRoutes: [
      'GET    /api/users/profile',
      'PUT    /api/users/profile',
      'POST   /api/users/upload-avatar',
      'GET    /api/users/properties',
      'PUT    /api/users/change-password',
      'GET    /api/users/:id'
    ]
  });
});

// Validation rules
const updateProfileValidation = [
  body('firstName').optional().trim().isLength({ min: 1 })
    .withMessage('First name is required'),
  body('lastName').optional().trim().isLength({ min: 1 })
    .withMessage('Last name is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number is required'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters')
];

const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Routes
router.get('/profile', authenticate, userController.getUserProfile);
router.put('/profile', authenticate, updateProfileValidation, validateRequest, userController.updateUserProfile);
router.post('/upload-avatar', authenticate, upload.single('avatar'), userController.uploadProfilePhoto);
router.get('/properties', authenticate, userController.getUserProperties);
router.put('/change-password', authenticate, changePasswordValidation, validateRequest, userController.changePassword);
router.get('/:id', param('id').isMongoId().withMessage('Valid user ID required'), validateRequest, userController.getUserById);

module.exports = router;
