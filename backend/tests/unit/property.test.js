const request = require('supertest');
const express = require('express');
const propertyRoutes = require('../../routes/properties');
const Property = require('../../models/Property');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/properties', propertyRoutes);

describe('Property Routes', () => {
  let user;
  let token;

  beforeEach(async () => {
    user = await global.testHelpers.createUser({
      email: 'property.owner@example.com',
      userType: 'landlord'
    });
    token = global.testHelpers.generateJWT(user._id);
  });

  describe('POST /api/properties', () => {
    test('should create a new property', async () => {
      const propertyData = {
        title: 'Beautiful Apartment',
        description: 'A stunning 2BHK apartment',
        propertyType: 'apartment',
        category: 'residential',
        address: {
          street: '456 Test Avenue',
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
            carpet: 1500
          },
          floor: {
            current: 5,
            total: 15
          }
        },
        rental: {
          monthlyRent: 30000,
          securityDeposit: 60000,
          leaseDuration: {
            minimum: 11
          },
          availableFrom: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
        },
        amenities: ['parking', 'gym', 'swimming pool']
      };

      const response = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${token}`)
        .send(propertyData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Property created successfully');
      expect(response.body.property.title).toBe(propertyData.title);
      expect(response.body.property.specifications.bedrooms).toBe(propertyData.specifications.bedrooms);

      // Verify property was created in database
      const property = await Property.findById(response.body.property._id);
      expect(property).toBeTruthy();
      expect(property.owner.toString()).toBe(user._id.toString());
    });

    test('should validate required fields', async () => {
      const invalidData = {
        title: 'Incomplete Property'
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/properties')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should not create property without authentication', async () => {
      const propertyData = {
        title: 'Unauthorized Property',
        price: 50000
      };

      const response = await request(app)
        .post('/api/properties')
        .send(propertyData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/properties', () => {
    beforeEach(async () => {
      // Create test properties
      await global.testHelpers.createProperty({
        title: 'Property 1',
        price: 50000,
        owner: user._id
      });
      await global.testHelpers.createProperty({
        title: 'Property 2',
        price: 75000,
        owner: user._id
      });
    });

    test('should get all properties', async () => {
      const response = await request(app)
        .get('/api/properties')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.properties).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
    });

    test('should filter properties by price range', async () => {
      const response = await request(app)
        .get('/api/properties')
        .query({ minPrice: 60000, maxPrice: 80000 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.properties).toHaveLength(1);
      expect(response.body.properties[0].title).toBe('Property 2');
    });

    test('should filter properties by location', async () => {
      const response = await request(app)
        .get('/api/properties')
        .query({ city: 'Test City' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.properties.length).toBeGreaterThan(0);
    });

    test('should support pagination', async () => {
      const response = await request(app)
        .get('/api/properties')
        .query({ page: 1, limit: 1 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.properties).toHaveLength(1);
      expect(response.body.pagination.currentPage).toBe(1);
      expect(response.body.pagination.totalPages).toBe(2);
    });
  });

  describe('GET /api/properties/:id', () => {
    let property;

    beforeEach(async () => {
      property = await global.testHelpers.createProperty({
        title: 'Detailed Property',
        owner: user._id
      });
    });

    test('should get property by ID', async () => {
      const response = await request(app)
        .get(`/api/properties/${property._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.property._id).toBe(property._id.toString());
      expect(response.body.property.title).toBe('Detailed Property');
    });

    test('should return 404 for non-existent property', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/properties/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Property not found');
    });

    test('should return 400 for invalid property ID', async () => {
      const response = await request(app)
        .get('/api/properties/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/properties/:id', () => {
    let property;

    beforeEach(async () => {
      property = await global.testHelpers.createProperty({
        title: 'Original Title',
        price: 50000,
        owner: user._id
      });
    });

    test('should update property by owner', async () => {
      const updateData = {
        title: 'Updated Title',
        price: 60000
      };

      const response = await request(app)
        .put(`/api/properties/${property._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.property.title).toBe('Updated Title');
      expect(response.body.property.price).toBe(60000);

      // Verify update in database
      const updatedProperty = await Property.findById(property._id);
      expect(updatedProperty.title).toBe('Updated Title');
      expect(updatedProperty.price).toBe(60000);
    });

    test('should not update property by non-owner', async () => {
      const otherUser = await global.testHelpers.createUser({
        email: 'other@example.com'
      });
      const otherToken = global.testHelpers.generateJWT(otherUser._id);

      const updateData = {
        title: 'Unauthorized Update'
      };

      const response = await request(app)
        .put(`/api/properties/${property._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Not authorized to update this property');
    });
  });

  describe('DELETE /api/properties/:id', () => {
    let property;

    beforeEach(async () => {
      property = await global.testHelpers.createProperty({
        title: 'To Be Deleted',
        owner: user._id
      });
    });

    test('should delete property by owner', async () => {
      const response = await request(app)
        .delete(`/api/properties/${property._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Property deleted successfully');

      // Verify deletion in database
      const deletedProperty = await Property.findById(property._id);
      expect(deletedProperty).toBeNull();
    });

    test('should not delete property by non-owner', async () => {
      const otherUser = await global.testHelpers.createUser({
        email: 'other@example.com'
      });
      const otherToken = global.testHelpers.generateJWT(otherUser._id);

      const response = await request(app)
        .delete(`/api/properties/${property._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Not authorized to delete this property');

      // Verify property still exists
      const existingProperty = await Property.findById(property._id);
      expect(existingProperty).toBeTruthy();
    });
  });
});
