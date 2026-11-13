import { ChevronDown, Download, Home, PanelLeft, PanelRight, PanelRightClose, PanelLeftClose } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Heading } from '../../../shared/markdown.mjs'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type {
  NavigationPageData,
  SidebarCategoryData,
} from "@/types/navigation"
import { useSubjects, type Subject } from "@/constants/subjects"

type BreadcrumbBarProps = {
  currentPage: NavigationPageData
  parentLabel?: string
  categories: SidebarCategoryData[]
  activePath: string
  activeSectionTitle?: string
  onSelectPath: (path: string) => void
  onGoHome: () => void
  activeSubject: Subject
  onSelectSubject: (subject: Subject, event: React.MouseEvent) => void
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
  isOutlineCollapsed: boolean
  onToggleOutline: () => void
  headings: Heading[]
  onDownloadPDF: () => void
  onDownloadMD: () => void
}

export function BreadcrumbBar({
  currentPage,
  parentLabel,
  categories,
  activePath,
  activeSectionTitle,
  onSelectPath,
  onGoHome,
  activeSubject,
  onSelectSubject,
  isSidebarCollapsed,
  onToggleSidebar,
  isOutlineCollapsed,
  onToggleOutline,
  headings,
  onDownloadPDF,
  onDownloadMD,
}: BreadcrumbBarProps) {
  const activeCategory = categories.find(
    (category) => category.title === parentLabel,
  )
  const siblingItems = activeCategory?.items ?? []

  const SUBJECTS = useSubjects()
  return (
    <div className="flex h-14 w-full shrink-0 border-b border-zinc-200 bg-white/86 pl-0 pr-0 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#07080b]/88 items-center justify-between">
      {/* Left side aligned Sidebar controls (Toggle only, no Home button) */}
      <div className="h-full w-[50px] md:w-[60px] flex items-center justify-between md:justify-end px-4 border-r border-zinc-200 dark:border-white/[0.08]">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex size-9 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-white/[0.045] dark:hover:text-zinc-100 cursor-pointer"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? (
            <PanelLeft className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </button>
      </div>

      {/* Breadcrumbs Row: Flexible container */}
      <div className="flex h-full items-center flex-1 px-4 md:px-6 overflow-hidden">
        <Breadcrumb className="flex h-full items-center w-full overflow-hidden">
          <BreadcrumbList className="gap-1 md:gap-2 text-[11px] md:text-sm text-zinc-500 dark:text-zinc-500 flex-nowrap overflow-hidden">
            <BreadcrumbItem className="shrink-0">
              <button
                type="button"
                onClick={onGoHome}
                aria-label="Back to section"
                title="Back to section"
                className="flex size-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
              >
                <Home className="size-3.5" aria-hidden="true" />
              </button>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-zinc-400 dark:text-zinc-700 shrink-0" />

            {/* 1. Workspace Breadcrumb (hidden on mobile) */}
            <BreadcrumbItem className="shrink-0 max-md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <BreadcrumbLink asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 font-medium text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.045] dark:hover:text-zinc-100 cursor-pointer"
                    >
                      {activeSubject.label}
                      <ChevronDown className="size-3.5" aria-hidden="true" />
                    </button>
                  </BreadcrumbLink>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="min-w-56 border-zinc-200 bg-white text-zinc-800 shadow-xl dark:border-white/[0.08] dark:bg-[#101218]/95 dark:text-zinc-200 dark:shadow-black/30 dark:backdrop-blur-xl"
                >
                  <DropdownMenuLabel className="text-xs text-zinc-500">
                    Switch Subject
                  </DropdownMenuLabel>
                  {SUBJECTS.map((sub) => (
                    <DropdownMenuItem
                      key={sub.id}
                      onClick={(e) => onSelectSubject(sub, e)}
                      className="flex justify-between items-center cursor-pointer"
                    >
                      <span>{sub.label}</span>
                      {sub.id === activeSubject.id && (
                        <span className="text-xs text-zinc-500">Active</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>

            {/* Separator after Workspace (hidden on mobile) */}
            <BreadcrumbSeparator className="text-zinc-400 dark:text-zinc-700 shrink-0 max-md:hidden" />

            {/* 2. Overview / Category Breadcrumb (always visible) */}
            <BreadcrumbItem className="shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <BreadcrumbLink asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 font-medium text-zinc-600 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.045] dark:hover:text-zinc-100 cursor-pointer"
                    >
                      {activePath === "/" ? "Overview" : (parentLabel || "Category")}
                      <ChevronDown className="size-3.5" aria-hidden="true" />
                    </button>
                  </BreadcrumbLink>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="min-w-56 border-zinc-200 bg-white text-zinc-800 shadow-xl dark:border-white/[0.08] dark:bg-[#101218]/95 dark:text-zinc-200 dark:shadow-black/30 dark:backdrop-blur-xl"
                >
                  <DropdownMenuLabel className="text-xs text-zinc-500">
                    Navigation
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => onSelectPath("/")}
                    className="flex justify-between items-center cursor-pointer"
                  >
                    <span>Overview</span>
                    {activePath === "/" && (
                      <span className="text-xs text-zinc-500">Current</span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-zinc-500">
                    Categories
                  </DropdownMenuLabel>
                  {categories.map((category) => {
                    const firstItem = category.items[0]
                    const isCurrent = category.title === parentLabel

                    return (
                      <DropdownMenuItem
                        key={category.title}
                        disabled={!firstItem}
                        onClick={() => firstItem && onSelectPath(firstItem.path)}
                        className="cursor-pointer flex justify-between items-center"
                      >
                        <span>{category.title}</span>
                        {isCurrent && activePath !== "/" ? (
                          <span className="text-xs text-zinc-500">Current</span>
                        ) : (
                          <span className="ml-auto text-xs text-zinc-500">
                            {category.items.length}
                          </span>
                        )}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>

            {/* 3. Page / Property Breadcrumb (only when not on Home) */}
            {activePath !== "/" && (
              <>
                <BreadcrumbSeparator className="text-zinc-400 dark:text-zinc-700 shrink-0" />
                <BreadcrumbItem className="shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <BreadcrumbPage className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 font-mono text-[11px] md:text-[13px] text-zinc-950 transition-colors duration-200 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-white/[0.045]">
                        {currentPage.path === activePath ? currentPage.label : "Unknown"}
                        <ChevronDown className="size-3.5" aria-hidden="true" />
                      </BreadcrumbPage>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="min-w-64 border-zinc-200 bg-white text-zinc-800 shadow-xl dark:border-white/[0.08] dark:bg-[#101218]/95 dark:text-zinc-200 dark:shadow-black/30 dark:backdrop-blur-xl"
                    >
                      <DropdownMenuLabel className="text-xs text-zinc-500">
                        Sibling properties
                      </DropdownMenuLabel>
                      {siblingItems.map((item) => (
                        <DropdownMenuItem
                          key={item.path}
                          onClick={() => onSelectPath(item.path)}
                          className="cursor-pointer flex justify-between items-center"
                        >
                          <span className="font-mono text-xs">{item.label}</span>
                          {item.path === activePath && (
                            <span className="text-xs text-zinc-500">Current</span>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
              </>
            )}

            {/* 4. Section Heading (anchor) Breadcrumb (if any) */}
            {activePath !== "/" && activeSectionTitle ? (
              <>
                <BreadcrumbSeparator className="text-zinc-400 dark:text-zinc-700 shrink-0" />
                <BreadcrumbItem className="shrink-0">
                  <BreadcrumbPage className="truncate rounded-md px-1.5 py-1 text-zinc-600 dark:text-zinc-400">
                    {activeSectionTitle}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : null}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Desktop/Tablet Download controls */}
      {currentPage.path !== "/" && (
        <div className={cn(
          "hidden md:flex items-center gap-1.5 px-4",
          headings.length === 0 && "border-l border-zinc-200 dark:border-white/[0.08] h-full"
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-white/[0.045] dark:hover:text-zinc-100 cursor-pointer"
                title="Download Page"
              >
                <Download className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44 bg-white dark:bg-[#101218] border border-zinc-200 dark:border-white/[0.08] dark:text-zinc-200">
              <DropdownMenuItem onClick={onDownloadPDF} className="cursor-pointer">
                Download as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDownloadMD} className="cursor-pointer">
                Download as Markdown
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Right side aligned Outline controls */}
      {currentPage.path !== "/" && (
        <div className="h-full w-[50px] md:w-[60px] flex items-center justify-between md:justify-end px-4 border-l border-zinc-200 dark:border-white/[0.08]">
          <button
            type="button"
            onClick={onToggleOutline}
            className="flex size-9 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-white/[0.045] dark:hover:text-zinc-100 cursor-pointer"
            title={isOutlineCollapsed ? "Expand Outline" : "Collapse Outline"}
          >
            {isOutlineCollapsed ? (
              <PanelRight className="size-4" />
            ) : (
              <PanelRightClose className="size-4" />
            )}
          </button>
        </div>
      )}
    </div>
  )
}
