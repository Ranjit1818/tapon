const mongoose = require('mongoose');
const config = require('./config/config');

const User = require('./models/User');

const checkDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGO_URI, config.DB_OPTIONS);
    console.log('Connected to MongoDB');
    console.log('Database name:', mongoose.connection.name);
    console.log('Database host:', mongoose.connection.host);
    console.log('Database port:', mongoose.connection.port);

    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    // Check if there are users in a different collection
    const userCollections = ['users', 'Users', 'user'];
    for (const collectionName of userCollections) {
      try {
        const collection = mongoose.connection.db.collection(collectionName);
        const count = await collection.countDocuments();
        console.log(`Collection ${collectionName}: ${count} documents`);
        
        if (count > 0) {
          const users = await collection.find({}).limit(3).toArray();
          console.log(`Sample users from ${collectionName}:`, users.map(u => ({
            _id: u._id,
            email: u.email,
            role: u.role
          })));
        }
      } catch (error) {
        console.log(`Collection ${collectionName} does not exist`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
};

checkDatabase();



