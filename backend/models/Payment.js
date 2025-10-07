const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Payment Identification
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  
  // References
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking reference is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property reference is required']
  },
  
  // Payment Details
  amount: {
    original: {
      type: Number,
      required: [true, 'Original amount is required'],
      min: [0.01, 'Amount must be positive']
    },
    final: {
      type: Number,
      required: [true, 'Final amount is required'],
      min: [0.01, 'Amount must be positive']
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR']
    }
  },
  
  // Payment Type
  type: {
    type: String,
    required: [true, 'Payment type is required'],
    enum: {
      values: [
        'booking-amount',      // Initial booking payment
        'security-deposit',    // Security deposit
        'monthly-rent',        // Regular monthly rent
        'maintenance',         // Maintenance charges
        'brokerage',          // Broker commission
        'penalty',            // Late payment penalty
        'utility-bills',      // Electricity, water, etc.
        'refund',             // Refund payment
        'advance-rent',       // Advance rent payment
        'token-amount',       // Token money
        'registration-fee',   // Registration charges
        'other'              // Other charges
      ],
      message: 'Invalid payment type'
    }
  },
  
  category: {
    type: String,
    enum: ['rent', 'deposit', 'fee', 'refund', 'penalty'],
    required: true
  },
  
  // Payment Status
  status: {
    type: String,
    enum: {
      values: [
        'initiated',      // Payment process started
        'pending',        // Awaiting payment
        'processing',     // Payment in progress
        'success',        // Payment successful
        'failed',         // Payment failed
        'cancelled',      // Payment cancelled
        'refunded',       // Payment refunded
        'partially-refunded', // Partial refund
        'disputed',       // Payment disputed
        'expired'         // Payment link expired
      ],
      message: 'Invalid payment status'
    },
    default: 'initiated'
  },
  
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    reason: String,
    notes: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Payment Gateway Details
  gateway: {
    provider: {
      type: String,
      enum: ['razorpay', 'paytm', 'phonepe', 'gpay', 'payu', 'cashfree', 'stripe', 'manual'],
      required: true
    },
    transactionId: String,        // Gateway transaction ID
    paymentId: String,           // Gateway payment ID
    signature: String,           // Payment signature for verification
    receipt: String,             // Receipt number
    
    // Gateway specific data
    razorpay: {
      paymentId: String,
      orderId: String,
      signature: String,
      paymentLinkId: String
    },
    
    paytm: {
      txnId: String,
      orderId: String,
      txnAmount: String,
      checksum: String
    },
    
    stripe: {
      paymentIntentId: String,
      chargeId: String,
      customerId: String
    }
  },
  
  // Payment Method
  method: {
    type: {
      type: String,
      enum: ['card', 'netbanking', 'upi', 'wallet', 'emi', 'bank-transfer', 'cash', 'cheque'],
      required: true
    },
    details: {
      // Card details (masked)
      card: {
        last4: String,
        brand: String,
        network: String,
        type: String,
        issuer: String
      },
      
      // Bank details
      bank: {
        name: String,
        ifsc: String,
        accountType: String
      },
      
      // UPI details
      upi: {
        vpa: String,
        app: String
      },
      
      // Wallet details
      wallet: {
        provider: String,
        walletId: String
      },
      
      // Cash/Cheque details
      offline: {
        referenceNumber: String,
        collectedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        collectedAt: Date,
        location: String
      }
    }
  },
  
  // Timing Information
  timing: {
    initiatedAt: {
      type: Date,
      default: Date.now
    },
    paidAt: Date,
    failedAt: Date,
    refundedAt: Date,
    dueDate: Date,
    expiresAt: Date,
    
    // Processing times
    processingTime: Number, // milliseconds
    gatewayResponseTime: Number // milliseconds
  },
  
  // Fees & Charges Breakdown
  breakdown: {
    baseAmount: {
      type: Number,
      required: true
    },
    
    taxes: [{
      name: {
        type: String,
        enum: ['GST', 'SGST', 'CGST', 'IGST', 'service-tax']
      },
      rate: Number,
      amount: Number
    }],
    
    fees: [{
      name: String,
      amount: Number,
      description: String
    }],
    
    discounts: [{
      name: String,
      amount: Number,
      percentage: Number,
      code: String,
      description: String
    }],
    
    gatewayCharges: {
      type: Number,
      default: 0
    },
    
    convenience: {
      fee: {
        type: Number,
        default: 0
      },
      tax: {
        type: Number,
        default: 0
      }
    }
  },
  
  // Refund Information
  refund: {
    eligible: {
      type: Boolean,
      default: true
    },
    amount: {
      type: Number,
      default: 0
    },
    processed: {
      type: Boolean,
      default: false
    },
    processedAt: Date,
    refundId: String,
    gatewayRefundId: String,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled']
    },
    estimatedDays: {
      type: Number,
      default: 7
    }
  },
  
  // Receipt & Documentation
  receipt: {
    number: {
      type: String,
      unique: true,
      sparse: true
    },
    url: String,
    generatedAt: Date,
    sentToEmail: {
      type: Boolean,
      default: false
    },
    sentAt: Date
  },
  
  // Verification & Security
  verification: {
    signature: String,
    checksumVerified: {
      type: Boolean,
      default: false
    },
    amountVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    ipAddress: String,
    userAgent: String
  },
  
  // Communication & Notifications
  notifications: [{
    type: {
      type: String,
      enum: ['sms', 'email', 'push', 'whatsapp']
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed']
    },
    sentAt: Date,
    template: String,
    recipient: String
  }],
  
  // Failure Information
  failure: {
    code: String,
    reason: String,
    description: String,
    source: {
      type: String,
      enum: ['gateway', 'bank', 'network', 'user', 'system']
    },
    retryable: {
      type: Boolean,
      default: true
    },
    retryCount: {
      type: Number,
      default: 0
    },
    lastRetryAt: Date
  },
  
  // Recurring Payment Information (for rent)
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly']
    },
    nextDueDate: Date,
    subscriptionId: String,
    autoDebit: {
      enabled: {
        type: Boolean,
        default: false
      },
      mandateId: String,
      bankAccount: String
    }
  },
  
  // Analytics & Tracking
  analytics: {
    source: {
      type: String,
      enum: ['web', 'mobile-app', 'payment-link', 'auto-debit', 'manual']
    },
    campaign: String,
    referrer: String,
    deviceInfo: {
      type: String,
      platform: String,
      browser: String,
      ip: String
    }
  },
  
  // Notes & Comments
  notes: [{
    text: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['system', 'user', 'admin'],
      default: 'user'
    }
  }],
  
  // Compliance & Audit
  compliance: {
    gstRequired: {
      type: Boolean,
      default: false
    },
    gstNumber: String,
    tdsDeducted: {
      amount: {
        type: Number,
        default: 0
      },
      rate: {
        type: Number,
        default: 0
      }
    },
    invoiceRequired: {
      type: Boolean,
      default: false
    },
    invoiceNumber: String
  },
  
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
paymentSchema.index({ paymentId: 1 }, { unique: true });
paymentSchema.index({ orderId: 1 }, { unique: true });
paymentSchema.index({ booking: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ property: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ type: 1 });
paymentSchema.index({ 'gateway.provider': 1 });
paymentSchema.index({ 'timing.paidAt': -1 });
paymentSchema.index({ 'timing.dueDate': 1 });
paymentSchema.index({ createdAt: -1 });

