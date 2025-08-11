import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Settings, Globe, Mail, Shield, CreditCard, Database, Bell, Palette, Code, Key, Save, RefreshCw, AlertCircle, Check, X, Info, Zap, Lock, Users, FileText, MessageSquare, HelpCircle, ExternalLink, Download, Upload, Copy, Eye, EyeOff } from 'lucide-react'

export default async function AdminSettingsPage() {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Paramètres du Site</h1>
          <p className="text-muted-foreground">
            Gérez les paramètres et la configuration de votre plateforme
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="border-b mb-8">
          <nav className="flex space-x-8">
            <button className="pb-4 border-b-2 border-primary font-medium">
              Général
            </button>
            <button className="pb-4 text-muted-foreground hover:text-foreground">
              Sécurité
            </button>
            <button className="pb-4 text-muted-foreground hover:text-foreground">
              Paiements
            </button>
            <button className="pb-4 text-muted-foreground hover:text-foreground">
              Emails
            </button>
            <button className="pb-4 text-muted-foreground hover:text-foreground">
              Intégrations
            </button>
            <button className="pb-4 text-muted-foreground hover:text-foreground">
              Avancé
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Site Information */}
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Informations du Site
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nom du site
                  </label>
                  <input
                    type="text"
                    defaultValue="ScaleUp Academy"
                    className="w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    URL du site
                  </label>
                  <input
                    type="text"
                    defaultValue="https://scaleupacademy.com"
                    className="w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Plateforme de formation en ligne pour entrepreneurs et professionnels"
                    className="w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    defaultValue="contact@scaleupacademy.com"
                    className="w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fuseau horaire
                  </label>
                  <select className="w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Europe/Paris (UTC+1)</option>
                    <option>Europe/London (UTC+0)</option>
                    <option>America/New_York (UTC-5)</option>
                    <option>Asia/Tokyo (UTC+9)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Localization */}
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Localisation
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Langue par défaut
                  </label>
                  <select className="w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Français</option>
                    <option>English</option>
                    <option>Español</option>
                    <option>Deutsch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Format de date
                  </label>
                  <select className="w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Devise
                  </label>
                  <select className="w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>EUR (€)</option>
                    <option>USD ($)</option>
                    <option>GBP (£)</option>
                    <option>CHF (CHF)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Fonctionnalités
              </h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <div>
                      <div className="font-medium">Inscriptions ouvertes</div>
                      <div className="text-sm text-muted-foreground">Permettre aux nouveaux utilisateurs de s'inscrire</div>
                    </div>
                  </div>
                </label>
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <div>
                      <div className="font-medium">Vérification email obligatoire</div>
                      <div className="text-sm text-muted-foreground">Les utilisateurs doivent vérifier leur email</div>
                    </div>
                  </div>
                </label>
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <div>
                      <div className="font-medium">Commentaires activés</div>
                      <div className="text-sm text-muted-foreground">Permettre les commentaires sur les cours</div>
                    </div>
                  </div>
                </label>
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <div>
                      <div className="font-medium">Certificats de complétion</div>
                      <div className="text-sm text-muted-foreground">Générer des certificats pour les cours terminés</div>
                    </div>
                  </div>
                </label>
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    <div>
                      <div className="font-medium">Mode maintenance</div>
                      <div className="text-sm text-muted-foreground">Mettre le site en maintenance</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Code className="h-5 w-5" />
                SEO & Meta
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Meta titre par défaut
                  </label>
                  <input
                    type="text"
                    defaultValue="ScaleUp Academy - Formation en ligne pour entrepreneurs"
                    className="w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Meta description
                  </label>
                  <textarea
                    rows={2}
                    defaultValue="Développez vos compétences avec nos formations en ligne. Cours pratiques pour entrepreneurs et professionnels."
                    className="w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Mots-clés
                  </label>
                  <input
                    type="text"
                    defaultValue="formation, e-learning, entrepreneuriat, business, développement"
                    className="w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-3 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <button className="px-6 py-2 border rounded-lg hover:bg-accent">
                Annuler
              </button>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2">
                <Save className="h-4 w-4" />
                Enregistrer les modifications
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Status */}
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                État du Système
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Version</span>
                  <span className="text-sm font-medium">1.2.4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Base de données</span>
                  <span className="flex items-center gap-1 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600">Connectée</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cache</span>
                  <span className="flex items-center gap-1 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600">Actif</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email</span>
                  <span className="flex items-center gap-1 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600">Configuré</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Stockage</span>
                  <span className="text-sm font-medium">45% utilisé</span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 border rounded-lg hover:bg-accent flex items-center justify-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Vider le cache
              </button>
            </div>

            {/* Backup */}
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Database className="h-5 w-5" />
                Sauvegardes
              </h3>
              <div className="space-y-3 mb-4">
                <div className="text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">Dernière sauvegarde</span>
                  </div>
                  <div className="font-medium">18 Fév 2024, 03:00</div>
                </div>
                <div className="text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-muted-foreground">Prochaine sauvegarde</span>
                  </div>
                  <div className="font-medium">19 Fév 2024, 03:00</div>
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 border rounded-lg hover:bg-accent flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />
                  Télécharger la sauvegarde
                </button>
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2">
                  <Upload className="h-4 w-4" />
                  Sauvegarder maintenant
                </button>
              </div>
            </div>

            {/* API Keys */}
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Key className="h-5 w-5" />
                Clés API
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Clé publique</span>
                    <button className="p-1 hover:bg-accent rounded">
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="px-3 py-2 bg-muted rounded text-xs font-mono truncate">
                    pk_live_51Abc...xyz
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Clé secrète</span>
                    <button className="p-1 hover:bg-accent rounded">
                      <Eye className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="px-3 py-2 bg-muted rounded text-xs font-mono truncate">
                    ••••••••••••••••
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 border rounded-lg hover:bg-accent text-sm">
                Régénérer les clés
              </button>
            </div>

            {/* Help */}
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Aide & Support
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-sm flex items-center justify-between">
                  <span>Documentation</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-sm flex items-center justify-between">
                  <span>Guides vidéo</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-sm flex items-center justify-between">
                  <span>Centre d'aide</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
                <button className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-sm flex items-center justify-between">
                  <span>Contacter le support</span>
                  <MessageSquare className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Zone sensible
                  </h4>
                  <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                    Les modifications apportées ici affectent l'ensemble du site. Assurez-vous de sauvegarder avant tout changement important.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}