const mongoose = require('mongoose');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const qrCodeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    default: null
  },
  qrId: {
    type: String,
    unique: true,
    default: uuidv4
  },
  type: {
    type: String,
    enum: [
      'profile',
      'contact',
      'whatsapp',
      'email',
      'phone',
      'linkedin',
      'instagram',
      'facebook',
      'twitter',
      'website',
      'vcard',
      'wifi',
      'text',
      'url',
      'custom'
    ],
    required: true,
    default: 'profile'
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  data: {
    // The actual data to encode in QR code
    content: {
      type: String,
      required: true
    },
    // Formatted data for specific QR types
    formatted: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  url: {
    // The URL that QR code points to
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'URL must be a valid URL starting with http:// or https://'
    }
  },
  shortUrl: {
    // Shortened URL for tracking
    type: String,
    default: null
  },
  qrImage: {
    // Cloudinary or local storage info
    url: { type: String, default: null },
    public_id: { type: String, default: null },
    format: { type: String, default: 'png' },
    size: { type: Number, default: 256 } // pixels
  },
  design: {
    foregroundColor: {
      type: String,
      default: '#000000',
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Color must be a valid hex color'
      }
    },
    backgroundColor: {
      type: String,
      default: '#FFFFFF'
    },
    logo: {
      url: { type: String, default: null },
      size: { type: Number, default: 0.3 } // 0.1 to 0.5
    },
    errorCorrectionLevel: {
      type: String,
      enum: ['L', 'M', 'Q', 'H'],
      default: 'M'
    },
    margin: {
      type: Number,
      default: 4,
      min: 0,
      max: 10
    }
  },
  settings: {
    isActive: {
      type: Boolean,
      default: true
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    trackScans: {
      type: Boolean,
      default: true
    },
    expiresAt: {
      type: Date,
      default: null
    },
    password: {
      type: String,
      default: null
    },
    maxScans: {
      type: Number,
      default: null
    }
  },
  analytics: {
    totalScans: { type: Number, default: 0 },
    uniqueScans: { type: Number, default: 0 },
    lastScannedAt: { type: Date, default: null },
    scansToday: { type: Number, default: 0 },
    scansThisWeek: { type: Number, default: 0 },
    scansThisMonth: { type: Number, default: 0 },
    scansByDate: [{
      date: { type: Date, required: true },
      count: { type: Number, default: 0 }
    }],
    scansByLocation: [{
      country: String,
      city: String,
      count: { type: Number, default: 0 }
    }],
    scansByDevice: [{
      device: String, // mobile, tablet, desktop
      count: { type: Number, default: 0 }
    }],
    referrers: [{
      source: String,
      count: { type: Number, default: 0 }
    }]
  },
  customization: {
    redirectMessage: {
      type: String,
      default: null
    },
    redirectDelay: {
      type: Number,
      default: 0, // seconds
      min: 0,
      max: 10
    },
    showPreview: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
qrCodeSchema.index({ user: 1 });
qrCodeSchema.index({ profile: 1 });
qrCodeSchema.index({ qrId: 1 });
qrCodeSchema.index({ type: 1 });
qrCodeSchema.index({ 'settings.isActive': 1 });
qrCodeSchema.index({ 'settings.isPublic': 1 });
qrCodeSchema.index({ createdAt: -1 });

// Virtual for QR code access URL
qrCodeSchema.virtual('accessUrl').get(function() {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  return `${baseUrl}/qr/${this.qrId}`;
});

// Virtual for download URL
qrCodeSchema.virtual('downloadUrl').get(function() {
  const baseUrl = process.env.API_URL || 'http://localhost:5000';
  return `${baseUrl}/api/qr/${this.qrId}/download`;
});

// Virtual to check if QR code is expired
qrCodeSchema.virtual('isExpired').get(function() {
  if (!this.settings.expiresAt) return false;
  return this.settings.expiresAt < new Date();
});

// Virtual to check if QR code has reached max scans
qrCodeSchema.virtual('hasReachedMaxScans').get(function() {
  if (!this.settings.maxScans) return false;
  return this.analytics.totalScans >= this.settings.maxScans;
});

// Pre-save middleware to generate QR data based on type
qrCodeSchema.pre('save', async function(next) {
  if (this.isModified('data.content') || this.isModified('type') || this.isNew) {
    await this.generateQRData();
  }
  next();
});

// Method to generate QR code data based on type
qrCodeSchema.methods.generateQRData = async function() {
  const { type, data } = this;
  let qrContent = data.content;
  let formattedData = {};

  switch (type) {
    case 'profile':
      // Profile QR points to profile URL
      if (this.profile) {
        const Profile = mongoose.model('Profile');
        const profile = await Profile.findById(this.profile);
        if (profile) {
          qrContent = profile.fullProfileUrl;
          formattedData = {
            username: profile.username,
            displayName: profile.displayName,
            profileUrl: profile.fullProfileUrl
          };
        }
      }
      break;

    case 'vcard':
      // Generate vCard format
      const vcard = this.generateVCard(data.content);
      qrContent = vcard;
      formattedData = { vcard };
      break;

    case 'whatsapp':
      // WhatsApp format: https://wa.me/1234567890?text=Hello
      const phone = data.content.replace(/[^0-9]/g, '');
      qrContent = `https://wa.me/${phone}`;
      formattedData = { phone, whatsappUrl: qrContent };
      break;

    case 'email':
      // mailto format
      qrContent = `mailto:${data.content}`;
      formattedData = { email: data.content };
      break;

    case 'phone':
      // tel format
      qrContent = `tel:${data.content}`;
      formattedData = { phone: data.content };
      break;

    case 'wifi':
      // WiFi format: WIFI:T:WPA;S:networkname;P:password;H:false;
      const wifiData = JSON.parse(data.content);
      qrContent = `WIFI:T:${wifiData.security};S:${wifiData.ssid};P:${wifiData.password};H:${wifiData.hidden || false};`;
      formattedData = wifiData;
      break;

    case 'linkedin':
    case 'instagram':
    case 'facebook':
    case 'twitter':
    case 'website':
    case 'url':
      // Direct URL
      qrContent = data.content;
      formattedData = { url: data.content };
      break;

    case 'text':
      // Plain text
      qrContent = data.content;
      formattedData = { text: data.content };
      break;

    default:
      qrContent = data.content;
      formattedData = { content: data.content };
  }

  this.data.content = qrContent;
  this.data.formatted = formattedData;
  this.url = qrContent;
};

// Method to generate vCard
qrCodeSchema.methods.generateVCard = function(contactData) {
  const contact = JSON.parse(contactData);
  return `BEGIN:VCARD
VERSION:3.0
FN:${contact.name || ''}
ORG:${contact.organization || ''}
TITLE:${contact.title || ''}
TEL:${contact.phone || ''}
EMAIL:${contact.email || ''}
URL:${contact.website || ''}
NOTE:${contact.note || ''}
END:VCARD`;
};

// Method to generate QR code image
qrCodeSchema.methods.generateQRImage = async function() {
  const options = {
    errorCorrectionLevel: this.design.errorCorrectionLevel,
    type: 'image/png',
    quality: 0.92,
    margin: this.design.margin,
    color: {
      dark: this.design.foregroundColor,
      light: this.design.backgroundColor,
    },
    width: this.qrImage.size || 256
  };

  try {
    const qrImageBuffer = await QRCode.toBuffer(this.data.content, options);
    return qrImageBuffer;
  } catch (error) {
    throw new Error(`QR code generation failed: ${error.message}`);
  }
};

// Method to increment scan count
qrCodeSchema.methods.incrementScan = function(isUnique = false, metadata = {}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const updates = {
    $inc: {
      'analytics.totalScans': 1,
      'analytics.scansToday': 1,
      'analytics.scansThisWeek': 1,
      'analytics.scansThisMonth': 1
    },
    $set: {
      'analytics.lastScannedAt': new Date()
    }
  };

  if (isUnique) {
    updates.$inc['analytics.uniqueScans'] = 1;
  }

  // Add to daily stats
  const existingDateIndex = this.analytics.scansByDate.findIndex(
    scan => scan.date.toDateString() === today.toDateString()
  );

  if (existingDateIndex >= 0) {
    this.analytics.scansByDate[existingDateIndex].count += 1;
  } else {
    this.analytics.scansByDate.push({ date: today, count: 1 });
  }

  // Add location data if provided
  if (metadata.country) {
    const existingLocationIndex = this.analytics.scansByLocation.findIndex(
      location => location.country === metadata.country && location.city === metadata.city
    );

    if (existingLocationIndex >= 0) {
      this.analytics.scansByLocation[existingLocationIndex].count += 1;
    } else {
      this.analytics.scansByLocation.push({
        country: metadata.country,
        city: metadata.city || 'Unknown',
        count: 1
      });
    }
  }

  // Add device data if provided
  if (metadata.device) {
    const existingDeviceIndex = this.analytics.scansByDevice.findIndex(
      device => device.device === metadata.device
    );

    if (existingDeviceIndex >= 0) {
      this.analytics.scansByDevice[existingDeviceIndex].count += 1;
    } else {
      this.analytics.scansByDevice.push({
        device: metadata.device,
        count: 1
      });
    }
  }

  // Keep only last 30 days of scan data
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  this.analytics.scansByDate = this.analytics.scansByDate.filter(
    scan => scan.date >= thirtyDaysAgo
  );

  return this.updateOne(updates);
};

// Method to check if QR code can be scanned
qrCodeSchema.methods.canBeScanned = function() {
  if (!this.settings.isActive) return { canScan: false, reason: 'QR code is inactive' };
  if (this.isExpired) return { canScan: false, reason: 'QR code has expired' };
  if (this.hasReachedMaxScans) return { canScan: false, reason: 'QR code has reached maximum scans' };
  
  return { canScan: true };
};

// Static method to find by QR ID
qrCodeSchema.statics.findByQrId = function(qrId) {
  return this.findOne({ qrId });
};

// Static method to find active QR codes
qrCodeSchema.statics.findActive = function() {
  return this.find({ 'settings.isActive': true });
};

// Static method to find by user
qrCodeSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Static method to find by type
qrCodeSchema.statics.findByType = function(type) {
  return this.find({ type });
};

module.exports = mongoose.model('QRCode', qrCodeSchema); 