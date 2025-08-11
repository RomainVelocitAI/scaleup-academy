'use client'

import { Users, DollarSign, Clock, Star, TrendingUp, TrendingDown, BarChart, Activity } from 'lucide-react'

interface CourseStatsProps {
  stats: {
    totalStudents: number
    activeStudents: number
    totalRevenue: number
    averageRating: number
    totalRatings: number
    completionRate: number
    averageProgress: number
    totalHours: number
    lastEnrollment?: string
    trend: {
      students: 'up' | 'down' | 'stable'
      revenue: 'up' | 'down' | 'stable'
      rating: 'up' | 'down' | 'stable'
      completion: 'up' | 'down' | 'stable'
    }
    percentageChanges: {
      students: number
      revenue: number
      rating: number
      completion: number
    }
  }
}

export default function CourseStats({ stats }: CourseStatsProps) {
  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      subtitle: `${stats.activeStudents} active`,
      icon: Users,
      trend: stats.trend.students,
      change: stats.percentageChanges.students,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      subtitle: 'All time',
      icon: DollarSign,
      trend: stats.trend.revenue,
      change: stats.percentageChanges.revenue,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      subtitle: `${stats.totalRatings} reviews`,
      icon: Star,
      trend: stats.trend.rating,
      change: stats.percentageChanges.rating,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      subtitle: `${stats.averageProgress}% avg progress`,
      icon: Activity,
      trend: stats.trend.completion,
      change: stats.percentageChanges.completion,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <BarChart className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(stat.trend)}
                <span className={`text-sm font-medium ${getTrendColor(stat.trend)}`}>
                  {Math.abs(stat.change)}%
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}