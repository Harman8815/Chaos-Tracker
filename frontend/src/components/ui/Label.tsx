import * as React from "react"
import { cn } from "@/lib/utils"

const Label = ({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label className={cn("text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
)

export { Label }
export default Label

