const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Review Identification
  reviewId: {
    type: String,
    required: true,
    unique: true
  },
  
  // References
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property reference is required']
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewer reference is required']
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Can be landlord or tenant
    required: [true, 'Reviewee reference is required']
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking reference is required']
  },
  
  // Review Type
  type: {
    type: String,
    required: [true, 'Review type is required'],
    enum: {
      values: [
        'tenant-to-property',    // Tenant reviewing property
        'tenant-to-landlord',    // Tenant reviewing landlord
        'landlord-to-tenant',    // Landlord reviewing tenant
        'landlord-to-property'   // Landlord reviewing their own property experience
      ],
      message: 'Invalid review type'
    }
  },
  
  // Overall Rating (1-5 stars)
  overall: {
    rating: {
      type: Number,
      required: [true, 'Overall rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      validate: {
        validator: function(value) {
          return value % 0.5 === 0; // Allow half stars
        },
        message: 'Rating must be in increments of 0.5'
      }
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    }
  },
  
  // Detailed Ratings (Property Reviews)
  propertyRatings: {
    cleanliness: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
          validator: function(value) {
            return !value || value % 0.5 === 0;
          },
          message: 'Rating must be in increments of 0.5'
        }
      },
      comment: {
        type: String,
        maxlength: 200
      }
    },
    location: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
          validator: function(value) {
            return !value || value % 0.5 === 0;
          },
          message: 'Rating must be in increments of 0.5'
        }
      },
      comment: {
        type: String,
        maxlength: 200
      }
    },
    amenities: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
          validator: function(value) {
            return !value || value % 0.5 === 0;
          },
          message: 'Rating must be in increments of 0.5'
        }
      },
      comment: {
        type: String,
        maxlength: 200
      }
    },
    maintenance: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
          validator: function(value) {
            return !value || value % 0.5 === 0;
          },
          message: 'Rating must be in increments of 0.5'
        }
      },
      comment: {
        type: String,
        maxlength: 200
      }
    },
    valueForMoney: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
          validator: function(value) {
            return !value || value % 0.5 === 0;
          },
          message: 'Rating must be in increments of 0.5'
        }
      },
      comment: {
        type: String,
        maxlength: 200
      }
    },
    safety: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
          validator: function(value) {
            return !value || value % 0.5 === 0;
          },
          message: 'Rating must be in increments of 0.5'
        }
      },
      comment: {
        type: String,
        maxlength: 200
      }
    }
  },
  
  // User Behavior Ratings (For landlord reviewing tenant or vice versa)
  behaviorRatings: {
    communication: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
          validator: function(value) {
            return !value || value % 0.5 === 0;
          },
          message: 'Rating must be in increments of 0.5'
        }
      },
      comment: {
        type: String,
        maxlength: 200
      }
    },
    cleanliness: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
          validator: function(value) {
            return !value || value % 0.5 === 0;
          },
          message: 'Rating must be in increments of 0.5'
        }
      },
      comment: {
        type: String,
        maxlength: 200
      }
    },
    reliability: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
          validator: function(value) {
            return !value || value % 0.5 === 0;
          },
          message: 'Rating must be in increments of 0.5'
        }
      },
      comment: {
        type: String,
        maxlength: 200
      }
    },
    respectfulness: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
          validator: function(value) {
            return !value || value % 0.5 === 0;
          },
          message: 'Rating must be in increments of 0.5'
        }
      },
      comment: {
        type: String,
        maxlength: 200
      }
    },
    responsiveness: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        validate: {
          validator: function(value) {
            return !value || value % 0.5 === 0;
          },
          message: 'Rating must be in increments of 0.5'
        }
      },
      comment: {
        type: String,
        maxlength: 200
      }
    }
  },
  
  // Pros and Cons
  prosAndCons: {
    pros: [{
      type: String,
      maxlength: 100
    }],
    cons: [{
      type: String,
      maxlength: 100
    }]
  },
  
  // Tags and Categories
  tags: [{
    type: String,
    enum: [
      // Property tags
      'well-maintained', 'spacious', 'good-location', 'peaceful', 'noisy',
      'expensive', 'value-for-money', 'clean', 'dirty', 'modern', 'outdated',
      'safe', 'unsafe', 'convenient', 'inconvenient', 'furnished', 'unfurnished',
      
      // User behavior tags
      'responsive', 'unresponsive', 'friendly', 'rude', 'professional',
      'unprofessional', 'reliable', 'unreliable', 'helpful', 'unhelpful',
      'respectful', 'disrespectful', 'punctual', 'late'
    ]
  }],
  
  // Media Attachments
  media: [{
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    publicId: String, // Cloudinary public ID
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Review Status and Moderation
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged', 'hidden'],
    default: 'pending'
  },
  
  moderation: {
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    reason: String, // Reason for rejection/flagging
    autoApproved: {
      type: Boolean,
      default: false
    },
    flags: [{
      type: {
        type: String,
        enum: ['inappropriate', 'spam', 'fake', 'offensive', 'irrelevant', 'other']
      },
      flaggedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      flaggedAt: {
        type: Date,
        default: Date.now
      },
      reason: String,
      resolved: {
        type: Boolean,
        default: false
      },
      resolvedAt: Date,
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  },
  
  // Helpfulness and Voting
  helpfulness: {
    helpful: {
      type: Number,
      default: 0
    },
    notHelpful: {
      type: Number,
      default: 0
    },
    voters: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      vote: {
        type: String,
        enum: ['helpful', 'not-helpful']
      },
      votedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  // Response from Reviewee
  response: {
    text: {
      type: String,
      maxlength: 500
    },
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Verification
  verified: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationMethod: {
      type: String,
      enum: ['booking-confirmed', 'manual-verification', 'document-verified']
    },
    verifiedAt: Date
  },
  
  // Analytics and Engagement
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    bookmarked: {
      type: Number,
      default: 0
    },
    lastViewed: Date
  },
  
  // Review Visibility
  visibility: {
    public: {
      type: Boolean,
      default: true
    },
    showOnProfile: {
      type: Boolean,
      default: true
    },
    showOnProperty: {
      type: Boolean,
      default: true
    }
  },
  
  // Source Information
  source: {
    platform: {
      type: String,
      enum: ['web', 'mobile-app', 'email-invitation', 'sms-invitation'],
      default: 'web'
    },
    invitationSent: {
      type: Boolean,
      default: false
    },
    invitationSentAt: Date,
    respondedToInvitation: {
      type: Boolean,
      default: false
    }
  },
  
  // Edit History
  editHistory: [{
    editedAt: {
      type: Date,
      default: Date.now
    },
    changes: [{
      field: String,
      oldValue: mongoose.Schema.Types.Mixed,
      newValue: mongoose.Schema.Types.Mixed
    }],
    reason: String
  }],
  
  // Timestamps
  reviewDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Soft Delete
  deletedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
reviewSchema.index({ reviewId: 1 }, { unique: true });
reviewSchema.index({ property: 1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ booking: 1 });
reviewSchema.index({ type: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ 'overall.rating': -1 });
reviewSchema.index({ reviewDate: -1 });
reviewSchema.index({ isDeleted: 1 });

// Compound indexes
reviewSchema.index({ property: 1, status: 1, 'overall.rating': -1 });
reviewSchema.index({ reviewee: 1, type: 1, status: 1 });
reviewSchema.index({ reviewer: 1, status: 1 });
reviewSchema.index({ property: 1, type: 1, status: 1 });

// Ensure one review per booking per user
reviewSchema.index({ booking: 1, reviewer: 1, type: 1 }, { unique: true });

// Virtual for helpfulness score
reviewSchema.virtual('helpfulnessScore').get(function() {
  const total = this.helpfulness.helpful + this.helpfulness.notHelpful;
  if (total === 0) return 0;
  return (this.helpfulness.helpful / total) * 100;
});

// Virtual for total detailed ratings average
reviewSchema.virtual('averageDetailedRating').get(function() {
  const ratings = [];
  
  // Collect property ratings
  if (this.propertyRatings) {
    Object.values(this.propertyRatings).forEach(rating => {
      if (rating.rating) ratings.push(rating.rating);
    });
  }
  
  // Collect behavior ratings
  if (this.behaviorRatings) {
    Object.values(this.behaviorRatings).forEach(rating => {
      if (rating.rating) ratings.push(rating.rating);
    });
  }
  
  if (ratings.length === 0) return null;
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
});

// Virtual for review age
reviewSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const reviewDate = new Date(this.reviewDate);
  return Math.floor((now - reviewDate) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware
reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Generate review ID if not exists
  if (!this.reviewId) {
    this.generateReviewId();
  }
  
  // Auto-approve if conditions are met
  if (this.status === 'pending' && this.shouldAutoApprove()) {
    this.status = 'approved';
    this.moderation.autoApproved = true;
    this.moderation.reviewedAt = new Date();
  }
  
  next();
});

// Method to generate unique review ID
reviewSchema.methods.generateReviewId = function() {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  
  this.reviewId = `REV_${year}${month}_${random}`;
};

// Method to check if review should be auto-approved
reviewSchema.methods.shouldAutoApprove = function() {
  // Auto-approve criteria
  const hasGoodRating = this.overall.rating >= 3;
  const hasReasonableLength = this.overall.comment.length >= 20 && this.overall.comment.length <= 800;
  const hasNoFlags = this.moderation.flags.length === 0;
  const isVerified = this.verified.isVerified;
  
  return hasGoodRating && hasReasonableLength && hasNoFlags && isVerified;
};

// Method to add helpfulness vote
reviewSchema.methods.addHelpfulnessVote = function(userId, vote) {
  // Check if user already voted
  const existingVote = this.helpfulness.voters.find(
    voter => voter.user.toString() === userId.toString()
  );
  
  if (existingVote) {
    // Update existing vote
    if (existingVote.vote === vote) {
      // Remove vote if same vote
      this.helpfulness.voters = this.helpfulness.voters.filter(
        voter => voter.user.toString() !== userId.toString()
      );
      this.helpfulness[existingVote.vote === 'helpful' ? 'helpful' : 'notHelpful']--;
    } else {
      // Change vote
      this.helpfulness[existingVote.vote === 'helpful' ? 'helpful' : 'notHelpful']--;
      this.helpfulness[vote === 'helpful' ? 'helpful' : 'notHelpful']++;
      existingVote.vote = vote;
      existingVote.votedAt = new Date();
    }
  } else {
    // Add new vote
    this.helpfulness.voters.push({
      user: userId,
      vote: vote,
      votedAt: new Date()
    });
    this.helpfulness[vote === 'helpful' ? 'helpful' : 'notHelpful']++;
  }
  
  return this.save();
};

// Method to add response
reviewSchema.methods.addResponse = function(responseText, respondedBy) {
  this.response = {
    text: responseText,
    respondedAt: new Date(),
    respondedBy: respondedBy
  };
  
  return this.save();
};

// Method to flag review
reviewSchema.methods.flagReview = function(flaggedBy, type, reason) {
  this.moderation.flags.push({
    type: type,
    flaggedBy: flaggedBy,
    reason: reason,
    flaggedAt: new Date()
  });
  
  // Auto-hide if multiple flags
  if (this.moderation.flags.length >= 3) {
    this.status = 'flagged';
  }
  
  return this.save();
};

// Static method to get property review statistics
reviewSchema.statics.getPropertyStats = function(propertyId) {
  return this.aggregate([
    {
      $match: {
        property: mongoose.Types.ObjectId(propertyId),
        status: 'approved',
        type: { $in: ['tenant-to-property', 'tenant-to-landlord'] }
      }
    },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageOverallRating: { $avg: '$overall.rating' },
        averageCleanlinessRating: { $avg: '$propertyRatings.cleanliness.rating' },
        averageLocationRating: { $avg: '$propertyRatings.location.rating' },
        averageAmenitiesRating: { $avg: '$propertyRatings.amenities.rating' },
        averageMaintenanceRating: { $avg: '$propertyRatings.maintenance.rating' },
        averageValueRating: { $avg: '$propertyRatings.valueForMoney.rating' },
        averageSafetyRating: { $avg: '$propertyRatings.safety.rating' },
        ratingDistribution: {
          $push: '$overall.rating'
        }
      }
    }
  ]);
};

