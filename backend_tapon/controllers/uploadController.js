const ErrorResponse = require('../utils/errorResponse');
const cloudinary = require('../utils/cloudinary');
const { Readable } = require('stream');

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
};

// @desc    Upload profile image
// @route   POST /api/upload/profile-image
// @access  Private
const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    // Check file type
    if (!req.file.mimetype.startsWith('image/')) {
      return next(new ErrorResponse('Please upload an image file', 400));
    }

    // Check file size (5MB limit)
    if (req.file.size > 5 * 1024 * 1024) {
      return next(new ErrorResponse('File size too large. Maximum size is 5MB', 400));
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'taponn/profile-images',
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto:good' }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload cover image
// @route   POST /api/upload/cover-image
// @access  Private
const uploadCoverImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    // Check file type
    if (!req.file.mimetype.startsWith('image/')) {
      return next(new ErrorResponse('Please upload an image file', 400));
    }

    // Check file size (10MB limit for cover images)
    if (req.file.size > 10 * 1024 * 1024) {
      return next(new ErrorResponse('File size too large. Maximum size is 10MB', 400));
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'taponn/cover-images',
      transformation: [
        { width: 1200, height: 400, crop: 'fill' },
        { quality: 'auto:good' }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload QR logo
// @route   POST /api/upload/qr-logo
// @access  Private
const uploadQRLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    // Check file type
    if (!req.file.mimetype.startsWith('image/')) {
      return next(new ErrorResponse('Please upload an image file', 400));
    }

    // Check file size (2MB limit for QR logos)
    if (req.file.size > 2 * 1024 * 1024) {
      return next(new ErrorResponse('File size too large. Maximum size is 2MB', 400));
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'taponn/qr-logos',
      transformation: [
        { width: 200, height: 200, crop: 'fill' },
        { quality: 'auto:good' }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload general image
// @route   POST /api/upload/image
// @access  Private
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    // Check file type
    if (!req.file.mimetype.startsWith('image/')) {
      return next(new ErrorResponse('Please upload an image file', 400));
    }

    // Check file size (5MB limit)
    if (req.file.size > 5 * 1024 * 1024) {
      return next(new ErrorResponse('File size too large. Maximum size is 5MB', 400));
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'taponn/general',
      transformation: [
        { quality: 'auto:good' }
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload document
// @route   POST /api/upload/document
// @access  Private
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload a file', 400));
    }

    // Check file type (allow common document formats)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return next(new ErrorResponse('Please upload a valid document file (PDF, DOC, DOCX, TXT)', 400));
    }

    // Check file size (10MB limit for documents)
    if (req.file.size > 10 * 1024 * 1024) {
      return next(new ErrorResponse('File size too large. Maximum size is 10MB', 400));
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'taponn/documents',
      resource_type: 'raw'
    });

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete uploaded file
// @route   DELETE /api/upload/:publicId
// @access  Private
const deleteFile = async (req, res, next) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return next(new ErrorResponse('Public ID is required', 400));
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      return next(new ErrorResponse('Failed to delete file', 500));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get upload statistics
// @route   GET /api/upload/stats
// @access  Private
const getUploadStats = async (req, res, next) => {
  try {
    // Get Cloudinary usage statistics
    const result = await cloudinary.api.usage();

    res.status(200).json({
      success: true,
      data: {
        plan: result.plan,
        objects: result.objects,
        bandwidth: result.bandwidth,
        storage: result.storage,
        requests: result.requests,
        resources: result.resources,
        derived_resources: result.derived_resources
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk upload images
// @route   POST /api/upload/bulk-images
// @access  Private
const bulkUploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(new ErrorResponse('Please upload at least one file', 400));
    }

    // Check if too many files
    if (req.files.length > 10) {
      return next(new ErrorResponse('Maximum 10 files allowed per upload', 400));
    }

    const uploadPromises = req.files.map(async (file) => {
      // Check file type
      if (!file.mimetype.startsWith('image/')) {
        throw new Error(`File ${file.originalname} is not an image`);
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`File ${file.originalname} is too large (max 5MB)`);
      }

      // Upload to Cloudinary
      const result = await uploadToCloudinary(file.buffer, {
        folder: 'taponn/bulk-uploads',
        transformation: [
          { quality: 'auto:good' }
        ]
      });

      return {
        originalName: file.originalname,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format
      };
    });

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadProfileImage,
  uploadCoverImage,
  uploadQRLogo,
  uploadImage,
  uploadDocument,
  deleteFile,
  getUploadStats,
  bulkUploadImages
};







