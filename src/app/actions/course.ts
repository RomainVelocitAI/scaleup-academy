'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Course CRUD Types
interface CourseData {
  title: string
  slug: string
  description: string
  short_description?: string
  thumbnail_url?: string
  cover_image_url?: string
  category: string
  subcategory?: string
  tags?: string[]
  level: 'beginner' | 'intermediate' | 'advanced'
  language: string
  visibility: 'public' | 'private' | 'unlisted'
  published: boolean
  enrollment_type: 'open' | 'approval' | 'invite-only'
  max_students?: number
  prerequisites?: string[]
  pricing_type: 'free' | 'one-time' | 'subscription'
  price?: number
  currency?: string
  sale_price?: number
  sale_end_date?: string
  subscription_interval?: 'monthly' | 'yearly'
  start_date?: string
  end_date?: string
  enrollment_start_date?: string
  enrollment_end_date?: string
  completion_min_progress?: number
  completion_min_quiz_score?: number
  completion_require_all_lessons?: boolean
  completion_require_all_quizzes?: boolean
  certificate_template?: string
  certificate_enabled?: boolean
  notification_enrollment?: boolean
  notification_reminders?: boolean
  notification_completion?: boolean
  notification_new_content?: boolean
  seo_meta_title?: string
  seo_meta_description?: string
  seo_keywords?: string[]
  seo_og_image?: string
  custom_fields?: Record<string, any>
  webhook_enrollment?: string
  webhook_completion?: string
  webhook_progress?: string
  integration_lms?: boolean
  integration_analytics?: boolean
  integration_crm?: boolean
}

interface ModuleData {
  title: string
  description?: string
  order: number
  published: boolean
  duration?: number
  course_id: string
}

interface LessonData {
  title: string
  description?: string
  type: 'video' | 'text' | 'quiz' | 'assignment'
  content?: any
  duration?: number
  published: boolean
  order: number
  module_id: string
}

interface EnrollmentData {
  course_id: string
  user_id: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  progress?: number
  enrolled_at?: string
  completed_at?: string
  last_accessed_at?: string
  certificate_issued?: boolean
  certificate_issued_at?: string
}

// Course CRUD Operations
export async function createCourse(data: CourseData) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated and has admin/instructor role
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Authentication required' }
    }

    // Check user role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profileError || !profile || (profile.role !== 'admin' && profile.role !== 'instructor')) {
      return { error: 'Insufficient permissions. Admin or instructor role required.' }
    }

    // Create course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        ...data,
        instructor_id: user.id,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (courseError) {
      console.error('Course creation error:', courseError)
      return { error: courseError.message }
    }

    revalidatePath('/admin/courses')
    revalidatePath(`/courses/${data.slug}`)
    
    return { data: course }
  } catch (error) {
    console.error('Create course error:', error)
    return { error: 'Failed to create course' }
  }
}

