const { 
  uploadSingle, 
  uploadMultiple, 
  uploadProfileImage, 
  uploadCoverImage, 
  handleUploadError, 
  deleteCloudinaryFile, 
  getFileUrl 
} = require('../middlewares/upload');
const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private
const uploadImage = async (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      return handleUploadError(err, req, res, () => {});
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const fileUrl = getFileUrl(req.file);

      res.json({
        message: 'Image uploaded successfully',
        file: {
          url: fileUrl,
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size
        }
      });
    } catch (error) {
      console.error('Upload image error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
};

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private
const uploadImages = async (req, res) => {
  uploadMultiple(req, res, async (err) => {
    if (err) {
      return handleUploadError(err, req, res, () => {});
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    try {
      const files = req.files.map(file => ({
        url: getFileUrl(file),
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      }));

      res.json({
        message: 'Images uploaded successfully',
        files
      });
    } catch (error) {
      console.error('Upload images error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
};

// @desc    Upload profile image
// @route   POST /api/upload/profile-image
// @access  Private
const uploadProfileImageHandler = async (req, res) => {
  uploadProfileImage(req, res, async (err) => {
    if (err) {
      return handleUploadError(err, req, res, () => {});
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const fileUrl = getFileUrl(req.file);

      // Update user's profile image
      const user = await User.findById(req.user.id);
      if (user) {
        // Delete old profile image if exists
        if (user.profileImage) {
          await deleteCloudinaryFile(user.profileImage);
        }
        
        user.profileImage = fileUrl;
        await user.save();
      }

      // Update profile's profile image if exists
      const profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // Delete old profile image if exists
        if (profile.profileImage) {
          await deleteCloudinaryFile(profile.profileImage);
        }
        
        profile.profileImage = fileUrl;
        await profile.save();
      }

      res.json({
        message: 'Profile image uploaded successfully',
        file: {
          url: fileUrl,
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size
        }
      });
    } catch (error) {
      console.error('Upload profile image error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
};

// @desc    Upload cover image
// @route   POST /api/upload/cover-image
// @access  Private
const uploadCoverImageHandler = async (req, res) => {
  uploadCoverImage(req, res, async (err) => {
    if (err) {
      return handleUploadError(err, req, res, () => {});
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const fileUrl = getFileUrl(req.file);

      // Update user's cover image
      const user = await User.findById(req.user.id);
      if (user) {
        // Delete old cover image if exists
        if (user.coverImage) {
          await deleteCloudinaryFile(user.coverImage);
        }
        
        user.coverImage = fileUrl;
        await user.save();
      }

      // Update profile's cover image if exists
      const profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // Delete old cover image if exists
        if (profile.coverImage) {
          await deleteCloudinaryFile(profile.coverImage);
        }
        
        profile.coverImage = fileUrl;
        await profile.save();
      }

      res.json({
        message: 'Cover image uploaded successfully',
        file: {
          url: fileUrl,
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size
        }
      });
    } catch (error) {
      console.error('Upload cover image error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
};

// @desc    Delete image
// @route   DELETE /api/upload/:filename
// @access  Private
const deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;

    // Try to delete from Cloudinary first
    const result = await deleteCloudinaryFile(filename);
    
    if (result) {
      res.json({ message: 'Image deleted successfully' });
    } else {
      // If not in Cloudinary, it might be a local file
      // In production, you might want to delete local files too
      res.json({ message: 'Image deleted successfully' });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get upload statistics
// @route   GET /api/upload/stats
// @access  Private
const getUploadStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const profile = await Profile.findOne({ user: req.user.id });

    const stats = {
      hasProfileImage: !!(user?.profileImage || profile?.profileImage),
      hasCoverImage: !!(user?.coverImage || profile?.coverImage),
      profileImageUrl: user?.profileImage || profile?.profileImage || null,
      coverImageUrl: user?.coverImage || profile?.coverImage || null
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get upload stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  uploadImage,
  uploadImages,
  uploadProfileImageHandler,
  uploadCoverImageHandler,
  deleteImage,
  getUploadStats
}; 