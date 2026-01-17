import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { orderAPI } from '../services/api'
import {
  CreditCard,
  Monitor,
  Star,
  Package,
  ArrowRight,
  Filter,
  Search,
  ShoppingBag,
  Minus,
  Plus,
  X,
  Check,
  Shield,
  Truck,
  Zap,
  Gift
} from 'lucide-react'

const ProductsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Cart & Checkout State
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentDone, setPaymentDone] = useState(false)
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

  // Hardcoded constants for payment
  const HARD_CODED_UPI_ID = "8105183599-2@ybl" // replace with your GPay UPI
  const DISPLAY_NAME = "FiindIt"

  const categories = [
    { id: 'all', name: 'All Products', icon: Package },
    { id: 'nfc-cards', name: 'NFC Cards', icon: CreditCard },
    { id: 'smart-standee', name: 'Smart Standee', icon: Monitor },
    { id: 'review-cards', name: 'Review Cards', icon: Star }
  ]

  const products = [
    {
      id: 'Subscription plan',
      title: 'Subscription plan + 4 QR code Stickers',
      subtitle: 'Visiting + Complete Cards',
      description: 'Revolutionary Smart QR code that instantly share your digital profile',
      features: [
        '1 year complete subscription', //nfc card, 
        'Real time Analytics dashboard',
        'Smart Digital Profile',
        '4 stickers ',
        'Multiple profile links',
        'Real-time updates'
      ],
      price: 999,
      originalPrice: 1499,
      popular: true,
      gradient: 'from-blue-500 to-purple-600',
      image: 'https://aura-print.com/media/wysiwyg/AP_Stickers_QR_Code_Stickers_Rectangle.jpg',
      category: 'nfc-cards',
      inStock: true
    },
    {
      id: 'Subscription plan + 4 QR code Stickers',
      title: 'Subscription plan + 4 QR code Stickers + 1 Smart Standee',
      subtitle: 'Visiting + Complete Cards',
      description: 'Revolutionary Smart QR code that instantly share your digital profile',
      features: [
          '1 year complete subscription', //nfc card, 
        'Real time Analytics dashboard',
        'Smart Digital Profile',
        '4 stickers + 1 smart standee',
        'Multiple profile links',
        'Real-time updates'
      ],
      price: 1199,
      originalPrice: 1499,
      popular: true,
      gradient: 'from-blue-500 to-purple-600',
      image: 'https://www.shutterstock.com/image-vector/qr-code-sign-stand-vector-260nw-2576835625.jpg',
      category: 'nfc-cards',
      inStock: true
    },
   {
      id: 'Subscription plan + 4 QR code Stickers',
      title: 'Subscription plan + 4 QR code Stickers + 1 NFC card + 1 Smart Standee',
      subtitle: 'Visiting + Complete Cards',
      description: 'Revolutionary Smart QR code that instantly share your digital profile',
      features: [
          '1 year complete subscription', //nfc card, 
        'Real time Analytics dashboard',
        'Smart Digital Profile',
        '4 stickers + 1 smart standee',
        'Multiple profile links',
        'Real-time updates'
      ],
      price: 1599,
      originalPrice: 1499,
      popular: true,
      gradient: 'from-blue-500 to-purple-600',
      image: 'https://static.vecteezy.com/system/resources/thumbnails/069/809/307/small_2x/modern-black-credit-card-with-nfc-chip-isolated-on-transparent-background-png.png',
      category: 'nfc-cards',
      inStock: true
    },
   
  ]

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory || product.id === selectedCategory
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Cart Functions
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ))
    } else {
      setCart([...cart, { ...product, name: product.title, quantity }])
    }
    toast.success(`🛒 Added ${product.title} to cart!`)
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
    
    // Check Authentication
    if (!user) {
      toast.error('Please login to place an order')
      navigate('/app/login', { state: { returnUrl: '/products' } })
      return
    }

    setCheckout(prev => ({
        ...prev,
        fullName: user?.name || prev.fullName,
        email: user?.email || prev.email
    }))
    setShowCheckout(true)
  }

  const placeOrder = async () => {
    try {
      if (!checkout.fullName || !checkout.email || !checkout.street || !checkout.city || !checkout.state || !checkout.zipCode || !checkout.country) {
        return toast.error('Please complete shipping details')
      }
      
      const items = cart.map(i => ({
        productType: 'nfc_card', // defaulting to nfc_card for now, or derive from category
        quantity: i.quantity,
        unitPrice: i.price,
        name: i.title || i.name,
      }))
      
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
            method: 'upi',
            status: paymentDone ? 'completed' : 'pending' // You might want strict control here
        },
        notes: `Order via Products Page | Contact: ${checkout.fullName} ${checkout.phone || ''}`
      }
      
      const res = await orderAPI.createOrder(payload)
      if (res.data?.success) {
        toast.success('✅ Order placed successfully')
        setCart([])
        setShowCheckout(false)
        setShowCart(false)
        setPaymentDone(false)
      } else {
        toast.error(res.data?.message || 'Failed to place order')
      }
    } catch (e) {
      console.error(e)
      toast.error('Failed to place order')
    }
  }

  return (
    <>
      <Helmet>
        <title>Products - FiindIt | Digital Profile Platform</title>
        <meta name="description" content="Explore our range of NFC products including business cards, smart standees, and review cards designed to transform your networking experience." />
      </Helmet>

      <div className="pt-20 pb-16 relative">
        {/* Floating Cart Button (Mobile/Desktop) */}
        <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCart(true)}
            className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-primary-500 to-accent-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
        >
            <ShoppingBag className="w-6 h-6" />
            {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                {cart.reduce((total, item) => total + item.quantity, 0)}
            </span>
            )}
        </motion.button>

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
                    <div className="card p-8 h-full hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 flex flex-col">
                      {/* Badge */}
                      {product.badge && (
                        <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${product.gradient}`}>
                          {product.badge}
                        </div>
                      )}

                      {/* Product Image Placeholder - Replace with actual images if available */}
                       <div className={`w-full h-48 bg-gray-100 rounded-xl mb-6 flex items-center justify-center overflow-hidden`}>
                         {product.image.startsWith('http') ? (
                             <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                         ) : (
                             <div className={`w-full h-full bg-gradient-to-br ${product.gradient} flex items-center justify-center`}>
                                <div className="text-white text-4xl font-bold">
                                {product.title.split(' ').map(word => word[0]).join('')}
                                </div>
                             </div>
                         )}
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {product.title}
                      </h3>
                      <p className="text-primary-600 dark:text-primary-400 font-medium mb-4">
                        {product.subtitle}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-2 mb-6 flex-grow">
                        {product.features.slice(0, 4).map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{product.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link to={`/product/${product.id}`} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                Details
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => addToCart(product)}
                                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Add
                            </motion.button>
                        </div>
                      </div>
                    </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

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
                             <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                {item.image?.startsWith('http') ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className={`w-full h-full bg-gradient-to-br ${item.gradient || 'from-gray-400 to-gray-500'}`} />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                {item.title || item.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ₹{item.price} each
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
                                ₹{(item.price * item.quantity).toFixed(2)}
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
                            Total: ₹{getTotalPrice().toFixed(2)}
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
                        🔒 Secure checkout • Free shipping on orders over ₹100
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
                className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
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
                    <div className="text-lg font-bold text-gray-900 dark:text-white">₹{getTotalPrice().toFixed(2)}</div>
                </div>

                <div className="w-full px-1 space-y-3 mt-4">
                    {/* Pay Now Button */}
                    <a
                    href={
                        paymentDone
                        ? '#'
                        : `upi://pay?pa=${HARD_CODED_UPI_ID}&pn=${encodeURIComponent(DISPLAY_NAME)}&cu=INR&am=${getTotalPrice().toFixed(2)}`
                    }
                    onClick={(e) => {
                        if (paymentDone) {
                            e.preventDefault();
                            toast.success("Payment already marked as done.");
                        }
                    }}
                    className={`w-full py-4 px-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg
                        ${
                        paymentDone
                            ? "bg-green-600 shadow-green-500/20 cursor-default"
                            : "bg-gradient-to-r from-amber-500 to-orange-600 shadow-orange-500/20 cursor-pointer"
                        }`}
                    >
                    {paymentDone ? <Check className="w-6 h-6 text-white"/> : <CreditCard className="w-6 h-6 text-white" />}
                    <span className="text-lg font-bold text-white">{paymentDone ? "Payment Done" : "Pay Now"}</span>
                    </a>

                    {/* Checkbox */}
                    <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                        type="checkbox"
                        checked={paymentDone}
                        onChange={(e) => setPaymentDone(e.target.checked)}
                        className="w-4 h-4 accent-green-600"
                    />
                    I have done this payment
                    </label>
                </div>

                <button 
                    onClick={placeOrder} 
                    disabled={!paymentDone}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors"
                >
                    Place Order
                </button>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>

            
      </div>
    </>
  )
}

export default ProductsPage 