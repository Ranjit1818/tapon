const mongoose = require('mongoose');
const config = require('./config/config');

const checkDatabaseSimple = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.MONGO_URI, config.DB_OPTIONS);
    console.log('✅ Connected to MongoDB');
    
    // Check specific collection directly
    const collectionName = 'users';
    const collection = mongoose.connection.db.collection(collectionName);
    const count = await collection.countDocuments();
    console.log(`Collection '${collectionName}': ${count} documents`);
    
    if (count > 0) {
      const user = await collection.findOne({});
      console.log('Sample user:', JSON.stringify(user, null, 2));
    } else {
      console.log('⚠️  No users found. Database might be empty.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkDatabaseSimple();
