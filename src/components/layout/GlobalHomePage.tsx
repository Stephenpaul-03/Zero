import { useMemo, useState } from "react"
import { ArrowRight, BookOpenCheck, Search } from "lucide-react"

import copy from "@/constants/ui-copy.json"
import { useSubjects, type Subject } from "@/constants/subjects"
import { ModeToggle } from "@/components/theme/mode-toggle"
import type { MouseEvent } from "react"
import type { ReadingProgress } from "@/lib/reading-progress"
import { getCategoryIcon } from "@/lib/category-icons"

type GlobalHomePageProps = {
  onSelectWorkspace: (subject: Subject, event: MouseEvent<HTMLButtonElement>) => void
  continueReading: ReadingProgress | null
  onContinueReading: () => void
}

import { currentSection } from '@/zero/section'
import { BackLink } from '@/zero/BackLink'

export function GlobalHomePage({ onSelectWorkspace, continueReading, onContinueReading }: GlobalHomePageProps) {
  const SUBJECTS = useSubjects()
  const section=currentSection();const SectionIcon=section.Icon
  const [query, setQuery] = useState("")

  const filteredSubjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return SUBJECTS
    return SUBJECTS.filter((subject) => `${subject.label} ${subject.id}`.toLowerCase().includes(normalizedQuery))
  }, [query, SUBJECTS])
  const groupedSubjects = useMemo(() => {
    const groups = new Map<string, Subject[]>()
    for (const subject of filteredSubjects) {
      const label = subject.pillLabel ?? "Notes"
      const group = groups.get(label) ?? []
      group.push(subject)
      groups.set(label, group)
    }
    return Array.from(groups.entries())
  }, [filteredSubjects])

  return (
    <div className="touch-scroll-y h-screen overflow-y-auto bg-zinc-50 text-zinc-950 antialiased dark:bg-[#050608] dark:text-zinc-100">
      <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-5 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#07080b]/78 md:px-8">
        <div className="section-header-left"><BackLink/><span className="section-header-divider"/><SectionIcon className="section-icon" size={20}/><p className="section-header-title">{section.title}</p></div><ModeToggle/>
      </header>

      <main className="mobile-bottom-space home-reveal mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <section className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">Zero / {section.title}</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-6xl">{section.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-500 dark:text-zinc-400">{section.description}</p>
          <label className="mx-auto mt-8 flex h-12 w-full max-w-xl items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 text-left shadow-sm focus-within:border-zinc-400 dark:border-white/[0.1] dark:bg-white/[0.04] dark:focus-within:border-white/30">
            <Search className="size-4 shrink-0 text-zinc-400" aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={section.id==='learn'?'Search subjects…':'Search projects…'} className="w-full bg-transparent text-sm text-zinc-950 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500" />
          </label>
        </section>

        <section className="mt-16">
          {groupedSubjects.length > 0 ? <div className="space-y-10">{groupedSubjects.map(([groupLabel, subjects]) => <section key={groupLabel}><div className="mb-4 flex items-center gap-3"><h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{groupLabel}</h3><span className="h-px flex-1 bg-zinc-200 dark:bg-white/[0.08]" /></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{subjects.map((subject) => { const SubjectIcon = getCategoryIcon(subject.icon); return <button key={subject.id} type="button" onClick={(event) => onSelectWorkspace(subject, event)} className="home-card group flex min-h-52 flex-col rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-zinc-400 hover:shadow-lg dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:border-white/25 dark:hover:bg-white/[0.05]"><div className="flex items-center justify-between gap-4"><div className="flex size-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-white/[0.1] dark:bg-white/[0.04] dark:text-zinc-200"><SubjectIcon className="size-5" aria-hidden="true" /></div><span className="rounded-full border border-zinc-200 px-2 py-1 font-mono text-[10px] text-zinc-500 dark:border-white/[0.1]">{subject.pillLabel ?? "Notes"}</span></div><div className="mt-auto pt-4"><h3 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{subject.label}</h3><p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{subject.description ?? copy.globalHome.workspaces[subject.id as keyof typeof copy.globalHome.workspaces]}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">{copy.globalHome.openLabel}<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" /></span></div></button> })}</div></section>)}</div> : <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center text-sm text-zinc-500 dark:border-white/[0.12]">{query?'No matching results.':section.id==='learn'?'No subjects yet.':'No projects yet. This space is ready for the first project.'}</div>}
        </section>
      </main>
      {continueReading && (
        <button
          type="button"
          onClick={onContinueReading}
          className="fixed right-4 bottom-4 z-30 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full border border-zinc-200 bg-white/95 px-4 py-3 text-left shadow-xl backdrop-blur-xl transition-transform hover:-translate-y-0.5 dark:border-white/[0.1] dark:bg-[#101116]/95 md:right-6 md:bottom-6"
          aria-label={`Continue reading ${continueReading.lessonLabel}`}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950"><BookOpenCheck className="size-4" aria-hidden="true" /></span>
          <span className="min-w-0 pr-1"><span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500">Continue reading · {continueReading.subjectLabel}</span><span className="block max-w-56 truncate text-sm font-semibold text-zinc-950 dark:text-zinc-50">{continueReading.lessonLabel}</span></span>
          <ArrowRight className="size-4 shrink-0 text-zinc-500" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
