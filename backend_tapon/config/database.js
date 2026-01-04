const mongoose = require('mongoose');
const config = require('./config');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering to fail fast if not connected
      ...config.DB_OPTIONS
    };

    cached.promise = mongoose.connect(config.MONGO_URI, opts).then((mongoose) => {
      console.log('✅ New MongoDB connection established');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

// Handle connection events (optional, but good for debugging)
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

module.exports = connectDB;
