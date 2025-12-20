import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  Heart,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Globe,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react'
import { profileAPI, analyticsAPI } from '../services/api'
import toast from 'react-hot-toast'

const PublicProfilePage = () => {
  const { username } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedLink, setCopiedLink] = useState(false)
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    fetchProfile()
    
    // Generate session ID if not exists
    if (!sessionStorage.getItem('sessionId')) {
      sessionStorage.setItem('sessionId', Date.now().toString() + Math.random().toString(36).substr(2, 9))
    }
  }, [username])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const response = await profileAPI.getPublicProfile(username)
      
      if (response.data.success && response.data.data) {
        setProfile(response.data.data)
        // Track profile view
        trackProfileView(response.data.data._id)
      } else {
        navigate('/404')
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      navigate('/404')
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to detect device type
  const getDeviceType = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    if (/mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      return 'Mobile'
    } else if (/tablet|ipad/i.test(userAgent)) {
      return 'Tablet'
    } else {
      return 'Desktop'
    }
  }

  // Helper function to get browser info
  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Other'
  }

  // Helper function to get screen info
  const getScreenInfo = () => {
    return {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio || 1
    }
  }

  const trackProfileView = async (profileId) => {
    try {
      console.log('📊 Starting profile view tracking for:', profileId)
      
      // Get detailed device and location info
      const deviceInfo = {
        type: getDeviceType(),
        browser: getBrowserInfo(),
        screen: getScreenInfo(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
      }

      console.log('📊 Device info:', deviceInfo)

      const eventData = {
        eventType: 'profile_view',
        eventAction: 'view',
        profile: profileId,
        user: profile?.user, // Add user ID if available
        metadata: {
          source: 'direct_visit',
          timestamp: new Date().toISOString(),
          device: deviceInfo.type,
          browser: deviceInfo.browser,
          screen: deviceInfo.screen,
          language: deviceInfo.language,
          platform: deviceInfo.platform,
          referrer: document.referrer || 'direct',
          url: window.location.href,
          sessionId: sessionStorage.getItem('sessionId') || 'unknown'
        }
      }

      console.log('📊 Sending event data:', eventData)

      const response = await analyticsAPI.trackEvent(eventData)
      
      console.log('✅ Profile view tracked successfully:', response.data)
      
      // Show success message
      toast.success('Profile view tracked!')
    } catch (error) {
      console.error('❌ Failed to track profile view:', error)
      toast.error('Failed to track profile view')
    }
  }

  const trackSocialClick = async (platform, url) => {
    try {
      setIsTracking(true)
      console.log('📊 Tracking social click:', platform, url)
      console.log('📊 Profile ID:', profile?._id)
      
      if (!profile?._id) {
        console.error('❌ Profile ID not available')
        toast.error('Profile not loaded yet')
        return
      }
      
      const response = await analyticsAPI.trackEvent({
        eventType: 'social_link_click',
        eventAction: platform,
        profile: profile._id,
        user: profile.user, // Add user ID for better tracking
        metadata: {
          platform,
          url,
          timestamp: new Date().toISOString(),
          device: getDeviceType(),
          browser: getBrowserInfo(),
          sessionId: sessionStorage.getItem('sessionId') || 'unknown'
        }
      })
      console.log('✅ Social click tracked successfully:', response.data)
      
      // Show success message
      toast.success(`${platform} click tracked!`, {
        icon: '📊',
        duration: 2000
      })
      
      // Open the social link
      window.open(url, '_blank')
    } catch (error) {
      console.error('❌ Failed to track social click:', error)
      toast.error('Failed to track click')
      // Still open the link even if tracking fails
      window.open(url, '_blank')
    } finally {
      setIsTracking(false)
    }
  }

  const trackContactClick = async (type, value) => {
    try {
      console.log('📊 Tracking contact click:', type, value)
      console.log('📊 Profile ID:', profile?._id)
      
      if (!profile?._id) {
        console.error('❌ Profile ID not available')
        toast.error('Profile not loaded yet')
        return
      }
      
      const response = await analyticsAPI.trackEvent({
        eventType: 'contact_click',
        eventAction: type,
        profile: profile._id,
        user: profile.user, // Add user ID for better tracking
        metadata: {
          contactType: type,
          value,
          timestamp: new Date().toISOString(),
          device: getDeviceType(),
          browser: getBrowserInfo(),
          sessionId: sessionStorage.getItem('sessionId') || 'unknown'
        }
      })
      console.log('✅ Contact click tracked successfully:', response.data)
      
      // Show success message
      toast.success(`${type} click tracked!`, {
        icon: '📊',
        duration: 2000
      })
    } catch (error) {
      console.error('❌ Failed to track contact click:', error)
      toast.error('Failed to track click')
    }
  }

  const handleWhatsAppClick = () => {
    if (profile?.socialLinks?.whatsapp) {
      trackSocialClick('whatsapp', profile.socialLinks.whatsapp)
    }
  }

  const handleEmailClick = () => {
    if (profile?.contactInfo?.email) {
      trackContactClick('email', profile.contactInfo.email)
      window.location.href = `mailto:${profile.contactInfo.email}`
    }
  }

  const handlePhoneClick = () => {
    if (profile?.contactInfo?.phone) {
      trackContactClick('phone', profile.contactInfo.phone)
      window.location.href = `tel:${profile.contactInfo.phone}`
    }
  }

  const handleWebsiteClick = (url) => {
    trackContactClick('website', url)
    window.open(url, '_blank')
  }

  const handleLocationView = () => {
    trackContactClick('location', profile.location)
  }

  const handleSocialClick = (platform, url) => {
    trackSocialClick(platform, url)
  }

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      toast.success('Profile link copied!')
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.displayName || 'Profile'} - Digital Business Card`,
          text: `Check out ${profile?.displayName || 'this profile'}'s digital business card`,
          url: window.location.href
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      copyProfileLink()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The profile you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={shareProfile}
                className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              
              <button
                onClick={copyProfileLink}
                className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-8 text-white text-center">
            <div className="relative">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.displayName}
                    className="w-28 h-28 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold">
                    {profile.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold mb-2">{profile.displayName}</h1>
              <p className="text-xl opacity-90 mb-1">{profile.jobTitle}</p>
              <p className="text-lg opacity-75">{profile.company}</p>
              
              {profile.bio && (
                <p className="mt-4 text-sm opacity-90 max-w-2xl mx-auto leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Get In Touch
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Email */}
              {profile.contactInfo?.email && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEmailClick}
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {profile.contactInfo.email}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </motion.button>
              )}

              {/* Phone */}
              {profile.contactInfo?.phone && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePhoneClick}
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {profile.contactInfo.phone}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                </motion.button>
              )}

              {/* Location */}
              {profile.location && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={handleLocationView}
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {profile.location}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Website */}
              {profile.website && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleWebsiteClick(profile.website)}
                  className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {profile.website}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                </motion.button>
              )}
            </div>

            {/* Social Media Links */}
            {(profile.socialLinks?.whatsapp || profile.socialLinks?.linkedin || profile.socialLinks?.instagram || 
              profile.socialLinks?.twitter || profile.socialLinks?.facebook || profile.socialLinks?.youtube || 
              profile.socialLinks?.github) && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                  Connect on Social Media
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.socialLinks?.whatsapp && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleWhatsAppClick}
                      disabled={isTracking}
                      className="flex flex-col items-center space-y-2 p-4 bg-green-50 dark:bg-green-900 rounded-xl hover:bg-green-100 dark:hover:bg-green-800 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        WhatsApp
                      </span>
                    </motion.button>
                  )}

                  {profile.socialLinks?.linkedin && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSocialClick('linkedin', profile.socialLinks.linkedin)}
                      disabled={isTracking}
                      className="flex flex-col items-center space-y-2 p-4 bg-blue-50 dark:bg-blue-900 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        LinkedIn
                      </span>
                    </motion.button>
                  )}

                  {profile.socialLinks?.instagram && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSocialClick('instagram', profile.socialLinks.instagram)}
                      disabled={isTracking}
                      className="flex flex-col items-center space-y-2 p-4 bg-pink-50 dark:bg-pink-900 rounded-xl hover:bg-pink-100 dark:hover:bg-pink-800 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                        Instagram
                      </span>
                    </motion.button>
                  )}

                  {profile.socialLinks?.twitter && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSocialClick('twitter', profile.socialLinks.twitter)}
                      disabled={isTracking}
                      className="flex flex-col items-center space-y-2 p-4 bg-sky-50 dark:bg-sky-900 rounded-xl hover:bg-sky-100 dark:hover:bg-sky-800 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        Twitter
                      </span>
                    </motion.button>
                  )}

                  {profile.socialLinks?.facebook && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSocialClick('facebook', profile.socialLinks.facebook)}
                      disabled={isTracking}
                      className="flex flex-col items-center space-y-2 p-4 bg-blue-50 dark:bg-blue-900 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Facebook
                      </span>
                    </motion.button>
                  )}

                  {profile.socialLinks?.youtube && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSocialClick('youtube', profile.socialLinks.youtube)}
                      disabled={isTracking}
                      className="flex flex-col items-center space-y-2 p-4 bg-red-50 dark:bg-red-900 rounded-xl hover:bg-red-100 dark:hover:bg-red-800 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        YouTube
                      </span>
                    </motion.button>
                  )}

                  {profile.socialLinks?.github && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSocialClick('github', profile.socialLinks.github)}
                      disabled={isTracking}
                      className="flex flex-col items-center space-y-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                        GitHub
                      </span>
                    </motion.button>
                  )}
                </div>
              </div>
            )}

            {/* Custom Links */}
            {profile.customLinks && profile.customLinks.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                  Additional Links
                </h3>
                <div className="space-y-3">
                  {profile.customLinks.map((link, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.open(link.url, '_blank')}
                      className="w-full flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white">
                        <span className="text-lg">{link.emoji}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {link.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {link.url}
                        </p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Powered by TapOnn - Digital Business Cards
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PublicProfilePage
