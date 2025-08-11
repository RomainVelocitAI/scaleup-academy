'use client'

import { useState } from 'react'
import { 
  Search, Filter, Download, Mail, MoreVertical, UserPlus,
  Ban, CheckCircle, XCircle, Clock, Trophy, TrendingUp,
  ChevronLeft, ChevronRight, Eye, Send, AlertCircle,
  Calendar, Activity, Star, MessageSquare
} from 'lucide-react'

interface Student {
  id: string
  name: string
  email: string
  avatar?: string
  enrolledAt: string
  lastActive: string
  progress: number
  modulesCompleted: number
  totalModules: number
  quizScore: number
  status: 'active' | 'inactive' | 'completed' | 'blocked'
  certificateIssued: boolean
  lastLesson?: string
  timeSpent: number // in hours
}

interface EnrolledStudentsProps {
  students: Student[]
  courseId: string
  onMessage?: (studentId: string) => void
  onBlock?: (studentId: string) => void
  onViewProfile?: (studentId: string) => void
  onIssueCertificate?: (studentId: string) => void
}

export default function EnrolledStudents({ 
  students, 
  courseId, 
  onMessage, 
  onBlock, 
  onViewProfile,
  onIssueCertificate 
}: EnrolledStudentsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'completed' | 'blocked'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set())
  const itemsPerPage = 10

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="h-3 w-3" />
            Active
          </span>
        )
      case 'completed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <Trophy className="h-3 w-3" />
            Completed
          </span>
        )
      case 'inactive':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            <Clock className="h-3 w-3" />
            Inactive
          </span>
        )
      case 'blocked':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <Ban className="h-3 w-3" />
            Blocked
          </span>
        )
      default:
        return null
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 25) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const toggleStudentSelection = (studentId: string) => {
    const newSelection = new Set(selectedStudents)
    if (newSelection.has(studentId)) {
      newSelection.delete(studentId)
    } else {
      newSelection.add(studentId)
    }
    setSelectedStudents(newSelection)
  }

  const selectAllStudents = () => {
    if (selectedStudents.size === paginatedStudents.length) {
      setSelectedStudents(new Set())
    } else {
      setSelectedStudents(new Set(paginatedStudents.map(s => s.id)))
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Enrolled Students</h3>
          <p className="text-sm text-gray-500 mt-1">{students.length} total students</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Message All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="inactive">Inactive</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Selected Actions */}
      {selectedStudents.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-blue-700">
            {selectedStudents.size} student{selectedStudents.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Send Message
            </button>
            <button className="px-3 py-1 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Export Selected
            </button>
          </div>
        </div>
      )}

      {/* Students Table */}
      {paginatedStudents.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No students found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedStudents.size === paginatedStudents.length}
                    onChange={selectAllStudents}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Student</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Progress</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Last Active</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Time Spent</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quiz Score</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedStudents.has(student.id)}
                      onChange={() => toggleStudentSelection(student.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {student.avatar ? (
                          <img src={student.avatar} alt={student.name} className="h-full w-full rounded-full object-cover" />
                        ) : (
                          student.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-32">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>{student.progress}%</span>
                        <span className="text-xs">{student.modulesCompleted}/{student.totalModules}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-full rounded-full transition-all ${getProgressColor(student.progress)}`}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(student.status)}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600">{formatDate(student.lastActive)}</p>
                    {student.lastLesson && (
                      <p className="text-xs text-gray-400 mt-0.5">{student.lastLesson}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="h-3.5 w-3.5" />
                      {student.timeSpent}h
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{student.quizScore}%</span>
                      {student.quizScore >= 80 && <Star className="h-4 w-4 text-yellow-500" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => onViewProfile?.(student.id)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Profile"
                      >
                        <Eye className="h-4 w-4 text-gray-500" />
                      </button>
                      <button 
                        onClick={() => onMessage?.(student.id)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Send Message"
                      >
                        <Send className="h-4 w-4 text-gray-500" />
                      </button>
                      {student.status === 'completed' && !student.certificateIssued && (
                        <button 
                          onClick={() => onIssueCertificate?.(student.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Issue Certificate"
                        >
                          <Trophy className="h-4 w-4 text-gray-500" />
                        </button>
                      )}
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredStudents.length)} of {filteredStudents.length} students
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}