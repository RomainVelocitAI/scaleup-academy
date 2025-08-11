import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Trophy, Target, TrendingUp, Clock, BookOpen, Award, Calendar, BarChart } from 'lucide-react'

export default async function ProgressPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Récupérer les statistiques de progression
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select(`
      *,
      courses (*)
    `)
    .eq('user_id', user.id)

  // Calculer les statistiques
  const totalCourses = enrollments?.length || 0
  const completedCourses = enrollments?.filter(e => e.progress === 100).length || 0
  const inProgressCourses = enrollments?.filter(e => e.progress > 0 && e.progress < 100).length || 0
  const averageProgress = totalCourses > 0 
    ? Math.round(enrollments?.reduce((acc, e) => acc + (e.progress || 0), 0) / totalCourses)
    : 0

  // Calculer le temps total d'apprentissage (simulé pour l'instant)
  const totalHours = Math.round(averageProgress * 1.5)
  const thisWeekHours = Math.round(totalHours * 0.3)
  const thisMonthHours = Math.round(totalHours * 0.7)

  // Données de progression hebdomadaire (simulées)
  const weeklyProgress = [
    { day: 'Lun', hours: 2, progress: 15 },
    { day: 'Mar', hours: 3, progress: 25 },
    { day: 'Mer', hours: 1.5, progress: 10 },
    { day: 'Jeu', hours: 2.5, progress: 20 },
    { day: 'Ven', hours: 4, progress: 35 },
    { day: 'Sam', hours: 2, progress: 15 },
    { day: 'Dim', hours: 1, progress: 8 },
  ]

  // Objectifs (simulés)
  const goals = [
    { title: 'Terminer 5 cours', current: completedCourses, target: 5, icon: BookOpen },
    { title: '100 heures d\'apprentissage', current: totalHours, target: 100, icon: Clock },
    { title: 'Obtenir 3 certificats', current: completedCourses, target: 3, icon: Award },
    { title: 'Série de 30 jours', current: 12, target: 30, icon: Calendar },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ma Progression</h1>
          <p className="text-gray-600">Suivez votre évolution et atteignez vos objectifs d'apprentissage</p>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+15%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totalCourses}</h3>
            <p className="text-sm text-gray-600">Cours inscrits</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+2</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{completedCourses}</h3>
            <p className="text-sm text-gray-600">Cours complétés</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+{thisWeekHours}h</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totalHours}h</h3>
            <p className="text-sm text-gray-600">Temps total</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{averageProgress}%</h3>
            <p className="text-sm text-gray-600">Progression moyenne</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Graphique de progression hebdomadaire */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Activité cette semaine</h2>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Heures</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Progression</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64 flex items-end justify-between space-x-4">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="flex-1">
                    <div className="relative h-48">
                      <div className="absolute bottom-0 left-0 w-full">
                        <div className="flex space-x-1">
                          <div className="flex-1">
                            <div 
                              className="bg-blue-500 rounded-t"
                              style={{ height: `${day.hours * 20}px` }}
                            />
                          </div>
                          <div className="flex-1">
                            <div 
                              className="bg-green-500 rounded-t"
                              style={{ height: `${day.progress * 2}px` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-2">{day.day}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{thisWeekHours}h</p>
                    <p className="text-sm text-gray-600">Cette semaine</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{thisMonthHours}h</p>
                    <p className="text-sm text-gray-600">Ce mois</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalHours}h</p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cours en cours */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Cours en cours</h2>
              <div className="space-y-4">
                {enrollments?.filter(e => e.progress > 0 && e.progress < 100).slice(0, 3).map(enrollment => {
                  const course = enrollment.courses
                  if (!course) return null
                  
                  return (
                    <div key={enrollment.id} className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <div className="mt-2 flex items-center space-x-4">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${enrollment.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{enrollment.progress || 0}%</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {inProgressCourses === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    Aucun cours en cours. Commencez un nouveau cours pour voir votre progression ici.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Objectifs */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Objectifs</h2>
              <div className="space-y-6">
                {goals.map((goal, index) => {
                  const Icon = goal.icon
                  const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100))
                  
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Icon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-700">{goal.title}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {goal.current}/{goal.target}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            percentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Badges et achievements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Achievements récents</h2>
              <div className="grid grid-cols-3 gap-3">
                {completedCourses > 0 && (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                      <Trophy className="h-8 w-8 text-yellow-600" />
                    </div>
                    <p className="text-xs mt-2 text-gray-600">Premier cours</p>
                  </div>
                )}
                {totalHours >= 10 && (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                      <Clock className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-xs mt-2 text-gray-600">10h d'étude</p>
                  </div>
                )}
                {completedCourses >= 3 && (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <Award className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-xs mt-2 text-gray-600">3 cours finis</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Points totaux</p>
                  <p className="text-2xl font-bold text-gray-900">{completedCourses * 100 + totalHours * 10}</p>
                </div>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="font-semibold mb-4">Statistiques rapides</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-100">Série actuelle</span>
                  <span className="font-medium">12 jours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Meilleure série</span>
                  <span className="font-medium">28 jours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-100">Rang</span>
                  <span className="font-medium">Débutant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}