import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  Brain, 
  Link as LinkIcon, 
  Target,
  Zap,
  Users,
  Shield,
  TrendingUp,
  Globe
} from 'lucide-react'

const WhyDigitalProfileSection = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Animate benefits on scroll
    gsap.from('.benefit-card', {
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })

    // Animate icons
    gsap.from('.benefit-icon', {
      scale: 0,
      rotation: 180,
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

  const benefits = [
    {
      icon: Brain,
      title: '🧠 Smart First Impressions',
      description: 'Make lasting impressions with dynamic, interactive digital profiles that showcase your expertise and personality.',
      features: ['AI-powered suggestions', 'Dynamic content updates', 'Professional branding']
    },
    {
      icon: LinkIcon,
      title: '🔗 One Tap All Links',
      description: 'Share all your important links, social media, and contact information with a single tap or scan.',
      features: ['Instant sharing', 'Multiple platform links', 'Custom landing pages']
    },
    {
      icon: Target,
      title: '🎯 Professional Identity',
      description: 'Build and maintain a consistent, professional digital identity across all platforms and interactions.',
      features: ['Brand consistency', 'Professional templates', 'Custom branding']
    },
    {
      icon: Zap,
      title: '⚡ Lightning Fast',
      description: 'Share your information instantly without the hassle of physical cards or manual data entry.',
      features: ['Instant sharing', 'No manual entry', 'Real-time updates']
    },
    {
      icon: Users,
      title: '👥 Network Growth',
      description: 'Expand your professional network effortlessly with smart connections and lead management.',
      features: ['Smart networking', 'Lead tracking', 'Relationship management']
    },
    {
      icon: Shield,
      title: '🔒 Secure & Private',
      description: 'Keep your information secure while maintaining full control over what you share and with whom.',
      features: ['Data encryption', 'Privacy controls', 'Secure sharing']
    }
  ]

  const stats = [
    { number: '10x', label: 'Faster Sharing', icon: Zap },
    { number: '50%', label: 'More Connections', icon: Users },
    { number: '100%', label: 'Eco-friendly', icon: Globe },
    { number: '24/7', label: 'Always Available', icon: TrendingUp }
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
            Why Choose{' '}
            <span className="gradient-text">Digital Profiles?</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Transform your networking experience with smart, efficient, and eco-friendly digital solutions 
            that make connecting effortless and professional.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              className="benefit-card group"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="card p-8 h-full hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                {/* Icon */}
                <div className="benefit-icon w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {benefit.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {benefit.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div 
          className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-3xl p-8 md:p-12 text-white"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              The Numbers Speak for Themselves
            </h3>
            <p className="text-xl text-primary-100">
              See how digital profiles are transforming networking worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your Networking?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have already upgraded to digital profiles 
            and are experiencing the benefits of smart networking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4"
            >
              Get Started Free
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-8 py-4"
            >
              Watch Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WhyDigitalProfileSection 