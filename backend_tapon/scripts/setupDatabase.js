const mysql = require('mysql2/promise');
const { Client } = require('pg');
require('dotenv').config();

const setupDatabase = async () => {
  const dbType = process.env.DB_TYPE || 'mongodb';
  
  console.log(`Setting up ${dbType.toUpperCase()} database...`);
  
  if (dbType === 'mysql') {
    await setupMySQL();
  } else if (dbType === 'postgresql') {
    await setupPostgreSQL();
  } else if (dbType === 'mongodb') {
    console.log('MongoDB setup: Make sure MongoDB is running on your system');
    console.log('For local MongoDB: mongodb://localhost:27017');
    console.log('For MongoDB Atlas: Use your connection string in MONGO_URI');
  } else {
    console.error('Invalid DB_TYPE. Use: mongodb, mysql, or postgresql');
    process.exit(1);
  }
};

const setupMySQL = async () => {
  try {
    // Connect to MySQL server (without specifying database)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'taponn';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Database '${dbName}' created or already exists`);

    // Use the database
    await connection.execute(`USE ${dbName}`);

    // Create tables
    await createMySQLTables(connection);
    
    await connection.end();
    console.log('MySQL database setup completed successfully!');
    
  } catch (error) {
    console.error('MySQL setup error:', error.message);
    process.exit(1);
  }
};

const createMySQLTables = async (connection) => {
  // Users table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS Users (
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
    )
  `);

  // Profiles table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS Profiles (
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
    )
  `);

  // QR Codes table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS QRCodes (
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
    )
  `);

  // Orders table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS Orders (
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
    )
  `);

  // Analytics table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS Analytics (
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
    )
  `);

  console.log('MySQL tables created successfully');
};

const setupPostgreSQL = async () => {
  try {
    // Connect to PostgreSQL server
    const client = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: 'postgres' // Connect to default database first
    });

    await client.connect();
    console.log('Connected to PostgreSQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'taponn';
    try {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database '${dbName}' created`);
    } catch (error) {
      if (error.code === '42P04') {
        console.log(`Database '${dbName}' already exists`);
      } else {
        throw error;
      }
    }

    await client.end();

    // Connect to the new database
    const dbClient = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
      database: dbName
    });

    await dbClient.connect();

    // Create tables
    await createPostgreSQLTables(dbClient);
    
    await dbClient.end();
    console.log('PostgreSQL database setup completed successfully!');
    
  } catch (error) {
    console.error('PostgreSQL setup error:', error.message);
    process.exit(1);
  }
};

const createPostgreSQLTables = async (client) => {
  // Users table
  await client.query(`
    CREATE TABLE IF NOT EXISTS "Users" (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
      permissions JSONB DEFAULT '[]',
      "isLocked" BOOLEAN DEFAULT FALSE,
      "loginAttempts" INTEGER DEFAULT 0,
      "lockUntil" TIMESTAMP NULL,
      "lastLogin" TIMESTAMP NULL,
      "resetPasswordToken" VARCHAR(255) NULL,
      "resetPasswordExpire" TIMESTAMP NULL,
      "emailVerified" BOOLEAN DEFAULT FALSE,
      "emailVerificationToken" VARCHAR(255) NULL,
      "emailVerificationExpire" TIMESTAMP NULL,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Profiles table
  await client.query(`
    CREATE TABLE IF NOT EXISTS "Profiles" (
      id SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL,
      "displayName" VARCHAR(100) NOT NULL,
      username VARCHAR(50) UNIQUE,
      bio TEXT,
      avatar VARCHAR(255),
      theme VARCHAR(20) DEFAULT 'default',
      "isPublic" BOOLEAN DEFAULT TRUE,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE CASCADE
    )
  `);

  // QR Codes table
  await client.query(`
    CREATE TABLE IF NOT EXISTS "QRCodes" (
      id SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL,
      "profileId" INTEGER NOT NULL,
      name VARCHAR(100) NOT NULL,
      "qrData" TEXT NOT NULL,
      "qrImage" VARCHAR(255),
      logo VARCHAR(255),
      "scanCount" INTEGER DEFAULT 0,
      "isActive" BOOLEAN DEFAULT TRUE,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE CASCADE,
      FOREIGN KEY ("profileId") REFERENCES "Profiles"(id) ON DELETE CASCADE
    )
  `);

  // Orders table
  await client.query(`
    CREATE TABLE IF NOT EXISTS "Orders" (
      id SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL,
      "orderNumber" VARCHAR(50) UNIQUE NOT NULL,
      "productType" VARCHAR(20) NOT NULL CHECK ("productType" IN ('nfc_card', 'review_card')),
      quantity INTEGER NOT NULL,
      "totalAmount" DECIMAL(10,2) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
      "shippingAddress" JSONB,
      "paymentStatus" VARCHAR(20) DEFAULT 'pending' CHECK ("paymentStatus" IN ('pending', 'paid', 'failed', 'refunded')),
      "stripePaymentIntentId" VARCHAR(255),
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE CASCADE
    )
  `);

  // Analytics table
  await client.query(`
    CREATE TABLE IF NOT EXISTS "Analytics" (
      id SERIAL PRIMARY KEY,
      "userId" INTEGER NULL,
      "profileId" INTEGER NULL,
      "qrCodeId" INTEGER NULL,
      "eventType" VARCHAR(50) NOT NULL,
      "eventCategory" VARCHAR(50),
      "eventAction" VARCHAR(50),
      metadata JSONB,
      "ipAddress" VARCHAR(45),
      "userAgent" TEXT,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("userId") REFERENCES "Users"(id) ON DELETE SET NULL,
      FOREIGN KEY ("profileId") REFERENCES "Profiles"(id) ON DELETE SET NULL,
      FOREIGN KEY ("qrCodeId") REFERENCES "QRCodes"(id) ON DELETE SET NULL
    )
  `);

  console.log('PostgreSQL tables created successfully');
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('Database setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase }; 