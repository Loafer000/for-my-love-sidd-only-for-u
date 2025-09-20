const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  // Property Reference
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  
  // Tenant Info
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Contact Details (for non-registered users)
  contactInfo: {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
    }
  },
  
  // Inquiry Details
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  
  // Inquiry Type
  inquiryType: {
    type: String,
    enum: ['viewing', 'pricing', 'availability', 'general'],
    default: 'general'
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'responded', 'closed'],
    default: 'pending'
  },
  
  // Response from landlord
  response: {
    message: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Priority
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // Source
  source: {
    type: String,
    enum: ['website', 'mobile', 'api'],
    default: 'website'
  }
}, {
  timestamps: true
});

// Indexes
inquirySchema.index({ property: 1, createdAt: -1 });
inquirySchema.index({ tenant: 1, createdAt: -1 });
inquirySchema.index({ status: 1 });
inquirySchema.index({ 'contactInfo.email': 1 });

// Virtual for landlord access
inquirySchema.virtual('landlord', {
  ref: 'Property',
  localField: 'property',
  foreignField: '_id',
  justOne: true
});

// Method to mark as responded
inquirySchema.methods.markAsResponded = function(responseMessage, responderId) {
  this.status = 'responded';
  this.response = {
    message: responseMessage,
    respondedAt: new Date(),
    respondedBy: responderId
  };
  return this.save();
};

// Static method to get inquiries for landlord
inquirySchema.statics.getInquiriesForLandlord = function(landlordId) {
  return this.aggregate([
    {
      $lookup: {
        from: 'properties',
        localField: 'property',
        foreignField: '_id',
        as: 'propertyInfo'
      }
    },
    {
      $match: {
        'propertyInfo.landlord': mongoose.Types.ObjectId(landlordId)
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);
};

module.exports = mongoose.model('Inquiry', inquirySchema);