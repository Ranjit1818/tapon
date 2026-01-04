import { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lottie from 'lottie-react'
import Typed from 'typed.js'
import { useAnalytics } from '../contexts/AnalyticsContext'

// Components
import HeroSection from '../components/sections/HeroSection'
import WhyDigitalProfileSection from '../components/sections/WhyDigitalProfileSection'
import ProductsSection from '../components/sections/ProductsSection'
import TapAndRedirectSection from '../components/sections/TapAndRedirectSection'
import TeamsSection from '../components/sections/TeamsSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import AppSection from '../components/sections/AppSection'
import TrustedBySection from '../components/sections/TrustedBySection'
import AboutSection from '../components/sections/AboutSection'

const HomePage = () => {
  const { trackEvent } = useAnalytics()
  const typedRef = useRef(null)

  useEffect(() => {
    // Track page view
    trackEvent('page_view', 'navigation', 'homepage')

    // Initialize Typed.js with proper timing
    let typed = null

    const initTyped = () => {
      if (typedRef.current && !typed) {
        typed = new Typed(typedRef.current, {
          strings: [
            'Share Instantly.',
            'Connect Effortlessly.',
            'Grow Your Network.',
            'Manage Leads Smartly.'
          ],
          typeSpeed: 60,
          backSpeed: 40,
          backDelay: 2000,
          loop: true,
          showCursor: true,
          cursorChar: '|',
          startDelay: 1500,
        })
      }
    }

    // Start typed animation after ensuring the component is mounted
    const typedTimeout = setTimeout(initTyped, 1000)

    // Force kill all ScrollTrigger instances to prevent conflicts
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())

    // Single cleanup function
    return () => {
      clearTimeout(typedTimeout)
      if (typed) {
        typed.destroy()
        typed = null
      }
      // Kill any remaining ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [trackEvent])

  return (
    <>
      <Helmet>
        <title>Connection Unlimited - Digital Profile Platform | Share Instantly. Connect Effortlessly.</title>
        <meta name="description" content="Transform your networking with Connection Unlimited's NFC-based digital profile platform. Share instantly, connect effortlessly, and manage leads smartly." />
        <meta name="keywords" content="NFC, digital business card, lead management, smart sharing, professional networking, Connection Unlimited" />
        <link rel="canonical" href="https://connectionunlimited.com" />

        {/* Open Graph */}
        <meta property="og:title" content="Connection Unlimited - Digital Profile Platform" />
        <meta property="og:description" content="Share Instantly. Connect Effortlessly. Transform your networking experience." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://connectionunlimited.com" />
        <meta property="og:image" content="/og-image.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Connection Unlimited - Digital Profile Platform" />
        <meta name="twitter:description" content="Share Instantly. Connect Effortlessly. Transform your networking experience." />
        <meta name="twitter:image" content="/og-image.jpg" />
      </Helmet>

      <div className="min-h-screen text-stable">
        {/* Hero Section */}
        <HeroSection typedRef={typedRef} />

        {/* Why Digital Profile Section */}
        <WhyDigitalProfileSection />

        {/* Products Section */}
        <ProductsSection />

        {/* Tap and Redirect Feature */}
        <TapAndRedirectSection />

        {/* Connection Unlimited for Teams */}
        <TeamsSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* App Section */}
        <AppSection />

        {/* Trusted By Section */}
        <TrustedBySection />

        {/* About Section */}
        <AboutSection />
      </div>
    </>
  )
}

export default HomePage 