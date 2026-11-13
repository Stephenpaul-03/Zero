import type { Catalog, Collection, ContentDocument, Group } from './zero/model'
import type { NavigationPageData, SidebarCategoryData } from './types/navigation'
import { documentRoute } from '../shared/routes.mjs'
export let catalog: Catalog = { schemaVersion:2,collections:[],documents:[],assets:[] }
export function setCatalog(value:Catalog){catalog=value}
export const site = (value: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${value.replace(/^\//, '')}`
export const documentUrl = (doc: ContentDocument) => site(`/zero-content/${doc.file.split('/').map(encodeURIComponent).join('/')}`)
export function groupTree(collection: Collection) {
  const ordered: Array<Group & { depth: number }> = []
  const seen = new Set<string>()
  function visit(parentId?: string, depth = 0) {
    collection.groups.filter(group => (group.parentId || undefined) === parentId).sort((a, b) => a.order - b.order).forEach(group => {
      if (seen.has(group.id)) return
      seen.add(group.id); ordered.push({ ...group, depth }); visit(group.id, depth + 1)
    })
  }
  visit(); return ordered
}
export function navigationFor(collectionId: string) {
  const collection = catalog.collections.find(item => item.id === collectionId)!
  const docs = catalog.documents.filter(doc => doc.collectionId === collectionId)
  const homeDoc = docs.find(doc => !doc.slug) || [...docs].sort((a, b) => a.order - b.order)[0]
  const homePage: NavigationPageData = { label: 'Overview', path: '/', slug: '', ...(homeDoc ? { resolvedUrl: documentUrl(homeDoc) } : {}) }
  const sidebarCategories: SidebarCategoryData[] = groupTree(collection).map(group => ({ id:group.id,parentId:group.parentId,title: group.title, depth: group.depth, items: docs.filter(doc => doc.groupId === group.id && doc.slug !== '').sort((a, b) => a.order - b.order).map(doc => ({ label: doc.title, path: `/${doc.slug}`, slug: doc.slug, resolvedUrl: documentUrl(doc) })) })).filter(group => group.items.length || collection.groups.some(child=>child.parentId===group.id))
  return { homePage, sidebarCategories, sidebarItems: sidebarCategories.flatMap(group => group.items) }
}
export function relativeRoute(pathname = window.location.pathname) {
  const prefix = import.meta.env.BASE_URL.replace(/\/$/, '')
  const pathnameWithoutPrefix = prefix && pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length) : pathname
  return decodeURIComponent(pathnameWithoutPrefix).replace(/\/$/, '') || '/'
}
export function readerKind(): 'learn' | 'build' { return relativeRoute().startsWith('/build') || catalog.documents.some(doc=>doc.publicPath===relativeRoute()) ? 'build' : 'learn' }
export function readerRoot(kind: 'learn' | 'build') { return site(kind==='build'?`/build/${relativeRoute().startsWith('/build/software')||relativeRoute().startsWith('/pages/')?'software':'hardware'}`:'/notes') }
export function readerPath(subject: { collectionId: string }, slug = '') {
  const collection = catalog.collections.find(item => item.id === subject.collectionId)!
  const actualSlug=slug === 'home' ? '' : slug
  const doc=catalog.documents.find(value=>value.collectionId===collection.id&&value.slug===actualSlug)
  return site(documentRoute(doc || { collectionId: collection.id, slug:actualSlug }, catalog))
}
export function parseReaderUrl(kind: 'learn' | 'build'): { subjectId: string; pagePath: string } | { isNotFound: true } | null {
  const route = relativeRoute()
  const publicDoc=catalog.documents.find(doc=>doc.publicPath===route)
  if(publicDoc){const menu=catalog.collections.find(value=>value.id===publicDoc.collectionId);if(menu?.kind===kind)return {subjectId:menu.id,pagePath:publicDoc.slug}}
  if (route === (kind==='learn'?'/notes':`/${kind}`) || (kind==='build' && ['/build/hardware','/build/software'].includes(route))) return null
  const collection = catalog.collections.find(item => {
    const prefix=documentRoute({collectionId:item.id,slug:''},catalog)
    return item.kind===kind&&item.listed&&(route===prefix||route.startsWith(`${prefix}/`))
  })
  if (!collection) return { isNotFound: true } as const
  const prefix = documentRoute({collectionId:collection.id,slug:''},catalog)
  if (route !== prefix && !route.startsWith(`${prefix}/`)) return { isNotFound: true } as const
  const sourceId = catalog.documents.find(doc => doc.collectionId === collection.id && doc.source)?.source?.path.split('/')[0]
  return { subjectId: kind==='learn' ? sourceId || collection.id : collection.id, pagePath: route.slice(prefix.length + 1) || 'home' }
}
