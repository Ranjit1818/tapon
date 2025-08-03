# 🚀 TapOnn Backend - Complete Setup Guide

## 📋 Overview

This is the complete backend for the TapOnn digital profile platform built with:
- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**
- **JWT Authentication** with role-based permissions
- **Cloudinary** for image storage
- **QR Code** generation and management
- **Analytics** tracking
- **Order Management** for NFC/Review cards
- **Email** notifications
- **Stripe** payment processing

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
cd backend_tapon
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory with these variables:

```env
# Environment
NODE_ENV=development

# Server Configuration
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Database
MONGO_URI=mongodb://localhost:27017/taponn

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@taponn.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### 3. MongoDB Setup
- **Local**: Install MongoDB locally or use MongoDB Atlas
- **Atlas**: Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
- Update `MONGO_URI` in your `.env` file

### 4. Cloudinary Setup
1. Create account at [Cloudinary](https://cloudinary.com)
2. Get your credentials from dashboard
3. Update Cloudinary variables in `.env`

### 5. Start the Server
```bash
# Development
npm run dev

# Production
npm start
```

## 📁 Remaining Files to Create

### Controllers (`controllers/` directory)
You need to create these controller files:

#### `authController.js`
```javascript
const User = require('../models/User');
const Profile = require('../models/Profile');
const Analytics = require('../models/Analytics');
const ErrorResponse = require('../utils/errorResponse');
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('User already exists with this email', 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Create default profile
    const profile = await Profile.create({
      user: user._id,
      displayName: name
    });

    // Record analytics event
    await Analytics.recordEvent({
      user: user._id,
      event: {
        type: 'user_registration',
        category: 'acquisition',
        action: 'register'
      },
      metadata: {
        ipAddress: req.ip
      }
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check for user (include password for comparison)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if user is locked
    if (user.isLocked) {
      return next(new ErrorResponse('Account temporarily locked due to too many failed login attempts', 423));
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // Increment login attempts
      await user.incLoginAttempts();
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Reset login attempts and update last login
    await user.resetLoginAttempts();
    await user.updateLastLogin();

    // Record analytics event
    await Analytics.recordEvent({
      user: user._id,
      event: {
        type: 'user_login',
        category: 'engagement',
        action: 'login'
      },
      metadata: {
        ipAddress: req.ip
      }
    });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateAuthToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });
};

// Add more auth controller methods...
module.exports = {
  register,
  login,
  // ... other methods
};
```

#### Other Controllers Needed:
- `profileController.js` - Profile management
- `qrController.js` - QR code operations
- `orderController.js` - Order processing
- `analyticsController.js` - Analytics data
- `adminController.js` - Admin operations
- `uploadController.js` - File uploads

### Utilities (`utils/` directory)

#### `sendEmail.js`
```javascript
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const message = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
```

#### Other Utilities Needed:
- `cloudinary.js` - Image upload service
- `qrGenerator.js` - QR code generation
- `analytics.js` - Analytics helpers
- `validators.js` - Custom validators
- `emailTemplates.js` - Email templates

### Configuration (`config/` directory)
- `cloudinary.js` - Cloudinary configuration
- `stripe.js` - Stripe configuration
- `email.js` - Email service configuration

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-details` - Update user details
- `PUT /api/auth/update-password` - Update password
- `POST /api/auth/forgot-password` - Forgot password
- `PUT /api/auth/reset-password/:token` - Reset password

### Profiles
- `GET /api/profiles` - Get profiles
- `POST /api/profiles` - Create profile
- `GET /api/profiles/:id` - Get profile
- `PUT /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile
- `GET /api/profiles/username/:username` - Get profile by username

### QR Codes
- `GET /api/qr` - Get QR codes
- `POST /api/qr` - Create QR code
- `GET /api/qr/:id` - Get QR code
- `PUT /api/qr/:id` - Update QR code
- `DELETE /api/qr/:id` - Delete QR code
- `GET /api/qr/:id/download` - Download QR code
- `GET /api/qr/scan/:qrId` - Scan QR code

### Orders
- `GET /api/orders` - Get orders
- `POST /api/orders` - Create order
- `GET /api/orders/:orderId` - Get order
- `PUT /api/orders/:orderId` - Update order
- `PATCH /api/orders/:orderId/cancel` - Cancel order

### Analytics
- `POST /api/analytics/event` - Record event
- `GET /api/analytics/user` - Get user analytics
- `GET /api/analytics/profile/:profileId` - Get profile analytics
- `GET /api/analytics/qr/:qrId` - Get QR analytics

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - All users
- `GET /api/admin/profiles` - All profiles
- `GET /api/admin/orders` - All orders

### Upload
- `POST /api/upload/profile-image` - Upload profile image
- `POST /api/upload/qr-logo` - Upload QR logo
- `DELETE /api/upload/:publicId` - Delete image

## 🗃️ Database Models

The following models are already created:
- **User** - User authentication and management
- **Profile** - Digital profiles
- **QRCode** - QR code generation and tracking
- **Order** - NFC/Review card orders
- **Analytics** - Event tracking

## 🔐 Authentication & Permissions

### User Roles
- **user** - Basic user permissions
- **admin** - Admin permissions
- **super_admin** - Full system access

### Permissions
- `profile_view` - View profiles
- `profile_edit` - Edit profiles
- `qr_generate` - Generate QR codes
- `qr_manage` - Manage QR codes
- `card_purchase` - Purchase cards
- `card_manage` - Manage card inventory
- `user_manage` - Manage users
- `analytics` - View analytics
- `admin_panel` - Access admin panel

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taponn
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://yourdomain.com
# ... other production variables
```

### AWS Deployment
1. Use AWS App Runner or Elastic Beanstalk
2. Set environment variables in AWS console
3. Configure MongoDB Atlas for production
4. Set up Cloudinary for image storage
5. Configure Stripe for payments

## 📊 Monitoring & Analytics

- **Error Tracking**: Integrate Sentry for error monitoring
- **Performance**: Use New Relic or similar
- **Logs**: Implement structured logging with Winston
- **Health Checks**: `/api/health` endpoint for monitoring

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Seed database with sample data
npm run seed

# Start production server
npm start
```

## 📝 Notes

1. **Security**: All routes implement proper authentication and authorization
2. **Validation**: Input validation using express-validator
3. **Error Handling**: Centralized error handling with custom error responses
4. **Rate Limiting**: Implemented to prevent abuse
5. **CORS**: Configured for frontend integration
6. **File Upload**: Handled via Cloudinary with size and type restrictions
7. **Analytics**: Event tracking for user behavior analysis
8. **Email**: Automated emails for registration, password reset, etc.

## 🆘 Support

For issues or questions:
1. Check the logs in development mode
2. Verify environment variables are set correctly
3. Ensure MongoDB connection is working
4. Check Cloudinary credentials for image uploads
5. Verify Stripe configuration for payments

## 🎯 Next Steps

After creating the remaining controller and utility files:
1. Test all API endpoints
2. Set up database indexes for performance
3. Implement comprehensive logging
4. Add automated tests
5. Set up CI/CD pipeline
6. Configure monitoring and alerts 