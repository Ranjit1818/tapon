import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  QrCode, 
  Download, 
  Copy, 
  Printer, 
  Share2, 
  Eye,
  Palette,
  Settings,
  Zap,
  Check,
  RefreshCw,
  Smartphone,
  Monitor,
  ExternalLink
} from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import QRCodeGenerator from 'react-qr-code'
import toast from 'react-hot-toast'
import AccessDenied from '../../../components/common/AccessDenied'

const QRGenerator = () => {
  const { user, isTapOnnUser, hasPermission } = useAuth()

  // Check if user has permission to access QR Generator
  if (!isTapOnnUser || !hasPermission('qr_generate')) {
    return (
      <AccessDenied 
        title="QR Generator Access Restricted"
        message="QR code generation is exclusive to TapOnn administrators. Regular users can purchase pre-made cards with QR codes from our shop."
      />
    )
  }
  const qrRef = useRef(null)
  const [qrData, setQrData] = useState('')
  const [qrSize, setQrSize] = useState(256)
  const [qrLevel, setQrLevel] = useState('M')
  const [qrFgColor, setQrFgColor] = useState('#000000')
  const [qrBgColor, setQrBgColor] = useState('#ffffff')
  const [isGenerating, setIsGenerating] = useState(false)
  const [downloadCount, setDownloadCount] = useState(142)
  const [shareCount, setShareCount] = useState(89)

  // Initialize with user's profile URL
  useEffect(() => {
    if (user) {
      const profileUrl = `${window.location.origin}/profile/${user?.username || 'demo'}`
      setQrData(profileUrl)
    }
  }, [user])

  const presetUrls = [
    {
      label: 'My Profile',
      url: `${window.location.origin}/profile/${user?.username || 'demo'}`,
      emoji: '👤',
      description: 'Your public TapOnn profile'
    },
    {
      label: 'WhatsApp',
      url: `https://wa.me/${user?.phone?.replace(/\D/g, '') || '1234567890'}`,
      emoji: '📞',
      description: 'Direct WhatsApp chat'
    },
    {
      label: 'Email',
      url: `mailto:${user?.email || 'hello@taponn.com'}`,
      emoji: '✉️',
      description: 'Send email directly'
    },
    {
      label: 'LinkedIn',
      url: user?.socialLinks?.linkedin || 'https://linkedin.com',
      emoji: '💼',
      description: 'LinkedIn profile'
    }
  ]

  const qrSizes = [
    { label: 'Small', value: 200, emoji: '📱' },
    { label: 'Medium', value: 256, emoji: '💻' },
    { label: 'Large', value: 512, emoji: '🖥️' },
    { label: 'Print', value: 1024, emoji: '🖨️' }
  ]

  const errorLevels = [
    { label: 'Low (L)', value: 'L', description: '~7% recovery' },
    { label: 'Medium (M)', value: 'M', description: '~15% recovery' },
    { label: 'Quartile (Q)', value: 'Q', description: '~25% recovery' },
    { label: 'High (H)', value: 'H', description: '~30% recovery' }
  ]

  const colorPresets = [
    { name: 'Classic', fg: '#000000', bg: '#ffffff', emoji: '⚫' },
    { name: 'Inverse', fg: '#ffffff', bg: '#000000', emoji: '⚪' },
    { name: 'Blue', fg: '#1E40AF', bg: '#EFF6FF', emoji: '🔵' },
    { name: 'Green', fg: '#059669', bg: '#ECFDF5', emoji: '🟢' },
    { name: 'Purple', fg: '#7C3AED', bg: '#F3E8FF', emoji: '🟣' },
    { name: 'Orange', fg: '#EA580C', bg: '#FFF7ED', emoji: '🟠' }
  ]

  const handlePresetSelect = (url) => {
    setQrData(url)
    toast.success('🎯 URL preset applied!')
  }

  const handleColorPreset = (preset) => {
    setQrFgColor(preset.fg)
    setQrBgColor(preset.bg)
    toast.success(`${preset.emoji} ${preset.name} colors applied!`)
  }

  const downloadQR = async () => {
    setIsGenerating(true)
    
    try {
      // Create a temporary canvas to draw the QR code
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Set canvas size
      canvas.width = qrSize
      canvas.height = qrSize
      
      // Fill background
      ctx.fillStyle = qrBgColor
      ctx.fillRect(0, 0, qrSize, qrSize)
      
      // Create QR code SVG
      const svg = qrRef.current.querySelector('svg')
      const svgData = new XMLSerializer().serializeToString(svg)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)
      
      // Load SVG as image and draw to canvas
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, qrSize, qrSize)
        
        // Download the canvas as PNG
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `taponn-qr-${Date.now()}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
          
          setDownloadCount(prev => prev + 1)
          toast.success('📥 QR Code downloaded successfully!')
        })
        
        URL.revokeObjectURL(svgUrl)
      }
      img.src = svgUrl
    } catch (error) {
      toast.error('Failed to download QR code')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyQRLink = async () => {
    try {
      await navigator.clipboard.writeText(qrData)
      toast.success('📋 Link copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const printQR = () => {
    const printWindow = window.open('', '_blank')
    const qrElement = qrRef.current
    
    if (qrElement && printWindow) {
      const svg = qrElement.querySelector('svg')
      const svgData = new XMLSerializer().serializeToString(svg)
      
      printWindow.document.write(`
        <html>
          <head>
            <title>TapOnn QR Code - ${user?.name || 'User'}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
              }
              .qr-container {
                margin: 20px auto;
                max-width: 400px;
              }
              .info {
                margin-top: 20px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <h1>TapOnn Digital Profile</h1>
            <h2>${user?.name || 'User Profile'}</h2>
            <div class="qr-container">
              ${svgData}
            </div>
            <div class="info">
              <p>Scan this QR code to view the digital profile</p>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
              <p>Powered by TapOnn.com</p>
            </div>
          </body>
        </html>
      `)
      
      printWindow.document.close()
      printWindow.print()
      toast.success('🖨️ Print dialog opened!')
    }
  }

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My TapOnn Digital Profile',
          text: 'Check out my digital profile on TapOnn!',
          url: qrData
        })
        setShareCount(prev => prev + 1)
        toast.success('📤 Shared successfully!')
      } catch (error) {
        copyQRLink() // Fallback to copy
      }
    } else {
      copyQRLink() // Fallback to copy
    }
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
            <span>📎</span>
            <span>QR Code Generator</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate, customize, and share QR codes for your digital profile
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 lg:mt-0 flex items-center space-x-4"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400">
            📥 {downloadCount} downloads • 📤 {shareCount} shares
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <span>👁️</span>
              <span>Live Preview</span>
            </h2>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open(qrData, '_blank')}
                className="p-2 text-gray-500 hover:text-primary-500 transition-colors"
                title="Preview URL"
              >
                <ExternalLink className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setQrData(qrData + '?refresh=' + Date.now())
                  toast.success('🔄 QR Code refreshed!')
                }}
                className="p-2 text-gray-500 hover:text-primary-500 transition-colors"
                title="Refresh QR"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          
          {/* QR Code Display */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              ref={qrRef}
              className="p-4 bg-white rounded-lg shadow-lg"
              style={{ backgroundColor: qrBgColor }}
            >
              {qrData && (
                <QRCodeGenerator
                  value={qrData}
                  size={qrSize}
                  level={qrLevel}
                  fgColor={qrFgColor}
                  bgColor={qrBgColor}
                />
              )}
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={downloadQR}
              disabled={isGenerating}
              className="flex flex-col items-center space-y-2 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              <span className="text-xs font-medium">📥 Download</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={copyQRLink}
              className="flex flex-col items-center space-y-2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Copy className="w-5 h-5" />
              <span className="text-xs font-medium">📋 Copy</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={printQR}
              className="flex flex-col items-center space-y-2 p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              <Printer className="w-5 h-5" />
              <span className="text-xs font-medium">🖨️ Print</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={shareQR}
              className="flex flex-col items-center space-y-2 p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-xs font-medium">📤 Share</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Customization Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* URL Input */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <span>🔗</span>
              <span>URL Content</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter URL or Text
                </label>
                <textarea
                  value={qrData}
                  onChange={(e) => setQrData(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 resize-none"
                  rows={3}
                  placeholder="Enter the URL or text for your QR code..."
                />
              </div>

              {/* Preset URLs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quick Presets
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {presetUrls.map((preset, index) => (
                    <motion.button
                      key={preset.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePresetSelect(preset.url)}
                      className="p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-lg">{preset.emoji}</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {preset.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {preset.description}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Size & Quality Settings */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <span>📐</span>
              <span>Size & Quality</span>
            </h3>
            
            <div className="space-y-4">
              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Size
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {qrSizes.map((size) => (
                    <motion.button
                      key={size.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setQrSize(size.value)}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        qrSize === size.value
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{size.emoji}</span>
                        <span>{size.label}</span>
                      </div>
                      <div className="text-xs opacity-75">
                        {size.value}px
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Error Correction Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Error Correction
                </label>
                <select
                  value={qrLevel}
                  onChange={(e) => setQrLevel(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
                >
                  {errorLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label} - {level.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Color Customization */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <span>🎨</span>
              <span>Colors</span>
            </h3>
            
            <div className="space-y-4">
              {/* Color Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color Presets
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {colorPresets.map((preset) => (
                    <motion.button
                      key={preset.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleColorPreset(preset)}
                      className="p-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-primary-500 transition-colors"
                      style={{ backgroundColor: preset.bg }}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: preset.fg }}
                        />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {preset.emoji} {preset.name}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Foreground
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={qrFgColor}
                      onChange={(e) => setQrFgColor(e.target.value)}
                      className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={qrFgColor}
                      onChange={(e) => setQrFgColor(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Background
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="w-10 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Usage Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <span>💡</span>
          <span>Tips for Better QR Codes</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">📱</span>
              <h4 className="font-medium text-blue-900 dark:text-blue-300">Mobile Friendly</h4>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Use Medium or Large sizes for mobile scanning. Small QR codes may be hard to scan.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">🎨</span>
              <h4 className="font-medium text-green-900 dark:text-green-300">Color Contrast</h4>
            </div>
            <p className="text-sm text-green-700 dark:text-green-400">
              Ensure good contrast between foreground and background colors for better readability.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">🛡️</span>
              <h4 className="font-medium text-purple-900 dark:text-purple-300">Error Correction</h4>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-400">
              Higher error correction allows scanning even if part of the QR code is damaged.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default QRGenerator 