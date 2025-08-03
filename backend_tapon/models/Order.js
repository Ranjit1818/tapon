const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: () => `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      trim: true,
      default: null
    }
  },
  items: [{
    productType: {
      type: String,
      enum: ['nfc_card', 'review_card', 'custom_card', 'bulk_cards', 'premium_card'],
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 1000
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    customization: {
      design: {
        template: { type: String, default: 'default' },
        colors: {
          primary: { type: String, default: '#000000' },
          secondary: { type: String, default: '#FFFFFF' }
        },
        logo: {
          url: { type: String, default: null },
          position: { type: String, default: 'center' }
        },
        text: {
          name: { type: String, default: '' },
          title: { type: String, default: '' },
          company: { type: String, default: '' }
        }
      },
      features: {
        nfc: { type: Boolean, default: true },
        qr: { type: Boolean, default: true },
        socialLinks: { type: Boolean, default: true },
        contactInfo: { type: Boolean, default: true }
      },
      profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        default: null
      }
    },
    specifications: {
      material: { type: String, default: 'PVC' },
      size: { type: String, default: '85.6x54mm' },
      thickness: { type: String, default: '0.8mm' },
      finish: { type: String, default: 'matte' }
    }
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      amount: { type: Number, default: 0 },
      code: { type: String, default: null },
      type: { type: String, enum: ['percentage', 'fixed'], default: null }
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
    }
  },
  shipping: {
    address: {
      street: {
        type: String,
        required: true,
        trim: true
      },
      apartment: {
        type: String,
        trim: true,
        default: ''
      },
      city: {
        type: String,
        required: true,
        trim: true
      },
      state: {
        type: String,
        required: true,
        trim: true
      },
      zipCode: {
        type: String,
        required: true,
        trim: true
      },
      country: {
        type: String,
        required: true,
        trim: true,
        default: 'United States'
      }
    },
    method: {
      type: String,
      enum: ['standard', 'express', 'overnight', 'international'],
      default: 'standard'
    },
    carrier: {
      type: String,
      default: null
    },
    trackingNumber: {
      type: String,
      default: null
    },
    estimatedDelivery: {
      type: Date,
      default: null
    },
    shippedAt: {
      type: Date,
      default: null
    },
    deliveredAt: {
      type: Date,
      default: null
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['stripe', 'paypal', 'bank_transfer', 'crypto', 'apple_pay', 'google_pay'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
      default: 'pending'
    },
    transactionId: {
      type: String,
      default: null
    },
    paymentIntentId: {
      type: String,
      default: null
    },
    refundId: {
      type: String,
      default: null
    },
    paidAt: {
      type: Date,
      default: null
    },
    refundedAt: {
      type: Date,
      default: null
    }
  },
  status: {
    current: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'production', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending'
    },
    history: [{
      status: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      note: {
        type: String,
        default: ''
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
      }
    }],
    estimatedCompletion: {
      type: Date,
      default: null
    }
  },
  communication: {
    notes: [{
      type: {
        type: String,
        enum: ['customer', 'admin', 'system'],
        required: true
      },
      message: {
        type: String,
        required: true
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      isInternal: {
        type: Boolean,
        default: false
      }
    }],
    emailsSent: [{
      type: { type: String, required: true },
      subject: { type: String, required: true },
      sentAt: { type: Date, default: Date.now },
      status: { type: String, enum: ['sent', 'delivered', 'opened', 'failed'], default: 'sent' }
    }]
  },
  production: {
    startedAt: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    },
    estimatedDuration: {
      type: Number, // in days
      default: 3
    }
  },
  metadata: {
    source: {
      type: String,
      enum: ['website', 'admin', 'api', 'mobile_app'],
      default: 'website'
    },
    userAgent: {
      type: String,
      default: null
    },
    ipAddress: {
      type: String,
      default: null
    },
    referrer: {
      type: String,
      default: null
    },
    utm: {
      source: { type: String, default: null },
      medium: { type: String, default: null },
      campaign: { type: String, default: null }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
orderSchema.index({ orderId: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ 'status.current': 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'shipping.trackingNumber': 1 });

// Virtual for order URL
orderSchema.virtual('orderUrl').get(function() {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  return `${baseUrl}/orders/${this.orderId}`;
});

// Virtual for tracking URL
orderSchema.virtual('trackingUrl').get(function() {
  if (!this.shipping.trackingNumber || !this.shipping.carrier) return null;
  
  const trackingUrls = {
    'ups': `https://www.ups.com/track?tracknum=${this.shipping.trackingNumber}`,
    'fedex': `https://www.fedex.com/apps/fedextrack/?tracknumber=${this.shipping.trackingNumber}`,
    'usps': `https://tools.usps.com/go/TrackConfirmAction.action?tLabels=${this.shipping.trackingNumber}`,
    'dhl': `https://www.dhl.com/en/express/tracking.html?AWB=${this.shipping.trackingNumber}`
  };
  
  return trackingUrls[this.shipping.carrier.toLowerCase()] || null;
});

