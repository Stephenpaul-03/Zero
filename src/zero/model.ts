import { documentRoute } from '../../shared/routes.mjs'
export type Kind = 'build' | 'docs' | 'learn'
export interface Group { publicApp?: string; id: string; title: string; slug: string; order: number; parentId?: string }
export interface Category { id: string; kind: Kind; buildType?: 'hardware'|'software'; title: string; order: number }
export interface Collection { websiteUrl?: string; buildType?: 'hardware' | 'software'; id: string; kind: Kind; slug: string; title: string; description: string; listed: boolean; order: number; groups: Group[]; tags: string[]; categoryId?: string; category?: string; icon?: string; status?: string; source?: string; sourceUrl?: string; projectId?: string; cover?: string }
export interface ContentDocument { publicPath?: string; id: string; collectionId: string; groupId: string; slug: string; title: string; file: string; order: number; originalName?: string; legacy?: string; source?: { repo: string; path: string; sha256: string } }
export interface Catalog { schemaVersion: number; collections: Collection[]; documents: ContentDocument[]; assets: string[]; assetAliases?: Record<string,string>; categories?: Category[] }
export const sections: Record<Kind, { label: string; eyebrow: string; description: string; color: string }> = {
  build: { label: 'Build', eyebrow: 'PROJECTS & EXPERIMENTS', description: 'Things in progress. Ideas on the workbench. A record of what happens when curiosity meets a little making.', color: 'amber' },
  docs: { label: 'Build docs', eyebrow: 'THE PROCESS, DOCUMENTED', description: 'The wiring, the decisions, the failed attempts, and the notes that make the next attempt a little easier.', color: 'blue' },
  learn: { label: 'Notes', eyebrow: 'NOTES FROM THE JOURNEY', description: 'Working notes, useful references, and explanations collected while figuring things out.', color: 'sage' },
}
export const base = import.meta.env.BASE_URL
export const site = (route: string) => `${base.replace(/\/$/, '')}/${route.replace(/^\//, '')}`
export const routeFor = (doc: ContentDocument, catalog: Catalog) => documentRoute(doc, catalog)
export const collectionRoute = (collection: Collection) => `/${collection.kind==='learn'?'notes':collection.kind}${collection.kind==='build'?`/${collection.buildType||'hardware'}`:''}/${collection.slug}`
export function orderedDocs(catalog: Catalog, collection: Collection) {
  const groups = [...collection.groups].sort((a, b) => a.order - b.order)
  return groups.flatMap(group => catalog.documents.filter(doc => doc.collectionId === collection.id && doc.groupId === group.id).sort((a, b) => a.order - b.order))
}
export function go(route: string, replace = false) {
  window.history[replace ? 'replaceState' : 'pushState']({}, '', site(route))
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0 })
}
