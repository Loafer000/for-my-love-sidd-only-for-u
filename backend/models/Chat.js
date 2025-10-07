// Chat Model - Smart Transaction-Focused Chat System

const mongoose = require('mongoose');

// Individual Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'document', 'system_guidance', 'platform_guidance', 'quick_action'],
    default: 'text'
  },
  content: {
    text: String,
    quickActions: [{
      type: String,
      label: String,
      requiresPlatform: Boolean,
      data: mongoose.Schema.Types.Mixed
    }],
    urgency: {
      type: String,
      enum: ['normal', 'high', 'critical'],
      default: 'normal'
    }
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'document', 'video']
    },
    url: String,
    filename: String,
    size: Number
  }],
  businessFlags: [{
    type: String,
    enum: [
      'price_discussion',
      'visit_request', 
      'booking_intent',
      'payment_discussion',
      'contact_exchange_attempt',
      'platform_guidance',
      'negotiation_started',
      'application_started',
      'visit_scheduled'
    ]
  }],
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  editedAt: Date,
  deletedAt: Date,
  isEdited: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Main Chat Schema
const chatSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  chatType: {
    type: String,
    enum: ['general', 'booking_inquiry', 'visit_request', 'price_negotiation', 'support'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'blocked', 'completed'],
    default: 'active'
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatMessage'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  messageCount: {
    type: Number,
    default: 0
  },
  
  // Business Intelligence Fields
  businessContext: {
    inquiryType: {
      type: String,
      enum: ['general', 'booking', 'visit', 'negotiation', 'complaint']
    },
    propertyPrice: Number,
    createdFromBooking: {
      type: Boolean,
      default: false
    },
    relatedBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    negotiationStatus: {
      type: String,
      enum: ['none', 'initiated', 'in_progress', 'agreed', 'rejected'],
      default: 'none'
    },
    finalAgreedPrice: Number
  },

  // Platform Guidance System
  platformGuidance: {
    stage: {
      type: String,
      enum: [
        'initial_inquiry',
        'price_negotiation', 
        'visit_scheduling',
        'application_process',
        'payment_setup',
        'completed'
      ],
      default: 'initial_inquiry'
    },
    suggestedActions: [String],
    completedActions: [String],
    guidanceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    riskFlags: [{
      type: String,
      severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      },
      detectedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Analytics & Monitoring
  analytics: {
    totalMessages: {
      type: Number,
      default: 0
    },
    avgResponseTime: Number, // in minutes
    platformActionsUsed: Number,
    bypassAttempts: {
      type: Number,
      default: 0
    },
    conversionProbability: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    },
    lastAnalyzed: Date
  },

  // Security & Compliance
  moderationFlags: [{
    type: {
      type: String,
      enum: ['spam', 'inappropriate', 'fraud_attempt', 'contact_sharing', 'external_payment']
    },
    flaggedAt: {
      type: Date,
      default: Date.now
    },
    flaggedBy: {
      type: String,
      enum: ['system', 'user_report', 'admin']
    },
    resolved: {
      type: Boolean,
      default: false
    }
  }],

  archivedAt: Date,
  archivedReason: String
}, {
  timestamps: true
});

// Indexes for better performance
chatSchema.index({ participants: 1, status: 1 });
chatSchema.index({ propertyId: 1, status: 1 });
chatSchema.index({ lastActivity: -1 });
chatSchema.index({ 'businessContext.inquiryType': 1 });
chatSchema.index({ 'platformGuidance.stage': 1 });

chatMessageSchema.index({ chatId: 1, createdAt: -1 });
chatMessageSchema.index({ senderId: 1 });
chatMessageSchema.index({ businessFlags: 1 });
chatMessageSchema.index({ readBy: 1 });

// Virtual for unread message count (computed in controller for performance)
chatSchema.virtual('unreadCount').get(function() {
  return 0; // Computed in controller
});

// Pre-save hooks
chatSchema.pre('save', function(next) {
  if (this.isModified('lastActivity') || this.isNew) {
    this.lastActivity = new Date();
  }
  next();
});

chatMessageSchema.pre('save', function(next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editedAt = new Date();
  }
  next();
});

// Static methods for business intelligence
chatSchema.statics.getAnalytics = function(timeframe = '7d') {
  // Implementation for chat analytics
  return this.aggregate([
    // Analytics pipeline will go here
  ]);
};

chatSchema.statics.detectRiskChats = function() {
  return this.find({
    $or: [
      { 'analytics.bypassAttempts': { $gt: 2 } },
      { 'moderationFlags.type': 'contact_sharing' },
      { 'platformGuidance.riskFlags.severity': { $in: ['high', 'critical'] } }
    ]
  });
};

// Instance methods
chatSchema.methods.calculateGuidanceScore = function() {
  let score = 0;
  const maxActions = this.platformGuidance.suggestedActions.length;
  const completedActions = this.platformGuidance.completedActions.length;
  
  if (maxActions > 0) {
    score = (completedActions / maxActions) * 100;
  }
  
  // Adjust for risk flags
  const riskPenalty = this.platformGuidance.riskFlags.length * 10;
  score = Math.max(0, score - riskPenalty);
  
  this.platformGuidance.guidanceScore = score;
  return score;
};

chatSchema.methods.addRiskFlag = function(flagType, severity = 'medium') {
  this.platformGuidance.riskFlags.push({
    type: flagType,
    severity,
    detectedAt: new Date()
  });
  
  this.analytics.bypassAttempts += 1;
  this.calculateGuidanceScore();
};

const Chat = mongoose.model('Chat', chatSchema);
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = { Chat, ChatMessage };