'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  Menu,
  X,
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
} from 'lucide-react'
import { cn } from '@/lib/utils'
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

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/login' })
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b bg-card px-4 h-16">
        <h1 className="text-lg font-bold">CanStudy Tracker</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          'lg:hidden fixed top-16 right-0 bottom-0 z-40 w-64 bg-card border-l transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto h-[calc(100vh-8rem)]">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
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
        <div className="absolute bottom-0 left-0 right-0 border-t bg-card">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
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
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session?.user?.email || ''}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors',
                  pathname === '/profile' && 'bg-primary/10 text-primary'
                )}
              >
                <Settings className="h-4 w-4" />
                Profile Settings
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false)
                  handleSignOut()
                }}
                className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors w-full rounded-lg"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
