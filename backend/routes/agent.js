const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// @desc    Get agent performance dashboard data
// @route   GET /api/agent/dashboard
// @access  Private
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    // Mock agent data - replace with actual database queries
    const agentData = {
      success: true,
      data: {
        activeAgents: 24,
        topPerformer: 'Sarah Johnson',
        averageRating: 4.8,
        teamEfficiency: 92,
        propertiesSold: 47,
        totalValue: 52000000, // ₹5.2 Cr
        commissionEarned: 1560000, // ₹15.6 L
        conversionRate: 23.5,
        activeClients: 156,
        newLeads: 34,
        clientSatisfaction: 4.7,
        referralRate: 31,
        responseTime: 12, // minutes
        dealClosure: 18.5, // days
        followupsComplete: 94,
        revenueGrowth: 24.8
      }
    };

    res.status(200).json(agentData);
  } catch (error) {
    console.error('Agent dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agent dashboard data'
    });
  }
});

// @desc    Get agent performance data
// @route   GET /api/agent/performance
// @access  Private
router.get('/performance', authenticate, async (req, res) => {
  try {
    const performanceData = {
      success: true,
      data: {
        agents: [
          {
            id: 'agent_001',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@connectspace.com',
            phone: '+91-9876543210',
            rating: 4.9,
            totalSales: 12,
            totalValue: 15600000,
            commission: 468000,
            clientSatisfaction: 4.8,
            responseTime: 8, // minutes
            activeClients: 25,
            closureRate: 28.5
          },
          {
            id: 'agent_002',
            name: 'Mike Chen',
            email: 'mike.chen@connectspace.com',
            phone: '+91-9876543211',
            rating: 4.7,
            totalSales: 8,
            totalValue: 10400000,
            commission: 312000,
            clientSatisfaction: 4.6,
            responseTime: 15, // minutes
            activeClients: 18,
            closureRate: 22.1
          }
        ],
        performanceMetrics: {
          averageRating: 4.8,
          averageResponseTime: 12,
          averageClosureTime: 18.5,
          teamEfficiency: 92,
          totalCommissions: 1560000,
          monthlyGrowth: 24.8
        },
        leaderboard: [
          { agentId: 'agent_001', name: 'Sarah Johnson', sales: 12, commission: 468000 },
          { agentId: 'agent_002', name: 'Mike Chen', sales: 8, commission: 312000 },
          { agentId: 'agent_003', name: 'David Wilson', sales: 6, commission: 234000 }
        ]
      }
    };

    res.status(200).json(performanceData);
  } catch (error) {
    console.error('Agent performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agent performance data'
    });
  }
});

// @desc    Get agent sales data
// @route   GET /api/agent/sales
// @access  Private
router.get('/sales', authenticate, async (req, res) => {
  try {
    const salesData = {
      success: true,
      data: {
        salesOverview: {
          totalSales: 47,
          totalValue: 52000000,
          averageSaleValue: 1106383,
          conversionRate: 23.5,
          monthlyTarget: 50,
          targetProgress: 94
        },
        recentSales: [
          {
            id: 'sale_001',
            propertyId: 'prop_001',
            propertyName: 'Luxury Apartment - Sector 15',
            salePrice: 3500000,
            agentId: 'agent_001',
            agentName: 'Sarah Johnson',
            clientName: 'Rajesh Kumar',
            saleDate: '2025-10-03',
            commission: 105000
          },
          {
            id: 'sale_002',
            propertyId: 'prop_002',
            propertyName: 'Villa - Green Valley',
            salePrice: 5200000,
            agentId: 'agent_002',
            agentName: 'Mike Chen',
            clientName: 'Priya Sharma',
            saleDate: '2025-10-02',
            commission: 156000
          }
        ],
        salesPipeline: [
          { stage: 'Lead Generation', count: 87, value: 10440000 },
          { stage: 'Qualification', count: 65, value: 7800000 },
          { stage: 'Proposal', count: 42, value: 5040000 },
          { stage: 'Negotiation', count: 28, value: 3360000 },
          { stage: 'Closing', count: 15, value: 1800000 }
        ]
      }
    };

    res.status(200).json(salesData);
  } catch (error) {
    console.error('Agent sales error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agent sales data'
    });
  }
});

// @desc    Get agent client data
// @route   GET /api/agent/clients
// @access  Private
router.get('/clients', authenticate, async (req, res) => {
  try {
    const clientData = {
      success: true,
      data: {
        clientOverview: {
          totalClients: 156,
          activeClients: 89,
          newLeadsThisWeek: 34,
          avgClientSatisfaction: 4.7,
          referralRate: 31
        },
        clients: [
          {
            id: 'client_001',
            name: 'Rajesh Kumar',
            email: 'rajesh.kumar@email.com',
            phone: '+91-9876543212',
            assignedAgent: 'agent_001',
            status: 'active',
            interestedIn: 'Buying',
            budget: { min: 3000000, max: 5000000 },
            lastContact: '2025-10-04',
            satisfaction: 4.8,
            source: 'Website'
          },
          {
            id: 'client_002',
            name: 'Priya Sharma',
            email: 'priya.sharma@email.com',
            phone: '+91-9876543213',
            assignedAgent: 'agent_002',
            status: 'converted',
            interestedIn: 'Renting',
            budget: { min: 25000, max: 35000 },
            lastContact: '2025-10-02',
            satisfaction: 4.9,
            source: 'Referral'
          }
        ],
        leadSources: [
          { source: 'Website', count: 45, percentage: 28.8 },
          { source: 'Referral', count: 38, percentage: 24.4 },
          { source: 'Social Media', count: 32, percentage: 20.5 },
          { source: 'Walk-in', count: 25, percentage: 16.0 },
          { source: 'Other', count: 16, percentage: 10.3 }
        ]
      }
    };

    res.status(200).json(clientData);
  } catch (error) {
    console.error('Agent client error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agent client data'
    });
  }
});

module.exports = router;