import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  CreditCard,
  Star,
  Heart,
  MessageCircle,
  Truck,
  Shield,
  Zap,
  Gift,
  ArrowRight,
  Check,
  X,
  Plus,
  Minus,
  ExternalLink
} from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext'
import { orderAPI } from '../../../services/api'
import toast from 'react-hot-toast'

const Shop = () => {
  const { user, isConnectionUnlimitedUser, hasPermission } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [flippedCards, setFlippedCards] = useState(new Set())
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkout, setCheckout] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  })

  const categories = [
    { id: 'all', name: 'All Products', emoji: '🛍️' },
    { id: 'nfc', name: 'NFC Cards', emoji: '💳' },
    { id: 'review', name: 'Review Cards', emoji: '⭐' },
    { id: 'accessories', name: 'Accessories', emoji: '🎁' }
  ]

  const products = [
    {
      id: 'nfc-premium',
      name: 'Premium NFC Card',
      category: 'nfc',
      price: 49.99,
      originalPrice: 69.99,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
      description: 'High-quality NFC card with instant profile sharing',
      features: ['Instant sharing', 'Custom design', 'Waterproof', 'Lifetime warranty'],
      tags: ['🔥 Bestseller', '✨ Premium'],
      rating: 4.9,
      reviews: 234,
      inStock: true,
      colors: ['Black', 'White', 'Gold', 'Silver'],
      delivery: '2-3 days'
    },
    {
      id: 'nfc-standard',
      name: 'Standard NFC Card',
      category: 'nfc',
      price: 29.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
      description: 'Affordable NFC card for digital profile sharing',
      features: ['Quick setup', 'Durable material', 'Multiple colors'],
      tags: ['💰 Best Value'],
      rating: 4.7,
      reviews: 156,
      inStock: true,
      colors: ['Black', 'White', 'Blue'],
      delivery: '3-5 days'
    },
    {
      id: 'review-card-pro',
      name: 'Review Card Pro',
      category: 'review',
      price: 39.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
      description: 'Professional review collection card with QR code',
      features: ['Google Reviews', 'Custom branding', 'Analytics', 'QR code'],
      tags: ['🚀 New'],
      rating: 4.8,
      reviews: 89,
      inStock: true,
      colors: ['Professional Black', 'Business Blue'],
      delivery: '2-4 days'
    },
    {
      id: 'nfc-bundle',
      name: 'NFC Card Bundle (5 Pack)',
      category: 'nfc',
      price: 199.99,
      originalPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=200&fit=crop',
      description: 'Perfect for teams - 5 premium NFC cards',
      features: ['Team setup', 'Bulk discount', 'Custom designs', 'Priority support'],
      tags: ['👥 Team Pack', '💸 Save 20%'],
      rating: 4.9,
      reviews: 67,
      inStock: true,
      colors: ['Mixed', 'Uniform'],
      delivery: '1-2 days'
    },
    {
      id: 'card-holder',
      name: 'Premium Card Holder',
      category: 'accessories',
      price: 19.99,
      originalPrice: 24.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop',
      description: 'Elegant leather card holder for your NFC cards',
      features: ['Genuine leather', 'RFID blocking', 'Compact design'],
      tags: ['🎁 Gift Ready'],
      rating: 4.6,
      reviews: 123,
      inStock: true,
      colors: ['Brown', 'Black', 'Navy'],
      delivery: '3-5 days'
    },
    {
      id: 'phone-stand',
      name: 'Smart Phone Stand',
      category: 'accessories',
      price: 15.99,
      originalPrice: 19.99,
      image: 'https://images.unsplash.com/photo-1512499617640-c2f999943b0f?w=300&h=200&fit=crop',
      description: 'Adjustable phone stand with NFC trigger zone',
      features: ['Adjustable angle', 'Non-slip base', 'NFC compatible'],
      tags: ['📱 Tech Accessory'],
      rating: 4.5,
      reviews: 89,
      inStock: true,
      colors: ['White', 'Black'],
      delivery: '5-7 days'
    }
  ]

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory)

  const toggleCardFlip = (productId) => {
    const newFlipped = new Set(flippedCards)
    if (newFlipped.has(productId)) {
      newFlipped.delete(productId)
    } else {
      newFlipped.add(productId)
    }
    setFlippedCards(newFlipped)
  }

  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity }])
    }
    toast.success(`🛒 Added ${product.name} to cart!`)
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
    toast.success('🗑️ Removed from cart')
  }

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity }
        : item
    ))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleCheckout = () => {
    if (cart.length === 0) return toast.error('Your cart is empty')
    setShowCheckout(true)
  }

  const placeOrder = async () => {
    try {
      if (!checkout.fullName || !checkout.email || !checkout.street || !checkout.city || !checkout.state || !checkout.zipCode || !checkout.country) {
        return toast.error('Please complete shipping details')
      }
      const items = cart.map(i => ({
        productType: i.category === 'review' ? 'review_card' : 'nfc_card',
        quantity: i.quantity,
        unitPrice: i.price,
        name: i.name,
      }))
      const totalAmount = Number(getTotalPrice().toFixed(2))
      const payload = {
        customerInfo: {
          name: checkout.fullName,
          email: checkout.email,
          phone: checkout.phone || 'N/A'
        },
        items,
        shipping: {
          address: {
            street: checkout.street,
            city: checkout.city,
            state: checkout.state,
            zipCode: checkout.zipCode,
            country: checkout.country
          }
        },
        payment: {
          method: 'bank_transfer'
        },
        notes: `Order via Shop | Contact: ${checkout.fullName} ${checkout.phone || ''}`
      }
      const res = await orderAPI.createOrder(payload)
      if (res.data?.success) {
        toast.success('✅ Order placed successfully')
        setCart([])
        setShowCheckout(false)
        setShowCart(false)
      } else {
        toast.error(res.data?.message || 'Failed to place order')
      }
    } catch (e) {
      console.error(e)
      toast.error('Failed to place order')
    }
  }

  const ProductCard = ({ product }) => {
    const isFlipped = flippedCards.has(product.id)

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative h-96 perspective-1000"
      >
        <motion.div
          className="relative w-full h-full transform-style-preserve-3d transition-transform duration-700"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
        >
          {/* Front of card */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div className="card p-0 h-full overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => toggleCardFlip(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  title="View details"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product.rating}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    🚚 {product.delivery}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(product)}
                  className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-2.5 rounded-lg font-medium hover:from-primary-600 hover:to-accent-600 transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div className="card p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <button
                  onClick={() => toggleCardFlip(product.id)}
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                    <span>✨</span>
                    <span>Features</span>
                  </h4>
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="w-3 h-3 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                    <span>🎨</span>
                    <span>Available Colors</span>
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {product.colors.map((color, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{product.rating} ({product.reviews} reviews)</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                  className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-2.5 rounded-lg font-medium hover:from-primary-600 hover:to-accent-600 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center space-x-3">
            <span>💳</span>
            <span>{isConnectionUnlimitedUser ? 'FiindIt Admin Shop' : 'FiindIt Shop'}</span>
            {isConnectionUnlimitedUser && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1"
              >
                <span>👑</span>
                <span>Admin</span>
              </motion.span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isConnectionUnlimitedUser
              ? 'Manage your card inventory, track sales, and fulfill customer orders'
              : 'Get your NFC cards and accessories to enhance your digital networking'
            }
          </p>
        </div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCart(true)}
          className="mt-4 lg:mt-0 relative bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg font-medium hover:from-primary-600 hover:to-accent-600 transition-all flex items-center space-x-2"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Cart ({cart.length})</span>
          {cart.length > 0 && (
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {cart.reduce((total, item) => total + item.quantity, 0)}
            </motion.span>
          )}
        </motion.button>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-3"
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${selectedCategory === category.id
              ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            <span>{category.emoji}</span>
            <span>{category.name}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Products Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="wait">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Shopping Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                  <span>🛒</span>
                  <span>Shopping Cart</span>
                </h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Add some awesome products to get started!
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ${item.price} each
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-600 transition-colors mt-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        Total: ${getTotalPrice().toFixed(2)}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center space-x-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      <span>Proceed to Checkout</span>
                    </motion.button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                      🔒 Secure checkout • Free shipping on orders over $100
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Checkout</h3>
                <button onClick={() => setShowCheckout(false)} className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <input value={checkout.fullName} onChange={e => setCheckout({ ...checkout, fullName: e.target.value })} placeholder="Full Name" className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                <input value={checkout.email} onChange={e => setCheckout({ ...checkout, email: e.target.value })} placeholder="Email" className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                <input value={checkout.phone} onChange={e => setCheckout({ ...checkout, phone: e.target.value })} placeholder="Phone" className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                <input value={checkout.street} onChange={e => setCheckout({ ...checkout, street: e.target.value })} placeholder="Street" className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={checkout.city} onChange={e => setCheckout({ ...checkout, city: e.target.value })} placeholder="City" className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                  <input value={checkout.state} onChange={e => setCheckout({ ...checkout, state: e.target.value })} placeholder="State" className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input value={checkout.zipCode} onChange={e => setCheckout({ ...checkout, zipCode: e.target.value })} placeholder="ZIP Code" className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                  <input value={checkout.country} onChange={e => setCheckout({ ...checkout, country: e.target.value })} placeholder="Country" className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">${getTotalPrice().toFixed(2)}</div>
              </div>

              <button onClick={placeOrder} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium">Place Order (COD)</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <span>🛡️</span>
          <span>Why Choose FiindIt?</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Lifetime Warranty</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">All products covered</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Fast Shipping</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">1-3 day delivery</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Instant Setup</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ready in minutes</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Gift className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Perfect Gifts</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Professional & personal</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Shop 