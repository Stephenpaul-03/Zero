import { useEffect, useMemo, useState, type CSSProperties } from "react"
import { ChevronsDown, ChevronsUp, Home, Play } from "lucide-react"

import { SidebarCategory } from "@/components/layout/SidebarCategory"
import { cn } from "@/lib/utils"
import type { SidebarCategoryData } from "@/types/navigation"

type SidebarProps = {
  categories: SidebarCategoryData[]
  activePath: string
  onSelectItem: (path: string) => void
  isCollapsed: boolean
  continueReadingPath?: string
}

export function Sidebar({
  categories,
  activePath,
  onSelectItem,
  isCollapsed,
  continueReadingPath,
}: SidebarProps) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set(categories.map((category) => category.id || category.title)),
  )

  useEffect(() => {
    if (categories.length === 0) return
    setOpenCategories(new Set(categories.map((category) => category.id || category.title)))
  }, [categories])

  useEffect(() => {
    const activeCategory = categories.find((category) =>
      category.items.some((item) => item.path === activePath),
    )
    if (!activeCategory) return

    setOpenCategories((current) => {
      if (current.has(activeCategory.id || activeCategory.title)) return current
      const next = new Set(current)
      next.add(activeCategory.id || activeCategory.title)
      return next
    })
  }, [activePath, categories])

  const sidebarWidth = useMemo(() => {
    const labels = categories.flatMap((category) => [
      category.title,
      ...category.items.map((item) => item.label),
    ])
    const longestLabel = labels.reduce((longest, label) => Math.max(longest, label.length), 0)
    return Math.min(336, Math.max(220, Math.min(longestLabel, 30) * 8 + 96))
  }, [categories])

  const allExpanded = categories.length > 0
    && categories.every((category) => openCategories.has(category.id || category.title))

  function toggleAllCategories() {
    setOpenCategories(
      allExpanded
        ? new Set()
        : new Set(categories.map((category) => category.id || category.title)),
    )
  }

  const sidebarStyle = {
    "--sidebar-width": `${sidebarWidth}px`,
  } as CSSProperties

  return (
    <aside
      className={cn(
        "sidebar-shell h-full shrink-0 overflow-hidden border-r border-zinc-200 bg-white/92 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#07080b]/92",
        "max-md:fixed max-md:top-16 max-md:bottom-0 max-md:left-0 max-md:z-50 max-md:h-[calc(100dvh-4rem)] max-md:transform-gpu",
      )}
      data-collapsed={isCollapsed}
      style={sidebarStyle}
    >
      <div className="flex h-full flex-col" style={{ width: `min(${sidebarWidth}px, calc(100vw - 2rem))` }}>
        <nav
          aria-label="Workspace navigation"
          className="touch-scroll-y min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))] [scrollbar-color:rgb(161_161_170)_transparent] [scrollbar-width:thin] dark:[scrollbar-color:rgb(63_63_70)_transparent]"
        >
          <div className="grid grid-cols-2 gap-1 rounded-md border border-zinc-200 bg-zinc-50/80 p-1 dark:border-white/[0.07] dark:bg-white/[0.025]">
            <button
              type="button"
              aria-current={activePath === "/" ? "page" : undefined}
              onClick={() => onSelectItem("/")}
              className={cn(
                "group col-span-2 flex h-8 w-full items-center justify-center gap-1.5 rounded px-2 text-center text-[10px] font-medium transition-colors duration-200 cursor-pointer",
                activePath === "/"
                  ? "bg-white text-zinc-950 shadow-sm dark:bg-white/[0.08] dark:text-zinc-50"
                  : "text-zinc-600 hover:bg-white hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100",
              )}
            >
              <Home className="size-3 shrink-0" aria-hidden="true" />
              <span className="truncate">Overview</span>
            </button>

            <button
                type="button"
                disabled={!continueReadingPath}
                onClick={() => continueReadingPath && onSelectItem(continueReadingPath)}
                className="flex h-7 min-w-0 items-center justify-center gap-1.5 rounded px-1.5 text-[10px] font-medium text-zinc-600 transition-colors hover:bg-white hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-35 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
                title={continueReadingPath ? "Continue reading" : "Open a lesson to start reading"}
              >
                <Play className="size-3 shrink-0" aria-hidden="true" />
                <span className="truncate">Continue</span>
            </button>
            <button
                type="button"
                onClick={toggleAllCategories}
                className="flex h-7 min-w-0 items-center justify-center gap-1.5 rounded px-1.5 text-[10px] font-medium text-zinc-600 transition-colors hover:bg-white hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
                title={allExpanded ? "Collapse all categories" : "Expand all categories"}
              >
                {allExpanded ? <ChevronsUp className="size-3 shrink-0" aria-hidden="true" /> : <ChevronsDown className="size-3 shrink-0" aria-hidden="true" />}
                <span className="truncate">{allExpanded ? "Collapse" : "Expand"}</span>
            </button>
          </div>

          {categories.filter(category=>{let parent=category.parentId;while(parent){if(!openCategories.has(parent))return false;parent=categories.find(value=>value.id===parent)?.parentId}return true}).map((category) => (
            <div key={category.id || category.title} style={{marginLeft:(category.depth||0)*12}}><SidebarCategory
              key={category.id || category.title}
              category={category}
              activePath={activePath}
              onSelectItem={onSelectItem}
              isOpen={openCategories.has(category.id || category.title)}
              onToggle={() => {
                setOpenCategories((current) => {
                  const next = new Set(current)
                  if (next.has(category.id || category.title)) next.delete(category.id || category.title)
                  else next.add(category.id || category.title)
                  return next
                })
              }}
            /></div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
