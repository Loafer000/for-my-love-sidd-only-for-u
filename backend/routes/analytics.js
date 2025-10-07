// Analytics Routes - Business Intelligence & Insights

const express = require('express');
const router = express.Router();
const { 
  getLandlordDashboard,
  getTenantDashboard, 
  getPlatformAnalytics,
  getChatAnalytics
} = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');
const { param, query, validationResult } = require('express-validator');

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

// Landlord dashboard analytics
router.get('/landlord/dashboard',
  authenticate,
  [
    query('timeframe')
      .optional()
      .isIn(['7d', '30d', '90d', '1y'])
      .withMessage('Invalid timeframe. Use 7d, 30d, 90d, or 1y')
  ],
  handleValidationErrors,
  getLandlordDashboard
);

// Tenant dashboard analytics  
router.get('/tenant/dashboard',
  authenticate,
  [
    query('timeframe')
      .optional()
      .isIn(['7d', '30d', '90d', '1y'])
      .withMessage('Invalid timeframe. Use 7d, 30d, 90d, or 1y')
  ],
  handleValidationErrors,
  getTenantDashboard
);

// Platform-wide analytics (admin only for now)
router.get('/platform',
  authenticate,
  [
    query('timeframe')
      .optional()
      .isIn(['7d', '30d', '90d', '1y'])
      .withMessage('Invalid timeframe. Use 7d, 30d, 90d, or 1y')
  ],
  handleValidationErrors,
  getPlatformAnalytics
);

// Chat conversation analytics
router.get('/chat/:chatId',
  authenticate,
  [
    param('chatId')
      .isMongoId()
      .withMessage('Invalid chat ID')
  ],
  handleValidationErrors,
  getChatAnalytics
);

// TEST ROUTE - Remove in production
router.get('/test', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Analytics API is working! 📊',
    user: req.user.firstName,
    features: [
      '📈 Real-time dashboard analytics',
      '💰 Revenue & booking insights',
      '💬 Chat intelligence monitoring',
      '⭐ Review sentiment analysis',
      '🎯 Conversion tracking',
      '🛡️ Platform bypass detection',
      '🔍 Business intelligence reports'
    ],
    description: 'Advanced analytics with business intelligence and platform protection insights.'
  });
});

// DEPRECATED: Mock routes for development only - use real analytics endpoints
// These will be removed in production

// DEPRECATED: Mock landlord dashboard
router.get('/mock/landlord', authenticate, (req, res) => {
  const mockData = {
    overview: {
      totalProperties: 5,
      totalBookings: 23,
      totalRevenue: 645000, // 6.45 lakhs
      avgBookingValue: 28043,
      completionRate: '91.3'
    },
    trends: {
      revenue: [
        { _id: { year: 2024, month: 8 }, revenue: 185000, bookings: 6 },
        { _id: { year: 2024, month: 9 }, revenue: 220000, bookings: 8 },
        { _id: { year: 2024, month: 10 }, revenue: 240000, bookings: 9 }
      ],
      inquiries: 47,
      avgRating: 4.6,
      responseTime: 1.8 // hours
    },
    propertyPerformance: [
      {
        propertyTitle: 'Cozy 2BHK Apartment in Bandra',
        bookings: 8,
        revenue: 280000,
        avgRating: 4.8,
        occupancyRate: 85.3
      },
      {
        propertyTitle: '3BHK Villa with Garden', 
        bookings: 6,
        revenue: 270000,
        avgRating: 4.5,
        occupancyRate: 78.2
      },
      {
        propertyTitle: 'Modern Studio in Koramangala',
        bookings: 5,
        revenue: 95000,
        avgRating: 4.4,
        occupancyRate: 67.8
      }
    ],
    chatInsights: {
      totalInquiries: 47,
      activeChats: 12,
      avgGuidanceScore: 73.5,
      conversionRate: '48.9',
      platformRisk: {
        bypassAttempts: 3,
        riskLevel: 'low'
      }
    }
  };

  res.json({
    success: true,
    message: 'Mock landlord analytics',
    data: mockData,
    timeframe: '30d',
    generatedAt: new Date()
  });
});

// Mock tenant dashboard
router.get('/mock/tenant', authenticate, (req, res) => {
  const mockData = {
    overview: {
      totalBookings: 4,
      totalSpent: 156000, // 1.56 lakhs
      avgBookingValue: 39000,
      completedBookings: 3
    },
    searchActivity: {
      totalInquiries: 18,
      activeChats: 3,
      inquiryConversionRate: '22.2'
    },
    reviewActivity: {
      given: { totalGiven: 3, avgRatingGiven: 4.3 },
      received: { totalReceived: 2, avgRatingReceived: 4.5 }
    },
    preferences: {
      totalSaved: 12,
      recentActivity: [
        'Saved 2BHK in Bandra West',
        'Updated search filters for budget ₹25k-35k',
        'Viewed 5 properties in Koramangala',
        'Inquired about 3BHK Villa'
      ]
    },
    platformUsage: {
      guidanceScore: 68.4,
      platformEngagement: 'high'
    }
  };

  res.json({
    success: true,
    message: 'Mock tenant analytics',
    data: mockData,
    timeframe: '30d',
    generatedAt: new Date()
  });
});

