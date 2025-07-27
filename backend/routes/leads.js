const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middlewares/auth');
const {
  captureLead,
  getMyLeads,
  getLead,
  updateLead,
  deleteLead,
  addInteraction,
  getLeadAnalytics
} = require('../controllers/leadController');

const router = express.Router();

// Validation middleware
const captureLeadValidation = [
  body('profileId')
    .isMongoId()
    .withMessage('Invalid profile ID'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
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
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('position')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Position cannot exceed 100 characters'),
  body('source')
    .isIn(['QR Code', 'NFC Tap', 'Direct Link', 'Social Media', 'Email', 'Website', 'Other'])
    .withMessage('Invalid source'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters')
];

const updateLeadValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
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
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('position')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Position cannot exceed 100 characters'),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'converted', 'lost'])
    .withMessage('Invalid status'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
  body('nextFollowUp')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
];

const addInteractionValidation = [
  body('type')
    .isIn(['view', 'click', 'form_submit', 'contact'])
    .withMessage('Invalid interaction type'),
  body('details')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Details cannot exceed 500 characters')
];

// Routes
// Public route (no auth required for lead capture)
router.post('/capture', captureLeadValidation, captureLead);

// Private routes (require authentication)
router.get('/', protect, getMyLeads);
router.get('/analytics', protect, getLeadAnalytics);
router.get('/:id', protect, getLead);
router.put('/:id', protect, updateLeadValidation, updateLead);
router.delete('/:id', protect, deleteLead);
router.post('/:id/interaction', protect, addInteractionValidation, addInteraction);

module.exports = router; 