import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Crown,
  Shield,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { adminAPI } from '../../../services/api'
import QRCodeDisplay from 'react-qr-code'


const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [userIdToUsername, setUserIdToUsername] = useState({})

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, filterRole, filterStatus])

  const loadUsers = async () => {
    try {
      setLoading(true)

      // Fetch users from backend API
      const response = await adminAPI.getUsers({
        include: 'profiles,analytics,orders'
      })

      console.log(response.data.data)

      if (response.data.success) {
        const apiUsers = response.data.data.map(user => ({
          id: user._id,
          name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
          email: user.email,
          role: user.role || 'user',
          status: user.isActive ? 'active' : 'inactive',
          createdAt: new Date(user.createdAt).toLocaleDateString(),
          lastLogin: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never',
          phone: user.phone || '',
          company: user.company || '',
          location: user.location || '',
          profileViews: user.analytics?.profileViews || 0,
          qrScans: user.analytics?.qrScans || 0,
          ordersCount: user.orders?.length || 0
        }))

        setUsers(apiUsers)

        // Fetch profiles to map userId -> username for QR links
        try {
          const profilesRes = await adminAPI.getAllProfiles({ limit: 1000 })
          if (profilesRes.data?.success) {
            const map = {}
            for (const p of profilesRes.data.data) {
              if (p.user?._id && p.username) {
                map[p.user._id] = p.username
              }
            }
            setUserIdToUsername(map)
          }
        } catch (e) {
          console.error('Failed to load usernames for QR:', e)
        }
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)

      // Fallback to demo data if API fails
      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          status: 'active',
          createdAt: '2024-01-15',
          lastLogin: '2024-01-20',
          phone: '+1234567890',
          company: 'Tech Corp',
          location: 'New York, NY',
          profileViews: 156,
          qrScans: 23,
          ordersCount: 2
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah@company.com',
          role: 'user',
          status: 'active',
          createdAt: '2024-01-10',
          lastLogin: '2024-01-19',
          phone: '+1234567891',
          company: 'Marketing Inc',
          location: 'Los Angeles, CA',
          profileViews: 89,
          qrScans: 12,
          ordersCount: 1
        },
        {
          id: 3,
          name: 'Admin User',
          email: 'admin@connectionunlimited.com',
          role: 'admin',
          status: 'active',
          createdAt: '2024-01-01',
          lastLogin: '2024-01-20',
          phone: '+1234567892',
          company: 'FiindIt',
          location: 'San Francisco, CA',
          profileViews: 0,
          qrScans: 0,
          ordersCount: 0
        },
        {
          id: 4,
          name: 'Mike Chen',
          email: 'mike@startup.com',
          role: 'user',
          status: 'inactive',
          createdAt: '2024-01-05',
          lastLogin: '2024-01-15',
          phone: '+1234567893',
          company: 'Startup Hub',
          location: 'Austin, TX',
          profileViews: 45,
          qrScans: 8,
          ordersCount: 0
        }
      ]
      setUsers(mockUsers)
      toast.error('Using demo data - Backend connection failed')
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole)
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus)
    }

    setFilteredUsers(filtered)
  }

  const getProfileUrl = (userId) => {
    const username = userIdToUsername[userId]
    if (!username) return ''
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    return `${origin}/p/${username}`
  }

  const downloadQrSvg = (user) => {
    const svg = document.getElementById(`qr-${user.id}`)
    if (!svg) return toast.error('QR not ready')
    const serializer = new XMLSerializer()
    const source = serializer.serializeToString(svg)
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const safeName = (user.name || 'user').toLowerCase().replace(/[^a-z0-9]+/g, '-')
    link.download = `${safeName}-qr.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('QR downloaded')
  }

  const handleUserAction = async (action, user) => {
    try {
      switch (action) {
        case 'view':
          setSelectedUser(user)
          setShowUserModal(true)
          break
        case 'edit':
          toast.info(`Edit user: ${user.name}`)
          break
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
            await adminAPI.deleteUser(user.id)
            setUsers(users.filter(u => u.id !== user.id))
            toast.success(`User ${user.name} deleted`)
          }
          break
        case 'activate':
          await adminAPI.updateUser(user.id, { isActive: true })
          setUsers(users.map(u => u.id === user.id ? { ...u, status: 'active' } : u))
          toast.success(`User ${user.name} activated`)
          break
        case 'deactivate':
          await adminAPI.updateUser(user.id, { isActive: false })
          setUsers(users.map(u => u.id === user.id ? { ...u, status: 'inactive' } : u))
          toast.success(`User ${user.name} deactivated`)
          break
        case 'makeAdmin':
          await adminAPI.updateUser(user.id, { role: 'admin' })
          setUsers(users.map(u => u.id === user.id ? { ...u, role: 'admin' } : u))
          toast.success(`${user.name} is now an admin`)
          break
        default:
          break
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error)
      toast.error(`Failed to ${action} user`)
    }
  }

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Status', 'Company', 'Phone', 'Created', 'Last Login'],
      ...filteredUsers.map(user => [
        user.name,
        user.email,
        user.role,
        user.status,
        user.company || '',
        user.phone || '',
        user.createdAt,
        user.lastLogin
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'connectionunlimited-users.csv'
    a.click()
    toast.success('Users exported to CSV')
  }

  const UserModal = () => (
    <AnimatePresence>
      {showUserModal && selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowUserModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 dark:text-white">{selectedUser.name}</span>
                    {selectedUser.role === 'admin' && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{selectedUser.email}</span>
                  </div>
                </div>

                {selectedUser.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{selectedUser.phone}</span>
                    </div>
                  </div>
                )}

                {selectedUser.company && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company
                    </label>
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{selectedUser.company}</span>
                    </div>
                  </div>
                )}

                {selectedUser.location && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{selectedUser.location}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedUser.role === 'admin'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                    }`}>
                    {selectedUser.role === 'admin' ? 'Administrator' : 'User'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedUser.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                    {selectedUser.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Created
                  </label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{selectedUser.createdAt}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Login
                  </label>
                  <span className="text-gray-900 dark:text-white">{selectedUser.lastLogin}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedUser.profileViews}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Profile Views</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedUser.qrScans}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">QR Scans</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedUser.ordersCount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Orders</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => handleUserAction('edit', selectedUser)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Edit User
              </button>
              {selectedUser.status === 'active' ? (
                <button
                  onClick={() => handleUserAction('deactivate', selectedUser)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Deactivate
                </button>
              ) : (
                <button
                  onClick={() => handleUserAction('activate', selectedUser)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Activate
                </button>
              )}
              {selectedUser.role !== 'admin' && (
                <button
                  onClick={() => handleUserAction('makeAdmin', selectedUser)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Make Admin
                </button>
              )}
              <button
                onClick={() => handleUserAction('delete', selectedUser)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete User
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all FiindIt users, their roles, and access permissions
          </p>
        </div>

        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <button
            onClick={exportUsers}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => toast.info('Add user feature coming soon')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    QR Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                            <span>{user.name}</span>
                            {user.role === 'admin' && <Crown className="w-4 h-4 text-yellow-500" />}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                          }`}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                        <br />
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{user.company || '-'}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.location || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {(() => {
                        const url = getProfileUrl(user.id)
                        if (!url) return <span className="text-gray-400">No username</span>
                        return (
                          <div className="flex items-center space-x-3">
                            <div className="p-1 bg-white rounded">
                              <QRCodeDisplay id={`qr-${user.id}`} value={url} size={64} level="M" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs break-all max-w-[220px]">{url}</span>
                              <button
                                onClick={() => downloadQrSvg(user)}
                                className="inline-flex items-center mt-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                              >
                                <Download className="w-3 h-3 mr-1" /> Download
                              </button>
                            </div>
                          </div>
                        )
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>Views: {user.profileViews}</div>
                      <div>Scans: {user.qrScans}</div>
                      <div>Orders: {user.ordersCount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUserAction('view', user)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUserAction('edit', user)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUserAction('delete', user)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
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

      <UserModal />
    </div>
  )
}

export default UserManagement 