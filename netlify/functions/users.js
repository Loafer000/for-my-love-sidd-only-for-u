const mongoose = require('mongoose');
const User = require('../../backend/models/User');
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
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS'
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

    // Get current user profile
    if (path === 'users/me' && event.httpMethod === 'GET') {
      try {
        const decoded = verifyToken(event);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
          return response(404, { message: 'User not found' });
        }
        return response(200, user);
      } catch (error) {
        return response(401, { message: 'Unauthorized' });
      }
    }

    // Update user profile
    if (path === 'users/me' && event.httpMethod === 'PUT') {
      try {
        const decoded = verifyToken(event);
        const user = await User.findByIdAndUpdate(
          decoded.userId,
          { $set: body },
          { new: true }
        ).select('-password');
        if (!user) {
          return response(404, { message: 'User not found' });
        }
        return response(200, user);
      } catch (error) {
        return response(401, { message: 'Unauthorized' });
      }
    }

    return response(404, { message: 'Not found' });
  } catch (error) {
    console.error('Function error:', error);
    return response(500, { message: 'Internal server error' });
  }
};