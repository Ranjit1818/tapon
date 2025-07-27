const express = require('express');
const { body } = require('express-validator');
const { protect, admin } = require('../middlewares/auth');
const {
  createProfile,
  getPublicProfile,
  getMyProfile,
  updateProfile,
  deleteProfile,
  regenerateQRCode,
  getAllProfiles
} = require('../controllers/profileController');

const router = express.Router();

// Validation middleware
const createProfileValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username must be 3-30 characters and contain only letters, numbers, underscores, and hyphens'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please enter a valid website URL')
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('phone')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Please enter a valid website URL')
];

// Routes
router.post('/', protect, createProfileValidation, createProfile);
router.get('/me', protect, getMyProfile);
router.put('/:id', protect, updateProfileValidation, updateProfile);
router.delete('/:id', protect, deleteProfile);
router.post('/:id/regenerate-qr', protect, regenerateQRCode);

// Public route (no auth required)
router.get('/:username', getPublicProfile);

// Admin routes
router.get('/', protect, admin, getAllProfiles);

module.exports = router; 