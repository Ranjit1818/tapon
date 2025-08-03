import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag,
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Truck,
  DollarSign,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  AlertTriangle,
  RefreshCw,
  MoreVertical,
  Send,
  MessageSquare
} from 'lucide-react'
import toast from 'react-hot-toast'

const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterProduct, setFilterProduct] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, filterStatus, filterProduct])

  const loadOrders = async () => {
    setLoading(true)
    // Simulate API call - replace with real API
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'ORD-001',
          userId: 1,
          userName: 'John Doe',
          userEmail: 'john@example.com',
          userPhone: '+1234567890',
          product: 'NFC Card',
          quantity: 2,
          price: 49.99,
          total: 99.98,
          status: 'pending',
          paymentStatus: 'paid',
          paymentMethod: 'stripe',
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          },
          createdAt: '2024-01-20',
          updatedAt: '2024-01-20',
          notes: 'Customer requested express shipping',
          trackingNumber: null
        },
        {
          id: 'ORD-002',
          userId: 2,
          userName: 'Sarah Johnson',
          userEmail: 'sarah@company.com',
          userPhone: '+1234567891',
          product: 'Review Card',
          quantity: 1,
          price: 29.99,
          total: 29.99,
          status: 'processing',
          paymentStatus: 'paid',
          paymentMethod: 'paypal',
          shippingAddress: {
            street: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210',
            country: 'USA'
          },
          createdAt: '2024-01-19',
          updatedAt: '2024-01-20',
          notes: '',
          trackingNumber: 'TRK123456789'
        },
        {
          id: 'ORD-003',
          userId: 3,
          userName: 'Mike Chen',
          userEmail: 'mike@startup.com',
          userPhone: '+1234567892',
          product: 'NFC Card',
          quantity: 5,
          price: 49.99,
          total: 199.95,
          status: 'shipped',
          paymentStatus: 'paid',
          paymentMethod: 'stripe',
          shippingAddress: {
            street: '789 Pine St',
            city: 'Austin',
            state: 'TX',
            zipCode: '78701',
            country: 'USA'
          },
          createdAt: '2024-01-18',
          updatedAt: '2024-01-19',
          notes: 'Bulk order discount applied',
          trackingNumber: 'TRK987654321'
        },
        {
          id: 'ORD-004',
          userId: 4,
          userName: 'Lisa Wang',
          userEmail: 'lisa@design.com',
          userPhone: '+1234567893',
          product: 'Custom Card',
          quantity: 1,
          price: 79.99,
          total: 79.99,
          status: 'delivered',
          paymentStatus: 'paid',
          paymentMethod: 'stripe',
          shippingAddress: {
            street: '321 Elm St',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101',
            country: 'USA'
          },
          createdAt: '2024-01-15',
          updatedAt: '2024-01-18',
          notes: 'Custom design approved',
          trackingNumber: 'TRK456789123'
        }
      ]
      setOrders(mockOrders)
      setLoading(false)
    }, 1000)
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus)
    }

    if (filterProduct !== 'all') {
      filtered = filtered.filter(order => order.product === filterProduct)
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
        : order
    ))
    toast.success(`Order ${orderId} status updated to ${newStatus}`)
  }

  const addTrackingNumber = (orderId, trackingNumber) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, trackingNumber, updatedAt: new Date().toISOString().split('T')[0] }
        : order
    ))
    toast.success('Tracking number added')
  }

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Email', 'Product', 'Quantity', 'Total', 'Status', 'Payment', 'Created', 'Tracking'],
      ...filteredOrders.map(order => [
        order.id,
        order.userName,
        order.userEmail,
        order.product,
        order.quantity,
        order.total,
        order.status,
        order.paymentStatus,
        order.createdAt,
        order.trackingNumber || ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'taponn-orders.csv'
    a.click()
    toast.success('Orders exported to CSV')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'processing': return <Package className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const OrderModal = () => (
    <AnimatePresence>
      {showOrderModal && selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowOrderModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Order Details - {selectedOrder.id}
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Information</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{selectedOrder.userName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{selectedOrder.userEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{selectedOrder.userPhone}</span>
                  </div>
                </div>

                {/* Shipping Address */}
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Shipping Address</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div className="text-gray-900 dark:text-white">
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Order Information</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Product:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{selectedOrder.product}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
                    <span className="text-gray-900 dark:text-white">{selectedOrder.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Unit Price:</span>
                    <span className="text-gray-900 dark:text-white">${selectedOrder.price}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
                    <span className="text-gray-900 dark:text-white font-semibold">Total:</span>
                    <span className="text-gray-900 dark:text-white font-bold">${selectedOrder.total}</span>
                  </div>
                </div>

                {/* Status & Payment */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      <span>{selectedOrder.status}</span>
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Payment
                    </label>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <CreditCard className="w-3 h-3" />
                      <span>{selectedOrder.paymentStatus}</span>
                    </span>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Created
                    </label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{selectedOrder.createdAt}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Updated
                    </label>
                    <span className="text-gray-900 dark:text-white">{selectedOrder.updatedAt}</span>
                  </div>
                </div>

                {/* Tracking Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tracking Number
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={selectedOrder.trackingNumber || ''}
                      onChange={(e) => setSelectedOrder({...selectedOrder, trackingNumber: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter tracking number"
                    />
                    <button
                      onClick={() => addTrackingNumber(selectedOrder.id, selectedOrder.trackingNumber)}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedOrder.notes && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notes</h4>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white">{selectedOrder.notes}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                disabled={selectedOrder.status === 'processing'}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark Processing
              </button>
              <button
                onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                disabled={selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered'}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark Shipped
              </button>
              <button
                onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                disabled={selectedOrder.status === 'delivered'}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark Delivered
              </button>
              <button
                onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                disabled={selectedOrder.status === 'delivered' || selectedOrder.status === 'cancelled'}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel Order
              </button>
              <button
                onClick={() => window.open(`mailto:${selectedOrder.userEmail}?subject=Order Update - ${selectedOrder.id}`, '_blank')}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email Customer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.reduce((sum, o) => sum + o.total, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Process and manage all TapOnn card orders
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <button
            onClick={exportOrders}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Orders</span>
          </button>
          <button
            onClick={loadOrders}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Processing</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Shipped</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">${stats.revenue.toFixed(2)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Products</option>
            <option value="NFC Card">NFC Card</option>
            <option value="Review Card">Review Card</option>
            <option value="Custom Card">Custom Card</option>
          </select>

          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOrders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{order.id}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{order.createdAt}</div>
                        {order.trackingNumber && (
                          <div className="text-xs text-blue-600 dark:text-blue-400">
                            📦 {order.trackingNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{order.userName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{order.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900 dark:text-white">{order.product}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Qty: {order.quantity}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">${order.total}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowOrderModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          className="text-green-600 hover:text-green-900 dark:text-green-400"
                          disabled={order.status === 'delivered' || order.status === 'cancelled'}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => window.open(`mailto:${order.userEmail}?subject=Order Update - ${order.id}`, '_blank')}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <OrderModal />
    </div>
  )
}

export default OrderManagement 