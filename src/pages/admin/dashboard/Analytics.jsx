import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Users,
  QrCode,
  ShoppingBag,
  Eye,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

import toast from 'react-hot-toast'

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    stats: {
      totalUsers: 0,
      activeUsers: 0,
      totalQRScans: 0,
      totalOrders: 0,
      revenue: 0,
      conversionRate: 0
    },
    userGrowthData: [],
    qrScanData: [],
    orderData: [],
    deviceData: [],
    topPagesData: [],
    revenueData: []
  })

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)

      // Fetch admin analytics data from backend
      const response = await adminAPI.getSystemAnalytics({
        period: timeRange,
        include: 'overview,users,qr_scans,orders,revenue,devices,pages'
      })

      if (response.data.success) {
        const analyticsData = response.data.data

        setData({
          stats: {
            totalUsers: analyticsData.overview?.totalUsers || 0,
            activeUsers: analyticsData.overview?.activeUsers || 0,
            totalQRScans: analyticsData.overview?.totalQRScans || 0,
            totalOrders: analyticsData.overview?.totalOrders || 0,
            revenue: analyticsData.overview?.revenue || 0,
            conversionRate: analyticsData.overview?.conversionRate || 0
          },
          userGrowthData: analyticsData.userGrowth || [
            { date: '2024-01-14', users: 120, newUsers: 5 },
            { date: '2024-01-15', users: 125, newUsers: 8 },
            { date: '2024-01-16', users: 133, newUsers: 6 },
            { date: '2024-01-17', users: 139, newUsers: 9 },
            { date: '2024-01-18', users: 148, newUsers: 7 },
            { date: '2024-01-19', users: 155, newUsers: 4 },
            { date: '2024-01-20', users: 156, newUsers: 3 }
          ],
          qrScanData: analyticsData.qrScans || [
            { date: '2024-01-14', scans: 45, unique: 38 },
            { date: '2024-01-15', scans: 52, unique: 41 },
            { date: '2024-01-16', scans: 38, unique: 32 },
            { date: '2024-01-17', scans: 67, unique: 54 },
            { date: '2024-01-18', scans: 43, unique: 35 },
            { date: '2024-01-19', scans: 56, unique: 47 },
            { date: '2024-01-20', scans: 61, unique: 52 }
          ],
          orderData: analyticsData.orders || [
            { product: 'NFC Card', orders: 45, revenue: 2247.50 },
            { product: 'Review Card', orders: 32, revenue: 959.68 },
            { product: 'Custom Card', orders: 12, revenue: 959.88 }
          ],
          deviceData: analyticsData.devices || [
            { name: 'Mobile', value: 68, color: '#3B82F6' },
            { name: 'Desktop', value: 25, color: '#10B981' },
            { name: 'Tablet', value: 7, color: '#F59E0B' }
          ],
          topPagesData: analyticsData.topPages || [
            { page: '/profile/johndoe', views: 234, bounceRate: 0.23 },
            { page: '/profile/sarahjohnson', views: 189, bounceRate: 0.31 },
            { page: '/profile/mikehen', views: 156, bounceRate: 0.28 },
            { page: '/profile/lisawang', views: 143, bounceRate: 0.35 },
            { page: '/profile/alexsmith', views: 128, bounceRate: 0.42 }
          ],
          revenueData: analyticsData.revenue || [
            { month: 'Oct', revenue: 1200, orders: 24 },
            { month: 'Nov', revenue: 1800, orders: 36 },
            { month: 'Dec', revenue: 2100, orders: 42 },
            { month: 'Jan', revenue: 2450, orders: 49 }
          ]
        })
      }
    } catch (error) {
      console.error('Failed to fetch admin analytics:', error)

      // Fallback to demo data if API fails
      setData({
        stats: {
          totalUsers: 156,
          activeUsers: 89,
          totalQRScans: 1247,
          totalOrders: 89,
          revenue: 2450.50,
          conversionRate: 12.5
        },
        userGrowthData: [
          { date: '2024-01-14', users: 120, newUsers: 5 },
          { date: '2024-01-15', users: 125, newUsers: 8 },
          { date: '2024-01-16', users: 133, newUsers: 6 },
          { date: '2024-01-17', users: 139, newUsers: 9 },
          { date: '2024-01-18', users: 148, newUsers: 7 },
          { date: '2024-01-19', users: 155, newUsers: 4 },
          { date: '2024-01-20', users: 156, newUsers: 3 }
        ],
        qrScanData: [
          { date: '2024-01-14', scans: 45, unique: 38 },
          { date: '2024-01-15', scans: 52, unique: 41 },
          { date: '2024-01-16', scans: 38, unique: 32 },
          { date: '2024-01-17', scans: 67, unique: 54 },
          { date: '2024-01-18', scans: 43, unique: 35 },
          { date: '2024-01-19', scans: 56, unique: 47 },
          { date: '2024-01-20', scans: 61, unique: 52 }
        ],
        orderData: [
          { product: 'NFC Card', orders: 45, revenue: 2247.50 },
          { product: 'Review Card', orders: 32, revenue: 959.68 },
          { product: 'Custom Card', orders: 12, revenue: 959.88 }
        ],
        deviceData: [
          { name: 'Mobile', value: 68, color: '#3B82F6' },
          { name: 'Desktop', value: 25, color: '#10B981' },
          { name: 'Tablet', value: 7, color: '#F59E0B' }
        ],
        topPagesData: [
          { page: '/profile/johndoe', views: 234, bounceRate: 0.23 },
          { page: '/profile/sarahjohnson', views: 189, bounceRate: 0.31 },
          { page: '/profile/mikehen', views: 156, bounceRate: 0.28 },
          { page: '/profile/lisawang', views: 143, bounceRate: 0.35 },
          { page: '/profile/alexsmith', views: 128, bounceRate: 0.42 }
        ],
        revenueData: [
          { month: 'Oct', revenue: 1200, orders: 24 },
          { month: 'Nov', revenue: 1800, orders: 36 },
          { month: 'Dec', revenue: 2100, orders: 42 },
          { month: 'Jan', revenue: 2450, orders: 49 }
        ]
      })

      toast.error('Using demo data - Backend connection failed')
    } finally {
      setLoading(false)
    }
  }

  const refreshData = () => {
    fetchAnalyticsData()
  }

  const exportReport = () => {
    const report = {
      timeRange,
      stats: data.stats,
      userGrowth: data.userGrowthData,
      qrScans: data.qrScanData,
      orders: data.orderData,
      revenue: data.revenueData,
      generatedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `connectionunlimited-analytics-${timeRange}.json`
    a.click()
  }

  const StatCard = ({ title, value, change, icon: Icon, color, suffix = '' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {typeof value === 'number' && suffix === '$' ? `$${value.toFixed(2)}` : value}{suffix}
          </p>
          {change && (
            <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last period
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive analytics and insights for FiindIt platform
          </p>
        </div>

        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button
            onClick={exportReport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Total Users"
          value={data.stats.totalUsers}
          change={12}
          icon={Users}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Active Users"
          value={data.stats.activeUsers}
          change={8}
          icon={TrendingUp}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="QR Scans"
          value={data.stats.totalQRScans}
          change={15}
          icon={QrCode}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Total Orders"
          value={data.stats.totalOrders}
          change={-3}
          icon={ShoppingBag}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
        <StatCard
          title="Revenue"
          value={data.stats.revenue}
          change={22}
          icon={DollarSign}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          suffix="$"
        />
        <StatCard
          title="Conversion Rate"
          value={data.stats.conversionRate}
          change={5}
          icon={TrendingUp}
          color="bg-gradient-to-br from-pink-500 to-pink-600"
          suffix="%"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="newUsers" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* QR Scan Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">QR Scan Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.qrScanData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="scans" fill="#8B5CF6" />
              <Bar dataKey="unique" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Device Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.deviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
              <Line type="monotone" dataKey="orders" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Products</h3>
          <div className="space-y-3">
            {data.orderData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.product}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.orders} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">${item.revenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Profile Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Profile Pages</h3>
          <div className="space-y-3">
            {data.topPagesData.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{page.page}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{page.views} views</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${page.bounceRate < 0.3 ? 'text-green-600' :
                      page.bounceRate < 0.4 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                    {(page.bounceRate * 100).toFixed(0)}% bounce
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminAnalytics 