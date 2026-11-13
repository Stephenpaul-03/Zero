import { LoaderCircle, type LucideIcon } from "lucide-react"

import copy from "@/constants/ui-copy.json"
import { currentSection } from '@/zero/section'
import type { Subject } from "@/constants/subjects"

type WorkspaceLoaderProps = {
  subject: Subject
}

export function WorkspaceLoader({ subject }: WorkspaceLoaderProps) {
  const SectionIcon = currentSection().Icon
  const loaderCopy = copy.workspaceLoader.workspaces[subject.id as keyof typeof copy.workspaceLoader.workspaces] || {title: `Opening ${subject.label}`,description: 'Loading documents and navigation.'}

  return <WorkspaceTransition Icon={SectionIcon} title={loaderCopy.title} description={loaderCopy.description}/>
}

export function WorkspaceTransition({Icon,title,description}:{Icon:LucideIcon;title:string;description:string}) {

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-zinc-50 px-6 text-zinc-950 dark:bg-[#050608] dark:text-zinc-100" role="status" aria-live="polite">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div className="relative flex size-24 items-center justify-center rounded-[2rem] border border-zinc-200 bg-white shadow-xl dark:border-white/[0.1] dark:bg-white/[0.04]">
          <span className="absolute inset-0 rounded-[2rem] border border-zinc-400/40 animate-ping motion-reduce:animate-none dark:border-white/25" />
          <Icon className="section-icon relative size-12" aria-hidden="true" />
        </div>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">{copy.workspaceLoader.status}</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{description}</p>
        <LoaderCircle className="mt-8 size-5 animate-spin motion-reduce:animate-none text-zinc-500" aria-hidden="true" />
      </div>
    </div>
  )
}
