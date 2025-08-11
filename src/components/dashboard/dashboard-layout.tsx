import { ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { Bell, Search } from 'lucide-react'

interface DashboardLayoutProps {
  children: ReactNode
  role: 'client' | 'professor' | 'admin'
  userName?: string
  userEmail?: string
}

export function DashboardLayout({ 
  children, 
  role, 
  userName, 
  userEmail 
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={role} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center flex-1">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{userName || userEmail}</p>
                  <p className="text-xs text-gray-500">
                    {role === 'admin' ? 'Administrateur' : 
                     role === 'professor' ? 'Formateur' : 'Étudiant'}
                  </p>
                </div>
                <SignOutButton />
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}