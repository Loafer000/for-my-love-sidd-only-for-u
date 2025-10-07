// Enhanced Review Model - Smart Review & Rating System with Business Intelligence

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Core Review Information
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  revieweeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Review Content
  reviewType: {
    type: String,
    enum: ['property', 'landlord', 'tenant'],
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },

  // Detailed Aspect Ratings
  reviewAspects: {
    // For Property Reviews
    cleanliness: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    location: {
      type: Number,
      min: 1,
      max: 5
    },
    amenities: {
      type: Number,
      min: 1,
      max: 5
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5
    },

    // For User Reviews (Landlord/Tenant)
    responsiveness: {
      type: Number,
      min: 1,
      max: 5
    },
    reliability: {
      type: Number,
      min: 1,
      max: 5
    },
    professionalism: {
      type: Number,
      min: 1,
      max: 5
    }
  },

  // Verification & Context
  verifiedBooking: {
    type: Boolean,
    default: false
  },
  reviewerRole: {
    type: String,
    enum: ['landlord', 'tenant'],
    required: true
  },
  stayDuration: {
    type: Number, // in days
    min: 0
  },

  // Review Status & Moderation
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'pending'
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,

  // Moderation & Reporting
  moderationFlags: [{
    type: {
      type: String,
      enum: ['spam', 'inappropriate_content', 'fake_review', 'personal_info', 'harassment']
    },
    reason: String,
    description: String,
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    flaggedAt: {
      type: Date,
      default: Date.now
    },
    resolved: {
      type: Boolean,
      default: false
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    action: {
      type: String,
      enum: ['no_action', 'warning_sent', 'content_edited', 'review_hidden', 'user_suspended']
    }
  }],

  // Business Intelligence & Analytics
  businessMetrics: {
    helpfulVotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    reportCount: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    },
    responseTime: Number, // Landlord response time in hours
    bookingValue: Number, // Total booking amount for context
    seasonalContext: {
      type: String,
      enum: ['peak', 'off_peak', 'holiday', 'normal']
    }
  },

  // Response from Reviewee
  response: {
    text: String,
    respondedAt: Date,
    isEdited: Boolean,
    editedAt: Date
  },

  // Analytics Tracking
  analytics: {
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative']
    },
    keywords: [String], // Extracted keywords from review text
    languageDetected: {
      type: String,
      default: 'en'
    },
    readabilityScore: Number,
    aiModerationScore: {
      type: Number,
      min: 0,
      max: 1 // 0 = likely fake, 1 = likely genuine
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
reviewSchema.index({ propertyId: 1, moderationStatus: 1, isVisible: 1 });
reviewSchema.index({ reviewerId: 1 });
reviewSchema.index({ revieweeId: 1 });
reviewSchema.index({ bookingId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ reviewType: 1, propertyId: 1 });
reviewSchema.index({ 'businessMetrics.helpfulVotes': 1 });

// Compound indexes for common queries
reviewSchema.index({ propertyId: 1, reviewType: 1, moderationStatus: 1 });
reviewSchema.index({ revieweeId: 1, reviewType: 1, moderationStatus: 1 });

// Virtual for helpful votes count
reviewSchema.virtual('helpfulCount').get(function () {
  return this.businessMetrics.helpfulVotes ? this.businessMetrics.helpfulVotes.length : 0;
});

// Pre-save hooks
reviewSchema.pre('save', function (next) {
  // Auto-detect sentiment based on rating
  if (this.isModified('rating')) {
    if (this.rating >= 4) {
      this.analytics.sentiment = 'positive';
    } else if (this.rating >= 3) {
      this.analytics.sentiment = 'neutral';
    } else {
      this.analytics.sentiment = 'negative';
    }
  }

  // Extract keywords from review text
  if (this.isModified('reviewText')) {
    this.analytics.keywords = extractKeywords(this.reviewText);
  }

  next();
});

// Instance methods
reviewSchema.methods.canBeEdited = function () {
  const hoursSinceCreation = (new Date() - this.createdAt) / (1000 * 60 * 60);
  return hoursSinceCreation <= 48 && this.moderationStatus !== 'rejected';
};

reviewSchema.methods.addHelpfulVote = function (userId) {
  if (!this.businessMetrics.helpfulVotes.includes(userId)) {
    this.businessMetrics.helpfulVotes.push(userId);
  }
  return this.save();
};

reviewSchema.methods.removeHelpfulVote = function (userId) {
  this.businessMetrics.helpfulVotes.pull(userId);
  return this.save();
};

reviewSchema.methods.addResponse = function (responseText, responderId) {
  this.response = {
    text: responseText,
    respondedAt: new Date(),
    responderId
  };
  return this.save();
};

// Static methods for analytics
reviewSchema.statics.getPropertyRatingStats = function (propertyId) {
  return this.aggregate([
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
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        },
        aspectAverages: {
          cleanliness: { $avg: '$reviewAspects.cleanliness' },
          communication: { $avg: '$reviewAspects.communication' },
          location: { $avg: '$reviewAspects.location' },
          amenities: { $avg: '$reviewAspects.amenities' },
          valueForMoney: { $avg: '$reviewAspects.valueForMoney' }
        }
      }
    }
  ]);
};

reviewSchema.statics.getUserRatingStats = function (userId) {
  return this.aggregate([
    {
      $match: {
        revieweeId: userId,
        moderationStatus: 'approved',
        isVisible: true
      }
    },
    {
      $group: {
        _id: '$reviewType',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        aspectAverages: {
          responsiveness: { $avg: '$reviewAspects.responsiveness' },
          reliability: { $avg: '$reviewAspects.reliability' },
          professionalism: { $avg: '$reviewAspects.professionalism' }
        }
      }
    }
  ]);
};

reviewSchema.statics.getModerationQueue = function () {
  return this.find({
    $or: [
      { moderationStatus: 'pending' },
      { moderationStatus: 'under_review' },
      { 'businessMetrics.reportCount': { $gte: 3 } }
    ]
  })
    .populate('reviewerId revieweeId propertyId', 'firstName lastName title')
    .sort({ createdAt: 1 });
};

// Helper function to extract keywords (simple implementation)
function extractKeywords(text) {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must'];

  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.includes(word))
    .slice(0, 10); // Limit to top 10 keywords
}

const ReviewEnhanced = mongoose.model('ReviewEnhanced', reviewSchema);

module.exports = ReviewEnhanced;
