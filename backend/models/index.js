// Central model exports and relationships
const User = require('./User');
const Property = require('./Property');
const Booking = require('./Booking');
const Payment = require('./Payment');
const Review = require('./Review');
const { Chat, ChatMessage } = require('./Chat');
const ReviewEnhanced = require('./ReviewEnhanced');

// Export all models
module.exports = {
  User,
  Property,
  Booking,
  Payment,
  Review,
  Chat,
  ChatMessage,
  ReviewEnhanced
};

// Model relationship setup (if needed for population)
// This ensures all models are available when setting up relationships