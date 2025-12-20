const mongoose = require('mongoose');
const config = require('./config/config');

const User = require('./models/User');

const checkJWTUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI, config.DB_OPTIONS);
    console.log('Connected to MongoDB');

    // The JWT ID from the token
    const jwtId = '689f528702f85acf3b948af0';
    console.log('Looking for user with JWT ID:', jwtId);

    // Find user by this ID
    const user = await User.findById(jwtId);
    if (user) {
      console.log('User found by JWT ID:', {
        _id: user._id,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      });
    } else {
      console.log('No user found with JWT ID');
    }

    // Check if this ID exists in any form
    const userByStringId = await User.findOne({ _id: jwtId });
    if (userByStringId) {
      console.log('User found by string ID:', {
        _id: userByStringId._id,
        email: userByStringId.email,
        role: userByStringId.role,
        permissions: userByStringId.permissions
      });
    } else {
      console.log('No user found with string ID');
    }

    // List all user IDs to see what's available
    const allUsers = await User.find({}, '_id email role');
    console.log('All user IDs in database:');
    allUsers.forEach((user, index) => {
      console.log(`User ${index + 1}:`, {
        _id: user._id.toString(),
        email: user.email,
        role: user.role
      });
    });

    process.exit(0);
  } catch (error) {
    console.error('Error checking JWT user:', error);
    process.exit(1);
  }
};

checkJWTUser();



