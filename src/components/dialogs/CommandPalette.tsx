import { useState, useEffect } from "react"
import { Box, Home, Clock } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { useSubjects } from "@/constants/subjects"
import { catalog, documentUrl } from "@/content-adapter"

import copy from "@/constants/ui-copy.json"


export type SearchResultItem = {
  path: string
  label: string
  slug: string
  subjectId: string
  subjectLabel: string
  categoryTitle: string
  content?: string
}

type CommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectSearchResult: (subjectId: string, path: string) => void
}

export function CommandPalette({
  open,
  onOpenChange,
  onSelectSearchResult,
}: CommandPaletteProps) {
  const SUBJECTS = useSubjects()
  const [searchQuery, setSearchQuery] = useState("")
  const [allItems, setAllItems] = useState<SearchResultItem[]>([])
  const [indexing,setIndexing] = useState(false)
  const [recentItems, setRecentItems] = useState<SearchResultItem[]>([])

  // Load recently visited items on mount and when modal opens
  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem("lattice-recent-items")
      if (stored) {
        try {
          setRecentItems(JSON.parse(stored))
        } catch {
          setRecentItems([])
        }
      } else {
        setRecentItems([])
      }
      setSearchQuery("") // Clear search query when opening command palette
    }
  }, [open])

  useEffect(() => {
    let stopped = false
    const entries = SUBJECTS.flatMap(subject => catalog.documents.filter(doc => doc.collectionId === subject.collectionId).map(doc => ({ path: doc.slug ? '/' + doc.slug : '/', label: doc.title, slug: doc.slug, subjectId: subject.id, subjectLabel: subject.label, categoryTitle: catalog.collections.find(c => c.id === subject.collectionId)?.groups.find(g=>g.id===doc.groupId)?.title || 'Overview', file: doc })))
    setAllItems(entries)
    setIndexing(open)
    if (open) void Promise.all(entries.map(async item => {
      try { const response=await fetch(documentUrl(item.file)); return {...item,content:response.ok?await response.text():''} } catch { return item }
    })).then(items=>{if(!stopped){setAllItems(items);setIndexing(false)}})
    return () => { stopped=true }
  }, [SUBJECTS, open])

  function handleSelectItem(item: SearchResultItem) {
    const updated = [
      item,
      ...recentItems.filter((r) => !(r.path === item.path && r.subjectId === item.subjectId)),
    ].slice(0, 5)

    localStorage.setItem("lattice-recent-items", JSON.stringify(updated))
    setRecentItems(updated)
    onSelectSearchResult(item.subjectId, item.path)
    onOpenChange(false)
  }

  // Group search results by workspace for nice presentation
  const groupedResults = SUBJECTS.reduce((acc, subject) => {
    const words=searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean)
    const matched = allItems.filter((item) => item.subjectId === subject.id && words.every(word=>`${item.label} ${item.subjectLabel} ${item.categoryTitle} ${item.slug} ${item.content||''}`.toLowerCase().includes(word)))
    if (matched.length > 0) {
      acc[subject.id] = {
        label: subject.label,
        items: matched,
      }
    }
    return acc;
  }, {} as Record<string, { label: string; items: SearchResultItem[] }>)

  return (
    <CommandDialog
      open={open}
      shouldFilter={false}
      onOpenChange={onOpenChange}
      title={copy.search.title}
      description={copy.search.description}
      className="border-zinc-200 bg-white text-zinc-950 shadow-2xl dark:border-white/[0.1] dark:bg-[#08090c]/96 dark:text-zinc-100"
    >
      <CommandInput
        placeholder={copy.search.placeholder}
        className="text-zinc-950 placeholder:text-zinc-500 dark:text-zinc-100 dark:placeholder:text-zinc-600"
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList className="max-h-[420px]">
        {searchQuery === "" ? (
          recentItems.length > 0 ? (
            <CommandGroup heading={copy.search.recentHeading}>
              {recentItems.map((item) => (
                <CommandItem
                  key={`recent-${item.subjectId}-${item.path}`}
                  value={`recent ${item.subjectLabel} ${item.categoryTitle} ${item.label}`}
                  onSelect={() => handleSelectItem(item)}
                  className="data-[selected=true]:bg-white/[0.07] data-[selected=true]:text-zinc-50"
                >
                  <Clock className="size-4 text-zinc-500" />
                  <span className="font-mono text-xs text-zinc-300">{item.label}</span>
                  <span className="ml-2 text-[10px] text-zinc-500">({item.subjectLabel})</span>
                  <CommandShortcut>{item.categoryTitle}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
              <div className="py-8 text-center text-sm text-zinc-500">
              {copy.search.emptyRecent}
            </div>
          )
        ) : (
          <>
            <CommandEmpty className="py-8 text-center text-sm text-zinc-500">
              {indexing?'Searching document content…':copy.search.noResults}
            </CommandEmpty>
            {Object.entries(groupedResults).map(([subjectId, group]) => (
              <CommandGroup key={subjectId} heading={group.label}>
                {group.items.map((item) => (
                  <CommandItem
                    key={`search-${item.subjectId}-${item.path}`}
                    value={`${item.subjectId}:${item.path}`}
                    onSelect={() => handleSelectItem(item)}
                    className="data-[selected=true]:bg-white/[0.07] data-[selected=true]:text-zinc-50"
                  >
                    {item.path === "/" ? (
                      <Home className="size-4 text-zinc-500" />
                    ) : (
                      <Box className="size-4 text-zinc-400" />
                    )}
                    <span className="font-mono text-xs">{item.label}</span>
                    <CommandShortcut>{item.categoryTitle}</CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
