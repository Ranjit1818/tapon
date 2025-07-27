# TapOnn Backend API

A complete, secure, and scalable backend for TapOnn - the smart digital profile and lead management platform.

## 🚀 Features

- **Authentication System**: JWT-based auth with bcrypt password hashing
- **Profile Management**: Create, update, delete digital profiles with QR codes
- **Lead Management**: Capture and manage leads with scoring and analytics
- **Image Upload**: Cloudinary integration for profile and cover images
- **QR Code Generation**: Dynamic QR codes pointing to profile pages
- **Admin Dashboard**: Role-based access control for administrators
- **Security**: Rate limiting, input validation, CORS, Helmet
- **Analytics**: Lead tracking, profile views, interaction history

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer + Cloudinary
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **QR Codes**: qrcode npm package

## 📁 Project Structure

```
/backend
├── controllers/          # Route handlers
│   ├── authController.js
│   ├── profileController.js
│   ├── leadController.js
│   └── uploadController.js
├── models/              # Database models
│   ├── User.js
│   ├── Profile.js
│   └── Lead.js
├── routes/              # API routes
│   ├── auth.js
│   ├── profiles.js
│   ├── leads.js
│   └── upload.js
├── middlewares/         # Custom middleware
│   ├── auth.js
│   └── upload.js
├── utils/               # Utility functions
│   └── cloudinary.js
├── config/              # Configuration files
├── uploads/             # Local file uploads (dev)
├── server.js            # Main server file
├── package.json
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/taponn
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/taponn?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=30d

# Cloudinary Configuration (for image uploads and QR codes)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (for password reset and notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@taponn.com

# Frontend URL (for CORS and QR code generation)
FRONTEND_URL=http://localhost:3000
```

### 3. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "company": "Tech Corp",
  "position": "Developer"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```
PUT /api/auth/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "phone": "+1234567890",
  "company": "New Tech Corp"
}
```

### Profile Management Endpoints

#### Create Profile
```
POST /api/profiles
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "johndoe",
  "name": "John Doe",
  "title": "Senior Developer",
  "company": "Tech Corp",
  "email": "john@example.com",
  "phone": "+1234567890",
  "location": "New York, NY",
  "bio": "Passionate developer with 5+ years experience",
  "website": "https://johndoe.com",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/johndoe",
    "twitter": "https://twitter.com/johndoe"
  }
}
```

#### Get Public Profile
```
GET /api/profiles/:username
```

#### Get My Profile
```
GET /api/profiles/me
Authorization: Bearer <token>
```

#### Update Profile
```
PUT /api/profiles/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "title": "Lead Developer",
  "bio": "Updated bio"
}
```

#### Regenerate QR Code
```
POST /api/profiles/:id/regenerate-qr
Authorization: Bearer <token>
```

### Lead Management Endpoints

#### Capture Lead (Public)
```
POST /api/leads/capture
Content-Type: application/json

{
  "profileId": "profile_id_here",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "company": "Client Corp",
  "position": "Manager",
  "source": "QR Code",
  "notes": "Interested in our services"
}
```

#### Get My Leads
```
GET /api/leads?page=1&limit=10&status=new&source=QR Code&search=john
Authorization: Bearer <token>
```

#### Update Lead
```
PUT /api/leads/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "contacted",
  "notes": "Called client, interested in demo",
  "nextFollowUp": "2024-01-20T10:00:00Z"
}
```

#### Add Interaction
```
POST /api/leads/:id/interaction
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "contact",
  "details": "Sent follow-up email"
}
```

### Image Upload Endpoints

#### Upload Profile Image
```
POST /api/upload/profile-image
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- profileImage: [file]
```

#### Upload Cover Image
```
POST /api/upload/cover-image
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- coverImage: [file]
```

#### Upload General Image
```
POST /api/upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- image: [file]
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive validation for all endpoints
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for Express
- **File Upload Security**: File type and size validation

## 📊 Database Models

### User Model
- Authentication fields (email, password)
- Profile information (name, phone, company, position)
- Social links and custom links
- Theme preferences
- Account status and verification

### Profile Model
- Public profile information
- Social media links
- Custom links with icons
- QR code configuration
- Analytics tracking
- Privacy settings

### Lead Model
- Contact information
- Source tracking (QR, NFC, etc.)
- Lead scoring and status
- Interaction history
- Location and device data

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taponn
JWT_SECRET=very-long-random-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=https://taponn.com
```

### Deployment Platforms

- **Render**: Easy deployment with automatic scaling
- **Railway**: Simple deployment with database integration
- **Vercel**: Serverless deployment option
- **Heroku**: Traditional deployment platform

## 🔧 Development

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
```

### Database Seeding
```bash
npm run seed
```

## 📈 Analytics & Monitoring

The backend includes comprehensive analytics tracking:

- Profile view counts
- Lead capture analytics
- QR code scan tracking
- User interaction history
- Performance metrics

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
- Contact the development team
- Check the documentation

---

**TapOnn Backend** - Powering the future of digital networking! 🚀 