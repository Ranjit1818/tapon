const express = require('express');
const router = express.Router();
const { param, query } = require('express-validator');
const {
  recordEvent,
  getUserAnalytics,
  getProfileAnalytics,
  getQRAnalytics,
  getPlatformAnalytics,
  getRealTimeAnalytics,
  exportAnalytics
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

// Public routes
router.post('/event', optionalAuth, recordEvent); // Record analytics event

// Protected routes
router.use(protect);

// User analytics
router.get('/user', requirePermission('analytics'), timeRangeValidation, getUserAnalytics);
router.get('/user/:userId', authorize('admin', 'super_admin'), timeRangeValidation, getUserAnalytics);

// Profile analytics
router.get('/profile/:profileId', timeRangeValidation, getProfileAnalytics);

// QR code analytics
router.get('/qr/:qrId', timeRangeValidation, getQRAnalytics);

// Platform analytics (admin only)
router.get('/platform', authorize('admin', 'super_admin'), timeRangeValidation, eventValidation, getPlatformAnalytics);
router.get('/realtime', authorize('admin', 'super_admin'), getRealTimeAnalytics);

// Export analytics
router.get('/export', requirePermission('analytics'), timeRangeValidation, exportAnalytics);
router.get('/export/:type', authorize('admin', 'super_admin'), timeRangeValidation, exportAnalytics);

module.exports = router; 