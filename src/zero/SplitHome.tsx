import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { WorkspaceTransition } from '@/components/layout/WorkspaceLoader'
import { go } from './model'
import { ArrowRight, BookOpen, CircuitBoard, Code2 } from 'lucide-react'
import { ModeToggle } from '@/components/theme/mode-toggle'
import { site } from '@/content-adapter'
function BookDrawing(){return <div className="book-drawing"><div className="book-page page-left"><i/><i/><i/><i/><i/></div><div className="book-page page-right"><i/><i/><i/><i/><i/></div><div className="book-turn"><i/><i/><i/></div></div>}
function CircuitDrawing(){return <div className="circuit-drawing"><svg viewBox="0 0 280 210" fill="none" aria-hidden="true"><g className="circuit-lines"><path d="M20 40H85V80H110M20 170H65V125H110M260 40H200V80H170M260 170H215V125H170M140 12V65M140 145V198M40 105H110M170 105H245"/><path d="M85 12V30H110V65M195 198V175H170V145"/></g><g className="circuit-nodes"><circle cx="20" cy="40" r="4"/><circle cx="20" cy="170" r="4"/><circle cx="260" cy="40" r="4"/><circle cx="260" cy="170" r="4"/><circle cx="140" cy="12" r="4"/><circle cx="140" cy="198" r="4"/><circle cx="40" cy="105" r="4"/><circle cx="245" cy="105" r="4"/></g><rect className="circuit-chip" x="110" y="65" width="60" height="80" rx="7"/><path className="chip-symbol" d="M130 93L120 105L130 117M150 93L160 105L150 117M145 90L136 120"/></svg></div>}
function CodeDrawing(){return <div className="code-drawing"><div className="code-window window-back"><span/><span/><span/></div><div className="code-window window-front"><div className="code-window-bar"><i/><i/><i/></div><pre><span>project/</span>{'\n  '}src/{'\n  '}README.md{'\n\n'}<b>›</b> <em/></pre></div></div>}
export default function SplitHome(){
 const [entering,setEntering]=useState<number|null>(null)
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null)
 const navigating=useRef(false)
 useEffect(()=>()=>{if(timer.current!==null)clearTimeout(timer.current)},[])
 function openSection(event:MouseEvent<HTMLAnchorElement>,index:number){
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return
  event.preventDefault()
  if(navigating.current)return
  navigating.current=true
  void import('@/components/layout/AppShell').catch(()=>undefined)
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){go(columns[index].to);return}
  setEntering(index)
  timer.current=setTimeout(()=>go(columns[index].to),850)
 }

 const columns=[{id:'learn',number:'01',title:'Notes',description:'Notes, subjects, and references.',to:'/notes',Icon:BookOpen,Drawing:BookDrawing},{id:'hardware',number:'02',title:'Hardware builds',description:'Projects, experiments, and build notes.',to:'/build/hardware',Icon:CircuitBoard,Drawing:CircuitDrawing},{id:'software',number:'03',title:'Software projects',description:'Software and its documentation.',to:'/build/software',Icon:Code2,Drawing:CodeDrawing}]
 return <div className="split-home"><header className="split-home-header"><h1>Zero</h1><div><ModeToggle/></div></header><main className="split-home-columns" aria-label="Workspaces">{columns.map(({id,number,title,description,to,Icon,Drawing},index)=><a key={id} className={`home-column column-${id}`} href={site(to)} onClick={event=>openSection(event,index)}><div className="column-heading"><span>{number}</span><Icon size={19} strokeWidth={1.4}/></div><div className="column-visual" aria-hidden="true"><div className="column-grid"/><Drawing/></div><div className="column-label"><h2>{title}</h2><ArrowRight size={23} strokeWidth={1.3}/></div><p>{description}</p></a>)}</main>{entering!==null&&<div className={`home-entry-transition column-${columns[entering].id}`}><WorkspaceTransition Icon={columns[entering].Icon} title={`Opening ${columns[entering].title}`} description={columns[entering].description}/></div>}</div>
}
