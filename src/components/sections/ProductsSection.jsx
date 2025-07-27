import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  CreditCard, 
  Monitor, 
  Star, 
  Package,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Users
} from 'lucide-react'

const ProductsSection = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Animate product cards on scroll
    gsap.from('.product-card', {
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

    // Hover animations for product cards
    gsap.utils.toArray('.product-card').forEach(card => {
      const cardInner = card.querySelector('.card-inner')
      
      card.addEventListener('mouseenter', () => {
        gsap.to(cardInner, {
          y: -10,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
      
      card.addEventListener('mouseleave', () => {
        gsap.to(cardInner, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
      })
    })
  }, [])

  const products = [
    {
      id: 'nfc-cards',
      icon: CreditCard,
      title: 'NFC Business Cards',
      subtitle: 'Visiting + Complete Cards',
      description: 'Revolutionary NFC-enabled business cards that instantly share your digital profile with a simple tap.',
      features: [
        'Instant contact sharing',
        'Customizable design',
        'Lead tracking',
        'Analytics dashboard'
      ],
      price: 'From $29',
      popular: true,
      gradient: 'from-blue-500 to-purple-600',
      badge: 'Most Popular'
    },
    {
      id: 'smart-standee',
      icon: Monitor,
      title: 'Smart Standee',
      subtitle: 'Interactive Display',
      description: 'Interactive digital displays that engage visitors and collect leads automatically through NFC technology.',
      features: [
        'Interactive displays',
        'Lead collection',
        'Content management',
        'Real-time analytics'
      ],
      price: 'From $199',
      gradient: 'from-green-500 to-teal-600',
      badge: 'New'
    },
    {
      id: 'review-cards',
      icon: Star,
      title: 'Review Cards',
      subtitle: 'Feedback Collection',
      description: 'Smart cards designed to collect customer reviews and feedback across multiple platforms instantly.',
      features: [
        'Multi-platform reviews',
        'Automated collection',
        'Review management',
        'Response tracking'
      ],
      price: 'From $19',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'bundle-cards',
      icon: Package,
      title: 'Bundle Cards',
      subtitle: 'Complete Solution',
      description: 'Complete networking solution combining NFC cards, digital profiles, and lead management tools.',
      features: [
        'Complete package',
        'Team management',
        'Advanced analytics',
        'Priority support'
      ],
      price: 'From $99',
      gradient: 'from-purple-500 to-pink-600',
      badge: 'Best Value'
    }
  ]

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gray-50 dark:bg-gray-800 relative overflow-hidden"
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
            Our Smart{' '}
            <span className="gradient-text">Products</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose from our range of innovative NFC products designed to transform your networking 
            and lead generation experience.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="product-card group"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link to={`/product/${product.id}`}>
                <div className="card-inner card p-6 h-full relative overflow-hidden">
                  {/* Badge */}
                  {product.badge && (
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${product.gradient}`}>
                      {product.badge}
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${product.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <product.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-4">
                    {product.subtitle}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                    {product.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {product.price}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700 transition-colors">
                      Learn More
                    </span>
                    <ArrowRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <motion.div 
          className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose TapOnn Products?
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Built with cutting-edge technology and designed for modern professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Instant sharing and connection' },
              { icon: Shield, title: 'Secure & Private', desc: 'Enterprise-grade security' },
              { icon: Globe, title: 'Global Reach', desc: 'Works anywhere in the world' },
              { icon: Users, title: 'Team Ready', desc: 'Perfect for teams and organizations' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.desc}
                </p>
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
            Ready to Get Started?
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Choose the perfect product for your needs and start transforming your networking experience today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-8 py-4"
            >
              View All Products
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-8 py-4"
            >
              Compare Products
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProductsSection 