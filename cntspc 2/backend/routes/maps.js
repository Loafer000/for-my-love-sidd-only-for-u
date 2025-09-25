const express = require('express');
const Property = require('../models/Property');

const router = express.Router();

// @route   GET /api/maps/properties
// @desc    Get properties for map view
// @access  Public
router.get('/properties', async (req, res) => {
  try {
    const { 
      lat, 
      lng, 
      radius = 10, // km
      propertyType,
      minRent,
      maxRent 
    } = req.query;

    let query = {
      status: 'active',
      isAvailable: true,
      'address.coordinates.latitude': { $exists: true },
      'address.coordinates.longitude': { $exists: true }
    };

    // Add filters
    if (propertyType) query.propertyType = propertyType;
    if (minRent || maxRent) {
      query['rent.monthly'] = {};
      if (minRent) query['rent.monthly'].$gte = parseInt(minRent);
      if (maxRent) query['rent.monthly'].$lte = parseInt(maxRent);
    }

    // If coordinates provided, find within radius
    if (lat && lng) {
      query['address.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    const properties = await Property.find(query)
      .select('title propertyType rent.monthly size address images')
      .populate('landlord', 'firstName lastName')
      .limit(100); // Limit for performance

    // Format for map display
    const mapProperties = properties.map(property => ({
      id: property._id,
      title: property.title,
      type: property.propertyType,
      rent: property.rent.monthly,
      size: property.size,
      coordinates: {
        lat: property.address.coordinates.latitude,
        lng: property.address.coordinates.longitude
      },
      address: `${property.address.area}, ${property.address.city}`,
      image: property.images[0]?.url || '',
      landlord: `${property.landlord.firstName} ${property.landlord.lastName}`
    }));

    res.json({ properties: mapProperties });

  } catch (error) {
    console.error('Map properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/maps/nearby
// @desc    Get nearby amenities for a location
// @access  Public
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, type } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Mock nearby places data
    // In production, integrate with Google Places API
    const mockNearbyPlaces = [
      {
        name: 'Metro Station',
        type: 'metro',
        distance: 500,
        walkingTime: 6
      },
      {
        name: 'City Hospital',
        type: 'hospital',
        distance: 1200,
        walkingTime: 15
      },
      {
        name: 'Shopping Mall',
        type: 'mall',
        distance: 800,
        walkingTime: 10
      }
    ];

    res.json({ nearbyPlaces: mockNearbyPlaces });

  } catch (error) {
    console.error('Nearby places error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;