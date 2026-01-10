import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lottie from 'lottie-react'
import { useAnalytics } from '../contexts/AnalyticsContext'

// Components
import HeroSection from '../components/sections/HeroSection'
import WhyDigitalProfileSection from '../components/sections/WhyDigitalProfileSection'
import ProductsSection from '../components/sections/ProductsSection'
import TapAndRedirectSection from '../components/sections/TapAndRedirectSection'
import TeamsSection from '../components/sections/TeamsSection'
import FeaturesSection from '../components/sections/FeaturesSection'
import TrustedBySection from '../components/sections/TrustedBySection'
import AboutSection from '../components/sections/AboutSection'

const HomePage = () => {
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    // Track page view
    trackEvent('page_view', 'navigation', 'homepage')

    // Force kill all ScrollTrigger instances to prevent conflicts
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())

    // Single cleanup function
    return () => {
      // Kill any remaining ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [trackEvent])

  return (
    <>
      <Helmet>
        <title>FiindIt - Digital Profile Platform | Share Instantly. Connect Effortlessly.</title>
        <meta name="description" content="Transform your networking with FiindIt's NFC-based digital profile platform. Share instantly, connect effortlessly, and manage leads smartly." />
        <meta name="keywords" content="NFC, digital business card, lead management, smart sharing, professional networking, FiindIt" />
        <link rel="canonical" href="https://fiindit.com" />

        {/* Open Graph */}
        <meta property="og:title" content="FiindIt - Digital Profile Platform" />
        <meta property="og:description" content="Share Instantly. Connect Effortlessly. Transform your networking experience." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fiindit.com" />
        <meta property="og:image" content="/og-image.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FiindIt - Digital Profile Platform" />
        <meta name="twitter:description" content="Share Instantly. Connect Effortlessly. Transform your networking experience." />
        <meta name="twitter:image" content="/og-image.jpg" />
      </Helmet>

      <div className="min-h-screen text-stable">
        {/* Hero Section */}
        <HeroSection />

        {/* Why Digital Profile Section */}
        <WhyDigitalProfileSection />

        {/* Products Section */}
        <ProductsSection />

        {/* Tap and Redirect Feature */}
        <TapAndRedirectSection />

        {/* for Teams */}
        <TeamsSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* App Section */}
       

        {/* Trusted By Section */}
        <TrustedBySection />

        {/* About Section */}
        <AboutSection />
      </div>
    </>
  )
}

export default HomePage 