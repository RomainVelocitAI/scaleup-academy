'use client'

import { useState } from 'react'
import { 
  Book, Video, FileText, Lock, Unlock, Edit, Trash2, 
  MoreVertical, Plus, GripVertical, Eye, Clock, Users,
  ChevronDown, ChevronRight, Copy, Archive, Zap
} from 'lucide-react'

interface Module {
  id: string
  title: string
  description: string
  order: number
  published: boolean
  lessons: Lesson[]
  duration: number
  studentsCompleted: number
  totalStudents: number
}

interface Lesson {
  id: string
  title: string
  type: 'video' | 'text' | 'quiz' | 'assignment'
  duration: number
  published: boolean
  order: number
  completionRate: number
}

interface ModulesListProps {
  modules: Module[]
  courseId: string
  onEdit?: (moduleId: string) => void
  onDelete?: (moduleId: string) => void
  onReorder?: (modules: Module[]) => void
  onTogglePublish?: (moduleId: string, published: boolean) => void
}

export default function ModulesList({ modules, courseId, onEdit, onDelete, onReorder, onTogglePublish }: ModulesListProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />
      case 'text':
        return <FileText className="h-4 w-4" />
      case 'quiz':
        return <Zap className="h-4 w-4" />
      case 'assignment':
        return <Book className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}min`
    }
    return `${mins}min`
  }

  const getCompletionPercentage = (module: Module) => {
    if (module.totalStudents === 0) return 0
    return Math.round((module.studentsCompleted / module.totalStudents) * 100)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Course Modules</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          Add Module
        </button>
      </div>

      {/* Modules List */}
      {modules.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No modules yet</p>
          <p className="text-sm text-gray-400 mt-1">Start by adding your first module</p>
        </div>
      ) : (
        <div className="space-y-3">
          {modules.map((module) => (
            <div key={module.id} className="bg-white border rounded-lg overflow-hidden">
              {/* Module Header */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      {expandedModules.has(module.id) ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">Module {module.order}: {module.title}</h4>
                        {module.published ? (
                          <Unlock className="h-4 w-4 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Book className="h-3 w-3" />
                          {module.lessons.length} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(module.duration)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {getCompletionPercentage(module)}% completed
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTogglePublish?.(module.id, !module.published)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        module.published
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {module.published ? 'Published' : 'Draft'}
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="h-4 w-4 text-gray-500" />
                    </button>
                    <button 
                      onClick={() => onEdit?.(module.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Module Lessons (Expandable) */}
              {expandedModules.has(module.id) && (
                <div className="border-t bg-gray-50">
                  <div className="p-4 space-y-2">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center gap-3">
                          <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                          <div className={`p-2 rounded-lg ${
                            lesson.type === 'video' ? 'bg-purple-50' :
                            lesson.type === 'text' ? 'bg-blue-50' :
                            lesson.type === 'quiz' ? 'bg-yellow-50' :
                            'bg-green-50'
                          }`}>
                            {getLessonIcon(lesson.type)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{lesson.title}</p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span>{formatDuration(lesson.duration)}</span>
                              <span>{lesson.completionRate}% completion</span>
                              <span className={`px-2 py-0.5 rounded-full ${
                                lesson.published 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {lesson.published ? 'Published' : 'Draft'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="h-3.5 w-3.5 text-gray-500" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit className="h-3.5 w-3.5 text-gray-500" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <Copy className="h-3.5 w-3.5 text-gray-500" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                            <Trash2 className="h-3.5 w-3.5 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Lesson
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}