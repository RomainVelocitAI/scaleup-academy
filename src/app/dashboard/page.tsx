import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ClientDashboard } from '@/components/dashboard/client-dashboard'
import { ProfessorDashboard } from '@/components/dashboard/professor-dashboard'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Récupérer le profil de l'utilisateur
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Déterminer le rôle (par défaut 'client')
  const userRole = profile?.role || 'client'
  const userName = profile?.full_name || user.email?.split('@')[0]

  // Récupérer les données spécifiques au rôle
  let dashboardContent = null

  if (userRole === 'admin') {
    // Récupérer les statistiques pour l'admin
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { count: courseCount } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })

    // Pour l'instant, données simulées
    dashboardContent = (
      <AdminDashboard
        totalUsers={userCount || 0}
        totalCourses={courseCount || 0}
        totalRevenue={0}
        activeUsers={0}
        newUsersToday={0}
        pendingIssues={0}
        systemHealth="good"
        revenueGrowth={0}
        userGrowth={0}
        courseCompletionRate={0}
      />
    )
  } else if (userRole === 'professor') {
    // Récupérer les cours du formateur
    const { data: courses } = await supabase
      .from('courses')
      .select('*')
      .eq('instructor_id', user.id)

    // Pour l'instant, données simulées
    dashboardContent = (
      <ProfessorDashboard
        userName={userName}
        courses={courses?.map(course => ({
          id: course.id,
          title: course.title,
          students: 0,
          rating: 0,
          revenue: 0,
          status: course.status || 'draft'
        })) || []}
        totalStudents={0}
        totalRevenue={0}
        averageRating={0}
        recentMessages={[]}
        monthlyRevenue={[]}
      />
    )
  } else {
    // Dashboard client par défaut
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (*)
      `)
      .eq('user_id', user.id)

    // Pour l'instant, données simulées
    dashboardContent = (
      <ClientDashboard
        userName={userName}
        coursesInProgress={enrollments?.map(enrollment => ({
          id: enrollment.course_id,
          title: enrollment.courses?.title || 'Cours',
          progress: enrollment.progress || 0,
          lastAccessed: 'Aujourd\'hui'
        })) || []}
        completedCourses={0}
        totalHours={0}
        certificates={0}
        upcomingEvents={[]}
        achievements={[]}
      />
    )
  }

  return (
    <DashboardLayout 
      role={userRole as 'client' | 'professor' | 'admin'}
      userName={userName}
      userEmail={user.email}
    >
      {dashboardContent}
    </DashboardLayout>
  )
}