import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Briefcase,
  Star,
  Mail,
  Brain,
  Users,
  BarChart3,
  Zap,
  Shield,
  Globe,
  Smartphone,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const FeaturesSection = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    // Disabled GSAP animations to prevent homepage conflicts
    // Using Framer Motion animations instead for stability
  }, [])

  const features = [
    {
      id: 'lead-management',
      icon: Briefcase,
      title: '💼 Lead Management',
      subtitle: 'AI-powered lead capture and management',
      description: 'Automatically capture and manage leads with AI-powered card scanning and intelligent form auto-fill.',
      highlights: [
        'AI card scanner for instant data extraction',
        'Automatic form filling and validation',
        'Lead scoring and prioritization',
        'Integration with popular CRM platforms',
        'Real-time lead tracking and analytics',
        'Custom lead capture forms'
      ],
      color: 'from-blue-500 to-purple-600',
      gradient: 'from-blue-50 to-purple-50'
    },
    {
      id: 'review-management',
      icon: Star,
      title: '⭐ Review Management',
      subtitle: 'Multi-platform review collection',
      description: 'Collect and manage customer reviews across Google, Justdial, and other platforms automatically.',
      highlights: [
        'Multi-platform review collection',
        'Automated review requests',
        'Review response management',
        'Review analytics and insights',
        'Custom review landing pages',
        'Review monitoring and alerts'
      ],
      color: 'from-yellow-500 to-orange-600',
      gradient: 'from-yellow-50 to-orange-50'
    },
    {
      id: 'email-signature',
      icon: Mail,
      title: '📧 Email Signature & Virtual Background',
      subtitle: 'Professional branding tools',
      description: 'Enhance your professional image with customizable email signatures and virtual backgrounds.',
      highlights: [
        'Custom email signature templates',
        'Virtual background library',
        'Brand consistency tools',
        'Easy integration with email clients',
        'Analytics on signature clicks',
        'Team signature management'
      ],
      color: 'from-green-500 to-teal-600',
      gradient: 'from-green-50 to-teal-50'
    },
    {
      id: 'ai-suggestions',
      icon: Brain,
      title: '🧠 AI Suggestions',
      subtitle: 'Smart networking recommendations',
      description: 'Get intelligent suggestions for connections and networking opportunities based on your industry and goals.',
      highlights: [
        'Industry-based connection suggestions',
        'Smart networking recommendations',
        'Event and conference suggestions',
        'Content sharing recommendations',
        'Follow-up reminders',
        'Networking strategy insights'
      ],
      color: 'from-purple-500 to-pink-600',
      gradient: 'from-purple-50 to-pink-50'
    }
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
            Powerful{' '}
            <span className="gradient-text">Features</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover the advanced features that make Connection Unlimited the ultimate digital networking platform
            for modern professionals and teams.
          </p>
        </motion.div>

        {/* Feature Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {features.map((feature, index) => (
              <motion.button
                key={feature.id}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === index
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {feature.title}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Feature Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            {/* Left Side - Feature Details */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${features[activeTab].color} rounded-2xl flex items-center justify-center mb-6`}>
                  {React.createElement(features[activeTab].icon, { className: "w-8 h-8 text-white" })}
                </div>

                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {features[activeTab].title}
                </h3>

                <p className="text-lg text-primary-600 dark:text-primary-400 font-medium mb-6">
                  {features[activeTab].subtitle}
                </p>

                <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                  {features[activeTab].description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features[activeTab].highlights.map((highlight, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  className="mt-8 btn-primary flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </div>

            {/* Right Side - Feature Mockup */}
            <motion.div
              className={`feature-card p-8 rounded-3xl bg-gradient-to-br ${features[activeTab].gradient} dark:from-gray-800 dark:to-gray-700`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
                {/* Mockup Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${features[activeTab].color} rounded-lg flex items-center justify-center`}>
                      {React.createElement(features[activeTab].icon, { className: "w-5 h-5 text-white" })}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {features[activeTab].title.split(' ')[1]}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Dashboard</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                </div>

                {/* Mockup Content */}
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <motion.div
                      key={item}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + item * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        <div>
                          <div className="w-24 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-primary-500 rounded-full"></div>
                    </motion.div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {[
                    { label: 'Total', value: '1,247' },
                    { label: 'Active', value: '892' },
                    { label: 'Growth', value: '+23%' }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    >
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Experience These Features?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Start using Connection Unlimited today and discover how these powerful features can transform your networking experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4"
            >
              Start Free Trial
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-8 py-4"
            >
              Schedule Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection 