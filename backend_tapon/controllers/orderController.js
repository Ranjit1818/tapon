const Order = require('../models/Order');
const User = require('../models/User');
const Analytics = require('../models/Analytics');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all orders for a user
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const filter = { user: req.user.id };
    
    // Add status filter
    if (req.query.status) {
      filter.status = req.query.status;
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns order
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this order`, 401));
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    // Add user to body
    req.body.user = req.user.id;

    // Calculate total amount
    const totalAmount = req.body.items.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);

    // Add total amount to order
    req.body.totalAmount = totalAmount;

    // Generate order number
    req.body.orderNumber = `TAP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = await Order.create(req.body);

    // Record analytics event
    await Analytics.recordEvent({
      user: req.user.id,
      event: {
        type: 'order_created',
        category: 'commerce',
        action: 'create'
      },
      metadata: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        itemCount: order.items.length
      }
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns order
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this order`, 401));
    }

    // Only allow updates if order is not shipped
    if (order.status === 'shipped' || order.status === 'delivered') {
      return next(new ErrorResponse('Cannot update shipped or delivered orders', 400));
    }

    order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns order
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to cancel this order`, 401));
    }

    // Check if order can be cancelled
    if (order.status === 'shipped' || order.status === 'delivered') {
      return next(new ErrorResponse('Cannot cancel shipped or delivered orders', 400));
    }

    if (order.status === 'cancelled') {
      return next(new ErrorResponse('Order is already cancelled', 400));
    }

    order.status = 'cancelled';
    order.cancelledAt = Date.now();
    order.cancellationReason = req.body.reason || 'Cancelled by user';

    await order.save();

    // Record analytics event
    await Analytics.recordEvent({
      user: req.user.id,
      event: {
        type: 'order_cancelled',
        category: 'commerce',
        action: 'cancel'
      },
      metadata: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        reason: order.cancellationReason
      }
    });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin only)
const updateOrderStatus = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
    }

    // Only admins can update order status
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update order status`, 401));
    }

    const oldStatus = order.status;
    order.status = req.body.status;
    
    if (req.body.note) {
      order.notes = order.notes || [];
      order.notes.push({
        message: req.body.note,
        addedBy: req.user.id,
        addedAt: Date.now()
      });
    }

    await order.save();

    // Record analytics event
    await Analytics.recordEvent({
      user: req.user.id,
      event: {
        type: 'order_status_updated',
        category: 'commerce',
        action: 'update_status'
      },
      metadata: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        oldStatus,
        newStatus: order.status
      }
    });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add order note
// @route   POST /api/orders/:id/notes
// @access  Private
const addOrderNote = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to add notes to this order`, 401));
    }

    order.notes = order.notes || [];
    order.notes.push({
      message: req.body.message,
      addedBy: req.user.id,
      addedAt: Date.now()
    });

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process payment
// @route   POST /api/orders/:id/payment
// @access  Private
const processPayment = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns order
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to process payment for this order`, 401));
    }

    // Check if payment is already processed
    if (order.paymentStatus === 'paid') {
      return next(new ErrorResponse('Payment already processed', 400));
    }

    // Here you would integrate with your payment processor (Stripe, PayPal, etc.)
    // For now, we'll simulate a successful payment
    order.paymentStatus = 'paid';
    order.paidAt = Date.now();
    order.paymentMethod = req.body.paymentMethod;
    order.paymentTransactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    await order.save();

    // Record analytics event
    await Analytics.recordEvent({
      user: req.user.id,
      event: {
        type: 'payment_processed',
        category: 'commerce',
        action: 'process'
      },
      metadata: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        amount: order.totalAmount,
        paymentMethod: order.paymentMethod
      }
    });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process refund
// @route   POST /api/orders/:id/refund
// @access  Private (Admin only)
const processRefund = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
    }

    // Only admins can process refunds
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to process refunds`, 401));
    }

    // Check if order is eligible for refund
    if (order.paymentStatus !== 'paid') {
      return next(new ErrorResponse('Order payment not processed', 400));
    }

    if (order.status === 'refunded') {
      return next(new ErrorResponse('Order already refunded', 400));
    }

    order.status = 'refunded';
    order.paymentStatus = 'refunded';
    order.refundedAt = Date.now();
    order.refundReason = req.body.reason || 'Refund processed by admin';
    order.refundAmount = req.body.amount || order.totalAmount;

    await order.save();

    // Record analytics event
    await Analytics.recordEvent({
      user: req.user.id,
      event: {
        type: 'refund_processed',
        category: 'commerce',
        action: 'process'
      },
      metadata: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        refundAmount: order.refundAmount,
        reason: order.refundReason
      }
    });

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats/overview
// @access  Private
const getOrderStatistics = async (req, res, next) => {
  try {
    const userId = req.user.role === 'admin' ? {} : { user: req.user.id };

    // Get total orders
    const totalOrders = await Order.countDocuments(userId);
    
    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      { $match: userId },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get total revenue
    const totalRevenue = await Order.aggregate([
      { $match: { ...userId, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Get recent orders
    const recentOrders = await Order.find(userId)
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber status totalAmount createdAt');

    // Get monthly revenue (last 6 months)
    const monthlyRevenue = await Order.aggregate([
      { $match: { ...userId, paymentStatus: 'paid' } },
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

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        ordersByStatus,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentOrders,
        monthlyRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};

