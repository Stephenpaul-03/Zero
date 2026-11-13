import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { ModeToggle } from '@/components/theme/mode-toggle'
import { SubjectContext, subjectsFor } from '@/constants/subjects'
import { catalog, setCatalog, relativeRoute, site } from '@/content-adapter'
import type { Catalog } from './model'
import SplitHome from './SplitHome'
import { GlobalHomePage } from '@/components/layout/GlobalHomePage'
import { documentRoute } from '../../shared/routes.mjs'
import './simple.css'
import './split-home.css'
import './accents.css'

const Admin = import.meta.env.DEV && import.meta.env.MODE === 'admin' ? lazy(() => import('./CreateWorkspace')) : null
const LatticeShell=lazy(()=>import('@/components/layout/AppShell').then(module=>({default:module.AppShell})))
function SmallHeader({ title = 'Zero' }: { title?: string }) {
  return <header className="simple-header"><a href={site('/')} className="simple-name">{title}</a><ModeToggle /></header>
}
function canonicalRoute(){
  const current=relativeRoute()
  if(current==='/learn'||current.startsWith('/learn/')){
    const next=current.replace(/^\/learn(?=\/|$)/,'/notes')
    window.history.replaceState(window.history.state,'',site(next)+window.location.search+window.location.hash)
    return next
  }
  return current
}
function Missing() { return <div className="simple-shell"><SmallHeader /><main className="simple-home"><h1>Page not found.</h1><a className="simple-back" href={site('/')}><ArrowLeft size={14} /> Back to Zero</a></main></div> }
export default function SimpleHub() {
  const [route, setRoute] = useState(canonicalRoute)
  useEffect(()=>{const next=canonicalRoute();if(next!==route)setRoute(next)},[route])
  const [ready,setReady]=useState(false)
  const [version,setVersion]=useState(0)
  const [error,setError]=useState('')
  const lastCatalog=useRef('')
  const refresh=useCallback(async()=>{
    const response=await fetch(site('/zero-content/catalog.json'),{cache:'no-store'})
    if(!response.ok||!response.headers.get('content-type')?.includes('application/json'))throw new Error('The saved content catalog could not be loaded.')
    const text=await response.text();if(text!==lastCatalog.current){setCatalog(JSON.parse(text) as Catalog);lastCatalog.current=text;setVersion(value=>value+1)}
    setReady(true);setError('')
  },[])
  useEffect(()=>{if(Admin)return;const run=()=>{void refresh().catch(cause=>setError(cause.message))};run();window.addEventListener('focus',run);return()=>window.removeEventListener('focus',run)},[refresh])
  const learning=subjectsFor('learn')
  const buildType=route.startsWith('/build/software')?'software':'hardware'
  const builds=subjectsFor('build',buildType)
  useEffect(() => { const listener = () => setRoute(canonicalRoute()); window.addEventListener('popstate', listener); return () => window.removeEventListener('popstate', listener) }, [])
  useEffect(() => { document.title = Admin ? 'Zero · Local admin' : route === '/' ? 'Zero' : route.startsWith('/notes') ? 'Notes · Zero' : route.startsWith('/build') ? 'Build · Zero' : 'Documentation · Zero' }, [route])
  if (Admin) return <div className="zero zero-admin"><header className="admin-local-header"><strong>Zero <span>Local admin</span></strong><div><a href="http://127.0.0.1:5173/" target="_blank" rel="noreferrer">Open site ↗</a><ModeToggle /></div></header><Suspense fallback={<p className="simple-description">Opening admin…</p>}><Admin onChanged={() => Promise.resolve()} /></Suspense></div>
  if(error)return <div className="simple-shell"><SmallHeader/><main className="simple-home"><h1>Content unavailable.</h1><p className="simple-description">{error}</p><button onClick={()=>void refresh().catch(cause=>setError(cause.message))}>Try again</button></main></div>
  if(!ready)return <div className="simple-shell"><SmallHeader/><main className="simple-home"><p className="simple-description">Loading notes…</p></main></div>
  if (route === '/' || route === '/build') return <SplitHome />
  if (route === '/notes' || route.startsWith('/notes/')) return <div className="reader-surface learn"><SubjectContext.Provider value={learning}><LatticeShell key={version}/></SubjectContext.Provider></div>
  if (route === '/build/hardware' || route.startsWith('/build/hardware/') || route === '/build/software' || route.startsWith('/build/software/')) return builds.length ? <div className={`reader-surface build ${buildType}`}><SubjectContext.Provider value={builds}><LatticeShell key={version}/></SubjectContext.Provider></div> : <div className={`reader-surface build ${buildType}`}><SubjectContext.Provider value={builds}><GlobalHomePage onSelectWorkspace={()=>{}} continueReading={null} onContinueReading={()=>{}}/></SubjectContext.Provider></div>
  if (route.startsWith('/pages/')) {
    const publicDoc=catalog.documents.find(doc=>doc.publicPath===route)
    if(publicDoc)return <div className="reader-surface build software"><SubjectContext.Provider value={subjectsFor('build','software')}><LatticeShell key={version}/></SubjectContext.Provider></div>
    return <Missing />
  }
  const legacy = catalog.documents.find(doc => `/${doc.legacy}` === route)
  if (legacy) { window.location.replace(site(documentRoute(legacy,catalog))+window.location.search+window.location.hash); return null }
  return <Missing />
}
