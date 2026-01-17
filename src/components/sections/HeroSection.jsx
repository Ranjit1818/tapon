import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, ArrowRight, Download, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAnalytics } from '../../contexts/AnalyticsContext'

// --- Typing Effect Constants ---
const textToType = [
  'Share Instantly.',
  'Connect Effortlessly.',
  'Grow Your Network.',
  'Manage Leads Smartly.',
]
const typingSpeed = 50
const erasingSpeed = 30
const delayAfterTyped = 2000
const delayAfterErased = 100

/**
 * TypingEffect Component
 * Handles the automatic typing and erasing of phrases in an array.
 */
const TypingEffect = () => {
  const [displayText, setDisplayText] = useState('')
  const [index, setIndex] = useState(0)
  const [textIndex, setTextIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    let timeoutId

    // textToType is a constant, so the effect only needs textIndex
    const currentText = textToType[textIndex]

    if (!currentText) {
      return
    }

    if (isTyping) {
      // Logic for TYPING
      if (index < currentText.length) {
        timeoutId = setTimeout(() => {
          setDisplayText((prev) => prev + currentText[index])
          setIndex((prev) => prev + 1)
        }, typingSpeed)
      } else {
        // Pause after typing is complete
        timeoutId = setTimeout(() => {
          setIsTyping(false)
        }, delayAfterTyped)
      }
    } else {
      // Logic for ERASING
      if (index > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1))
          setIndex((prev) => prev - 1)
        }, erasingSpeed)
      } else {
        // Move to next text after erasing is complete
        timeoutId = setTimeout(() => {
          setIsTyping(true)
          setTextIndex((prev) => (prev + 1) % textToType.length)
        }, delayAfterErased)
      }
    }

    return () => clearTimeout(timeoutId)
    // Refinement: Removed 'currentText' from dependencies as it's derived from 'textIndex' (already included).
  }, [index, isTyping, textIndex])

  return (
    <span className="inline-block min-h-[1.2em]">
      {displayText}
      {/* Typing cursor animation from CSS */}
      <span className="typing-cursor text-primary-500 dark:text-primary-400">
        |
      </span>
    </span>
  )
}

const HeroSection = () => {
  const { trackDemoBooking, trackAppDownload } = useAnalytics()

  const handleDemoBooking = (product, source) => {
    trackDemoBooking(product, source)
  }

  const handleAppDownload = (platform) => {
    trackAppDownload(platform)
  }

  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 dark:bg-[#050505]"
      style={{ position: 'relative', zIndex: 1 }}
    >
      <div className="absolute inset-0">


        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          ></div>
        </div>
      </div>

      {/* Floating Badges */}
      <div className="pointer-events-none absolute inset-0">
        
      

       

        
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Main Title */}
          <motion.h1
            className="text-stable relative z-10 mb-6 text-5xl font-bold text-gray-900 md:text-7xl lg:text-8xl dark:text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="text-orange-500">FiindIt</span>
          </motion.h1>

          {/* Typed Subtitle */}
          <motion.div
            className="relative z-10 mt-4 mb-8 min-h-[3rem] text-2xl font-medium text-gray-700 md:mt-6 md:text-3xl lg:text-4xl dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <TypingEffect />
          </motion.div>
          {/* CTA Buttons */}
          <motion.div
            className="text-stable relative z-10 mt-12 mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          >
            <Link to="/app/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center space-x-2 px-8 py-4 text-lg color-white"
              >
                <Sparkles size={20} />  
                <span>Get Started</span>
                <ArrowRight size={20} />
              </motion.button>
            </Link>

           
          </motion.div>

          {/* App Download Buttons */}
        </div>
      </div>

      
       
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-2 h-3 w-1 rounded-full bg-gray-400"
          />
        
      
    </section>
  )
}

export default HeroSection