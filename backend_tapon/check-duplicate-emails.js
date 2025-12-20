const mongoose = require('mongoose');
const config = require('./config/config');

const User = require('./models/User');

const checkDuplicateEmails = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI, config.DB_OPTIONS);
    console.log('Connected to MongoDB');

    // Check for duplicate emails
    const duplicateEmails = await User.aggregate([
      {
        $group: {
          _id: '$email',
          count: { $sum: 1 },
          users: { $push: { _id: '$_id', role: '$role', permissions: '$permissions' } }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]);

    console.log('Duplicate emails:', duplicateEmails);

    // Check specifically for admin@taponn.com
    const adminUsers = await User.find({ email: 'admin@taponn.com' });
    console.log('Users with admin@taponn.com email:', adminUsers.length);
    adminUsers.forEach((user, index) => {
      console.log(`Admin user ${index + 1}:`, {
        _id: user._id,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      });
    });

    process.exit(0);
  } catch (error) {
    console.error('Error checking duplicate emails:', error);
    process.exit(1);
  }
};

checkDuplicateEmails();



