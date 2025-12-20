const mongoose = require('mongoose');
const config = require('./config/config');

const User = require('./models/User');

const checkJWTId = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI, config.DB_OPTIONS);
    console.log('Connected to MongoDB');

    // The JWT ID from the token
    const jwtId = '689f528702f85acf3b948af0';
    console.log('JWT ID:', jwtId);

    // Find user by this ID
    const user = await User.findById(jwtId);
    console.log('User found by JWT ID:', {
      _id: user._id,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    });

    // Also check by email
    const userByEmail = await User.findOne({ email: 'admin@taponn.com' });
    console.log('User found by email:', {
      _id: userByEmail._id,
      email: userByEmail.email,
      role: userByEmail.role,
      permissions: userByEmail.permissions
    });

    process.exit(0);
  } catch (error) {
    console.error('Error checking JWT ID:', error);
    process.exit(1);
  }
};

checkJWTId();



