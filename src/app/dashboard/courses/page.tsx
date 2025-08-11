import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Clock, Users, Star, PlayCircle, Filter, Search } from 'lucide-react'

export default async function CoursesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Récupérer les cours inscrits de l'utilisateur
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      *,
      courses (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Récupérer tous les cours disponibles
  const { data: availableCourses } = await supabase
    .from('courses')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Cours</h1>
          <p className="text-gray-600">Gérez vos cours et continuez votre apprentissage</p>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un cours..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="h-5 w-5 mr-2" />
              Filtrer
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
              En cours ({enrollments?.filter(e => (e.progress || 0) < 100).length || 0})
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Complétés ({enrollments?.filter(e => (e.progress || 0) === 100).length || 0})
            </button>
            <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Disponibles ({availableCourses?.length || 0})
            </button>
          </nav>
        </div>

        {/* Cours en cours */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments?.map((enrollment) => {
            const course = enrollment.courses
            if (!course) return null
            
            return (
              <div key={enrollment.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-white opacity-50" />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description || 'Aucune description disponible'}
                  </p>
                  
                  {/* Statistiques */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration || '0'}h
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students_count || 0}
                    </span>
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {course.rating || '0'}/5
                    </span>
                  </div>

                  {/* Barre de progression */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progression</span>
                      <span className="font-medium">{enrollment.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${enrollment.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  <Link 
                    href={`/dashboard/courses/${course.id}`}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlayCircle className="h-5 w-5 mr-2" />
                    Continuer
                  </Link>
                </div>
              </div>
            )
          })}

          {/* Message si aucun cours */}
          {(!enrollments || enrollments.length === 0) && (
            <div className="col-span-full text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun cours inscrit</h3>
              <p className="text-gray-500 mb-4">Commencez votre parcours d'apprentissage dès maintenant</p>
              <Link 
                href="/courses"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Explorer les cours
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}