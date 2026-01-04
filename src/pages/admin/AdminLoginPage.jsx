import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Crown,
  Database,
  Users,
  ShoppingBag
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const AdminLoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Admin email is required'
    } else if (!formData.email.includes('admin') && !formData.email.includes('connectionunlimited')) {
      newErrors.email = 'Only admin emails are allowed'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const result = await login(formData)

      if (result.success) {
        toast.success('Welcome to Connection Unlimited Admin Dashboard! 👑')
        navigate('/admin/dashboard')
      } else {
        toast.error(result.error || 'Admin login failed')
      }
    } catch (error) {
      toast.error('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Connection Unlimited Admin Login | Administrative Access</title>
        <meta name="description" content="Secure admin login for Connection Unlimited administrative dashboard" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Connection Unlimited Admin</h1>
            <p className="text-gray-300">Administrative Dashboard Access</p>
          </motion.div>

          {/* Admin Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 mb-6"
          >
            <h3 className="text-white font-medium mb-3 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Admin Access Includes:
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-gray-300">
                <Database className="w-4 h-4 mr-2 text-blue-400" />
                Database Access
              </div>
              <div className="flex items-center text-gray-300">
                <Users className="w-4 h-4 mr-2 text-green-400" />
                User Management
              </div>
              <div className="flex items-center text-gray-300">
                <ShoppingBag className="w-4 h-4 mr-2 text-purple-400" />
                Order Processing
              </div>
              <div className="flex items-center text-gray-300">
                <Crown className="w-4 h-4 mr-2 text-yellow-400" />
                QR Code Control
              </div>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${errors.email
                        ? 'border-red-500 bg-red-900/20'
                        : 'border-white/30'
                      }`}
                    placeholder="admin@connectionunlimited.com"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1 flex items-center space-x-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.email}</span>
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all ${errors.password
                        ? 'border-red-500 bg-red-900/20'
                        : 'border-white/30'
                      }`}
                    placeholder="Enter admin password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1 flex items-center space-x-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.password}</span>
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Crown className="w-5 h-5" />
                    <span>Access Admin Dashboard</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
            >
              <div className="text-center">
                <p className="text-sm text-yellow-300 mb-2">
                  👑 <strong>Demo Admin Access</strong>
                </p>
                <div className="text-xs text-yellow-200 bg-yellow-500/20 rounded px-2 py-1 inline-block">
                  Email: <code>admin@connectionunlimited.com</code> / Password: <code>admin123</code>
                </div>
              </div>
            </motion.div>

            {/* Back to User Login */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-center mt-6 pt-6 border-t border-white/20"
            >
              <p className="text-gray-300 text-sm">
                Regular user access?{' '}
                <Link
                  to="/app/login"
                  className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                >
                  User Login
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default AdminLoginPage 