const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  // Basic Property Information
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },

  // Property Type & Category
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: {
      values: ['apartment', 'house', 'villa', 'studio', 'pg', 'hostel', 'office', 'shop'],
      message: 'Invalid property type'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['residential', 'commercial', 'co-living', 'student-housing'],
      message: 'Invalid category'
    }
  },

  // Owner Information
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Property owner is required']
  },

  // Location Details
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode']
    },
    country: {
      type: String,
      default: 'India'
    },
    landmark: String
  },

  // Geographic Coordinates
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Property coordinates are required']
    }
  },

  // Property Specifications
  specifications: {
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: [0, 'Bedrooms cannot be negative']
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: [1, 'At least 1 bathroom is required']
    },
    area: {
      carpet: {
        type: Number,
        required: [true, 'Carpet area is required'],
        min: [1, 'Area must be positive']
      },
      builtUp: Number,
      plot: Number,
      unit: {
        type: String,
        enum: ['sqft', 'sqm'],
        default: 'sqft'
      }
    },
    floor: {
      current: {
        type: Number,
        required: [true, 'Current floor is required']
      },
      total: {
        type: Number,
        required: [true, 'Total floors is required']
      }
    },
    parking: {
      twoWheeler: {
        type: Number,
        default: 0
      },
      fourWheeler: {
        type: Number,
        default: 0
      }
    },
    balconies: {
      type: Number,
      default: 0
    }
  },

  // Rental Information
  rental: {
    monthlyRent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: [1, 'Rent must be positive']
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit is required'],
      min: [0, 'Security deposit cannot be negative']
    },
    maintenanceCharges: {
      amount: {
        type: Number,
        default: 0
      },
      included: {
        type: Boolean,
        default: false
      },
      description: String
    },
    brokerage: {
      amount: {
        type: Number,
        default: 0
      },
      percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      paidBy: {
        type: String,
        enum: ['tenant', 'landlord', 'both'],
        default: 'tenant'
      }
    },
    leaseDuration: {
      minimum: {
        type: Number,
        required: [true, 'Minimum lease duration is required'],
        min: [1, 'Minimum lease must be at least 1 month']
      },
      maximum: Number,
      unit: {
        type: String,
        enum: ['months', 'years'],
        default: 'months'
      }
    },
    availableFrom: {
      type: Date,
      required: [true, 'Available from date is required']
    },
    negotiable: {
      type: Boolean,
      default: false
    }
  },

  // Amenities & Features
  amenities: {
    basic: [{
      type: String,
      enum: [
        'furnished', 'semi-furnished', 'unfurnished',
        'air-conditioning', 'heating', 'wifi',
        'power-backup', 'lift', 'intercom'
      ]
    }],
    safety: [{
      type: String,
      enum: [
        '24x7-security', 'cctv', 'security-guard',
        'gated-community', 'fire-safety', 'earthquake-resistant'
      ]
    }],
    convenience: [{
      type: String,
      enum: [
        'near-metro', 'near-bus-stop', 'near-airport',
        'shopping-mall', 'hospital', 'school-college',
        'restaurant', 'atm', 'bank'
      ]
    }],
    recreational: [{
      type: String,
      enum: [
        'gym', 'swimming-pool', 'garden', 'playground',
        'club-house', 'sports-facility', 'jogging-track',
        'community-hall', 'library'
      ]
    }],
    utilities: [{
      type: String,
      enum: [
        'water-supply', 'drainage', 'sewage-treatment',
        'garbage-disposal', 'electricity', 'gas-pipeline',
        'internet-ready', 'cable-ready'
      ]
    }]
  },

  // Property Rules & Preferences
  rules: {
    smokingAllowed: {
      type: Boolean,
      default: false
    },
    petsAllowed: {
      type: Boolean,
      default: false
    },
    drinking: {
      type: String,
      enum: ['allowed', 'not-allowed', 'social-drinking'],
      default: 'not-allowed'
    },
    nonVeg: {
      type: Boolean,
      default: true
    },
    visitors: {
      type: String,
      enum: ['allowed', 'not-allowed', 'restricted-hours'],
      default: 'restricted-hours'
    },
    gateClosingTime: String,
    preferences: {
      tenantType: [{
        type: String,
        enum: ['students', 'professionals', 'family', 'bachelors', 'any']
      }],
      gender: {
        type: String,
        enum: ['male', 'female', 'any'],
        default: 'any'
      }
    }
  },

  // Media & Documentation
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String, // Cloudinary public ID
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      enum: ['exterior', 'living-room', 'bedroom', 'kitchen', 'bathroom', 'balcony', 'other'],
      default: 'other'
    }
  }],

  videos: [{
    url: String,
    publicId: String,
    caption: String,
    duration: Number // in seconds
  }],

  documents: [{
    name: String,
    url: String,
    publicId: String,
    type: {
      type: String,
      enum: ['ownership-proof', 'noc', 'floor-plan', 'other']
    }
  }],

  // Virtual Tour
  virtualTour: {
    url: String,
    provider: {
      type: String,
      enum: ['matterport', '360-view', 'custom']
    }
  },

  // Availability & Status
  status: {
    type: String,
    enum: ['available', 'rented', 'maintenance', 'sold', 'inactive'],
    default: 'available'
  },

  visibility: {
    type: String,
    enum: ['public', 'private', 'draft'],
    default: 'draft'
  },

  // Verification & Quality
  verification: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    rejectionReason: String
  },

  qualityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },

  // Analytics & Performance
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    inquiries: {
      type: Number,
      default: 0
    },
    bookings: {
      type: Number,
      default: 0
    },
    lastViewed: Date,
    viewHistory: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      viewedAt: {
        type: Date,
        default: Date.now
      },
      source: String // 'search', 'direct', 'recommendation'
    }]
  },

  // Reviews & Ratings
  reviews: {
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    ratings: {
      cleanliness: { type: Number, default: 0 },
      location: { type: Number, default: 0 },
      amenities: { type: Number, default: 0 },
      landlord: { type: Number, default: 0 },
      valueForMoney: { type: Number, default: 0 }
    }
  },

  // SEO & Marketing
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    slug: {
      type: String,
      unique: true,
      sparse: true
    }
  },

  // Featured & Promotion
  featured: {
    isFeatured: {
      type: Boolean,
      default: false
    },
    featuredUntil: Date,
    promotionLevel: {
      type: String,
      enum: ['basic', 'premium', 'super-premium'],
      default: 'basic'
    }
  },

  // Timestamps
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
propertySchema.index({ location: '2dsphere' }); // Geospatial index
propertySchema.index({ owner: 1 });
propertySchema.index({ status: 1, visibility: 1 });
propertySchema.index({ 'address.city': 1, 'address.area': 1 });
propertySchema.index({ propertyType: 1, category: 1 });
propertySchema.index({ 'rental.monthlyRent': 1 });
propertySchema.index({ 'specifications.bedrooms': 1 });
propertySchema.index({ 'specifications.area.carpet': 1 });
propertySchema.index({ featured: 1, createdAt: -1 });
propertySchema.index({ qualityScore: -1 });
propertySchema.index({ 'analytics.views': -1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ isDeleted: 1 });

