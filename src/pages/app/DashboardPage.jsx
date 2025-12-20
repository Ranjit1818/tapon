import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { 
  User, 
  BarChart3, 
  Users, 
  Settings,
  Plus,
  Download,
  Share2,
  QrCode,
  ShoppingBag,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Home,
  LogOut
} from 'lucide-react'
import toast from 'react-hot-toast'

// Dashboard Components
import AppDashboardOverview from './dashboard/DashboardOverview'
import AppProfileManagement from './dashboard/ProfileManagement'
import AppAnalytics from './dashboard/Analytics'
import AppQRGenerator from './dashboard/QRGenerator'
import AppShop from './dashboard/Shop'
import AppSettingsPage from './dashboard/SettingsPage'

const AppDashboardPage = () => {
  const { user, logout, isAuthenticated, hasPermission, isTapOnnUser, loading } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  // Enhanced authentication check
  useEffect(() => {
    console.log('Dashboard auth check:', { isAuthenticated, user, loading })
    if (!isAuthenticated && !loading) {
      console.log('User not authenticated, redirecting to login')
    }
  }, [isAuthenticated, loading, user])

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // if (!isAuthenticated) {
  //   console.log('Redirecting to login page')
  //   return <Navigate to="/app/login" replace />
  // }

  // Base navigation items available to all users
  const baseNavigation = [
    { 
      name: 'Dashboard', 
      href: '/app/dashboard', 
      icon: Home, 
      emoji: '🧠',
      description: 'Overview & stats'
    },
    { 
      name: 'Profile', 
      href: '/app/dashboard/profile', 
      icon: User, 
      emoji: '🙋‍♂️',
      description: 'Manage your digital profile'
    },
    { 
      name: 'Shop', 
      href: '/app/dashboard/shop', 
      icon: ShoppingBag, 
      emoji: '💳',
      description: isTapOnnUser ? 'Manage Cards & Sales' : 'Buy NFC & Review cards'
    },
    { 
      name: 'Settings', 
      href: '/app/dashboard/settings', 
      icon: Settings, 
      emoji: '⚙️',
      description: 'Account & preferences'
    }
  ]

  // Admin-only navigation items
  const adminNavigation = [
    { 
      name: 'Analytics', 
      href: '/app/dashboard/analytics', 
      icon: BarChart3, 
      emoji: '📊',
      description: 'Track performance & sales'
    },
    { 
      name: 'QR Generator', 
      href: '/app/dashboard/qr-generator', 
      icon: QrCode, 
      emoji: '📎',
      description: 'Generate QR codes for cards'
    }
  ]

  // Combine navigation based on user role
  const navigation = isTapOnnUser 
    ? [...baseNavigation.slice(0, 2), ...adminNavigation, ...baseNavigation.slice(2)]
    : baseNavigation.filter(item => item.name !== 'Analytics')

  const isActive = (path) => {
    if (path === '/app/dashboard') {
      return location.pathname === '/app/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    toast.success('👋 See you later!')
    // Force redirect to login page
    window.location.href = '/app/login'
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '🌅 Good Morning'
    if (hour < 17) return '☀️ Good Afternoon'
    return '🌙 Good Evening'
  }

  return (
    <>
      <Helmet>
        <title>TapOnn App - Your Digital Profile Dashboard 🚀</title>
        <meta name="description" content="Manage your TapOnn digital profile, track analytics, generate QR codes, and explore our shop." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Top Navigation */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                
                <Link to="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">T</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">TapOnn</span>
                </Link>

                <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
                  {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}!
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="hidden md:flex relative">
                  <input
                    type="text"
                    placeholder="Search... 🔍"
                    className="w-64 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                {/* Notifications */}
                <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 relative hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <motion.span 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                  />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user?.email}
                          </p>
                        </div>
                        
                        <Link
                          to="/app/dashboard/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile Settings
                        </Link>
                        
                        <Link
                          to="/app/dashboard/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Account Settings
                        </Link>
                        
                        <div className="border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex">
          {/* Sidebar */}
          <AnimatePresence>
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: sidebarOpen ? 0 : -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:z-auto`}
              style={{ top: '64px' }}
            >
              <div className="flex flex-col h-full">
                <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                  <nav className="mt-5 flex-1 px-2 space-y-2">
                    {navigation.map((item) => (
                      <motion.div key={item.name} whileHover={{ x: 4 }}>
                        <Link
                          to={item.href}
                          className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all ${
                            isActive(item.href)
                              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="text-lg mr-3">{item.emoji}</span>
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className={`text-xs ${
                              isActive(item.href) ? 'text-white/80' : 'text-gray-500 dark:text-gray-500'
                            }`}>
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>

                {/* Quick Actions */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    ⚡ Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <span className="mr-3">📥</span>
                      Download QR
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <span className="mr-3">📤</span>
                      Share Profile
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <span className="mr-3">💳</span>
                      Buy NFC Card
                    </motion.button>
                  </div>
                </motion.div>

                {/* User Profile Preview */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.company || 'TapOnn User'}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/profile/${user?.username || 'demo'}`}
                      className="mt-2 w-full bg-white dark:bg-gray-800 text-center py-2 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>👁️</span>
                      <span>View Public Profile</span>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="py-6"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Routes>
                  <Route path="/dashboard" element={<AppDashboardOverview />} />
                  <Route path="/dashboard/profile" element={<AppProfileManagement />} />
                  {/* Admin-only routes */}
                  {isTapOnnUser && (
                    <>
                      <Route path="/dashboard/analytics" element={<AppAnalytics />} />
                      <Route path="/dashboard/qr-generator" element={<AppQRGenerator />} />
                    </>
                  )}
                  <Route path="/dashboard/shop" element={<AppShop />} />
                  <Route path="/dashboard/settings" element={<AppSettingsPage />} />
                  <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
                  {/* Fallback for unauthorized routes */}
                  {!isTapOnnUser && (
                    <>
                      <Route path="/dashboard/analytics" element={<Navigate to="/app/dashboard" replace />} />
                      <Route path="/dashboard/qr-generator" element={<Navigate to="/app/dashboard" replace />} />
                    </>
                  )}
                </Routes>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sticky Mobile CTA */}
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="md:hidden fixed bottom-4 left-4 right-4 z-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
            <div className="flex space-x-2">
              {isTapOnnUser ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <span>📎</span>
                    <span>Generate QR</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <span>📊</span>
                    <span>Analytics</span>
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <span>💳</span>
                    <span>Buy Card</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-1"
                  >
                    <span>🙋‍♂️</span>
                    <span>Profile</span>
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default AppDashboardPage