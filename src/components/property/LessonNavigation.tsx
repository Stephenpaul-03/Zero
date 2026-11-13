import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import type { SidebarItemData } from "@/types/navigation"

type LessonNavigationProps = {
  previous?: Pick<SidebarItemData, 'label' | 'path'>
  next?: Pick<SidebarItemData, 'label' | 'path'>
  onSelect: (path: string) => void
  itemLabel?: 'lesson' | 'page'
}

export function LessonNavigation({ previous, next, onSelect, itemLabel = 'lesson' }: LessonNavigationProps) {
  if (!previous && !next) return null

  return (
    <nav
      aria-label={itemLabel === 'lesson' ? 'Lesson navigation' : 'Page navigation'}
      className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-3 px-4 pb-10 md:px-10 md:pb-12"
    >
      {previous ? (
        <button
          type="button"
          onClick={() => onSelect(previous.path)}
          className="group min-w-0 rounded-xl border border-zinc-200 bg-white p-4 text-left transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-white/[0.08] dark:bg-white/[0.025] dark:hover:border-white/20 dark:hover:bg-white/[0.05]"
        >
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500"><ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />Previous {itemLabel}</span>
          <span className="mt-2 block truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">{previous.label}</span>
        </button>
      ) : <span />}
      {next ? (
        <button
          type="button"
          onClick={() => onSelect(next.path)}
          className={cn(
            "group min-w-0 rounded-xl border border-zinc-200 bg-white p-4 text-right transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-white/[0.08] dark:bg-white/[0.025] dark:hover:border-white/20 dark:hover:bg-white/[0.05]",
            !previous && "col-start-2",
          )}
        >
          <span className="flex items-center justify-end gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500">Next {itemLabel}<ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
          <span className="mt-2 block truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">{next.label}</span>
        </button>
      ) : null}
    </nav>
  )
}

