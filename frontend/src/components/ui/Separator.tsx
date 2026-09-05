import { cn } from "@/lib/utils"

const Separator = ({ className, orientation = "horizontal", ...props }: React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }) => (
  <div
    role="none"
    data-orientation={orientation}
    className={cn("shrink-0 bg-white/10", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className)}
    {...props}
  />
)

export { Separator }
export default Separator
