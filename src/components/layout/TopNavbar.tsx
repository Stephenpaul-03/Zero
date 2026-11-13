import { ChevronDown, ExternalLink, MessageCircle, Search } from "lucide-react"

import { ModeToggle } from "@/components/theme/mode-toggle"
import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { useSubjects, type Subject } from "@/constants/subjects"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { catalog } from '@/content-adapter'
import { BackLink } from '@/zero/BackLink'
import { currentSection } from '@/zero/section'

type TopNavbarProps = {
  onOpenCommand: () => void
  activeSubject: Subject
  onSelectSubject: (subject: Subject, event: React.MouseEvent) => void
  onOpenContact?: () => void
}

export function TopNavbar({
  onOpenCommand,
  activeSubject,
  onSelectSubject,
  onOpenContact,
}: TopNavbarProps) {
  const SectionIcon=currentSection().Icon


  const SUBJECTS = useSubjects()
  const websiteUrl=catalog.collections.find(value=>value.id===activeSubject.collectionId)?.websiteUrl
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#07080b]/78">
      <div className="flex h-full items-center justify-between px-4 md:px-5">
        <div className="flex items-center gap-3">
          <BackLink/>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="section-selector flex items-center gap-3 text-left focus:outline-none cursor-pointer">
                <SectionIcon className="section-icon size-6 shrink-0" aria-hidden="true" />
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-[15px] font-semibold leading-none text-zinc-950 dark:text-zinc-50">
                      {activeSubject.label}
                    </p>
                    <ChevronDown className="size-3.5 text-zinc-500" />
                  </div>
                  <p className="mt-1 text-[11px] leading-none text-zinc-500">
                    Switch Subject
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="min-w-56 border-zinc-200 bg-white text-zinc-800 shadow-xl dark:border-white/[0.08] dark:bg-[#101218]/95 dark:text-zinc-200 dark:shadow-black/30 dark:backdrop-blur-xl"
            >
              <DropdownMenuLabel className="text-xs text-zinc-500">
                Subjects
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
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
        </div>

        <div className="flex items-center justify-end gap-2">
          {websiteUrl&&<Button asChild variant="outline" size="icon"><a href={websiteUrl} target="_blank" rel="noopener noreferrer" aria-label="Open live website" title="Open live website"><ExternalLink className="size-4"/></a></Button>}
          <Button
            type="button"
            variant="outline"
            onClick={onOpenCommand}
            className="h-9 w-9 md:w-48 justify-center md:justify-between gap-2 border-zinc-200 bg-white px-0 md:px-3 text-zinc-500 shadow-none hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/[0.1] dark:bg-white/[0.045] dark:text-zinc-400 dark:hover:bg-white/[0.075] dark:hover:text-zinc-100 cursor-pointer"
          >
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="hidden md:inline text-sm">Search</span>
            <KbdGroup className="hidden md:flex">
              <Kbd className="ml-auto h-5 border border-zinc-200 bg-zinc-100 px-1.5 text-[11px] text-zinc-500 dark:border-white/[0.08] dark:bg-black/20">
                ⌘
              </Kbd>
              <Kbd className="h-5 border border-zinc-200 bg-zinc-100 px-1.5 text-[11px] text-zinc-500 dark:border-white/[0.08] dark:bg-black/20">
                K
              </Kbd>
            </KbdGroup>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onOpenContact}
            aria-label="Contact"
            title="Contact"
            className="border-zinc-200 bg-white text-zinc-600 shadow-none hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/[0.1] dark:bg-white/[0.045] dark:text-zinc-400 dark:hover:bg-white/[0.075] dark:hover:text-zinc-100 cursor-pointer"
          >
            <MessageCircle className="size-4" />
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
