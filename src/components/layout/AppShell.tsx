import { useEffect, useState } from "react"
import { Monitor } from "lucide-react"
import { renderMarkdown, escapeHtml } from '../../../shared/markdown.mjs'
import type { Heading } from '../../../shared/markdown.mjs'


import { useSubjects, type Subject } from "@/constants/subjects"
import { AppContextMenu } from "@/components/layout/AppContextMenu"
import { BreadcrumbBar } from "@/components/layout/BreadcrumbBar"
import { CommandPalette } from "@/components/dialogs/CommandPalette"
import { ContactModal } from "@/components/dialogs/ContactModal"
import { NotFoundPage } from "@/components/layout/NotFoundPage"
import { GlobalHomePage } from "@/components/layout/GlobalHomePage"
import { WorkspaceLoader } from "@/components/layout/WorkspaceLoader"
import { PropertyRenderer } from "@/components/property/PropertyRenderer"
import { LessonNavigation } from "@/components/property/LessonNavigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { OutlineSidebar } from "@/components/layout/OutlineSidebar"
import type { NavigationPageData, SidebarCategoryData, SidebarItemData } from "@/types/navigation"
import { catalog, navigationFor, parseReaderUrl, readerKind, readerRoot, readerPath } from "@/content-adapter"

import { NOTES_PROGRESS_KEY, readReadingProgress, saveReadingProgress, type ReadingProgress } from "@/lib/reading-progress"

const initialActivePath = "/"

function parseUrl() { return parseReaderUrl(readerKind()) }

function getCurrentPage(
  activePath: string,
  homePage: NavigationPageData,
  sidebarCategories: SidebarCategoryData[]
) {
  if (activePath === "/" || activePath === homePage.path) {
    return { currentPage: homePage, parentLabel: undefined }
  }

  for (const category of sidebarCategories) {
    const item = category.items.find((page) => page.path === activePath)

    if (item) {
      return { currentPage: item, parentLabel: category.title }
    }
  }

  return {
    currentPage: {
      label: "Overview",
      path: "/",
    } satisfies NavigationPageData,
    parentLabel: undefined,
  }
}

