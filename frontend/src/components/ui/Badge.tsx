import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent-primary text-white hover:bg-accent-primary-hover",
        secondary: "border-transparent bg-white/[0.1] text-white hover:bg-white/[0.15]",
        destructive: "border-transparent bg-error text-white hover:bg-error/90",
        outline: "text-white border-white/20",
        success: "border-transparent bg-success text-white",
        warning: "border-transparent bg-warning text-white",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-0.5",
        lg: "text-base px-4 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size, className }))} {...props} />
}

export { Badge, badgeVariants }
export default Badge

