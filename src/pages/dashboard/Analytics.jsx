import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Users, 
  Activity, 
  Share2,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useAnalytics } from '../../contexts/AnalyticsContext';

const Analytics = () => {
  const { trackEvent } = useAnalytics();
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    overview: {
      totalViews: 0,
      totalLeads: 0,
      totalScans: 0,
      conversionRate: 0
    },
    trends: [],
    sources: [],
    devices: [],
    locations: []
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAnalytics({
        overview: {
          totalViews: 1247,
          totalLeads: 89,
          totalScans: 690,
          conversionRate: 7.1
        },
        trends: [
          { date: '2024-01-01', views: 45, leads: 3, scans: 23 },
          { date: '2024-01-02', views: 52, leads: 4, scans: 28 },
          { date: '2024-01-03', views: 38, leads: 2, scans: 19 },
          { date: '2024-01-04', views: 67, leads: 6, scans: 35 },
          { date: '2024-01-05', views: 89, leads: 8, scans: 47 },
          { date: '2024-01-06', views: 76, leads: 5, scans: 41 },
          { date: '2024-01-07', views: 94, leads: 7, scans: 52 }
        ],
        sources: [
          { name: 'QR Code', value: 45, color: '#3B82F6' },
          { name: 'NFC Tap', value: 30, color: '#10B981' },
          { name: 'Direct Link', value: 15, color: '#F59E0B' },
          { name: 'Social Media', value: 10, color: '#EF4444' }
        ],
        devices: [
          { name: 'Mobile', value: 65, color: '#3B82F6' },
          { name: 'Desktop', value: 25, color: '#10B981' },
          { name: 'Tablet', value: 10, color: '#F59E0B' }
        ],
        locations: [
          { name: 'United States', value: 40, color: '#3B82F6' },
          { name: 'India', value: 25, color: '#10B981' },
          { name: 'United Kingdom', value: 15, color: '#F59E0B' },
          { name: 'Canada', value: 10, color: '#EF4444' },
          { name: 'Others', value: 10, color: '#8B5CF6' }
        ]
      });
      setIsLoading(false);
    }, 1000);
  };

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {Math.abs(change)}% from last period
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const ChartCard = ({ title, children, className = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      {children}
    </motion.div>
  );

  const PieChartComponent = ({ data, size = 120 }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className="flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;

            const x1 = size / 2 + (size / 2 - 10) * Math.cos((startAngle * Math.PI) / 180);
            const y1 = size / 2 + (size / 2 - 10) * Math.sin((startAngle * Math.PI) / 180);
            const x2 = size / 2 + (size / 2 - 10) * Math.cos((currentAngle * Math.PI) / 180);
            const y2 = size / 2 + (size / 2 - 10) * Math.sin((currentAngle * Math.PI) / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            return (
              <path
                key={index}
                d={`M ${size / 2} ${size / 2} L ${x1} ${y1} A ${size / 2 - 10} ${size / 2 - 10} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={item.color}
                className="transition-all duration-300 hover:opacity-80"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  const BarChartComponent = ({ data, height = 200 }) => {
    const maxValue = Math.max(...data.map(item => Math.max(item.views, item.leads, item.scans)));
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span>Views</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              <span>Leads</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
              <span>Scans</span>
            </div>
          </div>
        </div>
        <div className="flex items-end space-x-2 h-48">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center space-y-2">
              <div className="flex flex-col space-y-1 w-full">
                <div 
                  className="bg-blue-500 rounded-t"
                  style={{ height: `${(item.views / maxValue) * 100}%` }}
                ></div>
                <div 
                  className="bg-green-500"
                  style={{ height: `${(item.leads / maxValue) * 100}%` }}
                ></div>
                <div 
                  className="bg-purple-500 rounded-b"
                  style={{ height: `${(item.scans / maxValue) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your profile performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadAnalytics}
            disabled={isLoading}
            className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Views"
          value={analytics.overview.totalViews.toLocaleString()}
          change={12}
          icon={Eye}
          color="bg-blue-100 dark:bg-blue-900"
        />
        <StatCard
          title="Total Leads"
          value={analytics.overview.totalLeads.toLocaleString()}
          change={8}
          icon={Users}
          color="bg-green-100 dark:bg-green-900"
        />
        <StatCard
          title="Total Scans"
          value={analytics.overview.totalScans.toLocaleString()}
          change={15}
          icon={Activity}
          color="bg-purple-100 dark:bg-purple-900"
        />
        <StatCard
          title="Conversion Rate"
          value={`${analytics.overview.conversionRate}%`}
          change={-2}
          icon={TrendingUp}
          color="bg-orange-100 dark:bg-orange-900"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends Chart */}
        <ChartCard title="Performance Trends" className="lg:col-span-2">
          <BarChartComponent data={analytics.trends} />
        </ChartCard>

        {/* Traffic Sources */}
        <ChartCard title="Traffic Sources">
          <div className="flex items-center space-x-6">
            <PieChartComponent data={analytics.sources} />
            <div className="flex-1 space-y-3">
              {analytics.sources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded mr-2"
                      style={{ backgroundColor: source.color }}
                    ></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{source.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{source.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Device Distribution */}
        <ChartCard title="Device Distribution">
          <div className="flex items-center space-x-6">
            <PieChartComponent data={analytics.devices} />
            <div className="flex-1 space-y-3">
              {analytics.devices.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded mr-2"
                      style={{ backgroundColor: device.color }}
                    ></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{device.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{device.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Geographic Distribution */}
        <ChartCard title="Geographic Distribution" className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-6">
              <PieChartComponent data={analytics.locations} size={100} />
              <div className="flex-1 space-y-3">
                {analytics.locations.slice(0, 3).map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded mr-2"
                        style={{ backgroundColor: location.color }}
                      ></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{location.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{location.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {analytics.locations.slice(3).map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded mr-2"
                      style={{ backgroundColor: location.color }}
                    ></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{location.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{location.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Recent Activity */}
      <ChartCard title="Recent Activity">
        <div className="space-y-4">
          {analytics.trends.slice(-5).reverse().map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(item.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.views} views • {item.leads} leads • {item.scans} scans
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.leads > 0 ? `${((item.leads / item.views) * 100).toFixed(1)}%` : '0%'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">conversion</p>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

export default Analytics; 