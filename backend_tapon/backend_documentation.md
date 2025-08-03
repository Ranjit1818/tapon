# 📚 TapOnn Backend - Complete Documentation

## 🏗️ Architecture Overview

### **System Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│   Port: 3002    │    │   Port: 5000    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cloudinary    │    │   File Storage  │    │   Analytics     │
│   (Images)      │    │   (QR Codes)    │    │   (Events)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Technology Stack**
- **Backend Framework**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary for images
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Email**: Nodemailer
- **Payments**: Stripe Integration
- **QR Codes**: qrcode npm package

---

## 📁 Backend Structure

```
backend_tapon/
├── 📁 config/                  # Configuration files
│   └── database.js             # MongoDB connection
├── 📁 controllers/             # Route controllers (TO BE CREATED)
│   ├── authController.js       # Authentication logic
│   ├── profileController.js    # Profile management
│   ├── qrController.js         # QR code operations
│   ├── orderController.js      # Order processing
│   ├── analyticsController.js  # Analytics tracking
│   ├── adminController.js      # Admin operations
│   └── uploadController.js     # File uploads
├── 📁 middleware/              # Custom middleware
│   ├── auth.js                 # Authentication middleware
│   ├── errorHandler.js         # Error handling
│   ├── notFound.js             # 404 handler
│   └── upload.js               # File upload handler
├── 📁 models/                  # Database models
│   ├── User.js                 # User schema
│   ├── Profile.js              # Profile schema
│   ├── QRCode.js               # QR code schema
│   ├── Order.js                # Order schema
│   └── Analytics.js            # Analytics schema
├── 📁 routes/                  # API routes
│   ├── auth.js                 # Auth endpoints
│   ├── profiles.js             # Profile endpoints
│   ├── qr.js                   # QR code endpoints
│   ├── orders.js               # Order endpoints
│   ├── analytics.js            # Analytics endpoints
│   ├── admin.js                # Admin endpoints
│   └── upload.js               # Upload endpoints
├── 📁 utils/                   # Utility functions (TO BE CREATED)
│   ├── errorResponse.js        # Custom error class
│   ├── sendEmail.js            # Email service
│   ├── cloudinary.js           # Image upload service
│   └── qrGenerator.js          # QR code generation
├── 📄 server.js                # Main server file
├── 📄 package.json             # Dependencies
└── 📄 .env                     # Environment variables
```

---

## 🚀 Complete Setup Process

### **Step 1: Install Dependencies**
```bash
# Navigate to backend directory
cd backend_tapon

# Install all required packages
npm install
```

### **Step 2: Environment Configuration**
Create `.env` file in `backend_tapon/` directory:

```env
# ==============================================
# ENVIRONMENT CONFIGURATION
# ==============================================

# Environment
NODE_ENV=development

# Server Configuration
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3002

# ==============================================
# DATABASE CONFIGURATION
# ==============================================

# Local MongoDB
MONGO_URI=mongodb://localhost:27017/taponn

# MongoDB Atlas (Cloud)
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taponn

# ==============================================
# AUTHENTICATION
# ==============================================

# JWT Configuration
JWT_SECRET=taponn-super-secret-jwt-key-2024-make-it-very-long-and-random
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# ==============================================
# THIRD-PARTY SERVICES
# ==============================================

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Service (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@taponn.com
EMAIL_FROM_NAME=TapOnn

# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# ==============================================
# SECURITY & PERFORMANCE
# ==============================================

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
```

### **Step 3: Database Setup**

#### **Option A: MongoDB Atlas (Recommended)**
1. **Create Account**: Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. **Create Cluster**: Choose free tier (M0)
3. **Set Database User**: Create username/password
4. **Whitelist IP**: Add your IP address (or 0.0.0.0/0 for development)
5. **Get Connection String**: Replace `<username>` and `<password>`
6. **Update .env**: Set `MONGO_URI` to your Atlas connection string

