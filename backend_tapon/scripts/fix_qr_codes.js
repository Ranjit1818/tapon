const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Profile = require('../models/Profile');
const QRCode = require('../models/QRCode');
const User = require('../models/User');

const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

const fixQRCodes = async () => {
  await connectDB();

  try {
    console.log('Starting QR Code fix process...');
    const profiles = await Profile.find({}).populate('user', 'name email');

    let qrCodesCreated = 0;
    let qrCodesUpdated = 0;
    let qrCodesSkipped = 0;
    const errors = [];

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    for (const profile of profiles) {
      // Skip if profile doesn't have a user
      if (!profile.user || !profile.user._id) {
        continue;
      }

      // 1. Ensure Profile has a username
      if (!profile.username) {
        try {
          const baseUsername = (profile.displayName || profile.user.name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
          let suffix = Math.floor(1000 + Math.random() * 9000);
          let username = `${baseUsername}${suffix}`;

          while (await Profile.findOne({ username })) {
            suffix = Math.floor(1000 + Math.random() * 9000);
            username = `${baseUsername}${suffix}`;
          }

          profile.username = username;
          await profile.save();
          console.log(`✅ Generated missing username for profile ${profile._id}: ${username}`);
        } catch (err) {
          console.error(`❌ Failed to generate username for profile ${profile._id}:`, err.message);
          errors.push({ profileId: profile._id, error: 'Failed to generate username' });
          continue;
        }
      }

      // Calculate the correct expected URL
      const expectedUrl = `${frontendUrl}/p/${profile.username}`;

      // Check if QR code already exists
      let qrCode = await QRCode.findOne({
        user: profile.user._id,
        profile: profile._id
      });

      try {
        if (!qrCode) {
          // CREATE NEW
          qrCode = await QRCode.create({
            user: profile.user._id,
            profile: profile._id,
            name: `${profile.displayName || profile.user.name || 'Profile'} QR Code`,
            type: 'profile',
            qrData: expectedUrl,
            isActive: true
          });

          console.log(`✅ Created QR for ${profile.username}`);
          qrCodesCreated++;
        } else {
          // UPDATE EXISTING if URL is wrong
          if (qrCode.qrData !== expectedUrl) {
            console.log(`🔄 Updating QR for ${profile.username}`);
            console.log(`   Old: ${qrCode.qrData}`);
            console.log(`   New: ${expectedUrl}`);

            qrCode.qrData = expectedUrl;
            if (qrCode.type !== 'profile') qrCode.type = 'profile';
            await qrCode.save();
            qrCodesUpdated++;
          } else {
            qrCodesSkipped++;
          }
        }
      } catch (error) {
        console.error(`❌ Error processing QR for profile ${profile._id}:`, error.message);
        errors.push({ profileId: profile._id, error: error.message });
      }
    }

    console.log('-----------------------------------');
    console.log('Summary:');
    console.log(`Created: ${qrCodesCreated}`);
    console.log(`Updated: ${qrCodesUpdated}`);
    console.log(`Skipped: ${qrCodesSkipped}`);
    if (errors.length > 0) console.log('Errors:', errors);

    process.exit();

  } catch (error) {
    console.error('Script error:', error);
    process.exit(1);
  }
};

fixQRCodes();
