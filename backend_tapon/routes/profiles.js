const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const {
  getProfiles,
  getProfile,
  getProfileByUsername,
  createProfile,
  updateProfile,
  deleteProfile,
  updateSocialLinks,
  updateCustomLinks,
  updateDesign,
  updateSettings,
  toggleProfileStatus,
  generateProfileQR
} = require('../controllers/profileController');

const { protect, authorize, requirePermission, optionalAuth } = require('../middleware/auth');

// Validation rules
const profileValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, hyphens, and underscores'),
  body('displayName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Display name cannot exceed 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('jobTitle')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Job title cannot exceed 100 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL')
];

const socialLinksValidation = [
  body('linkedin')
    .optional()
    .matches(/^https?:\/\/(www\.)?linkedin\.com\/.*/)
    .withMessage('LinkedIn URL must be a valid LinkedIn profile URL'),
  body('twitter')
    .optional()
    .isURL()
    .withMessage('Twitter URL must be valid'),
  body('instagram')
    .optional()
    .isURL()
    .withMessage('Instagram URL must be valid'),
  body('facebook')
    .optional()
    .isURL()
    .withMessage('Facebook URL must be valid'),
  body('github')
    .optional()
    .isURL()
    .withMessage('GitHub URL must be valid'),
  body('youtube')
    .optional()
    .isURL()
    .withMessage('YouTube URL must be valid'),
  body('whatsapp')
    .optional()
    .isMobilePhone()
    .withMessage('WhatsApp must be a valid phone number'),
  body('telegram')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Telegram username is required')
];

const customLinksValidation = [
  body('customLinks')
    .optional()
    .isArray()
    .withMessage('Custom links must be an array'),
  body('customLinks.*.title')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Link title must be between 1 and 50 characters'),
  body('customLinks.*.url')
    .isURL()
    .withMessage('Link URL must be valid'),
  body('customLinks.*.order')
    .optional()
    .isNumeric()
    .withMessage('Link order must be a number')
];

const designValidation = [
  body('theme')
    .optional()
    .isIn(['default', 'minimal', 'professional', 'creative', 'dark'])
    .withMessage('Invalid theme selection'),
  body('primaryColor')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Primary color must be a valid hex color'),
  body('backgroundColor')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Background color must be a valid hex color'),
  body('fontFamily')
    .optional()
    .isIn(['Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins'])
    .withMessage('Invalid font family selection'),
  body('layout')
    .optional()
    .isIn(['centered', 'left-aligned', 'grid'])
    .withMessage('Invalid layout selection')
];

const usernameValidation = [
  param('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, hyphens, and underscores')
];

// Public routes
router.get('/public', getProfiles); // Get all public profiles
router.get('/username/:username', usernameValidation, getProfileByUsername); // Get profile by username (public view)

// Protected routes - require authentication
router.use(protect);

// Profile CRUD
router.route('/')
  .get(getProfiles) // Get user's profiles (admin can see all)
  .post(requirePermission('profile_edit'), profileValidation, createProfile);

router.route('/:id')
  .get(getProfile)
  .put(requirePermission('profile_edit'), profileValidation, updateProfile)
  .delete(requirePermission('profile_edit'), deleteProfile);

// Profile components update
router.put('/:id/social-links', requirePermission('profile_edit'), socialLinksValidation, updateSocialLinks);
router.put('/:id/custom-links', requirePermission('profile_edit'), customLinksValidation, updateCustomLinks);
router.put('/:id/design', requirePermission('profile_edit'), designValidation, updateDesign);
router.put('/:id/settings', requirePermission('profile_edit'), updateSettings);

// Profile status management
router.patch('/:id/toggle-status', requirePermission('profile_edit'), toggleProfileStatus);

// QR code generation for profile
router.get('/:id/qr', requirePermission('qr_generate'), generateProfileQR);

// Admin only routes
router.get('/admin/all', authorize('admin', 'super_admin'), getProfiles);
router.patch('/:id/admin/toggle', authorize('admin', 'super_admin'), toggleProfileStatus);

module.exports = router; 