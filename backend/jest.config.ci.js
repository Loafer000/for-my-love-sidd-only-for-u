module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'routes/**/*.js',
    'controllers/**/*.js',
    'middleware/**/*.js',
    'models/**/*.js',
    'utils/**/*.js',
    'server.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/tests/**'
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ci.js'],
  testTimeout: 30000,
  verbose: false,
  forceExit: true,
  detectOpenHandles: false,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  transform: {},
  extensionsToTreatAsEsm: [],
  // Skip database-heavy tests in CI
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/tests/unit/property.test.js',
    '/tests/unit/auth.test.js',
    '/tests/integration/'
  ]
};