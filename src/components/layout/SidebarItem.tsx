import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import type { SidebarItemData } from "@/types/navigation"

type SidebarItemProps = {
  item: SidebarItemData
  isActive: boolean
  onSelect: (path: string) => void
  showChevron?: boolean
}

export function SidebarItem({
  item,
  isActive,
  onSelect,
  showChevron = true,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      onClick={() => onSelect(item.path)}
      className={cn(
        "group flex h-8 w-full items-center justify-between rounded-md px-2.5 text-left text-sm transition-colors duration-200",
        isActive
          ? "bg-zinc-100 text-zinc-950 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-100/[0.08] dark:text-zinc-50 dark:ring-white/10"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.045] dark:hover:text-zinc-100",
      )}
    >
      <span className="truncate font-mono text-[13px]">{item.label}</span>
      {showChevron ? (
        <ChevronRight
          className={cn(
            "size-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-60",
            isActive && "opacity-70",
          )}
          aria-hidden="true"
        />
      ) : null}
    </button>
  )
}
