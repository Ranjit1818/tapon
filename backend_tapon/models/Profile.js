const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true,
    maxlength: [100, 'Display name cannot be more than 100 characters']
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  avatar: {
    type: String,
    default: null
  },
  theme: {
    type: String,
    enum: ['default', 'dark', 'light', 'colorful', 'minimal'],
    default: 'default'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  socialLinks: {
    website: String,
    linkedin: String,
    twitter: String,
    instagram: String,
    facebook: String,
    youtube: String,
    github: String
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String
  },
  customFields: [{
    label: String,
    value: String,
    type: {
      type: String,
      enum: ['text', 'link', 'email', 'phone'],
      default: 'text'
    }
  }],
  settings: {
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false },
    allowContact: { type: Boolean, default: true },
    analyticsEnabled: { type: Boolean, default: true }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for QR codes
profileSchema.virtual('qrCodes', {
  ref: 'QRCode',
  localField: '_id',
  foreignField: 'profile'
});

// Virtual for analytics
profileSchema.virtual('analytics', {
  ref: 'Analytics',
  localField: '_id',
  foreignField: 'profile'
});

// Indexes
profileSchema.index({ user: 1 });
profileSchema.index({ username: 1 });
profileSchema.index({ isPublic: 1 });

module.exports = mongoose.model('Profile', profileSchema); 