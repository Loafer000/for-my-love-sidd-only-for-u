// Review Routes - Smart Review & Rating System

const express = require('express');
const router = express.Router();
const { 
  createReview, 
  getPropertyReviews, 
  getUserReviews,
  updateReview,
  markHelpful,
  reportReview
} = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');
const { body, param, query, validationResult } = require('express-validator');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Create a new review
router.post('/create',
  authenticate,
  [
    body('bookingId')
      .notEmpty()
      .withMessage('Booking ID is required')
      .isMongoId()
      .withMessage('Invalid booking ID'),
    body('propertyId')
      .notEmpty()
      .withMessage('Property ID is required')
      .isMongoId()
      .withMessage('Invalid property ID'),
    body('revieweeId')
      .notEmpty()
      .withMessage('Reviewee ID is required')
      .isMongoId()
      .withMessage('Invalid reviewee ID'),
    body('reviewType')
      .notEmpty()
      .withMessage('Review type is required')
      .isIn(['property', 'landlord', 'tenant'])
      .withMessage('Invalid review type'),
    body('rating')
      .notEmpty()
      .withMessage('Rating is required')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('reviewText')
      .notEmpty()
      .withMessage('Review text is required')
      .isLength({ min: 10, max: 1000 })
      .withMessage('Review text must be between 10 and 1000 characters'),
    body('reviewAspects')
      .optional()
      .isObject()
      .withMessage('Review aspects must be an object'),
    body('reviewAspects.*')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Aspect ratings must be between 1 and 5')
  ],
  handleValidationErrors,
  createReview
);

// Get reviews for a property
router.get('/property/:propertyId',
  [
    param('propertyId')
      .isMongoId()
      .withMessage('Invalid property ID'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
    query('sortBy')
      .optional()
      .isIn(['createdAt', 'rating', 'helpfulCount'])
      .withMessage('Invalid sort field'),
    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Order must be asc or desc'),
    query('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating filter must be between 1 and 5'),
    query('reviewType')
      .optional()
      .isIn(['property', 'landlord', 'tenant'])
      .withMessage('Invalid review type filter')
  ],
  handleValidationErrors,
  getPropertyReviews
);

// Get reviews for a user (as reviewer or reviewee)
router.get('/user/:userId',
  [
    param('userId')
      .isMongoId()
      .withMessage('Invalid user ID'),
    query('role')
      .optional()
      .isIn(['reviewer', 'reviewee', 'all'])
      .withMessage('Invalid role filter'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
    query('reviewType')
      .optional()
      .isIn(['property', 'landlord', 'tenant'])
      .withMessage('Invalid review type filter')
  ],
  handleValidationErrors,
  getUserReviews
);

// Update a review (within 48 hours)
router.put('/:reviewId',
  authenticate,
  [
    param('reviewId')
      .isMongoId()
      .withMessage('Invalid review ID'),
    body('rating')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('reviewText')
      .optional()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Review text must be between 10 and 1000 characters'),
    body('reviewAspects')
      .optional()
      .isObject()
      .withMessage('Review aspects must be an object'),
    body('reviewAspects.*')
      .optional()
      .isInt({ min: 1, max: 5 })
      .withMessage('Aspect ratings must be between 1 and 5')
  ],
  handleValidationErrors,
  updateReview
);

// Mark review as helpful/unhelpful
router.post('/:reviewId/helpful',
  authenticate,
  [
    param('reviewId')
      .isMongoId()
      .withMessage('Invalid review ID')
  ],
  handleValidationErrors,
  markHelpful
);

// Report inappropriate review
router.post('/:reviewId/report',
  authenticate,
  [
    param('reviewId')
      .isMongoId()
      .withMessage('Invalid review ID'),
    body('reason')
      .notEmpty()
      .withMessage('Report reason is required')
      .isIn(['spam', 'inappropriate_content', 'fake_review', 'personal_info', 'harassment'])
      .withMessage('Invalid report reason'),
    body('description')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Description must not exceed 500 characters')
  ],
  handleValidationErrors,
  reportReview
);

// TEST ROUTE - Remove in production
router.get('/test', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Review API is working! ⭐',
    user: req.user.firstName,
    features: [
      '📝 Verified booking reviews only',
      '🎯 Aspect-based ratings',
      '👍 Helpful votes system',
      '🛡️ Automated moderation',
      '📊 Advanced analytics',
      '⏰ 48-hour edit window',
      '🚫 Anti-fake review protection'
    ],
    description: 'Smart review system with business intelligence and fraud prevention.'
  });
});

// DEPRECATED: Mock routes for development only - use real review endpoints
// These will be removed in production

