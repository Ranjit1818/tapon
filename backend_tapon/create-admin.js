const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config/config');

const User = require('./models/User');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI, config.DB_OPTIONS);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@taponn.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists, updating role...');
      existingAdmin.role = 'admin';
      existingAdmin.permissions = ['admin_all', 'user_manage', 'qr_manage', 'analytics_view', 'system_manage'];
      await existingAdmin.save();
      console.log('Admin user updated successfully');
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash('Admin1008', 12);
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@taponn.com',
        password: hashedPassword,
        role: 'admin',
        permissions: ['admin_all', 'user_manage', 'qr_manage', 'analytics_view', 'system_manage'],
        status: 'active',
        isEmailVerified: true
      });

      await adminUser.save();
      console.log('Admin user created successfully');
    }

    // Force update the admin user role
    const adminUser = await User.findOne({ email: 'admin@taponn.com' });
    if (adminUser) {
      adminUser.role = 'admin';
      await adminUser.save();
      console.log('Admin user role updated to admin');
    }

    // Also update the existing user to admin role for testing
    const testUser = await User.findOne({ email: 'ranjitkulkarni6@gmail.com' });
    if (testUser) {
      testUser.role = 'admin';
      testUser.permissions = ['admin_all', 'user_manage', 'qr_manage', 'analytics_view', 'system_manage'];
      await testUser.save();
      console.log('Test user updated to admin role');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
