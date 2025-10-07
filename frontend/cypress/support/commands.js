// Custom commands for ConnectSpace testing

// Authentication commands
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('not.include', '/login');
});

Cypress.Commands.add('register', (userData = {}) => {
  const defaultUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'password123',
    phoneNumber: '+1234567890',
    userType: 'tenant'
  };
  
  const user = { ...defaultUser, ...userData };
  
  cy.visit('/register');
  cy.get('[data-testid="firstName-input"]').type(user.firstName);
  cy.get('[data-testid="lastName-input"]').type(user.lastName);
  cy.get('[data-testid="email-input"]').type(user.email);
  cy.get('[data-testid="password-input"]').type(user.password);
  cy.get('[data-testid="phoneNumber-input"]').type(user.phoneNumber);
  cy.get('[data-testid="userType-select"]').select(user.userType);
  cy.get('[data-testid="register-button"]').click();
});

// Property management commands
Cypress.Commands.add('createProperty', (propertyData = {}) => {
  const defaultProperty = {
    title: 'Test Property',
    description: 'Test property description',
    price: 50000,
    address: '123 Test Street',
    city: 'Test City',
    state: 'Test State',
    zipCode: '12345',
    propertyType: 'apartment',
    bhk: 2,
    area: 1200
  };
  
  const property = { ...defaultProperty, ...propertyData };
  
  cy.visit('/landlord/properties/add');
  cy.get('[data-testid="title-input"]').type(property.title);
  cy.get('[data-testid="description-textarea"]').type(property.description);
  cy.get('[data-testid="price-input"]').type(property.price.toString());
  cy.get('[data-testid="address-input"]').type(property.address);
  cy.get('[data-testid="city-input"]').type(property.city);
  cy.get('[data-testid="state-input"]').type(property.state);
  cy.get('[data-testid="zipCode-input"]').type(property.zipCode);
  cy.get('[data-testid="propertyType-select"]').select(property.propertyType);
  cy.get('[data-testid="bhk-select"]').select(property.bhk.toString());
  cy.get('[data-testid="area-input"]').type(property.area.toString());
  cy.get('[data-testid="create-property-button"]').click();
});

// Navigation commands
Cypress.Commands.add('navigateToProperties', () => {
  cy.get('[data-testid="properties-nav"]').click();
  cy.url().should('include', '/properties');
});

Cypress.Commands.add('navigateToBookings', () => {
  cy.get('[data-testid="bookings-nav"]').click();
  cy.url().should('include', '/bookings');
});

// Wait for API response
Cypress.Commands.add('waitForAPI', (alias) => {
  cy.wait(`@${alias}`);
});

// Accessibility testing command
Cypress.Commands.add('checkA11y', (context, options) => {
  cy.injectAxe();
  cy.checkA11y(context, options);
});

// Performance testing command
Cypress.Commands.add('checkPageLoad', (threshold = 3000) => {
  cy.window().its('performance').invoke('getEntriesByType', 'navigation').then((navigation) => {
    const loadTime = navigation[0].loadEventEnd - navigation[0].navigationStart;
    expect(loadTime).to.be.lessThan(threshold);
  });
});

// Mobile testing command
Cypress.Commands.add('setMobileViewport', () => {
  cy.viewport('iphone-x');
});

Cypress.Commands.add('setTabletViewport', () => {
  cy.viewport('ipad-2');
});

Cypress.Commands.add('setDesktopViewport', () => {
  cy.viewport(1280, 720);
});