"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/Command"
import { usePathname, useRouter } from "next/navigation"
import { Home, LayoutDashboard, Target, Calendar, Wallet, BookOpen, Smile, Droplets, Footprints, Star, Trophy, Quote, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/Button"

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
]

const actions = [
  { name: 'Settings', icon: Settings, href: '/profile' },
  { name: 'Profile', icon: User, href: '/profile' },
]

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[20%] z-50 w-full max-w-xl -translate-x-1/2">
            <Command>
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Navigation">
                  {navItems.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => runCommand(item.href)}
                      className="flex items-center gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                      {pathname === item.href && (
                        <span className="ml-auto text-xs text-accent-primary">Current</span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Actions">
                  {actions.map((action) => (
                    <CommandItem
                      key={action.name}
                      onSelect={() => runCommand(action.href)}
                      className="flex items-center gap-2"
                    >
                      <action.icon className="h-4 w-4" />
                      <span>{action.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  )
}
