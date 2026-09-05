import * as React from "react"
import { cn } from "@/lib/utils"

const ScrollArea = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault()
        el.scrollTop += e.deltaY
      }
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <div ref={ref} className={cn("relative overflow-auto", className)} {...props}>
      {children}
    </div>
  )
}

export { ScrollArea }
export default ScrollArea