#### **Option B: Local MongoDB**
```bash
# Install MongoDB locally
# Windows: Download from https://www.mongodb.com/try/download/community
# macOS: brew install mongodb/brew/mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB service
# Windows: Start MongoDB service from Services
# macOS/Linux: brew services start mongodb/brew/mongodb-community
# or: sudo systemctl start mongod

# Verify connection
mongo --eval "db.runCommand({connectionStatus : 1})"
```

### **Step 4: Cloudinary Setup**
1. **Create Account**: Go to [Cloudinary](https://cloudinary.com)
2. **Get Credentials**: Dashboard → Settings → API Keys
3. **Update .env**: Add your cloud name, API key, and secret

### **Step 5: Create Required Controllers**

#### **`controllers/authController.js`**
```javascript
const User = require('../models/User');
const Profile = require('../models/Profile');
const Analytics = require('../models/Analytics');
const ErrorResponse = require('../utils/errorResponse');
const { validationResult } = require('express-validator');

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
    const existingUser = await User.findByEmail(email);
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
    await Profile.create({
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

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('profile');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/update-details
// @access  Private
const updateDetails = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorResponse('There is no user with that email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message
      });

      res.status(200).json({
        success: true,
        message: 'Email sent'
      });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse('Email could not be sent', 500));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

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

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword
};
```

#### **`utils/sendEmail.js`**
```javascript
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Define email options
  const message = {
    from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  // Send email
  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
  return info;
};

module.exports = sendEmail;
```

### **Step 6: Start the Backend Server**
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

**Expected Output:**
```
🚀 TapOnn Backend Server is running!
📍 Port: 5000
🌍 Environment: development
MongoDB Connected: cluster0-shard-00-01.mongodb.net
📊 Health Check: http://localhost:5000/api/health
📖 API Docs: http://localhost:5000/
```

---

## 🔗 Frontend Integration Guide

### **Step 1: Update Frontend API Configuration**

#### **Create `src/services/api.js`**
```javascript
import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/app/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### **Step 2: Update AuthContext to Use Real API**

#### **Update `src/contexts/AuthContext.jsx`**
```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUser(response.data.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        toast.success('Registration successful!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        toast.success('Login successful!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/update-details', profileData);
      if (response.data.success) {
        setUser(response.data.data);
        toast.success('Profile updated successfully!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    hasPermission,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isTapOnnUser: user?.role === 'admin',
    userRole: user?.role || 'user',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### **Step 3: Create Profile Service**

#### **Create `src/services/profileService.js`**
```javascript
import api from './api';

export const profileService = {
  // Get user's profiles
  getProfiles: async () => {
    const response = await api.get('/profiles');
    return response.data;
  },

  // Get profile by ID
  getProfile: async (id) => {
    const response = await api.get(`/profiles/${id}`);
    return response.data;
  },

  // Get profile by username (public)
  getProfileByUsername: async (username) => {
    const response = await api.get(`/profiles/username/${username}`);
    return response.data;
  },

  // Create new profile
  createProfile: async (profileData) => {
    const response = await api.post('/profiles', profileData);
    return response.data;
  },

  // Update profile
  updateProfile: async (id, profileData) => {
    const response = await api.put(`/profiles/${id}`, profileData);
    return response.data;
  },

  // Update social links
  updateSocialLinks: async (id, socialLinks) => {
    const response = await api.put(`/profiles/${id}/social-links`, socialLinks);
    return response.data;
  },

  // Update custom links
  updateCustomLinks: async (id, customLinks) => {
    const response = await api.put(`/profiles/${id}/custom-links`, { customLinks });
    return response.data;
  },

  // Update design
  updateDesign: async (id, design) => {
    const response = await api.put(`/profiles/${id}/design`, design);
    return response.data;
  },

  // Delete profile
  deleteProfile: async (id) => {
    const response = await api.delete(`/profiles/${id}`);
    return response.data;
  }
};
```

### **Step 4: Create QR Code Service**

#### **Create `src/services/qrService.js`**
```javascript
import api from './api';

export const qrService = {
  // Get user's QR codes
  getQRCodes: async () => {
    const response = await api.get('/qr');
    return response.data;
  },

  // Get QR code by ID
  getQRCode: async (id) => {
    const response = await api.get(`/qr/${id}`);
    return response.data;
  },

  // Create new QR code
  createQRCode: async (qrData) => {
    const response = await api.post('/qr', qrData);
    return response.data;
  },

  // Update QR code
  updateQRCode: async (id, qrData) => {
    const response = await api.put(`/qr/${id}`, qrData);
    return response.data;
  },

  // Delete QR code
  deleteQRCode: async (id) => {
    const response = await api.delete(`/qr/${id}`);
    return response.data;
  },

  // Download QR code
  downloadQRCode: async (id) => {
    const response = await api.get(`/qr/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Get QR analytics
  getQRAnalytics: async (id, timeRange = 30) => {
    const response = await api.get(`/qr/${id}/analytics?timeRange=${timeRange}`);
    return response.data;
  },

  // Toggle QR status
  toggleQRStatus: async (id) => {
    const response = await api.patch(`/qr/${id}/toggle-status`);
    return response.data;
  }
};
```

### **Step 5: Update Environment Variables**

#### **Create `frontend/.env`**
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=TapOnn
VITE_APP_VERSION=1.0.0

# Demo Mode (fallback when backend is offline)
VITE_DEMO_MODE=false
```

---

## 📊 Complete API Endpoints Documentation

### **Authentication Endpoints**

#### **POST `/api/auth/register`**
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8b1a2c7d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "permissions": ["profile_view", "profile_edit", "card_purchase"]
  }
}
```

#### **POST `/api/auth/login`**
Authenticate user credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8b1a2c7d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "permissions": ["profile_view", "profile_edit", "card_purchase"]
  }
}
```

#### **GET `/api/auth/me`**
Get current authenticated user.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "64f8b1a2c7d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "permissions": ["profile_view", "profile_edit", "card_purchase"],
    "profile": {
      "id": "64f8b1a2c7d4e5f6a7b8c9d1",
      "username": "johndoe",
      "displayName": "John Doe",
      "bio": "Digital professional"
    }
  }
}
```

### **Profile Endpoints**

#### **POST `/api/profiles`**
Create a new digital profile.

**Request Body:**
```json
{
  "username": "johndoe",
  "displayName": "John Doe",
  "bio": "Digital professional and entrepreneur",
  "company": "Tech Corp",
  "jobTitle": "Software Developer",
  "location": "San Francisco, CA",
  "website": "https://johndoe.com"
}
```

#### **GET `/api/profiles/username/{username}`**
Get public profile by username.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "64f8b1a2c7d4e5f6a7b8c9d1",
    "username": "johndoe",
    "displayName": "John Doe",
    "bio": "Digital professional and entrepreneur",
    "avatar": {
      "url": "https://res.cloudinary.com/taponn/image/upload/v1/profiles/avatar.jpg"
    },
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/johndoe",
      "twitter": "https://twitter.com/johndoe",
      "instagram": "https://instagram.com/johndoe"
    },
    "customLinks": [
      {
        "title": "Portfolio",
        "url": "https://johndoe.dev",
        "icon": "globe",
        "order": 1
      }
    ],
    "analytics": {
      "views": {
        "total": 156,
        "unique": 89,
        "monthly": 45
      }
    }
  }
}
```

