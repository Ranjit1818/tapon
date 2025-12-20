const mongoose = require('mongoose');
const config = require('./config/config');

const User = require('./models/User');

const checkUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI, config.DB_OPTIONS);
    console.log('Connected to MongoDB');

    // Check admin user
    const adminUser = await User.findOne({ email: 'admin@taponn.com' });
    console.log('Admin user in database:', {
      email: adminUser.email,
      role: adminUser.role,
      permissions: adminUser.permissions,
      _id: adminUser._id
    });

    // Check if there are multiple users with same email
    const allAdminUsers = await User.find({ email: 'admin@taponn.com' });
    console.log('All users with admin email:', allAdminUsers.length);
    allAdminUsers.forEach((user, index) => {
      console.log(`User ${index + 1}:`, {
        _id: user._id,
        role: user.role,
        permissions: user.permissions
      });
    });

    process.exit(0);
  } catch (error) {
    console.error('Error checking user:', error);
    process.exit(1);
  }
};

checkUser();



