# TapOnn - Digital Profile Platform

A modern, responsive digital profile platform built with React, Vite, and Tailwind CSS. Create beautiful digital business cards, generate QR codes, and track analytics all in one place.

## 🚀 Features

- **Digital Profiles**: Create and customize professional digital profiles
- **QR Code Generation**: Dynamic QR codes for profiles and custom links
- **NFC Cards**: Physical NFC cards that link to digital profiles
- **Review Cards**: Collect and display customer reviews
- **Analytics Dashboard**: Track profile views, QR scans, and user engagement
- **Admin Panel**: Comprehensive admin dashboard for user management
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Live data updates from backend API
- **Demo Mode**: Works offline with demo data for testing

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **State Management**: React Context API + React Query
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Forms**: React Hook Form

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Modern web browser
- Backend API (optional - demo mode available)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd letsconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration (Optional)**
   
   Create a `.env` file in the root directory for customization:
   
   ```bash
   # API Configuration
   VITE_API_URL=http://localhost:5000/api
   
   # App Configuration
   VITE_DEMO_MODE=false
   VITE_DEBUG=true
   
   # Feature Flags
   VITE_ENABLE_ANALYTICS=true
   VITE_ENABLE_PAYMENTS=true
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## 🌐 Project Structure

```
letsconnect/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (Auth, Theme)
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── app/            # Main app pages
│   │   └── dashboard/      # User dashboard pages
│   ├── services/           # API services and utilities
│   ├── config/             # Configuration files
│   ├── utils/              # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # Global styles and CSS
│   ├── App.jsx             # Main app component
│   └── main.jsx            # App entry point
├── public/                 # Static assets
├── dist/                   # Build output
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🔧 Configuration

The frontend uses a centralized configuration system in `src/config/config.js` that provides:

- **API Configuration**: Base URLs, timeouts, endpoints
- **App Settings**: Feature flags, demo mode, debug settings
- **UI Configuration**: Themes, animations, responsive breakpoints
- **Demo Data**: Comprehensive demo data for offline testing
- **Error Messages**: Centralized error and success messages
- **Validation Rules**: Form validation and file upload limits

### Default Configuration

```javascript
{
  API: {
    BASE_URL: 'http://localhost:5000/api',
    TIMEOUT: 10000,
  },
  APP: {
    DEMO_MODE: false,
    DEBUG: false,
  },
  FEATURES: {
    ANALYTICS: true,
    QR_CODES: true,
    NFC_CARDS: true,
    // ... more features
  }
}
```

## 🌍 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API URL |
| `VITE_DEMO_MODE` | `false` | Enable demo mode |
| `VITE_DEBUG` | `false` | Enable debug logging |

## 🚀 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Development Server

The development server runs on `http://localhost:5173` by default and includes:

- **Hot Module Replacement**: Instant updates without page refresh
- **Error Overlay**: Clear error messages and stack traces
- **Source Maps**: Easy debugging with browser dev tools
- **Fast Refresh**: Preserves component state during updates

### Code Organization

- **Components**: Reusable UI components with props validation
- **Pages**: Route-specific page components
- **Services**: API calls and external service integration
- **Contexts**: Global state management
- **Hooks**: Custom React hooks for common functionality
- **Utils**: Helper functions and utilities

## 🔐 Authentication

The app uses JWT-based authentication with automatic token management:

- **Automatic Token Storage**: Tokens stored in localStorage
- **Request Interceptors**: Automatic token inclusion in API calls
- **Error Handling**: Automatic logout on token expiration
- **Demo Mode**: Works without backend authentication

### Auth Flow

1. User logs in with email/password
2. Backend validates credentials and returns JWT token
3. Frontend stores token and includes it in subsequent requests
4. Token automatically refreshed or user logged out on expiration

## 📱 Responsive Design

The app is built with a mobile-first approach:

- **Breakpoints**: Mobile (768px), Tablet (1024px), Desktop (1280px)
- **Flexible Layouts**: CSS Grid and Flexbox for responsive layouts
- **Touch-Friendly**: Optimized for touch devices
- **Progressive Enhancement**: Core functionality works on all devices

