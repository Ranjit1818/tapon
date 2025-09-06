#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  process.exit(0);
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
  console.log('✅ .env file created successfully');
  console.log('⚠️  Please update the .env file with your actual configuration values');
} catch (error) {
  console.error('❌ Failed to create .env file:', error.message);
  process.exit(1);
} 