const express = require('express');
const router = express.Router();

// @desc    Test property routes
// @route   GET /api/properties/test
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Property routes working!',
    availableRoutes: [
      'GET    /api/properties',
      'GET    /api/properties/:id',
      'POST   /api/properties',
      'PUT    /api/properties/:id',
      'DELETE /api/properties/:id',
      'GET    /api/properties/search',
      'POST   /api/properties/:id/images',
      'DELETE /api/properties/:id/images/:imageId',
    ],
  });
});

// Step 4 Implementation - Property routes
const { body, query } = require('express-validator');
const propertyController = require('../controllers/propertyController');
const { validateRequest } = require('../middleware/validation');
const { authenticate, optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/', optionalAuth, propertyController.getProperties);
router.get('/featured', propertyController.getFeaturedProperties);
router.get('/search', propertyController.searchProperties);
router.get('/nearby', 
  [
    query('longitude').isFloat().withMessage('Valid longitude is required'),
    query('latitude').isFloat().withMessage('Valid latitude is required')
  ],
  validateRequest,
  propertyController.findNearbyProperties
);
router.get('/:id', optionalAuth, propertyController.getPropertyById);

// Protected routes
router.post('/', authenticate, propertyController.createProperty);
router.put('/:id', authenticate, propertyController.updateProperty);
router.delete('/:id', authenticate, propertyController.deleteProperty);
router.get('/my/properties', authenticate, propertyController.getOwnerProperties);

module.exports = router;