import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Star,
  CheckCircle,
  Play,
  Download,
  ShoppingCart,
  Heart,
  Share2,
  Users,
  Zap,
  Shield,
  Globe
} from 'lucide-react'

const ProductDetailPage = () => {
  const { slug } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedImage, setSelectedImage] = useState(0)

  const products = {
    'nfc-cards': {
      title: 'NFC Business Cards',
      subtitle: 'Visiting + Complete Cards',
      description: 'Revolutionary NFC-enabled business cards that instantly share your digital profile with a simple tap.',
      longDescription: 'Transform your networking experience with our cutting-edge NFC business cards. These smart cards combine elegant design with powerful technology to make sharing your information effortless and professional.',
      price: '',
      originalPrice: '',
      features: [
        'Instant contact sharing with a simple tap',
        'Customizable design and branding',
        'Real-time lead tracking and analytics',
        'Multiple profile links and social media integration',
        'Automatic form filling and data capture',
        'Cloud-based profile management',
        'Works with all NFC-enabled smartphones',
        'Eco-friendly and sustainable solution'
      ],
      specifications: {
        'Card Type': 'NFC-enabled PVC',
        'Dimensions': '85.6 x 54 mm (Standard)',
        'Technology': 'NTAG213/215/216',
        'Compatibility': 'All NFC-enabled devices',
        'Durability': 'Water-resistant, scratch-proof',
        'Storage': 'Up to 888 bytes of data',
        'Range': 'Up to 10cm read distance',
        'Lifespan': '10+ years'
      },
      images: [
        '/nfc-card-1.png',
        '/nfc-card-2.png',
        '/nfc-card-3.png',
        '/nfc-card-4.png'
      ],
      gradient: 'from-blue-500 to-purple-600',
      badge: 'Most Popular',
      rating: 4.8,
      reviews: 1247,
      inStock: true
    },
    'smart-standee': {
      title: 'Smart Standee',
      subtitle: 'Interactive Display',
      description: 'Interactive digital displays that engage visitors and collect leads automatically through NFC technology.',
      longDescription: 'Our Smart Standee transforms static displays into interactive engagement tools. Perfect for events, trade shows, and retail environments.',
      price: '',
      originalPrice: '',
      features: [
        'Interactive touch display',
        'Automatic lead collection',
        'Real-time content management',
        'Advanced analytics dashboard',
        'Custom branding options',
        'Multi-language support',
        'Cloud-based content updates',
        'Battery-powered for portability'
      ],
      specifications: {
        'Display': '10.1" HD Touchscreen',
        'Connectivity': 'WiFi, Bluetooth, NFC',
        'Battery': '8+ hours continuous use',
        'Dimensions': '300 x 200 x 50 mm',
        'Weight': '1.2 kg',
        'OS': 'Android-based',
        'Storage': '32GB internal',
        'Ports': 'USB-C, HDMI, Audio'
      },
      images: [
        '/smart-standee-1.png',
        '/smart-standee-2.png',
        '/smart-standee-3.png'
      ],
      gradient: 'from-green-500 to-teal-600',
      badge: 'New',
      rating: 4.9,
      reviews: 856,
      inStock: true
    },
    'review-cards': {
      title: 'Subscription Plan',
      subtitle: 'Feedback Collection',
      description: 'One month subscription plan to grow your business',
      longDescription: 'One month subscription plan to grow your business with our intelligent review cards that automatically direct customers to leave feedback on your preferred platorms.',
      price: '',
      originalPrice: '',
      features: [
        'Multi-platform review collection',
        'Automated review requests',
        'Review management dashboard',
        'Response tracking and analytics',
        'Custom landing pages',
        'Review monitoring and alerts',
        'Integration with major platforms',
        'White-label options available'
      ],
      specifications: {
        'Card Type': 'QR Code + NFC',
        'Platforms': 'Google, Yelp, Facebook, TripAdvisor',
        'Analytics': 'Real-time tracking',
        'Customization': 'Full branding control',
        'Integration': 'API available',
        'Support': '24/7 customer service',
        'Updates': 'Free lifetime updates',
        'Compatibility': 'All smartphones'
      },
      images: [
        '/review-card-1.png',
        '/review-card-2.png'
      ],
      gradient: 'from-yellow-500 to-orange-600',
      rating: 4.7,
      reviews: 634,
      inStock: true
    }
  }

  const product = products[slug]

  if (!product) {
    return (
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The product you're looking for doesn't exist.
          </p>
          <Link to="/products" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{product.title} - FiindIt | Digital Profile Platform</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="pt-20 pb-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary-600">Products</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">{product.title}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-4">
                {/* Main Image */}
                <div className={`w-full h-96 bg-gradient-to-br ${product.gradient} rounded-2xl flex items-center justify-center relative overflow-hidden`}>
                  <div className="text-white text-6xl font-bold">
                    {product.title.split(' ').map(word => word[0]).join('')}
                  </div>
                  {product.badge && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white text-primary-600 rounded-full text-sm font-semibold">
                      {product.badge}
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-full h-20 bg-gradient-to-br ${product.gradient} rounded-lg flex items-center justify-center ${selectedImage === index ? 'ring-2 ring-primary-500' : ''
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-white text-lg font-bold">
                        {index + 1}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-6">
                {/* Title and Rating */}
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.title}
                  </h1>
                  <p className="text-xl text-primary-600 dark:text-primary-400 font-medium mb-4">
                    {product.subtitle}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-2xl text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  {product.longDescription}
                </p>

                {/* Stock Status */}
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary flex items-center justify-center space-x-2 text-lg px-8 py-4"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary flex items-center justify-center space-x-2 text-lg px-8 py-4"
                  >
                    <Play className="w-5 h-5" />
                    <span>Live Demo</span>
                  </motion.button>
                </div>

                {/* Additional Actions */}
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', name: 'Overview' },
                  { id: 'features', name: 'Features' },
                  { id: 'specifications', name: 'Specifications' },
                  { id: 'reviews', name: 'Reviews' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="py-8">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="prose prose-lg max-w-none"
                >
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {product.longDescription}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    {[
                      { icon: Users, title: 'Easy to Use', desc: 'Simple setup and intuitive interface' },
                      { icon: Zap, title: 'Lightning Fast', desc: 'Instant sharing and connection' },
                      { icon: Shield, title: 'Secure', desc: 'Enterprise-grade security and privacy' }
                    ].map((feature, index) => (
                      <div key={index} className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'features' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'specifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                        <span className="font-medium text-gray-900 dark:text-white">{key}</span>
                        <span className="text-gray-600 dark:text-gray-400">{value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center py-12">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Customer Reviews
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Reviews coming soon...
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetailPage 