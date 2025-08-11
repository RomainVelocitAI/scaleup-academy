'use client'

import { useState } from 'react'
import { 
  TrendingUp, TrendingDown, Activity, Users, Clock, Award,
  Calendar, DollarSign, BookOpen, Target, CheckCircle, XCircle,
  BarChart3, LineChart, PieChart, ArrowUp, ArrowDown, Filter,
  Download, RefreshCw, ChevronDown, Info, AlertCircle
} from 'lucide-react'

interface AnalyticsData {
  enrollmentGrowth: {
    percentage: number
    trend: 'up' | 'down' | 'stable'
    data: { date: string; count: number }[]
  }
  completionRate: {
    current: number
    previous: number
    trend: 'up' | 'down' | 'stable'
  }
  averageProgress: {
    percentage: number
    moduleBreakdown: { module: string; progress: number }[]
  }
  engagementMetrics: {
    averageTimePerLesson: number
    dailyActiveUsers: number
    weeklyActiveUsers: number
    monthlyActiveUsers: number
  }
  revenue: {
    total: number
    recurring: number
    oneTime: number
    growth: number
    trend: 'up' | 'down' | 'stable'
  }
  studentPerformance: {
    averageQuizScore: number
    passRate: number
    topPerformers: { name: string; score: number }[]
  }
  contentEngagement: {
    mostWatchedLessons: { title: string; views: number; completion: number }[]
    leastEngagedContent: { title: string; dropoffRate: number }[]
  }
}

interface CourseAnalyticsProps {
  courseId: string
  analytics: AnalyticsData
  onRefresh?: () => void
  onExport?: () => void
}

export default function CourseAnalytics({ courseId, analytics, onRefresh, onExport }: CourseAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [selectedMetric, setSelectedMetric] = useState<'enrollment' | 'engagement' | 'revenue' | 'performance'>('enrollment')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getMetricCard = (title: string, value: string | number, change: number, trend: 'up' | 'down' | 'stable', icon: React.ReactNode) => (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          {icon}
        </div>
        {getTrendIcon(trend)}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className={`text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{Math.abs(change)}%
        </span>
        <span className="text-xs text-gray-500">vs last period</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Course Analytics</h3>
          <p className="text-sm text-gray-500 mt-1">Track performance and engagement metrics</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button 
            onClick={onRefresh}
            className="p-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          
          <button 
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {getMetricCard(
          'Total Enrollment',
          analytics.enrollmentGrowth.data[analytics.enrollmentGrowth.data.length - 1]?.count || 0,
          analytics.enrollmentGrowth.percentage,
          analytics.enrollmentGrowth.trend,
          <Users className="h-5 w-5 text-blue-600" />
        )}
        {getMetricCard(
          'Completion Rate',
          `${analytics.completionRate.current}%`,
          analytics.completionRate.current - analytics.completionRate.previous,
          analytics.completionRate.trend,
          <CheckCircle className="h-5 w-5 text-green-600" />
        )}
        {getMetricCard(
          'Total Revenue',
          formatCurrency(analytics.revenue.total),
          analytics.revenue.growth,
          analytics.revenue.trend,
          <DollarSign className="h-5 w-5 text-emerald-600" />
        )}
        {getMetricCard(
          'Avg. Quiz Score',
          `${analytics.studentPerformance.averageQuizScore}%`,
          5,
          'up',
          <Award className="h-5 w-5 text-purple-600" />
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <div className="flex gap-6">
          {[
            { id: 'enrollment', label: 'Enrollment', icon: <Users className="h-4 w-4" /> },
            { id: 'engagement', label: 'Engagement', icon: <Activity className="h-4 w-4" /> },
            { id: 'revenue', label: 'Revenue', icon: <DollarSign className="h-4 w-4" /> },
            { id: 'performance', label: 'Performance', icon: <Award className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedMetric(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                selectedMetric === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">
              {selectedMetric === 'enrollment' && 'Enrollment Trend'}
              {selectedMetric === 'engagement' && 'User Engagement'}
              {selectedMetric === 'revenue' && 'Revenue Overview'}
              {selectedMetric === 'performance' && 'Student Performance'}
            </h4>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Filter className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-80 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <LineChart className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Chart visualization would go here</p>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Engagement Metrics */}
          {selectedMetric === 'engagement' && (
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold mb-4">Engagement Metrics</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Daily Active Users</span>
                    <span className="font-medium">{analytics.engagementMetrics.dailyActiveUsers}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Weekly Active Users</span>
                    <span className="font-medium">{analytics.engagementMetrics.weeklyActiveUsers}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Avg. Time per Lesson</span>
                    <span className="font-medium">{analytics.engagementMetrics.averageTimePerLesson} min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Performers */}
          {selectedMetric === 'performance' && (
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold mb-4">Top Performers</h4>
              <div className="space-y-3">
                {analytics.studentPerformance.topPerformers.map((student, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-600'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">{student.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{student.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Revenue Breakdown */}
          {selectedMetric === 'revenue' && (
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold mb-4">Revenue Breakdown</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Recurring</span>
                  <span className="font-medium">{formatCurrency(analytics.revenue.recurring)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">One-time</span>
                  <span className="font-medium">{formatCurrency(analytics.revenue.oneTime)}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">{formatCurrency(analytics.revenue.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Most Watched Content */}
          <div className="bg-white p-6 rounded-lg border">
            <h4 className="font-semibold mb-4">Most Watched Lessons</h4>
            <div className="space-y-3">
              {analytics.contentEngagement.mostWatchedLessons.slice(0, 5).map((lesson, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium truncate flex-1">{lesson.title}</span>
                    <span className="text-xs text-gray-500">{lesson.views} views</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: `${lesson.completion}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Engagement Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h4 className="font-semibold">Content Performance</h4>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {analytics.contentEngagement.leastEngagedContent.map((content, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-sm">{content.title}</p>
                    <p className="text-xs text-red-600">High drop-off rate: {content.dropoffRate}%</p>
                  </div>
                </div>
                <button className="px-3 py-1 bg-white text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm">
                  Review Content
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}