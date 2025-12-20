const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log("🌍 Connecting to MongoDB...");
    }
    
    await mongoose.connect(config.MONGO_URI, config.DB_OPTIONS);
    
    if (process.env.NODE_ENV === 'development') {
      console.log("✅ MongoDB connected successfully");
      console.log(`📍 Database: ${mongoose.connection.name}`);
      console.log(`🌐 Host: ${mongoose.connection.host}`);
      console.log(`🔌 Port: ${mongoose.connection.port}`);
    }
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      if (process.env.NODE_ENV === 'development') {
        console.error('Error details:', err);
      }
    });

    mongoose.connection.on('disconnected', () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ MongoDB disconnected');
      }
    });

    mongoose.connection.on('reconnected', () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 MongoDB reconnected');
      }
    });

  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    if (process.env.NODE_ENV === 'development') {
      console.error("🔍 Error details:", err);
    }
    
    // Don't exit immediately, give it another try
    if (process.env.NODE_ENV === 'development') {
      console.log("🔄 Retrying connection in 5 seconds...");
    }
    setTimeout(() => {
      connectDB();
    }, 5000);
  }
};

module.exports = connectDB;
              