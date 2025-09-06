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
  const { user, isTapOnnUser, hasPermission } = useAuth()
  const { trackEvent } = useAnalytics()

  // Check if user has permission to access Analytics
  if (!isTapOnnUser || !hasPermission('analytics')) {
    return (
      <AccessDenied 
        title="Analytics Access Restricted"
        message="Advanced analytics and performance tracking is exclusive to TapOnn administrators."
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
    locationData: [],
    timeData: []
  })

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch analytics data from backend
      const response = await analyticsAPI.getUserAnalytics({
        period: timeRange,
        include: 'overview,visits,clicks,devices,locations,time'
      })

      if (response.data.success) {
        const analyticsData = response.data.data
        
        setData({
          overview: {
            totalViews: analyticsData.overview?.totalViews || 0,
            totalClicks: analyticsData.overview?.totalClicks || 0,
            totalLeads: analyticsData.overview?.totalLeads || 0,
            conversionRate: analyticsData.overview?.conversionRate || 0,
            averageTime: analyticsData.overview?.averageTime || '0m 0s',
            bounceRate: analyticsData.overview?.bounceRate || 0
          },
          visitData: analyticsData.visits || [
            { date: '2024-01-01', views: 45, clicks: 12 },
            { date: '2024-01-02', views: 52, clicks: 18 },
            { date: '2024-01-03', views: 38, clicks: 8 },
            { date: '2024-01-04', views: 73, clicks: 25 },
            { date: '2024-01-05', views: 89, clicks: 32 },
            { date: '2024-01-06', views: 156, clicks: 67 },
            { date: '2024-01-07', views: 198, clicks: 89 }
          ],
          clickData: analyticsData.clicks || [
            { name: 'WhatsApp', clicks: 156, emoji: '📞', color: '#25D366' },
            { name: 'LinkedIn', clicks: 89, emoji: '💼', color: '#0077B5' },
            { name: 'Email', clicks: 67, emoji: '✉️', color: '#EA4335' },
            { name: 'Instagram', clicks: 45, emoji: '📸', color: '#E4405F' },
            { name: 'Website', clicks: 34, emoji: '🌐', color: '#666666' },
            { name: 'Phone', clicks: 23, emoji: '📱', color: '#34C759' }
          ],
          deviceData: analyticsData.devices || [
            { name: 'Mobile', value: 68, emoji: '📱' },
            { name: 'Desktop', value: 25, emoji: '💻' },
            { name: 'Tablet', value: 7, emoji: '📱' }
          ],
          locationData: analyticsData.locations || [
            { country: 'India', city: 'Mumbai', views: 345, emoji: '🇮🇳' },
            { country: 'USA', city: 'New York', views: 234, emoji: '🇺🇸' },
            { country: 'UK', city: 'London', views: 156, emoji: '🇬🇧' },
            { country: 'Canada', city: 'Toronto', views: 123, emoji: '🇨🇦' },
            { country: 'Australia', city: 'Sydney', views: 89, emoji: '🇦🇺' }
          ],
          timeData: analyticsData.time || [
            { hour: '00', views: 12 },
            { hour: '01', views: 8 },
            { hour: '02', views: 5 },
            { hour: '03', views: 3 },
            { hour: '04', views: 7 },
            { hour: '05', views: 15 },
            { hour: '06', views: 25 },
            { hour: '07', views: 45 },
            { hour: '08', views: 67 },
            { hour: '09', views: 89 },
            { hour: '10', views: 98 },
            { hour: '11', views: 87 },
            { hour: '12', views: 76 },
            { hour: '13', views: 65 },
            { hour: '14', views: 78 },
            { hour: '15', views: 89 },
            { hour: '16', views: 95 },
            { hour: '17', views: 102 },
            { hour: '18', views: 87 },
            { hour: '19', views: 65 },
            { hour: '20', views: 43 },
            { hour: '21', views: 32 },
            { hour: '22', views: 21 },
            { hour: '23', views: 16 }
          ]
        })
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
      
      // Fallback to demo data if API fails
      setData({
        overview: {
          totalViews: 1247,
          totalClicks: 456,
          totalLeads: 89,
          conversionRate: 7.1,
          averageTime: '2m 34s',
          bounceRate: 23.4
        },
        visitData: [
          { date: '2024-01-01', views: 45, clicks: 12 },
          { date: '2024-01-02', views: 52, clicks: 18 },
          { date: '2024-01-03', views: 38, clicks: 8 },
          { date: '2024-01-04', views: 73, clicks: 25 },
          { date: '2024-01-05', views: 89, clicks: 32 },
          { date: '2024-01-06', views: 156, clicks: 67 },
          { date: '2024-01-07', views: 198, clicks: 89 }
        ],
        clickData: [
          { name: 'WhatsApp', clicks: 156, emoji: '📞', color: '#25D366' },
          { name: 'LinkedIn', clicks: 89, emoji: '💼', color: '#0077B5' },
          { name: 'Email', clicks: 67, emoji: '✉️', color: '#EA4335' },
          { name: 'Instagram', clicks: 45, emoji: '📸', color: '#E4405F' },
          { name: 'Website', clicks: 34, emoji: '🌐', color: '#666666' },
          { name: 'Phone', clicks: 23, emoji: '📱', color: '#34C759' }
        ],
        deviceData: [
          { name: 'Mobile', value: 68, emoji: '📱' },
          { name: 'Desktop', value: 25, emoji: '💻' },
          { name: 'Tablet', value: 7, emoji: '📱' }
        ],
        locationData: [
          { country: 'India', city: 'Mumbai', views: 345, emoji: '🇮🇳' },
          { country: 'USA', city: 'New York', views: 234, emoji: '🇺🇸' },
          { country: 'UK', city: 'London', views: 156, emoji: '🇬🇧' },
          { country: 'Canada', city: 'Toronto', views: 123, emoji: '🇨🇦' },
          { country: 'Australia', city: 'Sydney', views: 89, emoji: '🇦🇺' }
        ],
        timeData: [
          { hour: '00', views: 12 },
          { hour: '01', views: 8 },
          { hour: '02', views: 5 },
          { hour: '03', views: 3 },
          { hour: '04', views: 7 },
          { hour: '05', views: 15 },
          { hour: '06', views: 25 },
          { hour: '07', views: 45 },
          { hour: '08', views: 67 },
          { hour: '09', views: 89 },
          { hour: '10', views: 98 },
          { hour: '11', views: 87 },
          { hour: '12', views: 76 },
          { hour: '13', views: 65 },
          { hour: '14', views: 78 },
          { hour: '15', views: 89 },
          { hour: '16', views: 95 },
          { hour: '17', views: 102 },
          { hour: '18', views: 87 },
          { hour: '19', views: 65 },
          { hour: '20', views: 43 },
          { hour: '21', views: 32 },
          { hour: '22', views: 21 },
          { hour: '23', views: 16 }
        ]
      })
      
      toast.error('Using demo data - Backend connection failed')
    } finally {
      setIsLoading(false)
    }
  }

  const timeRanges = [
    { label: 'Last 7 days', value: '7d', emoji: '📅' },
    { label: 'Last 30 days', value: '30d', emoji: '📆' },
    { label: 'Last 3 months', value: '3m', emoji: '🗓️' },
    { label: 'Last year', value: '1y', emoji: '📊' }
  ]

  const overviewCards = [
    {
      title: 'Total Views',
      value: data.overview.totalViews,
      emoji: '👀',
      change: '+12.5%',
      changeType: 'positive',
      description: 'Profile visits',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Total Clicks',
      value: data.overview.totalClicks,
      emoji: '🖱️',
      change: '+8.3%',
      changeType: 'positive',
      description: 'Contact interactions',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Generated Leads',
      value: data.overview.totalLeads,
      emoji: '🎯',
      change: '+15.2%',
      changeType: 'positive',
      description: 'Captured contacts',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Conversion Rate',
      value: `${data.overview.conversionRate}%`,
      emoji: '📈',
      change: '+2.1%',
      changeType: 'positive',
      description: 'Views to clicks',
      color: 'from-purple-500 to-pink-500'
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
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                card.changeType === 'positive' 
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
          
          <ResponsiveContainer width="100%" height={300}>
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
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
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
          
          <ResponsiveContainer width="100%" height={300}>
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
          
          <ResponsiveContainer width="100%" height={200}>
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

        {/* Top Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <span>🌍</span>
            <span>Top Locations</span>
          </h2>
          
          <div className="space-y-4">
            {data.locationData.map((location, index) => (
              <motion.div
                key={location.country}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{location.emoji}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {location.city}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {location.country}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">
                    {location.views}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    views
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
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
        
        <ResponsiveContainer width="100%" height={200}>
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
      </motion.div>
    </div>
  )
}

export default Analytics 