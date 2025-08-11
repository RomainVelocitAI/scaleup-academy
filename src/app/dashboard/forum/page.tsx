import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MessageSquare, TrendingUp, Users, Clock, Search, Filter, Plus, ChevronUp, Tag, User, MessageCircle, Eye, ThumbsUp } from 'lucide-react'
import Link from 'next/link'

export default async function ForumPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Récupérer les discussions du forum (simulées pour l'instant)
  // TODO: Créer les tables forum_topics, forum_posts, forum_categories dans Supabase
  const discussions = [
    {
      id: '1',
      title: 'Comment optimiser les performances de React avec useMemo ?',
      category: 'React',
      author: 'Marie L.',
      authorRole: 'student',
      replies: 12,
      views: 234,
      likes: 8,
      lastActivity: '2 heures',
      isPinned: true,
      tags: ['React', 'Performance', 'Hooks']
    },
    {
      id: '2',
      title: 'Problème avec l\'authentification Supabase',
      category: 'Supabase',
      author: 'Thomas R.',
      authorRole: 'student',
      replies: 5,
      views: 89,
      likes: 3,
      lastActivity: '5 heures',
      isPinned: false,
      tags: ['Supabase', 'Auth', 'Debug']
    },
    {
      id: '3',
      title: '[Résolu] Erreur TypeScript avec les types génériques',
      category: 'TypeScript',
      author: 'Prof. Martin',
      authorRole: 'professor',
      replies: 23,
      views: 456,
      likes: 15,
      lastActivity: '1 jour',
      isPinned: false,
      isResolved: true,
      tags: ['TypeScript', 'Génériques']
    },
    {
      id: '4',
      title: 'Partage de ressources : Les meilleures extensions VS Code',
      category: 'Ressources',
      author: 'Sophie M.',
      authorRole: 'student',
      replies: 34,
      views: 678,
      likes: 45,
      lastActivity: '2 jours',
      isPinned: true,
      tags: ['VS Code', 'Outils', 'Productivité']
    },
    {
      id: '5',
      title: 'Question sur le déploiement avec Vercel',
      category: 'Déploiement',
      author: 'Lucas P.',
      authorRole: 'student',
      replies: 8,
      views: 123,
      likes: 4,
      lastActivity: '3 jours',
      isPinned: false,
      tags: ['Vercel', 'Déploiement', 'Next.js']
    }
  ]

  const categories = [
    { name: 'Tous', count: 156, color: 'bg-gray-100 text-gray-700' },
    { name: 'React', count: 45, color: 'bg-blue-100 text-blue-700' },
    { name: 'TypeScript', count: 32, color: 'bg-purple-100 text-purple-700' },
    { name: 'Supabase', count: 28, color: 'bg-green-100 text-green-700' },
    { name: 'Déploiement', count: 15, color: 'bg-orange-100 text-orange-700' },
    { name: 'Ressources', count: 36, color: 'bg-pink-100 text-pink-700' }
  ]

  const activeUsers = [
    { name: 'Marie L.', avatar: '👩‍💻', status: 'online' },
    { name: 'Prof. Martin', avatar: '👨‍🏫', status: 'online' },
    { name: 'Thomas R.', avatar: '👨‍💼', status: 'online' },
    { name: 'Sophie M.', avatar: '👩‍🎓', status: 'away' },
    { name: 'Lucas P.', avatar: '👨‍💻', status: 'online' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forum de la Communauté</h1>
          <p className="text-gray-600">Posez vos questions, partagez vos connaissances et aidez les autres étudiants</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-600">Discussions</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
                <p className="text-sm text-gray-600">Membres actifs</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">892</p>
                <p className="text-sm text-gray-600">Réponses</p>
              </div>
              <MessageCircle className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">24h</p>
                <p className="text-sm text-gray-600">Temps de réponse</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - 3 colonnes */}
          <div className="lg:col-span-3">
            {/* Barre de recherche et filtres */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher dans le forum..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </button>
                <Link
                  href="/dashboard/forum/new"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle discussion
                </Link>
              </div>
            </div>

            {/* Liste des discussions */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Discussions récentes</h2>
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                    <option>Plus récentes</option>
                    <option>Plus populaires</option>
                    <option>Plus de réponses</option>
                    <option>Non résolues</option>
                  </select>
                </div>
              </div>

              <div className="divide-y">
                {discussions.map((discussion) => (
                  <Link 
                    key={discussion.id}
                    href={`/dashboard/forum/discussion/${discussion.id}`}
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          {discussion.authorRole === 'professor' ? '👨‍🏫' : '👨‍💻'}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              {discussion.isPinned && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                                  📌 Épinglé
                                </span>
                              )}
                              {discussion.isResolved && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                  ✓ Résolu
                                </span>
                              )}
                              <span className={`px-2 py-1 text-xs rounded ${
                                discussion.category === 'React' ? 'bg-blue-100 text-blue-700' :
                                discussion.category === 'TypeScript' ? 'bg-purple-100 text-purple-700' :
                                discussion.category === 'Supabase' ? 'bg-green-100 text-green-700' :
                                discussion.category === 'Déploiement' ? 'bg-orange-100 text-orange-700' :
                                'bg-pink-100 text-pink-700'
                              }`}>
                                {discussion.category}
                              </span>
                            </div>
                            <h3 className="font-medium text-gray-900 mb-1">{discussion.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {discussion.author}
                              </span>
                              <span className="flex items-center">
                                <MessageCircle className="h-3 w-3 mr-1" />
                                {discussion.replies} réponses
                              </span>
                              <span className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {discussion.views} vues
                              </span>
                              <span className="flex items-center">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                {discussion.likes}
                              </span>
                              <span>{discussion.lastActivity}</span>
                            </div>
                            {discussion.tags && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {discussion.tags.map((tag, index) => (
                                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="p-4 border-t">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Affichage de 1-5 sur 156 discussions
                  </p>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Précédent
                    </button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg">1</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Catégories */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Catégories</h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className={`px-2 py-1 text-xs rounded ${category.color}`}>
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-500">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Membres actifs */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Membres actifs</h3>
              <div className="space-y-3">
                {activeUsers.map((user, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                        {user.avatar}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        user.status === 'online' ? 'bg-green-400' : 
                        user.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
                      }`} />
                    </div>
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tendances */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                Sujets tendances
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <ChevronUp className="h-3 w-3 text-green-500" />
                  <span className="text-sm text-gray-700">#React18</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ChevronUp className="h-3 w-3 text-green-500" />
                  <span className="text-sm text-gray-700">#TypeScript5</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ChevronUp className="h-3 w-3 text-green-500" />
                  <span className="text-sm text-gray-700">#NextJS14</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ChevronUp className="h-3 w-3 text-green-500" />
                  <span className="text-sm text-gray-700">#TailwindCSS</span>
                </div>
              </div>
            </div>

            {/* Règles du forum */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">Règles du forum</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Soyez respectueux et courtois</li>
                <li>• Recherchez avant de poster</li>
                <li>• Utilisez des titres descriptifs</li>
                <li>• Partagez votre code avec formatage</li>
                <li>• Marquez les discussions résolues</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}