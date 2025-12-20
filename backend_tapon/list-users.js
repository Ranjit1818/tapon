const mongoose = require('mongoose');
const config = require('./config/config');

const User = require('./models/User');

const listUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI, config.DB_OPTIONS);
    console.log('Connected to MongoDB');

    // List all users
    const users = await User.find({});
    console.log('All users in database:');
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`, {
        _id: user._id,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      });
    });

    process.exit(0);
  } catch (error) {
    console.error('Error listing users:', error);
    process.exit(1);
  }
};

listUsers();



