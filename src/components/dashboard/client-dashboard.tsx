'use client'

import { BookOpen, Clock, Award, TrendingUp, Calendar, Users, PlayCircle, Target } from 'lucide-react'
import Link from 'next/link'

interface CourseProgress {
  id: string
  title: string
  progress: number
  lastAccessed: string
  thumbnail?: string
}

interface ClientDashboardProps {
  userName?: string
  coursesInProgress: CourseProgress[]
  completedCourses: number
  totalHours: number
  certificates: number
  upcomingEvents: any[]
  achievements: any[]
}

export function ClientDashboard({
  userName,
  coursesInProgress = [],
  completedCourses = 0,
  totalHours = 0,
  certificates = 0,
  upcomingEvents = [],
  achievements = []
}: ClientDashboardProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Bienvenue, {userName || 'Étudiant'} ! 👋
        </h1>
        <p className="text-blue-100">
          Continuez votre parcours d'apprentissage et atteignez vos objectifs.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cours en cours</p>
              <p className="text-2xl font-bold text-gray-900">{coursesInProgress.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cours complétés</p>
              <p className="text-2xl font-bold text-gray-900">{completedCourses}</p>
            </div>
            <Target className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Heures d'apprentissage</p>
              <p className="text-2xl font-bold text-gray-900">{totalHours}h</p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Certificats</p>
              <p className="text-2xl font-bold text-gray-900">{certificates}</p>
            </div>
            <Award className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cours en cours - 2 colonnes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                Continuer l'apprentissage
              </h2>
            </div>
            <div className="p-6">
              {coursesInProgress.length > 0 ? (
                <div className="space-y-4">
                  {coursesInProgress.map((course) => (
                    <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0 w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <PlayCircle className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <div className="mt-1 flex items-center space-x-4">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500">{course.progress}%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Dernière activité : {course.lastAccessed}
                        </p>
                      </div>
                      <Link 
                        href={`/dashboard/courses/${course.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Continuer
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-500">Aucun cours en cours</p>
                  <Link 
                    href="/courses"
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Explorer les cours
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Progression hebdomadaire */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                Progression cette semaine
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-7 gap-2">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                  <div key={index} className="text-center">
                    <p className="text-xs text-gray-500 mb-2">{day}</p>
                    <div className="h-20 bg-gray-100 rounded relative overflow-hidden">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-green-500"
                        style={{ height: `${Math.random() * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Colonne de droite */}
        <div className="space-y-6">
          {/* Événements à venir */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-purple-600" />
                Événements à venir
              </h2>
            </div>
            <div className="p-6">
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">
                          {event.day}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Aucun événement prévu</p>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <Award className="mr-2 h-5 w-5 text-yellow-600" />
                Achievements récents
              </h2>
            </div>
            <div className="p-6">
              {achievements.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="text-center">
                      <div className="h-16 w-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                        <Award className="h-8 w-8 text-yellow-600" />
                      </div>
                      <p className="text-xs mt-1 text-gray-600">{achievement.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Continuez vos cours pour débloquer des achievements</p>
              )}
            </div>
          </div>

          {/* Communauté */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold flex items-center">
                <Users className="mr-2 h-5 w-5 text-indigo-600" />
                Communauté
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Étudiants actifs</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Discussions forum</span>
                  <span className="font-semibold">56</span>
                </div>
                <Link 
                  href="/dashboard/forum"
                  className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mt-4"
                >
                  Rejoindre le forum
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}