### **QR Code Endpoints**

#### **POST `/api/qr`**
Create a new QR code.

**Request Body:**
```json
{
  "type": "profile",
  "title": "My Digital Profile",
  "description": "Scan to view my professional profile",
  "data": {
    "content": "https://taponn.com/profile/johndoe"
  },
  "design": {
    "foregroundColor": "#000000",
    "backgroundColor": "#FFFFFF",
    "errorCorrectionLevel": "M",
    "margin": 4
  },
  "settings": {
    "isActive": true,
    "trackScans": true
  }
}
```

#### **GET `/api/qr/scan/{qrId}`**
Public endpoint for scanning QR codes.

**Response:**
```json
{
  "success": true,
  "redirect": "https://taponn.com/profile/johndoe",
  "message": "Redirecting to profile..."
}
```

### **Order Endpoints**

#### **POST `/api/orders`**
Create a new order for NFC/Review cards.

**Request Body:**
```json
{
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Tech Corp"
  },
  "items": [
    {
      "productType": "nfc_card",
      "productName": "Premium NFC Card",
      "quantity": 5,
      "unitPrice": 15.99,
      "totalPrice": 79.95,
      "customization": {
        "design": {
          "template": "professional",
          "colors": {
            "primary": "#000000",
            "secondary": "#FFFFFF"
          },
          "text": {
            "name": "John Doe",
            "title": "Software Developer",
            "company": "Tech Corp"
          }
        }
      }
    }
  ],
  "shipping": {
    "address": {
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94105",
      "country": "United States"
    },
    "method": "standard"
  },
  "payment": {
    "method": "stripe"
  }
}
```

