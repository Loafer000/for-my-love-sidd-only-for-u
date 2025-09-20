const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../backend/models/User');

// Connect to MongoDB
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
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify(body)
  };
};

// Handler for the auth function
exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return response(200, {});
  }

  try {
    await connectToDatabase();
    const path = event.path.replace('/api/', '');
    const body = JSON.parse(event.body || '{}');

    // Register endpoint
    if (path === 'auth/register' && event.httpMethod === 'POST') {
      const { email, password, name } = body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return response(400, { message: 'User already exists' });
      }

      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashedPassword,
        name
      });

      await user.save();
      
      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return response(201, {
        message: 'User created successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    }

    // Login endpoint
    if (path === 'auth/login' && event.httpMethod === 'POST') {
      const { email, password } = body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return response(401, { message: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return response(401, { message: 'Invalid credentials' });
      }

      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return response(200, {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    }

    return response(404, { message: 'Not found' });
  } catch (error) {
    console.error('Function error:', error);
    return response(500, { message: 'Internal server error' });
  }
};