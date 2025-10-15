const Profile = require('../models/Profile');
const User = require('../models/User');
const QRCode = require('../models/QRCode');
const Analytics = require('../models/Analytics');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all profiles (with pagination and filtering)
// @route   GET /api/profiles
// @access  Public
const getProfiles = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const filter = { isPublic: true };
    
    // Add search filter
    if (req.query.search) {
      filter.$or = [
        { displayName: { $regex: req.query.search, $options: 'i' } },
        { username: { $regex: req.query.search, $options: 'i' } },
        { bio: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const total = await Profile.countDocuments(filter);
    const profiles = await Profile.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    // Pagination result
    const pagination = {};
    const endIndex = startIndex + limit;

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: profiles.length,
      pagination,
      data: profiles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's profile
// @route   GET /api/profiles/my
// @access  Private
const getMyProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
      .populate('user', 'name email')
      .populate('qrCodes');

    if (!profile) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No profile found for this user'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

const getPublicProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    
    const profile = await Profile.findOne({ 
      username: username,
      isPublic: true 
    })
      .populate('user', 'name email')
      .select('-qrCodes'); // Don't include QR codes in public view

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found or not public'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single profile by ID
// @route   GET /api/profiles/:id
// @access  Public
const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.id)
      .populate('user', 'name email')
      .populate('qrCodes');

    if (!profile) {
      return next(new ErrorResponse(`Profile not found with id of ${req.params.id}`, 404));
    }

    // Record view analytics
    await Analytics.recordEvent({
      profile: profile._id,
      event: {
        type: 'profile_view',
        category: 'engagement',
        action: 'view'
      },
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get profile by username
// @route   GET /api/profiles/username/:username
// @access  Public
const getProfileByUsername = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ username: req.params.username })
      .populate('user', 'name email')
      .populate('qrCodes');

    if (!profile) {
      return next(new ErrorResponse(`Profile not found with username ${req.params.username}`, 404));
    }

    if (!profile.isPublic) {
      return next(new ErrorResponse('Profile is private', 403));
    }

    // Record view analytics
    await Analytics.recordEvent({
      profile: profile._id,
      event: {
        type: 'profile_view',
        category: 'engagement',
        action: 'view'
      },
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new profile
// @route   POST /api/profiles
// @access  Private
const createProfile = async (req, res, next) => {
  try {
    // Add user to body
    req.body.user = req.user.id;

    // Check for existing profile
    const existingProfile = await Profile.findOne({ user: req.user.id });
    if (existingProfile) {
      return next(new ErrorResponse('User already has a profile', 400));
    }

    const profile = await Profile.create(req.body);

    // Create default QR code
    try {
      await QRCode.create({
        user: req.user.id,
        profile: profile._id,
        name: `${profile.displayName || 'Profile'} QR Code`,
        type: 'profile',
        qrData: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/p/${profile.username || profile._id}`,
        isActive: true
      });
      console.log(`✅ Auto-generated QR code for profile: ${profile._id}`);
    } catch (qrError) {
      console.error('Failed to auto-generate QR code:', qrError);
      // Don't fail profile creation if QR generation fails
    }

    res.status(201).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/profiles/:id
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findById(req.params.id);

    if (!profile) {
      return next(new ErrorResponse(`Profile not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns profile
    if (profile.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this profile`, 401));
    }

    profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete profile
// @route   DELETE /api/profiles/:id
// @access  Private
const deleteProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return next(new ErrorResponse(`Profile not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns profile
    if (profile.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this profile`, 401));
    }

    await profile.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update social links
// @route   PUT /api/profiles/:id/social-links
// @access  Private
const updateSocialLinks = async (req, res, next) => {
  try {
    let profile = await Profile.findById(req.params.id);

    if (!profile) {
      return next(new ErrorResponse(`Profile not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns profile
    if (profile.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this profile`, 401));
    }

    profile.socialLinks = { ...profile.socialLinks, ...req.body };
    await profile.save();

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update custom links
// @route   PUT /api/profiles/:id/custom-links
// @access  Private
const updateCustomLinks = async (req, res, next) => {
  try {
    let profile = await Profile.findById(req.params.id);

    if (!profile) {
      return next(new ErrorResponse(`Profile not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns profile
    if (profile.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this profile`, 401));
    }

    profile.customLinks = req.body.customLinks;
    await profile.save();

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update design settings
// @route   PUT /api/profiles/:id/design
// @access  Private
const updateDesign = async (req, res, next) => {
  try {
    let profile = await Profile.findById(req.params.id);

    if (!profile) {
      return next(new ErrorResponse(`Profile not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns profile
    if (profile.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this profile`, 401));
    }

    profile.theme = req.body.theme;
    profile.colors = req.body.colors;
    profile.fonts = req.body.fonts;
    await profile.save();

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile settings
// @route   PUT /api/profiles/:id/settings
// @access  Private
const updateSettings = async (req, res, next) => {
  try {
    let profile = await Profile.findById(req.params.id);

    if (!profile) {
      return next(new ErrorResponse(`Profile not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns profile
    if (profile.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this profile`, 401));
    }

    profile.isPublic = req.body.isPublic;
    profile.allowContact = req.body.allowContact;
    profile.showAnalytics = req.body.showAnalytics;
    await profile.save();

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle profile status
// @route   PATCH /api/profiles/:id/toggle-status
// @access  Private
const toggleProfileStatus = async (req, res, next) => {
  try {
    let profile = await Profile.findById(req.params.id);

    if (!profile) {
      return next(new ErrorResponse(`Profile not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns profile
    if (profile.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this profile`, 401));
    }

    profile.isPublic = !profile.isPublic;
    await profile.save();

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate profile QR code
// @route   POST /api/profiles/:id/generate-qr
// @access  Private
const generateProfileQR = async (req, res, next) => {
  try {
    const profile = await Profile.findById(req.params.id);

    if (!profile) {
      return next(new ErrorResponse(`Profile not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns profile
    if (profile.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to generate QR for this profile`, 401));
    }

    // Create new QR code
    const qrCode = await QRCode.create({
      user: req.user.id,
      profile: profile._id,
      name: req.body.name || 'Profile QR Code',
      qrData: `${process.env.FRONTEND_URL}/profile/${profile.username || profile._id}`
    });

    res.status(201).json({
      success: true,
      data: qrCode
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfiles,
  getMyProfile,
  getPublicProfile,
  getProfile,
  getProfileByUsername,
  createProfile,
  updateProfile,
  deleteProfile,
  updateSocialLinks,
  updateCustomLinks,
  updateDesign,
  updateSettings,
  toggleProfileStatus,
  generateProfileQR
};