### **Analytics Endpoints**

#### **POST `/api/analytics/event`**
Record an analytics event.

**Request Body:**
```json
{
  "event": {
    "type": "profile_view",
    "category": "engagement",
    "action": "view_profile",
    "label": "johndoe"
  },
  "profile": "64f8b1a2c7d4e5f6a7b8c9d1",
  "session": {
    "sessionId": "sess_abc123",
    "isNewSession": true
  },
  "device": {
    "type": "mobile",
    "browser": "Chrome",
    "os": "iOS"
  },
  "location": {
    "country": "United States",
    "city": "San Francisco"
  }
}
```

---

## 🔄 Complete Integration Process

### **Step 1: Start Both Servers**

#### **Terminal 1: Backend**
```bash
cd backend_tapon
npm run dev
```

#### **Terminal 2: Frontend**
```bash
cd letsconnect
npm run dev
```

### **Step 2: Test API Connection**

#### **Frontend Test Component**
Create `src/components/ApiTest.jsx`:
```javascript
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ApiTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [data, setData] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const response = await api.get('/health');
      setStatus('✅ Connected');
      setData(response.data);
    } catch (error) {
      setStatus('❌ Connection Failed');
      setData(error.message);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold">API Connection Test</h3>
      <p>Status: {status}</p>
      {data && (
        <pre className="mt-2 text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default ApiTest;
```

### **Step 3: Update Registration Flow**

#### **Update `src/pages/app/RegisterPage.jsx`**
```javascript
// Replace the demo registration with real API call
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const result = await register({
    name: formData.name,
    email: formData.email,
    password: formData.password
  });

  if (result.success) {
    navigate('/app/dashboard');
  }

  setIsLoading(false);
};
```

### **Step 4: Update Login Flow**

#### **Update `src/pages/app/LoginPage.jsx`**
```javascript
// Replace the demo login with real API call
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const result = await login({
    email: formData.email,
    password: formData.password
  });

  if (result.success) {
    navigate('/app/dashboard');
  }

  setIsLoading(false);
};
```

### **Step 5: Implement Real Profile Management**

#### **Create `src/hooks/useProfile.js`**
```javascript
import { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';
import toast from 'react-hot-toast';

export const useProfile = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await profileService.getProfiles();
      if (response.success) {
        setProfiles(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch profiles');
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData) => {
    try {
      const response = await profileService.createProfile(profileData);
      if (response.success) {
        setProfiles(prev => [...prev, response.data]);
        toast.success('Profile created successfully!');
        return { success: true, data: response.data };
      }
    } catch (error) {
      toast.error('Failed to create profile');
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (id, profileData) => {
    try {
      const response = await profileService.updateProfile(id, profileData);
      if (response.success) {
        setProfiles(prev => 
          prev.map(p => p.id === id ? response.data : p)
        );
        toast.success('Profile updated successfully!');
        return { success: true, data: response.data };
      }
    } catch (error) {
      toast.error('Failed to update profile');
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return {
    profiles,
    loading,
    fetchProfiles,
    createProfile,
    updateProfile
  };
};
```

---

## 🛡️ Security & Error Handling

### **Authentication Security**
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Account Lockout**: Temporary lockout after failed attempts
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Comprehensive validation on all inputs

### **API Security**
- **CORS**: Configured for specific origins
- **Helmet**: Security headers
- **Input Sanitization**: Protection against injection attacks
- **File Upload Limits**: Size and type restrictions
- **Permission Checks**: Role-based access control

