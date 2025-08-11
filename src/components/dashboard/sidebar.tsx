'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  BookOpen, 
  Users, 
  Calendar, 
  MessageSquare,
  Trophy,
  Settings,
  BarChart,
  GraduationCap,
  DollarSign,
  Shield,
  FolderOpen,
  Video,
  FileText,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  role: 'client' | 'professor' | 'admin'
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()

  const navigationItems = {
    client: [
      { name: 'Accueil', href: '/dashboard', icon: Home },
      { name: 'Mes Cours', href: '/dashboard/courses', icon: BookOpen },
      { name: 'Progression', href: '/dashboard/progress', icon: Trophy },
      { name: 'Certificats', href: '/dashboard/certificates', icon: Award },
      { name: 'Événements', href: '/dashboard/events', icon: Calendar },
      { name: 'Forum', href: '/dashboard/forum', icon: MessageSquare },
      { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
    ],
    professor: [
      { name: 'Accueil', href: '/dashboard', icon: Home },
      { name: 'Mes Cours', href: '/dashboard/professor/courses', icon: Video },
      { name: 'Créer un Cours', href: '/dashboard/professor/create', icon: FolderOpen },
      { name: 'Étudiants', href: '/dashboard/professor/students', icon: Users },
      { name: 'Ressources', href: '/dashboard/professor/resources', icon: FileText },
      { name: 'Statistiques', href: '/dashboard/professor/analytics', icon: BarChart },
      { name: 'Revenus', href: '/dashboard/professor/earnings', icon: DollarSign },
      { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
    ],
    admin: [
      { name: 'Accueil', href: '/dashboard', icon: Home },
      { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart },
      { name: 'Utilisateurs', href: '/dashboard/admin/users', icon: Users },
      { name: 'Cours', href: '/dashboard/admin/courses', icon: BookOpen },
      { name: 'Formateurs', href: '/dashboard/admin/professors', icon: GraduationCap },
      { name: 'Paiements', href: '/dashboard/admin/payments', icon: DollarSign },
      { name: 'Sécurité', href: '/dashboard/admin/security', icon: Shield },
      { name: 'Événements', href: '/dashboard/admin/events', icon: Calendar },
      { name: 'Forum', href: '/dashboard/admin/forum', icon: MessageSquare },
      { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
    ],
  }

  const items = navigationItems[role]

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">ScaleUp Academy</span>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn(
                'mr-3 h-5 w-5 flex-shrink-0',
                isActive ? 'text-blue-700' : 'text-gray-400'
              )} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center px-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gray-300" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">
              {role === 'admin' ? 'Administrateur' : 
               role === 'professor' ? 'Formateur' : 'Étudiant'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}