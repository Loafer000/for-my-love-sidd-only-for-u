const { defineConfig } = require('cypress');

module.exports = defineConfig({
  baseUrl: 'http://localhost:3000',
  viewportWidth: 1280,
  viewportHeight: 720,
  video: true,
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  responseTimeout: 10000,
  pageLoadTimeout: 30000,
  chromeWebSecurity: false,
  env: {
    apiUrl: 'http://localhost:5000/api',
    testUser: {
      email: 'test@example.com',
      password: 'password123'
    }
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js'
  },
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack'
    }
  },
  retries: {
    runMode: 2,
    openMode: 1
  }
});