// Simplified Review Routes for Testing

const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Review API is working! ⭐',
    features: [
      '📝 Verified booking reviews only',
      '🎯 Aspect-based ratings',
      '👍 Helpful votes system',
      '🛡️ Automated moderation'
    ]
  });
});

module.exports = router;