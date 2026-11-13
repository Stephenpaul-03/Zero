import Hub from "@/zero/SimpleHub"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Suspense } from 'react'
import { WorkspaceTransition } from '@/components/layout/WorkspaceLoader'
import { currentSection } from '@/zero/section'

function ReaderFallback(){
  const section=currentSection()
  return <div className={`column-${section.id}`}><WorkspaceTransition Icon={section.Icon} title={`Opening ${section.title}`} description={section.description}/></div>
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="zero-ui-theme">
      <Suspense fallback={<ReaderFallback/>}><Hub /></Suspense>
    </ThemeProvider>
  )
}


export default App
