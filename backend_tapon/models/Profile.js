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
  jobTitle: {
    type: String,
    trim: true,
    maxlength: [100, 'Job title cannot be more than 100 characters']
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  website: {
    type: String,
    trim: true
  },
  coverImage: {
    type: String,
    default: null
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
  colors: {
    background: { type: String, default: '#000000' },
    card: { type: String, default: '#1a1a1a' },
    text: { type: String, default: '#ffffff' },
    primary: { type: String, default: '#6366f1' }
  },
  socialLinks: {
    website: String,
    linkedin: String,
    twitter: String,
    instagram: String,
    facebook: String,
    youtube: String,
    github: String,
    googleReview: String,
    googleMap: String,
    whatsapp: String
  },
  paymentInfo: {
    upiId: String,
    googlePay: String,
    phonePe: String,
    paytm: String
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String
  },
  customLinks: [{
    title: String,
    url: String,
    icon: String
  }],
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

// Post-save hook to automatically generate QR code when profile is created
profileSchema.post('save', async function (doc, next) {
  // Only generate QR code on new profile creation (not updates)
  // Use isNew flag which is set by mongoose
  if (this.isNew) {
    // Use setTimeout to avoid blocking the save operation
    setImmediate(async () => {
      try {
        const QRCode = mongoose.model('QRCode');
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const profileUrl = doc.username
          ? `${frontendUrl}/p/${doc.username}`
          : `${frontendUrl}/p/${doc._id}`;

        // Check if QR code already exists
        const existingQR = await QRCode.findOne({
          user: doc.user,
          profile: doc._id
        });

        if (!existingQR) {
          const qrCode = await QRCode.create({
            user: doc.user,
            profile: doc._id,
            name: `${doc.displayName || 'Profile'} QR Code`,
            type: 'profile',
            qrData: profileUrl,
            isActive: true
          });

          console.log(`✅ Auto-generated QR code via post-save hook for profile: ${doc._id}, QR: ${qrCode._id}`);
        } else {
          console.log(`⏭️  QR code already exists for profile: ${doc._id}`);
        }
      } catch (error) {
        // Don't fail profile save if QR generation fails
        console.error('❌ Failed to auto-generate QR code in post-save hook:', error.message);
        if (error.errors) {
          console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
        }
      }
    });
  }
  next();
});

module.exports = mongoose.model('Profile', profileSchema); 