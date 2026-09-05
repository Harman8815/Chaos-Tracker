import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownMenuContext = React.createContext<{ open: boolean; onOpenChange: (open: boolean) => void }>({ open: false, onOpenChange: () => {} })

const DropdownMenu = ({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) => {
  return (
    <DropdownMenuContext.Provider value={{ open, onOpenChange }}>
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

const DropdownMenuTrigger = ({ children, asChild = false }: { children: React.ReactNode; asChild?: boolean }) => {
  const { onOpenChange } = React.useContext(DropdownMenuContext)
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>, {
      onClick: (e: React.MouseEvent) => {
        onOpenChange(true)
        if (children.props && typeof (children.props as any).onClick === 'function') {
          (children.props as any).onClick(e)
        }
      }
    })
  }
  return <button onClick={() => onOpenChange(true)}>{children}</button>
}

const DropdownMenuContent = ({ className, align = "center", children, ...props }: React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "center" | "end" }) => {
  const { open, onOpenChange } = React.useContext(DropdownMenuContext)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOpenChange(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] rounded-md border border-white/10 bg-[#1a1a1a] p-1 text-white shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const DropdownMenuItem = ({ className, onSelect, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { onSelect?: () => void }) => {
  const { onOpenChange } = React.useContext(DropdownMenuContext)
  return (
    <div
      className={cn("relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-white/[0.08] hover:text-white", className)}
      onClick={() => { onSelect?.(); onOpenChange(false) }}
      {...props}
    >
      {children}
    </div>
  )
}

const DropdownMenuSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("h-px bg-white/10 my-1", className)} {...props} />
)

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator }
export default DropdownMenu
