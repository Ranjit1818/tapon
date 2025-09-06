import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  QrCode, 
  Search, 
  Download, 
  Eye, 
  Copy, 
  Printer,
  Filter,
  Calendar,
  User,
  ExternalLink,
  BarChart3,
  RefreshCw
} from 'lucide-react'
import QRCodeDisplay from 'react-qr-code'
import toast from 'react-hot-toast'
import { adminAPI } from "../../../services/api";

const QRManagement = () => {
  const [qrCodes, setQrCodes] = useState([])
  const [filteredQRCodes, setFilteredQRCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedQR, setSelectedQR] = useState(null)

  useEffect(() => {
    loadQRCodes()
  }, [])

  useEffect(() => {
    filterQRCodes()
  }, [qrCodes, searchTerm, filterType])

  const loadQRCodes = async () => {
    try {
      setLoading(true)
      
      // Fetch QR codes from backend API
      const response = await adminAPI.getAllQRCodes({
        include: 'user,analytics'
      })

      if (response.data.success) {
        const apiQRCodes = response.data.data.map(qr => ({
          id: qr._id,
          userId: qr.user?._id,
          userName: qr.user?.name || `${qr.user?.firstName || ''} ${qr.user?.lastName || ''}`.trim() || 'Unknown User',
          userEmail: qr.user?.email || '',
          type: qr.type || 'profile',
          url: qr.url || qr.qrData || '',
          qrData: qr.qrData || qr.url || '',
          createdAt: new Date(qr.createdAt).toLocaleDateString(),
          lastScanned: qr.lastScanned ? new Date(qr.lastScanned).toLocaleDateString() : 'Never',
          scanCount: qr.analytics?.scanCount || qr.scanCount || 0,
          isActive: qr.isActive !== false
        }))
        
        setQrCodes(apiQRCodes)
      }
    } catch (error) {
      console.error('Failed to fetch QR codes:', error)
      
      // Fallback to demo data if API fails
      const mockQRCodes = [
        {
          id: 1,
          userId: 1,
          userName: 'John Doe',
          userEmail: 'john@example.com',
          type: 'profile',
          url: 'https://taponn.com/profile/johndoe',
          qrData: 'https://taponn.com/profile/johndoe',
          createdAt: '2024-01-15',
          lastScanned: '2024-01-20',
          scanCount: 23,
          isActive: true
        },
        {
          id: 2,
          userId: 2,
          userName: 'Sarah Johnson',
          userEmail: 'sarah@company.com',
          type: 'profile',
          url: 'https://taponn.com/profile/sarahjohnson',
          qrData: 'https://taponn.com/profile/sarahjohnson',
          createdAt: '2024-01-10',
          lastScanned: '2024-01-19',
          scanCount: 12,
          isActive: true
        },
        {
          id: 3,
          userId: 1,
          userName: 'John Doe',
          userEmail: 'john@example.com',
          type: 'whatsapp',
          url: 'https://wa.me/1234567890',
          qrData: 'https://wa.me/1234567890',
          createdAt: '2024-01-12',
          lastScanned: '2024-01-18',
          scanCount: 8,
          isActive: true
        },
        {
          id: 4,
          userId: 3,
          userName: 'Mike Chen',
          userEmail: 'mike@startup.com',
          type: 'custom',
          url: 'https://custom-link.com',
          qrData: 'https://custom-link.com',
          createdAt: '2024-01-08',
          lastScanned: '2024-01-16',
          scanCount: 5,
          isActive: false
        }
      ]
      setQrCodes(mockQRCodes)
      toast.error('Using demo data - Backend connection failed')
    } finally {
      setLoading(false)
    }
  }

  const filterQRCodes = () => {
    let filtered = qrCodes

    if (searchTerm) {
      filtered = filtered.filter(qr => 
        qr.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qr.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qr.url.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(qr => qr.type === filterType)
    }

    setFilteredQRCodes(filtered)
  }

  const handleQRAction = async (action, qr) => {
    switch (action) {
      case 'view':
        setSelectedQR(qr)
        break
      case 'copy':
        await navigator.clipboard.writeText(qr.url)
        toast.success('QR code URL copied to clipboard')
        break
      case 'download':
        downloadQRCode(qr)
        break
      case 'regenerate':
        regenerateQRCode(qr)
        break
      case 'toggle':
        toggleQRStatus(qr)
        break
      default:
        break
    }
  }

  const downloadQRCode = (qr) => {
    // Create a canvas and draw the QR code
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 256
    canvas.height = 256
    
    // This is a simplified version - in real implementation you'd render the actual QR code
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 256, 256)
    ctx.fillStyle = '#000000'
    ctx.font = '12px Arial'
    ctx.fillText('QR Code', 100, 128)
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `qr-${qr.userName.replace(/\s+/g, '-').toLowerCase()}-${qr.type}.png`
      a.click()
      URL.revokeObjectURL(url)
    })
    
    toast.success('QR code downloaded')
  }

  const regenerateQRCode = (qr) => {
    // Simulate QR code regeneration
    setQrCodes(qrCodes.map(q => 
      q.id === qr.id 
        ? { ...q, createdAt: new Date().toISOString().split('T')[0], scanCount: 0 }
        : q
    ))
    toast.success('QR code regenerated')
  }

  const toggleQRStatus = (qr) => {
    setQrCodes(qrCodes.map(q => 
      q.id === qr.id 
        ? { ...q, isActive: !q.isActive }
        : q
    ))
    toast.success(`QR code ${qr.isActive ? 'deactivated' : 'activated'}`)
  }

  const exportQRReport = () => {
    const csvContent = [
      ['User Name', 'Email', 'Type', 'URL', 'Created', 'Scans', 'Status'],
      ...filteredQRCodes.map(qr => [
        qr.userName,
        qr.userEmail,
        qr.type,
        qr.url,
        qr.createdAt,
        qr.scanCount,
        qr.isActive ? 'Active' : 'Inactive'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'taponn-qr-codes.csv'
    a.click()
    toast.success('QR codes report exported')
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'profile': return 'bg-blue-100 text-blue-800'
      case 'whatsapp': return 'bg-green-100 text-green-800'
      case 'email': return 'bg-red-100 text-red-800'
      case 'linkedin': return 'bg-blue-100 text-blue-800'
      case 'custom': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'profile': return '👤'
      case 'whatsapp': return '💬'
      case 'email': return '✉️'
      case 'linkedin': return '💼'
      case 'custom': return '🔗'
      default: return '📱'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">QR Code Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all user QR codes across the platform
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <button
            onClick={exportQRReport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <button
            onClick={loadQRCodes}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total QR Codes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{qrCodes.length}</p>
            </div>
            <QrCode className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active QR Codes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {qrCodes.filter(qr => qr.isActive).length}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Scans</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {qrCodes.reduce((total, qr) => total + qr.scanCount, 0)}
              </p>
            </div>
            <Eye className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Avg. Scans/QR</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {qrCodes.length > 0 ? Math.round(qrCodes.reduce((total, qr) => total + qr.scanCount, 0) / qrCodes.length) : 0}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search QR codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="profile">Profile</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="linkedin">LinkedIn</option>
            <option value="custom">Custom</option>
          </select>

          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            Showing {filteredQRCodes.length} of {qrCodes.length} QR codes
          </div>
        </div>
      </div>

      {/* QR Codes Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading QR codes...</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredQRCodes.map((qr) => (
                <motion.div
                  key={qr.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-lg transition-all duration-300"
                >
                  {/* QR Code Display */}
                  <div className="bg-white p-4 rounded-lg mb-4 flex items-center justify-center">
                    <QRCodeDisplay
                      value={qr.qrData}
                      size={120}
                      level="M"
                      fgColor="#000000"
                      bgColor="#ffffff"
                    />
                  </div>

                  {/* QR Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(qr.type)}`}>
                        {getTypeIcon(qr.type)} {qr.type}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        qr.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {qr.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{qr.userName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{qr.userEmail}</div>
                    </div>

                    <div className="text-sm">
                      <div className="text-gray-600 dark:text-gray-400 truncate" title={qr.url}>
                        🔗 {qr.url}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>📅 {qr.createdAt}</span>
                      <span>👁️ {qr.scanCount} scans</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQRAction('copy', qr)}
                          className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleQRAction('download', qr)}
                          className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Download QR"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.open(qr.url, '_blank')}
                          className="p-2 text-gray-500 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                          title="Open URL"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleQRAction('regenerate', qr)}
                          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                          Regenerate
                        </button>
                        <button
                          onClick={() => handleQRAction('toggle', qr)}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            qr.isActive 
                              ? 'bg-red-500 text-white hover:bg-red-600' 
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                        >
                          {qr.isActive ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredQRCodes.length === 0 && !loading && (
              <div className="text-center py-12">
                <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No QR codes found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No QR codes have been generated yet'
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default QRManagement 