// Compound indexes for common queries
propertySchema.index({
  'address.city': 1,
  propertyType: 1,
  status: 1,
  'rental.monthlyRent': 1
});

propertySchema.index({
  'address.city': 1,
  'specifications.bedrooms': 1,
  'rental.monthlyRent': 1
});

// Virtual for primary image
propertySchema.virtual('primaryImage').get(function () {
  const primary = this.images.find((img) => img.isPrimary);
  return primary || this.images[0] || null;
});

// Virtual for full address
propertySchema.virtual('fullAddress').get(function () {
  const addr = this.address;
  return `${addr.street}, ${addr.area}, ${addr.city}, ${addr.state} - ${addr.pincode}`;
});

// Virtual for rent per sqft
propertySchema.virtual('rentPerSqft').get(function () {
  if (this.specifications.area.carpet && this.rental.monthlyRent) {
    return Math.round(this.rental.monthlyRent / this.specifications.area.carpet);
  }
  return null;
});

// Virtual for total images count
propertySchema.virtual('totalImages').get(function () {
  return this.images.length;
});

// Pre-save middleware to update timestamps
propertySchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  // Auto-generate slug if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  // Calculate quality score
  this.calculateQualityScore();

  next();
});

// Method to calculate quality score
propertySchema.methods.calculateQualityScore = function () {
  let score = 0;

  // Basic information completeness (40 points)
  if (this.title && this.title.length >= 10) score += 5;
  if (this.description && this.description.length >= 100) score += 10;
  if (this.images && this.images.length >= 5) score += 15;
  if (this.images && this.images.length >= 10) score += 5;
  if (this.virtualTour && this.virtualTour.url) score += 5;

  // Location details (20 points)
  if (this.address && this.address.landmark) score += 5;
  if (this.location && this.location.coordinates && this.location.coordinates.length === 2) score += 10;
  if (this.amenities.convenience && this.amenities.convenience.length >= 3) score += 5;

  // Amenities completeness (20 points)
  const totalAmenities = [
    ...this.amenities.basic,
    ...this.amenities.safety,
    ...this.amenities.convenience,
    ...this.amenities.recreational,
    ...this.amenities.utilities
  ].length;

  if (totalAmenities >= 5) score += 5;
  if (totalAmenities >= 10) score += 5;
  if (totalAmenities >= 15) score += 10;

  // Verification and documentation (20 points)
  if (this.verification.status === 'verified') score += 10;
  if (this.documents && this.documents.length >= 2) score += 5;
  if (this.owner && this.populated('owner')) {
    const { owner } = this;
    if (owner.documentVerified) score += 5;
  }

  this.qualityScore = Math.min(score, 100);
};

// Method to increment view count
propertySchema.methods.incrementViews = function (userId = null, source = 'direct') {
  this.analytics.views += 1;
  this.analytics.lastViewed = new Date();

  if (userId) {
    // Avoid duplicate view entries from same user within 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentView = this.analytics.viewHistory.find(
      (view) => view.user && view.user.toString() === userId.toString() && view.viewedAt > oneDayAgo
    );

    if (!recentView) {
      this.analytics.viewHistory.push({
        user: userId,
        viewedAt: new Date(),
        source
      });

      // Keep only last 100 view history entries
      if (this.analytics.viewHistory.length > 100) {
        this.analytics.viewHistory = this.analytics.viewHistory.slice(-100);
      }
    }
  }

  return this.save();
};

// Static method to find nearby properties
propertySchema.statics.findNearby = function (longitude, latitude, maxDistance = 5000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // meters
      }
    },
    status: 'available',
    visibility: 'public',
    isDeleted: false
  });
};

// Static method for advanced search
propertySchema.statics.advancedSearch = function (filters) {
  const query = { isDeleted: false };

  // Basic filters
  if (filters.city) query['address.city'] = new RegExp(filters.city, 'i');
  if (filters.area) query['address.area'] = new RegExp(filters.area, 'i');
  if (filters.propertyType) query.propertyType = { $in: filters.propertyType };
  if (filters.category) query.category = filters.category;
  if (filters.status) query.status = filters.status;

  // Rent range
  if (filters.minRent || filters.maxRent) {
    query['rental.monthlyRent'] = {};
    if (filters.minRent) query['rental.monthlyRent'].$gte = filters.minRent;
    if (filters.maxRent) query['rental.monthlyRent'].$lte = filters.maxRent;
  }

  // Bedrooms
  if (filters.bedrooms) {
    if (Array.isArray(filters.bedrooms)) {
      query['specifications.bedrooms'] = { $in: filters.bedrooms };
    } else {
      query['specifications.bedrooms'] = filters.bedrooms;
    }
  }

  // Area range
  if (filters.minArea || filters.maxArea) {
    query['specifications.area.carpet'] = {};
    if (filters.minArea) query['specifications.area.carpet'].$gte = filters.minArea;
    if (filters.maxArea) query['specifications.area.carpet'].$lte = filters.maxArea;
  }

  // Amenities
  if (filters.amenities && filters.amenities.length > 0) {
    query.$or = [
      { 'amenities.basic': { $in: filters.amenities } },
      { 'amenities.safety': { $in: filters.amenities } },
      { 'amenities.convenience': { $in: filters.amenities } },
      { 'amenities.recreational': { $in: filters.amenities } },
      { 'amenities.utilities': { $in: filters.amenities } }
    ];
  }

  // Furnishing
  if (filters.furnishing) {
    query['amenities.basic'] = { $in: filters.furnishing };
  }

  return this.find(query);
};

module.exports = mongoose.model('Property', propertySchema);
