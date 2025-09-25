const express = require('express');
const Property = require('../models/Property');
const { auth, isLandlord } = require('../middleware/auth');
const { validateProperty } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/properties
// @desc    Get all properties with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      city,
      propertyType,
      minRent,
      maxRent,
      minSize,
      maxSize,
      amenities,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filters = {
      status: 'active',
      isAvailable: true
    };

    if (city) filters['address.city'] = new RegExp(city, 'i');
    if (propertyType) filters.propertyType = propertyType;
    
    if (minRent || maxRent) {
      filters['rent.monthly'] = {};
      if (minRent) filters['rent.monthly'].$gte = parseInt(minRent);
      if (maxRent) filters['rent.monthly'].$lte = parseInt(maxRent);
    }

    if (minSize || maxSize) {
      filters.size = {};
      if (minSize) filters.size.$gte = parseInt(minSize);
      if (maxSize) filters.size.$lte = parseInt(maxSize);
    }

    if (amenities) {
      const amenityArray = amenities.split(',');
      filters.amenities = { $in: amenityArray };
    }

    // Text search
    if (search) {
      filters.$text = { $search: search };
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const properties = await Property.find(filters)
      .populate('landlord', 'firstName lastName phone email')
      .select('-documents') // Don't include documents in list view
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const total = await Property.countDocuments(filters);

    res.json({
      properties,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/properties/:id
// @desc    Get single property
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('landlord', 'firstName lastName phone email businessInfo.companyName');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Increment view count
    await property.incrementViews();

    res.json({ property });

  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/properties
// @desc    Create new property
// @access  Private (Landlord only)
router.post('/', auth, isLandlord, validateProperty, async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      landlord: req.user._id
    };

    const property = new Property(propertyData);
    await property.save();

    await property.populate('landlord', 'firstName lastName phone email');

    res.status(201).json({
      message: 'Property created successfully',
      property
    });

  } catch (error) {
    console.error('Create property error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update property
// @access  Private (Property owner only)
router.put('/:id', auth, isLandlord, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user owns the property
    if (property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('landlord', 'firstName lastName phone email');

    res.json({
      message: 'Property updated successfully',
      property: updatedProperty
    });

  } catch (error) {
    console.error('Update property error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete property
// @access  Private (Property owner only)
router.delete('/:id', auth, isLandlord, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user owns the property
    if (property.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({ message: 'Property deleted successfully' });

  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/properties/landlord/my-properties
// @desc    Get landlord's properties
// @access  Private (Landlord only)
router.get('/landlord/my-properties', auth, isLandlord, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filters = { landlord: req.user._id };
    if (status) filters.status = status;

    const properties = await Property.find(filters)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(filters);

    res.json({
      properties,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });

  } catch (error) {
    console.error('Get my properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;