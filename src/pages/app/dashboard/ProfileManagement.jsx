import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Building,
  Briefcase,
  Camera,
  Save,
  Eye,
  Share2,
  Plus,
  X,
  Check,
  Upload,
  Link as LinkIcon
} from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { profileAPI, uploadAPI } from '../../../services/api'
import toast from 'react-hot-toast'

const ProfileManagement = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('basic')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [profile, setProfile] = useState(null)
  const [profileData, setProfileData] = useState({
    displayName: '',
    jobTitle: '',
    company: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    avatar: '',
    socialLinks: {
      whatsapp: '',
      linkedin: '',
      instagram: '',
      twitter: '',
      facebook: '',
      youtube: ''
    },
    customLinks: []
  })

  const tabs = [
    { id: 'basic', name: 'Basic Info', emoji: '👤', description: 'Name, title, bio' },
    { id: 'contact', name: 'Contact', emoji: '📞', description: 'Phone, email, location' },
    { id: 'social', name: 'Social Media', emoji: '🌐', description: 'Social platforms' },
    { id: 'links', name: 'Custom Links', emoji: '🔗', description: 'Additional links' }
  ]

  const socialPlatforms = [
    { 
      key: 'whatsapp', 
      name: 'WhatsApp', 
      emoji: '📞', 
      placeholder: 'https://wa.me/1234567890',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    { 
      key: 'linkedin', 
      name: 'LinkedIn', 
      emoji: '💼', 
      placeholder: 'https://linkedin.com/in/username',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    { 
      key: 'instagram', 
      name: 'Instagram', 
      emoji: '📸', 
      placeholder: 'https://instagram.com/username',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100 dark:bg-pink-900/20'
    },
    { 
      key: 'twitter', 
      name: 'Twitter', 
      emoji: '🐦', 
      placeholder: 'https://twitter.com/username',
      color: 'text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    { 
      key: 'facebook', 
      name: 'Facebook', 
      emoji: '📘', 
      placeholder: 'https://facebook.com/username',
      color: 'text-blue-800',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    { 
      key: 'youtube', 
      name: 'YouTube', 
      emoji: '📺', 
      placeholder: 'https://youtube.com/channel/username',
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
    }
  ]

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setIsLoadingProfile(true)
      const response = await profileAPI.getMyProfile()
      
      if (response.data.success && response.data.data) {
        const profileData = response.data.data
        setProfile(profileData)
        
        // Update form data with fetched profile
        setProfileData({
          displayName: profileData.displayName || '',
          jobTitle: profileData.jobTitle || '',
          company: profileData.company || '',
          bio: profileData.bio || '',
          email: profileData.contactInfo?.email || '',
          phone: profileData.contactInfo?.phone || '',
          location: profileData.location || '',
          website: profileData.website || '',
          avatar: profileData.avatar || '',
          socialLinks: {
            whatsapp: profileData.socialLinks?.whatsapp || '',
            linkedin: profileData.socialLinks?.linkedin || '',
            instagram: profileData.socialLinks?.instagram || '',
            twitter: profileData.socialLinks?.twitter || '',
            facebook: profileData.socialLinks?.facebook || '',
            youtube: profileData.socialLinks?.youtube || ''
          },
          customLinks: profileData.customLinks || []
        })
      } else {
        // No profile exists, create one with user data
        setProfileData(prev => ({
          ...prev,
          displayName: user?.name || '',
          email: user?.email || ''
        }))
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      toast.error('Failed to load profile data')
      
      // Fallback to user data
      setProfileData(prev => ({
        ...prev,
        displayName: user?.name || '',
        email: user?.email || ''
      }))
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const addCustomLink = () => {
    setProfileData(prev => ({
      ...prev,
      customLinks: [...prev.customLinks, { title: '', url: '', emoji: '🔗' }]
    }))
  }

  const updateCustomLink = (index, field, value) => {
    setProfileData(prev => ({
      ...prev,
      customLinks: prev.customLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }))
  }

  const removeCustomLink = (index) => {
    setProfileData(prev => ({
      ...prev,
      customLinks: prev.customLinks.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      if (profile) {
        // Update existing profile
        const updateData = {
          displayName: profileData.displayName,
          jobTitle: profileData.jobTitle,
          company: profileData.company,
          bio: profileData.bio,
          location: profileData.location,
          website: profileData.website,
          avatar: profileData.avatar,
          socialLinks: profileData.socialLinks,
          customLinks: profileData.customLinks,
          contactInfo: {
            email: profileData.email,
            phone: profileData.phone
          }
        }
        
        await profileAPI.updateProfile(profile._id, updateData)
        toast.success('✅ Profile updated successfully!')
        
        // Refresh profile data
        await fetchProfile()
      } else {
        // Create new profile
        const createData = {
          displayName: profileData.displayName,
          jobTitle: profileData.jobTitle,
          company: profileData.company,
          bio: profileData.bio,
          location: profileData.location,
          website: profileData.website,
          avatar: profileData.avatar,
          socialLinks: profileData.socialLinks,
          customLinks: profileData.customLinks,
          contactInfo: {
            email: profileData.email,
            phone: profileData.phone
          }
        }
        
        const response = await profileAPI.createProfile(createData)
        if (response.data.success) {
          setProfile(response.data.data)
          toast.success('✅ Profile created successfully!')
        }
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
      toast.error('❌ Failed to save profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        setIsLoading(true)
        
        // Upload image to backend
        const response = await uploadAPI.uploadImage(file, 'profile')
        
        if (response.data.success) {
          setProfileData(prev => ({
            ...prev,
            avatar: response.data.data.url
          }))
          toast.success('📸 Profile image uploaded successfully!')
        }
      } catch (error) {
        console.error('Failed to upload image:', error)
        toast.error('❌ Failed to upload image')
        
        // Fallback to local preview
        const reader = new FileReader()
        reader.onload = (e) => {
          setProfileData(prev => ({
            ...prev,
            avatar: e.target.result
          }))
          toast.success('📸 Profile image updated! (Local preview)')
        }
        reader.readAsDataURL(file)
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center space-x-3">
            <span>🙋‍♂️</span>
            <span>Profile Management</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your digital profile information and social links
          </p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 lg:mt-0 flex items-center space-x-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.open(`/profile/${profile?.username || user?.username || 'demo'}`, '_blank')}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>👁️ Preview</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Saving...' : '💾 Save Changes'}</span>
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-2"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{tab.emoji}</span>
                    <span className="font-medium">{tab.name}</span>
                  </div>
                  <p className={`text-xs ${
                    activeTab === tab.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {tab.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Form Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="card p-6"
          >
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <span>👤</span>
                  <span>Basic Information</span>
                </h3>
                
                {/* Profile Image */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center overflow-hidden">
                      {profileData.avatar ? (
                        <img 
                          src={profileData.avatar} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-2xl">
                          {profileData.displayName?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors">
                      <Camera className="w-3 h-3 text-white" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden" 
                      />
                    </label>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Profile Photo</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click the camera icon to upload a new photo
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      value={profileData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
                      placeholder="Your display name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={profileData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
                      placeholder="e.g. Marketing Manager"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 resize-none"
                    placeholder="Tell people about yourself and what you do..."
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {profileData.bio.length}/500 characters
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <span>📞</span>
                  <span>Contact Information</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
                        placeholder="your@email.com"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
                        placeholder="+1 234 567 8900"
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
                        placeholder="City, Country"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={profileData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
                        placeholder="https://yourwebsite.com"
                      />
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <span>🌐</span>
                  <span>Social Media Links</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {socialPlatforms.map((platform) => (
                    <div key={platform.key} className={`p-4 ${platform.bgColor} rounded-lg`}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-2">
                        <span className="text-lg">{platform.emoji}</span>
                        <span>{platform.name}</span>
                      </label>
                      <input
                        type="url"
                        value={profileData.socialLinks[platform.key]}
                        onChange={(e) => handleInputChange(`socialLinks.${platform.key}`, e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800"
                        placeholder={platform.placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'links' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <span>🔗</span>
                    <span>Custom Links</span>
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addCustomLink}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Link</span>
                  </motion.button>
                </div>
                
                {profileData.customLinks.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No custom links added yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Add links to your portfolio, blog, or other important pages
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profileData.customLinks.map((link, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Link #{index + 1}
                          </h4>
                          <button
                            onClick={() => removeCustomLink(index)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Emoji
                            </label>
                            <input
                              type="text"
                              value={link.emoji}
                              onChange={(e) => updateCustomLink(index, 'emoji', e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-800"
                              placeholder="🔗"
                              maxLength={2}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={link.title}
                              onChange={(e) => updateCustomLink(index, 'title', e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                              placeholder="Link title"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              URL
                            </label>
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                              placeholder="https://example.com"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Live Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 sticky top-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <span>👁️</span>
            <span>Live Preview</span>
          </h3>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 min-h-[400px]">
            {/* Mock mobile profile preview */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {profileData.avatar ? (
                  <img 
                    src={profileData.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-xl">
                    {profileData.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {profileData.displayName || 'Your Name'}
              </h4>
              
              {profileData.jobTitle && (
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-1">
                  {profileData.jobTitle}
                </p>
              )}
              
              {profileData.company && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {profileData.company}
                </p>
              )}
              
              {profileData.bio && (
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {profileData.bio}
                </p>
              )}
              
              {/* Contact methods preview */}
              <div className="space-y-2">
                {profileData.phone && (
                  <div className="p-2 bg-green-500 text-white rounded text-xs">
                    📞 WhatsApp
                  </div>
                )}
                {profileData.email && (
                  <div className="p-2 bg-blue-500 text-white rounded text-xs">
                    ✉️ Email
                  </div>
                )}
                {Object.entries(profileData.socialLinks).map(([key, value]) => 
                  value && (
                    <div key={key} className="p-2 bg-gray-600 text-white rounded text-xs">
                      {socialPlatforms.find(p => p.key === key)?.emoji} {socialPlatforms.find(p => p.key === key)?.name}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(`/profile/${profile?.username || user?.username || 'demo'}`, '_blank')}
              className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Full Profile</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Profile</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfileManagement 