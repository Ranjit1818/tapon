const express = require('express');
const router = express.Router();
const {
  uploadProfileImage,
  uploadQRLogo,
  uploadImage,       // renamed from uploadCustomFile to match controller
  deleteFile         // renamed from deleteImage to match controller
} = require('../controllers/uploadController');

const { protect, requirePermission } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All upload routes require authentication
router.use(protect);

// Profile image upload
router.post(
  '/profile-image',
  requirePermission('profile_edit'),
  upload.single('image'),
  uploadProfileImage
);

// QR code logo upload
router.post(
  '/qr-logo',
  requirePermission('qr_generate'),
  upload.single('logo'),
  uploadQRLogo
);

// General image upload (custom file)
router.post('/custom', upload.single('file'), uploadImage);

// Delete uploaded file
router.delete('/:publicId', deleteFile);

module.exports = router;
