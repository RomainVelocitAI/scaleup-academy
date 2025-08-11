'use client'

import { useState } from 'react'
import { 
  Settings, Save, Eye, EyeOff, Globe, Lock, Users, DollarSign,
  Calendar, Clock, Award, Image, FileText, AlertCircle, Check,
  Trash2, Archive, Copy, ExternalLink, Share2, Mail, Bell,
  Shield, Key, Languages, Palette, Code, Database, Webhook,
  CreditCard, Receipt, BarChart3, Tag, Info
} from 'lucide-react'

interface CourseSettings {
  // General Settings
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  thumbnailUrl: string
  coverImageUrl: string
  category: string
  subcategory: string
  tags: string[]
  level: 'beginner' | 'intermediate' | 'advanced'
  language: string
  
  // Access & Visibility
  visibility: 'public' | 'private' | 'unlisted'
  published: boolean
  enrollmentType: 'open' | 'approval' | 'invite-only'
  maxStudents: number | null
  prerequisites: string[]
  
  // Pricing
  pricing: {
    type: 'free' | 'one-time' | 'subscription'
    price: number
    currency: string
    salePrice?: number
    saleEndDate?: string
    subscriptionInterval?: 'monthly' | 'yearly'
  }
  
  // Schedule
  startDate: string | null
  endDate: string | null
  enrollmentStartDate: string | null
  enrollmentEndDate: string | null
  
  // Completion & Certification
  completionCriteria: {
    minProgress: number
    minQuizScore: number
    requireAllLessons: boolean
    requireAllQuizzes: boolean
  }
  certificateTemplate: string
  certificateEnabled: boolean
  
  // Notifications
  notifications: {
    enrollmentConfirmation: boolean
    lessonReminders: boolean
    completionCongratulations: boolean
    newContentAlerts: boolean
  }
  
  // SEO & Marketing
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    ogImage: string
  }
  
  // Advanced
  customFields: Record<string, any>
  webhooks: {
    enrollment: string
    completion: string
    progress: string
  }
  integrations: {
    lms: boolean
    analytics: boolean
    crm: boolean
  }
}

interface CourseSettingsProps {
  settings: CourseSettings
  onSave?: (settings: Partial<CourseSettings>) => void
  onDelete?: () => void
  onDuplicate?: () => void
  onArchive?: () => void
}

