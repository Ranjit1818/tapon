const express = require('express');
const { protect } = require('../middlewares/auth');
const {
  uploadImage,
  uploadImages,
  uploadProfileImageHandler,
  uploadCoverImageHandler,
  deleteImage,
  getUploadStats
} = require('../controllers/uploadController');

const router = express.Router();

// All upload routes require authentication
router.use(protect);

// Routes
router.post('/image', uploadImage);
router.post('/images', uploadImages);
router.post('/profile-image', uploadProfileImageHandler);
router.post('/cover-image', uploadCoverImageHandler);
router.delete('/:filename', deleteImage);
router.get('/stats', getUploadStats);

module.exports = router; 