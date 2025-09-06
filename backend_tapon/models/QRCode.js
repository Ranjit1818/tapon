const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  name: {
    type: String,
    required: [true, 'QR code name is required'],
    trim: true,
    maxlength: [100, 'QR code name cannot be more than 100 characters']
  },
  qrData: {
    type: String,
    required: [true, 'QR data is required']
  },
  qrImage: {
    type: String,
    default: null
  },
  logo: {
    type: String,
    default: null
  },
  scanCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    size: {
      type: Number,
      default: 200,
      min: [100, 'QR size must be at least 100px'],
      max: [1000, 'QR size cannot exceed 1000px']
    },
    foregroundColor: {
      type: String,
      default: '#000000',
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Foreground color must be a valid hex color'
      }
    },
    backgroundColor: {
      type: String,
      default: '#FFFFFF',
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Background color must be a valid hex color'
      }
    },
    errorCorrectionLevel: {
      type: String,
      enum: ['L', 'M', 'Q', 'H'],
      default: 'M'
    },
    margin: {
      type: Number,
      default: 4,
      min: [0, 'Margin cannot be negative'],
      max: [10, 'Margin cannot exceed 10']
    }
  },
  analytics: {
    totalScans: { type: Number, default: 0 },
    uniqueScans: { type: Number, default: 0 },
    lastScannedAt: { type: Date, default: null },
    scanHistory: [{
      timestamp: { type: Date, default: Date.now },
      ipAddress: String,
      userAgent: String,
      location: String,
      device: String
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for QR code URL
qrCodeSchema.virtual('qrUrl').get(function() {
  return `${process.env.API_URL}/api/qr/${this._id}/download`;
});

// Virtual for scan URL
qrCodeSchema.virtual('scanUrl').get(function() {
  return `${process.env.API_URL}/api/qr/scan/${this._id}`;
});

// Indexes
qrCodeSchema.index({ user: 1 });
qrCodeSchema.index({ profile: 1 });
qrCodeSchema.index({ isActive: 1 });

// Method to increment scan count
qrCodeSchema.methods.incrementScan = function(scanData = {}) {
  const updates = {
    $inc: {
      scanCount: 1,
      'analytics.totalScans': 1
    },
    $set: {
      'analytics.lastScannedAt': new Date()
    }
  };

  // Add to scan history
  updates.$push = {
    'analytics.scanHistory': {
      timestamp: new Date(),
      ipAddress: scanData.ipAddress || null,
      userAgent: scanData.userAgent || null,
      location: scanData.location || null,
      device: scanData.device || null
    }
  };

  // Keep only last 100 scan records
  updates.$slice = { 'analytics.scanHistory': -100 };

  return this.updateOne(updates);
};

// Method to generate QR data
qrCodeSchema.methods.generateQRData = function() {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  return `${baseUrl}/profile/${this.profile.username}`;
};

// Static method to find active QR codes
qrCodeSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

module.exports = mongoose.model('QRCode', qrCodeSchema); 