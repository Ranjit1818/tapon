const mongoose = require('mongoose');
const config = require('./config/config');
const Profile = require('./models/Profile');
const QRCode = require('./models/QRCode');

// Connect to MongoDB
mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

async function generateMissingQRCodes() {
  try {
    console.log('🔍 Finding profiles without QR codes...');
    
    // Find all profiles
    const profiles = await Profile.find({}).populate('user', 'name email');
    
    console.log(`📊 Found ${profiles.length} profiles`);
    
    let qrCodesCreated = 0;
    let qrCodesSkipped = 0;
    
    for (const profile of profiles) {
      // Check if QR code already exists for this profile
      const existingQR = await QRCode.findOne({ 
        user: profile.user._id, 
        profile: profile._id 
      });
      
      if (existingQR) {
        console.log(`⏭️  Skipping ${profile.user.name} - QR code already exists`);
        qrCodesSkipped++;
        continue;
      }
      
      try {
        // Create QR code for this profile
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const profileUrl = profile.username 
          ? `${frontendUrl}/p/${profile.username}` 
          : `${frontendUrl}/p/${profile._id}`;
        
        const qrCode = await QRCode.create({
          user: profile.user._id,
          profile: profile._id,
          name: `${profile.displayName || profile.user.name} QR Code`,
          type: 'profile',
          qrData: profileUrl,
          isActive: true
        });
        
        console.log(`✅ Created QR code for ${profile.user.name} (${profile.user.email})`);
        console.log(`   QR Data: ${profileUrl}`);
        qrCodesCreated++;
        
      } catch (error) {
        console.error(`❌ Failed to create QR code for ${profile.user.name}:`, error.message);
        if (error.errors) {
          console.error('   Validation errors:', error.errors);
        }
      }
    }
    
    console.log('\n📈 Summary:');
    console.log(`✅ QR codes created: ${qrCodesCreated}`);
    console.log(`⏭️  QR codes skipped: ${qrCodesSkipped}`);
    console.log(`📊 Total profiles processed: ${profiles.length}`);
    
  } catch (error) {
    console.error('❌ Error generating QR codes:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
generateMissingQRCodes();
