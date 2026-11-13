import type { ReactNode } from "react"
import { Copy, Home, Search, Menu } from "lucide-react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import type {
  NavigationPageData,
  SidebarCategoryData,
} from "@/types/navigation"

type AppContextMenuProps = {
  children: ReactNode
  currentPage: NavigationPageData
  categories: SidebarCategoryData[]
  onSelectPath: (path: string) => void
  onOpenCommand: () => void
  onSwitchToSystemMenu?: () => void
  disabled?: boolean
}

export function AppContextMenu({
  children,
  currentPage,
  categories,
  onSelectPath,
  onOpenCommand,
  onSwitchToSystemMenu,
  disabled = false,
}: AppContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild disabled={disabled}>{children}</ContextMenuTrigger>
      <ContextMenuContent className="min-w-64 border-white/[0.08] bg-[#101218]/95 text-zinc-200 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <ContextMenuLabel className="text-xs text-zinc-500">
          Zero
        </ContextMenuLabel>
        <ContextMenuItem
          onClick={() => onSelectPath("/")}
          className="focus:bg-white/[0.07] focus:text-zinc-50"
        >
          <Home className="size-4" />
          Home
        </ContextMenuItem>
        <ContextMenuItem
          onClick={onOpenCommand}
          className="focus:bg-white/[0.07] focus:text-zinc-50"
        >
          <Search className="size-4" />
          Search
          <ContextMenuShortcut>⌘K</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-white/[0.08]" />
        <ContextMenuLabel className="text-xs text-zinc-500">
          Categories
        </ContextMenuLabel>
        {categories.map((category) => (
          <ContextMenuSub key={category.title}>
            <ContextMenuSubTrigger className="focus:bg-white/[0.07] focus:text-zinc-50 data-[state=open]:bg-white/[0.07] data-[state=open]:text-zinc-50">
              {category.title}
              <ContextMenuShortcut>{category.items.length}</ContextMenuShortcut>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="min-w-56 border-white/[0.08] bg-[#101218]/95 text-zinc-200 shadow-2xl shadow-black/40 backdrop-blur-xl">
              {category.items.map((item) => (
                <ContextMenuItem
                  key={item.path}
                  onClick={() => onSelectPath(item.path)}
                  className="focus:bg-white/[0.07] focus:text-zinc-50"
                >
                  <span className="font-mono text-xs">{item.label}</span>
                  {item.path === currentPage.path ? (
                    <ContextMenuShortcut>current</ContextMenuShortcut>
                  ) : null}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
        ))}
        <ContextMenuSeparator className="bg-white/[0.08]" />
        <ContextMenuItem
          onClick={() => navigator.clipboard.writeText(currentPage.path)}
          className="focus:bg-white/[0.07] focus:text-zinc-50"
        >
          <Copy className="size-4" />
          Copy page path
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-white/[0.08]" />
        <ContextMenuItem
          onClick={onSwitchToSystemMenu}
          className="focus:bg-white/[0.07] focus:text-zinc-50"
        >
          <Menu className="size-4" />
          Use system context menu
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