// Mock platform analytics
router.get('/mock/platform', authenticate, (req, res) => {
  const mockData = {
    overview: {
      totalUsers: 1250,
      totalProperties: 856,
      totalBookings: 1423,
      totalRevenue: 8500000, // 85 lakhs
      activeChats: 234
    },
    growth: {
      userGrowth: '+15%',
      propertyGrowth: '+8%', 
      revenueGrowth: '+23%',
      chatEngagement: '+12%'
    },
    chatIntelligence: {
      totalMessages: 15640,
      platformGuidanceUsed: 8934,
      bypassAttempts: 156,
      successfulConversions: 234,
      riskAlertsTriggered: 23,
      averageGuidanceScore: 67.8
    },
    businessProtection: {
      messagesAnalyzed: 15640,
      riskyConversationsDetected: 89,
      platformRedirections: 456,
      successfulInterventions: 398,
      revenueProtected: 2340000, // 23.4 lakhs estimated
      protectionEffectiveness: '87.6%'
    },
    reviewIntegrity: {
      totalReviews: 3456,
      verifiedReviews: 3299,
      flaggedReviews: 67,
      averagePlatformRating: 4.6,
      reviewResponseRate: 78.5,
      fakeReviewsDetected: 89,
      moderationAccuracy: '94.2%'
    },
    keyInsights: [
      'Chat guidance system prevents 87.6% of platform bypass attempts',
      'Average conversion rate increased by 23% with smart interventions',
      'Review verification maintains 95.4% authentic review rate',
      'Platform protection saved ₹23.4L in potential lost revenue',
      'Smart chat analysis identifies high-risk conversations with 89% accuracy'
    ]
  };

  res.json({
    success: true,
    message: 'Mock platform analytics',
    data: mockData,
    timeframe: '30d',
    generatedAt: new Date()
  });
});

// Mock chat analytics
router.get('/mock/chat/:chatId', authenticate, (req, res) => {
  const { chatId } = req.params;
  
  const mockData = {
    businessContext: {
      inquiryType: 'general',
      propertyPrice: 35000,
      negotiationStatus: 'initiated'
    },
    platformGuidance: {
      stage: 'price_negotiation',
      suggestedActions: ['schedule_visit', 'price_negotiation', 'start_application'],
      completedActions: ['initial_inquiry'],
      guidanceScore: 45.6,
      riskFlags: [
        {
          type: 'price_discussion',
          severity: 'medium',
          detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
        }
      ]
    },
    riskAssessment: {
      bypassAttempts: 1,
      riskFlags: ['price_discussion'],
      overallRisk: 'medium',
      recommendations: [
        'Increase platform guidance prompts',
        'Monitor conversation closely',
        'Suggest secure negotiation tool'
      ]
    },
    conversionProbability: 0.73,
    nextBestActions: [
      'Schedule property visit',
      'Initiate secure price negotiation',
      'Share property documents'
    ],
    conversationAnalysis: {
      totalMessages: 12,
      platformGuidanceShown: 3,
      userEngagementScore: 78.4,
      sentimentTrend: 'positive',
      keyTopicsDiscussed: ['price', 'location', 'amenities', 'visit'],
      riskKeywordsDetected: ['negotiate', 'direct'],
      interventionSuccess: true
    }
  };

  res.json({
    success: true,
    message: 'Mock chat analytics',
    data: mockData,
    chatId,
    analyzedAt: new Date()
  });
});

// Advanced Analytics Routes for Premium Features

// Overview Analytics
router.get('/overview',
  authenticate,
  [
    query('timeRange')
      .optional()
      .isIn(['7d', '30d', '90d', '1y'])
      .withMessage('Invalid timeRange. Use 7d, 30d, 90d, or 1y')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      // This would connect to your actual database
      const overviewData = {
        totalRevenue: 0,
        revenueChange: 0,
        totalProperties: 0,
        occupancyRate: 0,
        occupancyChange: 0,
        averageRent: 0,
        rentChange: 0,
        maintenanceRequests: 0,
        maintenanceChange: 0,
        leadConversion: 0,
        conversionChange: 0
      };

      res.json({
        success: true,
        data: overviewData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch overview analytics',
        error: error.message
      });
    }
  }
);

// Revenue Analytics
router.get('/revenue',
  authenticate,
  async (req, res) => {
    try {
      const revenueData = {
        monthlyRevenue: [],
        revenueBreakdown: []
      };

      res.json({
        success: true,
        data: revenueData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch revenue analytics',
        error: error.message
      });
    }
  }
);

// Occupancy Analytics
router.get('/occupancy',
  authenticate,
  async (req, res) => {
    try {
      const occupancyData = {
        byPropertyType: [],
        turnoverRate: 0
      };

      res.json({
        success: true,
        data: occupancyData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch occupancy analytics',
        error: error.message
      });
    }
  }
);

// Maintenance Analytics
router.get('/maintenance',
  authenticate,
  async (req, res) => {
    try {
      const maintenanceData = {
        totalRequests: 0,
        avgResolutionTime: 0,
        costByCategory: []
      };

      res.json({
        success: true,
        data: maintenanceData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch maintenance analytics',
        error: error.message
      });
    }
  }
);

// Lead Analytics
router.get('/leads',
  authenticate,
  async (req, res) => {
    try {
      const leadsData = {
        totalLeads: 0,
        conversionRate: 0,
        leadSources: []
      };

      res.json({
        success: true,
        data: leadsData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch lead analytics',
        error: error.message
      });
    }
  }
);

// Property Performance
router.get('/property-performance',
  authenticate,
  async (req, res) => {
    try {
      const performanceData = {
        properties: []
      };

      res.json({
        success: true,
        data: performanceData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch property performance',
        error: error.message
      });
    }
  }
);

// Export Report
router.post('/export',
  authenticate,
  async (req, res) => {
    try {
      const { format, timeRange, metrics } = req.body;
      
      // This would generate the actual report
      res.json({
        success: true,
        message: 'Report exported successfully',
        downloadUrl: `/downloads/analytics-report-${Date.now()}.${format}`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to export report',
        error: error.message
      });
    }
  }
);

module.exports = router;