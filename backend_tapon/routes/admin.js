const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
  getDashboardStats,
  getAllUsers,
  getAllProfiles,
  getAllOrders,
  updateUserRole,
  toggleUserLock,
  deleteUser,
  getSystemAnalytics,
  getAllQRCodes,
  getQRCodeById,
  updateQRCode,
  deleteQRCode,
  getDatabaseTables,
  getTableData,
  generateMissingQRCodes,
  updateOrderStatusAdmin
} = require('../controllers/adminController');

// All admin routes require admin authentication
router.use(protect);
router.use(authorize('admin', 'super_admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.patch('/users/:id/lock', toggleUserLock);
router.delete('/users/:id', deleteUser);

// Profile management
router.get('/profiles', getAllProfiles);

// Order management
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatusAdmin);

// Analytics
router.get('/analytics', getSystemAnalytics);

// QR Code management
router.get('/qr-codes', getAllQRCodes);
router.get('/qr-codes/:id', getQRCodeById);
router.put('/qr-codes/:id', updateQRCode);
router.delete('/qr-codes/:id', deleteQRCode);
router.post('/qr-codes/generate-missing', generateMissingQRCodes);

// Database operations
router.get('/database/tables', getDatabaseTables);
router.get('/database/:tableName', getTableData);

module.exports = router;
