import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  Target,
  Calendar,
  MessageSquare,
  Settings,
  Plus,
  ArrowRight,
  Star,
  Activity,
  DollarSign
} from 'lucide-react'

const TeamsSection = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Animate dashboard elements
    gsap.from('.dashboard-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })

    // Animate metrics
    gsap.from('.metric-item', {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })
  }, [])

  const teamMembers = [
    { name: 'Sarah Johnson', role: 'Sales Manager', avatar: 'SJ', status: 'online', leads: 45 },
    { name: 'Mike Chen', role: 'Marketing Lead', avatar: 'MC', status: 'online', leads: 32 },
    { name: 'Emma Davis', role: 'Account Executive', avatar: 'ED', status: 'away', leads: 28 },
    { name: 'Alex Rodriguez', role: 'Business Dev', avatar: 'AR', status: 'offline', leads: 19 }
  ]

  const metrics = [
    { icon: Users, label: 'Team Members', value: '12', change: '+2', color: 'text-blue-600' },
    { icon: Target, label: 'Total Leads', value: '1,247', change: '+15%', color: 'text-green-600' },
    { icon: TrendingUp, label: 'Conversion Rate', value: '23.4%', change: '+2.1%', color: 'text-purple-600' },
    { icon: DollarSign, label: 'Revenue', value: '$45.2K', change: '+8.3%', color: 'text-orange-600' }
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
            TapOnn for{' '}
            <span className="gradient-text">Teams</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Empower your entire team with unified digital profiles, advanced CRM integrations, 
            and comprehensive lead management tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          {/* Left Side - Dashboard Mockup */}
          <motion.div
            className="dashboard-mockup"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Team Dashboard</h3>
                  <p className="text-gray-600 dark:text-gray-400">Real-time performance overview</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Live</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    className="metric-item bg-gray-50 dark:bg-gray-700 rounded-xl p-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                      </div>
                      <div className={`w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center`}>
                        <metric.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">{metric.change}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Team Members */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Team Members</h4>
                  <button className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    className="dashboard-card flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">{member.avatar}</span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          member.status === 'online' ? 'bg-green-500' : 
                          member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{member.leads}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">leads</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Powerful Team Features
            </h3>
            
            <div className="space-y-6">
              {[
                {
                  icon: Users,
                  title: 'Team Profile Management',
                  description: 'Manage all team member profiles from a centralized dashboard with role-based permissions.'
                },
                {
                  icon: BarChart3,
                  title: 'Advanced Analytics',
                  description: 'Track team performance, lead generation, and conversion rates with detailed insights.'
                },
                {
                  icon: Target,
                  title: 'CRM Integrations',
                  description: 'Seamlessly integrate with popular CRM platforms like Salesforce, HubSpot, and Zoho.'
                },
                {
                  icon: Calendar,
                  title: 'Sub-team Management',
                  description: 'Organize your team into departments and manage permissions efficiently.'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
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
          </motion.div>
        </div>

        {/* Demo Booking Form */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Scale Your Team?
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Book a personalized demo and see how TapOnn can transform your team's networking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Team Size
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                <option>Select team size</option>
                <option>1-10 employees</option>
                <option>11-50 employees</option>
                <option>51-200 employees</option>
                <option>200+ employees</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="text-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4"
            >
              Book Team Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TeamsSection 