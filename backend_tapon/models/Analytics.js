const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    default: null
  },
  qrCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QRCode',
    default: null
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  event: {
    type: {
      type: String,
      enum: [
        'profile_view',
        'profile_click',
        'qr_scan',
        'qr_generate',
        'social_link_click',
        'contact_click',
        'order_placed',
        'order_completed',
        'user_registration',
        'user_login',
        'admin_action',
        'email_sent',
        'custom_link_click',
        'download_vcard',
        'share_profile'
      ],
      required: true
    },
    category: {
      type: String,
      enum: ['engagement', 'conversion', 'acquisition', 'retention', 'admin', 'system'],
      required: true
    },
    action: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: null
    },
    value: {
      type: Number,
      default: null
    }
  },
  data: {
    // Flexible data storage for event-specific information
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  session: {
    sessionId: {
      type: String,
      default: null
    },
    isNewSession: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number, // in seconds
      default: null
    }
  },
  device: {
    type: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop', 'unknown'],
      default: 'unknown'
    },
    browser: {
      type: String,
      default: null
    },
    os: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      default: null
    }
  },
  location: {
    country: {
      type: String,
      default: null
    },
    region: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null
    },
    coordinates: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null }
    },
    timezone: {
      type: String,
      default: null
    }
  },
  traffic: {
    source: {
      type: String,
      enum: ['direct', 'search', 'social', 'referral', 'email', 'qr', 'unknown'],
      default: 'unknown'
    },
    medium: {
      type: String,
      default: null
    },
    campaign: {
      type: String,
      default: null
    },
    referrer: {
      type: String,
      default: null
    },
    landingPage: {
      type: String,
      default: null
    }
  },
  metadata: {
    ipAddress: {
      type: String,
      default: null
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    processed: {
      type: Boolean,
      default: false
    },
    version: {
      type: String,
      default: '1.0'
    }
  }
}, {
  timestamps: true,
  // TTL index to automatically delete old analytics after 2 years
  index: { "createdAt": 1 },
  expireAfterSeconds: 63072000 // 2 years
});

// Indexes for performance and analytics queries
analyticsSchema.index({ user: 1, createdAt: -1 });
analyticsSchema.index({ profile: 1, createdAt: -1 });
analyticsSchema.index({ qrCode: 1, createdAt: -1 });
analyticsSchema.index({ order: 1, createdAt: -1 });
analyticsSchema.index({ 'event.type': 1, createdAt: -1 });
analyticsSchema.index({ 'event.category': 1, createdAt: -1 });
analyticsSchema.index({ 'session.sessionId': 1 });
analyticsSchema.index({ 'device.type': 1 });
analyticsSchema.index({ 'location.country': 1 });
analyticsSchema.index({ 'traffic.source': 1 });
analyticsSchema.index({ 'metadata.timestamp': -1 });

// Virtual for formatted timestamp
analyticsSchema.virtual('formattedTimestamp').get(function() {
  return this.metadata.timestamp.toISOString();
});

// Static method to record event
analyticsSchema.statics.recordEvent = async function(eventData) {
  try {
    const event = new this(eventData);
    await event.save();
    return event;
  } catch (error) {
    console.error('Error recording analytics event:', error);
    return null;
  }
};

// Static method to get profile analytics
analyticsSchema.statics.getProfileAnalytics = function(profileId, timeRange = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeRange);

  return this.aggregate([
    {
      $match: {
        profile: new mongoose.Types.ObjectId(profileId),
        'metadata.timestamp': { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$metadata.timestamp" } },
          eventType: "$event.type"
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: "$_id.date",
        events: {
          $push: {
            type: "$_id.eventType",
            count: "$count"
          }
        },
        totalEvents: { $sum: "$count" }
      }
    },
    {
      $sort: { "_id": 1 }
    }
  ]);
};

// Static method to get user analytics
analyticsSchema.statics.getUserAnalytics = function(userId, timeRange = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeRange);

  return this.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        'metadata.timestamp': { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          eventType: "$event.type",
          category: "$event.category"
        },
        count: { $sum: 1 },
        value: { $sum: "$event.value" }
      }
    }
  ]);
};

