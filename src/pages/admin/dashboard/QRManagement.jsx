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
import QRCode from 'qrcode'
import toast from 'react-hot-toast'
import { adminAPI } from "../../../services/api";

const QRManagement = () => {
  const [qrCodes, setQrCodes] = useState([])
  const [filteredQRCodes, setFilteredQRCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedQR, setSelectedQR] = useState(null)
  const [users, setUsers] = useState([])
  const [userIdToUsername, setUserIdToUsername] = useState({})
  const [userProfileMap, setUserProfileMap] = useState({}) // userId -> profileId
  const [qrCodesByUser, setQrCodesByUser] = useState({}) // userId -> qrCode data

  useEffect(() => {
    loadQRCodes()
    loadUsersForQR()
  }, [])

  useEffect(() => {
    filterQRCodes()
  }, [qrCodes, searchTerm, filterType])

  useEffect(() => {
    // Reload QR codes when qrCodesByUser changes to update the user QR display
    if (Object.keys(qrCodesByUser).length > 0) {
      // QR codes are already loaded, just trigger a re-render
    }
  }, [qrCodesByUser])

  const loadQRCodes = async () => {
    try {
      setLoading(true)

      // Fetch QR codes from backend API
      const response = await adminAPI.getAllQRCodes({
        include: 'user,analytics',
        limit: 1000
      })

      if (response.data.success) {
        const apiQRCodes = response.data.data
          .filter(qr => qr && qr._id) // Filter out any invalid entries
          .map(qr => ({
            id: qr._id,
            userId: qr.user?._id || qr.user || null,
            userName: qr.user?.name || qr.profile?.displayName || 'Unknown User',
            userEmail: qr.user?.email || '',
            type: qr.type || 'profile',
            url: qr.url || qr.qrData || '',
            qrData: qr.qrData || qr.url || '',
            createdAt: qr.createdAt ? new Date(qr.createdAt).toLocaleDateString() : 'N/A',
            lastScanned: qr.lastScanned ? new Date(qr.lastScanned).toLocaleDateString() : 'Never',
            scanCount: qr.analytics?.scanCount || qr.scanCount || 0,
            isActive: qr.isActive !== false
          }))

        console.log(`✅ Loaded ${apiQRCodes.length} QR codes from API`)
        setQrCodes(apiQRCodes)

        // Create a map of userId -> QR code for quick lookup
        const qrMap = {}
        apiQRCodes.forEach(qr => {
          if (qr.userId) {
            qrMap[qr.userId] = qr
          }
        })
        setQrCodesByUser(qrMap)
      } else {
        console.error('API returned error:', response.data.message)
        toast.error('Failed to load QR codes')
      }
    } catch (error) {
      console.error('Failed to fetch QR codes:', error)
      toast.error('Failed to load QR codes')

      // Fallback to demo data if API fails
      const mockQRCodes = [
        {
          id: 1,
          userId: 1,
          userName: 'John Doe',
          userEmail: 'john@example.com',
          type: 'profile',
          url: 'https://connectionunlimited.com/profile/johndoe',
          qrData: 'https://connectionunlimited.com/profile/johndoe',
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
          url: 'https://connectionunlimited.com/profile/sarahjohnson',
          qrData: 'https://connectionunlimited.com/profile/sarahjohnson',
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

  const loadUsersForQR = async () => {
    try {
      const usersRes = await adminAPI.getUsers({ limit: 1000 })
      if (usersRes.data?.success) {
        const apiUsers = usersRes.data.data.map(u => ({
          id: u._id,
          name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown User',
          email: u.email
        }))
        setUsers(apiUsers)
      }

      const profilesRes = await adminAPI.getAllProfiles({ limit: 1000 })
      if (profilesRes.data?.success) {
        const usernameMap = {}
        const profileMap = {}
        for (const p of profilesRes.data.data) {
          if (p.user?._id) {
            if (p.username) usernameMap[p.user._id] = p.username
            profileMap[p.user._id] = p._id // Map userId to profileId
          }
        }
        setUserIdToUsername(usernameMap)
        setUserProfileMap(profileMap)
      }
    } catch (e) {
      console.error('Failed to load users/profiles for QR:', e)
    }
  }

  const getProfileUrl = (userId) => {
    // First check if user has a username
    const username = userIdToUsername[userId]
    if (username) {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
      return `${origin}/p/${username}`
    }

    // If no username, check if we have a QR code with profile ID
    const qrCode = qrCodesByUser[userId]
    if (qrCode && qrCode.qrData) {
      return qrCode.qrData
    }

    // If we have a profile ID, use that
    const profileId = userProfileMap[userId]
    if (profileId) {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
      return `${origin}/p/${profileId}`
    }

    return ''
  }

  const downloadQrSvg = (domId, filenameBase) => {
    const svg = document.getElementById(domId)
    if (!svg) return toast.error('QR not ready')
    const serializer = new XMLSerializer()
    const source = serializer.serializeToString(svg)
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filenameBase}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('QR downloaded')
  }

  const printQrSvg = (domId, title = 'Connection Unlimited QR Code', subtitle = 'Digital Profile') => {
    const svg = document.getElementById(domId)
    if (!svg) return toast.error('QR not ready')
    const serializer = new XMLSerializer()
    const svgData = serializer.serializeToString(svg)

    const printWindow = window.open('', '_blank', 'noopener,noreferrer')
    if (!printWindow) return toast.error('Popup blocked. Allow popups to print.')

    printWindow.document.open()
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8" />
          <style>
            @page { size: A4; margin: 20mm; }
            html, body { height: 100%; }
            body { font-family: Arial, sans-serif; color: #111; }
            .wrap { max-width: 700px; margin: 0 auto; }
            .heading { text-align: center; margin-bottom: 12mm; }
            .brand { font-size: 12px; letter-spacing: 2px; color: #2563eb; text-transform: uppercase; }
            .title { font-size: 28px; font-weight: 700; margin: 6px 0 2px; }
            .subtitle { font-size: 14px; color: #6b7280; }
            .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16mm; }
            .qr { display: flex; justify-content: center; margin: 6mm 0 8mm; }
            .qr svg { width: 80mm; height: 80mm; }
            .meta { text-align: center; font-size: 12px; color: #6b7280; }
            .meta p { margin: 2mm 0; }
            .footer { margin-top: 10mm; text-align: center; font-size: 11px; color: #9ca3af; }
            .link { color: #2563eb; word-break: break-all; }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="heading">
              <div class="brand">Connection Unlimited</div>
              <div class="title">${title}</div>
              <div class="subtitle">${subtitle}</div>
            </div>
            <div class="card">
              <div class="qr">${svgData}</div>
              <div class="meta">
                <p>Scan to view the digital profile</p>
                <p>Generated on: ${new Date().toLocaleString()}</p>
              </div>
            </div>
            <div class="footer">© ${new Date().getFullYear()} connectionunlimited.com • Smart Digital Profiles</div>
          </div>
          <script>
            window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 150); };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
    toast.success('Print preview opened')
  }

  // --- PDF download (no extra build-time deps; loads jsPDF at runtime) ---
  const ensureJsPDF = async () => {
    if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF
    await new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
      s.onload = resolve
      s.onerror = reject
      document.head.appendChild(s)
    })
    return window.jspdf.jsPDF
  }

  const svgToCanvas = (svgElement, sizePx = 512) => new Promise((resolve, reject) => {
    try {
      const serializer = new XMLSerializer()
      const svgData = serializer.serializeToString(svgElement)
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = sizePx
        canvas.height = sizePx
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, sizePx, sizePx)
        ctx.drawImage(img, 0, 0, sizePx, sizePx)
        resolve(canvas)
      }
      img.onerror = reject
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData)
    } catch (e) { reject(e) }
  })

  const downloadQrPdf = async (domId, filenameBase, userName = 'User', urlText = '') => {
    const svg = document.getElementById(domId)
    if (!svg) return toast.error('QR not ready')
    try {
      const jsPDF = await ensureJsPDF()
      const canvas = await svgToCanvas(svg, 800)
      const imgData = canvas.toDataURL('image/png')
      // A4 Portrait in mm
      const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
      // Margins and layout
      const margin = 15
      const pageWidth = doc.internal.pageSize.getWidth()
      let y = margin
      doc.setTextColor(37, 99, 235)
      doc.setFontSize(11)
      doc.text('Connection Unlimited', pageWidth / 2, y, { align: 'center' })
      y += 6
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(20)
      doc.text('Digital Profile QR Code', pageWidth / 2, y, { align: 'center' })
      y += 8
      doc.setFontSize(12)
      doc.setTextColor(107, 114, 128)
      doc.text(userName, pageWidth / 2, y, { align: 'center' })
      y += 10
      // QR image centered
      const qrSize = 120
      const x = (pageWidth - qrSize) / 2
      doc.addImage(imgData, 'PNG', x, y, qrSize, qrSize)
      y += qrSize + 10
      doc.setTextColor(107, 114, 128)
      doc.setFontSize(10)
      if (urlText) doc.textWithLink(urlText, pageWidth / 2, y, { align: 'center', url: urlText })
      y += 8
      doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, y, { align: 'center' })
      y += 10
      doc.setFontSize(9)
      doc.text(`© ${new Date().getFullYear()} ConnectionUnlimited.com • Smart Digital Profiles`, pageWidth / 2, y, { align: 'center' })
      doc.save(`${filenameBase}.pdf`)
      toast.success('PDF downloaded')
    } catch (e) {
      console.error(e)
      toast.error('Failed to create PDF')
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

  const downloadQRCode = async (qr) => {
    try {
      // Use the backend API to get the QR code image
      const response = await adminAPI.getQRCodeById(qr._id)
      if (response.data?.success) {
        const qrData = response.data.data.qrData

        // Create QR code using qrcode library
        const canvas = document.createElement('canvas')
        await QRCode.toCanvas(canvas, qrData, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })

        // Convert to blob and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `qr-${qr.userName?.replace(/\s+/g, '-').toLowerCase() || 'user'}-${qr.type || 'profile'}.png`
          a.click()
          URL.revokeObjectURL(url)
        })

        toast.success('QR code downloaded')
      } else {
        toast.error('Failed to download QR code')
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download QR code')
    }
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

  const handleGenerateMissingQRCodes = async () => {
    try {
      toast.loading('Generating missing QR codes...', { id: 'generate-qr' })
      const response = await adminAPI.generateMissingQRCodes()
      if (response.data.success) {
        const { qrCodesCreated, qrCodesSkipped, totalProfiles, errors } = response.data.data
        toast.success(
          `Generated ${qrCodesCreated} QR codes. ${qrCodesSkipped} already existed out of ${totalProfiles} profiles.${errors && errors.length > 0 ? ` ${errors.length} errors occurred.` : ''}`,
          { id: 'generate-qr', duration: 5000 }
        )
        // Reload QR codes and users to show newly generated ones
        await Promise.all([
          loadQRCodes(),
          loadUsersForQR()
        ])
      } else {
        toast.error('Failed to generate missing QR codes', { id: 'generate-qr' })
      }
    } catch (error) {
      console.error('Failed to generate missing QR codes:', error)
      toast.error(error.response?.data?.message || 'Failed to generate missing QR codes', { id: 'generate-qr' })
    }
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
    a.download = 'connectionunlimited-qr-codes.csv'
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
            onClick={handleGenerateMissingQRCodes}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <QrCode className="w-4 h-4" />
            <span>Generate Missing QR Codes</span>
          </button>
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

      {/* User Profile QR Codes */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">User Profile QR Codes</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">{users.length} users</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map(u => {
            const url = getProfileUrl(u.id)
            const hasUrl = !!url
            const hasUsername = !!userIdToUsername[u.id]
            const qrCode = qrCodesByUser[u.id]
            const domId = `user-qr-${u.id}`
            const filename = (u.name || 'user').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-qr'
            return (
              <div key={u.id} className="card p-4 flex flex-col items-center">
                <div className="text-center mb-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{u.email}</div>
                  {!hasUsername && (
                    <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">No username</div>
                  )}
                </div>
                <div className="bg-white p-2 rounded mb-3">
                  {hasUrl ? (
                    <QRCodeDisplay id={domId} value={url} size={128} level="M" />
                  ) : (
                    <div className="w-[128px] h-[128px] flex flex-col items-center justify-center text-xs text-gray-400 border-2 border-dashed border-gray-300 rounded">
                      <QrCode className="w-8 h-8 mb-1 opacity-50" />
                      <span>No QR Code</span>
                      <span className="text-[10px] mt-1">Generate Missing</span>
                    </div>
                  )}
                </div>
                <div className="w-full flex items-center justify-center space-x-2">
                  {hasUrl ? (
                    <>
                      <button
                        onClick={() => downloadQrSvg(domId, filename)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                      >
                        <Download className="w-3 h-3 mr-1" /> SVG
                      </button>
                      <button
                        onClick={() => downloadQrPdf(domId, filename, u.name, url)}
                        className="inline-flex items-center px-3 py-1.5 bg-gray-700 text-white rounded hover:bg-gray-800 text-xs"
                      >
                        <span className="mr-1">⬇️</span> PDF
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleGenerateMissingQRCodes}
                      className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 text-xs"
                    >
                      <QrCode className="w-3 h-3 mr-1" />
                      Generate QR
                    </button>
                  )}
                </div>
              </div>
            )
          })}
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
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${qr.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                          className={`px-3 py-1 text-xs rounded transition-colors ${qr.isActive
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