// DEPRECATED: Get mock property reviews
router.get('/mock/property/:propertyId', (req, res) => {
  const { propertyId } = req.params;
  
  res.json({
    success: true,
    message: 'Mock property reviews',
    data: {
      reviews: [
        {
          _id: '674f1a2b3c4d5e6f7a8b9c13',
          reviewerId: {
            _id: '674f1a2b3c4d5e6f7a8b9c14',
            firstName: 'Ankit',
            lastName: 'Sharma',
            profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
          },
          revieweeId: {
            _id: '674f1a2b3c4d5e6f7a8b9c15',
            firstName: 'Rajesh',
            lastName: 'Kumar',
            profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
          },
          reviewType: 'property',
          rating: 4,
          reviewText: 'Great property with excellent amenities. The location is perfect and the landlord is very responsive. Only minor issue was with the parking space.',
          reviewAspects: {
            cleanliness: 5,
            communication: 5,
            location: 4,
            amenities: 4,
            valueForMoney: 4
          },
          verifiedBooking: true,
          reviewerRole: 'tenant',
          stayDuration: 365, // 1 year
          helpfulCount: 8,
          businessMetrics: {
            viewCount: 24,
            responseTime: 2, // 2 hours avg response
            bookingValue: 420000 // 35k x 12 months
          },
          analytics: {
            sentiment: 'positive',
            keywords: ['great', 'excellent', 'perfect', 'responsive', 'amenities']
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
          response: {
            text: 'Thank you for the wonderful review! We\'re glad you enjoyed your stay. We\'ve addressed the parking concern.',
            respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)
          }
        },
        {
          _id: '674f1a2b3c4d5e6f7a8b9c16',
          reviewerId: {
            _id: '674f1a2b3c4d5e6f7a8b9c17',
            firstName: 'Priya',
            lastName: 'Patel',
            profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786'
          },
          revieweeId: {
            _id: '674f1a2b3c4d5e6f7a8b9c15',
            firstName: 'Rajesh',
            lastName: 'Kumar',
            profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
          },
          reviewType: 'property',
          rating: 5,
          reviewText: 'Absolutely loved this place! Everything was exactly as described. The property is well-maintained and the neighborhood is safe and quiet.',
          reviewAspects: {
            cleanliness: 5,
            communication: 5,
            location: 5,
            amenities: 5,
            valueForMoney: 5
          },
          verifiedBooking: true,
          reviewerRole: 'tenant',
          stayDuration: 180, // 6 months
          helpfulCount: 12,
          businessMetrics: {
            viewCount: 31,
            responseTime: 1, // 1 hour avg response
            bookingValue: 210000 // 35k x 6 months
          },
          analytics: {
            sentiment: 'positive',
            keywords: ['loved', 'exactly', 'well-maintained', 'safe', 'quiet']
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 7 days ago
        },
        {
          _id: '674f1a2b3c4d5e6f7a8b9c18',
          reviewerId: {
            _id: '674f1a2b3c4d5e6f7a8b9c19',
            firstName: 'Vikram',
            lastName: 'Singh',
            profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
          },
          revieweeId: {
            _id: '674f1a2b3c4d5e6f7a8b9c15',
            firstName: 'Rajesh',
            lastName: 'Kumar',
            profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
          },
          reviewType: 'landlord',
          rating: 4,
          reviewText: 'Rajesh is a fantastic landlord. Very professional and always available for any concerns. Highly recommend!',
          reviewAspects: {
            responsiveness: 5,
            reliability: 4,
            professionalism: 5
          },
          verifiedBooking: true,
          reviewerRole: 'tenant',
          stayDuration: 730, // 2 years
          helpfulCount: 15,
          businessMetrics: {
            viewCount: 42,
            responseTime: 1.5, // 1.5 hours avg response
            bookingValue: 840000 // 35k x 24 months
          },
          analytics: {
            sentiment: 'positive',
            keywords: ['fantastic', 'professional', 'available', 'recommend']
          },
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
        }
      ],
      statistics: {
        totalReviews: 3,
        averageRating: 4.3,
        ratingDistribution: [
          { rating: 5, count: 1, percentage: '33.3' },
          { rating: 4, count: 2, percentage: '66.7' },
          { rating: 3, count: 0, percentage: '0' },
          { rating: 2, count: 0, percentage: '0' },
          { rating: 1, count: 0, percentage: '0' }
        ]
      },
      pagination: {
        page: 1,
        limit: 10,
        totalReviews: 3,
        totalPages: 1
      }
    }
  });
});

// Get mock user reviews
router.get('/mock/user/:userId', (req, res) => {
  const { userId } = req.params;
  
  res.json({
    success: true,
    message: 'Mock user reviews',
    data: {
      reviews: [
        {
          _id: '674f1a2b3c4d5e6f7a8b9c20',
          reviewerId: {
            _id: '674f1a2b3c4d5e6f7a8b9c21',
            firstName: 'Sarah',
            lastName: 'Johnson',
            profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
          },
          revieweeId: {
            _id: userId,
            firstName: 'Current',
            lastName: 'User'
          },
          propertyId: {
            _id: '674f1a2b3c4d5e6f7a8b9c22',
            title: 'Modern Studio Apartment',
            location: 'Koramangala, Bangalore',
            images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267']
          },
          reviewType: 'landlord',
          rating: 5,
          reviewText: 'Excellent landlord! Very responsive to maintenance requests and always professional in dealings.',
          reviewAspects: {
            responsiveness: 5,
            reliability: 5,
            professionalism: 5
          },
          verifiedBooking: true,
          reviewerRole: 'tenant',
          helpfulCount: 6,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10) // 10 days ago
        }
      ],
      statistics: {
        asReviewer: {
          totalGiven: 5,
          avgRatingGiven: 4.2
        },
        asReviewee: {
          totalReceived: 8,
          avgRatingReceived: 4.7
        }
      },
      pagination: {
        page: 1,
        limit: 10,
        hasMore: false
      }
    }
  });
});

module.exports = router;