import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BookOpen, Eye, Shield, Clock, Users, DollarSign, Star, AlertCircle, CheckCircle, XCircle, MoreVertical, Filter, Search, TrendingUp, AlertTriangle, Calendar, FileText, Play, Pause, Edit, Trash2, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default async function AdminCoursesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Vérifier que l'utilisateur est bien un admin
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!currentUserProfile || currentUserProfile.role !== 'admin') {
    redirect('/dashboard')
  }

  // Récupérer les cours depuis la base de données
  const { data: coursesData, error: coursesError } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      professor_id,
      theme_id,
      video_url,
      thumbnail_url,
      duration,
      order_index,
      is_published,
      created_at,
      updated_at,
      profiles!courses_professor_id_fkey (
        id,
        full_name
      )
    `)
    .order('created_at', { ascending: false })

  if (coursesError) {
    console.error('Error fetching courses:', coursesError)
  }

  // Récupérer les thèmes pour les catégories
  const { data: themes } = await supabase
    .from('themes')
    .select('id, name')

  const themesMap = themes?.reduce((acc, theme) => {
    acc[theme.id] = theme.name
    return acc
  }, {} as Record<string, string>) || {}

  // Mapper les données pour l'interface
  const courses = coursesData?.map(course => ({
    id: course.id,
    title: course.title || 'Sans titre',
    instructor: course.profiles?.full_name || 'Formateur non assigné',
    instructorId: course.professor_id || '',
    category: themesMap[course.theme_id] || 'Non catégorisé',
    status: course.is_published ? 'published' : 'draft',
    publishedAt: course.is_published ? course.created_at : null,
    students: 0, // À calculer depuis les inscriptions
    rating: 0, // À calculer depuis les évaluations
    reviews: 0, // À calculer depuis les évaluations
    revenue: 0, // À calculer depuis les paiements
    price: 0, // À récupérer depuis une table de prix
    duration: course.duration || '0h',
    lessons: 0, // À calculer depuis les leçons
    language: 'Français',
    level: 'Tous niveaux',
    lastUpdated: course.updated_at,
    reportCount: 0, // À implémenter avec un système de signalement
    completionRate: 0, // À calculer depuis les progressions
    thumbnail: course.thumbnail_url,
    trending: false,
    progress: 0,
    createdAt: course.created_at,
    submittedAt: null,
    suspendedAt: null,
    suspendedReason: null,
    reviewNotes: null
  })) || []

  // Calculer les statistiques réelles
  const totalCourses = coursesData?.length || 0
  const publishedCourses = coursesData?.filter(c => c.is_published).length || 0
  const draftCourses = coursesData?.filter(c => !c.is_published).length || 0

  const stats = {
    totalCourses,
    publishedCourses,
    underReview: 0, // À implémenter avec un champ status
    suspendedCourses: 0, // À implémenter avec un champ status
    draftCourses,
    totalStudents: 0, // À calculer depuis les inscriptions
    totalRevenue: 0, // À calculer depuis les paiements
    averageRating: 0, // À calculer depuis les évaluations
    reportedCourses: 0, // À implémenter avec un système de signalement
    trendingCourses: 0 // À calculer selon des critères de tendance
  }

  // Calculer les statistiques par catégorie
  const categoriesCount = coursesData?.reduce((acc, course) => {
    const category = themesMap[course.theme_id] || 'Non catégorisé'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const categories = Object.entries(categoriesCount).map(([name, count]) => ({
    name,
    count,
    revenue: 0 // À calculer depuis les paiements
  })).sort((a, b) => b.count - a.count).slice(0, 5)

  // Pour l'instant, pas de système de signalement implémenté
  const recentReports: Array<{ courseId: string; reason: string; count: number; severity: string }> = []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des cours</h1>
              <p className="text-gray-600">Modérez et gérez tous les cours de la plateforme</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FileText className="h-4 w-4 mr-2" />
                Rapport
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total cours</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                <p className="text-xs text-gray-500 mt-1">+12% ce mois</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Publiés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.publishedCourses}</p>
                <p className="text-xs text-green-600 mt-1">80% du total</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En révision</p>
                <p className="text-2xl font-bold text-gray-900">{stats.underReview}</p>
                <p className="text-xs text-orange-600 mt-1">À valider</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspendus</p>
                <p className="text-2xl font-bold text-gray-900">{stats.suspendedCourses}</p>
                <p className="text-xs text-red-600 mt-1">Action requise</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Signalés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.reportedCourses}</p>
                <p className="text-xs text-red-600 mt-1">À examiner</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table principale - 3 colonnes */}
          <div className="lg:col-span-3">
            {/* Filtres et recherche */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un cours, formateur..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Toutes catégories</option>
                    <option value="dev">Développement</option>
                    <option value="data">Data Science</option>
                    <option value="marketing">Marketing</option>
                    <option value="design">Design</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Tous statuts</option>
                    <option value="published">Publié</option>
                    <option value="review">En révision</option>
                    <option value="suspended">Suspendu</option>
                    <option value="draft">Brouillon</option>
                  </select>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Table des cours */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun cours trouvé</h3>
                  <p className="text-sm text-gray-500 text-center max-w-sm">
                    Il n'y a actuellement aucun cours dans la base de données.
                    Les cours apparaîtront ici une fois créés.
                  </p>
                </div>
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Formateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Étudiants
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Note
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenus
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-16 flex-shrink-0 bg-gray-200 rounded" />
                            <div className="ml-4">
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-gray-900">{course.title}</p>
                                {course.trending && (
                                  <TrendingUp className="ml-2 h-4 w-4 text-green-500" />
                                )}
                                {course.reportCount > 5 && (
                                  <AlertTriangle className="ml-2 h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                {course.category} • {course.level} • {course.duration}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm text-gray-900">{course.instructor}</p>
                            <p className="text-xs text-gray-500">ID: {course.instructorId}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {course.status === 'published' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5" />
                              Publié
                            </span>
                          )}
                          {course.status === 'under_review' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5" />
                              En révision
                            </span>
                          )}
                          {course.status === 'suspended' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5" />
                              Suspendu
                            </span>
                          )}
                          {course.status === 'draft' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5" />
                              Brouillon
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm text-gray-900">{course.students}</p>
                            {course.completionRate > 0 && (
                              <p className="text-xs text-gray-500">{course.completionRate}% complété</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {course.rating > 0 ? (
                            <div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="ml-1 text-sm text-gray-900">{course.rating}</span>
                              </div>
                              <p className="text-xs text-gray-500">{course.reviews} avis</p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {course.revenue > 0 ? (
                            <div>
                              <p className="text-sm font-medium text-gray-900">{course.revenue}€</p>
                              <p className="text-xs text-gray-500">{course.price}€/cours</p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-gray-600">
                              <Eye className="h-4 w-4" />
                            </button>
                            {course.status === 'published' && (
                              <button className="text-gray-400 hover:text-orange-600">
                                <Pause className="h-4 w-4" />
                              </button>
                            )}
                            {course.status === 'suspended' && (
                              <button className="text-gray-400 hover:text-green-600">
                                <Play className="h-4 w-4" />
                              </button>
                            )}
                            <button className="text-gray-400 hover:text-blue-600">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical className="h-4 w-4" />
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
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">1</span> à <span className="font-medium">5</span> sur{' '}
                      <span className="font-medium">{stats.totalCourses}</span> cours
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Précédent
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        1
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                        2
                      </button>
                      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        3
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Suivant
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top catégories */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Top catégories</h3>
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">{category.name}</span>
                      <span className="text-sm font-medium">{category.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(category.count / 400) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{category.revenue}€ revenus</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Signalements récents */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Signalements</h3>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="space-y-3">
                {recentReports.map((report, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Cours #{report.courseId}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{report.reason}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        report.severity === 'high' ? 'bg-red-100 text-red-800' :
                        report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.count} signalements
                      </span>
                    </div>
                  </div>
                ))}
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700">
                  Voir tous les signalements →
                </button>
              </div>
            </div>

            {/* Métriques globales */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Métriques globales</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Étudiants totaux</span>
                  <span className="text-sm font-medium">{stats.totalStudents}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Revenus totaux</span>
                  <span className="text-sm font-medium">{stats.totalRevenue}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Note moyenne</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium">{stats.averageRating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cours trending</span>
                  <span className="text-sm font-medium text-green-600">{stats.trendingCourses}</span>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center justify-between">
                  <span>Valider les cours en attente</span>
                  <Clock className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center justify-between">
                  <span>Examiner les signalements</span>
                  <AlertCircle className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center justify-between">
                  <span>Politique de contenu</span>
                  <Shield className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center justify-between">
                  <span>Export des données</span>
                  <FileText className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Alertes */}
            {stats.underReview > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-orange-900">Cours en attente</h4>
                    <p className="text-xs text-orange-700 mt-1">
                      {stats.underReview} cours en attente de validation. 
                      Le plus ancien date d'il y a 3 jours.
                    </p>
                    <button className="text-xs text-orange-900 font-medium mt-2 hover:underline">
                      Examiner maintenant →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}