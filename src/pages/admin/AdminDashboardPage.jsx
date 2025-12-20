import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Crown,
  Database, 
  Users, 
  QrCode,
  ShoppingBag,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Shield,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { adminAPI } from '../../services/api'

// Admin Components
import AdminUserManagement from './dashboard/UserManagement'
import AdminQRManagement from './dashboard/QRManagement'
import AdminOrderManagement from './dashboard/OrderManagement'
import AdminDatabaseViewer from './dashboard/DatabaseViewer'
import AdminAnalytics from './dashboard/Analytics'
import AdminSettings from './dashboard/Settings'

const AdminDashboardPage = () => {
  const { user, logout, isAuthenticated, isTapOnnUser } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalQRCodes: 0,
    todayRevenue: 0
  })

  // Redirect if not admin
  if (!isAuthenticated || !isTapOnnUser) {
    return <Navigate to="/admin/login" replace />
  }

  useEffect(() => {
    // Load admin dashboard stats
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats()
      if (response.data.success) {
        const data = response.data.data
        setStats({
          totalUsers: data.summary.totalUsers,
          totalOrders: data.summary.totalOrders,
          pendingOrders: data.recentOrders?.filter(order => order.status === 'pending').length || 0,
          totalQRCodes: data.summary.totalQRCodes,
          todayRevenue: data.summary.totalRevenue
        })
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error)
      toast.error('Failed to load dashboard statistics')
    }
  }

  const navigation = [
    { 
      name: 'Overview', 
      href: '/admin/dashboard', 
      icon: BarChart3, 
      emoji: '📊',
      description: 'Dashboard overview & stats'
    },
    { 
      name: 'Users', 
      href: '/admin/dashboard/users', 
      icon: Users, 
      emoji: '👥',
      description: 'Manage all users',
      badge: stats.totalUsers
    },
    { 
      name: 'QR Codes', 
      href: '/admin/dashboard/qr-codes', 
      icon: QrCode, 
      emoji: '📱',
      description: 'All user QR codes',
      badge: stats.totalQRCodes
    },
    { 
      name: 'Orders', 
      href: '/admin/dashboard/orders', 
      icon: ShoppingBag, 
      emoji: '📦',
      description: 'Process card orders',
      badge: stats.pendingOrders,
      urgent: stats.pendingOrders > 0
    },
    { 
      name: 'Database', 
      href: '/admin/dashboard/database', 
      icon: Database, 
      emoji: '🗄️',
      description: 'Database viewer & admin'
    },
    { 
      name: 'Settings', 
      href: '/admin/dashboard/settings', 
      icon: Settings, 
      emoji: '⚙️',
      description: 'Admin configuration'
    }
  ]

  const isActive = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
  }

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {typeof value === 'number' && title.includes('Revenue') ? `$${value}` : value}
          </p>
          {change && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              +{change}% from yesterday
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )

  const OverviewDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={Users} 
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          change={12}
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={ShoppingBag} 
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          change={8}
        />
        <StatCard 
          title="Pending Orders" 
          value={stats.pendingOrders} 
          icon={Clock} 
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
        <StatCard 
          title="Total QR Codes" 
          value={stats.totalQRCodes} 
          icon={QrCode} 
          color="bg-gradient-to-br from-green-500 to-green-600"
          change={15}
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/dashboard/orders">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg flex items-center space-x-3"
            >
              <AlertTriangle className="w-5 h-5" />
              <span>Process {stats.pendingOrders} Orders</span>
            </motion.button>
          </Link>
          
          <Link to="/admin/dashboard/users">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg flex items-center space-x-3"
            >
              <Users className="w-5 h-5" />
              <span>Manage Users</span>
            </motion.button>
          </Link>
          
          <Link to="/admin/dashboard/qr-codes">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg flex items-center space-x-3"
            >
              <QrCode className="w-5 h-5" />
              <span>View QR Codes</span>
            </motion.button>
          </Link>
          
          <Link to="/admin/dashboard/database">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg flex items-center space-x-3"
            >
              <Database className="w-5 h-5" />
              <span>Database Admin</span>
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { user: 'john@example.com', action: 'created account', time: '2 min ago', type: 'user' },
            { user: 'sarah@company.com', action: 'ordered NFC card', time: '5 min ago', type: 'order' },
            { user: 'admin@taponn.com', action: 'generated QR code', time: '10 min ago', type: 'qr' },
            { user: 'mike@startup.com', action: 'updated profile', time: '15 min ago', type: 'profile' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'order' ? 'bg-red-500' :
                activity.type === 'user' ? 'bg-blue-500' :
                activity.type === 'qr' ? 'bg-green-500' : 'bg-gray-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>TapOnn Admin Dashboard | Administrative Control Panel</title>
        <meta name="description" content="TapOnn administrative dashboard for managing users, orders, and QR codes" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Top Navigation */}
        <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo & Title */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Menu className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">TapOnn Admin</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Administrative Dashboard</p>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center space-x-4">
                {/* Stats Summary */}
                <div className="hidden lg:flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{stats.totalUsers} users</span>
                  </div>
                  <div className="flex items-center space-x-1 text-orange-600">
                    <Clock className="w-4 h-4" />
                    <span>{stats.pendingOrders} pending</span>
                  </div>
                </div>

                {/* Admin Profile */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2"
                      >
                        <Link
                          to="/admin/dashboard/settings"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Admin Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Sidebar */}
        <div className="flex">
          <AnimatePresence>
            {(sidebarOpen || window.innerWidth >= 768) && (
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="fixed md:relative z-40 w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
              >
                <div className="p-6">
                  <nav className="space-y-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          isActive(item.href)
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5" />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs opacity-75">{item.description}</div>
                          </div>
                        </div>
                        {item.badge && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.urgent ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6"
            >
              <Routes>
                <Route path="/dashboard" element={<OverviewDashboard />} />
                <Route path="/dashboard/users" element={<AdminUserManagement />} />
                <Route path="/dashboard/qr-codes" element={<AdminQRManagement />} />
                <Route path="/dashboard/orders" element={<AdminOrderManagement />} />
                <Route path="/dashboard/database" element={<AdminDatabaseViewer />} />
                <Route path="/dashboard/analytics" element={<AdminAnalytics />} />
                <Route path="/dashboard/settings" element={<AdminSettings />} />
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
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
              className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default AdminDashboardPage 