// Compound indexes
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ booking: 1, type: 1 });
paymentSchema.index({ status: 1, 'timing.dueDate': 1 });
paymentSchema.index({ 'gateway.provider': 1, status: 1 });

// Virtual for total amount after taxes and fees
paymentSchema.virtual('totalAmount').get(function() {
  return this.amount.final || this.amount.original;
});

// Virtual for tax amount
paymentSchema.virtual('totalTax').get(function() {
  return this.breakdown.taxes.reduce((total, tax) => total + tax.amount, 0);
});

// Virtual for discount amount
paymentSchema.virtual('totalDiscount').get(function() {
  return this.breakdown.discounts.reduce((total, discount) => total + discount.amount, 0);
});

// Virtual for payment age in days
paymentSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  return Math.floor((now - created) / (1000 * 60 * 60 * 24));
});

// Virtual for is overdue
paymentSchema.virtual('isOverdue').get(function() {
  if (!this.timing.dueDate || this.status === 'success') return false;
  return new Date() > this.timing.dueDate;
});

// Pre-save middleware
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Generate payment ID if not exists
  if (!this.paymentId) {
    this.generatePaymentId();
  }
  
  // Generate order ID if not exists
  if (!this.orderId) {
    this.generateOrderId();
  }
  
  // Generate receipt number if payment is successful and receipt doesn't exist
  if (this.status === 'success' && !this.receipt.number) {
    this.generateReceiptNumber();
  }
  
  next();
});