export default function CourseSettingsComponent({ settings, onSave, onDelete, onDuplicate, onArchive }: CourseSettingsProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'access' | 'pricing' | 'schedule' | 'completion' | 'notifications' | 'seo' | 'advanced'>('general')
  const [formData, setFormData] = useState(settings)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (field: string, value: any, nested?: string) => {
    setFormData(prev => {
      if (nested) {
        return {
          ...prev,
          [nested]: {
            ...(prev as any)[nested],
            [field]: value
          }
        }
      }
      return { ...prev, [field]: value }
    })
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    await onSave?.(formData)
    setIsSaving(false)
    setHasChanges(false)
  }

  const tabs = [
    { id: 'general', label: 'General', icon: <Settings className="h-4 w-4" /> },
    { id: 'access', label: 'Access & Visibility', icon: <Eye className="h-4 w-4" /> },
    { id: 'pricing', label: 'Pricing', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar className="h-4 w-4" /> },
    { id: 'completion', label: 'Completion', icon: <Award className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'seo', label: 'SEO & Marketing', icon: <Globe className="h-4 w-4" /> },
    { id: 'advanced', label: 'Advanced', icon: <Code className="h-4 w-4" /> }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Course Settings</h3>
          <p className="text-sm text-gray-500 mt-1">Configure your course details and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4" />
              Unsaved changes
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
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

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <>
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">Basic Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ExternalLink className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">scaleupacademy.com/courses/{formData.slug}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="development">Development</option>
                        <option value="business">Business</option>
                        <option value="design">Design</option>
                        <option value="marketing">Marketing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                      <select
                        value={formData.level}
                        onChange={(e) => handleInputChange('level', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">Media</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                      {formData.thumbnailUrl ? (
                        <img src={formData.thumbnailUrl} alt="Thumbnail" className="max-w-full h-40 mx-auto rounded-lg" />
                      ) : (
                        <div>
                          <Image className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Click to upload thumbnail</p>
                          <p className="text-xs text-gray-400 mt-1">Recommended: 1280x720px</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Access & Visibility Settings */}
          {activeTab === 'access' && (
            <>
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">Visibility Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Visibility</label>
                    <div className="space-y-2">
                      {[
                        { value: 'public', label: 'Public', icon: <Globe className="h-4 w-4" />, desc: 'Anyone can find and enroll' },
                        { value: 'private', label: 'Private', icon: <Lock className="h-4 w-4" />, desc: 'Only invited students can access' },
                        { value: 'unlisted', label: 'Unlisted', icon: <Eye className="h-4 w-4" />, desc: 'Only accessible via direct link' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="visibility"
                            value={option.value}
                            checked={formData.visibility === option.value}
                            onChange={(e) => handleInputChange('visibility', e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {option.icon}
                              <span className="font-medium">{option.label}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5">{option.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Students</label>
                    <input
                      type="number"
                      value={formData.maxStudents || ''}
                      onChange={(e) => handleInputChange('maxStudents', e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="Unlimited"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Pricing Settings */}
          {activeTab === 'pricing' && (
            <>
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">Pricing Model</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Type</label>
                    <div className="space-y-2">
                      {[
                        { value: 'free', label: 'Free', desc: 'No payment required' },
                        { value: 'one-time', label: 'One-time Payment', desc: 'Single payment for lifetime access' },
                        { value: 'subscription', label: 'Subscription', desc: 'Recurring payment' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="pricingType"
                            value={option.value}
                            checked={formData.pricing.type === option.value}
                            onChange={(e) => handleInputChange('type', e.target.value, 'pricing')}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <span className="font-medium">{option.label}</span>
                            <p className="text-sm text-gray-500 mt-0.5">{option.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  {formData.pricing.type !== 'free' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={formData.pricing.price}
                            onChange={(e) => handleInputChange('price', parseFloat(e.target.value), 'pricing')}
                            className="w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                        <select
                          value={formData.pricing.currency}
                          onChange={(e) => handleInputChange('currency', e.target.value, 'pricing')}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Schedule Settings */}
          {activeTab === 'schedule' && (
            <>
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">Course Schedule</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate || ''}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate || ''}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Start</label>
                      <input
                        type="date"
                        value={formData.enrollmentStartDate || ''}
                        onChange={(e) => handleInputChange('enrollmentStartDate', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment End</label>
                      <input
                        type="date"
                        value={formData.enrollmentEndDate || ''}
                        onChange={(e) => handleInputChange('enrollmentEndDate', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Completion Settings */}
          {activeTab === 'completion' && (
            <>
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">Completion Criteria</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Progress (%)</label>
                    <input
                      type="number"
                      value={formData.completionCriteria.minProgress}
                      onChange={(e) => handleInputChange('minProgress', parseInt(e.target.value), 'completionCriteria')}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Quiz Score (%)</label>
                    <input
                      type="number"
                      value={formData.completionCriteria.minQuizScore}
                      onChange={(e) => handleInputChange('minQuizScore', parseInt(e.target.value), 'completionCriteria')}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.completionCriteria.requireAllLessons}
                        onChange={(e) => handleInputChange('requireAllLessons', e.target.checked, 'completionCriteria')}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Require all lessons to be completed</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.certificateEnabled}
                        onChange={(e) => handleInputChange('certificateEnabled', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">Issue certificate upon completion</span>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <>
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">Email Notifications</h4>
                <div className="space-y-3">
                  {[
                    { key: 'enrollmentConfirmation', label: 'Enrollment Confirmation', desc: 'Send welcome email when student enrolls' },
                    { key: 'lessonReminders', label: 'Lesson Reminders', desc: 'Remind students about incomplete lessons' },
                    { key: 'completionCongratulations', label: 'Completion Congratulations', desc: 'Congratulate students on course completion' },
                    { key: 'newContentAlerts', label: 'New Content Alerts', desc: 'Notify about new lessons or updates' }
                  ].map((notification) => (
                    <label key={notification.key} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.notifications[notification.key as keyof typeof formData.notifications]}
                        onChange={(e) => handleInputChange(notification.key, e.target.checked, 'notifications')}
                        className="mt-1 rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{notification.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{notification.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <>
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">SEO Optimization</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={formData.seo.metaTitle}
                      onChange={(e) => handleInputChange('metaTitle', e.target.value, 'seo')}
                      maxLength={60}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.seo.metaTitle.length}/60 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                    <textarea
                      value={formData.seo.metaDescription}
                      onChange={(e) => handleInputChange('metaDescription', e.target.value, 'seo')}
                      maxLength={160}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.seo.metaDescription.length}/160 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                    <input
                      type="text"
                      placeholder="Enter keywords separated by commas"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Advanced Settings */}
          {activeTab === 'advanced' && (
            <>
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">Integrations</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm">LMS Integration</p>
                        <p className="text-xs text-gray-500">Connect with external LMS platforms</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.integrations.lms}
                      onChange={(e) => handleInputChange('lms', e.target.checked, 'integrations')}
                      className="rounded border-gray-300"
                    />
                  </label>
                  <label className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm">Analytics Integration</p>
                        <p className="text-xs text-gray-500">Track with Google Analytics</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.integrations.analytics}
                      onChange={(e) => handleInputChange('analytics', e.target.checked, 'integrations')}
                      className="rounded border-gray-300"
                    />
                  </label>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-4">Webhooks</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Webhook</label>
                    <input
                      type="url"
                      value={formData.webhooks.enrollment}
                      onChange={(e) => handleInputChange('enrollment', e.target.value, 'webhooks')}
                      placeholder="https://your-domain.com/webhook"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Completion Webhook</label>
                    <input
                      type="url"
                      value={formData.webhooks.completion}
                      onChange={(e) => handleInputChange('completion', e.target.value, 'webhooks')}
                      placeholder="https://your-domain.com/webhook"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </>
          )}