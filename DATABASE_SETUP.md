# 🗄️ TapOnn Local Database Setup Guide

This guide will help you set up MongoDB locally for the TapOnn application.

## 📋 Prerequisites

- Node.js installed
- Windows PowerShell or Command Prompt

## 🚀 Step 1: Install MongoDB Locally

### Option A: MongoDB Community Edition (Recommended)

1. **Download MongoDB**:
   - Go to https://www.mongodb.com/try/download/community
   - Select Windows
   - Download the .msi installer

2. **Install MongoDB**:
   - Run the downloaded .msi file
   - Choose "Complete" setup
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**:
   ```powershell
   mongod --version
   ```

### Option B: Using Chocolatey (Alternative)

```powershell
# Install Chocolatey (if not already installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install MongoDB
choco install mongodb
```

## 🔧 Step 2: Start MongoDB Service

### Windows Service (if installed as service)
MongoDB should start automatically. If not:

```powershell
# Start MongoDB service
net start MongoDB

# Check if running
sc query MongoDB
```

### Manual Start (if needed)
```powershell
# Create data directory
mkdir C:\data\db

# Start MongoDB manually
mongod --dbpath C:\data\db
```

## ⚙️ Step 3: Create Environment File

Create a `.env` file in the `backend` directory with the following content:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration (Local)
MONGO_URI=mongodb://localhost:27017/taponn

# JWT Configuration
JWT_SECRET=taponn-super-secret-jwt-key-for-development-12345
JWT_EXPIRE=30d

# Cloudinary Configuration (Optional - can leave as is for local dev)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Optional - can leave as is for local dev)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@taponn.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001
```

## 🎯 Step 4: Test Database Connection

1. **Start the backend server**:
   ```powershell
   cd backend
   npm run dev
   ```

2. **You should see**:
   ```
   Server running on port 5000
   MongoDB connected
   ```

## 📊 Step 5: Access Database (Optional)

### Using MongoDB Compass (GUI)
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. You'll see the `taponn` database after the first API call

### Using MongoDB Shell
```powershell
# Connect to MongoDB
mongosh

# Switch to taponn database
use taponn

# Show collections
show collections

# View users (after creating some)
db.users.find()

# View profiles
db.profiles.find()
```

## 🔍 Step 6: Verify API Endpoints

Test the API to ensure database is working:

### Test Registration
```powershell
# Using curl (if available)
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Check Database
After registration, check in MongoDB Compass or shell:
```javascript
// In mongosh
use taponn
db.users.find().pretty()
```

## 🛠️ Troubleshooting

### Common Issues:

1. **MongoDB won't start**:
   ```powershell
   # Check if port 27017 is in use
   netstat -an | findstr "27017"
   
   # If occupied, kill the process or use different port
   ```

2. **Connection Error**:
   - Ensure MongoDB service is running
   - Check the MONGO_URI in .env file
   - Verify firewall isn't blocking port 27017

3. **Permission Errors**:
   ```powershell
   # Run PowerShell as Administrator
   # Or create data directory with proper permissions
   ```

## 📱 Step 7: Test with Frontend

1. **Start both servers**:
   ```powershell
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend  
   cd ..
   npm run dev
   ```

2. **Test the app**:
   - Go to http://localhost:3001
   - Register a new account
   - Check MongoDB for the new user data

## 🎉 Success!

Your local MongoDB setup is complete! You now have:

- ✅ MongoDB running locally
- ✅ TapOnn backend connected to local database
- ✅ User registration/login working
- ✅ Profile and lead data being stored locally

## 📚 Useful MongoDB Commands

```javascript
// View all databases
show dbs

// Use taponn database
use taponn

// View all collections
show collections

// Count documents
db.users.countDocuments()
db.profiles.countDocuments()

// Find specific user
db.users.findOne({email: "admin@taponn.com"})

// Update user role to admin
db.users.updateOne(
  {email: "admin@taponn.com"}, 
  {$set: {role: "admin"}}
)

// Delete all test data (be careful!)
db.users.deleteMany({})
db.profiles.deleteMany({})
```

## 🔄 Alternative: MongoDB Atlas (Cloud)

If you prefer cloud database:

1. Go to https://www.mongodb.com/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update MONGO_URI in .env:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taponn?retryWrites=true&w=majority
   ``` 