import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { useQueryClient } from 'react-query'
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

  // Env
  // We need to decide whether to use the proxy or direct URL
  // If we're in development and using the Vite dev server, we should use '/api'
  // If we're using the direct URL from .env, we should use that
  const isDevServer = window.location.port === '3000' || window.location.port === '3001'
  const API_BASE_URL = isDevServer ? '/api' : (import.meta.env.VITE_API_URL || '/api')
  const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

  // Create axios instance ONCE
  const api = useMemo(() => {
    // Ensure the API_BASE_URL doesn't end with a slash to avoid path issues
    const baseURL = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL
    console.log('Creating API instance with baseURL:', baseURL)
    console.log('Is using dev server proxy:', isDevServer)
    return axios.create({
      baseURL: baseURL,
      headers: { 'Content-Type': 'application/json' },
    })
  }, [API_BASE_URL, isDevServer])

  // Attach token to each request
  useEffect(() => {
    const reqId = api.interceptors.request.use((config) => {
      const token = localStorage.getItem('connectionunlimited-token')
      if (token) {
        // Make sure the token is properly formatted
        const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`
        config.headers.Authorization = formattedToken
        console.log('Adding token to request:', config.url)
        console.log('Authorization header:', formattedToken)
        console.log('Full request config:', {
          url: config.url,
          baseURL: config.baseURL,
          method: config.method,
          headers: config.headers
        })
      } else {
        console.log('No token found for request:', config.url)
      }
      return config
    })
    return () => api.interceptors.request.eject(reqId)
  }, [api])

  // Stable logout (used by interceptor)
  const logout = useCallback(() => {
    localStorage.removeItem('connectionunlimited-token')
    delete api.defaults.headers.common['Authorization']

    setUser(null)
    queryClient.clear()
    toast.success('Logged out successfully')
  }, [queryClient])

  // Handle 401 globally
  useEffect(() => {
    const resId = api.interceptors.response.use(
      (response) => {
        console.log('Response success:', response.status, response.config?.url)
        return response
      },
      (error) => {
        console.log('Response error:', error.response?.status, error.config?.url)
        console.log('Error response data:', error.response?.data)
        console.log('Error config:', error.config)

        // Only handle 401 for non-login requests
        if (error?.response?.status === 401 && !error.config.url.includes('/auth/login')) {
          console.log('401 error detected, logging out')
          logout()
        }

        return Promise.reject(error)
      }
    )
    return () => api.interceptors.response.eject(resId)
  }, [api])

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('connectionunlimited-token')
    if (!token) {
      console.log('No token found in localStorage')
      setLoading(false)
      return
    }

    // Set token in axios headers - make sure it's properly formatted
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    api.defaults.headers.common['Authorization'] = formattedToken
    console.log('Setting Authorization header on mount:', formattedToken)
    console.log('Token from localStorage:', token)

      ; (async () => {
        try {
          console.log('Checking authentication with token:', token)
          console.log('API base URL:', API_BASE_URL)
          console.log('Current axios defaults:', api.defaults)

          // Try with both path formats to debug
          console.log('Attempting auth check with path: auth/me')
          try {
            const res = await api.get('auth/me')
            console.log('Auth check response:', res.data)

            const me = res?.data?.user ?? res?.data?.data ?? res?.data
            if (me) {
              setUser(me)
              console.log('User authenticated:', me)
            } else {
              console.log('No user data returned from auth/me')
              localStorage.removeItem('connectionunlimited-token')
              delete api.defaults.headers.common['Authorization']
            }
          } catch (error) {
            console.error('First auth check failed, trying alternate path')
            console.error('Error details:', error.response?.data || error.message || error)

            // Try alternate path format
            console.log('Attempting auth check with path: /auth/me')
            const res = await api.get('/auth/me')
            console.log('Auth check response (alternate path):', res.data)

            const me = res?.data?.user ?? res?.data?.data ?? res?.data
            if (me) {
              setUser(me)
              console.log('User authenticated (alternate path):', me)
            } else {
              console.log('No user data returned from /auth/me')
              localStorage.removeItem('connectionunlimited-token')
              delete api.defaults.headers.common['Authorization']
            }
          }
        } catch (error) {
          console.error('Auth check error (all attempts failed):', error)
          console.error('Error details:', error.response?.data || error.message || error)
          console.error('Error status:', error.response?.status)
          console.error('Error headers:', error.response?.headers)
          localStorage.removeItem('connectionunlimited-token')
          delete api.defaults.headers.common['Authorization']
        } finally {
          setLoading(false)
        }
      })()
  }, [api, API_BASE_URL])

  // Debug effect to track auth state changes
  useEffect(() => {
    console.log('Auth state changed:', {
      user: Boolean(user),
      token: Boolean(localStorage.getItem('connectionunlimited-token')),
      isAuthenticated: Boolean(user)
    })
  }, [user])

  // ---- Actions ----
  const login = async (credentials) => {
    try {
      console.log("Login credentials:", credentials)
      console.log("API base URL:", API_BASE_URL)

      const response = await api.post('auth/login', credentials)
      console.log('Login response:', response.data)

      const token = response?.data?.token
      const serverUser = response?.data?.user

      if (!token || !serverUser) {
        throw new Error('Invalid login response: missing token or user')
      }

      localStorage.setItem('connectionunlimited-token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(serverUser)

      toast.success('Welcome back!')
      return { success: true }

    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message)

      let message = 'Login failed. Please try again.'
      if (error.response?.data) {
        if (error.response.data.errors && error.response.data.errors.length > 0) {
          message = error.response.data.errors.map(err => err.msg).join(', ')
        } else if (error.response.data.message) {
          message = error.response.data.message
        }
      }

      toast.error(message)
      return { success: false, error: message }
    }
  }



  const register = async (userData) => {
    try {
      if (DEMO_MODE || !navigator.onLine) {
        const isAdmin = userData.email?.toLowerCase().includes('admin') || userData.email?.toLowerCase().includes('connectionunlimited')
        const demoUser = {
          _id: `${isAdmin ? 'admin-user' : 'demo-user'}-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || null,
          company: userData.company || null,
          position: userData.position || null,
          profileImage: null,
          role: isAdmin ? 'admin' : 'user',
          permissions: isAdmin
            ? ['qr_generate', 'card_manage', 'user_manage', 'analytics']
            : ['profile_view', 'card_purchase'],
        }
        const demoToken = 'demo-token-' + Date.now()
        localStorage.setItem('connectionunlimited-token', demoToken)
        setUser(demoUser)
        toast.success('Account created successfully! (Demo Mode)')
        return { success: true }
      }

      console.log("Register user data:", userData)
      console.log("API base URL:", API_BASE_URL)
      // Use the correct path format without a leading slash
      // since the baseURL is already set correctly
      const response = await api.post('auth/register', userData)
      const token = response?.data?.token
      const serverUser = response?.data?.user

      if (!token || !serverUser) {
        throw new Error('Invalid register response: missing token or user')
      }

      localStorage.setItem('connectionunlimited-token', token)
      setUser(serverUser)
      toast.success('Account created successfully!')
      return { success: true }
    } catch (error) {
      if (error?.code === 'ERR_NETWORK' || (error?.response && error.response.status >= 500)) {
        const isAdmin = userData.email?.toLowerCase().includes('admin') || userData.email?.toLowerCase().includes('connectionunlimited')
        const demoUser = {
          _id: `${isAdmin ? 'admin-user' : 'demo-user'}-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          phone: userData.phone || null,
          company: userData.company || null,
          position: userData.position || null,
          profileImage: null,
          role: isAdmin ? 'admin' : 'user',
          permissions: isAdmin
            ? ['qr_generate', 'card_manage', 'user_manage', 'analytics']
            : ['profile_view', 'card_purchase'],
        }
        const demoToken = 'demo-token-' + Date.now()
        localStorage.setItem('connectionunlimited-token', demoToken)
        setUser(demoUser)
        toast.success('Account created successfully! (Demo Mode - Backend Offline)')
        return { success: true }
      }

      console.error('Registration Error:', error.response?.data || error.message);

      let message = 'Registration failed. Please try again.';
      if (error.response?.data) {
        // Handle express-validator errors array
        if (error.response.data.errors && error.response.data.errors.length > 0) {
          message = error.response.data.errors.map(err => err.msg).join(', ');
        } else if (error.response.data.message) {
          // Handle other error messages from the backend
          message = error.response.data.message;
        }
      }
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/update-details', profileData)
      const nextUser = res?.data?.data ?? res?.data?.user ?? res?.data
      setUser(nextUser)
      toast.success('Profile updated successfully!')
      return { success: true }
    } catch (error) {
      const message = error?.response?.data?.message || 'Profile update failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const hasPermission = (permission) => {
    return Boolean(user?.permissions?.includes(permission))
  }

  // Debug authentication state
  useEffect(() => {
    console.log('Auth state updated:', {
      user: Boolean(user),
      token: Boolean(localStorage.getItem('connectionunlimited-token')),
      isAuthenticated: Boolean(user)
    })
  }, [user])

  const value = {
    // state
    user,
    loading,
    isAuthenticated: Boolean(user),
    userRole: user?.role || 'user',
    isAdmin: user?.role === 'admin',
    isConnectionUnlimitedUser: Boolean(user),

    // actions
    login,
    register,
    logout,
    updateProfile,
    hasPermission,

    // api instance
    api,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
