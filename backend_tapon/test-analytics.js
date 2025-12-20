const mongoose = require('mongoose');
const Analytics = require('./models/Analytics');
const User = require('./models/User');
require('dotenv').config();

const testAnalytics = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taponn');
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne();
    if (!user) {
      console.log('❌ No user found. Please create a user first.');
      process.exit(1);
    }

    console.log(`📊 Creating test analytics for user: ${user.email}`);

    // Create test events
    const testEvents = [
      {
        user: user._id,
        eventType: 'profile_view',
        eventAction: 'view',
        metadata: {
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          device: 'Desktop',
          location: { country: 'India', city: 'Mumbai' },
          timestamp: new Date()
        }
      },
      {
        user: user._id,
        eventType: 'social_link_click',
        eventAction: 'whatsapp',
        metadata: {
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
          device: 'Mobile',
          location: { country: 'India', city: 'Delhi' },
          timestamp: new Date()
        }
      },
      {
        user: user._id,
        eventType: 'contact_click',
        eventAction: 'email',
        metadata: {
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          device: 'Desktop',
          location: { country: 'USA', city: 'New York' },
          timestamp: new Date()
        }
      }
    ];

    // Insert test events
    const created = await Analytics.insertMany(testEvents);
    console.log(`✅ Created ${created.length} test analytics events`);

    // Show updated counts
    const totalCount = await Analytics.countDocuments({ user: user._id });
    console.log(`📈 Total analytics for user: ${totalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testAnalytics();


