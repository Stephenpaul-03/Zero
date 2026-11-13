import { createContext, useContext } from 'react'
import { catalog } from '@/content-adapter'
export interface Subject { id: string; label: string; sidebarUrl: string; description?: string; icon?: string; pillLabel?: string; tags: string[]; collectionId: string; routeSlug: string }
export function subjectsFor(kind: 'learn' | 'build', buildType?: 'hardware' | 'software'): Subject[] {
 return catalog.collections.filter(c => c.kind === kind && c.listed && (!buildType || (c.buildType || 'hardware') === buildType)).sort((a,b) => (catalog.categories?.find(g=>g.id===a.categoryId)?.order||0)-(catalog.categories?.find(g=>g.id===b.categoryId)?.order||0)||a.order-b.order).map(c => ({ id: c.kind==='learn' ? catalog.documents.find(d => d.collectionId === c.id && d.source)?.source?.path.split('/')[0] || c.id : c.id, label:c.title, sidebarUrl:'', description:c.description, icon:c.icon, pillLabel:catalog.categories?.find(g=>g.id===c.categoryId)?.title || c.category || 'Notes', tags:c.tags || [], collectionId:c.id, routeSlug:c.slug }))
}
export const SUBJECTS = subjectsFor('learn')
export const SubjectContext = createContext<Subject[]>(SUBJECTS)
export const useSubjects = () => useContext(SubjectContext)
