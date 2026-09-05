import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-9 w-full appearance-none rounded-md border border-white/10 bg-white/[0.06] px-3 py-1 text-sm text-white shadow-sm transition-colors",
          "placeholder:text-text-tertiary",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
      <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-text-secondary pointer-events-none" />
    </div>
  )
})
Select.displayName = "Select"

export { Select }
export default Select

