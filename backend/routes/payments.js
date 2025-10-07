const express = require('express');

const router = express.Router();

// @desc    Test payment routes
// @route   GET /api/payments/test
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Payment routes working!',
    availableRoutes: [
      'POST   /api/payments/create-order',
      'POST   /api/payments/verify',
      'GET    /api/payments/:id',
      'POST   /api/payments/refund',
      'GET    /api/payments/history'
    ]
  });
});

const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

// Validation rules
const createOrderValidation = [
  body('amount').isNumeric().withMessage('Valid amount is required'),
  body('bookingId').isMongoId().withMessage('Valid booking ID is required'),
  body('propertyId').isMongoId().withMessage('Valid property ID is required')
];

const verifyPaymentValidation = [
  body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Signature is required'),
  body('bookingId').isMongoId().withMessage('Valid booking ID is required')
];

const refundValidation = [
  body('paymentId').notEmpty().withMessage('Payment ID is required'),
  body('amount').isNumeric().withMessage('Valid refund amount is required'),
  body('reason').notEmpty().withMessage('Refund reason is required')
];

// Routes
router.post('/create-order', authenticate, createOrderValidation, validateRequest, paymentController.createPaymentOrder);
router.post('/verify', authenticate, verifyPaymentValidation, validateRequest, paymentController.verifyPayment);
router.get('/history', authenticate, paymentController.getPaymentHistory);
router.post('/refund', authenticate, refundValidation, validateRequest, paymentController.refundPayment);

module.exports = router;
