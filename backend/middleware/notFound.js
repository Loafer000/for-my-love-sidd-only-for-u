const notFound = (req, res) => {

  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: {
      auth: '/api/auth',
      users: '/api/users',
      properties: '/api/properties',
      bookings: '/api/bookings',
      payments: '/api/payments',
      upload: '/api/upload',
      health: '/api/health'
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = notFound;
