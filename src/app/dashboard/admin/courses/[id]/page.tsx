import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { 
  ArrowLeft, Edit, Trash2, Users, Clock, Calendar, DollarSign, 
  BarChart, Eye, Star, MessageSquare, PlayCircle, FileText, 
  Download, Upload, Shield, AlertCircle, CheckCircle, XCircle,
  TrendingUp, TrendingDown, MoreVertical, Copy, ExternalLink,
  Book, Video, File, Lock, Unlock, Settings, RefreshCw, Send,
  UserPlus, Ban, Mail, Activity, Package, Zap, Award
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminCourseDetailsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Vérifier si l'utilisateur est admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Récupérer les détails du cours
  const { data: course } = await supabase
    .from('courses')
    .select(`
      *,
      profiles:created_by(
        id,
        email,
        first_name,
        last_name
      ),
      enrollments(
        id,
        user_id,
        enrolled_at,
        progress,
        completed_at,
        profiles:user_id(
          email,
          first_name,
          last_name
        )
      ),
      modules(
        id,
        title,
        description,
        order_index,
        lessons(
          id,
          title,
          type,
          duration,
          order_index
        )
      )
    `)
    .eq('id', params.id)
    .single()

  if (!course) {
    notFound()
  }

  // Calculer les statistiques
  const totalEnrollments = course.enrollments?.length || 0
  const completedEnrollments = course.enrollments?.filter(e => e.completed_at).length || 0
  const completionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0
  const averageProgress = course.enrollments?.reduce((sum, e) => sum + (e.progress || 0), 0) / (totalEnrollments || 1)
  const totalRevenue = (course.price || 0) * totalEnrollments
  
  const totalModules = course.modules?.length || 0
  const totalLessons = course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0
  const totalDuration = course.modules?.reduce((sum, m) => 
    sum + (m.lessons?.reduce((lSum, l) => lSum + (l.duration || 0), 0) || 0), 0
  ) || 0

  // Données simulées pour les graphiques et stats supplémentaires
  const recentActivity = [
    { date: '2024-02-18', enrollments: 5, revenue: 495 },
    { date: '2024-02-17', enrollments: 3, revenue: 297 },
    { date: '2024-02-16', enrollments: 8, revenue: 792 },
    { date: '2024-02-15', enrollments: 2, revenue: 198 },
    { date: '2024-02-14', enrollments: 6, revenue: 594 },
    { date: '2024-02-13', enrollments: 4, revenue: 396 },
    { date: '2024-02-12', enrollments: 7, revenue: 693 },
  ]

  const ratings = {
    average: 4.6,
    total: 234,
    distribution: {
      5: 145,
      4: 67,
      3: 18,
      2: 3,
      1: 1
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/dashboard/admin/courses" 
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{course.title}</h1>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.status === 'published' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : course.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                }`}>
                  {course.status === 'published' ? 'Publié' : 
                   course.status === 'draft' ? 'Brouillon' : 'Archivé'}
                </span>
              </div>
              <p className="text-muted-foreground mt-1">{course.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link 
                href={`/dashboard/admin/courses/${params.id}/edit`}
                className="px-4 py-2 border rounded-lg hover:bg-accent flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Modifier
              </Link>
              <button className="px-4 py-2 border rounded-lg hover:bg-accent flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Prévisualiser
              </button>
              <button className="p-2 border rounded-lg hover:bg-accent">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Instructor Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-medium">
                  {course.profiles?.first_name?.[0]}{course.profiles?.last_name?.[0]}
                </span>
              </div>
              <span>
                {course.profiles?.first_name} {course.profiles?.last_name}
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Créé le {new Date(course.created_at).toLocaleDateString('fr-FR')}
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Mis à jour {new Date(course.updated_at).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="flex items-center text-sm text-green-600 font-medium">
                <TrendingUp className="h-4 w-4 mr-1" />
                +23%
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{totalEnrollments}</div>
            <div className="text-sm text-muted-foreground">Inscriptions</div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-green-600" />
              <span className="flex items-center text-sm text-green-600 font-medium">
                <TrendingUp className="h-4 w-4 mr-1" />
                +18%
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(totalRevenue / 100)}
            </div>
            <div className="text-sm text-muted-foreground">Revenus totaux</div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <span className="text-sm font-medium">{completionRate.toFixed(1)}%</span>
            </div>
            <div className="text-2xl font-bold mb-1">{completedEnrollments}</div>
            <div className="text-sm text-muted-foreground">Complétés</div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center justify-between mb-4">
              <Star className="h-8 w-8 text-yellow-600" />
              <span className="text-sm text-muted-foreground">{ratings.total} avis</span>
            </div>
            <div className="text-2xl font-bold mb-1">{ratings.average}/5</div>
            <div className="text-sm text-muted-foreground">Note moyenne</div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center justify-between mb-4">
              <Activity className="h-8 w-8 text-purple-600" />
              <span className="text-sm font-medium">{averageProgress.toFixed(0)}%</span>
            </div>
            <div className="text-2xl font-bold mb-1">{averageProgress.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Progression moy.</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Structure */}
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Book className="h-5 w-5" />
                Structure du cours
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 pb-4 border-b">
                  <div>
                    <div className="text-2xl font-bold">{totalModules}</div>
                    <div className="text-sm text-muted-foreground">Modules</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalLessons}</div>
                    <div className="text-sm text-muted-foreground">Leçons</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</div>
                    <div className="text-sm text-muted-foreground">Durée totale</div>
                  </div>
                </div>

                {course.modules?.sort((a, b) => a.order_index - b.order_index).map((module) => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">Module {module.order_index}: {module.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                      </div>
                      <button className="p-1 hover:bg-accent rounded">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      {module.lessons?.sort((a, b) => a.order_index - b.order_index).map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between py-2 px-3 rounded hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            {lesson.type === 'video' ? (
                              <Video className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <FileText className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="text-sm">{lesson.title}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{lesson.duration}min</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 px-4 py-2 border-2 border-dashed rounded-lg hover:bg-accent flex items-center justify-center gap-2">
                <UserPlus className="h-4 w-4" />
                Ajouter un module
              </button>
            </div>

            {/* Recent Enrollments */}
            <div className="bg-card rounded-lg p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Inscriptions récentes
                </h2>
                <Link 
                  href={`/dashboard/admin/courses/${params.id}/students`}
                  className="text-sm text-primary hover:underline"
                >
                  Voir tous les étudiants →
                </Link>
              </div>

              <div className="space-y-3">
                {course.enrollments?.slice(0, 5).map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {enrollment.profiles?.first_name?.[0]}{enrollment.profiles?.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">
                          {enrollment.profiles?.first_name} {enrollment.profiles?.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {enrollment.profiles?.email}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{enrollment.progress || 0}%</div>
                      <div className="text-xs text-muted-foreground">
                        Inscrit le {new Date(enrollment.enrolled_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Activité des 7 derniers jours
              </h2>

              <div className="h-64 flex items-end justify-between gap-2">
                {recentActivity.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-primary/20 hover:bg-primary/30 rounded-t transition-colors relative group flex-1 flex flex-col justify-end">
                      <div 
                        className="bg-primary rounded-t transition-all"
                        style={{ height: `${(day.enrollments / 8) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card border rounded px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {day.enrollments} inscriptions
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Details */}
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Détails du cours
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Prix</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format((course.price || 0) / 100)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Catégorie</span>
                  <span className="font-medium">{course.category || 'Non catégorisé'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Niveau</span>
                  <span className="font-medium">{course.level || 'Tous niveaux'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Langue</span>
                  <span className="font-medium">Français</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Certificat</span>
                  <span className="font-medium">
                    {course.has_certificate ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Disponible
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <XCircle className="h-4 w-4" />
                        Non disponible
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Accès</span>
                  <span className="font-medium">À vie</span>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Notes et avis
              </h3>

              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{ratings.average}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(ratings.average)
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {ratings.total} avis
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-xs w-3">{rating}</span>
                      <Star className="h-3 w-3 text-yellow-500" />
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500"
                          style={{ width: `${(ratings.distribution[rating] / ratings.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-10 text-right">
                        {ratings.distribution[rating]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full px-4 py-2 border rounded-lg hover:bg-accent text-sm">
                Voir tous les avis
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Actions rapides
              </h3>

              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-sm flex items-center justify-between">
                  <span>Dupliquer le cours</span>
                  <Copy className="h-4 w-4" />
                </button>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-sm flex items-center justify-between">
                  <span>Exporter les données</span>
                  <Download className="h-4 w-4" />
                </button>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-sm flex items-center justify-between">
                  <span>Envoyer une notification</span>
                  <Send className="h-4 w-4" />
                </button>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-sm flex items-center justify-between">
                  <span>Générer un rapport</span>
                  <FileText className="h-4 w-4" />
                </button>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-sm flex items-center justify-between text-red-600">
                  <span>Archiver le cours</span>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Course Status */}
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Statut et visibilité
              </h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm">Cours publié</span>
                  <input
                    type="checkbox"
                    checked={course.status === 'published'}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    readOnly
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Inscriptions ouvertes</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Visible dans le catalogue</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Cours en promotion</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </label>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                Mettre à jour le statut
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}