export async function getCourse(courseId: string) {
  try {
    const supabase = await createClient()
    
    const { data: course, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:profiles!courses_instructor_id_fkey(
          id,
          full_name,
          avatar_url,
          bio
        ),
        modules(
          *,
          lessons(*)
        ),
        enrollments(count)
      `)
      .eq('id', courseId)
      .single()

    if (error) {
      console.error('Get course error:', error)
      return { error: error.message }
    }

    return { data: course }
  } catch (error) {
    console.error('Get course error:', error)
    return { error: 'Failed to get course' }
  }
}

export async function updateCourse(courseId: string, data: Partial<CourseData>) {
  try {
    const supabase = await createClient()
    
    // Check if user has permission to update this course
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Authentication required' }
    }

    // Check if user owns the course or is admin
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      return { error: 'Course not found' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (course.instructor_id !== user.id && profile?.role !== 'admin') {
      return { error: 'Insufficient permissions to update this course' }
    }

    // Update course
    const { data: updatedCourse, error: updateError } = await supabase
      .from('courses')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', courseId)
      .select()
      .single()

    if (updateError) {
      console.error('Update course error:', updateError)
      return { error: updateError.message }
    }

    revalidatePath('/admin/courses')
    revalidatePath(`/admin/courses/${courseId}`)
    
    return { data: updatedCourse }
  } catch (error) {
    console.error('Update course error:', error)
    return { error: 'Failed to update course' }
  }
}

export async function deleteCourse(courseId: string) {
  try {
    const supabase = await createClient()
    
    // Check if user has permission to delete this course
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: 'Authentication required' }
    }

    // Check if user owns the course or is admin
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('instructor_id')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      return { error: 'Course not found' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (course.instructor_id !== user.id && profile?.role !== 'admin') {
      return { error: 'Insufficient permissions to delete this course' }
    }

    // Delete course (this will cascade delete modules, lessons, enrollments)
    const { error: deleteError } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)

    if (deleteError) {
      console.error('Delete course error:', deleteError)
      return { error: deleteError.message }
    }

    revalidatePath('/admin/courses')
    
    return { success: true }
  } catch (error) {
    console.error('Delete course error:', error)
    return { error: 'Failed to delete course' }
  }
}

export async function duplicateCourse(courseId: string) {
  try {
    const supabase = await createClient()
    
    // Get original course with modules and lessons
    const { data: originalCourse, error: fetchError } = await supabase
      .from('courses')
      .select(`
        *,
        modules(
          *,
          lessons(*)
        )
      `)
      .eq('id', courseId)
      .single()

    if (fetchError || !originalCourse) {
      return { error: 'Course not found' }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: 'Authentication required' }
    }

    // Create new course with modified title and slug
    const timestamp = Date.now()
    const newCourseData = {
      ...originalCourse,
      id: undefined,
      title: `${originalCourse.title} (Copy)`,
      slug: `${originalCourse.slug}-copy-${timestamp}`,
      published: false,
      instructor_id: user.id,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      modules: undefined
    }

    const { data: newCourse, error: createError } = await supabase
      .from('courses')
      .insert(newCourseData)
      .select()
      .single()

    if (createError || !newCourse) {
      return { error: 'Failed to duplicate course' }
    }

    // Duplicate modules and lessons
    if (originalCourse.modules && originalCourse.modules.length > 0) {
      for (const module of originalCourse.modules) {
        const newModuleData = {
          ...module,
          id: undefined,
          course_id: newCourse.id,
          lessons: undefined
        }

        const { data: newModule, error: moduleError } = await supabase
          .from('modules')
          .insert(newModuleData)
          .select()
          .single()

        if (!moduleError && newModule && module.lessons && module.lessons.length > 0) {
          const newLessons = module.lessons.map((lesson: any) => ({
            ...lesson,
            id: undefined,
            module_id: newModule.id
          }))

          await supabase.from('lessons').insert(newLessons)
        }
      }
    }

    revalidatePath('/admin/courses')
    
    return { data: newCourse }
  } catch (error) {
    console.error('Duplicate course error:', error)
    return { error: 'Failed to duplicate course' }
  }
}

// Module CRUD Operations
export async function createModule(data: ModuleData) {
  try {
    const supabase = await createClient()
    
    const { data: module, error } = await supabase
      .from('modules')
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error('Create module error:', error)
      return { error: error.message }
    }

    revalidatePath(`/admin/courses/${data.course_id}`)
    
    return { data: module }
  } catch (error) {
    console.error('Create module error:', error)
    return { error: 'Failed to create module' }
  }
}

export async function updateModule(moduleId: string, data: Partial<ModuleData>) {
  try {
    const supabase = await createClient()
    
    const { data: module, error } = await supabase
      .from('modules')
      .update(data)
      .eq('id', moduleId)
      .select()
      .single()

    if (error) {
      console.error('Update module error:', error)
      return { error: error.message }
    }

    revalidatePath('/admin/courses')
    
    return { data: module }
  } catch (error) {
    console.error('Update module error:', error)
    return { error: 'Failed to update module' }
  }
}

export async function deleteModule(moduleId: string) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', moduleId)

    if (error) {
      console.error('Delete module error:', error)
      return { error: error.message }
    }

    revalidatePath('/admin/courses')
    
    return { success: true }
  } catch (error) {
    console.error('Delete module error:', error)
    return { error: 'Failed to delete module' }
  }
}

// Lesson CRUD Operations
export async function createLesson(data: LessonData) {
  try {
    const supabase = await createClient()
    
    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error('Create lesson error:', error)
      return { error: error.message }
    }

    revalidatePath('/admin/courses')
    
    return { data: lesson }
  } catch (error) {
    console.error('Create lesson error:', error)
    return { error: 'Failed to create lesson' }
  }
}

export async function updateLesson(lessonId: string, data: Partial<LessonData>) {
  try {
    const supabase = await createClient()
    
    const { data: lesson, error } = await supabase
      .from('lessons')
      .update(data)
      .eq('id', lessonId)
      .select()
      .single()

    if (error) {
      console.error('Update lesson error:', error)
      return { error: error.message }
    }

    revalidatePath('/admin/courses')
    
    return { data: lesson }
  } catch (error) {
    console.error('Update lesson error:', error)
    return { error: 'Failed to update lesson' }
  }
}

export async function deleteLesson(lessonId: string) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId)

    if (error) {
      console.error('Delete lesson error:', error)
      return { error: error.message }
    }

    revalidatePath('/admin/courses')
    
    return { success: true }
  } catch (error) {
    console.error('Delete lesson error:', error)
    return { error: 'Failed to delete lesson' }
  }
}

// Enrollment Operations
export async function enrollStudent(courseId: string, userId: string) {
  try {
    const supabase = await createClient()
    
    const enrollmentData: EnrollmentData = {
      course_id: courseId,
      user_id: userId,
      status: 'active',
      progress: 0,
      enrolled_at: new Date().toISOString()
    }
    
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .insert(enrollmentData)
      .select()
      .single()

    if (error) {
      console.error('Enroll student error:', error)
      return { error: error.message }
    }

    revalidatePath(`/admin/courses/${courseId}`)
    
    return { data: enrollment }
  } catch (error) {
    console.error('Enroll student error:', error)
    return { error: 'Failed to enroll student' }
  }
}

export async function updateEnrollment(enrollmentId: string, data: Partial<EnrollmentData>) {
  try {
    const supabase = await createClient()
    
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .update(data)
      .eq('id', enrollmentId)
      .select()
      .single()

    if (error) {
      console.error('Update enrollment error:', error)
      return { error: error.message }
    }

    revalidatePath('/admin/courses')
    
    return { data: enrollment }
  } catch (error) {
    console.error('Update enrollment error:', error)
    return { error: 'Failed to update enrollment' }
  }
}

export async function unenrollStudent(enrollmentId: string) {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('id', enrollmentId)

    if (error) {
      console.error('Unenroll student error:', error)
      return { error: error.message }
    }

    revalidatePath('/admin/courses')
    
    return { success: true }
  } catch (error) {
    console.error('Unenroll student error:', error)
    return { error: 'Failed to unenroll student' }
  }
}

// Bulk Operations
export async function bulkEnrollStudents(courseId: string, userIds: string[]) {
  try {
    const supabase = await createClient()
    
    const enrollments = userIds.map(userId => ({
      course_id: courseId,
      user_id: userId,
      status: 'active',
      progress: 0,
      enrolled_at: new Date().toISOString()
    }))
    
    const { data, error } = await supabase
      .from('enrollments')
      .insert(enrollments)
      .select()

    if (error) {
      console.error('Bulk enroll error:', error)
      return { error: error.message }
    }

    revalidatePath(`/admin/courses/${courseId}`)
    
    return { data }
  } catch (error) {
    console.error('Bulk enroll error:', error)
    return { error: 'Failed to bulk enroll students' }
  }
}

export async function reorderModules(courseId: string, moduleIds: string[]) {
  try {
    const supabase = await createClient()
    
    // Update order for each module
    const updates = moduleIds.map((id, index) => 
      supabase
        .from('modules')
        .update({ order: index + 1 })
        .eq('id', id)
    )

    await Promise.all(updates)
    
    revalidatePath(`/admin/courses/${courseId}`)
    
    return { success: true }
  } catch (error) {
    console.error('Reorder modules error:', error)
    return { error: 'Failed to reorder modules' }
  }
}

export async function reorderLessons(moduleId: string, lessonIds: string[]) {
  try {
    const supabase = await createClient()
    
    // Update order for each lesson
    const updates = lessonIds.map((id, index) => 
      supabase
        .from('lessons')
        .update({ order: index + 1 })
        .eq('id', id)
    )

    await Promise.all(updates)
    
    revalidatePath('/admin/courses')
    
    return { success: true }
  } catch (error) {
    console.error('Reorder lessons error:', error)
    return { error: 'Failed to reorder lessons' }
  }
}

// Publishing Operations
export async function publishCourse(courseId: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('courses')
      .update({ 
        published: true,
        published_at: new Date().toISOString()
      })
      .eq('id', courseId)
      .select()
      .single()

    if (error) {
      console.error('Publish course error:', error)
      return { error: error.message }
    }

    revalidatePath('/admin/courses')
    revalidatePath('/courses')
    
    return { data }
  } catch (error) {
    console.error('Publish course error:', error)
    return { error: 'Failed to publish course' }
  }
}

export async function unpublishCourse(courseId: string) {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('courses')
      .update({ 
        published: false,
        published_at: null
      })
      .eq('id', courseId)
      .select()
      .single()

    if (error) {
      console.error('Unpublish course error:', error)
      return { error: error.message }
    }

    revalidatePath('/admin/courses')
    revalidatePath('/courses')
    
    return { data }
  } catch (error) {
    console.error('Unpublish course error:', error)
    return { error: 'Failed to unpublish course' }
  }
}

// Analytics Operations
export async function getCourseAnalytics(courseId: string) {
  try {
    const supabase = await createClient()
    
    // Get course with enrollments and progress data
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        *,
        enrollments(
          *,
          user:profiles(*)
        ),
        modules(
          *,
          lessons(
            *,
            progress:lesson_progress(*)
          )
        )
      `)
      .eq('id', courseId)
      .single()

    if (courseError) {
      return { error: courseError.message }
    }

    // Calculate analytics
    const totalEnrollments = course.enrollments?.length || 0
    const activeEnrollments = course.enrollments?.filter((e: any) => e.status === 'active').length || 0
    const completedEnrollments = course.enrollments?.filter((e: any) => e.status === 'completed').length || 0
    
    // Calculate average progress
    const totalProgress = course.enrollments?.reduce((sum: number, e: any) => sum + (e.progress || 0), 0) || 0
    const averageProgress = totalEnrollments > 0 ? totalProgress / totalEnrollments : 0

    // Calculate completion rate
    const completionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0

    // Calculate revenue (if applicable)
    const revenue = course.pricing_type !== 'free' 
      ? totalEnrollments * (course.price || 0)
      : 0

    const analytics = {
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      averageProgress,
      completionRate,
      revenue,
      enrollmentTrend: [], // Would need time-series data
      moduleCompletion: {}, // Would need to calculate per module
      lessonEngagement: {} // Would need to calculate per lesson
    }

    return { data: analytics }
  } catch (error) {
    console.error('Get course analytics error:', error)
    return { error: 'Failed to get course analytics' }
  }
}