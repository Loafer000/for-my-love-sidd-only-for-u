const User = require('../models/User');
const Property = require('../models/Property');
const bcrypt = require('bcryptjs');

const seedUsers = async () => {
  try {
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Users already exist, skipping seed');
      return;
    }

    const users = [
      {
        email: 'landlord1@example.com',
        password: 'Password123!',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        phone: '9876543210',
        userType: 'landlord',
        isEmailVerified: true,
        isPhoneVerified: true,
        address: {
          city: 'Kolkata',
          state: 'across India',
          pincode: '700001'
        },
        businessInfo: {
          companyName: 'Kumar Properties',
          gstNumber: '19AABCU9603R1ZM',
          panNumber: 'AABCU9603R'
        }
      },
      {
        email: 'landlord2@example.com',
        password: 'Password123!',
        firstName: 'Priya',
        lastName: 'Sharma',
        phone: '9876543211',
        userType: 'landlord',
        isEmailVerified: true,
        isPhoneVerified: true,
        address: {
          city: 'Kolkata',
          state: 'across India',
          pincode: '700091'
        },
        businessInfo: {
          companyName: 'Sharma Estates'
        }
      },
      {
        email: 'tenant1@example.com',
        password: 'Password123!',
        firstName: 'Amit',
        lastName: 'Das',
        phone: '9876543212',
        userType: 'tenant',
        isEmailVerified: true,
        isPhoneVerified: true,
        preferences: {
          propertyTypes: ['office', 'retail'],
          budgetRange: { min: 20000, max: 50000 },
          preferredLocations: ['Salt Lake', 'Park Street']
        }
      }
    ];

    await User.insertMany(users);
    console.log('✅ Sample users created');
    
    return await User.find();
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

const seedProperties = async () => {
  try {
    // Check if properties already exist
    const existingProperties = await Property.countDocuments();
    if (existingProperties > 0) {
      console.log('Properties already exist, skipping seed');
      return;
    }

    // Get landlords
    const landlords = await User.find({ userType: 'landlord' });
    if (landlords.length === 0) {
      console.log('No landlords found, cannot seed properties');
      return;
    }

    const properties = [
      {
        title: 'Modern Office Space in Salt Lake City',
        description: 'Premium office space with modern amenities, perfect for IT companies and startups. Features include high-speed internet, conference rooms, and 24/7 security.',
        propertyType: 'office',
        size: 1200,
        rent: { monthly: 45000, perSqft: 38 },
        securityDeposit: 90000,
        address: {
          street: 'Plot 123, Sector V',
          area: 'Salt Lake City',
          city: 'Kolkata',
          state: 'across India',
          pincode: '700091',
          coordinates: { latitude: 22.5726, longitude: 88.3639 }
        },
        amenities: ['parking', 'ac', 'wifi', 'security', 'elevator', 'generator'],
        nearbyPlaces: [
          { name: 'Salt Lake Stadium Metro', type: 'metro', distance: 500, walkingTime: 6 },
          { name: 'City Centre Mall', type: 'mall', distance: 800, walkingTime: 10 }
        ],
        images: [
          { url: 'https://example.com/office1.jpg', isPrimary: true, caption: 'Main office area' },
          { url: 'https://example.com/office2.jpg', caption: 'Conference room' }
        ],
        landlord: landlords[0]._id,
        isVerified: true,
        verificationStatus: 'verified',
        isAvailable: true,
        status: 'active'
      },
      {
        title: 'Prime Retail Shop in Park Street',
        description: 'High-footfall retail space in the heart of Kolkata. Perfect for fashion stores, restaurants, or any retail business.',
        propertyType: 'retail',
        size: 800,
        rent: { monthly: 35000, perSqft: 44 },
        securityDeposit: 70000,
        address: {
          street: '45 Park Street',
          area: 'Park Street',
          city: 'Kolkata',
          state: 'across India',
          pincode: '700016',
          coordinates: { latitude: 22.5448, longitude: 88.3426 }
        },
        amenities: ['parking', 'ac', 'security'],
        nearbyPlaces: [
          { name: 'Park Street Metro', type: 'metro', distance: 200, walkingTime: 3 },
          { name: 'South City Mall', type: 'mall', distance: 1500, walkingTime: 18 }
        ],
        images: [
          { url: 'https://example.com/retail1.jpg', isPrimary: true, caption: 'Shop front' }
        ],
        landlord: landlords[1]._id,
        isVerified: true,
        verificationStatus: 'verified',
        isAvailable: true,
        status: 'active'
      },
      {
        title: 'Industrial Warehouse in Howrah',
        description: 'Large warehouse space suitable for manufacturing, storage, and distribution. Easy access to highways and ports.',
        propertyType: 'warehouse',
        size: 2000,
        rent: { monthly: 25000, perSqft: 13 },
        securityDeposit: 50000,
        address: {
          street: 'Industrial Area, Shibpur',
          area: 'Howrah',
          city: 'Howrah',
          state: 'across India',
          pincode: '711102',
          coordinates: { latitude: 22.5958, longitude: 88.2636 }
        },
        amenities: ['parking', 'security', 'generator'],
        nearbyPlaces: [
          { name: 'Howrah Station', type: 'metro', distance: 3000, walkingTime: 35 }
        ],
        images: [
          { url: 'https://example.com/warehouse1.jpg', isPrimary: true, caption: 'Warehouse interior' }
        ],
        landlord: landlords[0]._id,
        isVerified: true,
        verificationStatus: 'verified',
        isAvailable: true,
        status: 'active'
      }
    ];

    await Property.insertMany(properties);
    console.log('✅ Sample properties created');
  } catch (error) {
    console.error('❌ Error seeding properties:', error);
  }
};

const seedDatabase = async () => {
  console.log('🌱 Seeding database...');
  await seedUsers();
  await seedProperties();
  console.log('✅ Database seeding completed');
};

module.exports = { seedDatabase, seedUsers, seedProperties };