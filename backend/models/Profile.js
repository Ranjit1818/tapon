const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  profileImage: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    trim: true
  },
  socialLinks: {
    whatsapp: { type: String, trim: true },
    instagram: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    facebook: { type: String, trim: true },
    youtube: { type: String, trim: true },
    tiktok: { type: String, trim: true },
    snapchat: { type: String, trim: true },
    telegram: { type: String, trim: true },
    maps: { type: String, trim: true },
    calendly: { type: String, trim: true }
  },
  customLinks: [{
    title: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String, default: '🔗' },
    isActive: { type: Boolean, default: true }
  }],
  qrCode: {
    url: { type: String, default: '' },
    shortUrl: { type: String, default: '' },
    lastGenerated: { type: Date }
  },
  theme: {
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: { type: String, default: '#10B981' },
    accentColor: { type: String, default: '#F59E0B' },
    backgroundColor: { type: String, default: '#FFFFFF' },
    textColor: { type: String, default: '#1F2937' },
    fontFamily: { type: String, default: 'Inter' }
  },
  settings: {
    isPublic: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false },
    allowAnalytics: { type: Boolean, default: true },
    allowLeadCapture: { type: Boolean, default: true },
    autoRedirect: { type: Boolean, default: false },
    redirectUrl: { type: String, default: '' }
  },
  analytics: {
    totalViews: { type: Number, default: 0 },
    totalLeads: { type: Number, default: 0 },
    totalScans: { type: Number, default: 0 },
    totalNfcTaps: { type: Number, default: 0 },
    lastViewed: { type: Date }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
profileSchema.index({ username: 1 });
profileSchema.index({ user: 1 });
profileSchema.index({ isActive: 1 });
profileSchema.index({ isPublic: 1 });
profileSchema.index({ 'analytics.totalViews': -1 });

// Virtual for profile URL
profileSchema.virtual('profileUrl').get(function() {
  return `${process.env.FRONTEND_URL || 'https://taponn.site'}/profile/${this.username}`;
});

// Ensure virtual fields are serialized
profileSchema.set('toJSON', { virtuals: true });
profileSchema.set('toObject', { virtuals: true });

// Update analytics when profile is viewed
profileSchema.methods.incrementViews = function() {
  this.analytics.totalViews += 1;
  this.analytics.lastViewed = new Date();
  return this.save();
};

// Update analytics when lead is captured
profileSchema.methods.incrementLeads = function() {
  this.analytics.totalLeads += 1;
  return this.save();
};

// Update analytics when QR is scanned
profileSchema.methods.incrementScans = function() {
  this.analytics.totalScans += 1;
  return this.save();
};

// Update analytics when NFC is tapped
profileSchema.methods.incrementNfcTaps = function() {
  this.analytics.totalNfcTaps += 1;
  return this.save();
};

module.exports = mongoose.model('Profile', profileSchema); 