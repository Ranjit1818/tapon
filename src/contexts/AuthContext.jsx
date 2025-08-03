import { createContext, useContext, useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()

  // API base URL - Using mock mode when backend is not available
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

  // Create axios instance with auth header
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Add auth token to requests
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('taponn-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Handle auth errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout()
        toast.error('Session expired. Please login again.')
      }
      return Promise.reject(error)
    }
  )

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('taponn-token')
    if (token) {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [])

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.user)
    } catch (error) {
      localStorage.removeItem('taponn-token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      // Demo mode - allow any email/password combination
      if (DEMO_MODE || !navigator.onLine) {
        // Check if it's admin credentials
        const isAdmin = credentials.email.includes('admin') || credentials.email.includes('taponn')
        const demoUser = {
          id: isAdmin ? 'admin-user-123' : 'demo-user-123',
          name: credentials.email.split('@')[0] || 'Demo User',
          email: credentials.email,
          profileImage: null,
          role: isAdmin ? 'admin' : 'user',
          permissions: isAdmin ? ['qr_generate', 'card_manage', 'user_manage', 'analytics'] : ['profile_view', 'card_purchase']
        }
        const demoToken = 'demo-token-' + Date.now()
        
        localStorage.setItem('taponn-token', demoToken)
        setUser(demoUser)
        
        toast.success('Welcome back! (Demo Mode)')
        return { success: true }
      }
      
      const response = await api.post('/auth/login', credentials)
      const { token, user } = response.data
      
      localStorage.setItem('taponn-token', token)
      setUser(user)
      
      toast.success('Welcome back!')
      return { success: true }
    } catch (error) {
      // Fallback to demo mode if backend is not available
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        const isAdmin = credentials.email.includes('admin') || credentials.email.includes('taponn')
        const demoUser = {
          id: isAdmin ? 'admin-user-123' : 'demo-user-123',
          name: credentials.email.split('@')[0] || 'Demo User',
          email: credentials.email,
          profileImage: null,
          role: isAdmin ? 'admin' : 'user',
          permissions: isAdmin ? ['qr_generate', 'card_manage', 'user_manage', 'analytics'] : ['profile_view', 'card_purchase']
        }
        const demoToken = 'demo-token-' + Date.now()
        
        localStorage.setItem('taponn-token', demoToken)
        setUser(demoUser)
        
        toast.success('Welcome back! (Demo Mode - Backend Offline)')
        return { success: true }
      }
      
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (userData) => {
    try {
      // Demo mode - allow any registration
      if (DEMO_MODE || !navigator.onLine) {
        const isAdmin = userData.email.includes('admin') || userData.email.includes('taponn')
        const demoUser = {
          id: isAdmin ? 'admin-user-' + Date.now() : 'demo-user-' + Date.now(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone || null,
          company: userData.company || null,
          position: userData.position || null,
          profileImage: null,
          role: isAdmin ? 'admin' : 'user',
          permissions: isAdmin ? ['qr_generate', 'card_manage', 'user_manage', 'analytics'] : ['profile_view', 'card_purchase']
        }
        const demoToken = 'demo-token-' + Date.now()
        
        localStorage.setItem('taponn-token', demoToken)
        setUser(demoUser)
        
        toast.success('Account created successfully! (Demo Mode)')
        return { success: true }
      }
      
      const response = await api.post('/auth/register', userData)
      const { token, user } = response.data
      
      localStorage.setItem('taponn-token', token)
      setUser(user)
      
      toast.success('Account created successfully!')
      return { success: true }
    } catch (error) {
      // Fallback to demo mode if backend is not available
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        const isAdmin = userData.email.includes('admin') || userData.email.includes('taponn')
        const demoUser = {
          id: isAdmin ? 'admin-user-' + Date.now() : 'demo-user-' + Date.now(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone || null,
          company: userData.company || null,
          position: userData.position || null,
          profileImage: null,
          role: isAdmin ? 'admin' : 'user',
          permissions: isAdmin ? ['qr_generate', 'card_manage', 'user_manage', 'analytics'] : ['profile_view', 'card_purchase']
        }
        const demoToken = 'demo-token-' + Date.now()
        
        localStorage.setItem('taponn-token', demoToken)
        setUser(demoUser)
        
        toast.success('Account created successfully! (Demo Mode - Backend Offline)')
        return { success: true }
      }
      
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('taponn-token')
    setUser(null)
    queryClient.clear()
    toast.success('Logged out successfully')
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData)
      setUser(response.data.user)
      toast.success('Profile updated successfully!')
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false
    return user.permissions.includes(permission)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    hasPermission,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isTapOnnUser: user?.role === 'admin',
    userRole: user?.role || 'user',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 