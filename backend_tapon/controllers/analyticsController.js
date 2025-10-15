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

    // Enhanced location detection
    const getLocationFromIP = (ip) => {
      // For local development, return default location
      if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
        return {
          country: 'India',
          region: 'Maharashtra',
          city: 'Mumbai',
          timezone: 'Asia/Kolkata'
        }
      }
      // In production, you would use a service like ipapi.co or similar
      return {
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown',
        timezone: 'UTC'
      }
    }

    const location = getLocationFromIP(req.ip)

    const eventData = {
      user: req.user ? req.user.id : null,
      profile: req.body.profile || req.body.profileId || null,
      qrCode: req.body.qrCodeId || null,
      eventType: req.body.eventType,
      eventCategory: req.body.eventCategory || 'engagement',
      eventAction: req.body.eventAction,
      metadata: {
        ...req.body.metadata,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referrer'),
        timestamp: new Date(),
        location: {
          ...location,
          ...req.body.metadata?.location // Override with frontend data if available
        },
        sessionId: req.body.metadata?.sessionId || 'unknown',
        source: req.body.metadata?.source || 'unknown'
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

// @desc    Record analytics event
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

    const location = (() => {
      const ip = req.ip || '';
      if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
        return { country: 'India', region: 'Maharashtra', city: 'Mumbai', timezone: 'Asia/Kolkata' };
      }
      return { country: 'Unknown', region: 'Unknown', city: 'Unknown', timezone: 'UTC' };
    })();

    const profileId = req.body.profile || req.body.profileId || null;

    const eventData = {
      user: req.user ? req.user.id : null,
      profile: profileId,
      qrCode: req.body.qrCodeId || null,
      eventType: req.body.eventType,
      eventCategory: req.body.eventCategory || 'engagement',
      eventAction: req.body.eventAction,
      metadata: {
        ...req.body.metadata,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referrer'),
        timestamp: new Date(),
        location,
      },
      session: req.body.session || {},
      userJourney: req.body.userJourney || {},
      performance: req.body.performance || {},
      conversion: req.body.conversion || {}
    };

    const analytics = await Analytics.create(eventData);

    // Increment profile counters
    if (profileId) {
      const Profile = require('../models/Profile');
      const inc = {};

      if (req.body.eventType === 'profile_view') inc.profileViews = 1;
      if (req.body.eventType === 'social_link_click') inc.socialClicks = 1;
      if (req.body.eventType === 'contact_click') inc.contactClicks = 1;

      if (Object.keys(inc).length > 0) {
        await Profile.findByIdAndUpdate(profileId, { $inc: inc });
      }
    }

    res.status(201).json({
      success: true,
      data: analytics
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

// @desc    Get user analytics
// @route   GET /api/analytics/user
// @access  Private
exports.getUserAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { period = '30d', include } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let dateFrom;
    
    switch (period) {
      case '7d':
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        dateFrom = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get user's profile ID first
    const Profile = require('../models/Profile');
    const userProfile = await Profile.findOne({ user: userId });
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    // Get analytics for the user's profile
    const match = {
      profile: userProfile._id,
      createdAt: { $gte: dateFrom, $lte: now }
    };

    // Get overview data
    const totalViews = await Analytics.countDocuments({
      ...match,
      eventType: 'profile_view'
    });

    const totalClicks = await Analytics.countDocuments({
      ...match,
      eventType: { $in: ['social_link_click', 'contact_click', 'custom_link_click'] }
    });

    // Engagement metrics instead of leads
    const totalEngagements = await Analytics.countDocuments({
      ...match,
      eventType: { $in: ['social_link_click', 'contact_click', 'custom_link_click'] }
    });

    const uniqueVisitors = await Analytics.distinct('metadata.sessionId', {
      ...match,
      eventType: 'profile_view',
      'metadata.sessionId': { $exists: true, $ne: null }
    });

    const averageSessionDuration = await Analytics.aggregate([
      { 
        $match: { 
          ...match, 
          eventType: 'profile_view',
          'metadata.sessionId': { $exists: true, $ne: null }
        } 
      },
      {
        $group: {
          _id: '$metadata.sessionId',
          firstView: { $min: '$createdAt' },
          lastView: { $max: '$createdAt' },
          viewCount: { $sum: 1 }
        }
      },
      {
        $project: {
          duration: { $subtract: ['$lastView', '$firstView'] },
          viewCount: 1
        }
      },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: '$duration' },
          avgViewsPerSession: { $avg: '$viewCount' }
        }
      }
    ]);

    const engagementRate = totalViews > 0 ? ((totalEngagements / totalViews) * 100).toFixed(1) : 0;
    const avgDuration = averageSessionDuration[0]?.avgDuration || 0;
    const avgViewsPerSession = averageSessionDuration[0]?.avgViewsPerSession || 0;

    // Get visits data (daily) - fixed aggregation
    const visitsData = await Analytics.aggregate([
      { $match: { ...match, eventType: 'profile_view' } },
      {
        $group: {
          _id: { 
            $dateToString: { 
              format: '%Y-%m-%d', 
              date: '$createdAt',
              timezone: 'UTC'
            } 
          },
          views: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);

    console.log('Raw visits data:', JSON.stringify(visitsData, null, 2));

    // Get clicks data by type (all profile elements)
    const clicksData = await Analytics.aggregate([
      { $match: { ...match, eventType: { $in: ['social_link_click', 'contact_click'] } } },
      {
        $group: {
          _id: '$eventAction',
          clicks: { $sum: 1 }
        }
      },
      { $sort: { clicks: -1 } }
    ]);

    // Get profile element rankings (most/least visited)
    const profileElementRankings = await Analytics.aggregate([
      { $match: { ...match, eventType: { $in: ['social_link_click', 'contact_click'] } } },
      {
        $group: {
          _id: {
            elementType: '$eventType',
            elementName: '$eventAction'
          },
          clicks: { $sum: 1 },
          lastClicked: { $max: '$createdAt' }
        }
      },
      { $sort: { clicks: -1 } },
      { $limit: 20 }
    ]);

    // Get device data
    const deviceData = await Analytics.aggregate([
      { $match: { ...match, eventType: 'profile_view' } },
      {
        $group: {
          _id: '$metadata.device',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get profile element performance data
    const elementPerformance = await Analytics.aggregate([
      { 
        $match: { 
          ...match, 
          eventType: { $in: ['social_link_click', 'contact_click'] } 
        } 
      },
      {
        $group: {
          _id: '$eventAction',
          totalClicks: { $sum: 1 },
          uniqueSessions: { $addToSet: '$metadata.sessionId' },
          lastInteraction: { $max: '$createdAt' },
          firstInteraction: { $min: '$createdAt' }
        }
      },
      {
        $project: {
          elementName: '$_id',
          totalClicks: 1,
          uniqueSessions: { $size: '$uniqueSessions' },
          lastInteraction: 1,
          firstInteraction: 1,
          avgClicksPerSession: {
            $cond: [
              { $gt: [{ $size: '$uniqueSessions' }, 0] },
              { $divide: ['$totalClicks', { $size: '$uniqueSessions' }] },
              0
            ]
          }
        }
      },
      { $sort: { totalClicks: -1 } }
    ]);
    

    // Get time-based data (hourly)
    const timeData = await Analytics.aggregate([
      { $match: { ...match, eventType: 'profile_view' } },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          views: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Format the data with proper fallbacks
    const formattedVisits = visitsData.length > 0 ? visitsData.map(item => ({
      date: item._id,
      views: item.views,
      clicks: 0 // You can add clicks data if needed
    })) : [
      { date: new Date().toISOString().split('T')[0], views: 0, clicks: 0 }
    ];

    const formattedClicks = clicksData.length > 0 ? clicksData.map(item => ({
      name: item._id || 'Unknown',
      clicks: item.clicks,
      emoji: getClickEmoji(item._id)
    })) : [
      { name: 'WhatsApp', clicks: 0, emoji: '📱' },
      { name: 'Email', clicks: 0, emoji: '📧' }
    ];

    const formattedDevices = deviceData.length > 0 ? deviceData.map((item, index) => ({
      name: item._id || 'Unknown',
      value: totalViews > 0 ? Math.round((item.count / totalViews) * 100) : 0,
      emoji: getDeviceEmoji(item._id)
    })) : [
      { name: 'Mobile', value: 50, emoji: '📱' },
      { name: 'Desktop', value: 50, emoji: '💻' }
    ];

    // Format profile element rankings
    const formattedElementRankings = profileElementRankings.map((item, index) => ({
      rank: index + 1,
      elementType: item._id.elementType,
      elementName: item._id.elementName,
      clicks: item.clicks,
      lastClicked: item.lastClicked,
      emoji: getClickEmoji(item._id.elementName)
    }));

    // Format element performance data
    const formattedElementPerformance = elementPerformance.map(item => ({
      elementName: item.elementName,
      totalClicks: item.totalClicks,
      uniqueSessions: item.uniqueSessions,
      avgClicksPerSession: Math.round(item.avgClicksPerSession * 100) / 100,
      lastInteraction: item.lastInteraction,
      firstInteraction: item.firstInteraction
    }));

    const formattedTime = timeData.length > 0 ? timeData.map(item => ({
      hour: item._id.toString().padStart(2, '0'),
      views: item.views
    })) : [
      { hour: '00', views: 0 },
      { hour: '12', views: 0 },
      { hour: '18', views: 0 }
    ];

    // Additional business insights
    const topReferrers = await Analytics.aggregate([
      { $match: { ...match, eventType: 'profile_view' } },
      {
        $group: {
          _id: '$metadata.referrer',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const browserStats = await Analytics.aggregate([
      { $match: { ...match, eventType: 'profile_view' } },
      {
        $group: {
          _id: '$metadata.browser',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const languageStats = await Analytics.aggregate([
      { $match: { ...match, eventType: 'profile_view' } },
      {
        $group: {
          _id: '$metadata.language',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Calculate bounce rate (single page visits)
    const bounceRate = uniqueVisitors.length > 0 ? 
      ((uniqueVisitors.length - (avgViewsPerSession > 1 ? uniqueVisitors.length : 0)) / uniqueVisitors.length * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalViews,
          totalClicks,
          totalEngagements,
          uniqueVisitors: uniqueVisitors.length,
          engagementRate: parseFloat(engagementRate),
          averageTime: avgDuration > 0 ? `${Math.round(avgDuration / 1000 / 60)}m ${Math.round((avgDuration / 1000) % 60)}s` : '0m 0s',
          bounceRate: parseFloat(bounceRate),
          avgViewsPerSession: avgViewsPerSession.toFixed(1)
        },
        visits: formattedVisits,
        clicks: formattedClicks,
        devices: formattedDevices,
        time: formattedTime,
        elementRankings: formattedElementRankings,
        elementPerformance: formattedElementPerformance,
        referrers: topReferrers.map(ref => ({
          source: ref._id || 'Direct',
          count: ref.count,
          percentage: ((ref.count / totalViews) * 100).toFixed(1)
        })),
        browsers: browserStats.map(browser => ({
          name: browser._id || 'Unknown',
          count: browser.count,
          percentage: ((browser.count / totalViews) * 100).toFixed(1)
        })),
        languages: languageStats.map(lang => ({
          code: lang._id || 'Unknown',
          count: lang.count,
          percentage: ((lang.count / totalViews) * 100).toFixed(1)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
const getClickEmoji = (action) => {
  const emojiMap = {
    'whatsapp': '📱',
    'linkedin': '💼',
    'email': '📧',
    'phone': '📞',
    'website': '🌐',
    'instagram': '📷',
    'twitter': '🐦',
    'facebook': '👥'
  };
  return emojiMap[action?.toLowerCase()] || '🔗';
};

const getDeviceEmoji = (device) => {
  if (!device) return '❓';
  const deviceLower = device.toLowerCase();
  if (deviceLower.includes('mobile') || deviceLower.includes('phone')) return '📱';
  if (deviceLower.includes('tablet')) return '📱';
  if (deviceLower.includes('desktop') || deviceLower.includes('pc')) return '💻';
  return '🖥️';
};

const getCountryEmoji = (country) => {
  const emojiMap = {
    'India': '🇮🇳',
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Japan': '🇯🇵',
    'China': '🇨🇳',
    'Brazil': '🇧🇷'
  };
  return emojiMap[country] || '🌍';
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
