'use client'

import { Users, BookOpen, DollarSign, TrendingUp, AlertCircle, Shield, Activity, Calendar, BarChart2, PieChart } from 'lucide-react'
import Link from 'next/link'

interface AdminDashboardProps {
  totalUsers: number
  totalCourses: number
  totalRevenue: number
  activeUsers: number
  newUsersToday: number
  pendingIssues: number
  systemHealth: 'good' | 'warning' | 'critical'
  revenueGrowth: number
  userGrowth: number
  courseCompletionRate: number
}

export function AdminDashboard({
  totalUsers = 0,
  totalCourses = 0,
  totalRevenue = 0,
  activeUsers = 0,
  newUsersToday = 0,
  pendingIssues = 0,
  systemHealth = 'good',
  revenueGrowth = 0,
  userGrowth = 0,
  courseCompletionRate = 0
}: AdminDashboardProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header avec statut système */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Tableau de bord Administrateur
            </h1>
            <p className="text-gray-300">
              Vue d'ensemble de la plateforme ScaleUp Academy
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className={`h-5 w-5 ${
              systemHealth === 'good' ? 'text-green-400' :
              systemHealth === 'warning' ? 'text-yellow-400' :
              'text-red-400'
            }`} />
            <span className="text-sm">
              Système : {systemHealth === 'good' ? 'Opérationnel' :
                        systemHealth === 'warning' ? 'Dégradé' : 'Critique'}
            </span>
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilisateurs totaux</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              <p className="text-xs text-green-600 mt-1">
                {userGrowth > 0 ? '+' : ''}{userGrowth}% ce mois
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>Actifs: {activeUsers}</span>
            <span>Nouveau: +{newUsersToday}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cours totaux</p>
              <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
              <p className="text-xs text-green-600 mt-1">
                Taux complétion: {courseCompletionRate}%
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>Publiés: {Math.floor(totalCourses * 0.8)}</span>
            <span>Brouillons: {Math.floor(totalCourses * 0.2)}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus totaux</p>
              <p className="text-2xl font-bold text-gray-900">{totalRevenue}€</p>
              <p className="text-xs text-green-600 mt-1">
                {revenueGrowth > 0 ? '+' : ''}{revenueGrowth}% ce mois
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>Ce mois: {Math.floor(totalRevenue * 0.15)}€</span>
            <span>Aujourd'hui: {Math.floor(totalRevenue * 0.005)}€</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Problèmes en attente</p>
              <p className="text-2xl font-bold text-gray-900">{pendingIssues}</p>
              <p className="text-xs text-orange-600 mt-1">
                Nécessite attention
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-500" />
          </div>
          <Link 
            href="/dashboard/admin/issues"
            className="mt-4 block text-center text-xs text-blue-600 hover:text-blue-800"
          >
            Voir tous les problèmes →
          </Link>
        </div>
      </div>

      {/* Graphiques et tableaux */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique principal - 2 colonnes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Graphique des revenus et utilisateurs */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                Croissance mensuelle
              </h2>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-end justify-between space-x-2">
                {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'].map((month, index) => (
                  <div key={month} className="flex-1">
                    <div className="flex space-x-1 h-48">
                      <div className="flex-1 flex flex-col justify-end">
                        <div 
                          className="bg-blue-500 rounded-t"
                          style={{ height: `${Math.random() * 100}%` }}
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-end">
                        <div 
                          className="bg-green-500 rounded-t"
                          style={{ height: `${Math.random() * 100}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">{month}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4 space-x-6">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
                  <span className="text-sm text-gray-600">Utilisateurs</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2" />
                  <span className="text-sm text-gray-600">Revenus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tableau des formateurs performants */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-600" />
                Top Formateurs
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Formateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cours
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Étudiants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-300 rounded-full" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">Formateur {i}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.floor(Math.random() * 10 + 1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.floor(Math.random() * 1000 + 100)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {Math.floor(Math.random() * 10000 + 1000)}€
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(Math.random() * 2 + 3).toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Colonne de droite */}
        <div className="space-y-6">
          {/* Actions rapides */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Actions rapides</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link 
                href="/dashboard/admin/users"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border"
              >
                <span className="text-sm font-medium">Gérer les utilisateurs</span>
                <Users className="h-4 w-4 text-gray-400" />
              </Link>
              <Link 
                href="/dashboard/admin/courses"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border"
              >
                <span className="text-sm font-medium">Modérer les cours</span>
                <BookOpen className="h-4 w-4 text-gray-400" />
              </Link>
              <Link 
                href="/dashboard/admin/security"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border"
              >
                <span className="text-sm font-medium">Sécurité</span>
                <Shield className="h-4 w-4 text-gray-400" />
              </Link>
              <Link 
                href="/dashboard/admin/analytics"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border"
              >
                <span className="text-sm font-medium">Analytics avancées</span>
                <BarChart2 className="h-4 w-4 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Répartition des revenus */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <PieChart className="mr-2 h-5 w-5 text-indigo-600" />
                Répartition des revenus
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                    <span className="text-sm text-gray-600">Abonnements</span>
                  </div>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                    <span className="text-sm text-gray-600">Cours premium</span>
                  </div>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2" />
                    <span className="text-sm text-gray-600">Événements</span>
                  </div>
                  <span className="text-sm font-medium">10%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Événements système */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-red-600" />
                Événements système
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-1.5" />
                  <div>
                    <p className="text-sm text-gray-900">Sauvegarde réussie</p>
                    <p className="text-xs text-gray-500">Il y a 2 heures</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-1.5" />
                  <div>
                    <p className="text-sm text-gray-900">Mise à jour système</p>
                    <p className="text-xs text-gray-500">Planifiée ce soir</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-1.5" />
                  <div>
                    <p className="text-sm text-gray-900">Rapport mensuel généré</p>
                    <p className="text-xs text-gray-500">Disponible</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}