import { ListTree, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import type { NavigationPageData } from "@/types/navigation"
import type { Heading } from '../../../shared/markdown.mjs'

type OutlineSidebarProps = {
  headings: Heading[]
  activeHeadingId: string | null
  onSelectHeading: (id: string) => void
  isCollapsed: boolean
  currentPage: NavigationPageData
  onDownloadPDF?: () => void
  onDownloadMD?: () => void
}

export function OutlineSidebar({
  headings,
  activeHeadingId,
  onSelectHeading,
  isCollapsed,
  currentPage,
  onDownloadPDF,
  onDownloadMD,
}: OutlineSidebarProps) {
  const totalHeadings = headings.length
  const activeIndex = headings.findIndex(
    (heading) => heading.id === activeHeadingId
  )
  const progressValue =
    totalHeadings > 0 ? ((Math.max(0, activeIndex) + 1) / totalHeadings) * 100 : 0

  return (
    <aside
      className={cn(
        "h-full shrink-0 overflow-hidden border-l border-zinc-200 bg-white/90 backdrop-blur-xl transition-[width,opacity] duration-300 ease-in-out dark:border-white/[0.08] dark:bg-[#07080b]/90",
        "max-md:fixed max-md:top-16 max-md:bottom-0 max-md:right-0 max-md:z-50 max-md:h-[calc(100dvh-4rem)]",
        isCollapsed ? "w-0 border-l-0 opacity-0 pointer-events-none" : "w-[240px] opacity-100"
      )}
    >

      <div className="flex h-full w-[240px] flex-col">
        <div className="touch-scroll-y flex-1 overflow-y-auto p-4 pb-[calc(2rem+env(safe-area-inset-bottom))] space-y-6 [scrollbar-color:rgb(161_161_170)_transparent] [scrollbar-width:thin] dark:[scrollbar-color:rgb(63_63_70)_transparent]">
          {/* Progress */}
          {totalHeadings > 0 && (
            <section className="space-y-2.5 pb-4 border-b border-zinc-100 dark:border-white/[0.05]">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Page Progress
                </p>
                <p className="text-xs text-zinc-500 font-medium">
                  {activeIndex >= 0 ? `${activeIndex + 1} of ${totalHeadings}` : `0 of ${totalHeadings}`}
                </p>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/[0.06]">
                <div
                  className="h-full bg-zinc-600 dark:bg-zinc-300 transition-[width] duration-300"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
            </section>
          )}

          {/* Heading Links */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <ListTree className="size-3.5" />
              <span>On this page</span>
            </div>
            <div className="space-y-0.5 border-l border-zinc-100 dark:border-white/[0.06]">
              {headings.length > 0 ? (
                headings.map(({id,text}) => {
                  const isActive = id === activeHeadingId

                  return (
                    <button
                      key={id}
                      type="button"
                      aria-controls={id}
                      aria-current={isActive ? 'location' : undefined}
                      onClick={() => onSelectHeading(id)}
                      className={cn(
                        "flex w-full items-center border-l -ml-px pl-3 py-1.5 text-left text-xs font-medium transition-colors duration-200",
                        isActive
                          ? "border-zinc-800 text-zinc-950 dark:border-zinc-300 dark:text-zinc-50"
                          : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                      )}
                    >
                      {text}
                    </button>
                  )
                })
              ) : (
                <p className="pl-3 py-1 text-xs text-zinc-400 dark:text-zinc-500">
                  No sections on this page
                </p>
              )}
            </div>
          </section>

          {/* Mobile Page Actions (Download Options) */}
          {currentPage.path !== "/" && (onDownloadPDF || onDownloadMD) && (
            <section className="md:hidden space-y-3 pt-4 border-t border-zinc-100 dark:border-white/[0.05]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                <Download className="size-3.5" />
                <span>Page Actions</span>
              </div>
              <div className="flex flex-col gap-2">
                {onDownloadPDF && (
                  <button
                    onClick={onDownloadPDF}
                    className="w-full text-left text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 py-1"
                  >
                    Download as PDF
                  </button>
                )}
                {onDownloadMD && (
                  <button
                    onClick={onDownloadMD}
                    className="w-full text-left text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 py-1"
                  >
                    Download as Markdown
                  </button>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </aside>
  )
}
