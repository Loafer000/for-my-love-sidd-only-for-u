// Backend API endpoint for collecting beta feedback
const express = require('express');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Beta Feedback Schema (if using MongoDB)
const mongoose = require('mongoose');

const betaFeedbackSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  liked: {
    type: String,
    trim: true
  },
  difficult: {
    type: String,
    trim: true
  },
  wouldUse: {
    type: String,
    required: true,
    enum: ['definitely', 'probably', 'maybe', 'probably-not', 'definitely-not']
  },
  suggestions: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userAgent: String,
  url: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ipAddress: String
}, {
  timestamps: true
});

const BetaFeedback = mongoose.model('BetaFeedback', betaFeedbackSchema);

// Submit beta feedback
router.post('/beta-feedback', async (req, res) => {
  try {
    const {
      rating,
      liked,
      difficult,
      wouldUse,
      suggestions,
      email,
      timestamp,
      userAgent,
      url
    } = req.body;

    // Validate required fields
    if (!rating || !wouldUse) {
      return res.status(400).json({
        success: false,
        message: 'Rating and usage intention are required'
      });
    }

    // Create feedback entry
    const feedback = new BetaFeedback({
      rating: parseInt(rating),
      liked: liked || '',
      difficult: difficult || '',
      wouldUse,
      suggestions: suggestions || '',
      email: email || '',
      timestamp: new Date(timestamp),
      userAgent: userAgent || '',
      url: url || '',
      userId: req.user?.id || null, // If user is authenticated
      ipAddress: req.ip || req.connection.remoteAddress
    });

    await feedback.save();

    // Send notification email to admin (optional)
    if (process.env.ADMIN_EMAIL) {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransporter({
        // Your email configuration
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: `New Beta Feedback - Rating: ${rating}/10`,
        html: `
          <h2>New Beta Feedback Received</h2>
          <p><strong>Rating:</strong> ${rating}/10</p>
          <p><strong>Would Use:</strong> ${wouldUse}</p>
          <p><strong>What they liked:</strong> ${liked || 'Not provided'}</p>
          <p><strong>What was difficult:</strong> ${difficult || 'Not provided'}</p>
          <p><strong>Suggestions:</strong> ${suggestions || 'Not provided'}</p>
          <p><strong>Email:</strong> ${email || 'Not provided'}</p>
          <p><strong>URL:</strong> ${url}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        `
      });
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      feedbackId: feedback._id
    });

  } catch (error) {
    console.error('Beta feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
});

// Get beta feedback analytics (admin only)
router.get('/beta-analytics', authenticate, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const totalFeedback = await BetaFeedback.countDocuments();
    
    const averageRating = await BetaFeedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalResponses: { $sum: 1 }
        }
      }
    ]);

    const usageIntention = await BetaFeedback.aggregate([
      {
        $group: {
          _id: '$wouldUse',
          count: { $sum: 1 }
        }
      }
    ]);

    const ratingDistribution = await BetaFeedback.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    const recentFeedback = await BetaFeedback.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-userAgent -ipAddress');

    res.json({
      success: true,
      analytics: {
        totalFeedback,
        averageRating: averageRating[0]?.avgRating || 0,
        usageIntention,
        ratingDistribution,
        recentFeedback
      }
    });

  } catch (error) {
    console.error('Beta analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics'
    });
  }
});

// Export feedback data (admin only)
router.get('/beta-export', authenticate, async (req, res) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const feedback = await BetaFeedback.find()
      .sort({ createdAt: -1 })
      .select('-userAgent -ipAddress');

    // Convert to CSV format
    const csv = [
      'Date,Rating,Liked,Difficult,Would Use,Suggestions,Email',
      ...feedback.map(f => [
        f.createdAt.toISOString().split('T')[0],
        f.rating,
        `"${f.liked?.replace(/"/g, '""') || ''}"`,
        `"${f.difficult?.replace(/"/g, '""') || ''}"`,
        f.wouldUse,
        `"${f.suggestions?.replace(/"/g, '""') || ''}"`,
        f.email || ''
      ].join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=beta-feedback.csv');
    res.send(csv);

  } catch (error) {
    console.error('Beta export error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export data'
    });
  }
});

module.exports = router;