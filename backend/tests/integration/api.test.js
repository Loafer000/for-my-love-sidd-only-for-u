const request = require('supertest');
const app = require('../../server');

describe('API Integration Tests', () => {
  let authToken;
  let userId;
  let propertyId;

  // Complete user registration and login flow
  describe('Authentication Flow', () => {
    test('should complete full registration and login process', async () => {
      // Register user
      const registerData = {
        firstName: 'Integration',
        lastName: 'Test',
        email: 'integration@example.com',
        password: 'password123',
        phoneNumber: '+9876543210',
        userType: 'landlord'
      };

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(registerData)
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.token).toBeDefined();
      
      userId = registerResponse.body.user.id;
      authToken = registerResponse.body.token;

      // Login with same credentials
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: registerData.email,
          password: registerData.password
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.token).toBeDefined();

      // Get user profile
      const profileResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .expect(200);

      expect(profileResponse.body.success).toBe(true);
      expect(profileResponse.body.user.email).toBe(registerData.email);
    });
  });

  // Property management flow
  describe('Property Management Flow', () => {
    test('should create, read, update, and delete property', async () => {
      const propertyData = {
        title: 'Integration Test Property',
        description: 'Property for integration testing',
        price: 85000,
        location: {
          address: '789 Integration Street',
          city: 'Test City',
          state: 'Test State',
          zipCode: '98765'
        },
        propertyType: 'house',
        bhk: 3,
        area: 2000,
        amenities: ['parking', 'garden', 'security']
      };

      // Create property
      const createResponse = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${authToken}`)
        .send(propertyData)
        .expect(201);

      expect(createResponse.body.success).toBe(true);
      propertyId = createResponse.body.property._id;

      // Read property
      const readResponse = await request(app)
        .get(`/api/properties/${propertyId}`)
        .expect(200);

      expect(readResponse.body.success).toBe(true);
      expect(readResponse.body.property.title).toBe(propertyData.title);

      // Update property
      const updateData = {
        title: 'Updated Integration Property',
        price: 90000
      };

      const updateResponse = await request(app)
        .put(`/api/properties/${propertyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.property.title).toBe(updateData.title);
      expect(updateResponse.body.property.price).toBe(updateData.price);

      // Delete property
      const deleteResponse = await request(app)
        .delete(`/api/properties/${propertyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(deleteResponse.body.success).toBe(true);

      // Verify deletion
      const verifyResponse = await request(app)
        .get(`/api/properties/${propertyId}`)
        .expect(404);

      expect(verifyResponse.body.success).toBe(false);
    });
  });

  // Booking flow integration
  describe('Booking Flow Integration', () => {
    beforeAll(async () => {
      // Create a property for booking
      const propertyData = {
        title: 'Bookable Property',
        description: 'Property for booking tests',
        price: 60000,
        location: {
          address: '123 Booking Street',
          city: 'Booking City',
          state: 'Booking State',
          zipCode: '11111'
        },
        propertyType: 'apartment',
        bhk: 2,
        area: 1200,
        amenities: ['parking']
      };

      const response = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${authToken}`)
        .send(propertyData);

      propertyId = response.body.property._id;
    });

    test('should complete booking flow with payment', async () => {
      // Create booking inquiry
      const inquiryData = {
        propertyId: propertyId,
        message: 'I am interested in this property',
        checkIn: '2024-11-01',
        checkOut: '2025-10-31'
      };

      const inquiryResponse = await request(app)
        .post('/api/bookings/inquiry')
        .set('Authorization', `Bearer ${authToken}`)
        .send(inquiryData)
        .expect(201);

      expect(inquiryResponse.body.success).toBe(true);
      const bookingId = inquiryResponse.body.booking._id;

      // Create payment order
      const paymentData = {
        bookingId: bookingId,
        amount: 60000
      };

      const paymentResponse = await request(app)
        .post('/api/payments/create-order')
        .set('Authorization', `Bearer ${authToken}`)
        .send(paymentData)
        .expect(200);

      expect(paymentResponse.body.success).toBe(true);
      expect(paymentResponse.body.orderId).toBeDefined();

      // Simulate payment verification
      const verifyData = {
        orderId: paymentResponse.body.orderId,
        paymentId: 'pay_test123',
        signature: 'test_signature'
      };

      const verifyResponse = await request(app)
        .post('/api/payments/verify')
        .set('Authorization', `Bearer ${authToken}`)
        .send(verifyData)
        .expect(200);

      expect(verifyResponse.body.success).toBe(true);
    });
  });

  // Advanced features integration
  describe('Advanced Features Integration', () => {
    test('should access financial analytics', async () => {
      const response = await request(app)
        .get('/api/financial/analytics/revenue')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.analytics).toBeDefined();
    });

    test('should access maintenance system', async () => {
      const response = await request(app)
        .get('/api/maintenance/requests')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.requests).toBeDefined();
    });

    test('should access AI assistant', async () => {
      const response = await request(app)
        .post('/api/ai/chat')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ message: 'Hello AI assistant' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.response).toBeDefined();
    });

    test('should access tenant management', async () => {
      const response = await request(app)
        .get('/api/tenant/dashboard')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.dashboard).toBeDefined();
    });

    test('should access agent performance', async () => {
      const response = await request(app)
        .get('/api/agent/performance')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.performance).toBeDefined();
    });
  });

  // Error handling and edge cases
  describe('Error Handling', () => {
    test('should handle invalid authentication', async () => {
      const response = await request(app)
        .get('/api/properties')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('should handle malformed requests', async () => {
      const response = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ invalidData: 'test' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should handle rate limiting', async () => {
      // Make multiple rapid requests to trigger rate limiting
      const requests = Array(20).fill().map(() => 
        request(app).get('/api/properties')
      );

      const responses = await Promise.all(requests);
      
      // Should have at least one rate limited response
      const rateLimited = responses.some(res => res.status === 429);
      expect(rateLimited).toBe(true);
    });
  });
});