import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CreditCard, DollarSign, TrendingUp, TrendingDown, Calendar, Download, Filter, Search, ChevronUp, ChevronDown, MoreVertical, CheckCircle, XCircle, Clock, AlertCircle, RefreshCw, Receipt, ArrowUpRight, ArrowDownRight, Activity, Users, ShoppingCart, Package, Zap, FileText, Send, Eye } from 'lucide-react'
import Link from 'next/link'

export default async function AdminPaymentsPage() {
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

  // Récupérer les statistiques de paiement
  const { data: payments } = await supabase
    .from('payments')
    .select(`
      *,
      profiles:user_id(
        email,
        first_name,
        last_name
      ),
      courses:course_id(
        title,
        price
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  // Calculer les statistiques
  const totalRevenue = payments?.reduce((sum, payment) => 
    payment.status === 'succeeded' ? sum + payment.amount : sum, 0) || 0

  const monthlyRevenue = payments?.filter(payment => {
    const paymentDate = new Date(payment.created_at)
    const now = new Date()
    return paymentDate.getMonth() === now.getMonth() && 
           paymentDate.getFullYear() === now.getFullYear() &&
           payment.status === 'succeeded'
  }).reduce((sum, payment) => sum + payment.amount, 0) || 0

  const pendingPayments = payments?.filter(p => p.status === 'pending').length || 0
  const failedPayments = payments?.filter(p => p.status === 'failed').length || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gestion des Paiements</h1>
          <p className="text-muted-foreground">
            Gérez les transactions, remboursements et rapports financiers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-green-600" />
              <span className="flex items-center text-sm text-green-600 font-medium">
                <TrendingUp className="h-4 w-4 mr-1" />
                +18.2%
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(totalRevenue / 100)}
            </div>
            <div className="text-sm text-muted-foreground">Revenus Totaux</div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="flex items-center text-sm text-green-600 font-medium">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12.5%
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(monthlyRevenue / 100)}
            </div>
            <div className="text-sm text-muted-foreground">Revenus ce mois</div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-yellow-600" />
              <span className="text-sm text-yellow-600 font-medium">{pendingPayments}</span>
            </div>
            <div className="text-2xl font-bold mb-1">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(2450)}
            </div>
            <div className="text-sm text-muted-foreground">En attente</div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <div className="flex items-center justify-between mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
              <span className="text-sm text-red-600 font-medium">{failedPayments}</span>
            </div>
            <div className="text-2xl font-bold mb-1">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(890)}
            </div>
            <div className="text-sm text-muted-foreground">Échoués</div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-card rounded-lg p-6 border mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Évolution des Revenus
            </h2>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-sm border rounded-lg hover:bg-accent">
                7 jours
              </button>
              <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-lg">
                30 jours
              </button>
              <button className="px-3 py-1 text-sm border rounded-lg hover:bg-accent">
                12 mois
              </button>
            </div>
          </div>
          
          {/* Simplified Chart Representation */}
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 80, 45, 90, 70, 85, 60, 95, 75, 88, 92, 78, 85, 90, 88, 95, 100, 92, 88, 95, 90, 87, 92, 95, 98, 88, 92, 95, 97, 100].map((height, index) => (
              <div key={index} className="flex-1 bg-primary/20 hover:bg-primary/30 rounded-t transition-colors relative group">
                <div 
                  className="bg-primary rounded-t transition-all"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card border rounded px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {Math.floor(Math.random() * 5000 + 1000)}€
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <span>1 Jan</span>
            <span>8 Jan</span>
            <span>15 Jan</span>
            <span>22 Jan</span>
            <span>31 Jan</span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-lg p-4 mb-6 border">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher par ID, email, cours..."
                  className="w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <select className="px-4 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Tous les statuts</option>
                <option>Réussi</option>
                <option>En attente</option>
                <option>Échoué</option>
                <option>Remboursé</option>
              </select>
              <button className="px-4 py-2 border rounded-lg hover:bg-accent flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Plus de filtres
              </button>
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <button className="px-4 py-2 border rounded-lg hover:bg-accent flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-accent flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">ID Transaction</th>
                  <th className="text-left p-4 font-medium">Client</th>
                  <th className="text-left p-4 font-medium">Cours</th>
                  <th className="text-left p-4 font-medium">Montant</th>
                  <th className="text-left p-4 font-medium">Statut</th>
                  <th className="text-left p-4 font-medium">Méthode</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments?.slice(0, 10).map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="font-mono text-sm">
                        {payment.stripe_payment_intent_id?.slice(-8) || payment.id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">
                          {payment.profiles?.first_name && payment.profiles?.last_name
                            ? `${payment.profiles.first_name} ${payment.profiles.last_name}`
                            : 'Client'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {payment.profiles?.email || 'email@example.com'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        {payment.courses?.title || 'Cours'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR'
                        }).format(payment.amount / 100)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'succeeded'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : payment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : payment.status === 'failed'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {payment.status === 'succeeded' && <CheckCircle className="h-3 w-3" />}
                        {payment.status === 'pending' && <Clock className="h-3 w-3" />}
                        {payment.status === 'failed' && <XCircle className="h-3 w-3" />}
                        {payment.status === 'succeeded' ? 'Réussi' 
                          : payment.status === 'pending' ? 'En attente'
                          : payment.status === 'failed' ? 'Échoué'
                          : payment.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Carte</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-muted-foreground">
                        {new Date(payment.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Receipt className="h-4 w-4" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Affichage de 1 à 10 sur {payments?.length || 0} transactions
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border rounded hover:bg-accent disabled:opacity-50" disabled>
                  Précédent
                </button>
                <button className="px-3 py-1 bg-primary text-primary-foreground rounded">
                  1
                </button>
                <button className="px-3 py-1 border rounded hover:bg-accent">
                  2
                </button>
                <button className="px-3 py-1 border rounded hover:bg-accent">
                  3
                </button>
                <button className="px-3 py-1 border rounded hover:bg-accent">
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Cours Vendus
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm truncate">Formation React Avancée</span>
                <span className="text-sm font-medium">142 ventes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm truncate">Marketing Digital Pro</span>
                <span className="text-sm font-medium">98 ventes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm truncate">Python pour Data Science</span>
                <span className="text-sm font-medium">87 ventes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm truncate">Design System avec Figma</span>
                <span className="text-sm font-medium">76 ventes</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Meilleurs Clients
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm truncate">Marie Dupont</span>
                <span className="text-sm font-medium">1,250€</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm truncate">Thomas Martin</span>
                <span className="text-sm font-medium">980€</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm truncate">Sophie Bernard</span>
                <span className="text-sm font-medium">875€</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm truncate">Lucas Petit</span>
                <span className="text-sm font-medium">650€</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Actions Rapides
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-sm flex items-center justify-between">
                <span>Générer un rapport mensuel</span>
                <FileText className="h-4 w-4" />
              </button>
              <button className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-sm flex items-center justify-between">
                <span>Envoyer les factures</span>
                <Send className="h-4 w-4" />
              </button>
              <button className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-sm flex items-center justify-between">
                <span>Exporter la comptabilité</span>
                <Download className="h-4 w-4" />
              </button>
              <button className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors text-sm flex items-center justify-between">
                <span>Configurer Stripe</span>
                <CreditCard className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}