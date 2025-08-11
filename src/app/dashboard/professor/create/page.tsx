import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Plus, Video, FileText, DollarSign, Users, Clock, BookOpen, Upload, Tag, Globe, Lock } from 'lucide-react'
import Link from 'next/link'

export default async function CreateCoursePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Vérifier que l'utilisateur est bien un formateur
  // TODO: Ajouter la vérification du rôle depuis la base de données

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer un nouveau cours</h1>
              <p className="text-gray-600">Partagez vos connaissances avec des milliers d'étudiants</p>
            </div>
            <Link 
              href="/dashboard/professor"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </Link>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {['Informations', 'Curriculum', 'Prix', 'Publication'].map((step, index) => (
              <div key={index} className="flex-1">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      index === 0 ? 'bg-gray-200' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
                <p className={`text-sm mt-2 ${
                  index === 0 ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form - 2 columns */}
          <div className="lg:col-span-2">
            <form className="space-y-6">
              {/* Informations de base */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations de base</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Titre du cours *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Maîtriser React de A à Z"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">60 caractères maximum</p>
                  </div>

                  <div>
                    <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Sous-titre
                    </label>
                    <input
                      type="text"
                      id="subtitle"
                      name="subtitle"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Apprenez à créer des applications web modernes avec React"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Décrivez ce que les étudiants vont apprendre..."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 200 caractères</p>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie *
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      <option value="development">Développement</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                      <option value="marketing">Marketing</option>
                      <option value="photography">Photographie</option>
                      <option value="music">Musique</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                      Niveau *
                    </label>
                    <select
                      id="level"
                      name="level"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Sélectionnez un niveau</option>
                      <option value="beginner">Débutant</option>
                      <option value="intermediate">Intermédiaire</option>
                      <option value="advanced">Avancé</option>
                      <option value="all">Tous niveaux</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                      Langue *
                    </label>
                    <select
                      id="language"
                      name="language"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="fr">Français</option>
                      <option value="en">Anglais</option>
                      <option value="es">Espagnol</option>
                      <option value="de">Allemand</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Image de couverture */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Image de couverture</h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Glissez-déposez une image ou cliquez pour parcourir
                  </p>
                  <p className="text-xs text-gray-500">
                    Format recommandé : 16:9, minimum 1920x1080px
                  </p>
                  <button
                    type="button"
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Choisir une image
                  </button>
                </div>
              </div>

              {/* Objectifs d'apprentissage */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Objectifs d'apprentissage</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Qu'est-ce que les étudiants seront capables de faire après votre cours ?
                </p>
                
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-gray-400">•</span>
                      <input
                        type="text"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Objectif ${index}`}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-blue-600 text-sm hover:text-blue-700"
                  >
                    + Ajouter un objectif
                  </button>
                </div>
              </div>

              {/* Prérequis */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Prérequis</h2>
                <p className="text-sm text-gray-600 mb-4">
                  De quoi les étudiants ont-ils besoin avant de commencer votre cours ?
                </p>
                
                <div className="space-y-3">
                  {[1, 2].map((index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-gray-400">•</span>
                      <input
                        type="text"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Prérequis ${index} (optionnel)`}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="text-blue-600 text-sm hover:text-blue-700"
                  >
                    + Ajouter un prérequis
                  </button>
                </div>
              </div>

              {/* Boutons de navigation */}
              <div className="flex justify-between">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Sauvegarder comme brouillon
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Continuer vers le curriculum
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Conseils pour réussir</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Video className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Vidéos de qualité</p>
                    <p className="text-xs text-gray-500">HD minimum, bon audio</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Contenu structuré</p>
                    <p className="text-xs text-gray-500">Organisez en sections logiques</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Engagement</p>
                    <p className="text-xs text-gray-500">Répondez aux questions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Durée optimale</p>
                    <p className="text-xs text-gray-500">2-5 heures au total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-4">Checklist de création</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-blue-600" />
                  <span className="text-sm text-blue-800">Titre accrocheur</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-blue-600" />
                  <span className="text-sm text-blue-800">Description détaillée</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-blue-600" />
                  <span className="text-sm text-blue-800">Image de couverture</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-blue-600" />
                  <span className="text-sm text-blue-800">Objectifs clairs</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-blue-600" />
                  <span className="text-sm text-blue-800">Prérequis définis</span>
                </label>
              </div>
            </div>

            {/* Aide */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Besoin d'aide ?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Notre équipe est là pour vous accompagner dans la création de votre cours.
              </p>
              <Link 
                href="/dashboard/professor/help"
                className="block w-full text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Centre d'aide formateur
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}