import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Smartphone,
  QrCode,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  MessageCircle,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  ArrowRight,
  Zap
} from 'lucide-react'

const TapAndRedirectSection = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Animate steps on scroll
    gsap.from('.step-card', {
      x: -100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })

    // Animate phone mockup
    gsap.from('.phone-mockup', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })

    // Auto-advance steps
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const steps = [
    {
      icon: CreditCard,
      title: '1. Tap Your Card',
      description: 'Simply tap your NFC-enabled Connection Unlimited card on any smartphone',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: QrCode,
      title: '2. Scan QR Code',
      description: 'Or scan the QR code with your phone camera for instant access',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: Smartphone,
      title: '3. Instant Profile',
      description: 'Your personalized digital profile opens instantly on their device',
      color: 'from-orange-500 to-red-600'
    }
  ]

  const contactLinks = [
    { icon: Phone, label: 'Call', color: 'bg-green-500', href: 'tel:+1234567890' },
    { icon: MessageCircle, label: 'WhatsApp', color: 'bg-green-600', href: 'https://wa.me/1234567890' },
    { icon: Mail, label: 'Email', color: 'bg-blue-500', href: 'mailto:hello@connectionunlimited.com' },
    { icon: Instagram, label: 'Instagram', color: 'bg-pink-500', href: 'https://instagram.com/connectionunlimited' },
    { icon: Linkedin, label: 'LinkedIn', color: 'bg-blue-600', href: 'https://linkedin.com/in/connectionunlimited' },
    { icon: Twitter, label: 'Twitter', color: 'bg-blue-400', href: 'https://twitter.com/connectionunlimited' },
    { icon: Youtube, label: 'YouTube', color: 'bg-red-500', href: 'https://youtube.com/connectionunlimited' },
    { icon: Globe, label: 'Website', color: 'bg-purple-500', href: 'https://connectionunlimited.com' },
    { icon: Calendar, label: 'Calendly', color: 'bg-blue-700', href: 'https://calendly.com/connectionunlimited' },
    { icon: MapPin, label: 'Location', color: 'bg-red-600', href: 'https://maps.google.com' }
  ]

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Tap &{' '}
            <span className="gradient-text">Redirect</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience the magic of instant sharing. One tap or scan opens your complete digital profile
            with all your important links and contact information.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Steps */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              How It Works
            </h3>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`step-card card p-6 transition-all duration-300 ${activeStep === index ? 'ring-2 ring-primary-500 shadow-lg' : ''
                    }`}
                  initial={{ opacity: 0, x: -50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {step.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Features */}
            <motion.div
              className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 text-primary-600 mr-2" />
                Instant Features
              </h4>
              <ul className="space-y-2">
                {[
                  'No app installation required',
                  'Works on all smartphones',
                  'Real-time profile updates',
                  'Analytics and insights'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Right Side - Phone Mockup */}
          <motion.div
            className="phone-mockup relative"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Phone Frame */}
            <div className="relative mx-auto w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
              <div className="w-full h-full bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden relative">
                {/* Status Bar */}
                <div className="h-8 bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-between px-6 text-white text-xs">
                  <span>9:41</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-3 bg-white rounded-full"></div>
                    <div className="w-1 h-5 bg-white rounded-full"></div>
                    <div className="w-1 h-7 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="p-6 h-full overflow-y-auto">
                  {/* Profile Header */}
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">JD</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      John Doe
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Digital Marketing Specialist
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Helping businesses grow through innovative digital solutions
                    </p>
                  </div>

                  {/* Contact Links Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {contactLinks.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${link.color} text-white p-4 rounded-xl flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-200`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <link.icon className="w-6 h-6 mb-2" />
                        <span className="text-xs font-medium">{link.label}</span>
                      </motion.a>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    className="w-full mt-6 bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Connect Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg"
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <QrCode className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Experience Instant Sharing?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Get your personalized Connection Unlimited card and start sharing your digital profile instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4"
            >
              Get Your Card
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-8 py-4"
            >
              Try Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TapAndRedirectSection 