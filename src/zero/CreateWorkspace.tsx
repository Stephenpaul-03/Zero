import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { ArrowDown, ArrowRight, ArrowUp, Check, ChevronRight, CloudUpload, FileText, FolderPlus, Image, Pencil, Plus, Save, Settings2, Trash2, Upload, X } from 'lucide-react'
import { parseSource, slugify } from '../../shared/markdown.mjs'
import { destinationFolder, groupPath, publicPagePath } from '../../shared/navigation.mjs'
import { categoriesForSection, collectionsForSection } from '../../shared/admin-sections.mjs'
import { groupTree } from '@/content-adapter'
import { Markdown } from './Markdown'
import { base, collectionRoute, routeFor, site } from './model'
import type { Catalog, Collection, ContentDocument, Group, Kind } from './model'
import './create.css'
import './zero.css'
import './admin-order.css'

interface UploadItem { id: string; name: string; source: string; title: string; slug: string; collectionId: string; groupId: string; replaceId?: string }
interface AssetItem { id: string; name: string; data: string; mime: string; collectionId: string; groupId: string }
interface GitState { ready: boolean; reason?: string; branch?: string; name?: string; changes?: number }
interface DraftSummary { id: string; title: string; savedAt: string }
interface StateResponse { catalog: Catalog; revision: string; token: string; git: GitState; drafts: DraftSummary[] }
interface SavedDraft { buildType?: 'hardware'|'software'; id?: string; title: string; catalog: Catalog; revision: string; imports: UploadItem[]; assets: AssetItem[]; kind: Kind; collectionId: string; groupId: string; categoryId?:string }
const contentTabs=[{id:'notes',label:'Notes',kind:'learn',buildType:'hardware'},{id:'hardware',label:'Hardware builds',kind:'build',buildType:'hardware'},{id:'software',label:'Software projects',kind:'build',buildType:'software'}] as const
const blankGit: GitState = { ready: false }
async function request<T>(route: string, token?: string, body?: unknown): Promise<T> {
  const response = await fetch(`/__zero/${route}`, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { 'X-Zero-Token': token } : {}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) })
  if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('Start the separate local admin with npm run admin, then open http://127.0.0.1:5175.')
  const result = await response.json()
  if (!response.ok) throw new Error(result.error || 'The action could not be completed.')
  return result as T
}
const fileFor = (item: UploadItem, catalog: Catalog) => catalog.documents.find(doc => doc.id === item.replaceId)?.file || `${destinationFolder(catalog,item.collectionId,item.groupId)}/${item.name}`
function slugFor(item: UploadItem, catalog: Catalog, queue: UploadItem[]) {
  const existing = catalog.documents.find(doc => doc.id === item.replaceId)
  if (existing) return existing.slug
  const collection = catalog.collections.find(value => value.id === item.collectionId)
  const group = collection?.groups.find(value => value.id === item.groupId)
  const earlier = queue.slice(0, queue.findIndex(value => value.id === item.id))
  const rootOccupied = catalog.documents.some(doc => doc.collectionId === item.collectionId && !doc.slug) || earlier.some(value => value.collectionId === item.collectionId && catalog.collections.find(menu => menu.id === value.collectionId)?.groups.find(entry => entry.id === value.groupId)?.slug === 'overview')
  if (collection?.kind === 'build' && group?.slug === 'overview' && !rootOccupied) return ''
  return `${collection && group ? groupPath(collection,group.id) : 'notes'}/${slugify(item.slug)}`
}

function MenuDialog({ kind, defaultBuildType='hardware', current, catalog, onClose, onSave }: { kind: Kind; defaultBuildType?: 'hardware'|'software'; current?: Collection; catalog: Catalog; onClose: () => void; onSave: (value: Collection) => void }) {
  const [title, setTitle] = useState(current?.title || '')
  const [slug, setSlug] = useState(current?.slug || '')
  const [description, setDescription] = useState(current?.description || '')
  const [status, setStatus] = useState(current?.status || 'In progress')
  const [buildType,setBuildType]=useState<'hardware'|'software'>(current?.buildType || defaultBuildType)
  const [tags, setTags] = useState(current?.tags.join(', ') || '')
  const [sourceUrl, setSourceUrl] = useState(current?.sourceUrl || '')
  const [websiteUrl,setWebsiteUrl]=useState(current?.websiteUrl||'')
  const [cover, setCover] = useState(current?.cover || '')
  const [projectId, setProjectId] = useState(current?.projectId || '')
  const [error, setError] = useState('')
  function submit() {
    const nextSlug = slugify(slug || title)
    if (!title.trim()) { setError('Give this menu a name.'); return }
    if (catalog.collections.some(menu => menu.kind === kind && (kind!=='build' || (menu.buildType||'hardware')===buildType) && menu.slug === nextSlug && menu.id !== current?.id)) { setError('A menu with that URL already exists.'); return }
    if(buildType==='hardware'&&(current?.groups.some(group=>group.publicApp)||catalog.documents.some(doc=>doc.collectionId===current?.id&&doc.publicPath))){setError('Projects with public legal pages must stay in Software projects.');return}
    const id = current?.id || crypto.randomUUID()
    onSave({ ...current, id, kind, title: title.trim(), slug: nextSlug, description, listed: current?.listed ?? true, tags: tags.split(',').map(tag => tag.trim()).filter(Boolean), order: current?.order ?? catalog.collections.length, groups: current?.groups || [{ id: `${id}-overview`, title: 'Overview', slug: 'overview', order: 0 }], ...(kind === 'build' ? { status, sourceUrl, cover, buildType, websiteUrl } : {}), ...(kind === 'docs' && projectId ? { projectId } : {}) })
  }
  return <div className="zc-modal-backdrop"><section className="zc-modal" role="dialog" aria-modal="true" aria-label={current ? 'Edit menu' : 'New menu'}><header><div><span className="zero-mono">{kind==='learn'?'Notes':buildType==='software'?'Software projects':'Hardware builds'}</span><h2>{current ? 'Edit this menu' : 'New menu'}</h2></div><button className="zero-icon-button" onClick={onClose} aria-label="Close menu dialog"><X size={19} /></button></header><form onSubmit={event => { event.preventDefault(); submit() }}><label>Menu name<input autoFocus value={title} onChange={event => { setTitle(event.target.value); if (!current && (!slug || slug === slugify(title))) setSlug(slugify(event.target.value)) }} placeholder={kind === 'learn' ? 'e.g. Electronics fundamentals' : buildType==='software'?'e.g. Task tracker':'e.g. Weather station'} /></label><label>URL name<input value={slug} onChange={event => setSlug(event.target.value)} placeholder="weather-station" /><small>/{kind==='learn'?'notes':kind}/{kind==='build'?buildType+'/':''}{slugify(slug || title)}</small></label><label>Description<textarea rows={3} value={description} onChange={event => setDescription(event.target.value)} placeholder="A little context for this workspace." /></label>{kind === 'build' && <><label>Destination<select aria-label="Destination" value={buildType} onChange={event=>setBuildType(event.target.value as 'hardware'|'software')}><option value="hardware">Hardware builds</option><option value="software">Software projects</option></select></label><label>Project status<input value={status} onChange={event => setStatus(event.target.value)} /></label><label>Source URL<input type="url" value={sourceUrl} onChange={event => setSourceUrl(event.target.value)} placeholder="https://github.com/…" /></label><label>Live website URL<input type="url" value={websiteUrl} onChange={event=>setWebsiteUrl(event.target.value)} placeholder="https://example.com"/></label><label>Cover image URL<input value={cover} onChange={event => setCover(event.target.value)} placeholder="Optional image URL" /></label></>}{kind === 'docs' && <label>Related build<select value={projectId} onChange={event => setProjectId(event.target.value)}><option value="">Standalone documentation</option>{catalog.collections.filter(menu => menu.kind === 'build').map(menu => <option key={menu.id} value={menu.id}>{menu.title}</option>)}</select></label>}<label>Tags<input value={tags} onChange={event => setTags(event.target.value)} placeholder="Hardware, Sensors, Notes" /></label>{error && <p role="alert" className="zc-error-text">{error}</p>}<footer><button type="button" className="zero-button" onClick={onClose}>Cancel</button><button className="zero-button primary" type="submit">{current ? 'Save menu' : 'Create menu'}<ArrowRight size={14} /></button></footer></form></section></div>
}

