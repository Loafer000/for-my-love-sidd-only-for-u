// Review Controller - Smart Review & Rating System

const {
  ReviewEnhanced, Property, Booking, User, Review
} = require('../models');

// Create a new review (only after completed booking)
const createReview = async (req, res) => {
  try {
    const {
      bookingId,
      propertyId,
      revieweeId, // User being reviewed (landlord or tenant)
      rating,
      reviewText,
      reviewType, // 'property', 'landlord', 'tenant'
      reviewAspects = {}
    } = req.body;
    const reviewerId = req.user._id;

    // Validate booking completion
    const booking = await Booking.findById(bookingId).populate('property tenant landlord');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted after booking completion'
      });
    }

    // Verify reviewer is part of the booking
    const isLandlord = booking.landlord._id.toString() === reviewerId.toString();
    const isTenant = booking.tenant._id.toString() === reviewerId.toString();

    if (!isLandlord && !isTenant) {
      return res.status(403).json({
        success: false,
        message: 'Only booking participants can leave reviews'
      });
    }

    // Check if review already exists
    const existingReview = await ReviewEnhanced.findOne({
      bookingId,
      reviewerId,
      revieweeId,
      reviewType
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already submitted for this booking'
      });
    }

    // Create review
    const review = new ReviewEnhanced({
      bookingId,
      propertyId,
      reviewerId,
      revieweeId,
      reviewType,
      rating,
      reviewText,
      reviewAspects,
      verifiedBooking: true,
      reviewerRole: isLandlord ? 'landlord' : 'tenant',
      moderationStatus: 'approved', // Auto-approve verified bookings
      businessMetrics: {
        helpfulVotes: 0,
        reportCount: 0,
        responseTime: booking.responseTime,
        bookingValue: booking.totalAmount
      }
    });

    await review.save();

    // Update property and user ratings
    await updatePropertyRating(propertyId);
    await updateUserRating(revieweeId);

    // Populate review for response
    await review.populate([
      { path: 'reviewerId', select: 'firstName lastName profilePhoto' },
      { path: 'revieweeId', select: 'firstName lastName profilePhoto' },
      { path: 'propertyId', select: 'title location' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get reviews for a property
const getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
      rating = null,
      reviewType = null
    } = req.query;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const sortOrder = order === 'asc' ? 1 : -1;

    // Build filter
    const filter = {
      propertyId,
      moderationStatus: 'approved',
      isVisible: true
    };

    if (rating) {
      filter.rating = parseInt(rating, 10);
    }

    if (reviewType) {
      filter.reviewType = reviewType;
    }

    // Get reviews with pagination
    const reviews = await ReviewEnhanced.find(filter)
      .populate('reviewerId', 'firstName lastName profilePhoto')
      .populate('revieweeId', 'firstName lastName profilePhoto')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit, 10));

    // Get review statistics
    const stats = await ReviewEnhanced.aggregate([
      { $match: { propertyId, moderationStatus: 'approved', isVisible: true } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    const reviewStats = stats[0] || {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: []
    };

    // Calculate rating distribution
    const distribution = [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: reviewStats.ratingDistribution.filter((r) => r === rating).length,
      percentage: reviewStats.totalReviews > 0
        ? ((reviewStats.ratingDistribution.filter((r) => r === rating).length / reviewStats.totalReviews) * 100).toFixed(1)
        : 0
    }));

    res.json({
      success: true,
      message: 'Reviews retrieved successfully',
      data: {
        reviews,
        statistics: {
          ...reviewStats,
          ratingDistribution: distribution
        },
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          totalReviews: reviewStats.totalReviews,
          totalPages: Math.ceil(reviewStats.totalReviews / parseInt(limit, 10))
        }
      }
    });
  } catch (error) {
    console.error('Get property reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get user reviews (as reviewer or reviewee)
const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      role = 'all', // 'reviewer', 'reviewee', 'all'
      page = 1,
      limit = 10,
      reviewType = null
    } = req.query;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    // Build filter based on role
    const filter = { moderationStatus: 'approved', isVisible: true };

    if (role === 'reviewer') {
      filter.reviewerId = userId;
    } else if (role === 'reviewee') {
      filter.revieweeId = userId;
    } else {
      filter.$or = [
        { reviewerId: userId },
        { revieweeId: userId }
      ];
    }

    if (reviewType) {
      filter.reviewType = reviewType;
    }

    const reviews = await ReviewEnhanced.find(filter)
      .populate('reviewerId', 'firstName lastName profilePhoto')
      .populate('revieweeId', 'firstName lastName profilePhoto')
      .populate('propertyId', 'title location images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    // Get user review statistics
    const reviewerStats = await ReviewEnhanced.aggregate([
      { $match: { reviewerId: userId, moderationStatus: 'approved' } },
      {
        $group: {
          _id: null,
          totalGiven: { $sum: 1 },
          avgRatingGiven: { $avg: '$rating' }
        }
      }
    ]);

    const revieweeStats = await ReviewEnhanced.aggregate([
      { $match: { revieweeId: userId, moderationStatus: 'approved' } },
      {
        $group: {
          _id: null,
          totalReceived: { $sum: 1 },
          avgRatingReceived: { $avg: '$rating' }
        }
      }
    ]);

    const userStats = {
      asReviewer: reviewerStats[0] || { totalGiven: 0, avgRatingGiven: 0 },
      asReviewee: revieweeStats[0] || { totalReceived: 0, avgRatingReceived: 0 }
    };

    res.json({
      success: true,
      message: 'User reviews retrieved successfully',
      data: {
        reviews,
        statistics: userStats,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          hasMore: reviews.length === parseInt(limit, 10)
        }
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update review (within 48 hours)
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, reviewText, reviewAspects } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership
    if (review.reviewerId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own reviews'
      });
    }

    // Check 48-hour edit window
    const hoursSinceCreation = (new Date() - review.createdAt) / (1000 * 60 * 60);
    if (hoursSinceCreation > 48) {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be edited within 48 hours of creation'
      });
    }

    // Update review
    review.rating = rating || review.rating;
    review.reviewText = reviewText || review.reviewText;
    review.reviewAspects = reviewAspects || review.reviewAspects;
    review.isEdited = true;
    review.editedAt = new Date();
    review.moderationStatus = 'pending'; // Re-moderate edited reviews

    await review.save();

    // Update ratings
    await updatePropertyRating(review.propertyId);
    await updateUserRating(review.revieweeId);

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Mark review as helpful
const markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if already marked helpful
    const alreadyMarked = review.businessMetrics.helpfulVotes.includes(userId);

    if (alreadyMarked) {
      // Remove helpful vote
      review.businessMetrics.helpfulVotes.pull(userId);
    } else {
      // Add helpful vote
      review.businessMetrics.helpfulVotes.push(userId);
    }

    await review.save();

    res.json({
      success: true,
      message: alreadyMarked ? 'Helpful vote removed' : 'Review marked as helpful',
      data: {
        helpfulCount: review.businessMetrics.helpfulVotes.length,
        isHelpful: !alreadyMarked
      }
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update helpful status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Report inappropriate review
const reportReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason, description } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if already reported by this user
    const alreadyReported = review.moderationFlags.some(
      (flag) => flag.reporterId && flag.reporterId.toString() === userId.toString()
    );

    if (alreadyReported) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this review'
      });
    }

    // Add moderation flag
    review.moderationFlags.push({
      type: 'inappropriate_content',
      reason,
      description,
      reporterId: userId,
      flaggedAt: new Date()
    });

    review.businessMetrics.reportCount += 1;

    // Auto-hide if too many reports
    if (review.businessMetrics.reportCount >= 3) {
      review.moderationStatus = 'under_review';
      review.isVisible = false;
    }

    await review.save();

    res.json({
      success: true,
      message: 'Review reported successfully. Our team will investigate.',
      data: {
        reportCount: review.businessMetrics.reportCount
      }
    });
  } catch (error) {
    console.error('Report review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to report review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Helper function to update property rating
const updatePropertyRating = async (propertyId) => {
  try {
    const stats = await ReviewEnhanced.aggregate([
      {
        $match: {
          propertyId,
          reviewType: 'property',
          moderationStatus: 'approved',
          isVisible: true
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await Property.findByIdAndUpdate(propertyId, {
        'rating.average': Math.round(stats[0].averageRating * 10) / 10,
        'rating.count': stats[0].totalReviews
      });
    }
  } catch (error) {
    console.error('Update property rating error:', error);
  }
};

// Helper function to update user rating
const updateUserRating = async (userId) => {
  try {
    const stats = await ReviewEnhanced.aggregate([
      {
        $match: {
          revieweeId: userId,
          moderationStatus: 'approved',
          isVisible: true
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await User.findByIdAndUpdate(userId, {
        'rating.average': Math.round(stats[0].averageRating * 10) / 10,
        'rating.count': stats[0].totalReviews
      });
    }
  } catch (error) {
    console.error('Update user rating error:', error);
  }
};

module.exports = {
  createReview,
  getPropertyReviews,
  getUserReviews,
  updateReview,
  markHelpful,
  reportReview
};