## 🎨 UI Components

### Component Library

- **Buttons**: Primary, secondary, outline, and ghost variants
- **Cards**: Profile cards, analytics cards, and info cards
- **Forms**: Input fields, select dropdowns, and form validation
- **Modals**: Confirmation dialogs and form modals
- **Tables**: Sortable and filterable data tables
- **Charts**: Line charts, bar charts, and pie charts

### Design System

- **Color Palette**: Consistent color scheme with semantic meanings
- **Typography**: Hierarchical text styles and spacing
- **Spacing**: Consistent spacing scale (4px base unit)
- **Animations**: Smooth transitions and micro-interactions

## 📊 Analytics & Tracking

The app includes comprehensive analytics tracking:

- **User Behavior**: Page views, session duration, user journey
- **Profile Analytics**: View counts, unique visitors, engagement
- **QR Code Tracking**: Scan counts, location data, device info
- **Performance Metrics**: Load times, error rates, user satisfaction

## 🔧 API Integration

### Service Layer

The app uses a centralized service layer (`src/services/api.js`) that provides:

- **HTTP Client**: Axios instance with interceptors
- **Error Handling**: Network error detection and fallback
- **Authentication**: Automatic token management
- **Timeout Handling**: Configurable request timeouts
- **Fallback Data**: Demo data when backend is unavailable

### API Endpoints

- **Authentication**: Login, register, logout, profile management
- **Profiles**: CRUD operations for digital profiles
- **QR Codes**: Generation, management, and analytics
- **Orders**: Order processing and management
- **Analytics**: Data collection and reporting
- **Admin**: User management and system administration

## 🎯 Demo Mode

The app includes a comprehensive demo mode that works without a backend:

- **Demo Users**: Pre-configured user accounts
- **Sample Data**: Realistic profiles, QR codes, and analytics
- **Offline Functionality**: Full app functionality without internet
- **Easy Testing**: Test all features without setup

### Demo Accounts

- **User Account**: `user@example.com` / `password`
- **Admin Account**: `admin@taponn.com` / `password`

## 🚀 Deployment

### Build Process

1. **Optimization**: Code splitting and tree shaking
2. **Minification**: CSS and JavaScript minification
3. **Asset Optimization**: Image optimization and compression
4. **Bundle Analysis**: Bundle size analysis and optimization

### Deployment Options

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: CloudFlare, AWS CloudFront
- **Server**: Nginx, Apache, Express static

### Environment Configuration

```bash
# Production environment
VITE_API_URL=https://api.taponn.com
VITE_DEMO_MODE=false
VITE_DEBUG=false
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Errors**
   - Check Node.js version compatibility
   - Clear node_modules and reinstall
   - Verify import paths and dependencies

2. **Runtime Errors**
   - Check browser console for error messages
   - Verify API endpoints and configuration
   - Check network connectivity

3. **Styling Issues**
   - Verify Tailwind CSS configuration
   - Check CSS import order
   - Verify responsive breakpoints

### Debug Mode

Enable debug mode for detailed logging:

```bash
VITE_DEBUG=true npm run dev
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines

- **Code Style**: Follow ESLint configuration
- **Component Structure**: Use functional components with hooks
- **State Management**: Use Context API for global state
- **Error Handling**: Implement proper error boundaries
- **Accessibility**: Follow WCAG guidelines

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue in the repository
- **Discussions**: Use GitHub Discussions for questions
- **Wiki**: Check the project wiki for detailed guides

## 🎯 Roadmap

### Upcoming Features

- **Real-time Chat**: Live chat between users
- **Advanced Analytics**: Custom reports and dashboards
- **API Integrations**: Third-party service integrations
- **Mobile App**: React Native mobile application
- **PWA Support**: Progressive Web App capabilities

### Performance Improvements

- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Component and image lazy loading
- **Caching**: Service worker and browser caching
- **Optimization**: Bundle size and performance optimization

---

**Note**: This frontend is designed to work seamlessly with the TapOnn backend API, but also includes a comprehensive demo mode for standalone testing and development. 