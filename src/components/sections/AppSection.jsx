import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Smartphone, 
  Download, 
  QrCode,
  ArrowRight,
  Star,
  Users,
  Zap,
  Shield,
  CheckCircle,
  BarChart3,
  Globe
} from 'lucide-react'

const AppSection = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  useEffect(() => {
    // Disabled GSAP animations to prevent conflicts
    // Using Framer Motion animations instead for stability
  }, [])

  const appFeatures = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant profile sharing and connection'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security for your data'
    },
    {
      icon: Users,
      title: 'Team Sync',
      description: 'Seamless team collaboration and management'
    },
    {
      icon: Star,
      title: 'Smart Analytics',
      description: 'Detailed insights and performance tracking'
    }
  ]

  const appStats = [
    { number: '4.8', label: 'App Store Rating', icon: Star },
    { number: '50K+', label: 'Active Users', icon: Users },
    { number: '1M+', label: 'Connections Made', icon: Zap },
    { number: '99.9%', label: 'Uptime', icon: Shield }
  ]

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden"
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
            TapOnn{' '}
            <span className="gradient-text">Mobile App</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Take your digital networking anywhere with our powerful mobile app. 
            Available on iOS and Android with seamless sync across all devices.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Left Side - App Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Powerful Mobile Experience
            </h3>
            
            <div className="space-y-6 mb-8">
              {appFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  className="app-feature flex items-start space-x-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* App Stats */}
            <div className="grid grid-cols-2 gap-6">
              {appStats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Phone Mockup */}
          <motion.div
            className="phone-mockup relative flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Phone Frame */}
            <div className="relative">
              <div className="w-80 h-[600px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
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

                  {/* App Content */}
                  <div className="p-6 h-full overflow-y-auto">
                    {/* App Header */}
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">T</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        TapOnn
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Digital Networking Platform
                      </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {[
                        { icon: Smartphone, label: 'Scan Card', color: 'bg-blue-500' },
                        { icon: QrCode, label: 'QR Code', color: 'bg-green-500' },
                        { icon: Users, label: 'Contacts', color: 'bg-purple-500' },
                        { icon: BarChart3, label: 'Analytics', color: 'bg-orange-500' }
                      ].map((action, index) => (
                        <motion.div
                          key={index}
                          className={`${action.color} text-white p-4 rounded-xl text-center`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <action.icon className="w-6 h-6 mx-auto mb-2" />
                          <div className="text-xs font-medium">{action.label}</div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Recent Activity</h4>
                      {[
                        { name: 'Sarah Johnson', action: 'viewed your profile', time: '2m ago' },
                        { name: 'Mike Chen', action: 'connected with you', time: '5m ago' },
                        { name: 'Emma Davis', action: 'shared your card', time: '10m ago' }
                      ].map((activity, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {activity.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {activity.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {activity.action} • {activity.time}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <CheckCircle className="w-6 h-6 text-white" />
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <Zap className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Download Section */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Download TapOnn App
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Get the app and start networking smarter today
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Download className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs">Download on</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Download className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </motion.button>

              <Link to="/app/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg hover:from-primary-600 hover:to-accent-600 transition-colors"
                >
                  <Globe className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-xs">Try it now</div>
                    <div className="text-sm font-semibold">Web App</div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>

            {/* QR Code */}
            <div className="text-center">
              <div className="w-32 h-32 bg-white p-4 rounded-xl shadow-lg mx-auto mb-4">
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Scan to download
              </p>
            </div>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              'Offline access to your profile',
              'Push notifications for connections',
              'Biometric authentication',
              'Dark mode support',
              'Multi-language support',
              'Regular updates and improvements'
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AppSection 