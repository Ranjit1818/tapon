import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CreditCard,
  Monitor,
  Star,
  Package,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react'

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'all', name: 'All Products', icon: Package },
    { id: 'nfc-cards', name: 'NFC Cards', icon: CreditCard },
    { id: 'smart-standee', name: 'Smart Standee', icon: Monitor },
    { id: 'review-cards', name: 'Review Cards', icon: Star }
  ]

  const products = [
    {
      id: 'nfc-cards',
      title: 'NFC Business Cards',
      subtitle: 'Visiting + Complete Cards',
      description: 'Revolutionary NFC-enabled business cards that instantly share your digital profile with a simple tap.',
      features: [
        'Instant contact sharing',
        'Customizable design',
        'Lead tracking',
        'Analytics dashboard',
        'Multiple profile links',
        'Real-time updates'
      ],
      price: 'From $29',
      popular: true,
      gradient: 'from-blue-500 to-purple-600',
      badge: 'Most Popular',
      image: '/nfc-card-mockup.png'
    },
    {
      id: 'smart-standee',
      title: 'Smart Standee',
      subtitle: 'Interactive Display',
      description: 'Interactive digital displays that engage visitors and collect leads automatically through NFC technology.',
      features: [
        'Interactive displays',
        'Lead collection',
        'Content management',
        'Real-time analytics',
        'Custom branding',
        'Multi-language support'
      ],
      price: 'From $199',
      gradient: 'from-green-500 to-teal-600',
      badge: 'New',
      image: '/smart-standee-mockup.png'
    },
    {
      id: 'review-cards',
      title: 'Review Cards',
      subtitle: 'Feedback Collection',
      description: 'Smart cards designed to collect customer reviews and feedback across multiple platforms instantly.',
      features: [
        'Multi-platform reviews',
        'Automated collection',
        'Review management',
        'Response tracking',
        'Analytics dashboard',
        'Custom landing pages'
      ],
      price: 'From $19',
      gradient: 'from-yellow-500 to-orange-600',
      image: '/review-card-mockup.png'
    },
    {
      id: 'bundle-cards',
      title: 'Bundle Cards',
      subtitle: 'Complete Solution',
      description: 'Complete networking solution combining NFC cards, digital profiles, and lead management tools.',
      features: [
        'Complete package',
        'Team management',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'White-label options'
      ],
      price: 'From $99',
      gradient: 'from-purple-500 to-pink-600',
      badge: 'Best Value',
      image: '/bundle-mockup.png'
    }
  ]

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.id === selectedCategory
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <Helmet>
        <title>Products - Connection Unlimited | Digital Profile Platform</title>
        <meta name="description" content="Explore our range of NFC products including business cards, smart standees, and review cards designed to transform your networking experience." />
      </Helmet>

      <div className="pt-20 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Our{' '}
                <span className="gradient-text">Products</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Choose from our range of innovative NFC products designed to transform your networking
                and lead generation experience.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${selectedCategory === category.id
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <category.icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white w-64"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="card p-8 h-full hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                      {/* Badge */}
                      {product.badge && (
                        <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${product.gradient}`}>
                          {product.badge}
                        </div>
                      )}

                      {/* Product Image Placeholder */}
                      <div className={`w-full h-48 bg-gradient-to-br ${product.gradient} rounded-xl mb-6 flex items-center justify-center`}>
                        <div className="text-white text-4xl font-bold">
                          {product.title.split(' ').map(word => word[0]).join('')}
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {product.title}
                      </h3>
                      <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">
                        {product.subtitle}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {product.description}
                      </p>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {product.features.slice(0, 4).map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {product.price}
                        </div>
                        <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 transition-colors">
                          <span className="font-medium">Learn More</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-3xl p-8 md:p-12 text-white text-center"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Need Help Choosing?
            </h3>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Our team is here to help you find the perfect product for your needs.
              Get personalized recommendations and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get Expert Advice
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default ProductsPage 