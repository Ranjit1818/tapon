import { motion } from 'framer-motion'
import { ShieldX, Crown, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const AccessDenied = ({
  title = "Access Restricted",
  message = "This feature is only available to FiindIt administrators.",
  requiredRole = "admin"
}) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto text-center p-8"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center"
        >
          <ShieldX className="w-10 h-10 text-red-500" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
        >
          {title}
        </motion.h2>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400 mb-6"
        >
          {message}
        </motion.p>

        {/* Admin Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-6"
        >
          <div className="flex items-center justify-center mb-3">
            <Crown className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              FiindIt Admin Access Required
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            This feature is exclusive to FiindIt administrators who can:
          </p>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>📎 Generate QR codes for cards</li>
            <li>📊 View detailed analytics and sales</li>
            <li>💳 Manage card inventory</li>
            <li>👥 Handle customer orders</li>
          </ul>
        </motion.div>

        {/* Actions */}
        <div className="space-y-3">
          <Link to="/app/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </motion.button>
          </Link>

          <Link to="/app/dashboard/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2"
            >
              <span>💳</span>
              <span>Shop for Cards Instead</span>
            </motion.button>
          </Link>
        </div>

        {/* Contact Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-gray-500 dark:text-gray-400 mt-6"
        >
          Need admin access? Contact FiindIt support
        </motion.p>
      </motion.div>
    </div>
  )
}

export default AccessDenied 