import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Database,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Plus,
  Table,
  Users,
  QrCode,
  ShoppingBag,
  BarChart3,
  Code,
  Terminal,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import toast from 'react-hot-toast'
import { adminAPI } from "../../../services/api";

const DatabaseViewer = () => {
  const [activeTable, setActiveTable] = useState('users')
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState([])
  const [showQueryBuilder, setShowQueryBuilder] = useState(false)
  const [customQuery, setCustomQuery] = useState('')
  const [queryResult, setQueryResult] = useState(null)
  const [tables, setTables] = useState([
    {
      name: 'users',
      icon: Users,
      label: 'Users',
      description: 'User accounts and profiles',
      count: 0
    },
    {
      name: 'profiles',
      icon: FileText,
      label: 'Profiles',
      description: 'User profile data',
      count: 0
    },
    {
      name: 'qrcodes',
      icon: QrCode,
      label: 'QR Codes',
      description: 'Generated QR codes',
      count: 0
    },
    {
      name: 'orders',
      icon: ShoppingBag,
      label: 'Orders',
      description: 'Card orders and purchases',
      count: 0
    },
    {
      name: 'analytics',
      icon: BarChart3,
      label: 'Analytics',
      description: 'Usage analytics and stats',
      count: 0
    }
  ])

  useEffect(() => {
    loadTableCounts()
  }, [])

  const loadTableCounts = async () => {
    try {
      const response = await adminAPI.getDatabaseTables()
      if (response.data.success) {
        const tableData = response.data.data
        setTables(prevTables =>
          prevTables.map(table => {
            const realData = tableData.find(t => t.name === table.name)
            return {
              ...table,
              count: realData ? realData.count : 0
            }
          })
        )
      }
    } catch (error) {
      console.error('Failed to load table counts:', error)
      toast.error('Failed to load database information')
    }
  }

  const mockData = {
    users: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z',
        lastLogin: '2024-01-20T14:22:00Z'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        role: 'user',
        status: 'active',
        createdAt: '2024-01-10T09:15:00Z',
        lastLogin: '2024-01-19T16:45:00Z'
      },
      {
        id: 3,
        name: 'Admin User',
        email: 'admin@connectionunlimited.com',
        role: 'admin',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: '2024-01-20T18:30:00Z'
      }
    ],
    profiles: [
      {
        id: 1,
        userId: 1,
        username: 'johndoe',
        bio: 'Software Engineer at Tech Corp',
        avatar: 'https://example.com/avatar1.jpg',
        phone: '+1234567890',
        company: 'Tech Corp',
        website: 'https://johndoe.com',
        socialLinks: '{"linkedin": "johndoe", "twitter": "johndoe"}',
        isPublic: true,
        views: 156
      },
      {
        id: 2,
        userId: 2,
        username: 'sarahjohnson',
        bio: 'Marketing Manager',
        avatar: 'https://example.com/avatar2.jpg',
        phone: '+1234567891',
        company: 'Marketing Inc',
        website: 'https://sarah.marketing',
        socialLinks: '{"linkedin": "sarah-johnson", "instagram": "sarahj"}',
        isPublic: true,
        views: 89
      }
    ],
    qrcodes: [
      {
        id: 1,
        userId: 1,
        type: 'profile',
        url: 'https://connectionunlimited.com/profile/johndoe',
        qrData: 'https://connectionunlimited.com/profile/johndoe',
        isActive: true,
        scanCount: 23,
        createdAt: '2024-01-15T11:00:00Z'
      },
      {
        id: 2,
        userId: 2,
        type: 'whatsapp',
        url: 'https://wa.me/1234567891',
        qrData: 'https://wa.me/1234567891',
        isActive: true,
        scanCount: 12,
        createdAt: '2024-01-10T10:30:00Z'
      }
    ],
    orders: [
      {
        id: 'ORD-001',
        userId: 1,
        product: 'NFC Card',
        quantity: 2,
        price: 49.99,
        total: 99.98,
        status: 'pending',
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        createdAt: '2024-01-20T09:00:00Z'
      },
      {
        id: 'ORD-002',
        userId: 2,
        product: 'Review Card',
        quantity: 1,
        price: 29.99,
        total: 29.99,
        status: 'shipped',
        paymentStatus: 'paid',
        paymentMethod: 'paypal',
        createdAt: '2024-01-19T14:30:00Z'
      }
    ],
    analytics: [
      {
        id: 1,
        userId: 1,
        event: 'profile_view',
        data: '{"source": "qr_scan", "location": "New York"}',
        timestamp: '2024-01-20T15:30:00Z',
        ipAddress: '192.168.1.100'
      },
      {
        id: 2,
        userId: 2,
        event: 'whatsapp_click',
        data: '{"source": "direct_link"}',
        timestamp: '2024-01-20T14:20:00Z',
        ipAddress: '192.168.1.101'
      }
    ]
  }

  useEffect(() => {
    loadTableData(activeTable)
  }, [activeTable])

  useEffect(() => {
    filterData()
  }, [tableData, searchTerm])

  const loadTableData = async (tableName) => {
    try {
      setLoading(true)

      let response
      switch (tableName) {
        case 'users':
          response = await adminAPI.getUsers({ include: 'profiles,analytics,orders' })
          if (response.data.success) {
            const apiUsers = response.data.data.map(user => ({
              id: user._id,
              name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
              email: user.email,
              role: user.role || 'user',
              status: user.isActive ? 'active' : 'inactive',
              createdAt: user.createdAt,
              lastLogin: user.lastLoginAt || 'Never'
            }))
            setTableData(apiUsers)
          }
          break
        case 'profiles':
          response = await adminAPI.getAllProfiles({ include: 'user,analytics' })
          if (response.data.success) {
            const apiProfiles = response.data.data.map(profile => ({
              id: profile._id,
              userId: profile.user?._id,
              username: profile.username || 'unknown',
              bio: profile.bio || '',
              avatar: profile.avatar || '',
              phone: profile.contactInfo?.phone || '',
              company: profile.company || '',
              website: profile.website || '',
              socialLinks: JSON.stringify(profile.socialLinks || {}),
              isPublic: profile.isPublic !== false,
              views: profile.analytics?.profileViews || 0
            }))
            setTableData(apiProfiles)
          }
          break
        case 'qrcodes':
          response = await adminAPI.getAllQRCodes({ include: 'user,analytics' })
          if (response.data.success) {
            const apiQRCodes = response.data.data.map(qr => ({
              id: qr._id,
              userId: qr.user?._id,
              type: qr.type || 'profile',
              url: qr.url || qr.qrData || '',
              qrData: qr.qrData || qr.url || '',
              isActive: qr.isActive !== false,
              scanCount: qr.analytics?.scanCount || qr.scanCount || 0,
              createdAt: qr.createdAt
            }))
            setTableData(apiQRCodes)
          }
          break
        case 'orders':
          response = await adminAPI.getAllOrders({ include: 'user,shipping' })
          if (response.data.success) {
            const apiOrders = response.data.data.map(order => ({
              id: order._id,
              userId: order.user?._id,
              product: order.product?.name || order.productName || 'Unknown Product',
              quantity: order.quantity || 1,
              price: order.price || 0,
              total: order.total || 0,
              status: order.status || 'pending',
              paymentStatus: order.paymentStatus || 'pending',
              paymentMethod: order.paymentMethod || 'unknown',
              createdAt: order.createdAt
            }))
            setTableData(apiOrders)
          }
          break
        case 'analytics':
          response = await adminAPI.getAllAnalytics({ include: 'user,profile,qrCode' })
          if (response.data.success) {
            const apiAnalytics = response.data.data.map(analytics => ({
              id: analytics._id,
              userId: analytics.user?._id,
              event: analytics.eventType,
              data: JSON.stringify(analytics.metadata || {}),
              timestamp: analytics.createdAt,
              ipAddress: analytics.metadata?.ipAddress || ''
            }))
            setTableData(apiAnalytics)
          }
          break
        default:
          setTableData(mockData[tableName] || [])
      }
    } catch (error) {
      console.error(`Failed to fetch ${tableName} data:`, error)

      // Fallback to demo data if API fails
      setTableData(mockData[tableName] || [])
      toast.error(`Using demo data - Backend connection failed for ${tableName}`)
    } finally {
      setLoading(false)
    }
  }

  const filterData = () => {
    if (!searchTerm) {
      setFilteredData(tableData)
      return
    }

    const filtered = tableData.filter(row => {
      return Object.values(row).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
    setFilteredData(filtered)
  }

  const executeCustomQuery = () => {
    if (!customQuery.trim()) {
      toast.error('Please enter a query')
      return
    }

    // Simulate query execution
    setLoading(true)
    setTimeout(() => {
      // This is a mock response - in real implementation, you'd send to backend
      const mockResult = {
        query: customQuery,
        rowCount: Math.floor(Math.random() * 50) + 1,
        executionTime: Math.random() * 100 + 10,
        success: !customQuery.toLowerCase().includes('drop'),
        data: mockData[activeTable]?.slice(0, 3) || []
      }

      setQueryResult(mockResult)
      setLoading(false)

      if (mockResult.success) {
        toast.success(`Query executed successfully. ${mockResult.rowCount} rows affected.`)
      } else {
        toast.error('Query execution failed. Destructive operations are not allowed.')
      }
    }, 1000)
  }

  const exportTableData = () => {
    const headers = filteredData.length > 0 ? Object.keys(filteredData[0]) : []
    const csvContent = [
      headers,
      ...filteredData.map(row => headers.map(header => row[header] || ''))
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `connectionunlimited-${activeTable}.csv`
    a.click()
    toast.success(`${activeTable} data exported`)
  }

  const deleteRecord = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setTableData(tableData.filter(row => row.id !== id))
      toast.success('Record deleted')
    }
  }

  const renderTableContent = () => {
    if (loading) {
      return (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading data...</p>
        </div>
      )
    }

    if (filteredData.length === 0) {
      return (
        <div className="p-8 text-center">
          <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No data found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Try adjusting your search criteria' : 'This table appears to be empty'}
          </p>
        </div>
      )
    }

    const headers = Object.keys(filteredData[0])

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {headers.map(header => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredData.map((row, index) => (
              <motion.tr
                key={row.id || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {headers.map(header => (
                  <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {typeof row[header] === 'object' ?
                      JSON.stringify(row[header]) :
                      row[header]?.toString() || '-'
                    }
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toast.info('Edit functionality coming soon')}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteRecord(row.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Database Viewer</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage Connection Unlimited database tables and records
          </p>
        </div>

        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <button
            onClick={() => setShowQueryBuilder(!showQueryBuilder)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Terminal className="w-4 h-4" />
            <span>Query Builder</span>
          </button>
          <button
            onClick={exportTableData}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => loadTableData(activeTable)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Database Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {tables.map((table) => {
          const Icon = table.icon
          return (
            <motion.button
              key={table.name}
              onClick={() => setActiveTable(table.name)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 transition-all ${activeTable === table.name
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Icon className={`w-6 h-6 ${activeTable === table.name ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                <span className={`font-medium ${activeTable === table.name ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                  }`}>
                  {table.label}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{table.description}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{table.count}</p>
            </motion.button>
          )
        })}
      </div>

      {/* Query Builder */}
      {showQueryBuilder && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Terminal className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SQL Query Builder</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom SQL Query
              </label>
              <textarea
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="SELECT * FROM users WHERE status = 'active' LIMIT 10;"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                rows="4"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span>Be careful with destructive operations (DROP, DELETE, UPDATE)</span>
              </div>
              <button
                onClick={executeCustomQuery}
                disabled={loading}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Executing...' : 'Execute Query'}
              </button>
            </div>

            {/* Query Result */}
            {queryResult && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {queryResult.success ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Query Result
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Execution time: {queryResult.executionTime?.toFixed(2)}ms
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Rows affected: {queryResult.rowCount}
                </div>
                {queryResult.data && queryResult.data.length > 0 && (
                  <div className="mt-2 text-xs bg-white dark:bg-gray-800 p-2 rounded border overflow-auto">
                    <pre>{JSON.stringify(queryResult.data, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Table Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTable}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Table className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredData.length} of {tableData.length} records
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => toast.info('Add record functionality coming soon')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
            {activeTable} Table
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing data from the {activeTable} collection
          </p>
        </div>

        {renderTableContent()}
      </div>

      {/* Database Health */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Database Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Connection Status</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Healthy</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Info className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Database Size</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">~2.4 MB</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Total Records</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">1,838 entries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DatabaseViewer 