const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  
  // Property Details
  propertyType: {
    type: String,
    enum: ['office', 'retail', 'industrial', 'warehouse', 'showroom'],
    required: true
  },
  size: {
    type: Number,
    required: true,
    min: 1
  },
  sizeUnit: {
    type: String,
    enum: ['sqft', 'sqm'],
    default: 'sqft'
  },
  
  // Pricing
  rent: {
    monthly: {
      type: Number,
      required: true,
      min: 0
    },
    perSqft: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  securityDeposit: {
    type: Number,
    min: 0
  },
  
  // Location
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    area: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    pincode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, 'Please enter a valid pincode']
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    }
  },
  
  // Amenities
  amenities: [{
    type: String,
    enum: [
      'parking', 'ac', 'wifi', 'security', 'elevator', 'generator',
      'cafeteria', 'conference_room', 'reception', 'washroom',
      'fire_safety', 'cctv', 'intercom', 'water_supply'
    ]
  }],
  
  // Nearby Places
  nearbyPlaces: [{
    name: String,
    type: {
      type: String,
      enum: ['metro', 'bus_stop', 'hospital', 'school', 'bank', 'mall', 'restaurant']
    },
    distance: Number, // in meters
    walkingTime: Number // in minutes
  }],
  
  // Media
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
    }
  }],
  
  // Documents
  documents: [{
    type: {
      type: String,
      enum: ['sale_deed', 'property_tax', 'noc', 'building_plan', 'other'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    publicId: String,
    name: String,
    isVerified: {
      type: Boolean,
      default: false
    }
  }],
  
  // Landlord Info
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Verification Status
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'in_review', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationNotes: String,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  
  // Availability
  isAvailable: {
    type: Boolean,
    default: true
  },
  availableFrom: {
    type: Date,
    default: Date.now
  },
  
  // Lease Terms
  leaseTerms: {
    minimumLease: {
      type: Number, // in months
      min: 1,
      default: 11
    },
    maximumLease: {
      type: Number, // in months
      min: 1
    },
    noticePeriod: {
      type: Number, // in days
      default: 30
    }
  },
  
  // Statistics
  views: {
    type: Number,
    default: 0
  },
  inquiries: {
    type: Number,
    default: 0
  },
  
  // SEO
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'rented', 'inactive'],
    default: 'draft'
  },
  
  // Featured
  isFeatured: {
    type: Boolean,
    default: false
  },
  featuredUntil: Date
}, {
  timestamps: true
});

// Indexes for performance and search
propertySchema.index({ 'address.city': 1, propertyType: 1 });
propertySchema.index({ 'rent.monthly': 1 });
propertySchema.index({ size: 1 });
propertySchema.index({ isAvailable: 1, status: 1 });
propertySchema.index({ landlord: 1 });
propertySchema.index({ 'address.coordinates.latitude': 1, 'address.coordinates.longitude': 1 });
propertySchema.index({ slug: 1 });

// Text search index
propertySchema.index({
  title: 'text',
  description: 'text',
  'address.area': 'text',
  'address.city': 'text'
});

// Geospatial index for location-based queries
propertySchema.index({ 'address.coordinates': '2dsphere' });

// Pre-save middleware to generate slug
propertySchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + this._id.toString().slice(-6);
  }
  
  // Calculate per sqft rent
  if (this.isModified('rent.monthly') || this.isModified('size')) {
    this.rent.perSqft = Math.round(this.rent.monthly / this.size);
  }
  
  next();
});

// Method to increment view count
propertySchema.methods.incrementViews = function() {
  return this.updateOne({ $inc: { views: 1 } });
};

// Method to increment inquiry count
propertySchema.methods.incrementInquiries = function() {
  return this.updateOne({ $inc: { inquiries: 1 } });
};

// Method to get distance from a point
propertySchema.methods.getDistanceFrom = function(lat, lng) {
  if (!this.address.coordinates.latitude || !this.address.coordinates.longitude) {
    return null;
  }
  
  const R = 6371; // Earth's radius in km
  const dLat = (lat - this.address.coordinates.latitude) * Math.PI / 180;
  const dLng = (lng - this.address.coordinates.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.address.coordinates.latitude * Math.PI / 180) * 
    Math.cos(lat * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// Static method for search with filters
propertySchema.statics.searchProperties = function(filters) {
  const query = { status: 'active', isAvailable: true };
  
  if (filters.city) {
    query['address.city'] = new RegExp(filters.city, 'i');
  }
  
  if (filters.propertyType) {
    query.propertyType = filters.propertyType;
  }
  
  if (filters.minRent || filters.maxRent) {
    query['rent.monthly'] = {};
    if (filters.minRent) query['rent.monthly'].$gte = filters.minRent;
    if (filters.maxRent) query['rent.monthly'].$lte = filters.maxRent;
  }
  
  if (filters.minSize || filters.maxSize) {
    query.size = {};
    if (filters.minSize) query.size.$gte = filters.minSize;
    if (filters.maxSize) query.size.$lte = filters.maxSize;
  }
  
  if (filters.amenities && filters.amenities.length > 0) {
    query.amenities = { $in: filters.amenities };
  }
  
  return this.find(query).populate('landlord', 'firstName lastName phone email');
};

module.exports = mongoose.model('Property', propertySchema);