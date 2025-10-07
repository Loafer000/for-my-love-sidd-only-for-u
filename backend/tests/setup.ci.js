// Minimal test setup for CI environment
// This setup file is designed to work without MongoDB Memory Server

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';

// Mock MongoDB connections to avoid actual database setup
jest.mock('mongoose', () => ({
  connect: jest.fn(() => Promise.resolve()),
  connection: {
    dropDatabase: jest.fn(() => Promise.resolve()),
    close: jest.fn(() => Promise.resolve()),
    readyState: 1
  },
  disconnect: jest.fn(() => Promise.resolve())
}));

// Mock models to return empty results
jest.mock('../models/User', () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  deleteMany: jest.fn(() => Promise.resolve())
}));

jest.mock('../models/Property', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  deleteMany: jest.fn(() => Promise.resolve())
}));

// Setup and cleanup that don't require actual database
beforeAll(async () => {
  console.log('CI Test Environment Setup Complete');
});

afterAll(async () => {
  console.log('CI Test Environment Cleanup Complete');
});

// Clean up between tests
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});