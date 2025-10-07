const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Booking Identification
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Core References
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property reference is required']
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Tenant reference is required']
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Landlord reference is required']
  },
  
  // Booking Dates
  dates: {
    moveInDate: {
      type: Date,
      required: [true, 'Move-in date is required']
    },
    moveOutDate: {
      type: Date,
      validate: {
        validator: function(value) {
          return !value || value > this.dates.moveInDate;
        },
        message: 'Move-out date must be after move-in date'
      }
    },
    leaseDuration: {
      months: {
        type: Number,
        required: [true, 'Lease duration is required'],
        min: [1, 'Lease duration must be at least 1 month']
      }
    },
    actualMoveInDate: Date,
    actualMoveOutDate: Date
  },
  
  // Booking Status Management
  status: {
    type: String,
    enum: {
      values: [
        'pending',           // Initial booking request
        'landlord-review',   // Awaiting landlord approval
        'approved',          // Landlord approved
        'rejected',          // Landlord rejected
        'payment-pending',   // Awaiting payment
        'payment-failed',    // Payment failed
        'confirmed',         // Booking confirmed (payment successful)
        'active',           // Tenant moved in
        'completed',        // Lease completed normally
        'cancelled',        // Cancelled by either party
        'terminated',       // Early termination
        'disputed'          // Under dispute
      ],
      message: 'Invalid booking status'
    },
    default: 'pending'
  },
  
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    reason: String,
    notes: String
  }],
  
  // Financial Information
  financial: {
    monthlyRent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: [1, 'Monthly rent must be positive']
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
      frequency: {
        type: String,
        enum: ['monthly', 'quarterly', 'yearly'],
        default: 'monthly'
      },
      includedInRent: {
        type: Boolean,
        default: false
      }
    },
    brokerage: {
      amount: {
        type: Number,
        default: 0
      },
      paidBy: {
        type: String,
        enum: ['tenant', 'landlord'],
        default: 'tenant'
      },
      paid: {
        type: Boolean,
        default: false
      }
    },
    totalAmount: {
      type: Number,
      required: true
    },
    
    // Additional charges/discounts
    additionalCharges: [{
      name: String,
      amount: Number,
      description: String
    }],
    
    discounts: [{
      name: String,
      amount: Number,
      percentage: Number,
      description: String,
      code: String
    }]
  },
  
  // Payment Information
  payments: [{
    type: {
      type: String,
      enum: [
        'security-deposit',
        'first-month-rent',
        'brokerage',
        'maintenance',
        'monthly-rent',
        'penalty',
        'refund'
      ],
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    dueDate: Date,
    paidDate: Date,
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially-paid'],
      default: 'pending'
    },
    paymentId: String,  // From payment gateway
    orderId: String,    // From payment gateway
    method: {
      type: String,
      enum: ['online', 'cash', 'cheque', 'bank-transfer', 'upi', 'card']
    },
    gateway: {
      type: String,
      enum: ['razorpay', 'paytm', 'phonepe', 'gpay', 'manual']
    },
    transactionId: String,
    receipt: String,
    notes: String
  }],
  
  // Agreement & Documents
  agreement: {
    templateUsed: String,
    customTerms: [String],
    generatedAt: Date,
    signedByTenant: {
      signed: {
        type: Boolean,
        default: false
      },
      signedAt: Date,
      ipAddress: String,
      digitalSignature: String
    },
    signedByLandlord: {
      signed: {
        type: Boolean,
        default: false
      },
      signedAt: Date,
      ipAddress: String,
      digitalSignature: String
    },
    documentUrl: String,
    documentId: String // Cloudinary or storage ID
  },
  
  documents: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: [
        'rental-agreement',
        'id-proof',
        'income-proof',
        'police-verification',
        'previous-noc',
        'bank-statement',
        'employment-letter',
        'other'
      ]
    },
    url: {
      type: String,
      required: true
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date
  }],
  
  // Communication & Notes
  communication: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['message', 'status-update', 'payment-reminder', 'system'],
      default: 'message'
    },
    read: {
      type: Boolean,
      default: false
    },
    attachments: [{
      name: String,
      url: String,
      type: String
    }]
  }],
  
  // Approval & Rejection
  landlordResponse: {
    approved: Boolean,
    respondedAt: Date,
    reason: String,
    notes: String,
    conditions: [String]
  },
  
  // Inspection & Move-in
  inspection: {
    scheduled: {
      type: Boolean,
      default: false
    },
    scheduledDate: Date,
    completed: {
      type: Boolean,
      default: false
    },
    completedDate: Date,
    report: String,
    photos: [{
      url: String,
      caption: String,
      takenAt: Date
    }],
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    },
    notes: String
  },
  
  // Cancellation & Termination
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    reason: {
      type: String,
      enum: [
        'tenant-request',
        'landlord-request',
        'payment-failure',
        'breach-of-terms',
        'mutual-agreement',
        'force-majeure',
        'other'
      ]
    },
    description: String,
    refund: {
      eligible: Boolean,
      amount: Number,
      processed: Boolean,
      processedAt: Date,
      refundId: String
    },
    penalty: {
      applicable: Boolean,
      amount: Number,
      reason: String
    }
  },
  
  // Reviews & Feedback (Post-booking)
  review: {
    tenantReview: {
      rating: {
        overall: Number,
        property: Number,
        landlord: Number,
        location: Number,
        amenities: Number
      },
      comment: String,
      reviewedAt: Date
    },
    landlordReview: {
      rating: {
        overall: Number,
        tenant: Number,
        cleanliness: Number,
        communication: Number,
        compliance: Number
      },
      comment: String,
      reviewedAt: Date
    }
  },
  
  // Analytics & Tracking
  analytics: {
    source: {
      type: String,
      enum: ['website', 'mobile-app', 'phone', 'walk-in', 'referral'],
      default: 'website'
    },
    device: String,
    browser: String,
    referrer: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String
  },
  
  // Renewal Information
  renewal: {
    eligible: {
      type: Boolean,
      default: false
    },
    requested: {
      type: Boolean,
      default: false
    },
    requestedAt: Date,
    newTerms: {
      monthlyRent: Number,
      leaseDuration: Number,
      moveOutDate: Date
    },
    approved: Boolean,
    approvedAt: Date
  },
  
  // Emergency Contacts
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String,
    address: String
  },
  
  // Special Conditions
  specialConditions: [{
    condition: String,
    agreedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
bookingSchema.index({ bookingId: 1 }, { unique: true });
bookingSchema.index({ property: 1 });
bookingSchema.index({ tenant: 1 });
bookingSchema.index({ landlord: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'dates.moveInDate': 1 });
bookingSchema.index({ 'dates.moveOutDate': 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ 'payments.status': 1 });
bookingSchema.index({ 'payments.dueDate': 1 });

// Compound indexes
bookingSchema.index({ tenant: 1, status: 1 });
bookingSchema.index({ landlord: 1, status: 1 });
bookingSchema.index({ property: 1, status: 1 });
bookingSchema.index({ status: 1, 'dates.moveInDate': 1 });

// Virtual for booking duration in days
bookingSchema.virtual('durationDays').get(function() {
  if (this.dates.moveInDate && this.dates.moveOutDate) {
    const diffTime = Math.abs(this.dates.moveOutDate - this.dates.moveInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Virtual for total pending amount
bookingSchema.virtual('pendingAmount').get(function() {
  return this.payments
    .filter(payment => payment.status === 'pending')
    .reduce((total, payment) => total + payment.amount, 0);
});

// Virtual for total paid amount
bookingSchema.virtual('paidAmount').get(function() {
  return this.payments
    .filter(payment => payment.status === 'paid')
    .reduce((total, payment) => total + payment.amount, 0);
});

// Virtual for current payment status
bookingSchema.virtual('paymentStatus').get(function() {
  const totalAmount = this.financial.totalAmount;
  const paidAmount = this.paidAmount;
  
  if (paidAmount === 0) return 'unpaid';
  if (paidAmount >= totalAmount) return 'paid';
  return 'partially-paid';
});

// Pre-save middleware
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Generate booking ID if not exists
  if (!this.bookingId) {
    this.generateBookingId();
  }
  
  // Calculate move-out date if not provided
  if (!this.dates.moveOutDate && this.dates.moveInDate && this.dates.leaseDuration.months) {
    const moveOut = new Date(this.dates.moveInDate);
    moveOut.setMonth(moveOut.getMonth() + this.dates.leaseDuration.months);
    this.dates.moveOutDate = moveOut;
  }
  
  next();
});

// Method to generate unique booking ID
bookingSchema.methods.generateBookingId = function() {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  
  this.bookingId = `BK${year}${month}${random}`;
};

// Method to update booking status
bookingSchema.methods.updateStatus = function(newStatus, changedBy, reason = '', notes = '') {
  const oldStatus = this.status;
  this.status = newStatus;
  
  // Add to status history
  this.statusHistory.push({
    status: newStatus,
    changedBy: changedBy,
    changedAt: new Date(),
    reason: reason,
    notes: notes
  });
  
  // Auto-update based on status
  if (newStatus === 'active' && !this.dates.actualMoveInDate) {
    this.dates.actualMoveInDate = new Date();
  }
  
  if (['completed', 'cancelled', 'terminated'].includes(newStatus) && !this.dates.actualMoveOutDate) {
    this.dates.actualMoveOutDate = new Date();
  }
  
  return this.save();
};

// Method to add payment
bookingSchema.methods.addPayment = function(paymentData) {
  this.payments.push({
    ...paymentData,
    status: paymentData.status || 'pending'
  });
  
  return this.save();
};

// Method to update payment status
bookingSchema.methods.updatePaymentStatus = function(paymentId, status, transactionDetails = {}) {
  const payment = this.payments.id(paymentId);
  if (!payment) {
    throw new Error('Payment not found');
  }
  
  payment.status = status;
  if (status === 'paid') {
    payment.paidDate = new Date();
  }
  
  // Update transaction details
  Object.keys(transactionDetails).forEach(key => {
    if (payment.schema.paths[key]) {
      payment[key] = transactionDetails[key];
    }
  });
  
  return this.save();
};

// Method to calculate refund amount
bookingSchema.methods.calculateRefund = function() {
  const paidAmount = this.paidAmount;
  let refundAmount = 0;
  
  // Basic refund logic (can be customized)
  if (this.status === 'cancelled') {
    const daysSinceBooking = Math.ceil((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
    
    if (daysSinceBooking <= 1) {
      // Full refund within 24 hours
      refundAmount = paidAmount;
    } else if (daysSinceBooking <= 7) {
      // 80% refund within 7 days
      refundAmount = paidAmount * 0.8;
    } else if (daysSinceBooking <= 30) {
      // 50% refund within 30 days
      refundAmount = paidAmount * 0.5;
    } else {
      // Security deposit only
      refundAmount = this.financial.securityDeposit;
    }
  }
  
  return Math.max(0, refundAmount);
};

// Static method to find bookings by date range
bookingSchema.statics.findByDateRange = function(startDate, endDate, status = null) {
  const query = {
    $or: [
      {
        'dates.moveInDate': {
          $gte: startDate,
          $lte: endDate
        }
      },
      {
        'dates.moveOutDate': {
          $gte: startDate,
          $lte: endDate
        }
      }
    ]
  };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query);
};

// Static method for dashboard analytics
bookingSchema.statics.getDashboardStats = function(userId, userType = 'tenant') {
  const matchField = userType === 'tenant' ? 'tenant' : 'landlord';
  
  return this.aggregate([
    {
      $match: { [matchField]: userId }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$financial.totalAmount' }
      }
    }
  ]);
};

module.exports = mongoose.model('Booking', bookingSchema);