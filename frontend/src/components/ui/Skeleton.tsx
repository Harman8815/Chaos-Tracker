import { cn } from "@/lib/utils"

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("animate-pulse rounded-md bg-white/[0.06]", className)}
    {...props}
  />
)

export { Skeleton }
export default Skeleton
