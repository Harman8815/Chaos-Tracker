import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{ value: string; onValueChange: (value: string) => void }>({ value: "", onValueChange: () => {} })

const Tabs = ({ value, onValueChange, children, className }: { value: string; onValueChange: (value: string) => void; children: React.ReactNode; className?: string }) => (
  <TabsContext.Provider value={{ value, onValueChange }}>
    <div className={cn("", className)}>{children}</div>
  </TabsContext.Provider>
)

const TabsList = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-lg bg-white/[0.06] p-1 text-text-secondary", className)} {...props} />
)

const TabsTrigger = ({ value, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) => {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext)
  const isSelected = selectedValue === value

  return (
    <button
      data-state={isSelected ? "active" : "inactive"}
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary disabled:pointer-events-none disabled:opacity-50",
        isSelected ? "bg-white/[0.1] text-white shadow-sm" : "hover:bg-white/[0.04] hover:text-white",
        className
      )}
      {...props}
    />
  )
}

const TabsContent = ({ value, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string }) => {
  const { value: selectedValue } = React.useContext(TabsContext)
  if (selectedValue !== value) return null

  return (
    <div
      data-state={selectedValue === value ? "active" : "inactive"}
      className={cn("mt-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
export default Tabs

