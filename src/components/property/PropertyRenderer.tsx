import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import { renderMarkdown } from '../../../shared/markdown.mjs'
import type { Heading } from '../../../shared/markdown.mjs'
import { catalog } from '@/content-adapter'
import type { NavigationPageData } from '@/types/navigation'
import type { Subject } from '@/constants/subjects'
import { DocumentLayout } from '@/components/property/layouts/DocumentLayout'
import { SplitLayout } from '@/components/property/layouts/SplitLayout'
import { QuizCard } from '@/components/property/layouts/QuizCard'
import 'prismjs/themes/prism-tomorrow.css'
type Props={onActiveSectionChange:(title?:string)=>void;activeSubject: Subject;currentPage:NavigationPageData;parentLabel?:string;fallback:ReactNode;onHeadingsLoaded:(headings:Heading[])=>void}
export function PropertyRenderer({onActiveSectionChange,currentPage,fallback,onHeadingsLoaded}:Props){
 const [rendered,setRendered]=useState<ReturnType<typeof renderMarkdown>|null>(null)
 const [loading,setLoading]=useState(true)
 const url=currentPage.resolvedUrl
 useEffect(()=>{
  setLoading(true);setRendered(null);onActiveSectionChange(undefined)
  if(!url){setLoading(false);onHeadingsLoaded?.([]);return}
  const controller=new AbortController()
  fetch(url,{signal:controller.signal,cache:'no-store'}).then(response=>{if(!response.ok||response.headers.get('content-type')?.includes('text/html'))throw new Error('Document unavailable');return response.text()}).then(source=>{
   const file=decodeURIComponent(url.split('/zero-content/')[1]||'')
   const result=renderMarkdown(source,{catalog,file,base:import.meta.env.BASE_URL,legacyHeadings:true})
   setRendered(result);onHeadingsLoaded?.(result.headings.filter(h=>h.depth===2));setLoading(false)
  }).catch(error=>{if(error.name!=='AbortError'){setLoading(false);onHeadingsLoaded?.([])}})
  return()=>controller.abort()
 },[url,onActiveSectionChange,onHeadingsLoaded])
 if(loading)return <div className="flex h-64 items-center justify-center" aria-label="Loading"><LoaderCircle className="size-5 animate-spin text-zinc-400"/></div>
 if(!rendered)return fallback
 const quizNode=rendered.quizzes.length?<QuizCard key={url} quizzes={rendered.quizzes}/>:null
 const layout=rendered.meta.layout||currentPage.layout
 return layout==='split'?<SplitLayout htmlContent={rendered.html} quizNode={quizNode}/>:<DocumentLayout htmlContent={rendered.html} quizNode={quizNode}/>
}
