'use client'

import { Video, Users, DollarSign, BarChart, MessageSquare, Star, TrendingUp, BookOpen, Plus, Eye } from 'lucide-react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  students: number
  rating: number
  revenue: number
  status: 'published' | 'draft'
}

interface ProfessorDashboardProps {
  userName?: string
  courses: Course[]
  totalStudents: number
  totalRevenue: number
  averageRating: number
  recentMessages: any[]
  monthlyRevenue: number[]
}

export function ProfessorDashboard({
  userName,
  courses = [],
  totalStudents = 0,
  totalRevenue = 0,
  averageRating = 0,
  recentMessages = [],
  monthlyRevenue = []
}: ProfessorDashboardProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Tableau de bord Formateur
        </h1>
        <p className="text-purple-100">
          Bienvenue {userName} ! Gérez vos cours et suivez vos performances.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cours actifs</p>
              <p className="text-2xl font-bold text-gray-900">{courses.filter(c => c.status === 'published').length}</p>
            </div>
            <Video className="h-8 w-8 text-purple-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            +{courses.filter(c => c.status === 'draft').length} brouillons
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total étudiants</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">
            +12% ce mois
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus totaux</p>
              <p className="text-2xl font-bold text-gray-900">{totalRevenue}€</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-xs text-green-600 mt-2">
            +{(totalRevenue * 0.15).toFixed(0)}€ ce mois
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Note moyenne</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="flex mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mes Cours - 2 colonnes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-purple-600" />
                Mes Cours
              </h2>
              <Link 
                href="/dashboard/professor/create"
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouveau cours
              </Link>
            </div>
            <div className="p-6">
              {courses.length > 0 ? (
                <div className="space-y-4">
                  {courses.slice(0, 5).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{course.title}</h3>
                          {course.status === 'draft' && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              Brouillon
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Users className="mr-1 h-4 w-4" />
                            {course.students} étudiants
                          </span>
                          <span className="flex items-center">
                            <Star className="mr-1 h-4 w-4" />
                            {course.rating.toFixed(1)}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="mr-1 h-4 w-4" />
                            {course.revenue}€
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link 
                          href={`/dashboard/professor/courses/${course.id}/analytics`}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <BarChart className="h-5 w-5" />
                        </Link>
                        <Link 
                          href={`/dashboard/professor/courses/${course.id}/edit`}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Video className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">Aucun cours créé</p>
                  <Link 
                    href="/dashboard/professor/create"
                    className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Créer mon premier cours
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Graphique des revenus */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                Évolution des revenus
              </h2>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-end justify-between space-x-2">
                {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'].map((month, index) => (
                  <div key={month} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '200px' }}>
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                        style={{ height: `${Math.random() * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{month}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Colonne de droite */}
        <div className="space-y-6">
          {/* Messages récents */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
                Messages récents
              </h2>
            </div>
            <div className="p-6">
              {recentMessages.length > 0 ? (
                <div className="space-y-3">
                  {recentMessages.map((message, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{message.from}</p>
                        <p className="text-sm text-gray-500">{message.preview}</p>
                        <p className="text-xs text-gray-400 mt-1">{message.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Aucun nouveau message</p>
              )}
              <Link 
                href="/dashboard/messages"
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4"
              >
                Voir tous les messages
              </Link>
            </div>
          </div>

          {/* Top étudiants */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-600" />
                Top étudiants
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {[1, 2, 3].map((rank) => (
                  <div key={rank} className="flex items-center space-x-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                      rank === 2 ? 'bg-gray-100 text-gray-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {rank}
                    </span>
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Étudiant {rank}</p>
                      <p className="text-xs text-gray-500">5 cours complétés</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Actions rapides</h2>
              <div className="space-y-2">
                <Link 
                  href="/dashboard/professor/resources"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-700">Ajouter des ressources</span>
                  <Plus className="h-4 w-4 text-gray-400" />
                </Link>
                <Link 
                  href="/dashboard/professor/analytics"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-700">Voir les analytics</span>
                  <BarChart className="h-4 w-4 text-gray-400" />
                </Link>
                <Link 
                  href="/dashboard/professor/earnings"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-700">Gérer les paiements</span>
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}