#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🚀 TapOnn Backend - MongoDB Setup');
console.log('==================================\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  step: (msg) => console.log(`\n${colors.cyan}📋 ${msg}${colors.reset}`)
};

// Check if Node.js is installed
const checkNodeVersion = () => {
  try {
    const version = process.version;
    const majorVersion = parseInt(version.slice(1).split('.')[0]);
    
    if (majorVersion < 16) {
      log.error(`Node.js version ${version} is not supported. Please install Node.js 16 or higher.`);
      process.exit(1);
    }
    
    log.success(`Node.js ${version} detected`);
    return true;
  } catch (error) {
    log.error('Node.js is not installed. Please install Node.js 16 or higher.');
    process.exit(1);
  }
};

// Install dependencies
const installDependencies = () => {
  log.step('Installing dependencies...');
  
  try {
    log.info('Installing npm packages...');
    execSync('npm install', { stdio: 'inherit' });
    log.success('Dependencies installed successfully');
  } catch (error) {
    log.error('Failed to install dependencies');
    log.error(error.message);
    process.exit(1);
  }
};

// Create .env file if it doesn't exist
const createEnvFile = () => {
  log.step('Setting up environment configuration...');
  
  const envPath = path.join(__dirname, '..', '.env');
  
  if (fs.existsSync(envPath)) {
    log.info('.env file already exists');
    return;
  }
  
  const envTemplate = `# Environment
NODE_ENV=development

# Server Configuration
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/taponn

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@taponn.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
`;

  try {
    fs.writeFileSync(envPath, envTemplate);
    log.success('.env file created successfully');
    log.warning('Please update the .env file with your actual configuration values');
  } catch (error) {
    log.error('Failed to create .env file');
    log.error(error.message);
  }
};

// Setup MongoDB
const setupMongoDB = () => {
  log.step('Setting up MongoDB...');
  
  try {
    log.info('Setting up MongoDB...');
    execSync('npm run setup-mongodb', { stdio: 'inherit' });
    log.success('MongoDB setup completed');
  } catch (error) {
    log.error('MongoDB setup failed');
    log.error(error.message);
    process.exit(1);
  }
};

// Test database connection
const testDatabaseConnection = () => {
  log.step('Testing database connection...');
  
  try {
    // This will be handled by the server startup
    log.info('Database connection test will be performed when starting the server');
    log.success('Setup completed successfully!');
  } catch (error) {
    log.error('Database connection test failed');
    log.error(error.message);
  }
};

// Create uploads directory
const createUploadsDirectory = () => {
  log.step('Creating uploads directory...');
  
  const uploadsPath = path.join(__dirname, '..', 'uploads');
  
  if (!fs.existsSync(uploadsPath)) {
    try {
      fs.mkdirSync(uploadsPath, { recursive: true });
      log.success('Uploads directory created');
    } catch (error) {
      log.error('Failed to create uploads directory');
      log.error(error.message);
    }
  } else {
    log.info('Uploads directory already exists');
  }
};

// Display next steps
const displayNextSteps = () => {
  log.step('Next Steps:');
  console.log(`
${colors.cyan}1.${colors.reset} Update the .env file with your actual configuration values
${colors.cyan}2.${colors.reset} Start MongoDB service:
   ${colors.yellow}• Windows:${colors.reset} net start MongoDB
   ${colors.yellow}• macOS:${colors.reset} brew services start mongodb-community
   ${colors.yellow}• Linux:${colors.reset} sudo systemctl start mongod

${colors.cyan}3.${colors.reset} Start the development server:
   ${colors.yellow}npm run dev${colors.reset}

${colors.cyan}4.${colors.reset} Test the API:
   ${colors.yellow}http://localhost:5000/api/health${colors.reset}

${colors.cyan}5.${colors.reset} View API documentation:
   ${colors.yellow}http://localhost:5000${colors.reset}

${colors.cyan}6.${colors.reset} Start the frontend (in a separate terminal):
   ${colors.yellow}cd ../.. && npm run dev${colors.reset}
`);
};

// Main execution
const main = async () => {
  try {
    log.step('Starting TapOnn Backend Setup...');
    
    // Check Node.js version
    checkNodeVersion();
    
    // Install dependencies
    installDependencies();
    
    // Create .env file
    createEnvFile();
    
    // Create uploads directory
    createUploadsDirectory();
    
    // Setup MongoDB
    setupMongoDB();
    
    // Test database connection
    testDatabaseConnection();
    
    // Display next steps
    displayNextSteps();
    
    log.success('🎉 TapOnn Backend setup completed successfully!');
    
  } catch (error) {
    log.error('Setup failed');
    log.error(error.message);
    process.exit(1);
  }
};

// Run the setup
if (require.main === module) {
  main();
}

module.exports = {
  checkNodeVersion,
  installDependencies,
  createEnvFile,
  setupMongoDB,
  testDatabaseConnection,
  createUploadsDirectory,
  displayNextSteps
}; 