const express = require('express');

const router = express.Router();
const { body, param } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

// @desc    Test booking routes
// @route   GET /api/bookings/test
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Booking routes working!',
    availableRoutes: [
      'GET    /api/bookings',
      'GET    /api/bookings/:id',
      'POST   /api/bookings',
      'PUT    /api/bookings/:id/status',
      'POST   /api/bookings/:id/cancel'
    ]
  });
});

// Validation rules
const createBookingValidation = [
  body('propertyId').isMongoId().withMessage('Valid property ID is required'),
  body('bookingType').isIn(['inquiry', 'booking', 'visit']).withMessage('Invalid booking type'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('moveInDate').optional().isISO8601().withMessage('Valid move-in date required'),
  body('visitDate').optional().isISO8601().withMessage('Valid visit date required'),
  body('visitTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required (HH:MM)')
];

const updateStatusValidation = [
  param('id').isMongoId().withMessage('Valid booking ID is required'),
  body('status').isIn(['pending', 'approved', 'rejected', 'confirmed', 'cancelled']).withMessage('Invalid status')
];

// Routes
router.get('/', authenticate, bookingController.getUserBookings);
router.get('/:id', authenticate, bookingController.getBookingById);
router.post('/', optionalAuth, createBookingValidation, validateRequest, bookingController.createBooking);
router.put('/:id/status', authenticate, updateStatusValidation, validateRequest, bookingController.updateBookingStatus);
router.post('/:id/cancel', authenticate, bookingController.cancelBooking);

module.exports = router;
