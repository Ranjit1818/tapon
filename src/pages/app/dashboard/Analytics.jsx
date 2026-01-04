import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Crown,
  Zap,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Globe
} from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { analyticsAPI } from '../../../services/api'
import AccessDenied from '../../../components/common/AccessDenied'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { useAnalytics } from '../../../contexts/AnalyticsContext'
import toast from 'react-hot-toast'

const Analytics = () => {
  const { user, isConnectionUnlimitedUser, hasPermission } = useAuth()
  const { trackEvent } = useAnalytics()

  // Helper function to get emoji for click types
  const getClickEmoji = (elementName) => {
    const emojiMap = {
      'whatsapp': '📱',
      'email': '📧',
      'phone': '📞',
      'linkedin': '💼',
      'instagram': '📷',
      'twitter': '🐦',
      'facebook': '👥',
      'website': '🌐',
      'location': '📍',
      'youtube': '📺',
      'tiktok': '🎵',
      'snapchat': '👻',
      'telegram': '✈️'
    };
    return emojiMap[elementName] || '🔗';
  };

  // Check if user has permission to access Analytics
  if (!isConnectionUnlimitedUser) {
    return (
      <AccessDenied
        title="Login Required"
        message="Please log in to access analytics."
      />
    )
  }

  const [timeRange, setTimeRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({
    overview: {},
    visitData: [],
    clickData: [],
    deviceData: [],
    timeData: [],
    elementRankings: [],
    elementPerformance: [],
    referrers: [],
    browsers: [],
    languages: []
  })

  const fetchAnalyticsData = async () => {
    const token = localStorage.getItem('connectionunlimited-token')
    if (!user || !token) {
      toast.error('Cannot fetch analytics: user or token missing')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)

      const response = await analyticsAPI.getUserAnalytics({
        period: timeRange || '30d',
        include: 'profile_views,whatsapp_clicks,leads,qr_scans,nfc_taps,social_clicks'
      })

      console.log('✅ API Response:', response.data)

      const analyticsData = response.data.data || response.data
      console.log('📊 Full API Response:', response.data)
      console.log('📊 Analytics Data:', analyticsData)
      console.log('📊 Visits Data:', analyticsData?.visits)
      console.log('📊 Clicks Data:', analyticsData?.clicks)
      console.log('📊 Device Data:', analyticsData?.devices)
      console.log('📊 Element Rankings:', analyticsData?.elementRankings)
      console.log('📊 Element Performance:', analyticsData?.elementPerformance)

      // The backend already formats the data correctly, so we can use it directly
      console.log('📊 Using backend formatted data directly')

      const newData = {
        overview: {
          totalViews: analyticsData?.overview?.totalViews || 0,
          totalClicks: analyticsData?.overview?.totalClicks || 0,
          totalEngagements: analyticsData?.overview?.totalEngagements || 0,
          uniqueVisitors: analyticsData?.overview?.uniqueVisitors || 0,
          engagementRate: analyticsData?.overview?.engagementRate || 0,
          averageTime: analyticsData?.overview?.averageTime || '0m 0s',
          bounceRate: analyticsData?.overview?.bounceRate || 0,
          avgViewsPerSession: analyticsData?.overview?.avgViewsPerSession || 0
        },
        visitData: analyticsData?.visits || [],
        clickData: analyticsData?.clicks || [],
        deviceData: analyticsData?.devices || [],
        timeData: analyticsData?.time || [],
        elementRankings: analyticsData?.elementRankings || [],
        elementPerformance: analyticsData?.elementPerformance || [],
        referrers: analyticsData?.referrers || [],
        browsers: analyticsData?.browsers || [],
        languages: analyticsData?.languages || []
      }

      console.log('📊 Setting new data:', newData)
      console.log('📊 Visit Data Length:', newData.visitData.length)
      console.log('📊 Click Data Length:', newData.clickData.length)
      console.log('📊 Device Data Length:', newData.deviceData.length)
      console.log('📊 Element Rankings Length:', newData.elementRankings.length)
      console.log('📊 Visit Data Sample:', newData.visitData[0])
      console.log('📊 Click Data Sample:', newData.clickData[0])
      console.log('📊 Device Data Sample:', newData.deviceData[0])

      setData(newData)
    } catch (error) {
      console.error('❌ Analytics fetch failed:', error)
      toast.error('Using demo data - Backend connection failed')

      // fallback demo data with real structure
      console.log('📊 Using fallback demo data')
      setData({
        overview: {
          totalViews: 10,
          totalClicks: 38,
          totalEngagements: 38,
          uniqueVisitors: 8,
          engagementRate: 380.0,
          averageTime: '2m 34s',
          bounceRate: 20.0,
          avgViewsPerSession: 1.2
        },
        visitData: [
          { date: '2025-10-12', views: 10, clicks: 0 }
        ],
        clickData: [
          { name: 'whatsapp', clicks: 8, emoji: '📱' },
          { name: 'email', clicks: 7, emoji: '📧' },
          { name: 'linkedin', clicks: 6, emoji: '💼' },
          { name: 'phone', clicks: 5, emoji: '📞' },
          { name: 'instagram', clicks: 4, emoji: '📷' },
          { name: 'website', clicks: 3, emoji: '🌐' },
          { name: 'twitter', clicks: 2, emoji: '🐦' },
          { name: 'location', clicks: 2, emoji: '📍' },
          { name: 'facebook', clicks: 1, emoji: '👥' }
        ],
        deviceData: [
          { name: 'Tablet', value: 40, emoji: '📱' },
          { name: 'Desktop', value: 40, emoji: '💻' },
          { name: 'Mobile', value: 20, emoji: '📱' }
        ],
        timeData: [
          { hour: '07', views: 10 }
        ],
        elementRankings: [
          { rank: 1, elementType: 'social_link_click', elementName: 'whatsapp', clicks: 8, emoji: '📱' },
          { rank: 2, elementType: 'contact_click', elementName: 'email', clicks: 7, emoji: '📧' },
          { rank: 3, elementType: 'social_link_click', elementName: 'linkedin', clicks: 6, emoji: '💼' },
          { rank: 4, elementType: 'contact_click', elementName: 'phone', clicks: 5, emoji: '📞' },
          { rank: 5, elementType: 'social_link_click', elementName: 'instagram', clicks: 4, emoji: '📷' },
          { rank: 6, elementType: 'contact_click', elementName: 'website', clicks: 3, emoji: '🌐' },
          { rank: 7, elementType: 'social_link_click', elementName: 'twitter', clicks: 2, emoji: '🐦' },
          { rank: 8, elementType: 'contact_click', elementName: 'location', clicks: 2, emoji: '📍' },
          { rank: 9, elementType: 'social_link_click', elementName: 'facebook', clicks: 1, emoji: '👥' }
        ],
        elementPerformance: [
          { elementName: 'whatsapp', totalClicks: 8, uniqueSessions: 3, avgClicksPerSession: 2.67 },
          { elementName: 'email', totalClicks: 7, uniqueSessions: 2, avgClicksPerSession: 3.5 },
          { elementName: 'linkedin', totalClicks: 6, uniqueSessions: 2, avgClicksPerSession: 3.0 }
        ],
        referrers: [
          { source: 'Direct', count: 8, percentage: 80.0 },
          { source: 'QR Code', count: 2, percentage: 20.0 }
        ],
        browsers: [
          { name: 'Chrome', count: 6, percentage: 60.0 },
          { name: 'Safari', count: 4, percentage: 40.0 }
        ],
        languages: [
          { code: 'en-US', count: 8, percentage: 80.0 },
          { code: 'hi-IN', count: 2, percentage: 20.0 }
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('connectionunlimited-token')
    if (user && token) {
      fetchAnalyticsData()
    }
  }, [timeRange, user])

  // Auto-refresh analytics every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('connectionunlimited-token')
      if (user && token) {
        fetchAnalyticsData()
      }
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [user])

  // Time range options
  const timeRanges = [
    { value: '7d', label: 'Last 7 days', emoji: '📅' },
    { value: '30d', label: 'Last 30 days', emoji: '📊' },
    { value: '90d', label: 'Last 90 days', emoji: '📈' },
    { value: '1y', label: 'Last year', emoji: '🗓️' }
  ]

  // Overview cards data
  const overviewCards = [
    {
      title: 'Total Views',
      value: data.overview.totalViews,
      change: '+12%',
      changeType: 'positive',
      description: 'Profile views this period',
      color: 'from-blue-500 to-blue-600',
      emoji: '👁️'
    },
    {
      title: 'Unique Visitors',
      value: data.overview.uniqueVisitors,
      change: '+8%',
      changeType: 'positive',
      description: 'Unique people who viewed',
      color: 'from-green-500 to-green-600',
      emoji: '👥'
    },
    {
      title: 'Engagement Rate',
      value: `${data.overview.engagementRate}%`,
      change: '+15%',
      changeType: 'positive',
      description: 'Views that resulted in clicks',
      color: 'from-purple-500 to-purple-600',
      emoji: '🎯'
    },
    {
      title: 'Avg. Session Time',
      value: data.overview.averageTime,
      change: '+2.1%',
      changeType: 'positive',
      description: 'Time spent on profile',
      color: 'from-orange-500 to-orange-600',
      emoji: '⏱️'
    }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const getMostPopularContact = () => {
    const sorted = [...data.clickData].sort((a, b) => b.clicks - a.clicks)
    return sorted[0] || {}
  }

  const getPeakHour = () => {
    const sorted = [...data.timeData].sort((a, b) => b.views - a.views)
    return sorted[0]?.hour || '00'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
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
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center space-x-3">
            <span>📊</span>
            <span>Analytics Dashboard</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your profile performance and visitor insights
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 lg:mt-0 flex items-center space-x-4"
        >
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.emoji} {range.label}
              </option>
            ))}
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchAnalyticsData}
            className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {overviewCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -5 }}
            className="card p-6 relative overflow-hidden group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                  {card.emoji}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {card.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                  </p>
                </div>
              </div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${card.changeType === 'positive'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                {card.change}
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {card.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <span>📈</span>
              <span>Profile Views Trend</span>
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Peak at {getPeakHour()}:00
            </div>
          </div>

          {data.visitData && data.visitData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300} key={`visits-${data.visitData.length}`}>
              <AreaChart data={data.visitData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis className="text-gray-600 dark:text-gray-400" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#3B82F6"
                  fill="url(#colorViews)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#10B981"
                  fill="url(#colorClicks)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <span className="text-4xl mb-2 block">📊</span>
                <p>No visit data available</p>
                <p className="text-sm">Visit data will appear as people view your profile</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Contact Clicks Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <span>📊</span>
              <span>Contact Method Clicks</span>
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Crown className="w-4 h-4" />
              <span>{getMostPopularContact().name}</span>
            </div>
          </div>

          {data.clickData && data.clickData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300} key={`clicks-${data.clickData.length}`}>
              <BarChart data={data.clickData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" className="text-gray-600 dark:text-gray-400" />
                <YAxis
                  type="category"
                  dataKey="name"
                  className="text-gray-600 dark:text-gray-400"
                  tickFormatter={(value, index) => `${data.clickData[index]?.emoji} ${value}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {data.emoji} {data.name}
                          </p>
                          <p className="text-sm text-primary-500">
                            {data.clicks} clicks
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="clicks"
                  fill="#8884d8"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <span className="text-4xl mb-2 block">📊</span>
                <p>No click data available</p>
                <p className="text-sm">Click data will appear when people interact with your profile</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <span>📱</span>
            <span>Device Types</span>
          </h2>

          {data.deviceData && data.deviceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200} key={`devices-${data.deviceData.length}`}>
              <PieChart>
                <Pie
                  data={data.deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B'][index]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {data.emoji} {data.name}
                          </p>
                          <p className="text-sm text-primary-500">
                            {data.value}%
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <span className="text-4xl mb-2 block">📱</span>
                <p>No device data available</p>
                <p className="text-sm">Device data will appear as visitors access your profile</p>
              </div>
            </div>
          )}

          <div className="space-y-2 mt-4">
            {data.deviceData.map((device, index) => (
              <div key={device.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'][index] }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {device.emoji} {device.name}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {device.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Profile Element Rankings - Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <span>🏆</span>
            <span>Most Clicked Elements</span>
          </h2>

          {data.elementRankings && data.elementRankings.length > 0 ? (
            <div className="space-y-6">
              {/* Bar Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%" key={`rankings-${data.elementRankings.length}`}>
                  <BarChart data={data.elementRankings.slice(0, 8)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="elementName"
                      className="text-gray-600 dark:text-gray-400"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis className="text-gray-600 dark:text-gray-400" />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-2xl">{getClickEmoji(label)}</span>
                                <span className="font-semibold text-gray-900 dark:text-white capitalize">
                                  {label}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Clicks:</span> {payload[0].value}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Rank:</span> #{data.rank}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="clicks"
                      fill="#3B82F6"
                      radius={[4, 4, 0, 0]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Ranking List */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ranking Details</h3>
                {data.elementRankings.slice(0, 10).map((element, index) => {
                  const rank = index + 1;
                  const emoji = getClickEmoji(element.elementName);
                  return (
                    <motion.div
                      key={`${element.elementType}-${element.elementName}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-bold ${rank === 1 ? 'text-yellow-500' :
                            rank === 2 ? 'text-gray-400' :
                              rank === 3 ? 'text-orange-500' :
                                'text-primary-500'
                            }`}>
                            #{rank}
                          </span>
                          <span className="text-xl">{emoji}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white capitalize">
                            {element.elementName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {element.elementType.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {element.clicks}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {element.clicks === 1 ? 'click' : 'clicks'}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <span className="text-4xl mb-2 block">📊</span>
              <p>No click data available yet</p>
              <p className="text-sm">Visit your profile and click on elements to see rankings</p>
            </div>
          )}
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <span>💡</span>
            <span>Key Insights</span>
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">👑</span>
                <h4 className="font-medium text-blue-900 dark:text-blue-300">Most Popular</h4>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                {getMostPopularContact().emoji} {getMostPopularContact().name} gets the most clicks ({getMostPopularContact().clicks} total)
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">⏰</span>
                <h4 className="font-medium text-green-900 dark:text-green-300">Peak Time</h4>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">
                Most views happen at {getPeakHour()}:00. Consider posting content around this time.
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">📱</span>
                <h4 className="font-medium text-purple-900 dark:text-purple-300">Mobile First</h4>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-400">
                {data.deviceData[0]?.value || 68}% of visitors use mobile devices. Ensure your profile looks great on mobile!
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Time-based Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
          <span>🕐</span>
          <span>Views by Hour</span>
        </h2>

        {data.timeData && data.timeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200} key={`time-${data.timeData.length}`}>
            <BarChart data={data.timeData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="hour"
                className="text-gray-600 dark:text-gray-400"
                tickFormatter={(value) => `${value}:00`}
              />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="views"
                fill="#8B5CF6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <span className="text-4xl mb-2 block">🕐</span>
              <p>No time data available</p>
              <p className="text-sm">Time-based data will appear as visitors access your profile</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Traffic Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="card p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
          <span>🌐</span>
          <span>Traffic Sources</span>
        </h2>

        {data.referrers && data.referrers.length > 0 ? (
          <div className="space-y-4">
            {data.referrers.map((referrer, index) => (
              <div key={referrer.source} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{index === 0 ? '🎯' : '🔗'}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {referrer.source}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {referrer.percentage}% of traffic
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {referrer.count}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    visits
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <span className="text-4xl mb-2 block">🌐</span>
            <p>No traffic source data available</p>
            <p className="text-sm">Traffic sources will appear as visitors come to your profile</p>
          </div>
        )}
      </motion.div>

      {/* Browser Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="card p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
          <span>🌐</span>
          <span>Browser Analytics</span>
        </h2>

        {data.browsers && data.browsers.length > 0 ? (
          <div className="space-y-4">
            {data.browsers.map((browser, index) => (
              <div key={browser.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {browser.name}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${browser.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                    {browser.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <span className="text-4xl mb-2 block">🌐</span>
            <p>No browser data available</p>
            <p className="text-sm">Browser information will appear as visitors access your profile</p>
          </div>
        )}
      </motion.div>

      {/* Element Performance Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="card p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
          <span>📊</span>
          <span>Element Performance</span>
        </h2>

        {data.elementPerformance && data.elementPerformance.length > 0 ? (
          <div className="space-y-4">
            {data.elementPerformance.map((element, index) => (
              <motion.div
                key={element.elementName}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white capitalize">
                    {element.elementName}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {element.totalClicks} total clicks
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Unique Sessions</p>
                    <p className="font-medium text-gray-900 dark:text-white">{element.uniqueSessions}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Avg per Session</p>
                    <p className="font-medium text-gray-900 dark:text-white">{element.avgClicksPerSession}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Last Clicked</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {element.lastInteraction ? new Date(element.lastInteraction).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <span className="text-4xl mb-2 block">📊</span>
            <p>No performance data available</p>
            <p className="text-sm">Element performance metrics will appear as users interact with your profile</p>
          </div>
        )}
      </motion.div>

      {/* Business Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="card p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
          <span>💡</span>
          <span>Business Insights</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">📊</span>
              <h4 className="font-medium text-blue-900 dark:text-blue-300">Engagement Quality</h4>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              {data.overview.engagementRate}% of visitors engage with your content.
              {data.overview.engagementRate > 20 ? ' Excellent engagement!' : ' Consider improving your call-to-actions.'}
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">⏱️</span>
              <h4 className="font-medium text-green-900 dark:text-green-300">Session Quality</h4>
            </div>
            <p className="text-sm text-green-700 dark:text-green-400">
              Average session time is {data.overview.averageTime}.
              {data.overview.avgViewsPerSession > 1.5 ? ' Visitors are exploring multiple pages!' : ' Consider adding more engaging content.'}
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">🎯</span>
              <h4 className="font-medium text-purple-900 dark:text-purple-300">Audience Reach</h4>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-400">
              You have {data.overview.uniqueVisitors} unique visitors.
              {data.overview.uniqueVisitors > 100 ? ' Great reach!' : ' Focus on increasing visibility.'}
            </p>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">🏆</span>
              <h4 className="font-medium text-orange-900 dark:text-orange-300">Top Performer</h4>
            </div>
            <p className="text-sm text-orange-700 dark:text-orange-400">
              {data.elementRankings[0]?.elementName || 'WhatsApp'} is your most clicked element with {data.elementRankings[0]?.clicks || 0} clicks.
              {data.elementRankings[0]?.clicks > 10 ? ' Great engagement!' : ' Consider promoting this element more.'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Analytics 