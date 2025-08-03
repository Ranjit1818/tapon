const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      auth: '/api/auth',
      profiles: '/api/profiles',
      qr: '/api/qr',
      orders: '/api/orders',
      analytics: '/api/analytics',
      admin: '/api/admin',
      upload: '/api/upload',
      health: '/api/health'
    }
  });
};

module.exports = notFound; 