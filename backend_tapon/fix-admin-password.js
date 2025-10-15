const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config/config');

const User = require('./models/User');

const fixAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI, config.DB_OPTIONS);
    console.log('Connected to MongoDB');

    // Hash the correct password
    const hashedPassword = await bcrypt.hash('Admin1008', 12);
    console.log('Hashed password:', hashedPassword);

    // Update admin user with correct password
    const result = await User.updateOne(
      { email: 'admin@taponn.com' },
      { 
        $set: { 
          password: hashedPassword,
          role: 'admin',
          permissions: ['admin_all', 'user_manage', 'qr_manage', 'analytics_view', 'system_manage']
        }
      }
    );

    console.log('Update result:', result);

    // Verify the update
    const adminUser = await User.findOne({ email: 'admin@taponn.com' }).select('+password');
    console.log('Admin user after update:', {
      email: adminUser.email,
      role: adminUser.role,
      permissions: adminUser.permissions
    });

    // Test password
    const isMatch = await adminUser.comparePassword('Admin1008');
    console.log('Password match after update:', isMatch);

    process.exit(0);
  } catch (error) {
    console.error('Error fixing admin password:', error);
    process.exit(1);
  }
};

fixAdminPassword();
