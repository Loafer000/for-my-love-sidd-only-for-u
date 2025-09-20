const mongoose = require('mongoose');
const { seedDatabase } = require('../utils/seedData');
require('dotenv').config();

const runSeed = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Run seeding
    await seedDatabase();
    
    console.log('🎉 Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();