const User = require('../models/User');
const Profile = require('../models/Profile');
const QRCode = require('../models/QRCode');
const Analytics = require('../models/Analytics');
const ErrorResponse = require('../utils/errorResponse');
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const config = require('../config/config');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log("📩 Incoming registration request:");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
  }
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array({ onlyFirstError: true })[0];
      return res.status(400).json({
        success: false,
        message: firstError.msg || 'Validation failed',
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
      password,
      permissions: ['profile_edit', 'profile_view', 'qr_generate']
    });

    // Create default profile
    const profile = await Profile.create({
      user: user._id,
      displayName: name
    });

    // Create default QR code for the profile - MUST SUCCEED
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const profileUrl = profile.username 
      ? `${frontendUrl}/p/${profile.username}` 
      : `${frontendUrl}/p/${profile._id}`;
    
    try {
      // Check if QR code already exists (shouldn't happen, but just in case)
      const existingQR = await QRCode.findOne({ 
        user: user._id, 
        profile: profile._id 
      });
      
      if (!existingQR) {
        const qrCode = await QRCode.create({
          user: user._id,
          profile: profile._id,
          name: `${name} QR Code`,
          type: 'profile',
          qrData: profileUrl,
          isActive: true
        });
        
        console.log(`✅ Auto-generated QR code for new user: ${name} (${email})`);
        console.log(`   Profile ID: ${profile._id}, QR Code ID: ${qrCode._id}`);
      } else {
        console.log(`⚠️  QR code already exists for user: ${name} (${email})`);
      }
    } catch (qrError) {
      // Log error but don't fail registration
      console.error('❌ CRITICAL: Failed to auto-generate QR code during registration!');
      console.error('User:', name, email);
      console.error('Profile ID:', profile._id);
      console.error('Error:', qrError.message);
      console.error('Error stack:', qrError.stack);
      if (qrError.errors) {
        console.error('Validation errors:', JSON.stringify(qrError.errors, null, 2));
      }
      // Try to create QR code again with minimal data
      try {
        await QRCode.create({
          user: user._id,
          profile: profile._id,
          name: `${name} QR Code`,
          type: 'profile',
          qrData: profileUrl,
          isActive: true
        });
        console.log(`✅ Retry successful: QR code created for ${name}`);
      } catch (retryError) {
        console.error('❌ Retry also failed:', retryError.message);
      }
    }

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
  if (process.env.NODE_ENV === 'development') {
    console.log("Request body in login:", req.body);
  } 
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array({ onlyFirstError: true })[0];
      return res.status(400).json({
        success: false,
        message: firstError.msg || 'Validation failed',
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

    // Reset login attempts on successful login
    await user.resetLoginAttempts();
    await user.updateLastLogin();

    // Record analytics event
    await Analytics.recordEvent({
      user: user._id,
      event: {
        type: 'user_login',
        category: 'authentication',
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
// @access  Private
const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    });
  } catch (error) {
    next(error);
  }
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

// @desc    Verify email
// @route   GET /api/auth/verify-email/:verificationtoken
// @access  Public
const verifyEmail = async (req, res, next) => {
  try {
    // Get hashed token
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(req.params.verificationtoken)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid token', 400));
    }

    // Set email as verified
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new ErrorResponse('There is no user with that email', 404));
    }

    if (user.emailVerified) {
      return next(new ErrorResponse('Email is already verified', 400));
    }

    // Generate verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Create verification url
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;

    const message = `Please verify your email by clicking on this link: \n\n ${verificationUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Email verification',
        message
      });

      res.status(200).json({
        success: true,
        message: 'Verification email sent'
      });
    } catch (err) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse('Email could not be sent', 500));
    }
  } catch (error) {
    next(error);
  }
};

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  try {
    const token = user.generateAuthToken();

    const options = {
      expires: new Date(
        Date.now() + config.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };

    if (config.NODE_ENV === 'production') {
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
  } catch (error) {
    console.error('Error generating token response:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating authentication token'
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification
};
