const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Lead name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  position: {
    type: String,
    trim: true,
    maxlength: [100, 'Position cannot be more than 100 characters']
  },
  source: {
    type: String,
    enum: ['QR Code', 'NFC Tap', 'Direct Link', 'Social Media', 'Email', 'Website', 'Other'],
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
    default: 'new'
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],
  location: {
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    ip: { type: String, trim: true }
  },
  device: {
    type: { type: String, enum: ['mobile', 'desktop', 'tablet'] },
    browser: { type: String, trim: true },
    os: { type: String, trim: true }
  },
  interactions: [{
    type: { type: String, enum: ['view', 'click', 'form_submit', 'contact'] },
    timestamp: { type: Date, default: Date.now },
    details: { type: String, trim: true }
  }],
  lastContacted: {
    type: Date
  },
  nextFollowUp: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
leadSchema.index({ profile: 1 });
leadSchema.index({ user: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ 'location.country': 1 });
leadSchema.index({ 'location.city': 1 });

// Virtual for lead age in days
leadSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Ensure virtual fields are serialized
leadSchema.set('toJSON', { virtuals: true });
leadSchema.set('toObject', { virtuals: true });

// Update lead status
leadSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'contacted') {
    this.lastContacted = new Date();
  }
  return this.save();
};

// Add interaction
leadSchema.methods.addInteraction = function(type, details = '') {
  this.interactions.push({
    type,
    timestamp: new Date(),
    details
  });
  return this.save();
};

// Calculate lead score based on interactions and data completeness
leadSchema.methods.calculateScore = function() {
  let score = 0;
  
  // Base score for having email
  if (this.email) score += 20;
  
  // Base score for having phone
  if (this.phone) score += 15;
  
  // Base score for having company
  if (this.company) score += 10;
  
  // Score for interactions
  score += this.interactions.length * 5;
  
  // Score for recent activity (last 7 days)
  const recentInteractions = this.interactions.filter(
    interaction => (Date.now() - interaction.timestamp) < 7 * 24 * 60 * 60 * 1000
  );
  score += recentInteractions.length * 10;
  
  // Cap score at 100
  this.score = Math.min(score, 100);
  return this.save();
};

module.exports = mongoose.model('Lead', leadSchema); 