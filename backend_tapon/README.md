# TapOnn Backend API

A complete backend API for the TapOnn digital profile platform built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication & Authorization**: JWT-based auth with role-based access control
- **Profile Management**: Digital profile creation and management
- **QR Code Generation**: Dynamic QR code creation and management
- **Order Management**: Complete order processing system
- **Analytics Tracking**: Comprehensive user and profile analytics
- **Admin Dashboard**: Full admin panel with user management
- **File Upload**: Image upload support with Cloudinary integration
- **Security**: Rate limiting, CORS, Helmet, input validation
- **Database**: MongoDB with Mongoose ODM

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB database (local or cloud)
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd letsconnect/backend_tapon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   The backend will work with default configuration, but you can create a `.env` file for customization:
   
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Or create manually with these variables:
   NODE_ENV=development
   PORT=5000
   
   # MongoDB Configuration
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   
   # Frontend URL for CORS
   FRONTEND_URL=http://localhost:5173
   
   # Email Configuration (optional)
   EMAIL_SERVER=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Cloudinary Configuration (optional)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Stripe Configuration (optional)
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
   ```

4. **Database Setup**
   
   The backend will automatically connect to MongoDB. If you don't have a database:
   
   - **Local MongoDB**: Install MongoDB locally
   - **Cloud MongoDB**: Use MongoDB Atlas (free tier available)
   - **Default Connection**: Uses the provided MongoDB Atlas cluster

5. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   
   # Test the API
   npm run test
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-details` - Update user details
- `PUT /api/auth/update-password` - Update password

### Profiles
- `GET /api/profiles` - Get user profiles
- `POST /api/profiles` - Create profile
- `GET /api/profiles/:id` - Get profile by ID
- `PUT /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile

### QR Codes
- `GET /api/qr` - Get user QR codes
- `POST /api/qr` - Create QR code
- `GET /api/qr/:id` - Get QR code by ID
- `PUT /api/qr/:id` - Update QR code
- `DELETE /api/qr/:id` - Delete QR code

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order

### Analytics
- `GET /api/analytics/user` - Get user analytics
- `POST /api/analytics/events` - Record analytics event
- `GET /api/analytics/profile/:id` - Get profile analytics

### Admin (Admin only)
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/profiles` - Get all profiles
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/analytics` - Get system analytics
- `GET /api/admin/qr-codes` - Get all QR codes

### Health Check
- `GET /api/health` - API health status
- `GET /` - API information

## 🔧 Configuration

The backend uses a centralized configuration system in `config/config.js` that provides:

- **Fallback values** for all environment variables
- **Consistent configuration** across all modules
- **Easy customization** without environment file requirements

### Default Configuration

```javascript
{
  NODE_ENV: 'development',
  PORT: 5000,
  MONGO_URI: 'mongodb+srv://...',
  JWT_SECRET: 'fallback-jwt-secret-change-in-production',
  JWT_EXPIRE: '30d',
  FRONTEND_URL: 'http://localhost:5173',
  // ... more defaults
}
```

## 🗄️ Database Models

### User
- Authentication details
- Role-based permissions
- Account status and security

### Profile
- Digital profile information
- Social links and customization
- Design settings

### QRCode
- QR code data and settings
- Analytics tracking
- User associations

### Order
- Order details and status
- Payment information
- User associations

### Analytics
- Event tracking
- User behavior data
- Performance metrics

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin, super_admin, and user roles
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Input Validation**: Express-validator for request validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: HTTP security headers
- **Password Hashing**: Bcrypt with configurable rounds

## 📊 Monitoring & Health

- **Health Check Endpoint**: `/api/health`
- **Database Connection Status**: Real-time MongoDB status
- **Request Logging**: Morgan HTTP request logger
- **Error Handling**: Comprehensive error handling middleware
- **Graceful Shutdown**: Proper cleanup on server termination

## 🚀 Development

### Scripts
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run tests
npm run seed         # Seed database with sample data
npm run setup        # Setup database and initial data
```

### File Structure
```
backend_tapon/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Utility functions
├── uploads/         # File upload directory
├── server.js        # Main server file
└── package.json     # Dependencies
```

## 🌍 Environment Variables

All environment variables are optional and have sensible defaults:

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `5000` | Server port |
| `MONGO_URI` | MongoDB Atlas | Database connection string |
| `JWT_SECRET` | Fallback secret | JWT signing secret |
| `JWT_EXPIRE` | `30d` | JWT expiration time |
| `FRONTEND_URL` | `http://localhost:5173` | Frontend URL for CORS |

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process using port 5000
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

2. **Database Connection Failed**
   - Check MongoDB URI
   - Verify network connectivity
   - Check MongoDB service status

3. **JWT Errors**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate token format

### Debug Mode

Enable debug logging:
```bash
DEBUG=true npm run dev
```

## 📝 API Documentation

For detailed API documentation, visit:
- **Swagger UI**: `http://localhost:5000/api-docs` (if enabled)
- **Health Check**: `http://localhost:5000/api/health`
- **API Info**: `http://localhost:5000/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the configuration options

---

**Note**: This backend is designed to work out-of-the-box with sensible defaults. No environment configuration is required for basic functionality. 