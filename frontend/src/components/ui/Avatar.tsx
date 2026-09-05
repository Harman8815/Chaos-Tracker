import * as React from "react"
import { cn } from "@/lib/utils"

const AvatarContext = React.createContext<{ initials?: string }>({})

const Avatar = ({ className, children, initials, ...props }: React.HTMLAttributes<HTMLDivElement> & { initials?: string }) => (
  <AvatarContext.Provider value={{ initials }}>
    <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props}>
      {children}
    </div>
  </AvatarContext.Provider>
)

const AvatarImage = ({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img className={cn("aspect-square h-full w-full", className)} {...props} />
)

const AvatarFallback = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { initials } = React.useContext(AvatarContext)
  return (
    <div className={cn("flex h-full w-full items-center justify-center rounded-full bg-accent-primary text-white font-medium", className)} {...props}>
      {children ?? initials}
    </div>
  )
}

export { Avatar, AvatarImage, AvatarFallback }
export default Avatar

