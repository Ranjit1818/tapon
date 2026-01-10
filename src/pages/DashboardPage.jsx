import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import {
  User,
  BarChart3,
  Users,
  Settings,
  Plus,
  Edit,
  Download,
  Share2,
  Eye,
  TrendingUp,
  Calendar,
  Bell,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react'

// Dashboard Components
import DashboardOverview from './dashboard/DashboardOverview'
import ProfileManagement from './dashboard/ProfileManagement'
import Analytics from './dashboard/Analytics'
import LeadManagement from './dashboard/LeadManagement'
import SettingsPage from './dashboard/SettingsPage'

const DashboardPage = () => {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: BarChart3 },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
    { name: 'Leads', href: '/dashboard/leads', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings }
  ]

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - LetsConnect</title>
        <meta name="description" content="Manage your FiindIt digital profile, track leads, and view analytics." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Top Navigation */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <Link to="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">T</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">FiindIt</span>
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 relative">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">U</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
            <div className="flex flex-col h-full">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 flex-1 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                          ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                      <item.icon className="mr-3 w-5 h-5" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Plus className="mr-3 w-4 h-4" />
                    Create New Profile
                  </button>
                  <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Share2 className="mr-3 w-4 h-4" />
                    Share Profile
                  </button>
                  <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Download className="mr-3 w-4 h-4" />
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Routes>
                  <Route path="/" element={<DashboardOverview />} />
                  <Route path="/profile" element={<ProfileManagement />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/leads" element={<LeadManagement />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </>
  )
}

export default DashboardPage 