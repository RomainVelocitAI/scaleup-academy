import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Users, Shield, Mail, Calendar, Search, Filter, MoreVertical, UserPlus, Download, Ban, CheckCircle, XCircle, AlertCircle, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

export default async function AdminUsersPage() {
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

  // Récupérer les utilisateurs depuis la base de données
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      avatar_url,
      bio,
      role,
      created_at,
      updated_at
    `)
    .order('created_at', { ascending: false })

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError)
  }

  // Récupérer les emails depuis auth.users via une requête admin (si possible)
  // Pour l'instant, nous allons créer une structure de données compatible
  const users = profiles?.map(profile => ({
    id: profile.id,
    name: profile.full_name || 'Sans nom',
    email: '', // Email will need to be fetched separately or stored in profiles
    role: profile.role === 'client' ? 'student' : profile.role, // Map 'client' to 'student' for UI
    status: 'active', // Status needs to be added to the database schema
    joinedAt: profile.created_at,
    lastLogin: profile.updated_at,
    avatar: profile.avatar_url,
    bio: profile.bio
  })) || []

  // Calculer les statistiques réelles
  const totalUsers = profiles?.length || 0
  const roleCount = profiles?.reduce((acc, profile) => {
    const role = profile.role === 'client' ? 'students' : 
                 profile.role === 'professor' ? 'professors' : 
                 profile.role === 'admin' ? 'admins' : 'others'
    acc[role] = (acc[role] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // Calculer les statistiques temporelles
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const newToday = profiles?.filter(p => new Date(p.created_at) >= todayStart).length || 0
  const newThisWeek = profiles?.filter(p => new Date(p.created_at) >= weekStart).length || 0
  const newThisMonth = profiles?.filter(p => new Date(p.created_at) >= monthStart).length || 0

  const stats = {
    totalUsers,
    activeUsers: totalUsers, // Pour l'instant, tous sont considérés comme actifs
    suspendedUsers: 0, // À implémenter avec un champ status
    pendingVerification: 0, // À implémenter avec un champ status
    newToday,
    newThisWeek,
    newThisMonth,
    growthRate: totalUsers > 0 ? ((newThisMonth / totalUsers) * 100).toFixed(1) : 0
  }

  const roleDistribution = {
    students: roleCount.students || 0,
    professors: roleCount.professors || 0,
    admins: roleCount.admins || 0,
    moderators: 0 // Pas de modérateurs dans le schéma actuel
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des utilisateurs</h1>
              <p className="text-gray-600">Gérez les comptes utilisateurs et les permissions</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Nouvel utilisateur
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-green-600 mt-1">+{stats.growthRate}% ce mois</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                <p className="text-xs text-gray-500 mt-1">88.3% du total</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspendus</p>
                <p className="text-2xl font-bold text-gray-900">{stats.suspendedUsers}</p>
                <p className="text-xs text-gray-500 mt-1">3.6% du total</p>
              </div>
              <Ban className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingVerification}</p>
                <p className="text-xs text-gray-500 mt-1">Vérification requise</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table principale - 3 colonnes */}
          <div className="lg:col-span-3">
            {/* Barre de recherche et filtres */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom, email..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Tous les rôles</option>
                    <option value="student">Étudiants</option>
                    <option value="professor">Formateurs</option>
                    <option value="admin">Admins</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Tous les statuts</option>
                    <option value="active">Actif</option>
                    <option value="suspended">Suspendu</option>
                    <option value="pending">En attente</option>
                  </select>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Table des utilisateurs */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Users className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
                  <p className="text-sm text-gray-500 text-center max-w-sm">
                    Il n'y a actuellement aucun utilisateur dans la base de données.
                    Les utilisateurs apparaîtront ici une fois inscrits.
                  </p>
                </div>
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inscription
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dernière connexion
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'professor' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.role === 'admin' ? 'Admin' :
                             user.role === 'professor' ? 'Formateur' :
                             'Étudiant'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.status === 'active' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5" />
                              Actif
                            </span>
                          )}
                          {user.status === 'suspended' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5" />
                              Suspendu
                            </span>
                          )}
                          {user.status === 'pending' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5" />
                              En attente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.joinedAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastLogin}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-gray-600">
                              <Eye className="h-4 w-4" />
                            </button>
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
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Précédent
                    </button>
                    <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Suivant
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Affichage de <span className="font-medium">1</span> à <span className="font-medium">10</span> sur{' '}
                        <span className="font-medium">{stats.totalUsers}</span> résultats
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
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
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          124
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

            {/* Actions en masse */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">5 utilisateurs sélectionnés.</span> Choisissez une action à appliquer.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-white border border-yellow-300 text-yellow-800 rounded hover:bg-yellow-100">
                    Envoyer un email
                  </button>
                  <button className="px-3 py-1 text-sm bg-white border border-yellow-300 text-yellow-800 rounded hover:bg-yellow-100">
                    Changer le statut
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Répartition par rôle */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Répartition par rôle</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Étudiants</span>
                    <span className="font-medium">{roleDistribution.students}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Formateurs</span>
                    <span className="font-medium">{roleDistribution.professors}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '23%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Modérateurs</span>
                    <span className="font-medium">{roleDistribution.moderators}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '4%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Admins</span>
                    <span className="font-medium">{roleDistribution.admins}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: '1%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Activité récente */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Activité récente</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nouveaux aujourd'hui</span>
                  <span className="text-sm font-medium text-green-600">+{stats.newToday}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cette semaine</span>
                  <span className="text-sm font-medium text-blue-600">+{stats.newThisWeek}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ce mois</span>
                  <span className="text-sm font-medium text-purple-600">+{stats.newThisMonth}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 mb-2">Croissance mensuelle</p>
                <div className="flex items-end justify-between h-16">
                  {[40, 65, 45, 80, 55, 90, 75].map((height, index) => (
                    <div key={index} className="w-4 bg-blue-500 rounded-t" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center justify-between">
                  <span>Inviter des utilisateurs</span>
                  <Mail className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center justify-between">
                  <span>Gérer les permissions</span>
                  <Shield className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center justify-between">
                  <span>Rapports suspendus</span>
                  <AlertCircle className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-lg flex items-center justify-between">
                  <span>Export CSV</span>
                  <Download className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Alertes */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-900">Actions requises</h4>
                  <ul className="mt-2 text-xs text-red-700 space-y-1">
                    <li>• 15 comptes en attente de vérification</li>
                    <li>• 3 signalements à examiner</li>
                    <li>• 2 demandes de réinitialisation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}