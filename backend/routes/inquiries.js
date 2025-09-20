const express = require('express');
const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const { auth, isLandlord } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation middleware for inquiry
const validateInquiry = [
  body('property').isMongoId().withMessage('Valid property ID is required'),
  body('contactInfo.name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('contactInfo.email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('contactInfo.phone').matches(/^[6-9]\d{9}$/).withMessage('Valid Indian phone number is required'),
  body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be 10-1000 characters'),
  body('inquiryType').optional().isIn(['viewing', 'pricing', 'availability', 'general']),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }
    next();
  }
];

// @route   POST /api/inquiries
// @desc    Create new inquiry
// @access  Public
router.post('/', validateInquiry, async (req, res) => {
  try {
    const { property: propertyId, contactInfo, message, inquiryType } = req.body;

    // Check if property exists and is available
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (!property.isAvailable || property.status !== 'active') {
      return res.status(400).json({ message: 'Property is not available for inquiries' });
    }

    // Create inquiry
    const inquiryData = {
      property: propertyId,
      contactInfo,
      message,
      inquiryType: inquiryType || 'general'
    };

    // If user is authenticated, add tenant reference
    if (req.user) {
      inquiryData.tenant = req.user._id;
    }

    const inquiry = new Inquiry(inquiryData);
    await inquiry.save();

    // Increment inquiry count on property
    await property.incrementInquiries();

    // Populate property info for response
    await inquiry.populate('property', 'title landlord');

    res.status(201).json({
      message: 'Inquiry sent successfully',
      inquiry: {
        id: inquiry._id,
        property: inquiry.property.title,
        status: inquiry.status,
        createdAt: inquiry.createdAt
      }
    });

  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/inquiries/landlord
// @desc    Get inquiries for landlord's properties
// @access  Private (Landlord only)
router.get('/landlord', auth, isLandlord, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, propertyId } = req.query;

    // Build aggregation pipeline
    const pipeline = [
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
          'propertyInfo.landlord': req.user._id
        }
      }
    ];

    // Add filters
    if (status) {
      pipeline.push({ $match: { status } });
    }

    if (propertyId) {
      pipeline.push({ $match: { property: mongoose.Types.ObjectId(propertyId) } });
    }

    // Add sorting and pagination
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    );

    const inquiries = await Inquiry.aggregate(pipeline);
    
    // Get total count for pagination
    const totalPipeline = [...pipeline.slice(0, -2)];
    totalPipeline.push({ $count: 'total' });
    const totalResult = await Inquiry.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;

    res.json({
      inquiries,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Get landlord inquiries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/inquiries/property/:propertyId
// @desc    Get inquiries for specific property
// @access  Private (Property owner only)
router.get('/property/:propertyId', auth, isLandlord, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Verify property ownership
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these inquiries' });
    }

    const inquiries = await Inquiry.find({ property: propertyId })
      .populate('tenant', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Inquiry.countDocuments({ property: propertyId });

    res.json({
      inquiries,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Get property inquiries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/inquiries/:id/respond
// @desc    Respond to inquiry
// @access  Private (Landlord only)
router.put('/:id/respond', auth, isLandlord, async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length < 10) {
      return res.status(400).json({ message: 'Response message must be at least 10 characters' });
    }

    const inquiry = await Inquiry.findById(id).populate('property');
    
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // Verify property ownership
    if (inquiry.property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this inquiry' });
    }

    // Mark as responded
    await inquiry.markAsResponded(message.trim(), req.user._id);

    res.json({
      message: 'Response sent successfully',
      inquiry: {
        id: inquiry._id,
        status: inquiry.status,
        response: inquiry.response
      }
    });

  } catch (error) {
    console.error('Respond to inquiry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/inquiries/my
// @desc    Get user's inquiries
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { tenant: req.user._id };
    if (status) query.status = status;

    const inquiries = await Inquiry.find(query)
      .populate('property', 'title address.city rent.monthly')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Inquiry.countDocuments(query);

    res.json({
      inquiries,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Get my inquiries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;