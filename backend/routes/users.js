const express = require('express');
const User = require('../models/User');
const { auth, isLandlord } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/landlords
// @desc    Get all verified landlords (public)
// @access  Public
router.get('/landlords', async (req, res) => {
  try {
    const { page = 1, limit = 10, city } = req.query;
    
    const query = {
      userType: 'landlord',
      isActive: true,
      isDocumentVerified: true
    };

    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }

    const landlords = await User.find(query)
      .select('firstName lastName address.city businessInfo.companyName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      landlords,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get landlords error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/profile/:id
// @desc    Get user public profile
// @access  Public
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('firstName lastName userType address.city businessInfo.companyName createdAt');

    if (!user || !user.isActive) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/dashboard/stats
// @desc    Get user dashboard statistics
// @access  Private
router.get('/dashboard/stats', auth, async (req, res) => {
  try {
    const stats = {
      profile: {
        emailVerified: req.user.isEmailVerified,
        phoneVerified: req.user.isPhoneVerified,
        documentVerified: req.user.isDocumentVerified
      }
    };

    if (req.user.userType === 'landlord') {
      const Property = require('../models/Property');
      
      const properties = await Property.aggregate([
        { $match: { landlord: req.user._id } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            rented: { $sum: { $cond: [{ $eq: ['$status', 'rented'] }, 1, 0] } },
            totalViews: { $sum: '$views' },
            totalInquiries: { $sum: '$inquiries' }
          }
        }
      ]);

      stats.properties = properties[0] || {
        total: 0,
        active: 0,
        rented: 0,
        totalViews: 0,
        totalInquiries: 0
      };
    }

    res.json({ stats });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;