export function AppShell() {
  const SUBJECTS = useSubjects()
  const kind = readerKind()
  const siteRoot = readerRoot(kind)
  const progressKey = kind === "learn" ? NOTES_PROGRESS_KEY : `zero-reading-progress-${siteRoot}`
  const LandingPage = GlobalHomePage
  const initialUrl = parseUrl()
  const [activeSubject, setActiveSubject] = useState<Subject>(() => {
    if (initialUrl && "subjectId" in initialUrl) {
      const sub = SUBJECTS.find((s) => s.id === initialUrl.subjectId)
      if (sub) return sub
    }
    return SUBJECTS[0]
  })
  const [activePath, setActivePath] = useState(initialActivePath)
  const [pendingSlug, setPendingSlug] = useState<string | null>(() => {
    return initialUrl && "pagePath" in initialUrl ? initialUrl.pagePath : null
  })
  const [isNotFound, setIsNotFound] = useState(() => Boolean(initialUrl && "isNotFound" in initialUrl))
  const [isGlobalHome, setIsGlobalHome] = useState(() => initialUrl === null)
  const [loadingWorkspace, setLoadingWorkspace] = useState<Subject | null>(null)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [activeSectionTitle, setActiveSectionTitle] = useState<string>()
  const [readingProgress, setReadingProgress] = useState<ReadingProgress | null>(() =>
    readReadingProgress(progressKey),
  )

  // Collapsible States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768,
  )
  const [isOutlineCollapsed, setIsOutlineCollapsed] = useState(false)
  const [splashCoords, setSplashCoords] = useState<{ x: number; y: number } | null>(null)

  const handleSelectSubject = (
    subject: Subject,
    event: React.MouseEvent
  ) => {
    if (isGlobalHome) {
      if (loadingWorkspace) return
      setLoadingWorkspace(subject)
      window.setTimeout(() => {
        setIsGlobalHome(false)
        setPendingSlug("home")
        setActiveSubject(subject)
        setLoadingWorkspace(null)
      }, 850)
      return
    }

    if (subject.id === activeSubject.id) return

    setSplashCoords({ x: event.clientX, y: event.clientY })

    window.setTimeout(() => {
      setActiveSubject(subject)
      setPendingSlug("home")
    }, 400)

    window.setTimeout(() => {
      setSplashCoords(null)
    }, 1000)
  }

  const handleSelectPath = (path: string) => {
    setIsGlobalHome(false)
    setActivePath(path)
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarCollapsed(true)
      setIsOutlineCollapsed(true)
    }
  }

  const handleGoToGlobalHome = () => {
    window.history.pushState({}, "", siteRoot)
    setActiveSubject(SUBJECTS[0])
    setActivePath("/")
    setPendingSlug(null)
    setIsNotFound(false)
    setIsGlobalHome(true)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true)
        setIsOutlineCollapsed(true)
      } else {
        setIsSidebarCollapsed(false)
        setIsOutlineCollapsed(false)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Outline States
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null)

  // Welcome overlay and modal states
  const [isContactOpen, setIsContactOpen] = useState(false)

  // System menu preference state
  const [useSystemMenu, setUseSystemMenu] = useState(() => {
    return localStorage.getItem("lattice-use-system-menu") === "true"
  })


  const handleSwitchToSystemMenu = () => {
    localStorage.setItem("lattice-use-system-menu", "true")
    setUseSystemMenu(true)
  }

  const handleRestoreCustomMenu = () => {
    localStorage.setItem("lattice-use-system-menu", "false")
    setUseSystemMenu(false)
  }

  const [navData, setNavData] = useState<{
    homePage: NavigationPageData
    sidebarCategories: SidebarCategoryData[]
    sidebarItems: SidebarItemData[]
  }>({
    homePage: { label: "Overview", path: "/" },
    sidebarCategories: [],
    sidebarItems: [],
  })
  const [isNavigationReady, setIsNavigationReady] = useState(false)

  useEffect(() => {
    setIsNavigationReady(false)
  }, [activeSubject])

  // Handle browser Back/Forward navigation
  useEffect(() => {
    function handlePopState() {
      if (document.documentElement.dataset.appDialogOpen === "true") return
      const urlInfo = parseUrl()
      if (urlInfo && "subjectId" in urlInfo) {
        const sub = SUBJECTS.find((s) => s.id === urlInfo.subjectId)
        if (sub) {
          setActiveSubject(sub)
          setPendingSlug(urlInfo.pagePath)
          setIsNotFound(false)
          setIsGlobalHome(false)
        }
      } else if (urlInfo?.isNotFound) {
        setIsNotFound(true)
        setIsGlobalHome(false)
      } else {
        setActiveSubject(SUBJECTS[0])
        setPendingSlug("home")
        setIsNotFound(false)
        setIsGlobalHome(true)
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [SUBJECTS])

  // Sync URL pushState when subject or path changes
  useEffect(() => {
    let slug = "home"
    const currentItem = navData.sidebarItems.find((item) => item.path === activePath)
    if (currentItem && currentItem.slug) {
      slug = currentItem.slug
    }

    const expectedPathname = readerPath(activeSubject, slug)
    if (isNotFound || pendingSlug || (window.location.pathname === siteRoot && isGlobalHome)) return
    if (window.location.pathname !== expectedPathname) {
      window.history.pushState(
        { subjectId: activeSubject.id, pagePath: slug },
        "",
        expectedPathname
      )
    }
  }, [activeSubject, activePath, navData, isNotFound, pendingSlug, isGlobalHome, siteRoot])

  useEffect(() => {
    const parsed = navigationFor(activeSubject.collectionId)
    setNavData(parsed)
    setIsNavigationReady(true)
    if (pendingSlug) {
      const found = pendingSlug === 'home' ? undefined : parsed.sidebarItems.find(item => item.slug === pendingSlug || item.slug.endsWith('/' + pendingSlug))
      if (pendingSlug !== 'home' && !found) { setIsNotFound(true); setPendingSlug(null); return }
      setActivePath(found?.path || '/')
      setPendingSlug(null)
    } else setActivePath(current => current === '/' || parsed.sidebarItems.some(item => item.path === current) ? current : '/')
    setIsNotFound(false)
  }, [activeSubject, pendingSlug])

  const { currentPage, parentLabel } = getCurrentPage(activePath, navData.homePage, navData.sidebarCategories)

  useEffect(() => {
    if (!isNavigationReady || activePath === "/" || !currentPage.slug) return
    const progress: ReadingProgress = {
      subjectId: activeSubject.id,
      subjectLabel: activeSubject.label,
      path: activePath,
      slug: currentPage.slug,
      lessonLabel: currentPage.label,
    }
    setReadingProgress(progress)
    saveReadingProgress(progressKey, progress)
  }, [activePath, activeSubject.id, activeSubject.label, currentPage.label, currentPage.slug, isNavigationReady, progressKey])

  function handleContinueReading() {
    if (!readingProgress) return
    const targetSubject = SUBJECTS.find((subject) => subject.id === readingProgress.subjectId)
    if (!targetSubject) return

    setLoadingWorkspace(targetSubject)
    window.setTimeout(() => {
      setIsGlobalHome(false)
      setActiveSubject(targetSubject)
      setActivePath("/")
      setPendingSlug(readingProgress.slug)
      setLoadingWorkspace(null)
    }, 500)
  }

  const continueReadingPath = readingProgress?.subjectId === activeSubject.id
    ? readingProgress.path
    : undefined
  const lessonPages = [navData.homePage, ...navData.sidebarItems.filter(item => item.path !== navData.homePage.path)]
  const lessonIndex = lessonPages.findIndex((item) => item.path === activePath)
  const previousLesson = lessonIndex > 0 ? lessonPages[lessonIndex - 1] : undefined
  const nextLesson = lessonIndex >= 0 && lessonIndex < lessonPages.length - 1
    ? lessonPages[lessonIndex + 1]
    : undefined

  // Track headings within the actual reading pane, including its final section.
  useEffect(() => {
    const mainEl = document.querySelector<HTMLElement>('main[data-content-scroll]')
    if (!mainEl) return
    function updateHeading() {
      if (!mainEl) return
      const elements = Array.from(mainEl.querySelectorAll<HTMLElement>('.markdown-body h2'))
      if (!elements.length) { setActiveHeadingId(null); return }
      const atBottom = mainEl.scrollTop > 0 && mainEl.scrollHeight - mainEl.clientHeight - mainEl.scrollTop <= 2
      if (atBottom) { setActiveHeadingId(elements[elements.length - 1].id); return }
      const threshold = mainEl.getBoundingClientRect().top + 24
      let active = elements[0]
      for (const element of elements) {
        if (element.getBoundingClientRect().top > threshold) break
        active = element
      }
      setActiveHeadingId(active.id)
    }
    mainEl.addEventListener('scroll', updateHeading, { passive: true })
    window.addEventListener('resize', updateHeading)
    const observer = new ResizeObserver(updateHeading)
    observer.observe(mainEl)
    const content = mainEl.querySelector('.markdown-body')
    if (content) observer.observe(content)
    updateHeading()
    return () => { mainEl.removeEventListener('scroll', updateHeading); window.removeEventListener('resize', updateHeading); observer.disconnect() }
  }, [headings, isGlobalHome])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setIsCommandOpen((isOpen) => !isOpen)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const fetchCleanContent = async () => {
    if (!currentPage.resolvedUrl) return null
    try {
      const res = await fetch(currentPage.resolvedUrl)
      if(!res.ok||res.headers.get('content-type')?.includes('text/html'))throw new Error('Document unavailable')
      const text = await res.text()
      let cleanText = text.replace(/^---([\s\S]*?)---/, "").trim()
      cleanText = cleanText.replace(/:::quiz([\s\S]*?):::/g, "").trim()
      return cleanText
    } catch (e) {
      console.error(e)
      return null
    }
  }

  const handleDownloadMD = async () => {
    const content = await fetchCleanContent()
    if (!content) return
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${currentPage.slug || "page"}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadPDF = async () => {
    const content = await fetchCleanContent()
    if (!content) return
    const file=decodeURIComponent(currentPage.resolvedUrl?.split('/zero-content/')[1]||'')
    const {html}=renderMarkdown(content,{catalog,file,base:import.meta.env.BASE_URL,legacyHeadings:true})
    const printIframe = document.createElement("iframe")
    printIframe.style.position = "fixed"
    printIframe.style.right = "0"
    printIframe.style.bottom = "0"
    printIframe.style.width = "0"
    printIframe.style.height = "0"
    printIframe.style.border = "0"
    document.body.appendChild(printIframe)

    const doc = printIframe.contentWindow?.document
    if (doc) {
      doc.open()
      doc.write(`
        <html>
          <head>
            <title>${escapeHtml(currentPage.label)}</title>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                line-height: 1.6;
                color: #111;
                padding: 2rem;
                max-width: 800px;
                margin: 0 auto;
              }
              h1 { font-size: 2.2rem; margin-bottom: 1.5rem; }
              h2 { font-size: 1.6rem; margin-top: 2rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
              pre { background: #f4f4f5; padding: 1rem; border-radius: 6px; overflow-x: auto; }
              code { font-family: monospace; font-size: 0.9em; background: #f4f4f5; padding: 0.2rem 0.4rem; border-radius: 4px; }
              ul, ol { padding-left: 1.5rem; }
            </style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `)
      doc.close()

      setTimeout(() => {
        printIframe.contentWindow?.focus()
        printIframe.contentWindow?.print()
        document.body.removeChild(printIframe)
      }, 500)
    }
  }

  function handleScrollToHeading(id: string) {
    const heading = document.getElementById(id)
    const scrollContainer = document.querySelector<HTMLElement>("main[data-content-scroll]")
    if (!heading || !scrollContainer) return

    // Keep the browser viewport fixed and move only the document pane.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    const containerTop = scrollContainer.getBoundingClientRect().top
    const headingTop = heading.getBoundingClientRect().top
    const targetTop = scrollContainer.scrollTop + headingTop - containerTop - 24
    scrollContainer.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" })

    if (window.innerWidth < 768) setIsOutlineCollapsed(true)
  }

  const layoutContent = (
    <div className="fixed inset-0 overflow-hidden bg-zinc-50 text-zinc-950 antialiased dark:bg-[#050608] dark:text-zinc-100">
      <TopNavbar
        onOpenCommand={() => setIsCommandOpen(true)}
        activeSubject={activeSubject}
        onSelectSubject={handleSelectSubject}
        onOpenContact={() => setIsContactOpen(true)}
      />
      <div className="flex h-[calc(100dvh-4rem)] min-h-0 min-w-0 overflow-hidden flex-col">
        <BreadcrumbBar
          currentPage={currentPage}
          parentLabel={parentLabel}
          categories={navData.sidebarCategories}
          activePath={activePath}
          onGoHome={handleGoToGlobalHome}
          activeSectionTitle={activeSectionTitle}
          onSelectPath={handleSelectPath}
          activeSubject={activeSubject}
          onSelectSubject={handleSelectSubject}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isOutlineCollapsed={isOutlineCollapsed}
          onToggleOutline={() => setIsOutlineCollapsed(!isOutlineCollapsed)}
          headings={headings}
          onDownloadPDF={handleDownloadPDF}
          onDownloadMD={handleDownloadMD}
        />
        <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
          {!isSidebarCollapsed && (
            <div 
              className="md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ease-in-out cursor-pointer" 
              onClick={() => setIsSidebarCollapsed(true)}
            />
          )}
          {!isOutlineCollapsed && (
            <div 
              className="md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ease-in-out cursor-pointer" 
              onClick={() => setIsOutlineCollapsed(true)}
            />
          )}
          <Sidebar
            key={activeSubject.id}
            categories={navData.sidebarCategories}
            activePath={activePath}
            onSelectItem={handleSelectPath}
            isCollapsed={isSidebarCollapsed}
            continueReadingPath={continueReadingPath}
          />
          <main data-content-scroll className="touch-scroll-y mobile-bottom-space min-h-0 min-w-0 flex-1 overflow-y-auto bg-zinc-50 [scrollbar-color:rgb(161_161_170)_transparent] [scrollbar-width:thin] dark:bg-[#050608] dark:[scrollbar-color:rgb(63_63_70)_transparent]">
            {isNavigationReady ? (
              <>
                <PropertyRenderer
                  onActiveSectionChange={setActiveSectionTitle}
                  activeSubject={activeSubject}
                  currentPage={currentPage}
                  parentLabel={parentLabel}
                  fallback={<NotFoundPage />}
                  onHeadingsLoaded={setHeadings}
                />
                {lessonIndex >= 0 && (
                  <LessonNavigation previous={previousLesson} next={nextLesson} onSelect={handleSelectPath} />
                )}
              </>
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-zinc-500">Loading content…</div>
            )}
          </main>

          {/* Outline Sidebar placed on the right next to main content */}
          {currentPage.path !== "/" && (
            <OutlineSidebar
              headings={headings}
              activeHeadingId={activeHeadingId}
              onSelectHeading={handleScrollToHeading}
              isCollapsed={isOutlineCollapsed}
              currentPage={currentPage}
              onDownloadPDF={handleDownloadPDF}
              onDownloadMD={handleDownloadMD}
            />
          )}
        </div>
      </div>
      {/* Floating Restore Pill for Custom Context Menu */}
      {useSystemMenu && (
        <button
          onClick={handleRestoreCustomMenu}
          className="fixed bottom-4 right-4 z-[90] flex items-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-zinc-700 shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-zinc-50 dark:border-white/[0.08] dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
        >
          <Monitor className="size-3.5 text-indigo-500" />
          Restore Custom Context Menu
        </button>
      )}
    </div>
  )

  return (
    <>
      <CommandPalette
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
        onSelectSearchResult={(subjectId, path) => {
          const targetSubject = SUBJECTS.find((s) => s.id === subjectId)
          if (!targetSubject) return
          setIsGlobalHome(false)
          setPendingSlug(path === "/" ? "home" : path.replace(/^\//, ""))
          setActiveSubject(targetSubject)
          setActivePath("/")
        }}
      />
      <ContactModal
        open={isContactOpen}
        onOpenChange={setIsContactOpen}
      />
      {isNotFound ? (
        <div className="h-screen overflow-y-auto bg-zinc-50 text-zinc-950 dark:bg-[#050608] dark:text-zinc-100">
          <NotFoundPage />
        </div>
      ) : isGlobalHome ? (
        <LandingPage
          onSelectWorkspace={handleSelectSubject}
          continueReading={readingProgress}
          onContinueReading={handleContinueReading}
        />
      ) : (
        <AppContextMenu
          currentPage={currentPage}
          categories={navData.sidebarCategories}
          onSelectPath={handleSelectPath}
          onOpenCommand={() => setIsCommandOpen(true)}
          onSwitchToSystemMenu={handleSwitchToSystemMenu}
          disabled={useSystemMenu}
        >
          {layoutContent}
        </AppContextMenu>
      )}
      {splashCoords && (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
          <div
            className="project-splash-circle"
            style={{
              left: `${splashCoords.x}px`,
              top: `${splashCoords.y}px`,
              backgroundColor: "var(--background)",
            }}
          />
        </div>
      )}
      {loadingWorkspace && <WorkspaceLoader subject={loadingWorkspace} />}
    </>
  )
}
