import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { useAnalytics } from '../../contexts/AnalyticsContext'
import { 
  Play, 
  ArrowRight, 
  Download, 
  Sparkles,
  Zap,
  Globe,
  Leaf
} from 'lucide-react'

const HeroSection = ({ typedRef }) => {
  const { trackDemoBooking, trackAppDownload } = useAnalytics()
  const heroRef = useRef(null)
  const floatingBadgesRef = useRef(null)

  useEffect(() => {
    // GSAP animations for hero section
    const tl = gsap.timeline()

    tl.from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
    .from('.hero-subtitle', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-buttons', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.3')
    .from('.floating-badge', {
      y: 50,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.2')

    // Floating animation for badges
    gsap.to('.floating-badge', {
      y: -20,
      duration: 2,
      ease: 'power2.inOut',
      stagger: 0.2,
      repeat: -1,
      yoyo: true
    })

    // Parallax effect for background
    gsap.to('.hero-bg', {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })
  }, [])

  const handleDemoBooking = () => {
    trackDemoBooking('hero_section', 'cta_button')
    // Scroll to demo form or open modal
  }

  const handleAppDownload = (platform) => {
    trackAppDownload(platform)
    // Handle app download
  }

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 hero-bg">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-accent-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      {/* Floating Badges */}
      <div ref={floatingBadgesRef} className="absolute inset-0 pointer-events-none">
        <motion.div
          className="floating-badge absolute top-20 left-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          🌱 Eco-friendly
        </motion.div>
        
        <motion.div
          className="floating-badge absolute top-32 right-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          ⚡ Instant Sharing
        </motion.div>
        
        <motion.div
          className="floating-badge absolute bottom-32 left-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          🌍 Global Network
        </motion.div>
        
        <motion.div
          className="floating-badge absolute bottom-20 right-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          🎯 Lead Management
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <motion.h1 
            className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="gradient-text">TapOnn</span>
          </motion.h1>

          {/* Typed Subtitle */}
          <motion.div 
            className="hero-subtitle text-2xl md:text-3xl lg:text-4xl font-medium text-gray-700 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span ref={typedRef} className="typed-text"></span>
          </motion.div>

          {/* Description */}
          <motion.p 
            className="hero-subtitle text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform your networking experience with our revolutionary NFC-based digital profile platform. 
            Share your information instantly, connect effortlessly, and manage leads smartly.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDemoBooking}
              className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
            >
              <Play size={20} />
              <span>Book Demo</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4"
            >
              <span>Explore More</span>
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>

          {/* App Download Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAppDownload('android')}
              className="flex items-center space-x-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Download size={20} />
              <div className="text-left">
                <div className="text-xs">Download on</div>
                <div className="text-sm font-semibold">Google Play</div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAppDownload('ios')}
              className="flex items-center space-x-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Download size={20} />
              <div className="text-left">
                <div className="text-xs">Download on</div>
                <div className="text-sm font-semibold">App Store</div>
              </div>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection 