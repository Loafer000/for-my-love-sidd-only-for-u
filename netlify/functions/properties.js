const mongoose = require('mongoose');
const Property = require('../../backend/models/Property');
const jwt = require('jsonwebtoken');

// MongoDB connection
let cachedDb = null;
const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    cachedDb = connection;
    return cachedDb;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Helper function to generate response
const response = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    },
    body: JSON.stringify(body)
  };
};

// Verify JWT token
const verifyToken = (event) => {
  try {
    const token = event.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return response(200, {});
  }

  try {
    await connectToDatabase();
    const path = event.path.replace('/api/', '').replace('/.netlify/functions/', '');
    const body = JSON.parse(event.body || '{}');

    // GET all properties
    if (path === 'properties' && event.httpMethod === 'GET') {
      const properties = await Property.find();
      return response(200, properties);
    }

    // GET single property
    if (path.startsWith('properties/') && event.httpMethod === 'GET') {
      const propertyId = path.split('/')[1];
      const property = await Property.findById(propertyId);
      if (!property) {
        return response(404, { message: 'Property not found' });
      }
      return response(200, property);
    }

    // Create property (Protected route)
    if (path === 'properties' && event.httpMethod === 'POST') {
      try {
        verifyToken(event);
      } catch (error) {
        return response(401, { message: 'Unauthorized' });
      }

      const property = new Property(body);
      await property.save();
      return response(201, property);
    }

    // Update property (Protected route)
    if (path.startsWith('properties/') && event.httpMethod === 'PUT') {
      try {
        verifyToken(event);
      } catch (error) {
        return response(401, { message: 'Unauthorized' });
      }

      const propertyId = path.split('/')[1];
      const property = await Property.findByIdAndUpdate(
        propertyId,
        body,
        { new: true }
      );
      if (!property) {
        return response(404, { message: 'Property not found' });
      }
      return response(200, property);
    }

    // Delete property (Protected route)
    if (path.startsWith('properties/') && event.httpMethod === 'DELETE') {
      try {
        verifyToken(event);
      } catch (error) {
        return response(401, { message: 'Unauthorized' });
      }

      const propertyId = path.split('/')[1];
      const property = await Property.findByIdAndDelete(propertyId);
      if (!property) {
        return response(404, { message: 'Property not found' });
      }
      return response(200, { message: 'Property deleted successfully' });
    }

    // Search properties
    if (path === 'properties/search' && event.httpMethod === 'GET') {
      const { query } = event.queryStringParameters || {};
      const properties = await Property.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } }
        ]
      });
      return response(200, properties);
    }

    return response(404, { message: 'Not found' });
  } catch (error) {
    console.error('Function error:', error);
    return response(500, { message: 'Internal server error' });
  }
};