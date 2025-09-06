const Analytics = require('../models/Analytics');
const ErrorResponse = require('../utils/errorResponse');

const getPagination = (req) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

// @desc    Record an analytics event
// @route   POST /api/analytics/record
// @access  Public
exports.recordEvent = async (req, res, next) => {
  try {
    console.log("📊 Incoming Analytics Data:", req.body);

    if (!req.body.eventType) {
      return next(new ErrorResponse("Event type is required", 400));
    }
    if (!req.body.eventAction) {
      return next(new ErrorResponse("Event action is required", 400));
    }

    const eventData = {
      user: req.user ? req.user.id : null,
      profile: req.body.profileId || null,
      qrCode: req.body.qrCodeId || null,
      eventType: req.body.eventType,
      eventCategory: req.body.eventCategory || 'engagement',
      eventAction: req.body.eventAction,
      metadata: {
        ...req.body.metadata,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referrer'),
        timestamp: new Date()
      },
      session: req.body.session || {},
      userJourney: req.body.userJourney || {},
      performance: req.body.performance || {},
      conversion: req.body.conversion || {}
    };

    const analytics = await Analytics.recordEvent(eventData);

    res.status(201).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get profile analytics
// @route   GET /api/analytics/profile/:profileId
// @access  Private
exports.getProfileAnalytics = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const { page, limit, skip } = getPagination(req);

    const totalViews = await Analytics.countDocuments({
      profile: profileId,
      eventType: 'profile_view'
    });

    const uniqueVisitors = await Analytics.distinct('metadata.ipAddress', {
      profile: profileId,
      eventType: 'profile_view'
    });

    const recentActivity = await Analytics.find({ profile: profileId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        totalViews,
        uniqueVisitors: uniqueVisitors.length,
        recentActivity
      },
      pagination: { page, limit }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get QR code analytics
// @route   GET /api/analytics/qr/:qrCodeId
// @access  Private
exports.getQRAnalytics = async (req, res, next) => {
  try {
    const { qrCodeId } = req.params;
    const { page, limit, skip } = getPagination(req);

    const totalScans = await Analytics.countDocuments({
      qrCode: qrCodeId,
      eventType: 'qr_scan'
    });

    const uniqueScanners = await Analytics.distinct('metadata.ipAddress', {
      qrCode: qrCodeId,
      eventType: 'qr_scan'
    });

    const recentActivity = await Analytics.find({ qrCode: qrCodeId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        totalScans,
        uniqueScanners: uniqueScanners.length,
        recentActivity
      },
      pagination: { page, limit }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all analytics (admin)
// @route   GET /api/analytics
// @access  Private/Admin
exports.getAllAnalytics = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);

    const analytics = await Analytics.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('profile', 'displayName username')
      .populate('qrCode', 'name');

    const total = await Analytics.countDocuments();

    res.status(200).json({
      success: true,
      count: analytics.length,
      total,
      data: analytics,
      pagination: { page, limit }
    });
  } catch (error) {
    next(error);
  }
};
