import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon,
  Shield,
  Database,
  Mail,
  Bell,
  Globe,
  Users,
  Key,
  Server,
  Palette,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  // Settings state
  const [settings, setSettings] = useState({
    general: {
      siteName: 'TapOnn',
      siteDescription: 'Smart Digital Profile Platform',
      contactEmail: 'support@taponn.com',
      timezone: 'UTC',
      language: 'en',
      maintenanceMode: false
    },
    security: {
      enableTwoFactor: true,
      requireStrongPasswords: true,
      sessionTimeout: 60,
      maxLoginAttempts: 3,
      enableAuditLogs: true,
      allowPublicRegistration: true
    },
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      userRegistrationNotifications: true,
      systemAlerts: true,
      webhookUrl: '',
      slackWebhook: ''
    },
    database: {
      backupFrequency: 'daily',
      retentionPeriod: 30,
      autoBackup: true,
      compressionEnabled: true
    },
    api: {
      rateLimit: 1000,
      enableCors: true,
      corsOrigins: 'https://taponn.com',
      apiVersion: 'v1',
      webhookSecret: 'your-webhook-secret'
    },
    appearance: {
      theme: 'light',
      primaryColor: '#3B82F6',
      logoUrl: '',
      favicon: '',
      customCss: ''
    }
  })

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'api', label: 'API', icon: Server },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ]

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
    setUnsavedChanges(true)
  }

  const saveSettings = () => {
    // Simulate API call
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setUnsavedChanges(false)
          resolve('Settings saved successfully')
        }, 1000)
      }),
      {
        loading: 'Saving settings...',
        success: 'Settings saved successfully!',
        error: 'Failed to save settings'
      }
    )
  }

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      // Reset logic here
      setUnsavedChanges(true)
      toast.success('Settings reset to defaults')
    }
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contact Email
          </label>
          <input
            type="email"
            value={settings.general.contactEmail}
            onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Site Description
        </label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Timezone
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Language
          </label>
          <select
            value={settings.general.language}
            onChange={(e) => updateSetting('general', 'language', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <input
          type="checkbox"
          id="maintenanceMode"
          checked={settings.general.maintenanceMode}
          onChange={(e) => updateSetting('general', 'maintenanceMode', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <div className="flex-1">
          <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-900 dark:text-white">
            Maintenance Mode
          </label>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Enable to put the site in maintenance mode for all users except admins
          </p>
        </div>
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Session Timeout (minutes)
          </label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="space-y-4">
        {[
          { key: 'enableTwoFactor', label: 'Enable Two-Factor Authentication', description: 'Require 2FA for admin accounts' },
          { key: 'requireStrongPasswords', label: 'Require Strong Passwords', description: 'Enforce password complexity requirements' },
          { key: 'enableAuditLogs', label: 'Enable Audit Logs', description: 'Log all admin actions for security auditing' },
          { key: 'allowPublicRegistration', label: 'Allow Public Registration', description: 'Allow new users to register without invitation' }
        ].map((setting) => (
          <div key={setting.key} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <input
              type="checkbox"
              id={setting.key}
              checked={settings.security[setting.key]}
              onChange={(e) => updateSetting('security', setting.key, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="flex-1">
              <label htmlFor={setting.key} className="text-sm font-medium text-gray-900 dark:text-white">
                {setting.label}
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">{setting.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', label: 'Email Notifications', description: 'Send email notifications for important events' },
          { key: 'orderNotifications', label: 'Order Notifications', description: 'Get notified when new orders are placed' },
          { key: 'userRegistrationNotifications', label: 'User Registration Notifications', description: 'Get notified when new users register' },
          { key: 'systemAlerts', label: 'System Alerts', description: 'Receive alerts for system issues and errors' }
        ].map((setting) => (
          <div key={setting.key} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <input
              type="checkbox"
              id={setting.key}
              checked={settings.notifications[setting.key]}
              onChange={(e) => updateSetting('notifications', setting.key, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="flex-1">
              <label htmlFor={setting.key} className="text-sm font-medium text-gray-900 dark:text-white">
                {setting.label}
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400">{setting.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Webhook URL
          </label>
          <input
            type="url"
            value={settings.notifications.webhookUrl}
            onChange={(e) => updateSetting('notifications', 'webhookUrl', e.target.value)}
            placeholder="https://your-webhook-endpoint.com"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Slack Webhook URL
          </label>
          <input
            type="url"
            value={settings.notifications.slackWebhook}
            onChange={(e) => updateSetting('notifications', 'slackWebhook', e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings()
      case 'security': return renderSecuritySettings()
      case 'notifications': return renderNotificationSettings()
      case 'database':
        return <div className="text-center py-12 text-gray-500">Database settings coming soon...</div>
      case 'api':
        return <div className="text-center py-12 text-gray-500">API settings coming soon...</div>
      case 'appearance':
        return <div className="text-center py-12 text-gray-500">Appearance settings coming soon...</div>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Admin Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure system settings and preferences
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <button
            onClick={resetToDefaults}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={saveSettings}
            disabled={!unsavedChanges}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {unsavedChanges && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center space-x-3"
        >
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              You have unsaved changes
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-300">
              Don't forget to save your changes before leaving this page.
            </p>
          </div>
        </motion.div>
      )}

      {/* Settings Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3 mb-6">
              {(() => {
                const tab = tabs.find(t => t.id === activeTab)
                const Icon = tab?.icon
                return Icon ? <Icon className="w-6 h-6 text-blue-500" /> : null
              })()}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {tabs.find(t => t.id === activeTab)?.label} Settings
              </h2>
            </div>
            
            {renderContent()}
          </motion.div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">API Status</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Operational</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Database</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Connected</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Storage</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings 