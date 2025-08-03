const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores']
  },
  displayName: {
    type: String,
    trim: true,
    maxlength: [50, 'Display name cannot exceed 50 characters']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  avatar: {
    url: { type: String, default: null },
    public_id: { type: String, default: null } // For Cloudinary
  },
  coverImage: {
    url: { type: String, default: null },
    public_id: { type: String, default: null }
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  jobTitle: {
    type: String,
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty values
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Website must be a valid URL starting with http:// or https://'
    }
  },
  contactInfo: {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true;
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Please provide a valid email'
      }
    },
    phone: {
      type: String,
      trim: true
    },
    alternativeEmail: {
      type: String,
      lowercase: true,
      trim: true
    }
  },
  socialLinks: {
    linkedin: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true;
          return /^https?:\/\/(www\.)?linkedin\.com\/.*/.test(v);
        },
        message: 'LinkedIn URL must be a valid LinkedIn profile URL'
      }
    },
    twitter: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    },
    facebook: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    },
    youtube: {
      type: String,
      trim: true
    },
    tiktok: {
      type: String,
      trim: true
    },
    whatsapp: {
      type: String,
      trim: true
    },
    telegram: {
      type: String,
      trim: true
    },
    discord: {
      type: String,
      trim: true
    }
  },
  customLinks: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'Link title cannot exceed 50 characters']
    },
    url: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'URL must be a valid URL starting with http:// or https://'
      }
    },
    icon: {
      type: String,
      default: 'link'
    },
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  design: {
    theme: {
      type: String,
      enum: ['default', 'minimal', 'professional', 'creative', 'dark'],
      default: 'default'
    },
    primaryColor: {
      type: String,
      default: '#3B82F6',
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Primary color must be a valid hex color'
      }
    },
    backgroundColor: {
      type: String,
      default: '#FFFFFF'
    },
    fontFamily: {
      type: String,
      enum: ['Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins'],
      default: 'Inter'
    },
    layout: {
      type: String,
      enum: ['centered', 'left-aligned', 'grid'],
      default: 'centered'
    }
  },
  settings: {
    isPublic: {
      type: Boolean,
      default: true
    },
    showEmail: {
      type: Boolean,
      default: false
    },
    showPhone: {
      type: Boolean,
      default: false
    },
    allowDirectContact: {
      type: Boolean,
      default: true
    },
    trackAnalytics: {
      type: Boolean,
      default: true
    },
    customDomain: {
      type: String,
      default: null
    }
  },
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [String]
  },
  analytics: {
    views: {
      total: { type: Number, default: 0 },
      unique: { type: Number, default: 0 },
      monthly: { type: Number, default: 0 },
      weekly: { type: Number, default: 0 }
    },
    clicks: {
      total: { type: Number, default: 0 },
      socialLinks: { type: Number, default: 0 },
      customLinks: { type: Number, default: 0 },
      contactInfo: { type: Number, default: 0 }
    },
    lastViewedAt: { type: Date, default: null },
    topReferrers: [{
      source: String,
      count: { type: Number, default: 0 }
    }]
  },
  verification: {
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date, default: null },
    verificationBadge: {
      type: String,
      enum: ['none', 'individual', 'business', 'organization'],
      default: 'none'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
profileSchema.index({ username: 1 });
profileSchema.index({ user: 1 });
profileSchema.index({ 'settings.isPublic': 1 });
profileSchema.index({ 'verification.isVerified': 1 });

// Virtual for profile URL
profileSchema.virtual('profileUrl').get(function() {
  return `/profile/${this.username}`;
});

// Virtual for full profile URL
profileSchema.virtual('fullProfileUrl').get(function() {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  return `${baseUrl}/profile/${this.username}`;
});

// Virtual for QR codes
profileSchema.virtual('qrCodes', {
  ref: 'QRCode',
  localField: '_id',
  foreignField: 'profile'
});

// Pre-save middleware to generate username if not provided
profileSchema.pre('save', async function(next) {
  if (!this.username && this.isNew) {
    // Generate username from user's name or email
    const User = mongoose.model('User');
    const user = await User.findById(this.user);
    
    if (user) {
      let baseUsername = user.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 20);
      
      if (!baseUsername) {
        baseUsername = user.email.split('@')[0].toLowerCase();
      }
      
      // Check if username exists and add number if needed
      let username = baseUsername;
      let counter = 1;
      
      while (await mongoose.model('Profile').findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }
      
      this.username = username;
    }
  }
  next();
});

// Method to increment view count
profileSchema.methods.incrementViews = function(isUnique = false) {
  const updates = {
    $inc: {
      'analytics.views.total': 1,
      'analytics.views.monthly': 1,
      'analytics.views.weekly': 1
    },
    $set: {
      'analytics.lastViewedAt': new Date()
    }
  };
  
  if (isUnique) {
    updates.$inc['analytics.views.unique'] = 1;
  }
  
  return this.updateOne(updates);
};

// Method to increment click count
profileSchema.methods.incrementClicks = function(type = 'total') {
  const updates = {
    $inc: {
      'analytics.clicks.total': 1
    }
  };
  
  if (type !== 'total') {
    updates.$inc[`analytics.clicks.${type}`] = 1;
  }
  
  return this.updateOne(updates);
};

// Method to add referrer
profileSchema.methods.addReferrer = function(source) {
  const existingReferrer = this.analytics.topReferrers.find(r => r.source === source);
  
  if (existingReferrer) {
    existingReferrer.count += 1;
  } else {
    this.analytics.topReferrers.push({ source, count: 1 });
  }
  
  // Keep only top 10 referrers
  this.analytics.topReferrers.sort((a, b) => b.count - a.count);
  this.analytics.topReferrers = this.analytics.topReferrers.slice(0, 10);
  
  return this.save();
};

// Static method to find by username
profileSchema.statics.findByUsername = function(username) {
  return this.findOne({ username: username.toLowerCase() });
};

// Static method to find public profiles
profileSchema.statics.findPublic = function() {
  return this.find({ 'settings.isPublic': true });
};

// Static method to find verified profiles
profileSchema.statics.findVerified = function() {
  return this.find({ 'verification.isVerified': true });
};

module.exports = mongoose.model('Profile', profileSchema); 