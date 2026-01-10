const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('express-async-errors');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');
const qrRoutes = require('./routes/qr');
const orderRoutes = require('./routes/orders');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const authMiddleware = require('./middleware/auth');

const app = express();

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit auth attempts
  message: {
    error: 'Too many authentication attempts, please try again later.'
  }
});

app.use('/api/auth', authLimiter);
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// CORS configuration (fix preflight issue)
// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin); // Log for debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  preflightContinue: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Explicitly handle OPTIONS for all routes
app.options('*', cors(corsOptions));


// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed in middleware:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'TapOnn API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'MongoDB'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to TapOnn API',
    version: '1.0.0',
    database: 'MongoDB',
    endpoints: {
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
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 Shutting down gracefully...');
  }

  // Close MongoDB connection
  const mongoose = require('mongoose');
  await mongoose.connection.close();

  if (process.env.NODE_ENV === 'development') {
    console.log('✅ MongoDB connection closed.');
    console.log('✅ Server shutdown complete.');
  }
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

const PORT = process.env.PORT || 5000;

// Only listen if run directly (not imported as a module)
if (require.main === module) {
  app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`
  🚀 TapOnn Backend Server is running!
  ✅ THIS IS THE CORRECT SERVER (from backend_tapon)
  📍 Port: ${PORT}
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  🗄️ Database: MongoDB
  📊 Health Check: http://localhost:${PORT}/api/health
  📖 API Docs: http://localhost:${PORT}/
      `);
    } else {
      console.log(`🚀 TapOnn Backend Server running on port ${PORT} (${process.env.NODE_ENV})`);
    }
  });
}

module.exports = app; 