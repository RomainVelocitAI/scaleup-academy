import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FileText, Video, Download, Upload, Folder, Search, Filter, Grid, List, Plus, File, Image, Archive, Music, Film, BookOpen, ExternalLink, Clock, User, Star, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function ProfessorResourcesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Vérifier que l'utilisateur est bien un formateur
  // TODO: Ajouter la vérification du rôle depuis la base de données

  // Ressources simulées
  const resources = [
    {
      id: '1',
      name: 'Introduction React.pdf',
      type: 'pdf',
      size: '2.4 MB',
      course: 'React de A à Z',
      uploadedAt: 'Il y a 2 jours',
      downloads: 234,
      icon: FileText,
      color: 'text-red-500'
    },
    {
      id: '2',
      name: 'Tutoriel Hooks.mp4',
      type: 'video',
      size: '145 MB',
      course: 'React de A à Z',
      uploadedAt: 'Il y a 5 jours',
      downloads: 156,
      icon: Video,
      color: 'text-blue-500'
    },
    {
      id: '3',
      name: 'Exercices TypeScript.zip',
      type: 'archive',
      size: '8.2 MB',
      course: 'TypeScript Avancé',
      uploadedAt: 'Il y a 1 semaine',
      downloads: 89,
      icon: Archive,
      color: 'text-purple-500'
    },
    {
      id: '4',
      name: 'Slides Présentation.pptx',
      type: 'presentation',
      size: '12.5 MB',
      course: 'JavaScript Moderne',
      uploadedAt: 'Il y a 2 semaines',
      downloads: 321,
      icon: FileText,
      color: 'text-orange-500'
    },
    {
      id: '5',
      name: 'Code Examples.zip',
      type: 'archive',
      size: '3.7 MB',
      course: 'Node.js Backend',
      uploadedAt: 'Il y a 3 semaines',
      downloads: 445,
      icon: Archive,
      color: 'text-green-500'
    }
  ]

  const folders = [
    { name: 'React de A à Z', files: 24, size: '450 MB', lastModified: 'Il y a 2 jours' },
    { name: 'TypeScript Avancé', files: 18, size: '320 MB', lastModified: 'Il y a 5 jours' },
    { name: 'JavaScript Moderne', files: 32, size: '280 MB', lastModified: 'Il y a 1 semaine' },
    { name: 'Node.js Backend', files: 15, size: '180 MB', lastModified: 'Il y a 2 semaines' }
  ]

  const recentActivity = [
    { action: 'Téléchargé', file: 'Introduction React.pdf', user: 'Marie L.', time: 'Il y a 10 min' },
    { action: 'Téléchargé', file: 'Tutoriel Hooks.mp4', user: 'Thomas R.', time: 'Il y a 30 min' },
    { action: 'Téléchargé', file: 'Exercices TypeScript.zip', user: 'Sophie M.', time: 'Il y a 1 heure' },
    { action: 'Téléchargé', file: 'Code Examples.zip', user: 'Lucas P.', time: 'Il y a 2 heures' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Ressources pédagogiques</h1>
              <p className="text-gray-600">Gérez et partagez vos supports de cours</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Uploader
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">124</p>
                <p className="text-sm text-gray-600">Fichiers totaux</p>
              </div>
              <File className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">2.3 GB</p>
                <p className="text-sm text-gray-600">Espace utilisé</p>
              </div>
              <Folder className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">4,567</p>
                <p className="text-sm text-gray-600">Téléchargements</p>
              </div>
              <Download className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">89%</p>
                <p className="text-sm text-gray-600">Satisfaction</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des ressources - 2 colonnes */}
          <div className="lg:col-span-2">
            {/* Barre de recherche et filtres */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher une ressource..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Tous les types</option>
                  <option>Documents</option>
                  <option>Vidéos</option>
                  <option>Archives</option>
                  <option>Présentations</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Tous les cours</option>
                  <option>React de A à Z</option>
                  <option>TypeScript Avancé</option>
                  <option>JavaScript Moderne</option>
                  <option>Node.js Backend</option>
                </select>
                <div className="flex gap-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Grid className="h-4 w-4" />
                  </button>
                  <button className="p-2 bg-gray-100 border border-gray-300 rounded-lg">
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Dossiers */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Dossiers de cours</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {folders.map((folder, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Folder className="h-10 w-10 text-blue-500" />
                          <div>
                            <h3 className="font-medium text-gray-900">{folder.name}</h3>
                            <p className="text-sm text-gray-500">{folder.files} fichiers • {folder.size}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Modifié {folder.lastModified}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Liste des fichiers */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Fichiers récents</h2>
              </div>
              <div className="divide-y">
                {resources.map((resource) => {
                  const Icon = resource.icon
                  return (
                    <div key={resource.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 bg-gray-100 rounded-lg ${resource.color}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{resource.name}</h3>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                              <span>{resource.course}</span>
                              <span>•</span>
                              <span>{resource.size}</span>
                              <span>•</span>
                              <span>{resource.uploadedAt}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{resource.downloads} téléchargements</span>
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Download className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <ExternalLink className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Espace de stockage */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Espace de stockage</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Utilisé</span>
                    <span className="font-medium">2.3 GB / 10 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '23%' }} />
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Documents</span>
                    <span className="text-gray-900">850 MB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vidéos</span>
                    <span className="text-gray-900">1.2 GB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Archives</span>
                    <span className="text-gray-900">250 MB</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Augmenter l'espace
              </button>
            </div>

            {/* Activité récente */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                Activité récente
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-1.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-gray-600"> a {activity.action.toLowerCase()} </span>
                        <span className="font-medium">{activity.file}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ressources populaires */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                Ressources populaires
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-700">Guide React.pdf</span>
                  </div>
                  <span className="text-xs text-gray-500">523 DL</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Video className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-700">Intro Hooks.mp4</span>
                  </div>
                  <span className="text-xs text-gray-500">445 DL</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Archive className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-700">Examples.zip</span>
                  </div>
                  <span className="text-xs text-gray-500">389 DL</span>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="font-semibold mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <span className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un dossier
                  </span>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <span className="flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload en masse
                  </span>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <span className="flex items-center">
                    <Archive className="h-4 w-4 mr-2" />
                    Exporter tout
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}