describe('Property Management E2E Tests', () => {
  beforeEach(() => {
    // Login as landlord before each test
    cy.intercept('POST', '**/api/auth/login', { fixture: 'auth/login-success.json' }).as('login');
    cy.intercept('GET', '**/api/properties', { fixture: 'properties/properties-list.json' }).as('getProperties');
    cy.intercept('POST', '**/api/properties', { fixture: 'properties/create-property.json' }).as('createProperty');
    
    cy.login('landlord@example.com', 'password123');
  });

  describe('Property Listing', () => {
    it('should display property list correctly', () => {
      cy.navigateToProperties();
      
      cy.waitForAPI('getProperties');
      
      // Check if properties are displayed
      cy.get('[data-testid="property-card"]').should('have.length.at.least', 1);
      cy.contains('Beautiful Apartment').should('be.visible');
      cy.contains('₹50,000').should('be.visible');
    });

    it('should filter properties by price range', () => {
      cy.navigateToProperties();
      
      // Set price filter
      cy.get('[data-testid="min-price-input"]').type('30000');
      cy.get('[data-testid="max-price-input"]').type('70000');
      cy.get('[data-testid="apply-filters-button"]').click();
      
      // Check filtered results
      cy.get('[data-testid="property-card"]').each(($card) => {
        cy.wrap($card).find('[data-testid="property-price"]').invoke('text').then((priceText) => {
          const price = parseInt(priceText.replace(/[^\d]/g, ''));
          expect(price).to.be.within(30000, 70000);
        });
      });
    });

    it('should search properties by location', () => {
      cy.navigateToProperties();
      
      cy.get('[data-testid="location-search"]').type('Mumbai');
      cy.get('[data-testid="search-button"]').click();
      
      cy.get('[data-testid="property-card"]').should('contain', 'Mumbai');
    });
  });

  describe('Property Creation', () => {
    it('should create a new property successfully', () => {
      cy.createProperty({
        title: 'Luxury Villa',
        description: 'A beautiful luxury villa with garden',
        price: 150000,
        address: '789 Luxury Lane',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001',
        propertyType: 'house',
        bhk: 4,
        area: 3000
      });
      
      cy.waitForAPI('createProperty');
      
      // Should show success message
      cy.contains('Property created successfully').should('be.visible');
      
      // Should redirect to property list
      cy.url().should('include', '/properties');
    });

    it('should validate required fields', () => {
      cy.visit('/landlord/properties/add');
      
      // Try to submit empty form
      cy.get('[data-testid="create-property-button"]').click();
      
      // Check validation messages
      cy.contains('Title is required').should('be.visible');
      cy.contains('Description is required').should('be.visible');
      cy.contains('Price is required').should('be.visible');
    });
  });

  describe('Property Details', () => {
    it('should display property details correctly', () => {
      cy.intercept('GET', '**/api/properties/*', { fixture: 'properties/property-details.json' }).as('getPropertyDetails');
      
      cy.visit('/properties/1');
      
      cy.waitForAPI('getPropertyDetails');
      
      // Check property details
      cy.contains('Luxury Apartment').should('be.visible');
      cy.contains('₹75,000').should('be.visible');
      cy.contains('2 BHK').should('be.visible');
      cy.contains('1200 sq ft').should('be.visible');
      
      // Check amenities
      cy.contains('Parking').should('be.visible');
      cy.contains('Gym').should('be.visible');
    });

    it('should allow booking inquiry for tenants', () => {
      cy.intercept('POST', '**/api/bookings/inquiry', { fixture: 'bookings/inquiry-success.json' }).as('createInquiry');
      
      // Login as tenant
      cy.login('tenant@example.com', 'password123');
      cy.visit('/properties/1');
      
      cy.get('[data-testid="book-now-button"]').click();
      
      // Fill inquiry form
      cy.get('[data-testid="check-in-date"]').type('2024-11-01');
      cy.get('[data-testid="check-out-date"]').type('2025-10-31');
      cy.get('[data-testid="inquiry-message"]').type('I am interested in this property');
      cy.get('[data-testid="submit-inquiry-button"]').click();
      
      cy.waitForAPI('createInquiry');
      cy.contains('Inquiry submitted successfully').should('be.visible');
    });
  });

  describe('Property Management Dashboard', () => {
    it('should display landlord analytics', () => {
      cy.intercept('GET', '**/api/properties/analytics', { fixture: 'analytics/property-analytics.json' }).as('getAnalytics');
      
      cy.visit('/landlord/dashboard');
      
      cy.waitForAPI('getAnalytics');
      
      // Check analytics cards
      cy.get('[data-testid="total-properties"]').should('contain', '5');
      cy.get('[data-testid="total-revenue"]').should('contain', '₹2,50,000');
      cy.get('[data-testid="occupancy-rate"]').should('contain', '80%');
    });
  });

  describe('Performance Tests', () => {
    it('should load property list within acceptable time', () => {
      cy.visit('/properties');
      cy.checkPageLoad(3000);
    });

    it('should handle large property lists', () => {
      cy.intercept('GET', '**/api/properties', { fixture: 'properties/large-properties-list.json' }).as('getLargeList');
      
      cy.visit('/properties');
      cy.waitForAPI('getLargeList');
      
      // Check that pagination works
      cy.get('[data-testid="pagination"]').should('be.visible');
      cy.get('[data-testid="next-page"]').click();
      cy.url().should('include', 'page=2');
    });
  });

  describe('Cross-browser Testing', () => {
    ['chrome', 'firefox', 'edge'].forEach((browser) => {
      it(`should work correctly in ${browser}`, () => {
        // This test would be run with different browsers
        cy.visit('/properties');
        cy.get('[data-testid="property-card"]').should('be.visible');
      });
    });
  });
});