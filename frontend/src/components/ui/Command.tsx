import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

const Command = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-xl bg-[#1a1a1a] border border-white/10 shadow-[0_0_25px_rgba(124,58,237,0.25)] backdrop-blur-xl",
      className
    )}
    {...props}
  />
)

const CommandInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="flex items-center border-b border-white/10 px-3">
    <Search className="mr-2 h-4 w-4 shrink-0 text-[#a1a1aa]" />
    <input
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm text-white outline-none placeholder:text-[#a1a1aa] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
)

const CommandList = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden p-1", className)} {...props} />
)

const CommandEmpty = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("py-6 text-center text-sm text-[#e9d5ff]", className)} {...props} />
)

const CommandGroup = ({ className, heading, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { heading?: string }) => (
  <div className={cn("overflow-hidden p-1", className)} {...props}>
    {heading && <div className="px-2 py-1.5 text-xs font-medium text-text-secondary">{heading}</div>}
    {children}
  </div>
)

const CommandItem = ({ className, onSelect, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { onSelect?: () => void }) => {
  const [selected, setSelected] = React.useState(false)

  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "hover:bg-white/[0.08] hover:text-white",
        "data-[selected=true]:bg-accent-primary data-[selected=true]:text-white",
        className
      )}
      data-selected={selected}
      onClick={() => { setSelected(true); onSelect?.() }}
      {...props}
    >
      {children}
    </div>
  )
}

const CommandSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("h-px bg-white/10 mx-1 my-1", className)} {...props} />
)

export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator }
export default Command
