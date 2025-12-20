const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('./config/config');

const User = require('./models/User');

const testLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI, config.DB_OPTIONS);
    console.log('Connected to MongoDB');

    // Test the login process
    const email = 'admin@taponn.com';
    const password = 'Admin1008';

    // Check for user (include password for comparison)
    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', {
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      _id: user._id
    });

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);

    if (isMatch) {
      // Generate token
      const token = user.generateAuthToken();
      console.log('Generated token:', token);
      
      // Decode token to see what's inside
      const jwt = require('jsonwebtoken');
      const decoded = jwt.decode(token);
      console.log('Decoded token:', decoded);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error testing login:', error);
    process.exit(1);
  }
};

testLogin();



