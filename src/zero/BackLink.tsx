import { ArrowLeft } from 'lucide-react'
import { relativeRoute, site } from '@/content-adapter'
import { currentSection } from './section'
import { Button } from '@/components/ui/button'
export function BackLink(){
 const section=currentSection();const atRoot=relativeRoute()===section.root
 const destination=atRoot?'Zero':section.title
 return <Button asChild variant="outline" className="section-back shadow-none"><a href={site(atRoot?'/':section.root)} aria-label={`Back to ${destination}`} title={`Back to ${destination}`}><ArrowLeft className="size-4"/><span>{destination}</span></a></Button>
}