// Method to generate unique payment ID
paymentSchema.methods.generatePaymentId = function() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  this.paymentId = `PAY_${timestamp}_${random}`;
};

// Method to generate unique order ID
paymentSchema.methods.generateOrderId = function() {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  
  this.orderId = `ORD_${year}${month}${day}_${random}`;
};

// Method to generate receipt number
paymentSchema.methods.generateReceiptNumber = function() {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  
  this.receipt.number = `RCP_${year}${month}_${random}`;
  this.receipt.generatedAt = new Date();
};

// Method to update payment status
paymentSchema.methods.updateStatus = function(newStatus, reason = '', notes = '', updatedBy = null) {
  const oldStatus = this.status;
  this.status = newStatus;
  
  // Add to status history
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    reason: reason,
    notes: notes,
    updatedBy: updatedBy
  });
  
  // Update timing based on status
  const now = new Date();
  switch (newStatus) {
    case 'success':
      this.timing.paidAt = now;
      if (!this.receipt.number) {
        this.generateReceiptNumber();
      }
      break;
    case 'failed':
      this.timing.failedAt = now;
      break;
    case 'refunded':
    case 'partially-refunded':
      this.timing.refundedAt = now;
      this.refund.processed = true;
      this.refund.processedAt = now;
      break;
  }
  
  return this.save();
};

// Method to add note
paymentSchema.methods.addNote = function(text, addedBy, type = 'user') {
  this.notes.push({
    text: text,
    addedBy: addedBy,
    addedAt: new Date(),
    type: type
  });
  
  return this.save();
};

// Method to calculate refund amount
paymentSchema.methods.calculateRefund = function(percentage = 100) {
  const refundableAmount = this.amount.final - this.breakdown.gatewayCharges;
  return Math.round(refundableAmount * (percentage / 100));
};

// Method to initiate refund
paymentSchema.methods.initiateRefund = function(amount = null, reason = '') {
  if (!this.refund.eligible) {
    throw new Error('Payment is not eligible for refund');
  }
  
  const refundAmount = amount || this.calculateRefund();
  
  this.refund.amount = refundAmount;
  this.refund.reason = reason;
  this.refund.status = 'pending';
  
  return this.save();
};

// Static method to get payment statistics
paymentSchema.statics.getStatistics = function(filters = {}) {
  const pipeline = [
    { $match: filters },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount.final' },
        averageAmount: { $avg: '$amount.final' }
      }
    }
  ];
  
  return this.aggregate(pipeline);
};

// Static method to get revenue by period
paymentSchema.statics.getRevenueByPeriod = function(startDate, endDate, groupBy = 'day') {
  const groupFormat = {
    day: { $dateToString: { format: '%Y-%m-%d', date: '$timing.paidAt' } },
    month: { $dateToString: { format: '%Y-%m', date: '$timing.paidAt' } },
    year: { $dateToString: { format: '%Y', date: '$timing.paidAt' } }
  };
  
  return this.aggregate([
    {
      $match: {
        status: 'success',
        'timing.paidAt': { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: groupFormat[groupBy],
        totalRevenue: { $sum: '$amount.final' },
        totalTransactions: { $sum: 1 },
        averageAmount: { $avg: '$amount.final' }
      }
    },
    { $sort: { '_id': 1 } }
  ]);
};

// Static method to find overdue payments
paymentSchema.statics.findOverdue = function() {
  return this.find({
    status: { $in: ['pending', 'initiated'] },
    'timing.dueDate': { $lt: new Date() }
  }).populate('user booking property');
};

module.exports = mongoose.model('Payment', paymentSchema);