// Static method to get user review statistics
reviewSchema.statics.getUserStats = function(userId, type = 'all') {
  const matchCondition = {
    reviewee: mongoose.Types.ObjectId(userId),
    status: 'approved'
  };
  
  if (type !== 'all') {
    matchCondition.type = type;
  }
  
  return this.aggregate([
    { $match: matchCondition },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageOverallRating: { $avg: '$overall.rating' },
        averageCommunicationRating: { $avg: '$behaviorRatings.communication.rating' },
        averageCleanlinessRating: { $avg: '$behaviorRatings.cleanliness.rating' },
        averageReliabilityRating: { $avg: '$behaviorRatings.reliability.rating' },
        averageRespectfulnessRating: { $avg: '$behaviorRatings.respectfulness.rating' },
        averageResponsivenessRating: { $avg: '$behaviorRatings.responsiveness.rating' }
      }
    }
  ]);
};

// Static method to get recent reviews
reviewSchema.statics.getRecentReviews = function(limit = 10, type = null) {
  const matchCondition = {
    status: 'approved',
    isDeleted: false
  };
  
  if (type) {
    matchCondition.type = type;
  }
  
  return this.find(matchCondition)
    .sort({ reviewDate: -1 })
    .limit(limit)
    .populate('reviewer', 'firstName lastName profilePicture')
    .populate('reviewee', 'firstName lastName profilePicture')
    .populate('property', 'title address.area address.city');
};

module.exports = mongoose.model('Review', reviewSchema);