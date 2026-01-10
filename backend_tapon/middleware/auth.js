const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Check for token in x-auth-token header
    else if (req.headers['x-auth-token']) {
      token = req.headers['x-auth-token'];
    }

    // Make sure token exists
    if (!token) {
      console.log('Auth Middleware: No token provided for path:', req.path);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token using config
      const decoded = jwt.verify(token, config.JWT_SECRET);
      console.log('Auth Middleware: Token verified for user ID:', decoded.id);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.log('Auth Middleware: No user found for token ID:', decoded.id);
        return res.status(401).json({
          success: false,
          message: 'No user found with this token'
        });
      }

      // Check if user account is active
      if (user.status !== 'active') {
        console.log('Auth Middleware: User account not active:', user.status);
        return res.status(401).json({
          success: false,
          message: 'User account is not active'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth Middleware: Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('Auth Middleware: Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('Authorize Middleware: User not authenticated');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    console.log(`Authorize Middleware: Checking role '${req.user.role}' against allowed: [${roles.join(', ')}]`);

    if (!roles.includes(req.user.role)) {
      console.log(`Authorize Middleware: Access denied. Role '${req.user.role}' required: [${roles.join(', ')}]`);
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

// Check for specific permissions
const requirePermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!req.user.permissions || !permissions.some(permission => req.user.permissions.includes(permission))) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to access this route'
      });
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // Check for token in x-auth-token header
    else if (req.headers['x-auth-token']) {
      token = req.headers['x-auth-token'];
    }

    if (token) {
      try {
        // Verify token using config
        const decoded = jwt.verify(token, config.JWT_SECRET);

        // Get user from token
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.status === 'active' && !user.isLocked) {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but don't fail the request
        console.log('Invalid token in optional auth:', error.message);
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Check if user is super admin
const isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Super admin access required'
    });
  }
  next();
};

// Check if user owns the resource or is admin
const isOwnerOrAdmin = (resourceUserId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (req.user.role === 'admin' || req.user.role === 'super_admin') {
      return next();
    }

    if (req.user._id.toString() === resourceUserId.toString()) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  };
};

module.exports = {
  protect,
  authorize,
  requirePermission,
  optionalAuth,
  isAdmin,
  isSuperAdmin,
  isOwnerOrAdmin
}; 