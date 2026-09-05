import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Sheet = ({ open, onOpenChange, children, side = "right" }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode; side?: "top" | "right" | "bottom" | "left" }) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const sideClasses: Record<string, string> = {
    top: "inset-x-0 top-0 border-b",
    bottom: "inset-x-0 bottom-0 border-t",
    left: "inset-y-0 left-0 border-r",
    right: "inset-y-0 right-0 border-l",
  }

  const positionClasses: Record<string, string> = {
    top: "w-full",
    bottom: "w-full",
    left: "h-full",
    right: "h-full",
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
      <div className={cn("fixed z-50 bg-[#1a1a1a] border-white/10 shadow-[0_0_25px_rgba(124,58,237,0.25)] backdrop-blur-xl transition-transform duration-300", sideClasses[side], positionClasses[side])}>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  )
}

const SheetContent = ({ className, side = "right", ...props }: React.HTMLAttributes<HTMLDivElement> & { side?: "top" | "right" | "bottom" | "left" }) => (
  <div className={cn("", className)} {...props} />
)

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 p-4", className)} {...props} />
)

const SheetTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn("text-lg font-semibold text-white", className)} {...props} />
)

const SheetDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-text-secondary", className)} {...props} />
)

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-4", className)} {...props} />
)

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter }
export default Sheet

