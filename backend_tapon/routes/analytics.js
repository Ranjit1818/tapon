// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const { query } = require('express-validator');
const {
  recordEvent,
  getProfileAnalytics,
  getQRAnalytics,
  getAllAnalytics
} = require('../controllers/analyticsController');

const { protect, authorize, requirePermission, optionalAuth } = require('../middleware/auth');

// Validation rules
const timeRangeValidation = [
  query('timeRange')
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage('Time range must be between 1 and 365 days')
];

const eventValidation = [
  query('eventType')
    .optional()
    .isIn([
      'profile_view', 'profile_click', 'qr_scan', 'qr_generate',
      'social_link_click', 'contact_click', 'order_placed', 'order_completed',
      'user_registration', 'user_login', 'admin_action', 'email_sent',
      'custom_link_click', 'download_vcard', 'share_profile'
    ])
    .withMessage('Invalid event type')
];

// Public route — Record analytics event
router.post('/event', optionalAuth, recordEvent);

// Protected routes
router.use(protect);

// Profile analytics
router.get('/profile/:profileId', timeRangeValidation, getProfileAnalytics);

// QR code analytics
router.get('/qr/:qrCodeId', timeRangeValidation, getQRAnalytics);

// Get all analytics (admin only)
router.get('/all', authorize('admin', 'super_admin'), timeRangeValidation, eventValidation, getAllAnalytics);

module.exports = router;
