import axios from 'axios'

// API base URL with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taponn-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors and network issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      console.warn('Network error - backend may be offline, falling back to demo mode')
      // Don't redirect on network errors, let components handle fallback
      return Promise.reject({
        ...error,
        isNetworkError: true,
        message: 'Network error - please check your connection'
      })
    }

    // Handle auth errors
    if (error.response?.status === 401) {
      localStorage.removeItem('taponn-token')
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/app/login'
      }
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data)
      return Promise.reject({
        ...error,
        isServerError: true,
        message: 'Server error - please try again later'
      })
    }

    return Promise.reject(error)
  }
)

// Profile API calls
export const profileAPI = {
  // Get user's profile
  getProfile: () => api.get('/profiles'),
  
  // Get user's own profile (specific endpoint)
  getMyProfile: () => api.get('/profiles/my'),
  
  // Get public profile by username
  getPublicProfile: (username) => api.get(`/profiles/public/${username}`),
  
  // Get profile by ID
  getProfileById: (id) => api.get(`/profiles/${id}`),
  
  // Get profile by username (public)
  getProfileByUsername: (username) => api.get(`/profiles/username/${username}`),
  
  // Create new profile
  createProfile: (data) => api.post('/profiles', data),
  
  // Update profile
  updateProfile: (id, data) => api.put(`/profiles/${id}`, data),
  
  // Delete profile
  deleteProfile: (id) => api.delete(`/profiles/${id}`),
  
  // Update social links
  updateSocialLinks: (id, data) => api.put(`/profiles/${id}/social-links`, data),
  
  // Update custom links
  updateCustomLinks: (id, data) => api.put(`/profiles/${id}/custom-links`, data),
  
  // Update design settings
  updateDesign: (id, data) => api.put(`/profiles/${id}/design`, data),
  
  // Update profile settings
  updateSettings: (id, data) => api.put(`/profiles/${id}/settings`, data),
  
  // Toggle profile status
  toggleStatus: (id) => api.patch(`/profiles/${id}/toggle-status`),
  
  // Generate QR code for profile
  generateQR: (id, data) => api.get(`/profiles/${id}/qr`, { params: data }),
}

// Analytics API calls
export const analyticsAPI = {
  // Get user analytics
  getUserAnalytics: (params) => api.get('/analytics/user', { params }),
  
  // Get profile analytics
  getProfileAnalytics: (profileId, params) => api.get(`/analytics/profile/${profileId}`, { params }),
  
  // Get QR code analytics
  getQRAnalytics: (qrId, params) => api.get(`/analytics/qr/${qrId}`, { params }),
  
  // Get overall analytics (admin)
  getOverallAnalytics: (params) => api.get('/analytics/overall', { params }),
  
  // Record event
  recordEvent: (data) => api.post('/analytics/event', data),
  
  // Track analytics event (alias for recordEvent)
  trackEvent: (eventData) => api.post('/analytics/event', eventData),
}

// QR Code API calls
export const qrAPI = {
  // Get user's QR codes
  getQRCodes: () => api.get('/qr'),
  
  // Get QR code by ID
  getQRCodeById: (id) => api.get(`/qr/${id}`),
  
  // Create new QR code
  createQRCode: (data) => api.post('/qr', data),
  
  // Update QR code
  updateQRCode: (id, data) => api.put(`/qr/${id}`, data),
  
  // Delete QR code
  deleteQRCode: (id) => api.delete(`/qr/${id}`),
  
  // Generate QR code image
  generateQRImage: (id, options) => api.get(`/qr/${id}/image`, { params: options }),
  
  // Download QR code
  downloadQRCode: (id, format) => api.get(`/qr/${id}/download`, { 
    params: { format },
    responseType: 'blob'
  }),
}

// Order API calls
export const orderAPI = {
  // Get user's orders
  getOrders: () => api.get('/orders'),
  
  // Get order by ID
  getOrderById: (id) => api.get(`/orders/${id}`),
  
  // Create new order
  createOrder: (data) => api.post('/orders', data),
  
  // Update order
  updateOrder: (id, data) => api.put(`/orders/${id}`, data),
  
  // Cancel order
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel`),
  
  // Get order status
  getOrderStatus: (id) => api.get(`/orders/${id}/status`),
}

// Admin API calls
export const adminAPI = {
  // Get all users
  getUsers: (params) => api.get('/admin/users', { params }),
  
  // Get all users (alias)
  getAllUsers: (params) => api.get('/admin/users', { params }),
  
  // Get user by ID
  getUserById: (id) => api.get(`/admin/users/${id}`),
  
  // Update user
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  
  // Update user role
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  
  // Toggle user lock
  toggleUserLock: (id) => api.patch(`/admin/users/${id}/lock`),
  
  // Delete user
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Get all profiles
  getAllProfiles: (params) => api.get('/admin/profiles', { params }),
  
  // Get all orders
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  
  // Update order status (admin)
  updateOrder: (id, data) => api.patch(`/admin/orders/${id}/status`, data),
  
  // Get system analytics
  getSystemAnalytics: (params) => api.get('/admin/analytics', { params }),
  
  // Get all analytics
  getAllAnalytics: (params) => api.get('/admin/analytics/all', { params }),
  
  // Get dashboard stats
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Get QR codes
  getQRCodes: (params) => api.get('/admin/qr-codes', { params }),
  
  // Get all QR codes
  getAllQRCodes: (params) => api.get('/admin/qr-codes', { params }),
  
  // Get QR code by ID
  getQRCodeById: (id) => api.get(`/admin/qr-codes/${id}`),
  
  // Update QR code
  updateQRCode: (id, data) => api.put(`/admin/qr-codes/${id}`, data),
  
  // Delete QR code
  deleteQRCode: (id) => api.delete(`/admin/qr-codes/${id}`),
  
  // Generate missing QR codes
  generateMissingQRCodes: () => api.post('/admin/qr-codes/generate-missing'),
  
  // Get database tables
  getDatabaseTables: () => api.get('/admin/database/tables'),
  
  // Get table data
  getTableData: (tableName, params) => api.get(`/admin/database/${tableName}`, { params }),
}

// Upload API calls
export const uploadAPI = {
  // Upload image
  uploadImage: (file, type = 'profile') => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('type', type)
    
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 second timeout for uploads
    })
  },
  
  // Upload multiple images
  uploadMultipleImages: (files, type = 'profile') => {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`images`, file)
    })
    formData.append('type', type)
    
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 second timeout for multiple uploads
    })
  },
  
  // Delete uploaded file
  deleteFile: (fileId) => api.delete(`/upload/${fileId}`),
}

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
}

// Utility function to check if backend is available
export const checkBackendHealth = async () => {
  try {
    const response = await healthAPI.check()
    return {
      isAvailable: true,
      status: response.data
    }
  } catch (error) {
    return {
      isAvailable: false,
      error: error.message
    }
  }
}

// Utility function to handle API errors gracefully
export const handleAPIError = (error, fallbackData = null) => {
  if (error.isNetworkError) {
    console.warn('Backend unavailable, using fallback data')
    return fallbackData
  }
  
  if (error.isServerError) {
    console.error('Server error:', error.message)
    return fallbackData
  }
  
  // Re-throw other errors
  throw error
}

export default api
