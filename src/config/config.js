// Frontend Configuration with fallback values
const config = {
  // API Configuration
  API: {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    TIMEOUT: 10000,
    UPLOAD_TIMEOUT: 30000,
    MULTIPLE_UPLOAD_TIMEOUT: 60000,
  },

  // App Configuration
  APP: {
    NAME: 'FiindIt',
    VERSION: '1.0.0',
    DESCRIPTION: 'Digital Profile Platform',
    DEMO_MODE: import.meta.env.VITE_DEMO_MODE === 'true',
    DEBUG: import.meta.env.VITE_DEBUG === 'true',
  },

  // Authentication
  AUTH: {
    TOKEN_KEY: 'connectionunlimited-token',
    TOKEN_EXPIRY: 30 * 24 * 60 * 60 * 1000, // 30 days
    LOGIN_REDIRECT: '/app/dashboard',
    LOGOUT_REDIRECT: '/app/login',
  },

  // Features
  FEATURES: {
    ANALYTICS: true,
    QR_CODES: true,
    NFC_CARDS: true,
    REVIEW_CARDS: true,
    CUSTOM_LINKS: true,
    SOCIAL_LINKS: true,
    FILE_UPLOAD: true,
    PAYMENTS: true,
  },

  // UI Configuration
  UI: {
    THEME: {
      PRIMARY: '#3B82F6',
      SECONDARY: '#10B981',
      ACCENT: '#F59E0B',
      SUCCESS: '#10B981',
      WARNING: '#F59E0B',
      ERROR: '#EF4444',
      INFO: '#3B82F6',
    },
    ANIMATIONS: {
      ENABLED: true,
      DURATION: 300,
      EASING: 'ease-in-out',
    },
    RESPONSIVE: {
      MOBILE: 768,
      TABLET: 1024,
      DESKTOP: 1280,
    },
  },

  // Demo Data Configuration
  DEMO: {
    USERS: [
      {
        id: 'demo-user-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        profileImage: null,
        permissions: ['profile_view', 'card_purchase'],
      },
      {
        id: 'demo-user-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        profileImage: null,
        permissions: ['profile_view', 'card_purchase'],
      },
      {
        id: 'demo-admin-1',
        name: 'Admin User',
        email: 'admin@connectionunlimited.com',
        role: 'admin',
        profileImage: null,
        permissions: ['qr_generate', 'card_manage', 'user_manage', 'analytics'],
      },
    ],
    PROFILES: [
      {
        id: 'demo-profile-1',
        displayName: 'John Doe',
        username: 'johndoe',
        bio: 'Digital marketing specialist and tech enthusiast',
        avatar: null,
        socialLinks: {
          linkedin: 'https://linkedin.com/in/johndoe',
          twitter: 'https://twitter.com/johndoe',
          instagram: 'https://instagram.com/johndoe',
        },
        customLinks: [
          { title: 'Portfolio', url: 'https://johndoe.dev', icon: 'globe' },
          { title: 'Blog', url: 'https://johndoe.blog', icon: 'book-open' },
        ],
      },
      {
        id: 'demo-profile-2',
        displayName: 'Jane Smith',
        username: 'janesmith',
        bio: 'UX/UI designer passionate about creating beautiful experiences',
        avatar: null,
        socialLinks: {
          linkedin: 'https://linkedin.com/in/janesmith',
          behance: 'https://behance.net/janesmith',
          dribbble: 'https://dribbble.com/janesmith',
        },
        customLinks: [
          { title: 'Design Work', url: 'https://janesmith.design', icon: 'palette' },
          { title: 'Resume', url: 'https://janesmith.com/resume', icon: 'file-text' },
        ],
      },
    ],
    QR_CODES: [
      {
        id: 'demo-qr-1',
        name: 'Business Card QR',
        type: 'profile',
        data: 'https://connectionunlimited.com/profile/johndoe',
        status: 'active',
        scans: 45,
        createdAt: '2024-01-15T10:00:00Z',
      },
      {
        id: 'demo-qr-2',
        name: 'Portfolio QR',
        type: 'custom',
        data: 'https://johndoe.dev',
        status: 'active',
        scans: 23,
        createdAt: '2024-01-16T14:30:00Z',
      },
    ],
    ORDERS: [
      {
        id: 'demo-order-1',
        orderNumber: 'TAP-001',
        product: 'NFC Card',
        status: 'completed',
        totalAmount: 49.99,
        createdAt: '2024-01-10T09:00:00Z',
      },
      {
        id: 'demo-order-2',
        orderNumber: 'TAP-002',
        product: 'Review Card',
        status: 'processing',
        totalAmount: 29.99,
        createdAt: '2024-01-12T11:30:00Z',
      },
    ],
    ANALYTICS: {
      overview: {
        totalUsers: 156,
        activeUsers: 142,
        totalQRScans: 2347,
        totalOrders: 89,
        revenue: 4456.78,
        conversionRate: 0.57,
      },
      userGrowth: [
        { date: '2024-01-14', users: 120, newUsers: 5 },
        { date: '2024-01-15', users: 125, newUsers: 8 },
        { date: '2024-01-16', users: 133, newUsers: 6 },
        { date: '2024-01-17', users: 139, newUsers: 9 },
        { date: '2024-01-18', users: 148, newUsers: 7 },
        { date: '2024-01-19', users: 155, newUsers: 4 },
        { date: '2024-01-20', users: 156, newUsers: 3 },
      ],
      qrScans: [
        { date: '2024-01-14', scans: 45, unique: 38 },
        { date: '2024-01-15', scans: 52, unique: 41 },
        { date: '2024-01-16', scans: 38, unique: 32 },
        { date: '2024-01-17', scans: 67, unique: 54 },
        { date: '2024-01-18', scans: 43, unique: 35 },
        { date: '2024-01-19', scans: 56, unique: 47 },
        { date: '2024-01-20', scans: 61, unique: 52 },
      ],
      orders: [
        { product: 'NFC Card', orders: 45, revenue: 2247.50 },
        { product: 'Review Card', orders: 32, revenue: 959.68 },
        { product: 'Custom Card', orders: 12, revenue: 959.88 },
      ],
      devices: [
        { name: 'Mobile', value: 68, color: '#3B82F6' },
        { name: 'Desktop', value: 25, color: '#10B981' },
        { name: 'Tablet', value: 7, color: '#F59E0B' },
      ],
      topPages: [
        { page: '/profile/johndoe', views: 234, bounceRate: 0.23 },
        { page: '/profile/sarahjohnson', views: 189, bounceRate: 0.31 },
        { page: '/profile/mikehen', views: 156, bounceRate: 0.28 },
        { page: '/profile/lisawang', views: 143, bounceRate: 0.35 },
        { page: '/profile/alexsmith', views: 128, bounceRate: 0.42 },
      ],
    },
  },

  // Error Messages
  ERRORS: {
    NETWORK: 'Network error - please check your connection',
    SERVER: 'Server error - please try again later',
    AUTH: 'Authentication failed - please login again',
    VALIDATION: 'Please check your input and try again',
    NOT_FOUND: 'The requested resource was not found',
    PERMISSION: 'You do not have permission to perform this action',
    TIMEOUT: 'Request timed out - please try again',
  },

  // Success Messages
  SUCCESS: {
    LOGIN: 'Welcome back!',
    REGISTER: 'Account created successfully!',
    LOGOUT: 'Logged out successfully',
    PROFILE_UPDATE: 'Profile updated successfully!',
    QR_CREATED: 'QR code created successfully!',
    ORDER_PLACED: 'Order placed successfully!',
    FILE_UPLOADED: 'File uploaded successfully!',
  },

  // Validation Rules
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 6,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 30,
    BIO_MAX_LENGTH: 500,
    CUSTOM_LINKS_MAX: 10,
    FILE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  },

  // Local Storage Keys
  STORAGE: {
    TOKEN: 'connectionunlimited-token',
    USER: 'connectionunlimited-user',
    THEME: 'connectionunlimited-theme',
    LANGUAGE: 'connectionunlimited-language',
    SETTINGS: 'connectionunlimited-settings',
  },

  // Routes
  ROUTES: {
    HOME: '/',
    LOGIN: '/app/login',
    REGISTER: '/app/register',
    DASHBOARD: '/app/dashboard',
    PROFILE: '/app/profile',
    ADMIN: '/admin',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_USERS: '/admin/dashboard/users',
    ADMIN_PROFILES: '/admin/dashboard/profiles',
    ADMIN_ORDERS: '/admin/dashboard/orders',
    ADMIN_QR: '/admin/dashboard/qr',
    ADMIN_ANALYTICS: '/admin/dashboard/analytics',
    ADMIN_DATABASE: '/admin/dashboard/database',
  },

  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
      UPDATE: '/auth/update-details',
      PASSWORD: '/auth/update-password',
    },
    PROFILES: {
      BASE: '/profiles',
      BY_USERNAME: '/profiles/username',
      SOCIAL_LINKS: '/profiles/social-links',
      CUSTOM_LINKS: '/profiles/custom-links',
      DESIGN: '/profiles/design',
      SETTINGS: '/profiles/settings',
      STATUS: '/profiles/toggle-status',
      QR: '/profiles/qr',
    },
    QR: {
      BASE: '/qr',
      IMAGE: '/qr/image',
      DOWNLOAD: '/qr/download',
    },
    ORDERS: {
      BASE: '/orders',
      STATUS: '/orders/status',
      CANCEL: '/orders/cancel',
    },
    ANALYTICS: {
      USER: '/analytics/user',
      PROFILE: '/analytics/profile',
      QR: '/analytics/qr',
      OVERALL: '/analytics/overall',
      EVENTS: '/analytics/events',
    },
    ADMIN: {
      DASHBOARD: '/admin/dashboard',
      USERS: '/admin/users',
      PROFILES: '/admin/profiles',
      ORDERS: '/admin/orders',
      ANALYTICS: '/admin/analytics',
      QR_CODES: '/admin/qr-codes',
      DATABASE: '/admin/database',
    },
    UPLOAD: {
      IMAGE: '/upload/image',
      MULTIPLE: '/upload/multiple',
    },
    HEALTH: '/health',
  },
}

// Helper functions
export const isDemoMode = () => config.APP.DEMO_MODE
export const isDebugMode = () => config.APP.DEBUG
export const getApiUrl = (endpoint) => `${config.API.BASE_URL}${endpoint}`
export const getStorageKey = (key) => config.STORAGE[key]
export const getErrorMessage = (type) => config.ERRORS[type] || 'An error occurred'
export const getSuccessMessage = (type) => config.SUCCESS[type] || 'Operation completed successfully'

// Environment-specific overrides
if (import.meta.env.DEV) {
  config.APP.DEBUG = true
  config.API.TIMEOUT = 15000 // Longer timeout in development
}

export default config




