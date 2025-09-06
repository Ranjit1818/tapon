# 🗄️ Database Setup Guide for TapOnn Backend

This guide covers setting up databases for the TapOnn backend. You can choose between **MongoDB** (NoSQL) or **SQL databases** (MySQL/PostgreSQL).

## 📋 Quick Start

### Option 1: MongoDB (Recommended for current setup)

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with MongoDB configuration
DB_TYPE=mongodb
MONGO_URI=mongodb://localhost:27017/taponn

# 3. Start MongoDB service
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# 4. Start the server
npm run dev
```

### Option 2: MySQL

```bash
# 1. Install MySQL
# Windows: Download from https://dev.mysql.com/downloads/
# macOS: brew install mysql
# Linux: sudo apt install mysql-server

# 2. Start MySQL service
# Windows: net start MySQL80
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql

# 3. Create .env file with MySQL configuration
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=taponn
DB_USER=root
DB_PASSWORD=your_password

# 4. Setup database and tables
npm run setup-mysql

# 5. Start the server
npm run dev
```

### Option 3: PostgreSQL

```bash
# 1. Install PostgreSQL
# Windows: Download from https://www.postgresql.org/download/
# macOS: brew install postgresql
# Linux: sudo apt install postgresql postgresql-contrib

# 2. Start PostgreSQL service
# Windows: net start postgresql-x64-15
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql

# 3. Create .env file with PostgreSQL configuration
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taponn
DB_USER=postgres
DB_PASSWORD=your_password

# 4. Setup database and tables
npm run setup-postgresql

# 5. Start the server
npm run dev
```

## 🔧 Detailed Setup Instructions

### MongoDB Setup

#### 1. Install MongoDB

**Windows:**
- Download MongoDB Community Server from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- Run the installer and follow the setup wizard
- MongoDB will be installed as a Windows service

**macOS:**
```bash
brew install mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install mongodb
```

#### 2. Start MongoDB Service

**Windows:**
```bash
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### 3. Verify Installation
```bash
mongosh
# or
mongo
```

#### 4. Environment Configuration
Create a `.env` file in the `backend_tapon` directory:

```env
DB_TYPE=mongodb
MONGO_URI=mongodb://localhost:27017/taponn
```

### MySQL Setup

#### 1. Install MySQL

