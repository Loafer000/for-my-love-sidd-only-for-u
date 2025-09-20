const mongoose = require('mongoose');
const Inquiry = require('../../backend/models/Inquiry');
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

    // Submit inquiry
    if (path === 'inquiries' && event.httpMethod === 'POST') {
      const inquiry = new Inquiry(body);
      await inquiry.save();
      return response(201, inquiry);
    }

    // Get all inquiries (Protected route)
    if (path === 'inquiries' && event.httpMethod === 'GET') {
      try {
        verifyToken(event);
      } catch (error) {
        return response(401, { message: 'Unauthorized' });
      }

      const inquiries = await Inquiry.find()
        .populate('propertyId', 'title location')
        .sort({ createdAt: -1 });
      return response(200, inquiries);
    }

    // Get single inquiry (Protected route)
    if (path.startsWith('inquiries/') && event.httpMethod === 'GET') {
      try {
        verifyToken(event);
      } catch (error) {
        return response(401, { message: 'Unauthorized' });
      }

      const inquiryId = path.split('/')[1];
      const inquiry = await Inquiry.findById(inquiryId)
        .populate('propertyId', 'title location');
      if (!inquiry) {
        return response(404, { message: 'Inquiry not found' });
      }
      return response(200, inquiry);
    }

    // Update inquiry status (Protected route)
    if (path.startsWith('inquiries/') && event.httpMethod === 'PUT') {
      try {
        verifyToken(event);
      } catch (error) {
        return response(401, { message: 'Unauthorized' });
      }

      const inquiryId = path.split('/')[1];
      const inquiry = await Inquiry.findByIdAndUpdate(
        inquiryId,
        body,
        { new: true }
      );
      if (!inquiry) {
        return response(404, { message: 'Inquiry not found' });
      }
      return response(200, inquiry);
    }

    return response(404, { message: 'Not found' });
  } catch (error) {
    console.error('Function error:', error);
    return response(500, { message: 'Internal server error' });
  }
};