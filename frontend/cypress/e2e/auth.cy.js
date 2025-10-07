describe('ConnectSpace Authentication Flow', () => {
  beforeEach(() => {
    // Intercept API calls
    cy.intercept('POST', '**/api/auth/register', { fixture: 'auth/register-success.json' }).as('register');
    cy.intercept('POST', '**/api/auth/login', { fixture: 'auth/login-success.json' }).as('login');
  });

  describe('User Registration', () => {
    it('should register a new user successfully', () => {
      cy.visit('/register');
      
      // Check page loads correctly
      cy.checkPageLoad(3000);
      cy.contains('Create Account').should('be.visible');
      
      // Fill registration form
      cy.register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phoneNumber: '+1234567890',
        userType: 'tenant'
      });
      
      // Wait for API response
      cy.waitForAPI('register');
      
      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      cy.contains('Welcome, John').should('be.visible');
    });

    it('should show validation errors for invalid data', () => {
      cy.visit('/register');
      
      // Try to submit empty form
      cy.get('[data-testid="register-button"]').click();
      
      // Check validation messages
      cy.contains('First name is required').should('be.visible');
      cy.contains('Email is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });

    it('should validate email format', () => {
      cy.visit('/register');
      
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="register-button"]').click();
      
      cy.contains('Please enter a valid email').should('be.visible');
    });

    it('should validate password strength', () => {
      cy.visit('/register');
      
      cy.get('[data-testid="password-input"]').type('123');
      cy.get('[data-testid="register-button"]').click();
      
      cy.contains('Password must be at least 6 characters').should('be.visible');
    });
  });

  describe('User Login', () => {
    it('should login with valid credentials', () => {
      cy.login('test@example.com', 'password123');
      
      // Should be redirected to dashboard
      cy.url().should('include', '/dashboard');
      cy.contains('Dashboard').should('be.visible');
    });

    it('should show error for invalid credentials', () => {
      cy.intercept('POST', '**/api/auth/login', { 
        statusCode: 401,
        body: { success: false, message: 'Invalid credentials' }
      }).as('loginFail');
      
      cy.login('invalid@example.com', 'wrongpassword');
      
      cy.waitForAPI('loginFail');
      cy.contains('Invalid credentials').should('be.visible');
    });

    it('should remember user session', () => {
      cy.login();
      
      // Refresh page
      cy.reload();
      
      // Should still be logged in
      cy.url().should('include', '/dashboard');
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      cy.login();
    });

    it('should logout user successfully', () => {
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="logout-button"]').click();
      
      // Should redirect to home page
      cy.url().should('not.include', '/dashboard');
      cy.contains('Sign In').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should meet accessibility standards on registration page', () => {
      cy.visit('/register');
      cy.checkA11y();
    });

    it('should meet accessibility standards on login page', () => {
      cy.visit('/login');
      cy.checkA11y();
    });
  });

  describe('Mobile Responsiveness', () => {
    it('should work on mobile devices', () => {
      cy.setMobileViewport();
      cy.visit('/login');
      
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="login-button"]').should('be.visible');
    });
  });
});