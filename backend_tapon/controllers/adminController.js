const User = require('../models/User');
const Profile = require('../models/Profile');
const QRCode = require('../models/QRCode');
const Order = require('../models/Order');
const Analytics = require('../models/Analytics');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getDashboardStats = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse('Access denied. Admin role required.', 403));
    }

    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalProfiles = await Profile.countDocuments();
    const totalQRCodes = await QRCode.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Get revenue stats
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const monthlyRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);

    // Get user growth
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);

    // Get recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber status totalAmount createdAt');

    // Get top performing profiles
    const topProfiles = await Analytics.aggregate([
      { $match: { 'event.type': 'profile_view' } },
      { $group: { _id: '$profile', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'profiles',
          localField: '_id',
          foreignField: '_id',
          as: 'profile'
        }
      },
      { $unwind: '$profile' }
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalProfiles,
          totalQRCodes,
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0
        },
        monthlyRevenue,
        userGrowth,
        recentUsers,
        recentOrders,
        topProfiles
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse('Access denied. Admin role required.', 403));
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const filter = {};
    
    // Add search filter
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Add role filter
    if (req.query.role) {
      filter.role = req.query.role;
    }

    // Add status filter
    if (req.query.status) {
      filter.isLocked = req.query.status === 'locked';
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    // Pagination result
    const pagination = {};
    const endIndex = startIndex + limit;

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: users.length,
      pagination,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all profiles (admin)
// @route   GET /api/admin/profiles
// @access  Private (Admin only)
const getAllProfiles = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse('Access denied. Admin role required.', 403));
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const filter = {};
    
    // Add search filter
    if (req.query.search) {
      filter.$or = [
        { displayName: { $regex: req.query.search, $options: 'i' } },
        { username: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Add status filter
    if (req.query.status) {
      filter.isPublic = req.query.status === 'public';
    }

    const total = await Profile.countDocuments(filter);
    const profiles = await Profile.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    // Pagination result
    const pagination = {};
    const endIndex = startIndex + limit;

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: profiles.length,
      pagination,
      data: profiles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private (Admin only)
const getAllOrders = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse('Access denied. Admin role required.', 403));
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const filter = {};
    
    // Add status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Add payment status filter
    if (req.query.paymentStatus) {
      filter.paymentStatus = req.query.paymentStatus;
    }

    // Add date filter
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    // Pagination result
    const pagination = {};
    const endIndex = startIndex + limit;

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      pagination,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
const updateUserRole = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse('Access denied. Admin role required.', 403));
    }

    const { role } = req.body;

    if (!['user', 'admin', 'super_admin'].includes(role)) {
      return next(new ErrorResponse('Invalid role. Must be user, admin, or super_admin.', 400));
    }

    // Prevent admin from changing their own role
    if (req.params.id === req.user.id) {
      return next(new ErrorResponse('Cannot change your own role.', 400));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lock/Unlock user (admin)
// @route   PATCH /api/admin/users/:id/lock
// @access  Private (Admin only)
const toggleUserLock = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse('Access denied. Admin role required.', 403));
    }

    // Prevent admin from locking themselves
    if (req.params.id === req.user.id) {
      return next(new ErrorResponse('Cannot lock your own account.', 400));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    user.isLocked = !user.isLocked;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        isLocked: user.isLocked,
        message: `User ${user.isLocked ? 'locked' : 'unlocked'} successfully.`
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse('Access denied. Admin role required.', 403));
    }

    // Prevent admin from deleting themselves
    if (req.params.id === req.user.id) {
      return next(new ErrorResponse('Cannot delete your own account.', 400));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    // Check if user is super admin
    if (user.role === 'super_admin') {
      return next(new ErrorResponse('Cannot delete super admin accounts.', 400));
    }

    await user.remove();

    res.status(200).json({
      success: true,
      data: {},
      message: 'User deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system analytics (admin)
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
const getSystemAnalytics = async (req, res, next) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse('Access denied. Admin role required.', 403));
    }

    // Get date range from query params
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    // Get user registration trends
    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Get profile view trends
    const profileViews = await Analytics.aggregate([
      {
        $match: {
          'event.type': 'profile_view',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          views: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Get QR scan trends
    const qrScans = await Analytics.aggregate([
      {
        $match: {
          'event.type': 'qr_scan',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          scans: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Get top performing content
    const topProfiles = await Analytics.aggregate([
      {
        $match: {
          'event.type': 'profile_view',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      { $group: { _id: '$profile', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'profiles',
          localField: '_id',
          foreignField: '_id',
          as: 'profile'
        }
      },
      { $unwind: '$profile' }
    ]);

    const topQRCodes = await Analytics.aggregate([
      {
        $match: {
          'event.type': 'qr_scan',
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      { $group: { _id: '$qrCode', scans: { $sum: 1 } } },
      { $sort: { scans: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'qrcodes',
          localField: '_id',
          foreignField: '_id',
          as: 'qrCode'
        }
      },
      { $unwind: '$qrCode' }
    ]);

    res.status(200).json({
      success: true,
      data: {
        dateRange: { startDate, endDate },
        userRegistrations,
        profileViews,
        qrScans,
        topProfiles,
        topQRCodes
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all QR codes (admin only)
// @route   GET /api/admin/qr-codes
// @access  Private (Admin only)
const getAllQRCodes = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, type, status } = req.query;
    const skip = (page - 1) * limit;

    const matchQuery = {};
    if (search) {
      matchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'user.name': { $regex: search, $options: 'i' } }
      ];
    }
    if (type) matchQuery.type = type;
    if (status) matchQuery.isActive = status === 'active';

    const qrCodes = await QRCode.find(matchQuery)
      .populate('user', 'name email')
      .populate('profile', 'displayName username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await QRCode.countDocuments(matchQuery);

    res.status(200).json({
      success: true,
      data: qrCodes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get QR code by ID (admin only)
// @route   GET /api/admin/qr-codes/:id
// @access  Private (Admin only)
const getQRCodeById = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.id)
      .populate('user', 'name email')
      .populate('profile', 'displayName username');

    if (!qrCode) {
      return next(new ErrorResponse('QR Code not found', 404));
    }

    res.status(200).json({
      success: true,
      data: qrCode
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update QR code (admin only)
// @route   PUT /api/admin/qr-codes/:id
// @access  Private (Admin only)
const updateQRCode = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!qrCode) {
      return next(new ErrorResponse('QR Code not found', 404));
    }

    res.status(200).json({
      success: true,
      data: qrCode
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete QR code (admin only)
// @route   DELETE /api/admin/qr-codes/:id
// @access  Private (Admin only)
const deleteQRCode = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findByIdAndDelete(req.params.id);

    if (!qrCode) {
      return next(new ErrorResponse('QR Code not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'QR Code deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get database tables (admin only)
// @route   GET /api/admin/database/tables
// @access  Private (Admin only)
const getDatabaseTables = async (req, res, next) => {
  try {
    const tables = [
      { name: 'users', displayName: 'Users', count: await User.countDocuments() },
      { name: 'profiles', displayName: 'Profiles', count: await Profile.countDocuments() },
      { name: 'qrcodes', displayName: 'QR Codes', count: await QRCode.countDocuments() },
      { name: 'orders', displayName: 'Orders', count: await Order.countDocuments() },
      { name: 'analytics', displayName: 'Analytics', count: await Analytics.countDocuments() }
    ];

    res.status(200).json({
      success: true,
      data: tables
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get table data (admin only)
// @route   GET /api/admin/database/:tableName
// @access  Private (Admin only)
const getTableData = async (req, res, next) => {
  try {
    const { tableName } = req.params;
    const { page = 1, limit = 50, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const skip = (page - 1) * limit;

    let Model, searchFields;
    switch (tableName) {
      case 'users':
        Model = User;
        searchFields = ['name', 'email'];
        break;
      case 'profiles':
        Model = Profile;
        searchFields = ['displayName', 'username', 'bio'];
        break;
      case 'qrcodes':
        Model = QRCode;
        searchFields = ['name', 'type'];
        break;
      case 'orders':
        Model = Order;
        searchFields = ['orderNumber', 'status'];
        break;
      case 'analytics':
        Model = Analytics;
        searchFields = ['eventType', 'eventAction'];
        break;
      default:
        return next(new ErrorResponse('Invalid table name', 400));
    }

    const matchQuery = {};
    if (search) {
      matchQuery.$or = searchFields.map(field => ({
        [field]: { $regex: search, $options: 'i' }
      }));
    }

    const sortQuery = {};
    sortQuery[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const data = await Model.find(matchQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Model.countDocuments(matchQuery);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
  getTableData
};