// Virtual to check if order is editable
orderSchema.virtual('isEditable').get(function() {
  return ['pending', 'confirmed'].includes(this.status.current);
});

// Virtual to check if order can be cancelled
orderSchema.virtual('canBeCancelled').get(function() {
  return ['pending', 'confirmed', 'processing'].includes(this.status.current);
});

// Pre-save middleware to update status history
orderSchema.pre('save', function(next) {
  if (this.isModified('status.current') && !this.isNew) {
    this.status.history.push({
      status: this.status.current,
      timestamp: new Date(),
      note: `Status changed to ${this.status.current}`,
      updatedBy: this._updatedBy || null
    });
  }
  next();
});

// Pre-save middleware to calculate totals
orderSchema.pre('save', function(next) {
  if (this.isModified('items') || this.isModified('pricing.shipping') || this.isModified('pricing.tax') || this.isModified('pricing.discount')) {
    // Calculate subtotal
    this.pricing.subtotal = this.items.reduce((total, item) => total + item.totalPrice, 0);
    
    // Apply discount
    let discountAmount = 0;
    if (this.pricing.discount.amount > 0) {
      if (this.pricing.discount.type === 'percentage') {
        discountAmount = (this.pricing.subtotal * this.pricing.discount.amount) / 100;
      } else {
        discountAmount = this.pricing.discount.amount;
      }
    }
    
    // Calculate total
    this.pricing.total = this.pricing.subtotal + this.pricing.shipping + this.pricing.tax - discountAmount;
    
    // Ensure total is not negative
    if (this.pricing.total < 0) this.pricing.total = 0;
  }
  next();
});

// Method to update status
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this._updatedBy = updatedBy;
  this.status.current = newStatus;
  
  // Set specific timestamps based on status
  const now = new Date();
  switch (newStatus) {
    case 'processing':
      if (!this.production.startedAt) this.production.startedAt = now;
      break;
    case 'shipped':
      if (!this.shipping.shippedAt) this.shipping.shippedAt = now;
      if (!this.production.completedAt) this.production.completedAt = now;
      break;
    case 'delivered':
      if (!this.shipping.deliveredAt) this.shipping.deliveredAt = now;
      break;
  }
  
  return this.save();
};

// Method to add note
orderSchema.methods.addNote = function(message, type = 'admin', author = null, isInternal = false) {
  this.communication.notes.push({
    type,
    message,
    author,
    timestamp: new Date(),
    isInternal
  });
  
  return this.save();
};

// Method to record email sent
orderSchema.methods.recordEmailSent = function(emailType, subject, status = 'sent') {
  this.communication.emailsSent.push({
    type: emailType,
    subject,
    sentAt: new Date(),
    status
  });
  
  return this.save();
};

// Method to calculate estimated delivery
orderSchema.methods.calculateEstimatedDelivery = function() {
  if (!this.shipping.shippedAt) return null;
  
  const shippedDate = new Date(this.shipping.shippedAt);
  const deliveryDays = {
    'standard': 5,
    'express': 3,
    'overnight': 1,
    'international': 10
  };
  
  const estimatedDays = deliveryDays[this.shipping.method] || 5;
  const estimatedDelivery = new Date(shippedDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + estimatedDays);
  
  this.shipping.estimatedDelivery = estimatedDelivery;
  return estimatedDelivery;
};

// Method to process refund
orderSchema.methods.processRefund = function(refundAmount = null, refundId = null) {
  this.payment.status = 'refunded';
  this.payment.refundedAt = new Date();
  if (refundId) this.payment.refundId = refundId;
  
  this.status.current = 'refunded';
  
  return this.save();
};

// Static method to find by order ID
orderSchema.statics.findByOrderId = function(orderId) {
  return this.findOne({ orderId });
};

// Static method to find by user
orderSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Static method to find by status
orderSchema.statics.findByStatus = function(status) {
  return this.find({ 'status.current': status });
};

// Static method to find pending orders
orderSchema.statics.findPending = function() {
  return this.find({ 'status.current': { $in: ['pending', 'confirmed'] } });
};

// Static method to find orders requiring attention
orderSchema.statics.findRequiringAttention = function() {
  return this.find({
    $or: [
      { 'status.current': 'pending' },
      { 'payment.status': 'failed' },
      { 'production.priority': 'urgent' }
    ]
  });
};

// Static method to get order statistics
orderSchema.statics.getStatistics = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status.current',
        count: { $sum: 1 },
        totalValue: { $sum: '$pricing.total' }
      }
    }
  ]);
};

module.exports = mongoose.model('Order', orderSchema); 