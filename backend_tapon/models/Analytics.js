const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', default: null },
    qrCode: { type: mongoose.Schema.Types.ObjectId, ref: 'QRCode', default: null },
    eventType: { type: String, required: true, default: "general" },
    eventCategory: { type: String, default: 'engagement' },
    eventAction: { type: String, required: true, default: "unknown" },
    metadata: {
      ipAddress: { type: String },
      userAgent: { type: String },
      referrer: { type: String },
      device: { type: String },
      location: {
        country: { type: String },
        region: { type: String },
        city: { type: String }
      },
      timestamp: { type: Date, default: Date.now }
    },
    session: { type: Object, default: {} },
    userJourney: { type: Object, default: {} },
    performance: { type: Object, default: {} },
    conversion: { type: Object, default: {} }
  },
  { timestamps: true }
);

// Static method to record an event
AnalyticsSchema.statics.recordEvent = async function (eventData) {
  return this.create(eventData);
};

// Analytics summary helper
AnalyticsSchema.statics.getAnalyticsSummary = async function (filters) {
  const { user, dateFrom, dateTo } = filters;
  const match = { createdAt: { $gte: dateFrom, $lte: dateTo } };
  if (user) match.user = user;

  const totalEvents = await this.countDocuments(match);
  const uniqueUsers = await this.distinct('user', match);

  return { totalEvents, uniqueUsers: uniqueUsers.length };
};

// Time-based analytics helper
AnalyticsSchema.statics.getTimeBasedAnalytics = async function (filters, interval = 'day') {
  const { user, dateFrom, dateTo } = filters;
  const match = { createdAt: { $gte: dateFrom, $lte: dateTo } };
  if (user) match.user = user;

  const groupFormat = interval === 'day' ? '%Y-%m-%d' : '%Y-%m';
  const data = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: { $dateToString: { format: groupFormat, date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return data;
};

module.exports = mongoose.model('Analytics', AnalyticsSchema);
