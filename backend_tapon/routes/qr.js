const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const {
  getQRCodes,
  getQRCode,
  createQRCode,
  updateQRCode,
  deleteQRCode,
  downloadQRCode,
  scanQRCode,
  getQRAnalytics,
  toggleQRStatus,
  regenerateQRCode
} = require('../controllers/qrController');

const { protect, authorize, requirePermission, optionalAuth } = require('../middleware/auth');

// Validation rules
const qrCodeValidation = [
  body('type')
    .isIn([
      'profile', 'contact', 'whatsapp', 'email', 'phone', 'linkedin',
      'instagram', 'facebook', 'twitter', 'website', 'vcard', 'wifi',
      'text', 'url', 'custom'
    ])
    .withMessage('Invalid QR code type'),
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('data.content')
    .notEmpty()
    .withMessage('QR code content is required')
];

const qrDesignValidation = [
  body('design.foregroundColor')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Foreground color must be a valid hex color'),
  body('design.backgroundColor')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Background color must be a valid hex color'),
  body('design.errorCorrectionLevel')
    .optional()
    .isIn(['L', 'M', 'Q', 'H'])
    .withMessage('Invalid error correction level'),
  body('design.margin')
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage('Margin must be between 0 and 10')
];

const qrSettingsValidation = [
  body('settings.expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Expiry date must be a valid date'),
  body('settings.maxScans')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max scans must be a positive integer'),
  body('settings.password')
    .optional()
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters')
];

const qrIdValidation = [
  param('qrId')
    .isUUID()
    .withMessage('Invalid QR code ID format')
];

// Public routes
router.get('/scan/:qrId', scanQRCode); // Public QR code scanning endpoint
router.get('/redirect/:qrId', scanQRCode); // Alternative scanning endpoint

// Protected routes - require authentication
router.use(protect);

// QR Code CRUD
router.route('/')
  .get(getQRCodes) // Get user's QR codes
  .post(requirePermission('qr_generate'), [...qrCodeValidation, ...qrDesignValidation, ...qrSettingsValidation], createQRCode);

router.route('/:id')
  .get(getQRCode)
  .put(requirePermission('qr_generate'), [...qrCodeValidation, ...qrDesignValidation, ...qrSettingsValidation], updateQRCode)
  .delete(requirePermission('qr_manage'), deleteQRCode);

// QR Code actions
router.get('/:id/download', downloadQRCode);
router.post('/:id/regenerate', requirePermission('qr_generate'), regenerateQRCode);
router.patch('/:id/toggle-status', requirePermission('qr_manage'), toggleQRStatus);

// QR Code analytics
router.get('/:id/analytics', requirePermission('analytics'), getQRAnalytics);

// Bulk operations (admin only)
router.get('/admin/all', authorize('admin', 'super_admin'), getQRCodes);
router.delete('/admin/bulk-delete', authorize('admin', 'super_admin'), deleteQRCode);
router.patch('/admin/:id/toggle', authorize('admin', 'super_admin'), toggleQRStatus);

// QR Code by QR ID (for external access)
router.get('/code/:qrId', qrIdValidation, getQRCode);

module.exports = router; 