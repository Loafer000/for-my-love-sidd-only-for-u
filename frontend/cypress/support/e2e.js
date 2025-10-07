// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add global before hooks
beforeEach(() => {
  // Clear local storage and cookies before each test
  cy.clearLocalStorage();
  cy.clearCookies();
  
  // Set up API base URL
  cy.intercept('GET', '**/api/**', { fixture: 'api-response.json' }).as('apiRequest');
});

// Global exception handler
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  if (err.message.includes('Network Error') || err.message.includes('fetch')) {
    return false;
  }
  return true;
});