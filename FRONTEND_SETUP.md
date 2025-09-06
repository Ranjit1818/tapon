# Frontend Setup Guide

This guide will help you set up the frontend to connect with the backend API.

## Environment Configuration

Create a `.env` file in the `letsconnect` directory with the following variables:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Demo Mode (set to 'true' to use demo data when backend is not available)
VITE_DEMO_MODE=false

# Frontend URL (used for QR code generation)
VITE_FRONTEND_URL=http://localhost:5173

# Analytics (optional)
VITE_ANALYTICS_ENABLED=true
VITE_ANALYTICS_ID=your-analytics-id

# Cloudinary (for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Feature Flags
VITE_ENABLE_QR_GENERATION=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_FILE_UPLOAD=true
```

## Backend Requirements

Make sure your backend server is running on `http://localhost:5000` with the following endpoints available:

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-details` - Update user details

### Profile Endpoints
- `GET /api/profiles` - Get user profiles
- `POST /api/profiles` - Create profile
- `PUT /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile
- `GET /api/profiles/username/:username` - Get profile by username

### Analytics Endpoints
- `GET /api/analytics/user` - Get user analytics
- `GET /api/analytics/profile/:id` - Get profile analytics
- `POST /api/analytics/events` - Record analytics event

### QR Code Endpoints
- `GET /api/qr` - Get user QR codes
- `POST /api/qr` - Create QR code
- `PUT /api/qr/:id` - Update QR code
- `DELETE /api/qr/:id` - Delete QR code

### Upload Endpoints
- `POST /api/upload/image` - Upload image
- `POST /api/upload/multiple` - Upload multiple images

## Installation & Running

1. Install dependencies:
```bash
cd letsconnect
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. The frontend will be available at `http://localhost:5173`

## Features

### Demo Mode
When `VITE_DEMO_MODE=true` or the backend is not available, the frontend will:
- Use demo data for all features
- Allow login with any email/password
- Show demo analytics and profiles
- Work offline

### Backend Integration
When connected to the backend, the frontend will:
- Fetch real user data and profiles
- Save changes to the database
- Track real analytics
- Handle file uploads
- Generate QR codes

## API Integration

The frontend uses the following API services:

### AuthContext
- Handles user authentication
- Manages login/logout
- Stores JWT tokens
- Provides user data to components

### API Service (`src/services/api.js`)
- Centralized API calls
- Handles authentication headers
- Error handling and fallbacks
- File upload functionality

### Components
- `DashboardOverview` - Fetches analytics and profile data
- `ProfileManagement` - Manages profile CRUD operations
- `Analytics` - Displays user analytics
- `QRGenerator` - Creates and manages QR codes

## Error Handling

The frontend includes comprehensive error handling:
- Network error fallbacks to demo mode
- User-friendly error messages
- Loading states and skeletons
- Graceful degradation when backend is unavailable

## Development

### Adding New API Endpoints
1. Add the endpoint to `src/services/api.js`
2. Create a custom hook if needed
3. Update components to use the new endpoint
4. Add error handling and fallbacks

### Testing Backend Connection
1. Start the backend server
2. Set `VITE_DEMO_MODE=false`
3. Try logging in with valid credentials
4. Check browser network tab for API calls

### Debugging
- Check browser console for API errors
- Verify backend server is running
- Confirm CORS settings in backend
- Check environment variables

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables:
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_DEMO_MODE=false
VITE_FRONTEND_URL=https://your-frontend-domain.com
```

3. Deploy the `dist` folder to your hosting provider

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for your frontend domain
2. **API Connection Failed**: Check if backend server is running and accessible
3. **Authentication Issues**: Verify JWT token handling and storage
4. **File Upload Failures**: Check Cloudinary configuration and upload limits

### Fallback Behavior
- If backend is unavailable, frontend switches to demo mode
- Users can still interact with the interface
- Data is not persisted but functionality is maintained
- Clear error messages inform users of the situation

