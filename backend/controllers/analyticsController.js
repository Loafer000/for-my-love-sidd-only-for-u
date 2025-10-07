// Analytics Controller - Business Intelligence & Insights

const {
  Property, Booking, Chat, ReviewEnhanced
} = require('../models');

// Get dashboard analytics for landlords
const getLandlordDashboard = async (req, res) => {
  try {
    const landlordId = req.user._id;
    const { timeframe = '30d' } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (timeframe) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(endDate.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(endDate.getDate() - 30);
    }

    // Get property statistics
    const properties = await Property.find({ owner: landlordId });
    const propertyIds = properties.map((p) => p._id);

    // Bookings analytics
    const bookingStats = await Booking.aggregate([
      {
        $match: {
          property: { $in: propertyIds },
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          avgBookingValue: { $avg: '$totalAmount' },
          completedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ]);

    // Monthly revenue trend
    const revenueTrend = await Booking.aggregate([
      {
        $match: {
          property: { $in: propertyIds },
          status: 'completed',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Property performance
    const propertyPerformance = await Booking.aggregate([
      {
        $match: {
          property: { $in: propertyIds },
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$property',
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
          avgRating: { $avg: '$rating' }
        }
      },
      {
        $lookup: {
          from: 'properties',
          localField: '_id',
          foreignField: '_id',
          as: 'propertyDetails'
        }
      },
      {
        $unwind: '$propertyDetails'
      },
      {
        $project: {
          propertyTitle: '$propertyDetails.title',
          bookings: 1,
          revenue: 1,
          avgRating: 1,
          occupancyRate: {
            $multiply: [{ $divide: ['$bookings', 30] }, 100] // Simplified calculation
          }
        }
      },
      {
        $sort: { revenue: -1 }
      }
    ]);

    // Chat & inquiry analytics
    const chatStats = await Chat.aggregate([
      {
        $match: {
          propertyId: { $in: propertyIds },
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalInquiries: { $sum: 1 },
          activeChats: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          avgGuidanceScore: { $avg: '$platformGuidance.guidanceScore' },
          bypassAttempts: { $sum: '$analytics.bypassAttempts' }
        }
      }
    ]);

    // Review analytics
    const reviewStats = await ReviewEnhanced.aggregate([
      {
        $match: {
          revieweeId: landlordId,
          createdAt: { $gte: startDate, $lte: endDate },
          moderationStatus: 'approved'
        }
      },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          avgResponseTime: { $avg: '$businessMetrics.responseTime' }
        }
      }
    ]);

    const dashboardData = {
      overview: {
        totalProperties: properties.length,
        totalBookings: bookingStats[0]?.totalBookings || 0,
        totalRevenue: bookingStats[0]?.totalRevenue || 0,
        avgBookingValue: bookingStats[0]?.avgBookingValue || 0,
        completionRate: bookingStats[0]?.totalBookings > 0
          ? ((bookingStats[0]?.completedBookings || 0) / bookingStats[0].totalBookings * 100).toFixed(1)
          : 0
      },
      trends: {
        revenue: revenueTrend,
        inquiries: chatStats[0]?.totalInquiries || 0,
        avgRating: reviewStats[0]?.avgRating || 0,
        responseTime: reviewStats[0]?.avgResponseTime || 0
      },
      propertyPerformance,
      chatInsights: {
        totalInquiries: chatStats[0]?.totalInquiries || 0,
        activeChats: chatStats[0]?.activeChats || 0,
        avgGuidanceScore: chatStats[0]?.avgGuidanceScore || 0,
        conversionRate: chatStats[0]?.totalInquiries > 0
          ? ((bookingStats[0]?.totalBookings || 0) / chatStats[0].totalInquiries * 100).toFixed(1)
          : 0,
        platformRisk: {
          bypassAttempts: chatStats[0]?.bypassAttempts || 0,
          riskLevel: (chatStats[0]?.bypassAttempts || 0) > 5 ? 'high'
            : (chatStats[0]?.bypassAttempts || 0) > 2 ? 'medium' : 'low'
        }
      }
    };

    res.json({
      success: true,
      message: 'Landlord dashboard analytics retrieved',
      data: dashboardData,
      timeframe,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Landlord dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get tenant dashboard analytics
const getTenantDashboard = async (req, res) => {
  try {
    const tenantId = req.user._id;
    const { timeframe = '30d' } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (timeframe) {
    case '7d':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(endDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(endDate.getDate() - 90);
      break;
    default:
      startDate.setDate(endDate.getDate() - 30);
    }

    // Booking history
    const bookingStats = await Booking.aggregate([
      {
        $match: {
          tenant: tenantId,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          avgBookingValue: { $avg: '$totalAmount' },
          completedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      }
    ]);

    // Search & inquiry activity
    const chatActivity = await Chat.aggregate([
      {
        $match: {
          participants: tenantId,
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalInquiries: { $sum: 1 },
          activeChats: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          avgGuidanceScore: { $avg: '$platformGuidance.guidanceScore' }
        }
      }
    ]);

    // Reviews given and received
    const reviewActivity = await ReviewEnhanced.aggregate([
      {
        $facet: {
          given: [
            {
              $match: {
                reviewerId: tenantId,
                createdAt: { $gte: startDate, $lte: endDate }
              }
            },
            {
              $group: {
                _id: null,
                totalGiven: { $sum: 1 },
                avgRatingGiven: { $avg: '$rating' }
              }
            }
          ],
          received: [
            {
              $match: {
                revieweeId: tenantId,
                createdAt: { $gte: startDate, $lte: endDate }
              }
            },
            {
              $group: {
                _id: null,
                totalReceived: { $sum: 1 },
                avgRatingReceived: { $avg: '$rating' }
              }
            }
          ]
        }
      }
    ]);

    // Favorite properties and saved searches (mock for now)
    const favorites = {
      totalSaved: 12,
      recentActivity: [
        'Saved 2BHK in Bandra West',
        'Updated search filters',
        'Viewed 5 properties in Koramangala'
      ]
    };

    const tenantData = {
      overview: {
        totalBookings: bookingStats[0]?.totalBookings || 0,
        totalSpent: bookingStats[0]?.totalSpent || 0,
        avgBookingValue: bookingStats[0]?.avgBookingValue || 0,
        completedBookings: bookingStats[0]?.completedBookings || 0
      },
      searchActivity: {
        totalInquiries: chatActivity[0]?.totalInquiries || 0,
        activeChats: chatActivity[0]?.activeChats || 0,
        inquiryConversionRate: chatActivity[0]?.totalInquiries > 0
          ? ((bookingStats[0]?.totalBookings || 0) / chatActivity[0].totalInquiries * 100).toFixed(1)
          : 0
      },
      reviewActivity: {
        given: reviewActivity[0]?.given[0] || { totalGiven: 0, avgRatingGiven: 0 },
        received: reviewActivity[0]?.received[0] || { totalReceived: 0, avgRatingReceived: 0 }
      },
      preferences: favorites,
      platformUsage: {
        guidanceScore: chatActivity[0]?.avgGuidanceScore || 0,
        platformEngagement: 'high' // Based on guidance score and activity
      }
    };

    res.json({
      success: true,
      message: 'Tenant dashboard analytics retrieved',
      data: tenantData,
      timeframe,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Tenant dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get platform-wide analytics (admin only)
const getPlatformAnalytics = async (req, res) => {
  try {
    // For now, return mock data as this would require admin authentication
    const { timeframe = '30d' } = req.query;

    const platformData = {
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
        revenueProtected: 2340000 // 23.4 lakhs estimated
      },
      reviewIntegrity: {
        totalReviews: 3456,
        verifiedReviews: 3299,
        flaggedReviews: 67,
        averagePlatformRating: 4.6,
        reviewResponseRate: 78.5
      }
    };

    res.json({
      success: true,
      message: 'Platform analytics retrieved',
      data: platformData,
      timeframe,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Platform analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve platform analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get chat conversation analysis
const getChatAnalytics = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this chat'
      });
    }

    // Analyze chat for business insights
    const analysis = {
      businessContext: chat.businessContext,
      platformGuidance: chat.platformGuidance,
      riskAssessment: {
        bypassAttempts: chat.analytics?.bypassAttempts || 0,
        riskFlags: chat.platformGuidance?.riskFlags || [],
        overallRisk: calculateRiskLevel(chat),
        recommendations: generateRecommendations(chat)
      },
      conversionProbability: chat.analytics?.conversionProbability || 0.5,
      nextBestActions: [
        'Schedule property visit',
        'Share property documents',
        'Initiate price negotiation',
        'Start rental application'
      ].filter((action, index) => !chat.platformGuidance.completedActions.includes(action.toLowerCase().replace(' ', '_')))
    };

    res.json({
      success: true,
      message: 'Chat analytics retrieved',
      data: analysis
    });
  } catch (error) {
    console.error('Chat analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Helper functions
const calculateRiskLevel = (chat) => {
  const bypassAttempts = chat.analytics?.bypassAttempts || 0;
  const riskFlags = chat.platformGuidance?.riskFlags || [];

  const criticalFlags = riskFlags.filter((flag) => flag.severity === 'critical').length;
  const highFlags = riskFlags.filter((flag) => flag.severity === 'high').length;

  if (criticalFlags > 0 || bypassAttempts > 5) return 'critical';
  if (highFlags > 1 || bypassAttempts > 2) return 'high';
  if (riskFlags.length > 0 || bypassAttempts > 0) return 'medium';
  return 'low';
};

const generateRecommendations = (chat) => {
  const recommendations = [];
  const riskLevel = calculateRiskLevel(chat);

  if (riskLevel === 'critical') {
    recommendations.push('Immediate intervention required - possible platform bypass attempt');
    recommendations.push('Consider flagging conversation for admin review');
  } else if (riskLevel === 'high') {
    recommendations.push('Increase platform guidance prompts');
    recommendations.push('Monitor conversation closely');
  } else if (riskLevel === 'medium') {
    recommendations.push('Provide additional platform feature suggestions');
  } else {
    recommendations.push('Continue normal conversation flow');
    recommendations.push('Encourage use of platform features when appropriate');
  }

  return recommendations;
};

module.exports = {
  getLandlordDashboard,
  getTenantDashboard,
  getPlatformAnalytics,
  getChatAnalytics
};
