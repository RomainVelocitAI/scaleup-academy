import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DollarSign, TrendingUp, CreditCard, Download, Calendar, ArrowUpRight, ArrowDownRight, Clock, Users, BookOpen, AlertCircle, CheckCircle, XCircle, FileText, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function ProfessorEarningsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Vérifier que l'utilisateur est bien un formateur
  // TODO: Ajouter la vérification du rôle depuis la base de données

  // Données simulées
  const currentBalance = 3456.78
  const monthlyEarnings = 1234.56
  const totalEarnings = 15678.90
  const pendingEarnings = 456.78

  const transactions = [
    {
      id: '1',
      date: '2024-02-15',
      description: 'Vente du cours React de A à Z',
      student: 'Marie L.',
      amount: 49.99,
      status: 'completed',
      commission: 7.50,
      net: 42.49
    },
    {
      id: '2',
      date: '2024-02-14',
      description: 'Vente du cours TypeScript Avancé',
      student: 'Thomas R.',
      amount: 79.99,
      status: 'completed',
      commission: 12.00,
      net: 67.99
    },
    {
      id: '3',
      date: '2024-02-14',
      description: 'Vente du cours JavaScript Moderne',
      student: 'Sophie M.',
      amount: 39.99,
      status: 'pending',
      commission: 6.00,
      net: 33.99
    },
    {
      id: '4',
      date: '2024-02-13',
      description: 'Vente du cours Node.js Backend',
      student: 'Lucas P.',
      amount: 89.99,
      status: 'completed',
      commission: 13.50,
      net: 76.49
    },
    {
      id: '5',
      date: '2024-02-12',
      description: 'Remboursement - React de A à Z',
      student: 'Alex D.',
      amount: -49.99,
      status: 'refunded',
      commission: -7.50,
      net: -42.49
    }
  ]

  const monthlyData = [
    { month: 'Jan', earnings: 2345.67, sales: 45 },
    { month: 'Fév', earnings: 3456.78, sales: 67 },
    { month: 'Mar', earnings: 2890.12, sales: 52 },
    { month: 'Avr', earnings: 4123.45, sales: 78 },
    { month: 'Mai', earnings: 3678.90, sales: 71 },
    { month: 'Juin', earnings: 4567.89, sales: 89 }
  ]

  const topCourses = [
    { title: 'React de A à Z', sales: 234, revenue: 11699.66 },
    { title: 'TypeScript Avancé', sales: 156, revenue: 12478.44 },
    { title: 'JavaScript Moderne', sales: 189, revenue: 7558.11 },
    { title: 'Node.js Backend', sales: 98, revenue: 8819.02 }
  ]

  const payoutMethods = [
    { type: 'bank', name: 'Compte bancaire', last4: '4567', default: true },
    { type: 'paypal', name: 'PayPal', email: 'formateur@example.com', default: false }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes revenus</h1>
              <p className="text-gray-600">Suivez vos gains et gérez vos paiements</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </button>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Solde disponible</p>
                <p className="text-2xl font-bold text-gray-900">{currentBalance.toFixed(2)}€</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <button className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
              Demander un virement
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ce mois-ci</p>
                <p className="text-2xl font-bold text-gray-900">{monthlyEarnings.toFixed(2)}€</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +15% vs mois dernier
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total des gains</p>
                <p className="text-2xl font-bold text-gray-900">{totalEarnings.toFixed(2)}€</p>
                <p className="text-xs text-gray-500 mt-1">Depuis le début</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{pendingEarnings.toFixed(2)}€</p>
                <p className="text-xs text-gray-500 mt-1">7-14 jours</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Graphique et transactions - 2 colonnes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Graphique des revenus */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Évolution des revenus</h2>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">6 mois</button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">1 an</button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Tout</button>
                </div>
              </div>

              <div className="h-64 flex items-end justify-between space-x-4">
                {monthlyData.map((month, index) => (
                  <div key={index} className="flex-1">
                    <div className="text-center mb-2">
                      <p className="text-xs font-medium text-gray-700">{month.earnings.toFixed(0)}€</p>
                      <p className="text-xs text-gray-500">{month.sales} ventes</p>
                    </div>
                    <div 
                      className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-colors cursor-pointer"
                      style={{ height: `${(month.earnings / 5000) * 200}px` }}
                    />
                    <p className="text-center text-sm text-gray-600 mt-2">{month.month}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions récentes */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Transactions récentes</h2>
                  <Link href="/dashboard/professor/transactions" className="text-sm text-blue-600 hover:text-blue-700">
                    Voir tout →
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commission
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Net
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-xs text-gray-500">{transaction.student}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}€
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {Math.abs(transaction.commission).toFixed(2)}€
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-medium ${
                            transaction.net > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.net > 0 ? '+' : ''}{transaction.net.toFixed(2)}€
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {transaction.status === 'completed' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complété
                            </span>
                          )}
                          {transaction.status === 'pending' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="h-3 w-3 mr-1" />
                              En attente
                            </span>
                          )}
                          {transaction.status === 'refunded' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              Remboursé
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top cours */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Cours les plus rentables</h3>
              <div className="space-y-4">
                {topCourses.map((course, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{course.title}</p>
                      <span className="text-sm font-medium text-gray-900">{course.revenue.toFixed(2)}€</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(course.revenue / 15000) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{course.sales} ventes</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Méthodes de paiement */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Méthodes de paiement</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700">Gérer</button>
              </div>
              <div className="space-y-3">
                {payoutMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{method.name}</p>
                        <p className="text-xs text-gray-500">
                          {method.last4 ? `•••• ${method.last4}` : method.email}
                        </p>
                      </div>
                    </div>
                    {method.default && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Par défaut</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Prochains paiements */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="font-semibold mb-4">Prochain paiement</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-3xl font-bold">{currentBalance.toFixed(2)}€</p>
                  <p className="text-blue-100 text-sm mt-1">Disponible pour retrait</p>
                </div>
                <div className="pt-3 border-t border-blue-400 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Date de paiement</span>
                    <span>1er Mars 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Méthode</span>
                    <span>Compte •••• 4567</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium">
                  Demander maintenant
                </button>
              </div>
            </div>

            {/* Documents fiscaux */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Documents fiscaux</h3>
              <div className="space-y-2">
                <Link href="/dashboard/professor/invoices" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">Factures 2024</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
                <Link href="/dashboard/professor/tax-forms" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">Déclarations fiscales</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              </div>
            </div>

            {/* Info commission */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-900">Commission plateforme</h4>
                  <p className="text-xs text-yellow-700 mt-1">
                    ScaleUp Academy prélève une commission de 15% sur chaque vente pour couvrir les frais de plateforme, 
                    le support client et le marketing.
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