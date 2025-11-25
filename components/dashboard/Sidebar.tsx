'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  DollarSign,
  BookOpen,
  Plane,
  Calendar,
  Building2,
  Sparkles,
  Bot,
  User,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Browse Schools', href: '/schools', icon: Building2 },
  { name: 'Applications', href: '/applications', icon: GraduationCap },
  { name: 'Visa Documents', href: '/visa', icon: FileText },
  { name: 'Finances', href: '/finances', icon: DollarSign },
  { name: 'Timeline', href: '/timeline', icon: Calendar },
  { name: 'AI Document Checker', href: '/document-checker', icon: Sparkles },
  { name: 'Visa Assistant', href: '/assistant', icon: Bot },
  { name: 'Information Hub', href: '/info', icon: BookOpen },
  { name: 'Post-Arrival', href: '/post-arrival', icon: Plane },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/login' })
  }

  return (
    <div className="hidden lg:flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center justify-between border-b px-4">
        <h1 className="text-xl font-bold">CanStudy Tracker</h1>
        <ThemeToggle />
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Profile Section */}
      <div className="border-t">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 w-full p-4 hover:bg-accent transition-colors"
          >
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="h-10 w-10 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
                <User className="h-5 w-5 text-primary" />
              </div>
            )}
            <div className="flex-1 text-left">
              <p className="text-sm font-medium truncate">
                {session?.user?.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session?.user?.email || ''}
              </p>
            </div>
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform',
                showDropdown && 'rotate-90'
              )}
            />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-2 mx-2 bg-card border rounded-lg shadow-lg">
              <Link
                href="/profile"
                onClick={() => setShowDropdown(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors rounded-t-lg',
                  pathname === '/profile' && 'bg-primary/10 text-primary'
                )}
              >
                <Settings className="h-4 w-4" />
                Profile Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full rounded-b-lg"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
