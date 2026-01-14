import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Share2,
  Copy,
  Check,
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
  MessageCircle,
  CreditCard,
  ArrowRight,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Github,
  Award,
  Briefcase,
  MessageSquare,
  Star
} from 'lucide-react'
import { profileAPI, analyticsAPI } from '../services/api'
import toast from 'react-hot-toast'

const PublicProfilePage = () => {
  const { username } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedLink, setCopiedLink] = useState(false)
  
  useEffect(() => {
    fetchProfile()
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

  const trackProfileView = async (profileId) => {
    try {
        await analyticsAPI.trackEvent({
            eventType: 'profile_view',
            eventAction: 'view',
            profile: profileId,
            metadata: { 
                url: window.location.href,
                sessionId: sessionStorage.getItem('sessionId') 
            }
        })
    } catch (error) { console.error('Tracking error', error) }
  }

  const trackClick = async (type, action, value) => {
      try {
          await analyticsAPI.trackEvent({
              eventType: type,
              eventAction: action,
              profile: profile._id,
              metadata: { value, sessionId: sessionStorage.getItem('sessionId') }
          })
      } catch (error) { console.error('Tracking error', error) }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopiedLink(true)
    toast.success('Link copied to clipboard!')
    setTimeout(() => setCopiedLink(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!profile) return null

  // ------------------------------------------------------------------
  // Premium Design Variants
  // ------------------------------------------------------------------
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  }

  // Dynamic Colors
  const bgColor = profile.colors?.background || '#000000'
  const cardColor = profile.colors?.card || '#111111' 
  const textColor = profile.colors?.text || '#ffffff'

  return (
    <div 
        className="min-h-screen flex flex-col md:items-center md:justify-center overflow-x-hidden md:p-4"
        style={{ backgroundColor: bgColor, color: textColor }}
    >
      
      {/* Main Card */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full md:max-w-sm min-h-screen md:min-h-fit md:rounded-[32px] overflow-hidden shadow-none md:shadow-2xl flex flex-col justify-between"
        style={{ backgroundColor: cardColor }}
      >
        
        {/* 3D Background Name (Fixed to be MASSIVE behind content) */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-25 overflow-hidden">
             {/* Using very large size and stroke for contrast */}
            <h1 className="text-[110vh] md:text-[50vw] font-black uppercase text-transparent bg-clip-text bg-gradient-to-br from-white/10 to-transparent whitespace-nowrap leading-none"
                style={{ 
                    WebkitTextStroke: '4px rgba(255,255,255,0.1)',
                    transform: 'rotate(0deg)',
                    filter: 'drop-shadow(0 0 50px rgba(0,0,0,0.5))'
                }}>
                {profile.displayName?.charAt(0)}
            </h1>
        </div>

        {/* Top Navbar Actions */}
        <div className="absolute top-4 right-4 z-50 flex space-x-2">
            <button 
                onClick={handleCopyLink}
                className="p-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-all active:scale-95"
            >
                {copiedLink ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/70" />}
            </button>
            <button 
                onClick={() => {
                    if (navigator.share) navigator.share({ title: profile.displayName, url: window.location.href }).catch(() => {})
                    else handleCopyLink()
                }}
                className="p-2 bg-black/20 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-all active:scale-95"
            >
                <Share2 className="w-4 h-4 text-white/70" />
            </button>
        </div>

        {/* ---------------------------
            HEADER SECTION
           --------------------------- */}
        <div className="relative w-full pt-10 pb-2 flex flex-col items-center z-10 shrink-0">
            
            {/* Header 3D Name (Smaller Context) */}
             <div className="w-full h-24 flex items-center justify-center relative overflow-hidden mb-[-10px]">
                 <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5"
                     style={{ 
                         transform: 'perspective(500px) rotateX(20deg)',
                         textShadow: '0 10px 20px rgba(0,0,0,0.5)'
                     }}>
                     {profile.displayName?.split(' ')[0]}
                 </h2>
             </div>

            {/* Profile Avatar */}
             <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="relative z-10"
             >
                <div className="w-28 h-28 rounded-full p-1" style={{ backgroundColor: cardColor }}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 border border-white/10 shadow-xl">
                        {profile.avatar ? (
                            <img src={profile.avatar} alt={profile.displayName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-2xl font-bold">
                                {profile.displayName?.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>
             </motion.div>

            {/* Name & Title */}
            <div className="text-center mt-3 px-4">
                 <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{profile.displayName}</h3>
               
            </div>
        </div>

        {/* ---------------------------
            CONTENT AREA (Flex-grow to fill space)
           --------------------------- */}
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="px-6 pb-6 pt-2 flex-grow flex flex-col justify-evenly space-y-4 z-10"
        >

             {/* 1. Google Review (Google Logo + Stars Style), placed ABOVE Payment */}
            {(profile.socialLinks?.googleReview || profile.customLinks?.find(l => l.title?.toLowerCase().includes('review'))) && (
                 <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        const link = profile.socialLinks?.googleReview || profile.customLinks?.find(l => l.title?.toLowerCase().includes('review'))?.url
                        trackClick('social_click', 'googleReview', link)
                        window.open(link, '_blank')
                    }}
                    className="w-full bg-[#181818] border border-white/10 rounded-2xl py-3 px-6 flex items-center justify-between shadow-lg"
                 >
                    {/* Google Logo Recreation */}
                    <div className="flex items-center gap-1 font-product-sans font-bold text-2xl tracking-tight">
                        <span className="text-blue-500">G</span>
                        <span className="text-red-500">o</span>
                        <span className="text-yellow-500">o</span>
                        <span className="text-blue-500">g</span>
                        <span className="text-green-500">l</span>
                        <span className="text-red-500">e</span>
                    </div>

                    {/* 5 Stars */}
                    <div className="flex gap-0.5">
                        {[1,2,3,4,5].map((s) => (
                            <Star key={s} className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                        ))}
                    </div>
                </motion.button>
            )}


            {/* 2. Payment Button */}
            {profile.paymentInfo?.upiId && (
                <motion.div variants={itemVariants} className="w-full px-1">
                     <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={`upi://pay?pa=${profile.paymentInfo.upiId}&pn=${encodeURIComponent(profile.displayName)}&cu=INR`}
                        onClick={() => trackClick('payment_click', 'upi', profile.paymentInfo.upiId)}
                        className="w-full py-4 px-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20"
                    >
                         <CreditCard className="w-6 h-6 text-white" />
                         <span className="text-lg font-bold text-white">Pay Now</span>
                    </motion.a>
                </motion.div>
            )}


            {/* 3. Contact Icons: Email, Phone (Moved Down) */}
             <motion.div variants={itemVariants} className="flex justify-center gap-6">
                {profile.contactInfo?.email && (
                     <CompactActionBtn icon={<Mail className="w-6 h-6" />} onClick={() => window.location.href = `mailto:${profile.contactInfo.email}`} />
                )}
                {profile.contactInfo?.phone && (
                    <CompactActionBtn icon={<Phone className="w-6 h-6" />} onClick={() => window.location.href = `tel:${profile.contactInfo.phone}`} />
                )}
             </motion.div>


            {/* 4. Social Links (3 Column Grid) */}
            {(profile.socialLinks || (profile.customLinks && profile.customLinks.length > 0)) && (
                <motion.div variants={itemVariants} className="w-full">
                    <div className="grid grid-cols-3 gap-5">
                        {/* Map social links except Google Review */}
                        {Object.entries(profile.socialLinks || {}).map(([key, value]) => {
                            if (!value || key === 'googleReview') return null
                            return (
                                <SocialIconBtn 
                                    key={key}
                                    type={key}
                                    onClick={() => {
                                        trackClick('social_click', key, value)
                                        window.open(value, '_blank')
                                    }}
                                />
                            )
                        })}
                        {profile.customLinks?.map((link, i) => {
                             if (link.title?.toLowerCase().includes('review')) return null
                             return (
                                <button
                                    key={i}
                                    onClick={() => window.open(link.url, '_blank')}
                                    className="aspect-square w-full rounded-2xl mx-auto bg-white/5 border border-white/5 flex items-center justify-center text-4xl hover:bg-white/10 transition-colors"
                                >
                                    {link.emoji || '🔗'}
                                </button>
                             )
                        })}
                    </div>
                </motion.div>
            )}

            {/* Footer */}
            <div className="mt-auto pt-2 text-center opacity-30 text-[20px]  tracking-widest text-white shrink-0">
               ©     FiindIt
            </div>
            
        </motion.div>
      </motion.div>
    </div>
  )
}

// ------------------------------------------------------------------
// Sub-Components
// ------------------------------------------------------------------

const CompactActionBtn = ({ icon, onClick, highlight }) => (
    <button
        onClick={onClick}
        className={`
            w-16 h-16 rounded-2xl flex items-center justify-center transition-all active:scale-95
            ${highlight 
                ? 'bg-gradient-to-br from-pink-500/20 to-rose-600/20 border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }
        `}
    >
        <div className={highlight ? 'animate-pulse' : ''}>
            {icon}
        </div>
    </button>
)

const SocialIconBtn = ({ type, onClick }) => {
    const info = getSocialInfo(type)
    return (
        <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="aspect-square w-full rounded-3xl flex items-center justify-center bg-[#181818] border border-white/5 shadow-lg group relative overflow-hidden"
        >
             <div className={`absolute inset-0 bg-gradient-to-br ${info.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
             <div className="relative z-10 text-white/50 group-hover:text-white transition-colors">
                 {info.icon}
             </div>
        </motion.button>
    )
}

// Helper for Icons & Colors
const getSocialInfo = (type) => {
    const defaults = {
        icon: <Globe className="w-8 h-8" />,
        gradient: 'from-gray-600 to-gray-800'
    }

    const map = {
        whatsapp: {
            icon: <MessageCircle className="w-8 h-8" />,
            gradient: 'from-green-500 to-emerald-600'
        },
        linkedin: {
            icon: <Linkedin className="w-8 h-8" />,
            gradient: 'from-blue-600 to-blue-800'
        },
        instagram: {
            icon: <Instagram className="w-8 h-8" />,
            gradient: 'from-purple-500 to-pink-600'
        },
        youtube: {
            icon: <Youtube className="w-8 h-8" />,
            gradient: 'from-red-600 to-red-700'
        },
        twitter: {
            icon: <Twitter className="w-8 h-8" />,
            gradient: 'from-sky-400 to-blue-500'
        },
        facebook: {
            icon: <Facebook className="w-8 h-8" />,
            gradient: 'from-blue-600 to-blue-800'
        },
        github: {
            icon: <Github className="w-8 h-8" />,
            gradient: 'from-gray-700 to-gray-900'
        },
        googleMap: {
            icon: <MapPin className="w-8 h-8" />,
            gradient: 'from-blue-500 to-cyan-500'
        },
         googleReview: {
            icon: <MessageSquare className="w-8 h-8" />,
            gradient: 'from-pink-500 to-rose-500'
        }
    }

    return map[type] || defaults
}

export default PublicProfilePage
