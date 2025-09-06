const QRCode = require('../models/QRCode');
const Profile = require('../models/Profile');
const Analytics = require('../models/Analytics');
const ErrorResponse = require('../utils/errorResponse');
const QR = require('qrcode');

// @desc    Get all QR codes for a user
// @route   GET /api/qr
// @access  Private
const getQRCodes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const filter = { user: req.user.id };
    
    // Add search filter
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Add type filter
    if (req.query.type) {
      filter.type = req.query.type;
    }

    const total = await QRCode.countDocuments(filter);
    const qrCodes = await QRCode.find(filter)
      .populate('profile', 'displayName username')
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
      count: qrCodes.length,
      pagination,
      data: qrCodes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single QR code
// @route   GET /api/qr/:id
// @access  Private
const getQRCode = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.id)
      .populate('profile', 'displayName username')
      .populate('user', 'name email');

    if (!qrCode) {
      return next(new ErrorResponse(`QR code not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns QR code
    if (qrCode.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this QR code`, 401));
    }

    res.status(200).json({
      success: true,
      data: qrCode
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new QR code
// @route   POST /api/qr
// @access  Private
const createQRCode = async (req, res, next) => {
  try {
    // Add user to body
    req.body.user = req.user.id;

    // Generate QR code data based on type
    const qrData = await generateQRData(req.body);

    // Create QR code
    const qrCode = await QRCode.create({
      ...req.body,
      qrData,
      scanCount: 0
    });

    res.status(201).json({
      success: true,
      data: qrCode
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update QR code
// @route   PUT /api/qr/:id
// @access  Private
const updateQRCode = async (req, res, next) => {
  try {
    let qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return next(new ErrorResponse(`QR code not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns QR code
    if (qrCode.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this QR code`, 401));
    }

    // Regenerate QR data if content changed
    if (req.body.data && req.body.data.content !== qrCode.data.content) {
      req.body.qrData = await generateQRData(req.body);
    }

    qrCode = await QRCode.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: qrCode
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete QR code
// @route   DELETE /api/qr/:id
// @access  Private
const deleteQRCode = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return next(new ErrorResponse(`QR code not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns QR code
    if (qrCode.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this QR code`, 401));
    }

    await qrCode.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download QR code
// @route   GET /api/qr/:id/download
// @access  Private
const downloadQRCode = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return next(new ErrorResponse(`QR code not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns QR code
    if (qrCode.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to download this QR code`, 401));
    }

    // Generate QR code image
    const qrImage = await QR.toDataURL(qrCode.qrData, {
      errorCorrectionLevel: qrCode.design?.errorCorrectionLevel || 'M',
      margin: qrCode.design?.margin || 4,
      color: {
        dark: qrCode.design?.foregroundColor || '#000000',
        light: qrCode.design?.backgroundColor || '#FFFFFF'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        qrImage,
        qrCode
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Scan QR code (public endpoint)
// @route   GET /api/qr/scan/:qrId
// @access  Public
const scanQRCode = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.qrId)
      .populate('profile', 'displayName username')
      .populate('user', 'name email');

    if (!qrCode) {
      return next(new ErrorResponse(`QR code not found`, 404));
    }

    if (!qrCode.isActive) {
      return next(new ErrorResponse(`QR code is inactive`, 400));
    }

    // Check if QR code has expired
    if (qrCode.settings?.expiresAt && new Date() > qrCode.settings.expiresAt) {
      return next(new ErrorResponse(`QR code has expired`, 400));
    }

    // Check if max scans reached
    if (qrCode.settings?.maxScans && qrCode.scanCount >= qrCode.settings.maxScans) {
      return next(new ErrorResponse(`QR code scan limit reached`, 400));
    }

    // Increment scan count
    qrCode.scanCount += 1;
    await qrCode.save();

    // Record analytics event
    await Analytics.recordEvent({
      qrCode: qrCode._id,
      profile: qrCode.profile,
      user: qrCode.user,
      event: {
        type: 'qr_scan',
        category: 'engagement',
        action: 'scan'
      },
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referrer')
      }
    });

    // Return QR code data for redirection
    res.status(200).json({
      success: true,
      data: {
        qrCode,
        redirectUrl: qrCode.qrData
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get QR code analytics
// @route   GET /api/qr/:id/analytics
// @access  Private
const getQRAnalytics = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return next(new ErrorResponse(`QR code not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns QR code
    if (qrCode.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to view analytics for this QR code`, 401));
    }

    // Get analytics data
    const analytics = await Analytics.find({ qrCode: qrCode._id })
      .sort({ createdAt: -1 })
      .limit(100);

    // Calculate summary stats
    const totalScans = qrCode.scanCount;
    const uniqueScans = analytics.filter(a => a.event.type === 'qr_scan').length;
    const recentScans = analytics.filter(a => 
      a.event.type === 'qr_scan' && 
      new Date(a.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    res.status(200).json({
      success: true,
      data: {
        qrCode,
        analytics: {
          totalScans,
          uniqueScans,
          recentScans,
          detailedAnalytics: analytics
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle QR code status
// @route   PATCH /api/qr/:id/toggle-status
// @access  Private
const toggleQRStatus = async (req, res, next) => {
  try {
    let qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return next(new ErrorResponse(`QR code not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns QR code
    if (qrCode.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this QR code`, 401));
    }

    qrCode.isActive = !qrCode.isActive;
    await qrCode.save();

    res.status(200).json({
      success: true,
      data: qrCode
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Regenerate QR code
// @route   POST /api/qr/:id/regenerate
// @access  Private
const regenerateQRCode = async (req, res, next) => {
  try {
    let qrCode = await QRCode.findById(req.params.id);

    if (!qrCode) {
      return next(new ErrorResponse(`QR code not found with id of ${req.params.id}`, 404));
    }

    // Make sure user owns QR code
    if (qrCode.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to regenerate this QR code`, 401));
    }

    // Generate new QR data
    const newQrData = await generateQRData(qrCode);

    // Update QR code
    qrCode.qrData = newQrData;
    qrCode.scanCount = 0; // Reset scan count
    await qrCode.save();

    res.status(200).json({
      success: true,
      data: qrCode
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to generate QR data based on type
const generateQRData = async (qrCodeData) => {
  const { type, data, profile } = qrCodeData;

  switch (type) {
    case 'profile':
      return `${process.env.FRONTEND_URL}/profile/${profile?.username || profile?._id}`;
    
    case 'contact':
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${data.content.name}\nTEL:${data.content.phone}\nEMAIL:${data.content.email}\nEND:VCARD`;
    
    case 'whatsapp':
      return `https://wa.me/${data.content.phone}?text=${encodeURIComponent(data.content.message || '')}`;
    
    case 'email':
      return `mailto:${data.content.email}?subject=${encodeURIComponent(data.content.subject || '')}&body=${encodeURIComponent(data.content.body || '')}`;
    
    case 'phone':
      return `tel:${data.content.phone}`;
    
    case 'linkedin':
      return data.content.url;
    
    case 'instagram':
      return data.content.url;
    
    case 'facebook':
      return data.content.url;
    
    case 'twitter':
      return data.content.url;
    
    case 'website':
      return data.content.url;
    
    case 'wifi':
      return `WIFI:T:${data.content.encryption};S:${data.content.ssid};P:${data.content.password};;`;
    
    case 'text':
      return data.content.text;
    
    case 'url':
      return data.content.url;
    
    case 'custom':
      return data.content.custom;
    
    default:
      return data.content;
  }
};

module.exports = {
  getQRCodes,
  getQRCode,
  createQRCode,
  updateQRCode,
  deleteQRCode,
  downloadQRCode,
  scanQRCode,
  getQRAnalytics,
  toggleQRStatus,
  regenerateQRCode
};

