import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Award, Download, Share2, Calendar, Clock, CheckCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function CertificatesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Récupérer les certificats (cours complétés à 100%)
  const { data: completedEnrollments } = await supabase
    .from('enrollments')
    .select(`
      *,
      courses (*)
    `)
    .eq('user_id', user.id)
    .eq('progress', 100)
    .order('completed_at', { ascending: false })

  const certificates = completedEnrollments || []
  const totalCertificates = certificates.length

  // Statistiques des certificats
  const currentYear = new Date().getFullYear()
  const certificatesThisYear = certificates.filter(cert => {
    const completedYear = cert.completed_at ? new Date(cert.completed_at).getFullYear() : 0
    return completedYear === currentYear
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Certificats</h1>
          <p className="text-gray-600">Téléchargez et partagez vos certificats de réussite</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{totalCertificates}</h3>
            <p className="text-sm text-gray-600">Certificats obtenus</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{certificatesThisYear}</h3>
            <p className="text-sm text-gray-600">Cette année</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Share2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">LinkedIn</h3>
            <p className="text-sm text-gray-600">Partage recommandé</p>
          </div>
        </div>

        {/* Liste des certificats */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Tous mes certificats</h2>
          </div>
          
          {certificates.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((enrollment) => {
                  const course = enrollment.courses
                  if (!course) return null
                  
                  const completedDate = enrollment.completed_at 
                    ? new Date(enrollment.completed_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'Date non disponible'
                  
                  // Générer un ID de certificat unique
                  const certificateId = `CERT-${course.id.slice(0, 8).toUpperCase()}-${enrollment.id.slice(0, 8).toUpperCase()}`
                  
                  return (
                    <div key={enrollment.id} className="border rounded-lg hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        {/* Header du certificat */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg">
                              <Award className="h-8 w-8 text-white" />
                            </div>
                            <div className="ml-4">
                              <h3 className="font-semibold text-gray-900">Certificat de Réussite</h3>
                              <p className="text-xs text-gray-500 mt-1">ID: {certificateId}</p>
                            </div>
                          </div>
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        </div>

                        {/* Informations du cours */}
                        <div className="mb-6">
                          <h4 className="text-lg font-medium text-gray-900 mb-2">{course.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                        </div>

                        {/* Détails */}
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Complété le {completedDate}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>Durée: {course.duration || '20'} heures</span>
                          </div>
                          {course.instructor && (
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">👨‍🏫</span>
                              <span>Formateur: {course.instructor}</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-3">
                          <button className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </button>
                          <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            <Share2 className="h-4 w-4 mr-2" />
                            Partager
                          </button>
                        </div>

                        {/* Lien vers le cours */}
                        <Link 
                          href={`/courses/${course.id}`}
                          className="mt-4 flex items-center justify-center text-sm text-blue-600 hover:text-blue-700"
                        >
                          Voir le cours
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Award className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun certificat pour le moment</h3>
              <p className="text-gray-600 mb-6">
                Complétez vos premiers cours pour obtenir des certificats de réussite
              </p>
              <Link
                href="/dashboard/courses"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Explorer mes cours
              </Link>
            </div>
          )}
        </div>

        {/* Section d'aide */}
        {certificates.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Comment utiliser vos certificats ?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-1">📄 CV et Portfolio</h4>
                <p>Ajoutez vos certificats à votre CV pour valoriser vos compétences</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">💼 LinkedIn</h4>
                <p>Partagez vos réussites sur votre profil professionnel</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">🎯 Entretiens</h4>
                <p>Présentez vos certificats lors de vos entretiens d'embauche</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}