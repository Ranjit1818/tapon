import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MessageSquare, 
  Calendar,
  Download,
  Share2,
  Settings,
  BarChart3,
  Activity,
  QrCode,
  ShoppingBag,
  Star,
  ArrowUpRight,
  Clock,
  Zap
} from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { useAnalytics } from '../../../contexts/AnalyticsContext'
import { analyticsAPI, profileAPI } from '../../../services/api'
import CountUp from 'react-countup'
import toast from 'react-hot-toast'

const DashboardOverview = () => {
  const { user, isTapOnnUser, hasPermission } = useAuth()
  const { trackEvent } = useAnalytics()
  const [stats, setStats] = useState({
    profileViews: 0,
    whatsappClicks: 0,
    totalLeads: 0,
    qrScans: 0,
    nfcTaps: 0,
    socialClicks: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch user profile
      const profileResponse = await profileAPI.getProfile()
      if (profileResponse.data.success && profileResponse.data.data.length > 0) {
        setProfile(profileResponse.data.data[0])
      }

      // Fetch analytics data
      const analyticsResponse = await analyticsAPI.getUserAnalytics({
        period: '30d',
        include: 'profile_views,whatsapp_clicks,leads,qr_scans,nfc_taps,social_clicks'
      })

      if (analyticsResponse.data.success) {
        const analyticsData = analyticsResponse.data.data
        
        setStats({
          profileViews: analyticsData.profileViews || 0,
          whatsappClicks: analyticsData.whatsappClicks || 0,
          totalLeads: analyticsData.totalLeads || 0,
          qrScans: analyticsData.qrScans || 0,
          nfcTaps: analyticsData.nfcTaps || 0,
          socialClicks: analyticsData.socialClicks || 0
        })

        // Set recent activity from analytics
        if (analyticsData.recentActivity) {
          setRecentActivity(analyticsData.recentActivity.map(activity => ({
            type: activity.type,
            message: getActivityMessage(activity.type),
            time: formatTimeAgo(activity.timestamp),
            emoji: getActivityEmoji(activity.type),
            color: getActivityColor(activity.type)
          })))
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      
      // Fallback to zero data if API fails
      setStats({
        profileViews: 0,
        whatsappClicks: 0,
        totalLeads: 0,
        qrScans: 0,
        nfcTaps: 0,
        socialClicks: 0
      })
      
      setRecentActivity([])
      
      toast.error('Analytics data unavailable - Backend connection failed')
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityMessage = (type) => {
    const messages = {
      'profile_view': 'Someone viewed your profile',
      'whatsapp_click': 'WhatsApp contact clicked',
      'qr_scan': 'QR code scanned',
      'lead_captured': 'New lead captured',
      'nfc_tap': 'NFC card tapped',
      'social_click': 'Social media link clicked',
      'email_click': 'Email link clicked',
      'phone_click': 'Phone number clicked'
    }
    return messages[type] || 'Activity recorded'
  }

  const getActivityEmoji = (type) => {
    const emojis = {
      'profile_view': '👀',
      'whatsapp_click': '📞',
      'qr_scan': '📎',
      'lead_captured': '🎯',
      'nfc_tap': '💳',
      'social_click': '📱',
      'email_click': '✉️',
      'phone_click': '📞'
    }
    return emojis[type] || '📊'
  }

  const getActivityColor = (type) => {
    const colors = {
      'profile_view': 'bg-blue-500',
      'whatsapp_click': 'bg-green-500',
      'qr_scan': 'bg-purple-500',
      'lead_captured': 'bg-orange-500',
      'nfc_tap': 'bg-indigo-500',
      'social_click': 'bg-pink-500',
      'email_click': 'bg-gray-500',
      'phone_click': 'bg-teal-500'
    }
    return colors[type] || 'bg-gray-500'
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now - time) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
    return `${Math.floor(diffInMinutes / 1440)} days ago`
  }

  const statCards = [
    {
      title: 'Profile Views',
      value: stats.profileViews,
      emoji: '👀',
      change: '+12%',
      changeType: 'positive',
      description: 'Total profile visits',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'WhatsApp Clicks',
      value: stats.whatsappClicks,
      emoji: '📞',
      change: '+24%',
      changeType: 'positive',
      description: 'WhatsApp interactions',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      emoji: '📥',
      change: '+8%',
      changeType: 'positive',
      description: 'Captured leads',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'QR Scans',
      value: stats.qrScans,
      emoji: '📎',
      change: '+18%',
      changeType: 'positive',
      description: 'QR code scans',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const quickActions = [
    {
      title: 'Update Profile',
      description: 'Edit your digital profile',
      icon: Settings,
      emoji: '🙋‍♂️',
      href: '/app/dashboard/profile',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'View Analytics',
      description: 'Check your performance',
      icon: BarChart3,
      emoji: '📊',
      href: '/app/dashboard/analytics',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Shop Cards',
      description: 'Buy NFC cards',
      icon: ShoppingBag,
      emoji: '💳',
      href: '/app/dashboard/shop',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ]

  const getGreeting = () => {
    const hour = new Date().getHours()
    const firstName = user?.name?.split(' ')[0] || 'User'
    const roleTitle = isTapOnnUser ? ' 👑' : ''
    
    let timeGreeting
    if (hour < 12) timeGreeting = `🌅 Good Morning, ${firstName}${roleTitle}!`
    else if (hour < 17) timeGreeting = `☀️ Good Afternoon, ${firstName}${roleTitle}!`
    else timeGreeting = `🌙 Good Evening, ${firstName}${roleTitle}!`
    
    return timeGreeting
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getGreeting()}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your digital profile today 📈
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 lg:mt-0 flex items-center space-x-3"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <Clock className="inline w-4 h-4 mr-1" />
            Last updated: {formatTime(new Date())}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchDashboardData}
            className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Refresh Data</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
            className="card p-6 relative overflow-hidden group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                  {stat.emoji}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    <CountUp end={stat.value} duration={2} separator="," />
                  </p>
                </div>
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}
              >
                {stat.change}
              </motion.div>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stat.description}
            </p>
            
            <motion.div
              className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <span>⚡</span>
                <span>Quick Actions</span>
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Manage your profile efficiently
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={action.href}
                    className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                    onClick={() => trackEvent('dashboard_action', { action: action.title })}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                        <span className="text-lg">{action.emoji}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <span>🔔</span>
              <span>Recent Activity</span>
            </h2>
            <Link
              to="/app/dashboard/analytics"
              className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className={`w-8 h-8 ${activity.color} rounded-full flex items-center justify-center text-white text-sm`}>
                  {activity.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600"
          >
            <Link
              to="/app/dashboard/analytics"
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-primary-600 hover:to-accent-600 transition-all flex items-center justify-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>View Detailed Analytics</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Profile Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <span>👁️</span>
            <span>Live Profile Preview</span>
          </h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {profile ? formatTimeAgo(profile.updatedAt) : 'Never'}
            </span>
            <Link
              to={`/profile/${profile?.username || user?.username || 'demo'}`}
              target="_blank"
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
            >
              <span>🌐</span>
              <span>View Public Profile</span>
            </Link>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {profile?.displayName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {profile?.displayName || user?.name || 'Your Name'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {profile?.jobTitle || user?.position || 'Your Position'} at {profile?.company || user?.company || 'Your Company'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                📍 {profile?.location || user?.location || 'Your Location'}
              </p>
            </div>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {profile?.bio || user?.bio || 'Add your bio to tell people about yourself and what you do. This will appear on your public profile.'}
          </p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {profile?.socialLinks?.whatsapp && (
              <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full text-xs">
                📞 WhatsApp
              </span>
            )}
            {profile?.socialLinks?.linkedin && (
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                💼 LinkedIn
              </span>
            )}
            {profile?.socialLinks?.instagram && (
              <span className="bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 px-2 py-1 rounded-full text-xs">
                📸 Instagram
              </span>
            )}
            {profile?.contactInfo?.email && (
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                ✉️ Email
              </span>
            )}
            {!profile?.socialLinks?.whatsapp && !profile?.socialLinks?.linkedin && !profile?.socialLinks?.instagram && !profile?.contactInfo?.email && (
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                Add social links to your profile
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardOverview 