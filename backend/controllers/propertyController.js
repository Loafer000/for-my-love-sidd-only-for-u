const { Property } = require('../models');

// Get all properties with filters
exports.getProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      area,
      propertyType,
      minRent,
      maxRent,
      bedrooms,
      amenities,
      sort = '-createdAt'
    } = req.query;

    // Build filter object
    const filters = {
      status: 'available',
      visibility: 'public',
      isDeleted: false
    };

    if (city) filters['address.city'] = new RegExp(city, 'i');
    if (area) filters['address.area'] = new RegExp(area, 'i');
    if (propertyType) filters.propertyType = propertyType;
    if (bedrooms) filters['specifications.bedrooms'] = parseInt(bedrooms, 10);

    if (minRent || maxRent) {
      filters['rental.monthlyRent'] = {};
      if (minRent) filters['rental.monthlyRent'].$gte = parseInt(minRent, 10);
      if (maxRent) filters['rental.monthlyRent'].$lte = parseInt(maxRent, 10);
    }

    // Calculate pagination
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    // Execute query
    const properties = await Property.find(filters)
      .populate('owner', 'firstName lastName phone email profilePicture')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit, 10));

    // Get total count for pagination
    const total = await Property.countDocuments(filters);

    res.json({
      success: true,
      message: 'Properties retrieved successfully',
      data: {
        properties,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10)),
          totalProperties: total,
          hasNextPage: skip + properties.length < total,
          hasPrevPage: parseInt(page, 10) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve properties',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get single property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id)
      .populate('owner', 'firstName lastName phone email profilePicture documentVerified')
      .populate({
        path: 'analytics.viewHistory.user',
        select: 'firstName lastName'
      });

    if (!property || property.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Increment view count (if user is provided in auth)
    if (req.user) {
      await property.incrementViews(req.user._id, 'direct');
    } else {
      property.analytics.views += 1;
      property.analytics.lastViewed = new Date();
      await property.save();
    }

    res.json({
      success: true,
      message: 'Property retrieved successfully',
      data: { property }
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve property',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Create new property (requires authentication)
exports.createProperty = async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      owner: req.user._id
    };

    // Create property
    const property = new Property(propertyData);
    await property.save();

    // Populate owner data for response
    await property.populate('owner', 'firstName lastName phone email');

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: { property }
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create property',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update property (owner only)
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const property = await Property.findById(id);

    if (!property || property.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user owns the property
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    // Update property
    Object.keys(updates).forEach((key) => {
      property[key] = updates[key];
    });

    await property.save();

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: { property }
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update property',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Delete property (soft delete, owner only)
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property || property.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user owns the property
    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }

    // Soft delete
    property.isDeleted = true;
    property.deletedAt = new Date();
    property.status = 'inactive';
    await property.save();

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete property',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Search properties with advanced filters
exports.searchProperties = async (req, res) => {
  try {
    const searchFilters = req.body;

    const properties = await Property.advancedSearch(searchFilters)
      .populate('owner', 'firstName lastName profilePicture')
      .sort('-qualityScore -createdAt')
      .limit(50);

    res.json({
      success: true,
      message: 'Search completed successfully',
      data: {
        properties,
        count: properties.length,
        searchFilters
      }
    });
  } catch (error) {
    console.error('Search properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Find nearby properties
exports.findNearbyProperties = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required'
      });
    }

    const properties = await Property.findNearby(
      parseFloat(longitude),
      parseFloat(latitude),
      parseInt(maxDistance, 10)
    ).populate('owner', 'firstName lastName profilePicture');

    res.json({
      success: true,
      message: 'Nearby properties found',
      data: {
        properties,
        searchCenter: { longitude: parseFloat(longitude), latitude: parseFloat(latitude) },
        maxDistance: parseInt(maxDistance, 10)
      }
    });
  } catch (error) {
    console.error('Find nearby properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to find nearby properties',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Search properties with text search
exports.searchProperties = async (req, res) => {
  try {
    const {
      q, // Search query
      city,
      area,
      propertyType,
      minRent,
      maxRent,
      bedrooms,
      amenities,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Build text search filter
    const filters = {
      status: 'available',
      visibility: 'public',
      isDeleted: false
    };

    // Text search across multiple fields
    if (q) {
      const searchRegex = new RegExp(q, 'i');
      filters.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { 'address.city': searchRegex },
        { 'address.area': searchRegex },
        { 'address.landmark': searchRegex },
        { 'specifications.amenities': { $in: [searchRegex] } }
      ];
    }

    // Location-specific filters
    if (city) {
      const cityRegex = new RegExp(city, 'i');
      if (filters.$or) {
        // If we already have text search, combine with location
        filters.$and = [
          { $or: filters.$or },
          {
            $or: [
              { 'address.city': cityRegex },
              { 'address.area': cityRegex }
            ]
          }
        ];
        delete filters.$or;
      } else {
        filters.$or = [
          { 'address.city': cityRegex },
          { 'address.area': cityRegex }
        ];
      }
    }

    if (area) filters['address.area'] = new RegExp(area, 'i');
    if (propertyType) filters.propertyType = propertyType;
    if (bedrooms) filters['specifications.bedrooms'] = parseInt(bedrooms, 10);

    // Price range filter
    if (minRent || maxRent) {
      filters['rental.monthlyRent'] = {};
      if (minRent) filters['rental.monthlyRent'].$gte = parseInt(minRent, 10);
      if (maxRent) filters['rental.monthlyRent'].$lte = parseInt(maxRent, 10);
    }

    // Amenities filter
    if (amenities) {
      const amenityArray = Array.isArray(amenities) ? amenities : [amenities];
      filters['specifications.amenities'] = { $in: amenityArray };
    }

    // Calculate pagination
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    // Execute search query
    const properties = await Property.find(filters)
      .populate('owner', 'firstName lastName phone email profilePicture')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit, 10));

    // Get total count for pagination
    const total = await Property.countDocuments(filters);

    res.json({
      success: true,
      message: `Found ${total} properties`,
      data: {
        properties,
        searchQuery: q,
        filters: {
          city, area, propertyType, minRent, maxRent, bedrooms, amenities
        },
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10)),
          totalProperties: total,
          hasNextPage: skip + properties.length < total,
          hasPrevPage: parseInt(page, 10) > 1
        }
      }
    });
  } catch (error) {
    console.error('Search properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search properties',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get featured properties
exports.getFeaturedProperties = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const properties = await Property.find({
      'featured.isFeatured': true,
      'featured.featuredUntil': { $gt: new Date() },
      status: 'available',
      visibility: 'public',
      isDeleted: false
    })
      .populate('owner', 'firstName lastName profilePicture')
      .sort('-featured.promotionLevel -qualityScore -createdAt')
      .limit(parseInt(limit, 10));

    res.json({
      success: true,
      message: 'Featured properties retrieved successfully',
      data: { properties }
    });
  } catch (error) {
    console.error('Get featured properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured properties',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get properties by owner (requires authentication)
exports.getOwnerProperties = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filters = {
      owner: req.user._id,
      isDeleted: false
    };

    if (status) {
      filters.status = status;
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const properties = await Property.find(filters)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Property.countDocuments(filters);

    res.json({
      success: true,
      message: 'Owner properties retrieved successfully',
      data: {
        properties,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10)),
          totalProperties: total
        }
      }
    });
  } catch (error) {
    console.error('Get owner properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve properties',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
