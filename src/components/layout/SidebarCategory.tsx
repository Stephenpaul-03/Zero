import { ChevronDown } from "lucide-react"

import { SidebarItem } from "@/components/layout/SidebarItem"
import { cn } from "@/lib/utils"
import { getCategoryIcon } from "@/lib/category-icons"
import type { SidebarCategoryData } from "@/types/navigation"

type SidebarCategoryProps = {
  category: SidebarCategoryData
  activePath: string
  onSelectItem: (path: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function SidebarCategory({
  category,
  activePath,
  onSelectItem,
  isOpen,
  onToggle,
}: SidebarCategoryProps) {
  const hasActiveChild = category.items.some((item) => item.path === activePath)
  const CategoryIcon = getCategoryIcon(category.icon)
  const contentId = `sidebar-category-${category.title
    .toLowerCase()
    .replace(/\s+/g, "-")}`

  return (
    <section className="space-y-1.5">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        className={cn(
          "flex h-8 w-full min-w-0 items-center gap-2 rounded-md px-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-200",
          hasActiveChild
            ? "bg-zinc-100 text-zinc-950 ring-1 ring-inset ring-zinc-200 dark:bg-white/[0.07] dark:text-zinc-50 dark:ring-white/10"
            : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-white/[0.035] dark:hover:text-zinc-300",
        )}
      >
        <CategoryIcon className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate whitespace-nowrap text-left">{category.title}</span>
        <span className="shrink-0 rounded-full border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 text-[10px] leading-none tracking-normal text-zinc-500 dark:border-white/[0.08] dark:bg-white/[0.035]">
          {category.items.length}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-200",
            !isOpen && "-rotate-90",
          )}
          aria-hidden="true"
        />
      </button>

      <div
        id={contentId}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="ml-4 space-y-1 border-l border-zinc-200 pl-3 dark:border-white/[0.1]">
            {category.items.map((item) => (
              <div
                key={item.path}
                className="relative before:absolute before:-left-3 before:top-4 before:h-px before:w-3 before:bg-zinc-200 dark:before:bg-white/[0.1]"
              >
                <SidebarItem
                  item={item}
                  isActive={activePath === item.path}
                  onSelect={onSelectItem}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