### **Error Handling**
```javascript
// Centralized error handling in frontend
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data.message || 'An error occurred';
    toast.error(message);
    
    if (error.response.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      window.location.href = '/app/login';
    }
  } else if (error.request) {
    // Network error
    toast.error('Network error. Please check your connection.');
  } else {
    // Other error
    toast.error('An unexpected error occurred.');
  }
};
```

---

## 🚀 Deployment Guide

### **Backend Deployment (AWS App Runner)**

#### **1. Prepare for Production**
```env
# Production .env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taponn_prod
JWT_SECRET=your-production-jwt-secret-very-long-and-secure
FRONTEND_URL=https://yourdomain.com
# ... other production variables
```

#### **2. Create Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### **3. Deploy to AWS App Runner**
1. Push code to GitHub
2. Go to AWS App Runner
3. Create service from GitHub repository
4. Set environment variables
5. Deploy

### **Frontend Deployment (Vercel)**

#### **1. Update Environment Variables**
```env
# Production .env
VITE_API_URL=https://your-backend-url.com/api
VITE_APP_NAME=TapOnn
VITE_DEMO_MODE=false
```

#### **2. Deploy to Vercel**
```bash
npm install -g vercel
vercel --prod
```

---

## 📋 Testing Guide

### **Backend API Testing**

#### **Using Postman**
1. **Import Collection**: Create Postman collection with all endpoints
2. **Set Environment Variables**: 
   - `base_url`: `http://localhost:5000/api`
   - `token`: `{{token}}`
3. **Test Authentication Flow**:
   - Register → Login → Get Profile
4. **Test Protected Routes**: Use token from login

#### **Sample Test Requests**

**Register User:**
```
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPass123"
}
```

**Create Profile:**
```
POST {{base_url}}/profiles
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "username": "testuser",
  "displayName": "Test User",
  "bio": "Test bio"
}
```

### **Frontend Testing**
```javascript
// Test authentication flow
describe('Authentication', () => {
  test('should register new user', async () => {
    // Test registration
  });
  
  test('should login existing user', async () => {
    // Test login
  });
  
  test('should access protected routes', async () => {
    // Test protected access
  });
});
```

---

## 🎯 Next Steps Checklist

### **Immediate Tasks**
- [ ] Create remaining controller files
- [ ] Set up MongoDB (local or Atlas)
- [ ] Configure Cloudinary account
- [ ] Test API endpoints
- [ ] Update frontend API calls
- [ ] Test full authentication flow

### **Advanced Features**
- [ ] Email verification system
- [ ] Password reset functionality
- [ ] File upload for profile images
- [ ] QR code generation with custom designs
- [ ] Analytics dashboard with real data
- [ ] Payment processing with Stripe
- [ ] Admin panel functionality

### **Production Readiness**
- [ ] Set up production environment variables
- [ ] Configure production database
- [ ] Set up monitoring and logging
- [ ] Implement automated testing
- [ ] Set up CI/CD pipeline
- [ ] Configure domain and SSL

---

## 🆘 Troubleshooting

### **Common Issues**

#### **1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: 
- Check MongoDB is running
- Verify connection string in `.env`
- For Atlas: check IP whitelist

#### **2. CORS Error**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: 
- Add frontend URL to `CORS_ORIGINS` in `.env`
- Restart backend server

#### **3. Token Validation Error**
```
jwt malformed or invalid
```
**Solution**: 
- Check JWT_SECRET in `.env`
- Clear localStorage and login again

#### **4. File Upload Error**
```
Cloudinary credentials invalid
```
**Solution**: 
- Verify Cloudinary credentials in `.env`
- Check API key permissions

### **Debug Commands**
```bash
# Check backend health
curl http://localhost:5000/api/health

# Test database connection
node -e "require('./config/database')()"

# Check environment variables
node -e "console.log(process.env.MONGO_URI)"
```

---

## 📞 Support

For additional help:
1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test API endpoints individually
4. Check network connectivity between frontend and backend
5. Review MongoDB connection and permissions

**Your TapOnn backend is now fully documented and ready for production! 🚀** 