const Profile = require('../models/Profile');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const QRCode = require('qrcode');
const cloudinary = require('../utils/cloudinary');

// @desc    Create new profile
// @route   POST /api/profiles
// @access  Private
const createProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const {
      username,
      name,
      title,
      company,
      email,
      phone,
      location,
      bio,
      website,
      socialLinks,
      customLinks,
      theme,
      settings
    } = req.body;

    // Check if username is already taken
    const existingProfile = await Profile.findOne({ username: username.toLowerCase() });
    if (existingProfile) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Check if user already has a profile
    const userProfile = await Profile.findOne({ user: req.user.id });
    if (userProfile) {
      return res.status(400).json({ message: 'User already has a profile' });
    }

    // Create profile
    const profile = await Profile.create({
      user: req.user.id,
      username: username.toLowerCase(),
      name,
      title,
      company,
      email,
      phone,
      location,
      bio,
      website,
      socialLinks,
      customLinks,
      theme,
      settings
    });

    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(profile.profileUrl);
    
    // Upload QR code to Cloudinary
    const qrCodeResult = await cloudinary.uploader.upload(qrCodeDataURL, {
      folder: 'taponn/qrcodes',
      public_id: `qr_${profile.username}`,
      overwrite: true
    });

    // Update profile with QR code URL
    profile.qrCode.url = qrCodeResult.secure_url;
    profile.qrCode.lastGenerated = new Date();
    await profile.save();

    res.status(201).json({
      message: 'Profile created successfully',
      profile: {
        id: profile._id,
        username: profile.username,
        name: profile.name,
        title: profile.title,
        company: profile.company,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        website: profile.website,
        socialLinks: profile.socialLinks,
        customLinks: profile.customLinks,
        theme: profile.theme,
        settings: profile.settings,
        qrCode: profile.qrCode,
        profileUrl: profile.profileUrl,
        analytics: profile.analytics
      }
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get public profile by username
// @route   GET /api/profiles/:username
// @access  Public
const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const profile = await Profile.findOne({ 
      username: username.toLowerCase(),
      isActive: true,
      'settings.isPublic': true
    }).populate('user', 'name email');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Increment view count
    await profile.incrementViews();

    // Filter sensitive data based on settings
    const publicProfile = {
      id: profile._id,
      username: profile.username,
      name: profile.name,
      title: profile.title,
      company: profile.company,
      email: profile.settings.showEmail ? profile.email : null,
      phone: profile.settings.showPhone ? profile.phone : null,
      location: profile.location,
      bio: profile.bio,
      website: profile.website,
      profileImage: profile.profileImage,
      coverImage: profile.coverImage,
      socialLinks: profile.socialLinks,
      customLinks: profile.customLinks.filter(link => link.isActive),
      theme: profile.theme,
      profileUrl: profile.profileUrl,
      allowLeadCapture: profile.settings.allowLeadCapture
    };

    res.json({ profile: publicProfile });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's own profile
// @route   GET /api/profiles/me
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({
      profile: {
        id: profile._id,
        username: profile.username,
        name: profile.name,
        title: profile.title,
        company: profile.company,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
        website: profile.website,
        profileImage: profile.profileImage,
        coverImage: profile.coverImage,
        socialLinks: profile.socialLinks,
        customLinks: profile.customLinks,
        theme: profile.theme,
        settings: profile.settings,
        qrCode: profile.qrCode,
        profileUrl: profile.profileUrl,
        analytics: profile.analytics,
        isActive: profile.isActive,
        isVerified: profile.isVerified,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
      }
    });
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update profile
// @route   PUT /api/profiles/:id
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const profile = await Profile.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const {
      name,
      title,
      company,
      email,
      phone,
      location,
      bio,
      website,
      socialLinks,
      customLinks,
      theme,
      settings
    } = req.body;

    // Update fields
    if (name) profile.name = name;
    if (title !== undefined) profile.title = title;
    if (company !== undefined) profile.company = company;
    if (email) profile.email = email;
    if (phone !== undefined) profile.phone = phone;
    if (location !== undefined) profile.location = location;
    if (bio !== undefined) profile.bio = bio;
    if (website !== undefined) profile.website = website;
    if (socialLinks) profile.socialLinks = { ...profile.socialLinks, ...socialLinks };
    if (customLinks) profile.customLinks = customLinks;
    if (theme) profile.theme = theme;
    if (settings) profile.settings = { ...profile.settings, ...settings };

    const updatedProfile = await profile.save();

    res.json({
      message: 'Profile updated successfully',
      profile: {
        id: updatedProfile._id,
        username: updatedProfile.username,
        name: updatedProfile.name,
        title: updatedProfile.title,
        company: updatedProfile.company,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
        location: updatedProfile.location,
        bio: updatedProfile.bio,
        website: updatedProfile.website,
        profileImage: updatedProfile.profileImage,
        coverImage: updatedProfile.coverImage,
        socialLinks: updatedProfile.socialLinks,
        customLinks: updatedProfile.customLinks,
        theme: updatedProfile.theme,
        settings: updatedProfile.settings,
        qrCode: updatedProfile.qrCode,
        profileUrl: updatedProfile.profileUrl,
        analytics: updatedProfile.analytics
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete profile
// @route   DELETE /api/profiles/:id
// @access  Private
const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Delete QR code from Cloudinary if exists
    if (profile.qrCode.url) {
      try {
        await cloudinary.uploader.destroy(`taponn/qrcodes/qr_${profile.username}`);
      } catch (error) {
        console.error('Error deleting QR code from Cloudinary:', error);
      }
    }

    await Profile.findByIdAndDelete(req.params.id);

    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Regenerate QR code
// @route   POST /api/profiles/:id/regenerate-qr
// @access  Private
const regenerateQRCode = async (req, res) => {
  try {
    const profile = await Profile.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Generate new QR code
    const qrCodeDataURL = await QRCode.toDataURL(profile.profileUrl);
    
    // Upload new QR code to Cloudinary
    const qrCodeResult = await cloudinary.uploader.upload(qrCodeDataURL, {
      folder: 'taponn/qrcodes',
      public_id: `qr_${profile.username}`,
      overwrite: true
    });

    // Update profile with new QR code URL
    profile.qrCode.url = qrCodeResult.secure_url;
    profile.qrCode.lastGenerated = new Date();
    await profile.save();

    res.json({
      message: 'QR code regenerated successfully',
      qrCode: profile.qrCode
    });
  } catch (error) {
    console.error('Regenerate QR code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all profiles (admin only)
// @route   GET /api/profiles
// @access  Private/Admin
const getAllProfiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const profiles = await Profile.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Profile.countDocuments();

    res.json({
      profiles,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get all profiles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createProfile,
  getPublicProfile,
  getMyProfile,
  updateProfile,
  deleteProfile,
  regenerateQRCode,
  getAllProfiles
}; 