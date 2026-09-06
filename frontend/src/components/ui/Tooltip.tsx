import * as React from "react"
import { cn } from "@/lib/utils"
import { Info } from "lucide-react"

const TooltipContext = React.createContext<{ open: boolean }>({ open: false })

const Tooltip = ({ open, onOpenChange, children, content, side = "top", align = "center" }: { open?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode; content: React.ReactNode; side?: "top" | "right" | "bottom" | "left"; align?: "start" | "center" | "end" }) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isOpen = open ?? internalOpen
  const setIsOpen = onOpenChange ?? setInternalOpen

  const sideClasses: Record<string, string> = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  }

  return (
    <TooltipContext.Provider value={{ open: isOpen }}>
      <div className="relative inline-flex" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        {children}
        {isOpen && (
          <div className={cn("absolute z-50 max-w-xs rounded-md glass px-3 py-1.5 text-sm text-white shadow-md", sideClasses[side])}>
            {content}
          </div>
        )}
      </div>
    </TooltipContext.Provider>
  )
}

const TooltipTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>

const TooltipContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("", className)} {...props}>{children}</div>
)

export { Tooltip, TooltipTrigger, TooltipContent }
export default Tooltip

