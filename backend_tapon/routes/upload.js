const express = require('express');
const router = express.Router();
const {
  uploadProfileImage,
  uploadQRLogo,
  uploadCustomFile,
  deleteImage
} = require('../controllers/uploadController');

const { protect, requirePermission } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All upload routes require authentication
router.use(protect);

// Profile image upload
router.post('/profile-image', requirePermission('profile_edit'), upload.single('image'), uploadProfileImage);

// QR code logo upload
router.post('/qr-logo', requirePermission('qr_generate'), upload.single('logo'), uploadQRLogo);

// Custom file upload
router.post('/custom', upload.single('file'), uploadCustomFile);

// Delete uploaded image
router.delete('/:publicId', deleteImage);

module.exports = router; 