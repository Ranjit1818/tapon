const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const {
  getDashboardStats,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getAllProfiles,
  getAllQRCodes,
  getAllOrders,
  getSystemLogs,
  backupDatabase,
  getSystemHealth
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');

// All admin routes require admin authentication
router.use(protect);
router.use(authorize('admin', 'super_admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Profile management
router.get('/profiles', getAllProfiles);

// QR code management
router.get('/qr-codes', getAllQRCodes);

// Order management
router.get('/orders', getAllOrders);

// System management (super admin only)
router.get('/logs', authorize('super_admin'), getSystemLogs);
router.post('/backup', authorize('super_admin'), backupDatabase);
router.get('/health', getSystemHealth);

module.exports = router; 