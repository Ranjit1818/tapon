const mongoose = require('mongoose');
const config = require('./config/config');

const User = require('./models/User');

const updateAdminRole = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI, config.DB_OPTIONS);
    console.log('Connected to MongoDB');

    // Update admin user role
    const result = await User.updateOne(
      { email: 'admin@taponn.com' },
      { 
        $set: { 
          role: 'admin',
          permissions: ['admin_all', 'user_manage', 'qr_manage', 'analytics_view', 'system_manage']
        }
      }
    );

    console.log('Update result:', result);

    // Verify the update
    const adminUser = await User.findOne({ email: 'admin@taponn.com' });
    console.log('Admin user after update:', {
      email: adminUser.email,
      role: adminUser.role,
      permissions: adminUser.permissions
    });

    process.exit(0);
  } catch (error) {
    console.error('Error updating admin role:', error);
    process.exit(1);
  }
};

updateAdminRole();

