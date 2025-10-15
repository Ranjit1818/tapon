const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  cancelOrder,
  updateOrderStatus,
  addOrderNote,
  processPayment,
  processRefund,
  getOrderStatistics
} = require('../controllers/orderController');

const { protect, authorize, requirePermission } = require('../middleware/auth');

// Validation rules
const orderValidation = [
  body('customerInfo.name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters'),
  body('customerInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('customerInfo.phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.productType')
    .isIn(['nfc_card', 'review_card', 'custom_card', 'bulk_cards', 'premium_card'])
    .withMessage('Invalid product type'),
  body('items.*.quantity')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Quantity must be between 1 and 1000'),
  body('items.*.unitPrice')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  body('shipping.address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('shipping.address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('shipping.address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('shipping.address.zipCode')
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required'),
  body('payment.method')
    .isIn(['stripe', 'paypal', 'bank_transfer', 'crypto', 'apple_pay', 'google_pay'])
    .withMessage('Invalid payment method')
];

const orderUpdateValidation = [
  body('shipping.address.street')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Street address cannot be empty'),
  body('shipping.address.city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City cannot be empty'),
  body('shipping.address.state')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('State cannot be empty'),
  body('shipping.address.zipCode')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('ZIP code cannot be empty')
];

const statusUpdateValidation = [
  body('status')
    .isIn(['pending', 'confirmed', 'processing', 'production', 'shipped', 'delivered', 'cancelled', 'refunded'])
    .withMessage('Invalid order status'),
  body('note')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Note cannot exceed 500 characters')
];

const noteValidation = [
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Note message is required'),
  body('type')
    .optional()
    .isIn(['customer', 'admin', 'system'])
    .withMessage('Invalid note type'),
  body('isInternal')
    .optional()
    .isBoolean()
    .withMessage('isInternal must be a boolean')
];

const orderIdValidation = [
  param('orderId')
    .matches(/^ORD-\d+-[A-Z0-9]+$/)
    .withMessage('Invalid order ID format')
];

// Protected routes - require authentication
router.use(protect);

// Order CRUD
router.route('/')
  .get(getOrders) // Get user's orders (admin can see all)
  .post(orderValidation, createOrder);

router.route('/:orderId')
  .get(orderIdValidation, getOrder)
  .put(orderIdValidation, orderUpdateValidation, updateOrder);

// Order actions
router.patch('/:orderId/cancel', orderIdValidation, cancelOrder);
router.post('/:orderId/notes', orderIdValidation, noteValidation, addOrderNote);

// Payment processing
router.post('/:orderId/payment', orderIdValidation, processPayment);
router.post('/:orderId/refund', orderIdValidation, authorize('admin', 'super_admin'), processRefund);

// Admin only routes
router.patch('/:orderId/status', orderIdValidation, authorize('admin', 'super_admin'), statusUpdateValidation, updateOrderStatus);
router.get('/admin/statistics', authorize('admin', 'super_admin'), getOrderStatistics);
router.get('/admin/all', authorize('admin', 'super_admin'), getOrders);

// Bulk operations (admin only)
router.patch('/admin/bulk-status', authorize('admin', 'super_admin'), body('orderIds').isArray(), body('status').notEmpty(), updateOrderStatus);

module.exports = router; 