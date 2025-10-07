const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// Setup before all tests
beforeAll(async () => {
  // Set test environment first
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';

  // Disconnect from any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  try {
    // Start in-memory MongoDB instance with binary configuration
    mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '6.0.4',
        skipMD5: true
      },
      instance: {
        dbName: 'connectspace-test'
      }
    });
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;

    // Connect to the in-memory database with longer timeout
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10
    });
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }
});

// Cleanup after all tests
afterAll(async () => {
  try {
    // Close database connection with timeout
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }

    // Stop in-memory MongoDB instance
    if (mongoServer) {
      await mongoServer.stop({ force: true });
    }
  } catch (error) {
    console.error('Error during test cleanup:', error);
  }
}, 60000);

// Clear database between tests
afterEach(async () => {
  const { collections } = mongoose.connection;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Global test helpers
global.testHelpers = {
  createUser: async (userData = {}) => {
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');

    const defaultUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      phoneNumber: '+1234567890',
      userType: 'tenant'
    };

    return await User.create({ ...defaultUser, ...userData });
  },

  createProperty: async (propertyData = {}) => {
    const Property = require('../models/Property');

    const defaultProperty = {
      title: 'Test Property',
      description: 'Test property description',
      propertyType: 'apartment',
      category: 'residential',
      address: {
        street: '123 Test Street',
        area: 'Test Area',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456'
      },
      location: {
        coordinates: [12.345, 67.890]
      },
      specifications: {
        bedrooms: 2,
        bathrooms: 2,
        area: {
          carpet: 1200
        },
        floor: {
          current: 3,
          total: 10
        }
      },
      rental: {
        monthlyRent: 25000,
        securityDeposit: 50000,
        leaseDuration: {
          minimum: 11
        },
        availableFrom: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      amenities: ['parking', 'gym'],
      available: true
    };

    return await Property.create({ ...defaultProperty, ...propertyData });
  },

  generateJWT: (userId) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  }
};

// Mock external services
jest.mock('razorpay', () => jest.fn().mockImplementation(() => ({
  orders: {
    create: jest.fn().mockResolvedValue({
      id: 'order_test123',
      amount: 50000,
      currency: 'INR'
    })
  },
  payments: {
    fetch: jest.fn().mockResolvedValue({
      id: 'pay_test123',
      status: 'captured'
    })
  }
})));

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
  })
}));

jest.mock('twilio', () => jest.fn().mockImplementation(() => ({
  messages: {
    create: jest.fn().mockResolvedValue({ sid: 'test-message-sid' })
  }
})));
