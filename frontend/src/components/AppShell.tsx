"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutDashboard, Target, Calendar, Wallet, BookOpen, Smile, Droplets, Footprints, Star, Trophy, Quote, Menu, Settings, User, Activity } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/Sheet"
import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/Separator"
import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { CommandPalette } from "@/components/CommandPalette"
import { SettingsContext } from "@/context/SettingsContext"
import { DataContext } from "@/context/DataContext"

const navItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { id: 'goals', name: 'Goals', icon: Target, href: '/goals' },
  { id: 'planner', name: 'Planner', icon: Calendar, href: '/planner' },
  { id: 'expense', name: 'Expenses', icon: Wallet, href: '/expense' },
  { id: 'home', name: 'Home', icon: Home, href: '/' },
  { id: 'journal', name: 'Journal', icon: BookOpen, href: '/journal' },
  { id: 'points', name: 'Points', icon: Star, href: '/points' },
  { id: 'achievements', name: 'Achievements', icon: Trophy, href: '/achievements' },
  { id: 'quotes', name: 'Quotes', icon: Quote, href: '/quotes' },
  { id: 'habits', name: 'Habits', icon: Activity, href: '/habits' },
  { id: 'mood', name: 'Mood', icon: Smile, href: '/mood' },
  { id: 'water', name: 'Water', icon: Droplets, href: '/water' },
]

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const pathname = usePathname()
  const { userProfile } = React.useContext(DataContext)
  const { setIsSettingsModalOpen } = React.useContext(SettingsContext)

  return (
    <div className="flex h-screen bg-background text-text-primary">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar-bg">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold text-white">Chaos Tracker</h1>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/[0.1] text-white'
                    : 'text-text-secondary hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-border p-2 space-y-1">
          <Link href="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-white/[0.05] hover:text-white transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{getInitials(userProfile?.name || 'GU')}</AvatarFallback>
            </Avatar>
            <span className="truncate">{userProfile?.name || 'Guest'}</span>
          </Link>
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-white/[0.05] hover:text-white transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-1 flex-col md:hidden">
        <header className="flex items-center justify-between border-b border-border bg-sidebar-bg px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-white">Chaos Tracker</h1>
          <div className="w-9" />
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Desktop Main Content */}
      <div className="hidden md:flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-sidebar-bg px-6 py-3">
          <CommandPalette />
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback>{getInitials(userProfile?.name || 'GU')}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Navigation Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 bg-sidebar-bg p-0">
          <SheetHeader className="p-4">
            <SheetTitle className="text-white">Chaos Tracker</SheetTitle>
            <SheetDescription className="text-text-secondary">
              Navigate your tracker
            </SheetDescription>
          </SheetHeader>
          <Separator />
          <nav className="flex-1 space-y-1 p-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/[0.1] text-white'
                      : 'text-text-secondary hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <Separator />
          <div className="border-t border-border p-2 space-y-1">
            <Link
              href="/profile"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-white/[0.05] hover:text-white transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(userProfile?.name || 'GU')}</AvatarFallback>
              </Avatar>
              <span className="truncate">{userProfile?.name || 'Guest'}</span>
            </Link>
            <button
              onClick={() => { setIsSettingsModalOpen(true); setSidebarOpen(false) }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary hover:bg-white/[0.05] hover:text-white transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

