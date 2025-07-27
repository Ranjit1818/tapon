const multer = require('multer');
const path = require('path');
const cloudinary = require('../utils/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'taponn',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1000, height: 1000, crop: 'limit' },
      { quality: 'auto' }
    ]
  }
});

// Local storage configuration (fallback)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer instance
const upload = multer({
  storage: process.env.NODE_ENV === 'production' ? cloudinaryStorage : localStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Single file upload
const uploadSingle = upload.single('image');

// Multiple files upload
const uploadMultiple = upload.array('images', 5); // Max 5 files

// Profile image upload with specific settings
const uploadProfileImage = multer({
  storage: process.env.NODE_ENV === 'production' ? new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'taponn/profiles',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto' }
      ]
    }
  }) : localStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit for profile images
  }
}).single('profileImage');

// Cover image upload with specific settings
const uploadCoverImage = multer({
  storage: process.env.NODE_ENV === 'production' ? new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'taponn/covers',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [
        { width: 1200, height: 400, crop: 'fill' },
        { quality: 'auto' }
      ]
    }
  }) : localStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024 // 3MB limit for cover images
  }
}).single('coverImage');

// Error handling middleware
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum is 5 files.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected file field.' });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ message: error.message });
  }
  
  next(error);
};

// Helper function to delete file from Cloudinary
const deleteCloudinaryFile = async (publicId) => {
  try {
    if (publicId && publicId.includes('cloudinary')) {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    }
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
  }
};

// Helper function to get file URL
const getFileUrl = (file) => {
  if (process.env.NODE_ENV === 'production') {
    return file.path; // Cloudinary returns the URL in path
  } else {
    return `/uploads/${file.filename}`; // Local file path
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadProfileImage,
  uploadCoverImage,
  handleUploadError,
  deleteCloudinaryFile,
  getFileUrl
}; 