// Static method to get platform analytics
analyticsSchema.statics.getPlatformAnalytics = function(timeRange = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeRange);

  return this.aggregate([
    {
      $match: {
        'metadata.timestamp': { $gte: startDate }
      }
    },
    {
      $facet: {
        // Events by type
        eventsByType: [
          {
            $group: {
              _id: "$event.type",
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ],
        // Events by category
        eventsByCategory: [
          {
            $group: {
              _id: "$event.category",
              count: { $sum: 1 }
            }
          }
        ],
        // Device breakdown
        deviceBreakdown: [
          {
            $group: {
              _id: "$device.type",
              count: { $sum: 1 }
            }
          }
        ],
        // Traffic sources
        trafficSources: [
          {
            $group: {
              _id: "$traffic.source",
              count: { $sum: 1 }
            }
          }
        ],
        // Daily trends
        dailyTrends: [
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$metadata.timestamp" } },
              count: { $sum: 1 },
              uniqueUsers: { $addToSet: "$user" }
            }
          },
          {
            $addFields: {
              uniqueUserCount: { $size: "$uniqueUsers" }
            }
          },
          {
            $project: {
              uniqueUsers: 0
            }
          },
          { $sort: { "_id": 1 } }
        ],
        // Geographic data
        geographic: [
          {
            $group: {
              _id: {
                country: "$location.country",
                city: "$location.city"
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 50 }
        ]
      }
    }
  ]);
};

// Static method to get QR code analytics
analyticsSchema.statics.getQRAnalytics = function(qrCodeId, timeRange = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - timeRange);

  return this.aggregate([
    {
      $match: {
        qrCode: new mongoose.Types.ObjectId(qrCodeId),
        'event.type': 'qr_scan',
        'metadata.timestamp': { $gte: startDate }
      }
    },
    {
      $facet: {
        // Scans over time
        scansOverTime: [
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$metadata.timestamp" } },
              count: { $sum: 1 },
              uniqueUsers: { $addToSet: "$session.sessionId" }
            }
          },
          {
            $addFields: {
              uniqueScans: { $size: "$uniqueUsers" }
            }
          },
          { $sort: { "_id": 1 } }
        ],
        // Device breakdown
        deviceBreakdown: [
          {
            $group: {
              _id: "$device.type",
              count: { $sum: 1 }
            }
          }
        ],
        // Location breakdown
        locationBreakdown: [
          {
            $group: {
              _id: "$location.country",
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ]
      }
    }
  ]);
};

// Static method for real-time analytics
analyticsSchema.statics.getRealTimeAnalytics = function() {
  const now = new Date();
  const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return this.aggregate([
    {
      $facet: {
        // Last hour activity
        lastHour: [
          {
            $match: {
              'metadata.timestamp': { $gte: lastHour }
            }
          },
          {
            $group: {
              _id: "$event.type",
              count: { $sum: 1 }
            }
          }
        ],
        // Last 24 hours trends
        last24Hours: [
          {
            $match: {
              'metadata.timestamp': { $gte: last24Hours }
            }
          },
          {
            $group: {
              _id: {
                hour: { $hour: "$metadata.timestamp" },
                eventType: "$event.type"
              },
              count: { $sum: 1 }
            }
          }
        ],
        // Active users (last hour)
        activeUsers: [
          {
            $match: {
              'metadata.timestamp': { $gte: lastHour },
              user: { $ne: null }
            }
          },
          {
            $group: {
              _id: null,
              uniqueUsers: { $addToSet: "$user" }
            }
          },
          {
            $addFields: {
              count: { $size: "$uniqueUsers" }
            }
          }
        ]
      }
    }
  ]);
};

// Method to process and enrich analytics data
analyticsSchema.methods.processData = function() {
  // This could include additional processing like:
  // - Geolocation lookup from IP
  // - User agent parsing
  // - Session tracking
  // - A/B test assignment
  
  this.metadata.processed = true;
  return this.save();
};

module.exports = mongoose.model('Analytics', analyticsSchema); 