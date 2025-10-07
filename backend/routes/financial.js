const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

// @desc    Get financial dashboard data
// @route   GET /api/financial/dashboard
// @access  Private
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    // Mock data - replace with actual database queries
    const financialData = {
      success: true,
      data: {
        totalCollected: 245800,
        pendingPayments: 18500,
        onlinePaymentsPercentage: 89,
        paymentSuccessRate: 98.2,
        monthlyRevenue: 245800,
        expenseRatio: 22,
        profitMargin: 78,
        growthRate: 12.5,
        invoicesGenerated: 156,
        invoicesPaid: 142,
        overdueInvoices: 8,
        collectionRate: 91,
        taxLiability: 45200,
        deductions: 12800,
        netPayable: 32400,
        filingStatus: 'On Track'
      }
    };

    res.status(200).json(financialData);
  } catch (error) {
    console.error('Financial dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch financial dashboard data'
    });
  }
});

// @desc    Get financial reports
// @route   GET /api/financial/reports
// @access  Private
router.get('/reports', authenticate, async (req, res) => {
  try {
    const { type = 'monthly' } = req.query;
    
    // Mock data - replace with actual database queries
    const reports = {
      success: true,
      data: {
        type,
        period: type === 'monthly' ? 'October 2025' : 'Q4 2025',
        totalRevenue: 245800,
        totalExpenses: 54076,
        netProfit: 191724,
        profitMargin: 78,
        transactions: [
          {
            id: 'txn_001',
            date: '2025-10-01',
            description: 'Rent Payment - Apt 101',
            amount: 25000,
            type: 'income'
          },
          {
            id: 'txn_002',
            date: '2025-10-02',
            description: 'Maintenance - Plumbing',
            amount: -2500,
            type: 'expense'
          }
        ]
      }
    };

    res.status(200).json(reports);
  } catch (error) {
    console.error('Financial reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch financial reports'
    });
  }
});

module.exports = router;