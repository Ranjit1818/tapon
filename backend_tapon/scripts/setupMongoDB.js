#!/usr/bin/env node

require('dotenv').config();

console.log('🚀 TapOnn MongoDB Setup');
console.log('========================\n');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  step: (msg) => console.log(`\n${colors.cyan}📋 ${msg}${colors.reset}`)
};

const setupMongoDB = async () => {
  log.step('Setting up MongoDB for TapOnn...');
  
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGO_URI) {
      log.error('MONGO_URI is not set in environment variables');
      log.info('Please add MONGO_URI to your .env file');
      log.info('Example: MONGO_URI=mongodb://localhost:27017/taponn');
      process.exit(1);
    }

    log.info('MongoDB URI configured: ' + process.env.MONGO_URI.replace(/\/\/.*@/, '//***:***@'));
    
    // Test MongoDB connection
    const mongoose = require('mongoose');
    
    log.info('Testing MongoDB connection...');
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    log.success('MongoDB connection successful!');
    
    // Create collections (MongoDB creates them automatically when first document is inserted)
    log.info('Setting up collections...');
    
    const db = mongoose.connection.db;
    
    // List existing collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    log.info('Existing collections: ' + collectionNames.join(', ') || 'None');
    
    // Close connection
    await mongoose.connection.close();
    log.success('MongoDB setup completed successfully!');
    
    log.step('Next Steps:');
    console.log(`
${colors.cyan}1.${colors.reset} Start MongoDB service:
   ${colors.yellow}• Windows:${colors.reset} net start MongoDB
   ${colors.yellow}• macOS:${colors.reset} brew services start mongodb-community
   ${colors.yellow}• Linux:${colors.reset} sudo systemctl start mongod

${colors.cyan}2.${colors.reset} Start the backend server:
   ${colors.yellow}npm run dev${colors.reset}

${colors.cyan}3.${colors.reset} Test the API:
   ${colors.yellow}http://localhost:5000/api/health${colors.reset}

${colors.cyan}4.${colors.reset} Start the frontend:
   ${colors.yellow}cd ../.. && npm run dev${colors.reset}
`);
    
  } catch (error) {
    log.error('MongoDB setup failed:');
    log.error(error.message);
    
    if (error.name === 'MongoNetworkError') {
      log.warning('Make sure MongoDB is running on your system');
      log.info('To start MongoDB:');
      log.info('• Windows: net start MongoDB');
      log.info('• macOS: brew services start mongodb-community');
      log.info('• Linux: sudo systemctl start mongod');
    }
    
    process.exit(1);
  }
};

// Run the setup
if (require.main === module) {
  setupMongoDB();
}

module.exports = { setupMongoDB }; 