**Windows:**
- Download MySQL Installer from [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
- Run the installer and choose "Developer Default"
- Set root password during installation

**macOS:**
```bash
brew install mysql
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

#### 2. Start MySQL Service

**Windows:**
```bash
net start MySQL80
```

**macOS:**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### 3. Create Database User (Optional)
```sql
CREATE USER 'taponn_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON taponn.* TO 'taponn_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 4. Environment Configuration
```env
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=taponn
DB_USER=root
DB_PASSWORD=your_password
```

#### 5. Setup Database
```bash
npm run setup-mysql
```

### PostgreSQL Setup

#### 1. Install PostgreSQL

**Windows:**
- Download PostgreSQL from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
- Run the installer and set password for postgres user

**macOS:**
```bash
brew install postgresql
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

#### 2. Start PostgreSQL Service

**Windows:**
```bash
net start postgresql-x64-15
```

**macOS:**
```bash
brew services start postgresql
```

**Linux:**
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 3. Create Database User (Optional)
```bash
sudo -u postgres psql
CREATE USER taponn_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE taponn TO taponn_user;
\q
```

#### 4. Environment Configuration
```env
DB_TYPE=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taponn
DB_USER=postgres
DB_PASSWORD=your_password
```

#### 5. Setup Database
```bash
npm run setup-postgresql
```

## 🗂️ Database Schema

### MongoDB Collections

- **users** - User accounts and authentication
- **profiles** - Digital profiles
- **qrcodes** - QR code generation and tracking
- **orders** - NFC/Review card orders
- **analytics** - Event tracking and analytics

### SQL Tables

#### Users Table
```sql
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
  permissions JSON DEFAULT '[]',
  isLocked BOOLEAN DEFAULT FALSE,
  loginAttempts INT DEFAULT 0,
  lockUntil DATETIME NULL,
  lastLogin DATETIME NULL,
  resetPasswordToken VARCHAR(255) NULL,
  resetPasswordExpire DATETIME NULL,
  emailVerified BOOLEAN DEFAULT FALSE,
  emailVerificationToken VARCHAR(255) NULL,
  emailVerificationExpire DATETIME NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Profiles Table
```sql
CREATE TABLE Profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  displayName VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE,
  bio TEXT,
  avatar VARCHAR(255),
  theme VARCHAR(20) DEFAULT 'default',
  isPublic BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);
```

#### QR Codes Table
```sql
CREATE TABLE QRCodes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  profileId INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  qrData TEXT NOT NULL,
  qrImage VARCHAR(255),
  logo VARCHAR(255),
  scanCount INT DEFAULT 0,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (profileId) REFERENCES Profiles(id) ON DELETE CASCADE
);
```

#### Orders Table
```sql
CREATE TABLE Orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  orderNumber VARCHAR(50) UNIQUE NOT NULL,
  productType ENUM('nfc_card', 'review_card') NOT NULL,
  quantity INT NOT NULL,
  totalAmount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shippingAddress JSON,
  paymentStatus ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  stripePaymentIntentId VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);
```

#### Analytics Table
```sql
CREATE TABLE Analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NULL,
  profileId INT NULL,
  qrCodeId INT NULL,
  eventType VARCHAR(50) NOT NULL,
  eventCategory VARCHAR(50),
  eventAction VARCHAR(50),
  metadata JSON,
  ipAddress VARCHAR(45),
  userAgent TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE SET NULL,
  FOREIGN KEY (profileId) REFERENCES Profiles(id) ON DELETE SET NULL,
  FOREIGN KEY (qrCodeId) REFERENCES QRCodes(id) ON DELETE SET NULL
);
```

## 🔍 Troubleshooting

### MongoDB Issues

**Connection Refused:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

**Authentication Failed:**
```bash
# Connect to MongoDB and create user
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})
```

### MySQL Issues

**Access Denied:**
```bash
# Reset root password
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
FLUSH PRIVILEGES;
```

**Connection Refused:**
```bash
# Check MySQL status
sudo systemctl status mysql

# Start MySQL
sudo systemctl start mysql
```

### PostgreSQL Issues

**Connection Refused:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Start PostgreSQL
sudo systemctl start postgresql
```

**Authentication Failed:**
```bash
# Edit pg_hba.conf for local connections
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Add this line for local connections:
local   all             all                                     md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

## 🚀 Production Deployment

### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a cluster
3. Get connection string
4. Update `MONGO_URI` in environment variables

### AWS RDS (MySQL/PostgreSQL)
1. Create RDS instance in AWS Console
2. Configure security groups
3. Get connection details
4. Update environment variables

### Environment Variables for Production
```env
NODE_ENV=production
DB_TYPE=mysql  # or postgresql or mongodb
DB_HOST=your-db-host.com
DB_PORT=3306
DB_NAME=taponn
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
```

## 📊 Database Management

### Backup Commands

**MongoDB:**
```bash
mongodump --db taponn --out /backup/path
```

**MySQL:**
```bash
mysqldump -u root -p taponn > backup.sql
```

**PostgreSQL:**
```bash
pg_dump -U postgres taponn > backup.sql
```

### Restore Commands

**MongoDB:**
```bash
mongorestore --db taponn /backup/path/taponn
```

**MySQL:**
```bash
mysql -u root -p taponn < backup.sql
```

**PostgreSQL:**
```bash
psql -U postgres taponn < backup.sql
```

## 🎯 Next Steps

After setting up your database:

1. **Test the connection** by starting the server
2. **Create sample data** using the seed script
3. **Test API endpoints** to ensure everything works
4. **Set up monitoring** for database performance
5. **Configure backups** for data safety
6. **Set up indexes** for better performance

For more information, check the main [README.md](README.md) file. 