export default function CreateWorkspace({ onChanged }: { onChanged: () => Promise<void> }) {
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [baseline, setBaseline] = useState('')
  const [revision, setRevision] = useState('')
  const [token, setToken] = useState('')
  const [git, setGit] = useState<GitState>(blankGit)
  const [drafts, setDrafts] = useState<DraftSummary[]>([])
  const [draftId, setDraftId] = useState<string | undefined>()
  const [kind, setKind] = useState<Kind>('learn')
  const [buildType,setBuildType]=useState<'hardware'|'software'>('hardware')
  const sectionIndex=kind==='learn'?0:buildType==='hardware'?1:2
  const sectionLabel=contentTabs[sectionIndex].label
  const [collectionId, setCollectionId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categoryDialog, setCategoryDialog] = useState<{id?:string;title:string}|null>(null)
  const [groupId, setGroupId] = useState('')
  const [queue, setQueue] = useState<UploadItem[]>([])
  const [assets, setAssets] = useState<AssetItem[]>([])
  const [status, setStatus] = useState('')
  const [failure, setFailure] = useState('')
  const [busy, setBusy] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [menuDialog, setMenuDialog] = useState<{ current?: Collection } | null>(null)
  const [groupDialog, setGroupDialog] = useState<{ id?: string; title: string; slug: string; parentId?:string; publicApp?:string } | null>(null)
  const [selectedUpload, setSelectedUpload] = useState('')
  const [existingPreview, setExistingPreview] = useState<{ document: ContentDocument; source: string } | null>(null)
  const [editing, setEditing] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [commitMessage, setCommitMessage] = useState('Update Zero content')
  const input = useRef<HTMLInputElement>(null)
  const load = useCallback(async () => {
    const result = await request<StateResponse>('state')
    setCatalog(result.catalog); setBaseline(JSON.stringify(result.catalog)); setRevision(result.revision); setToken(result.token); setGit(result.git); setDrafts(result.drafts)
  }, [])
  useEffect(() => { void load().catch(error => setFailure(error.message)) }, [load])
  const categories = catalog?categoriesForSection(catalog,kind,buildType):[]
  const category = categories.find(value=>value.id===categoryId)||categories[0]
  const menus = catalog?collectionsForSection(catalog,kind,buildType).filter(menu=>!category||menu.categoryId===category.id).sort((a,b)=>a.order-b.order):[]
  const collection = menus.find(menu => menu.id === collectionId) || menus[0]
  const groups = collection ? groupTree(collection) : []
  const group = groups.find(entry => entry.id === groupId) || groups[0]
  const existing = catalog?.documents.filter(doc => doc.collectionId === collection?.id && doc.groupId === group?.id).sort((a, b) => a.order - b.order) || []
  const navChanged = catalog !== null && baseline !== JSON.stringify(catalog)
  const pending = navChanged || queue.length > 0 || assets.length > 0
  const conflicts = useMemo(() => {
    const results = new Map<string, { error?: string; doc?: ContentDocument }>()
    if (!catalog) return results
    const paths = new Set<string>()
    for (const item of queue) {
      const target = catalog.collections.find(menu => menu.id === item.collectionId)
      const section = target?.groups.find(entry => entry.id === item.groupId)
      if (!target || !section) { results.set(item.id, { error: 'This destination no longer exists. Move these files to a menu first.' }); continue }
      const nextSlug = slugFor(item, catalog, queue)
      const doc = catalog.documents.find(value => value.collectionId === item.collectionId && (value.slug === nextSlug || (value.groupId === item.groupId && value.file.split('/').at(-1)?.toLowerCase() === item.name.toLowerCase())))
      const routeKey = `${item.collectionId}/${nextSlug}`
      let error = !item.title.trim() ? 'Add a title.' : paths.has(routeKey) ? 'Two incoming files use the same URL.' : undefined
      if (doc && item.replaceId !== doc.id) error = 'A document already exists here. Choose Replace below, or change the URL.'
      results.set(item.id, { error, doc }); paths.add(routeKey)
    }
    return results
  }, [catalog, queue])
  const hasConflicts = [...conflicts.values()].some(value => value.error)
  const upload = queue.find(item => item.id === selectedUpload)
  const previewFile = upload && catalog && catalog.collections.some(value=>value.id===upload.collectionId&&value.groups.some(section=>section.id===upload.groupId)) ? fileFor(upload, catalog) : existingPreview?.document.file || ''
  const previewSource = upload?.source ?? existingPreview?.source
  const previewTitle = upload?.title ?? existingPreview?.document.title
  const previewCatalog = useMemo(() => {
    if (!catalog) return null
    return { ...catalog, documents: [...catalog.documents, ...queue.filter(item => !item.replaceId).filter(item=>catalog.collections.some(menu=>menu.id===item.collectionId&&menu.groups.some(section=>section.id===item.groupId))).map(item => ({ id: item.id, title: item.title, file: fileFor(item, catalog), collectionId: item.collectionId, groupId: item.groupId, slug: slugFor(item, catalog, queue), publicPath: publicPagePath(catalog.collections.find(menu=>menu.id===item.collectionId)!,item.groupId,slugify(item.slug)), order: 0 }))], assets: [...catalog.assets, ...assets.filter(item=>catalog.collections.some(menu=>menu.id===item.collectionId)).map(item => `${destinationFolder(catalog,item.collectionId,item.groupId)}/${item.name}`)] }
  }, [catalog, queue, assets])
  const assetUrls = useMemo(() => catalog ? Object.fromEntries(assets.filter(item=>catalog.collections.some(menu=>menu.id===item.collectionId)).map(item => [`${destinationFolder(catalog,item.collectionId,item.groupId)}/${item.name}`, `data:${item.mime};base64,${item.data}`])) : {}, [assets,catalog])

  function selectSection(index:number){
    const tab=contentTabs[index]
    setKind(tab.kind);setBuildType(tab.buildType);setCategoryId('');setCollectionId('');setGroupId('');setSelectedUpload('');setExistingPreview(null);setEditing(false)
  }
  function changeMenu(value:Collection){
    if(!catalog)return
    const domain=value.buildType||'hardware'
    const options=categoriesForSection(catalog,value.kind,domain)
    const target=options.find(entry=>entry.id===value.categoryId)||(value.kind===kind&&(kind!=='build'||domain===buildType)?category:options[0])
    const next={...value,categoryId:target?.id,category:target?.title}
    setCatalog(current=>current&&{...current,collections:current.collections.some(menu=>menu.id===next.id)?current.collections.map(menu=>menu.id===next.id?next:menu):[...current.collections,next]})
    setKind(next.kind);setBuildType(domain);setCategoryId(target?.id||'');setCollectionId(next.id);setGroupId(next.groups[0]?.id||'');setMenuDialog(null)
  }
  function saveGroup() {
    if (!catalog || !collection || !groupDialog?.title.trim()) return
    let parent=groupDialog.parentId
    while(parent){if(parent===groupDialog.id){setFailure('A sidebar section cannot be its own parent.');return}parent=collection.groups.find(value=>value.id===parent)?.parentId}
    const slug = slugify(groupDialog.slug || groupDialog.title)
    if (collection.groups.some(entry => entry.slug === slug && entry.parentId===groupDialog.parentId && entry.id !== groupDialog.id)) { setFailure('That sidebar section URL already exists.'); return }
    const next: Group = { ...(collection.groups.find(value=>value.id===groupDialog.id)||{}), publicApp:groupDialog.publicApp?.trim()||undefined, id: groupDialog.id || crypto.randomUUID(), title: groupDialog.title.trim(), slug, parentId:groupDialog.parentId, order: groupDialog.id ? collection.groups.find(entry => entry.id === groupDialog.id)?.order || 0 : groups.filter(value=>value.parentId===groupDialog.parentId).length }
    changeMenu({ ...collection, groups: groupDialog.id ? collection.groups.map(entry => entry.id === next.id ? next : entry) : [...collection.groups, next] })
    setGroupId(next.id); setGroupDialog(null)
  }
  function moveMenu(delta: number) {
    if (!collection || !catalog) return
    const index = menus.findIndex(menu => menu.id === collection.id); const next = index + delta
    if (next < 0 || next >= menus.length) return
    const ordered = [...menus]; [ordered[index], ordered[next]] = [ordered[next], ordered[index]]
    setCatalog({ ...catalog, collections: catalog.collections.map(menu => menu.kind === kind ? { ...menu, order: ordered.findIndex(item => item.id === menu.id) } : menu) })
  }
  function moveGroup(id: string, delta: number) {
    if (!collection) return
    const parent=groups.find(value=>value.id===id)?.parentId
    const siblings=groups.filter(value=>value.parentId===parent)
    const index = siblings.findIndex(entry => entry.id === id); const next = index + delta
    if (next < 0 || next >= siblings.length) return
    const ordered = [...siblings]; [ordered[index], ordered[next]] = [ordered[next], ordered[index]]
    changeMenu({ ...collection, groups: collection.groups.map(entry=>ordered.some(value=>value.id===entry.id)?{...entry,order:ordered.findIndex(value=>value.id===entry.id)}:entry) }); setGroupId(id)
  }
  function moveDocument(doc: ContentDocument, delta: number) {
    if (!catalog) return
    const index = existing.findIndex(value => value.id === doc.id); const next = index + delta
    if (next < 0 || next >= existing.length) return
    const ordered = [...existing]; [ordered[index], ordered[next]] = [ordered[next], ordered[index]]
    setCatalog({ ...catalog, documents: catalog.documents.map(value => value.groupId === doc.groupId ? { ...value, order: ordered.findIndex(entry => entry.id === value.id) } : value) })
  }
  function startDrag(event:DragEvent, type:string, id:string){event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('application/x-zero-navigation',JSON.stringify({type,id}))}
  function allowDrop(event:DragEvent){if(Array.from(event.dataTransfer.types).includes('application/x-zero-navigation')){event.preventDefault();event.dataTransfer.dropEffect='move'}}
  function dropNavigation(event:DragEvent,targetType:string,targetId:string){
    const raw=event.dataTransfer.getData('application/x-zero-navigation');if(!raw||!catalog)return
    event.preventDefault();event.stopPropagation();const entry=JSON.parse(raw) as {type:string;id:string}
    if(entry.id===targetId)return
    const reorder=<T extends {id:string;order:number}>(items:T[])=>{const sorted=[...items].sort((a,b)=>a.order-b.order);const from=sorted.findIndex(item=>item.id===entry.id);const to=sorted.findIndex(item=>item.id===targetId);if(from<0||to<0)return items;const [moved]=sorted.splice(from,1);sorted.splice(to,0,moved);return sorted.map((item,order)=>({...item,order}))}
    if(entry.type==='upload'&&targetType==='upload'){setQueue(current=>{const from=current.findIndex(item=>item.id===entry.id),to=current.findIndex(item=>item.id===targetId);const values=[...current];const [moved]=values.splice(from,1);values.splice(to,0,moved);return values});return}
    if(entry.type==='category'&&targetType==='category'){const ordered=reorder(categories);setCatalog({...catalog,categories:(catalog.categories||[]).map(value=>ordered.find(item=>item.id===value.id)||value)})}
    else if(entry.type==='menu'&&targetType==='category'){const next=catalog.categories?.find(value=>value.id===targetId);if(next)setCatalog({...catalog,collections:catalog.collections.map(value=>value.id===entry.id?{...value,categoryId:next.id,category:next.title,order:catalog.collections.filter(item=>item.categoryId===next.id).length}:value)})}
    else if(entry.type==='menu'&&targetType==='menu'){const ordered=reorder(menus);setCatalog({...catalog,collections:catalog.collections.map(value=>ordered.find(item=>item.id===value.id)||value)})}
    else if(entry.type==='group'&&targetType==='group'&&collection){
      const moved=collection.groups.find(value=>value.id===entry.id),target=collection.groups.find(value=>value.id===targetId);if(!moved||!target)return
      let parent=target.parentId;while(parent){if(parent===moved.id){setFailure('A section cannot be moved inside itself.');return}parent=collection.groups.find(value=>value.id===parent)?.parentId}
      const siblings=collection.groups.filter(value=>value.parentId===target.parentId&&value.id!==moved.id).sort((a,b)=>a.order-b.order);siblings.splice(siblings.findIndex(value=>value.id===target.id),0,{...moved,parentId:target.parentId});
      const ordered=siblings.map((value,order)=>({...value,order}));changeMenu({...collection,groups:collection.groups.map(value=>ordered.find(item=>item.id===value.id)||value)});setGroupId(moved.id)
    }else if(entry.type==='document'&&targetType==='document'){const ordered=reorder(existing);setCatalog({...catalog,documents:catalog.documents.map(value=>ordered.find(item=>item.id===value.id)||value)})}
    else if(entry.type==='document'&&(targetType==='group'||targetType==='menu')){const targetMenu=targetType==='menu'?catalog.collections.find(value=>value.id===targetId):catalog.collections.find(value=>value.groups.some(section=>section.id===targetId));const targetGroup=targetType==='group'?targetMenu?.groups.find(value=>value.id===targetId):targetMenu?.groups[0];if(targetMenu&&targetGroup)setCatalog({...catalog,documents:catalog.documents.map(value=>value.id===entry.id?{...value,collectionId:targetMenu.id,groupId:targetGroup.id,order:catalog.documents.filter(doc=>doc.groupId===targetGroup.id).length}:value)})}
    setStatus('Navigation order updated. Save to write it to the repository.')
  }
  function saveCategory(){
    if(!catalog||!categoryDialog?.title.trim())return
    if(categories.some(value=>value.title===categoryDialog.title.trim()&&value.id!==categoryDialog.id)){setFailure('A topic group with this name already exists.');return}
    const next={...(categories.find(value=>value.id===categoryDialog.id)||{}),...(kind==='build'&&!categoryDialog.id?{buildType}:{}),id:categoryDialog.id||crypto.randomUUID(),kind,title:categoryDialog.title.trim(),order:categoryDialog.id?categories.find(value=>value.id===categoryDialog.id)?.order||0:categories.length}
    setCatalog({...catalog,categories:categoryDialog.id?(catalog.categories||[]).map(value=>value.id===next.id?next:value):[...(catalog.categories||[]),next],collections:catalog.collections.map(value=>value.categoryId===next.id?{...value,category:next.title}:value)})
    setCategoryId(next.id);setCollectionId('');setGroupId('');setCategoryDialog(null)
  }
  async function receiveFiles(files: File[]) {
    if (!collection || !group) { setFailure('Choose or create a menu and a sidebar section before dropping files.'); return }
    setFailure(''); const documents: UploadItem[] = []; const images: AssetItem[] = []; const skipped: string[] = []
    for (const file of files) {
      if (file.size > 8 * 1024 * 1024) { skipped.push(`${file.name} is larger than 8 MB`); continue }
      if (/\.(md|markdown)$/i.test(file.name)) {
        const source = await file.text(); const parsed = parseSource(source)
        documents.push({ id: crypto.randomUUID(), name: file.name, source, title: parsed.meta.title || source.match(/^#\s+(.+)$/m)?.[1]?.trim() || file.name.replace(/\.(md|markdown)$/i, '').replace(/[-_]/g, ' '), slug: slugify(file.name.replace(/\.(md|markdown)$/i, '')), collectionId: collection.id, groupId: group.id })
      } else if (/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(file.name)) {
        const data = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = reject; reader.readAsDataURL(file) })
        images.push({ id: crypto.randomUUID(), name: file.name, data, mime: file.type || 'image/png', collectionId: collection.id, groupId: group.id })
      } else skipped.push(`${file.name} is not Markdown or a supported image`)
    }
    setQueue(current => [...current, ...documents]); setAssets(current => [...current, ...images])
    if (documents[0]) { setSelectedUpload(documents[0].id); setExistingPreview(null); setEditing(false) }
    setStatus(`${documents.length} Markdown file${documents.length === 1 ? '' : 's'} and ${images.length} image${images.length === 1 ? '' : 's'} added to the import queue.`)
    if (skipped.length) setFailure(skipped.join('; '))
  }
  function blankDocument() {
    if (!collection || !group) return
    const item: UploadItem = { id: crypto.randomUUID(), name: 'untitled.md', source: '# Untitled\n\n', title: 'Untitled', slug: 'untitled', collectionId: collection.id, groupId: group.id }
    setQueue(current => [...current, item]); setSelectedUpload(item.id); setExistingPreview(null); setEditing(true)
  }
  async function openDocument(doc: ContentDocument) {
    setFailure(''); setSelectedUpload(''); setEditing(false)
    try { setExistingPreview(await request<{ document: ContentDocument; source: string }>(`document?id=${encodeURIComponent(doc.id)}`)) }
    catch (error) { setFailure(error instanceof Error ? error.message : 'Could not open this file.') }
  }
  function editExisting() {
    if (!existingPreview) return
    const doc = existingPreview.document
    const item: UploadItem = { id: crypto.randomUUID(), replaceId: doc.id, name: doc.file.split('/').at(-1) || 'document.md', source: existingPreview.source, title: doc.title, slug: doc.slug.split('/').at(-1) || 'overview', collectionId: doc.collectionId, groupId: doc.groupId }
    setQueue(current => [...current.filter(value => value.replaceId !== doc.id), item]); setSelectedUpload(item.id); setExistingPreview(null); setEditing(true)
  }
  async function apply() {
    if (!catalog || hasConflicts) return
    setBusy(true); setFailure('')
    try {
      const result = await request<{ catalog: Catalog; revision: string; imported: number; deleted: number }>('apply', token, { revision, catalog, imports: queue, assets })
      setCatalog(result.catalog); setBaseline(JSON.stringify(result.catalog)); setRevision(result.revision); setQueue([]); setAssets([]); setSelectedUpload(''); setExistingPreview(null); setDraftId(undefined)
      await onChanged(); const state = await request<StateResponse>('state'); setGit(state.git)
      setStatus(`Saved to repository. ${result.imported} document${result.imported === 1 ? '' : 's'} imported${result.deleted ? `, ${result.deleted} removed` : ''}. These changes are ready to publish when you choose.`)
    } catch (error) { setFailure(error instanceof Error ? error.message : 'The import failed. Your queued files are still here.') }
    finally { setBusy(false) }
  }
  async function saveDraft() {
    if (!catalog) return
    setBusy(true); setFailure('')
    try {
      const value: SavedDraft = { id: draftId, title: `${collection?.title || sectionLabel} · ${queue.length} files`, catalog, revision, imports: queue, assets, kind, buildType, categoryId:category?.id, collectionId: collection?.id || '', groupId: group?.id || '' }
      const result = await request<{ id: string }>('draft', token, value); setDraftId(result.id)
      const state = await request<StateResponse>('state'); setDrafts(state.drafts); setStatus('Import draft saved on this computer. It is excluded from the public site and Git publishing.')
    } catch (error) { setFailure(error instanceof Error ? error.message : 'The draft could not be saved.') }
    finally { setBusy(false) }
  }
  async function restoreDraft(id: string) {
    if (!id) return
    setBusy(true); setFailure('')
    try {
      const draft = await request<SavedDraft>(`draft?id=${encodeURIComponent(id)}`)
      if (draft.revision === revision) setCatalog(draft.catalog)
      setQueue(draft.imports); setAssets(draft.assets); setDraftId(draft.id); setKind(draft.kind==='docs'?'build':draft.kind); setBuildType(draft.buildType||draft.catalog.collections.find(menu=>menu.id===draft.collectionId)?.buildType||'hardware'); setCategoryId(draft.categoryId||draft.catalog.collections.find(value=>value.id===draft.collectionId)?.categoryId||''); setCollectionId(draft.collectionId); setGroupId(draft.groupId); setSelectedUpload(draft.imports[0]?.id || ''); setExistingPreview(null)
      setStatus(draft.revision === revision ? 'Draft restored, including its navigation changes and original Markdown.' : 'Draft files restored onto the current navigation. If a destination has moved, choose it and use “Move queued files here”.')
    } catch (error) { setFailure(error instanceof Error ? error.message : 'The draft could not be restored.') }
    finally { setBusy(false) }
  }
  async function publish() {
    setBusy(true); setFailure('')
    try { const result = await request<{ pushed: boolean; commit: string; message: string }>('publish', token, { message: commitMessage }); setStatus(result.message); if (result.pushed) setPublishOpen(false); const state = await request<StateResponse>('state'); setGit(state.git) }
    catch (error) { setFailure(error instanceof Error ? error.message : 'Publishing failed.') }
    finally { setBusy(false) }
  }
  if (!catalog) return <main className="zero-container zero-index"><span className="zero-mono">LOCAL CREATE MODE</span>{failure ? <div className="zero-error" role="alert"><h1>Create Mode couldn’t connect.</h1><p>{failure}</p><button className="zero-button" onClick={() => { setFailure(''); void load().catch(error => setFailure(error.message)) }}>Reconnect</button></div> : <div className="zero-loading">Opening the import desk…</div>}</main>

  return <main className="zc-workspace"><div className="zc-titlebar"><div><div className="zero-eyebrow"><span className="zero-live-dot" /> LOCAL WORKSPACE</div><h1>Content manager</h1><p>Choose a destination, then drop Markdown files.</p></div><div className="zc-title-actions"><select aria-label="Restore saved draft" value="" disabled={busy || !drafts.length} onChange={event => void restoreDraft(event.target.value)}><option value="">Saved drafts{drafts.length ? ` (${drafts.length})` : ''}</option>{drafts.map(draft => <option key={draft.id} value={draft.id}>{draft.title} · {new Date(draft.savedAt).toLocaleDateString()}</option>)}</select><button className="zero-button" onClick={() => void saveDraft()} disabled={busy || !pending}><Save size={14} /> Save draft</button><button className="zero-button primary" onClick={() => setPublishOpen(true)} disabled={busy || !git.ready || pending}>Publish <ArrowUpRightIcon /></button></div></div>
    {(failure || status) && <div className={failure ? 'zc-message error' : 'zc-message'} role={failure ? 'alert' : 'status'}>{failure || status}<button className="zero-icon-button" aria-label="Dismiss message" onClick={() => { setFailure(''); setStatus('') }}><X size={15} /></button></div>}
    <div className="zc-section-tabs" role="tablist" aria-label="Content sections">{contentTabs.map((tab,index)=><button key={tab.id} id={'zc-tab-'+tab.id} role="tab" aria-selected={sectionIndex===index} aria-controls="zc-section-panel" tabIndex={sectionIndex===index?0:-1} disabled={busy} onClick={()=>selectSection(index)} onKeyDown={event=>{let next:number|undefined;if(event.key==='ArrowRight')next=(index+1)%3;else if(event.key==='ArrowLeft')next=(index+2)%3;else if(event.key==='Home')next=0;else if(event.key==='End')next=2;if(next!==undefined){event.preventDefault();selectSection(next);event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()}}}>{tab.label}</button>)}</div><div className="zc-layout" role="tabpanel" id="zc-section-panel" aria-labelledby={'zc-tab-'+contentTabs[sectionIndex].id}><aside className="zc-navigation"><div className="zc-step"><span>01</span><div><h2>Choose a destination</h2><p>Your files follow this navigation.</p></div></div><div className="zc-list-heading"><span>TOPIC GROUPS</span><div><button className="zero-icon-button" aria-label="Rename topic group" disabled={!category} onClick={()=>category&&setCategoryDialog({id:category.id,title:category.title})}><Pencil size={14}/></button><button className="zero-icon-button" aria-label="New topic group" onClick={()=>setCategoryDialog({title:''})}><Plus size={15}/></button></div></div><div className="zc-category-list">{categories.map(value=><button key={value.id} aria-label={value.title} draggable onDragStart={event=>startDrag(event,'category',value.id)} onDragOver={allowDrop} onDrop={event=>dropNavigation(event,'category',value.id)} aria-current={category?.id===value.id?'true':undefined} onClick={()=>{setCategoryId(value.id);setCollectionId('');setGroupId('')}}>{value.title}</button>)}</div><div className="zc-list-heading"><span>{kind === 'build' ? 'PROJECT MENUS' : 'MENUS'}</span><button className="zero-icon-button" onClick={() => setMenuDialog({})} aria-label="New menu"><FolderPlus size={16} /></button></div><div className="zc-menu-list">{menus.map(menu => <button key={menu.id} draggable onDragStart={event=>startDrag(event,'menu',menu.id)} onDragOver={allowDrop} onDrop={event=>dropNavigation(event,'menu',menu.id)} className={collection?.id === menu.id ? 'selected' : ''} onClick={() => { setCollectionId(menu.id); setGroupId('') }}><span>{menu.title}</span><small>{catalog.documents.filter(doc => doc.collectionId === menu.id).length}</small></button>)}{!menus.length && <p className="zc-help">Create your first menu to begin.</p>}</div><button className="zc-text-button" onClick={() => setMenuDialog({})}><Plus size={13} /> New menu</button>{collection && <><div className="zc-menu-tools"><button onClick={() => setMenuDialog({ current: collection })}><Settings2 size={12} /> Menu settings</button><button onClick={() => moveMenu(-1)} aria-label="Move menu up"><ArrowUp size={12} /></button><button onClick={() => moveMenu(1)} aria-label="Move menu down"><ArrowDown size={12} /></button><button className="zc-delete" aria-label="Delete menu" onClick={() => { if (window.confirm(`Remove ${collection.title} and its ${catalog.documents.filter(doc => doc.collectionId === collection.id).length} documents? The removal is applied when you save navigation.`)) { setCatalog({ ...catalog, collections: catalog.collections.filter(menu => menu.id !== collection.id), documents: catalog.documents.filter(doc => doc.collectionId !== collection.id) }); setCollectionId(''); setGroupId('') } }}><Trash2 size={12} /></button></div><div className="zc-list-heading"><span>SIDEBAR SECTIONS</span><button className="zero-icon-button" aria-label="New sidebar section" onClick={() => setGroupDialog({ title: '', slug: '' })}><Plus size={16} /></button></div><div className="zc-group-list">{groups.map(entry => <div key={entry.id} style={{marginLeft:entry.depth*12}} draggable onDragStart={event=>{event.stopPropagation();startDrag(event,'group',entry.id)}} onDragOver={allowDrop} onDrop={event=>dropNavigation(event,'group',entry.id)} className={group?.id === entry.id ? 'selected' : ''}><button onClick={() => setGroupId(entry.id)}><span className="zc-tree-line" />{entry.title}<small>{catalog.documents.filter(doc => doc.groupId === entry.id).length}</small></button><div><button aria-label={`Edit ${entry.title} section`} onClick={() => setGroupDialog({ id: entry.id, title: entry.title, slug: entry.slug, parentId:entry.parentId, publicApp:entry.publicApp })}><Pencil size={11} /></button><button aria-label={`Move ${entry.title} up`} onClick={() => moveGroup(entry.id, -1)}><ArrowUp size={11} /></button><button aria-label={`Move ${entry.title} down`} onClick={() => moveGroup(entry.id, 1)}><ArrowDown size={11} /></button><button aria-label={`Delete ${entry.title} section`} onClick={() => { if (window.confirm(`Remove ${entry.title} and its documents when navigation is saved?`)) { changeMenu({ ...collection, groups: collection.groups.filter(value => value.id !== entry.id) }); setCatalog(current => current && { ...current, documents: current.documents.filter(doc => doc.groupId !== entry.id) }); setGroupId('') } }}><Trash2 size={11} /></button></div></div>)}</div><button className="zc-text-button" onClick={() => setGroupDialog({ title: '', slug: '' })}><Plus size={13} /> New sidebar section</button></>}
      <div className="zc-local-note"><span className="zero-live-dot" /><p>Only available on this computer.<br />Legal pages keep their direct public URLs.</p></div></aside>
      <section className="zc-import-panel"><div className="zc-step"><span>02</span><div><h2>Import files</h2><p>One Markdown file or a whole batch.</p></div></div><div className="zc-destination"><span>DESTINATION</span><strong>{sectionLabel}<ChevronRight size={12} />{collection?.title || 'Choose a menu'}<ChevronRight size={12} />{group?.title || 'Choose a section'}</strong>{collection && <code>{base.replace(/\/$/, '')}{collectionRoute(collection)}/{`${group?.slug || 'section'}/file-name`}</code>}</div>
        <div className={`zc-dropzone ${dragging ? 'dragging' : ''} ${!group ? 'disabled' : ''}`} onDragOver={event => { event.preventDefault(); setDragging(true) }} onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false) }} onDrop={event => { event.preventDefault(); setDragging(false); void receiveFiles(Array.from(event.dataTransfer.files)).catch(error => setFailure(error.message)) }}><div className="zc-drop-icon"><CloudUpload size={29} strokeWidth={1.4} /></div><h3>Drop Markdown files here.</h3><p>Single file. Multiple files. Images alongside them.</p><button className="zero-button" disabled={!group || busy} onClick={() => input.current?.click()}><Upload size={14} /> Choose files</button><input ref={input} type="file" multiple accept=".md,.markdown,.png,.jpg,.jpeg,.webp,.gif,.svg,.avif" aria-label="Import Markdown files" className="zc-hidden-input" onChange={event => { void receiveFiles(Array.from(event.target.files || [])).catch(error => setFailure(error.message)); event.target.value = '' }} /><span>.MD / .MARKDOWN + IMAGES · UP TO 8 MB PER FILE</span></div><div className="zc-drop-footer"><span>Original Markdown and metadata are preserved.</span><button onClick={blankDocument} disabled={!group}>Or start a blank document <Plus size={11} /></button></div>
        {(queue.length > 0 || assets.length > 0) && <div className="zc-queue"><div className="zc-list-heading"><span>IMPORT QUEUE · {queue.length} DOCUMENTS / {assets.length} IMAGES</span><button className="zc-text-button" disabled={!group} onClick={() => { if (collection && group) { setQueue(current => current.map(item => ({ ...item, collectionId: collection.id, groupId: group.id, replaceId: undefined }))); setAssets(current => current.map(item => ({ ...item, collectionId: collection.id, groupId: group.id }))) } }}>Move queued files here</button></div>{queue.map(item => { const conflict = conflicts.get(item.id); const menu = catalog.collections.find(value => value.id === item.collectionId); return <div key={item.id} draggable onDragStart={event=>startDrag(event,'upload',item.id)} onDragOver={allowDrop} onDrop={event=>dropNavigation(event,'upload',item.id)} className={`zc-upload-row ${selectedUpload === item.id ? 'selected' : ''} ${conflict?.error ? 'has-error' : ''}`}><div className="zc-file-icon"><FileText size={18} /></div><div className="zc-upload-fields"><button onClick={() => { setSelectedUpload(item.id); setExistingPreview(null); setEditing(false) }}>{item.name}<span>Preview →</span></button><label>Title<input aria-label={`Title for ${item.name}`} value={item.title} onChange={event => setQueue(current => current.map(value => value.id === item.id ? { ...value, title: event.target.value } : value))} /></label><label>URL name<input aria-label={`URL name for ${item.name}`} value={item.slug} disabled={!!item.replaceId} onChange={event => setQueue(current => current.map(value => value.id === item.id ? { ...value, slug: event.target.value } : value))} /></label><small>{menu?.title || 'Missing menu'} / {menu?.groups.find(entry => entry.id === item.groupId)?.title || 'Missing section'}</small>{conflict?.error && <p className="zc-error-text">{conflict.error}</p>}{conflict?.doc && <label className="zc-checkbox"><input type="checkbox" checked={item.replaceId === conflict.doc.id} onChange={event => setQueue(current => current.map(value => value.id === item.id ? { ...value, replaceId: event.target.checked ? conflict.doc!.id : undefined } : value))} />Replace “{conflict.doc.title}” and keep its public URL</label>}</div><button className="zero-icon-button" aria-label={`Remove ${item.name} from queue`} onClick={() => setQueue(current => current.filter(value => value.id !== item.id))}><X size={15} /></button></div> })}{assets.map(asset => <div key={asset.id} className="zc-asset-row"><Image size={15} /><span>{asset.name}</span><small>Image asset</small><button className="zero-icon-button" aria-label={`Remove image ${asset.name}`} onClick={() => setAssets(current => current.filter(item => item.id !== asset.id))}><X size={13} /></button></div>)}</div>}
        <div className="zc-import-actions"><p>{pending ? 'Changes are local until you publish to GitHub.' : 'Choose a destination, then drop files to get started.'}</p><button className="zero-button primary" disabled={busy || !pending || hasConflicts} onClick={() => void apply()}>{busy ? 'Saving…' : 'Save to repository'}<ArrowRight size={15} /></button></div>
        {collection && <section className="zc-existing"><div className="zc-list-heading"><span>ALREADY IN {group?.title.toUpperCase() || 'THIS MENU'} · {existing.length}</span>{collection.listed && <a href={site(collectionRoute(collection))} target="_blank" rel="noreferrer">Open on site ↗</a>}</div>{existing.length === 0 ? <p className="zc-help">This section is ready for its first document.</p> : existing.map(doc => <div key={doc.id} data-document-id={doc.id} draggable onDragStart={event=>startDrag(event,'document',doc.id)} onDragOver={allowDrop} onDrop={event=>dropNavigation(event,'document',doc.id)}><button className="zc-existing-name" onClick={() => void openDocument(doc)}><FileText size={14} /><span>{doc.title}</span></button><button className="zero-icon-button" aria-label={`Move ${doc.title} up`} onClick={() => moveDocument(doc, -1)}><ArrowUp size={12} /></button><button className="zero-icon-button" aria-label={`Move ${doc.title} down`} onClick={() => moveDocument(doc, 1)}><ArrowDown size={12} /></button><button className="zero-icon-button" aria-label={`Delete ${doc.title}`} onClick={() => { if (window.confirm(`Remove ${doc.title}? Save navigation to apply the deletion.`)) { setCatalog({ ...catalog, documents: catalog.documents.filter(item => item.id !== doc.id) }); if (existingPreview?.document.id === doc.id) setExistingPreview(null) } }}><Trash2 size={12} /></button></div>)}</section>}
        <details className="zc-publishing-details"><summary>Publishing connection <span className={git.ready ? 'connected' : ''}>{git.ready ? `${git.branch} · Connected` : 'Setup needed'}</span></summary>{git.ready ? <p>Publishing commits the local content changes and pushes to origin/{git.branch}. Your existing Git authentication stays on this computer.</p> : <><p>{git.reason}</p><p>Importing files, arranging navigation, and saving drafts all work now. Before publishing, create the Zero GitHub repository, make the initial commit of this project, and configure its origin remote. The existing GitHub Pages workflow deploys pushes to main.</p></>}</details>
      </section>
      <aside className={`zc-preview-panel ${previewSource !== undefined ? 'has-preview' : ''}`}><div className="zc-step"><span>03</span><div><h2>Preview</h2><p>The same renderer as the public site.</p></div></div>{previewSource !== undefined && previewCatalog ? <><div className="zc-preview-header"><div><strong>{previewTitle}</strong><code>{upload ? `${base.replace(/\/$/, '')}${routeFor({ id: upload.id, title: upload.title, collectionId: upload.collectionId, groupId: upload.groupId, slug: slugFor(upload, catalog, queue), publicPath:publicPagePath(catalog.collections.find(menu=>menu.id===upload.collectionId)!,upload.groupId,slugify(upload.slug)), file: previewFile, order: 0 }, catalog)}` : existingPreview ? site(routeFor(existingPreview.document, catalog)) : ''}</code></div><button className="zero-icon-button" aria-label="Close preview" onClick={() => { setSelectedUpload(''); setExistingPreview(null) }}><X size={15} /></button></div><div className="zc-preview-options"><button className={!editing ? 'selected' : ''} onClick={() => setEditing(false)}>Preview</button><button className={editing ? 'selected' : ''} onClick={() => { if (!upload && existingPreview) editExisting(); else setEditing(true) }}><Pencil size={12} /> Edit source</button>{existingPreview && <a href={site(routeFor(existingPreview.document, catalog))} target="_blank" rel="noreferrer">Open page ↗</a>}</div>{editing && upload ? <label className="zc-source-label">Original Markdown<textarea aria-label="Markdown source" value={upload.source} onChange={event => setQueue(current => current.map(item => item.id === upload.id ? { ...item, source: event.target.value } : item))} spellCheck={false} /><small>Frontmatter and quiz blocks remain in the source.</small></label> : <div className="zc-preview-content"><Markdown source={previewSource} file={previewFile} catalog={previewCatalog} assetUrls={assetUrls} /></div>}</> : <div className="zc-preview-empty"><div className="zc-preview-sheet"><span /><span /><span /><span /><FileText size={26} strokeWidth={1} /></div><h3>Preview</h3><p>Select a dropped file or an existing document to preview its real layout, code, images, and quizzes.</p></div>}</aside>
    </div>
    {categoryDialog&&<div className="zc-modal-backdrop"><section className="zc-modal compact" role="dialog" aria-modal="true" aria-label="Topic group"><header><h2>{categoryDialog.id?'Rename topic group':'New topic group'}</h2><button className="zero-icon-button" aria-label="Close topic group dialog" onClick={()=>setCategoryDialog(null)}><X size={18}/></button></header><form onSubmit={event=>{event.preventDefault();saveCategory()}}><label>Group name<input autoFocus required value={categoryDialog.title} onChange={event=>setCategoryDialog({...categoryDialog,title:event.target.value})} placeholder="e.g. Programming Languages"/></label><footer><button type="button" className="zero-button" onClick={()=>setCategoryDialog(null)}>Cancel</button><button className="zero-button primary" type="submit">Save group</button></footer></form></section></div>}{menuDialog && <MenuDialog kind={kind} defaultBuildType={buildType} current={menuDialog.current} catalog={catalog} onClose={() => setMenuDialog(null)} onSave={changeMenu} />}
    {groupDialog && <div className="zc-modal-backdrop"><section className="zc-modal compact" role="dialog" aria-modal="true" aria-label="Sidebar section"><header><h2>{groupDialog.id ? 'Edit sidebar section' : 'New sidebar section'}</h2><button className="zero-icon-button" aria-label="Close section dialog" onClick={() => setGroupDialog(null)}><X size={18} /></button></header><form onSubmit={event => { event.preventDefault(); saveGroup() }}><label>Parent section<select aria-label="Parent section" value={groupDialog.parentId||''} onChange={event=>setGroupDialog({...groupDialog,parentId:event.target.value||undefined})}><option value="">Top level</option>{groups.filter(entry=>entry.id!==groupDialog.id).map(entry=><option key={entry.id} value={entry.id}>{'— '.repeat(entry.depth)}{entry.title}</option>)}</select></label>{kind==='build'&&<label>Public app URL<input value={groupDialog.publicApp||''} onChange={event=>setGroupDialog({...groupDialog,publicApp:event.target.value})} placeholder="e.g. echo"/><small>Optional. Files imported here keep direct /pages/app-name/page-name URLs.</small></label>}<label>Section name<input autoFocus value={groupDialog.title} onChange={event => setGroupDialog({ ...groupDialog, title: event.target.value, slug: groupDialog.id ? groupDialog.slug : slugify(event.target.value) })} placeholder="e.g. Getting started" required /></label><label>URL name<input value={groupDialog.slug} onChange={event => setGroupDialog({ ...groupDialog, slug: event.target.value })} /></label><footer><button type="button" className="zero-button" onClick={() => setGroupDialog(null)}>Cancel</button><button type="submit" className="zero-button primary">Save section <Check size={14} /></button></footer></form></section></div>}
    {publishOpen && <div className="zc-modal-backdrop"><section className="zc-modal compact" role="dialog" aria-modal="true" aria-label="Publish content"><header><h2>Send it out into the world.</h2><button className="zero-icon-button" aria-label="Close publish dialog" onClick={() => setPublishOpen(false)}><X size={18} /></button></header><form onSubmit={event => { event.preventDefault(); void publish() }}><p className="zc-help">Commit the imported content and navigation, then push to origin/{git.branch}. GitHub Actions will deploy the update.</p><label>Commit message<input value={commitMessage} onChange={event => setCommitMessage(event.target.value)} required /></label><footer><button className="zero-button" type="button" onClick={() => setPublishOpen(false)}>Cancel</button><button className="zero-button primary" type="submit" disabled={busy}>{busy ? 'Publishing…' : 'Commit and push'}<ArrowRight size={14} /></button></footer></form></section></div>}
  </main>
}
function ArrowUpRightIcon() { return <ArrowRight size={14} style={{ transform: 'rotate(-45deg)' }} /> }
