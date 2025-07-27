import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Phone,
  Mail,
  MapPin,
  Globe,
  Calendar,
  MessageCircle,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Facebook,
  Heart,
  Share2,
  Download,
  Copy
} from 'lucide-react'

const ProfilePage = () => {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Simulate loading profile data
    setTimeout(() => {
      setProfile({
        name: 'John Doe',
        title: 'Digital Marketing Specialist',
        company: 'TechCorp Solutions',
        bio: 'Passionate digital marketer with 8+ years of experience helping businesses grow through innovative marketing strategies. Specialized in social media marketing, SEO, and lead generation.',
        avatar: 'JD',
        email: 'john.doe@techcorp.com',
        phone: '+1 (555) 123-4567',
        location: 'Mumbai, India',
        website: 'https://techcorp.com',
        social: {
          linkedin: 'https://linkedin.com/in/johndoe',
          twitter: 'https://twitter.com/johndoe',
          instagram: 'https://instagram.com/johndoe',
          facebook: 'https://facebook.com/johndoe'
        },
        links: [
          {
            title: 'Portfolio',
            url: 'https://johndoe.portfolio.com',
            icon: Globe
          },
          {
            title: 'Blog',
            url: 'https://johndoe.blog.com',
            icon: Globe
          },
          {
            title: 'Services',
            url: 'https://johndoe.services.com',
            icon: Globe
          }
        ],
        stats: {
          profileViews: 1247,
          connections: 892,
          leads: 156
        }
      })
      setLoading(false)
    }, 1000)
  }, [username])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleContact = (type, value) => {
    switch (type) {
      case 'phone':
        window.open(`tel:${value}`)
        break
      case 'email':
        window.open(`mailto:${value}`)
        break
      case 'whatsapp':
        window.open(`https://wa.me/${value.replace(/\D/g, '')}`)
        break
      default:
        window.open(value, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Profile Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The profile you're looking for doesn't exist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{profile.name} - TapOnn Profile</title>
        <meta name="description" content={`Connect with ${profile.name}, ${profile.title} at ${profile.company}`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-md mx-auto px-4 py-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-4xl">{profile.avatar}</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {profile.name}
            </h1>
            <p className="text-xl text-primary-600 dark:text-primary-400 font-medium mb-2">
              {profile.title}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {profile.company}
            </p>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {profile.bio}
            </p>
          </motion.div>

          {/* Quick Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="card p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Contact
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => handleContact('phone', profile.phone)}
                className="w-full flex items-center justify-between p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5" />
                  <span>Call</span>
                </div>
                <span className="text-sm">{profile.phone}</span>
              </button>

              <button
                onClick={() => handleContact('whatsapp', profile.phone)}
                className="w-full flex items-center justify-between p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp</span>
                </div>
                <span className="text-sm">Message</span>
              </button>

              <button
                onClick={() => handleContact('email', profile.email)}
                className="w-full flex items-center justify-between p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </div>
                <span className="text-sm">{profile.email}</span>
              </button>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="card p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Connect
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(profile.social).map(([platform, url]) => {
                const icons = {
                  linkedin: Linkedin,
                  twitter: Twitter,
                  instagram: Instagram,
                  facebook: Facebook
                }
                const Icon = icons[platform]
                const colors = {
                  linkedin: 'bg-blue-600 hover:bg-blue-700',
                  twitter: 'bg-blue-400 hover:bg-blue-500',
                  instagram: 'bg-pink-500 hover:bg-pink-600',
                  facebook: 'bg-blue-800 hover:bg-blue-900'
                }
                
                return (
                  <button
                    key={platform}
                    onClick={() => handleContact('social', url)}
                    className={`flex items-center justify-center space-x-2 p-3 text-white rounded-lg transition-colors ${colors[platform]}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="capitalize">{platform}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Custom Links */}
          {profile.links.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="card p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Links
              </h3>
              
              <div className="space-y-3">
                {profile.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => handleContact('link', link.url)}
                    className="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <link.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{link.title}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Visit</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="card p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Stats
            </h3>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {profile.stats.profileViews}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Views</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {profile.stats.connections}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Connections</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {profile.stats.leads}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Leads</div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex space-x-3"
          >
            <button
              onClick={handleCopyLink}
              className="flex-1 flex items-center justify-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Copy className="w-5 h-5" />
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
            
            <button className="flex-1 flex items-center justify-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
            
            <button className="flex-1 flex items-center justify-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Heart className="w-5 h-5" />
              <span>Save</span>
            </button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by{' '}
              <span className="font-semibold text-primary-600 dark:text-primary-400">
                TapOnn
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage 