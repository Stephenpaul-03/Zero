import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { slugify, parseSource, documentRoute } from '../shared/markdown.mjs';
import { preparePublic } from '../scripts/prepare.mjs';
import { destinationFolder, groupPath, navigationDocument, publicPagePath } from '../shared/navigation.mjs';
const execute = promisify(execFile);
const kinds = new Set(['build', 'docs', 'learn', 'pages']);
const keyPattern = /^[a-zA-Z0-9_-]+$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function validateCatalog(catalog) {
  if (catalog?.schemaVersion !== 2 || !Array.isArray(catalog.collections) || !Array.isArray(catalog.documents) || !Array.isArray(catalog.assets)) throw new Error('Invalid content catalog.');
  const collectionIds = new Set(); const collectionRoutes = new Set(); const groupIds = new Set();
  for(const category of catalog.categories||[])if(category.buildType&&!['hardware','software'].includes(category.buildType))throw new Error('Topic groups must use Hardware or Software as their destination.');
  for(const [alias,target] of Object.entries(catalog.assetAliases||{}))if(!alias.startsWith('files/')||alias.includes('..')||!catalog.assets.includes(target))throw new Error('Image aliases must refer to registered content assets.');
  for (const collection of catalog.collections) {
    if (!keyPattern.test(collection.id) || !kinds.has(collection.kind) || !slugPattern.test(collection.slug) || !collection.title?.trim() || !Array.isArray(collection.groups)) throw new Error('Every menu needs a name, valid URL slug, and content type.');
    if(collection.kind==='build'&&collection.buildType&&!['hardware','software'].includes(collection.buildType))throw new Error('Choose hardware or software for this build menu.');
    const category=catalog.categories?.find(value=>value.id===collection.categoryId);
    if(collection.kind==='build'&&category?.buildType&&category.buildType!==(collection.buildType||'hardware'))throw new Error('Choose a topic group from the project’s Hardware or Software destination.');
    if(collection.websiteUrl){let url;try{url=new URL(collection.websiteUrl)}catch{throw new Error('The live website needs a valid URL.')}if(!['https:','http:'].includes(url.protocol)||url.username||url.password)throw new Error('Use a public HTTP or HTTPS website URL without credentials.');}
    const route = `${collection.kind}/${collection.kind==='build'?(collection.buildType||'hardware')+'/':''}${collection.slug}`;
    if (collectionIds.has(collection.id) || collectionRoutes.has(route)) throw new Error(`Duplicate menu: ${collection.title}`);
    collectionIds.add(collection.id); collectionRoutes.add(route);
    for (const group of collection.groups) {
      if (!keyPattern.test(group.id) || !slugPattern.test(group.slug) || !group.title?.trim() || groupIds.has(group.id)) throw new Error('Sidebar sections need unique IDs and valid names.');
      groupIds.add(group.id);
      if(group.publicApp&&!slugPattern.test(group.publicApp))throw new Error('Public app names need a valid URL slug.');
      if(group.publicApp&&(collection.kind!=='build'||collection.buildType!=='software'))throw new Error('Public legal pages belong to a Software project.');
      if (group.parentId && !collection.groups.some(value => value.id === group.parentId)) throw new Error('The parent sidebar section does not exist.');
      groupPath(collection, group.id);
    }
  }
  const documentIds = new Set(); const routes = new Set(); const files = new Set();
  for (const doc of catalog.documents) {
    const collection = catalog.collections.find(item => item.id === doc.collectionId);
    if (!keyPattern.test(doc.id) || !doc.title?.trim() || !collection?.groups.some(group => group.id === doc.groupId)) throw new Error(`Invalid destination for document: ${doc.title || 'untitled'}`);
    if (doc.slug && !doc.slug.split('/').every(part => slugPattern.test(part))) throw new Error(`Invalid document URL: ${doc.slug}`);
    const route = documentRoute(doc, catalog);
    if (doc.publicPath && !/^\/pages\/[a-z0-9-]+\/[a-z0-9/-]+$/.test(doc.publicPath)) throw new Error('Public page URLs must use /pages/app/page-name.');
    if(doc.publicPath&&(collection.kind!=='build'||collection.buildType!=='software'))throw new Error('Public legal pages belong to a Software project.');
    if (routes.has(route) || documentIds.has(doc.id) || files.has(doc.file)) throw new Error(`Duplicate document or URL: ${route}`);
    documentIds.add(doc.id); routes.add(route); files.add(doc.file);
    if (collection.kind === 'pages') collection.listed = false;
  }
  return catalog;
}
async function atomicWrite(target, data) {
  await fs.mkdir(path.dirname(target), { recursive: true });
  const temporary = `${target}.${randomUUID()}.tmp`;
  try { await fs.writeFile(temporary, data); await fs.rename(temporary, target); }
  finally { await fs.rm(temporary, { force: true }); }
}
export function createContentStore(root) {
  root = path.resolve(root);
  const contentRoot = path.join(root, 'content');
  const catalogPath = path.join(contentRoot, 'catalog.json');
  const draftsRoot = path.join(root, '.zero/drafts');
  let busy = false;
  const git = async args => (await execute('git', ['-c', `safe.directory=${root}`, ...args], { cwd: root, timeout: 45000, maxBuffer: 1024 * 1024 })).stdout.trim();
  const load = async () => {
    const text = await fs.readFile(catalogPath, 'utf8');
    return { catalog: JSON.parse(text), revision: createHash('sha256').update(text).digest('hex') };
  };
  async function contentPath(relative) {
    if (typeof relative !== 'string' || !relative.startsWith('files/') || relative.includes('\\') || relative.includes('\0') || relative.split('/').some(part => part === '..' || part === '.' || !part)) throw new Error('Invalid content file path.');
    const target = path.resolve(contentRoot, relative);
    const expected = path.resolve(contentRoot, 'files') + path.sep;
    if (!target.startsWith(expected)) throw new Error('Content path leaves the files directory.');
    let cursor = contentRoot;
    for (const segment of relative.split('/')) {
      cursor = path.join(cursor, segment);
      try { if ((await fs.lstat(cursor)).isSymbolicLink()) throw new Error('Symbolic links are not allowed in editable content.'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
    return target;
  }
  async function gitState() {
    try {
      const top = await git(['rev-parse', '--show-toplevel']);
      const actualTop = await fs.realpath(top);
      const actualRoot = await fs.realpath(root);
      if (actualTop.toLowerCase() !== actualRoot.toLowerCase()) return { ready: false, reason: 'Initialize a Git repository for Zero to enable publishing.' };
      await git(['rev-parse', '--verify', 'HEAD']);
      const branch = await git(['branch', '--show-current']);
      const remote = await git(['remote', 'get-url', 'origin']);
      const name = await git(['config', 'user.name']);
      const email = await git(['config', 'user.email']);
      if (!branch || !remote || !name || !email) return { ready: false, reason: 'Configure a branch, origin remote, and Git identity to publish.' };
      return { ready: true, branch, name, changes: (await git(['status', '--porcelain', '--', 'content'])).split('\n').filter(Boolean).length };
    } catch { return { ready: false, reason: 'Create Zero’s initial Git commit and configure its origin remote to enable publishing. Importing and saving drafts work independently.' }; }
  }
  async function apply(payload) {
    if (busy) throw new Error('Another save is in progress. Try again shortly.');
    busy = true;
    try {
      const current = await load();
      const originalCatalog = await fs.readFile(catalogPath);
      if (payload.revision !== current.revision) throw new Error('Content changed since this workspace was opened. Reload the workspace before importing.');
      const catalog = structuredClone(payload.catalog);
      validateCatalog(catalog);
      const oldDocs = new Map(current.catalog.documents.map(doc => [doc.id, doc]));
      for (const doc of catalog.documents) if (!oldDocs.has(doc.id) || oldDocs.get(doc.id).file !== doc.file) throw new Error('Existing document file paths cannot be changed by menu edits.');
      const writes = new Map(); const replacements = new Set();
      for (const item of payload.imports || []) {
        const collection = catalog.collections.find(menu => menu.id === item.collectionId);
        const group = collection?.groups.find(entry => entry.id === item.groupId);
        if (!group) throw new Error('Select a menu and sidebar section for every imported file.');
        const filename = path.posix.basename(String(item.name || '').replace(/\\/g, '/'));
        if (!filename || filename.startsWith('.') || /[<>:"|?*\x00-\x1f]/.test(filename)) throw new Error('Invalid filename.');
        if (typeof item.source !== 'string' || item.source.length > 8 * 1024 * 1024 || !/\.(md|markdown)$/i.test(filename)) throw new Error('Import Markdown files smaller than 8 MB.');
        const replace = item.replaceId ? catalog.documents.find(doc => doc.id === item.replaceId && doc.collectionId === collection.id) : undefined;
        if (item.replaceId && !replace) throw new Error('The document selected for replacement is unavailable.');
        if (replace && replacements.has(replace.id)) throw new Error('A document cannot be replaced twice in one import.');
        const leaf = slugify(item.slug || filename.replace(/\.(md|markdown)$/i, ''));
        const docSlug = collection.kind === 'pages' ? leaf : collection.kind === 'build' && group.slug === 'overview' && !catalog.documents.some(doc => doc.collectionId === collection.id && !doc.slug) ? '' : `${groupPath(collection, group.id)}/${leaf}`;
        const file = replace?.file || `${destinationFolder(catalog, collection.id, group.id)}/${String(catalog.documents.filter(doc=>doc.groupId===group.id).length+1).padStart(2,'0')}-${slugify(filename.replace(/\.(md|markdown)$/i,''))}.md`;
        if (writes.has(file)) throw new Error(`Two files have the same destination: ${filename}`);
        if (!replace) { try { await fs.access(await contentPath(file)); throw new Error(`A file named ${filename} already exists here. Choose Replace or rename the incoming file.`); } catch (error) { if (error.code !== 'ENOENT') throw error; } }
        const doc = { ...(replace || {}), ...(replace ? { modifiedAt: new Date().toISOString() } : {}), publicPath:replace?.publicPath || publicPagePath(collection,group.id,leaf), originalName: replace?.originalName || filename, id: replace?.id || randomUUID(), collectionId: collection.id, groupId: group.id, slug: replace?.slug ?? docSlug, title: item.title?.trim() || parseSource(item.source).meta.title || filename, file, order: replace?.order ?? catalog.documents.filter(doc => doc.groupId === group.id).length };
        if (replace) { replacements.add(replace.id); catalog.documents = catalog.documents.map(value => value.id === replace.id ? doc : value); }
        else catalog.documents.push(doc);
        writes.set(file, Buffer.from(item.source, 'utf8'));
        if (!catalog.assets.includes(file)) catalog.assets.push(file);
      }
      for (const asset of payload.assets || []) {
        const collection = catalog.collections.find(menu => menu.id === asset.collectionId);
        const group = collection?.groups.find(entry => entry.id === asset.groupId);
        const filename = path.posix.basename(String(asset.name || '').replace(/\\/g, '/'));
        if (!group || !/\.(png|jpe?g|webp|gif|svg|avif)$/i.test(filename) || filename.startsWith('.') || /[<>:"|?*\x00-\x1f]/.test(filename)) throw new Error('Choose a destination and a supported image filename.');
        const bytes = Buffer.from(asset.data || '', 'base64');
        if (!bytes.length || bytes.length > 8 * 1024 * 1024) throw new Error('Images must be smaller than 8 MB.');
        const file = `${destinationFolder(catalog, collection.id, group.id)}/${filename}`;
        if (catalog.assets.includes(file) || writes.has(file)) throw new Error(`Image already exists: ${filename}`);
        writes.set(file, bytes); catalog.assets.push(file);
      }
      const relocated = new Set();
      const folderMoves = new Map();
      const pendingWrites = new Map(writes);
      const renamedWrites = new Map();
      const assetRenames = new Map();
      const assetsBeforeRelocation = [...catalog.assets];
      for (const collection of catalog.collections) for (const group of collection.groups) {
        const documents = catalog.documents.filter(doc=>doc.groupId===group.id).sort((a,b)=>a.order-b.order);
        for (const [index,doc] of documents.entries()) {
          doc.order=index;
          if (!doc.file.startsWith('files/managed/')) continue;
          const folder=destinationFolder(catalog,collection.id,group.id);
          const next=`${folder}/${String(index+1).padStart(2,'0')}-${slugify((doc.originalName||path.posix.basename(doc.file).replace(/^\d+-/,'')).replace(/\.(md|markdown)$/i,''))}.md`;
          if (next===doc.file) continue;
          const previous=doc.file;
          const bytes=pendingWrites.get(previous)||await fs.readFile(await contentPath(previous));
          renamedWrites.set(next,bytes);relocated.add(previous);assetRenames.set(previous,next);
          folderMoves.set(`${path.posix.dirname(previous)}\0${folder}`,[path.posix.dirname(previous),folder]);
          doc.file=next;
        }
      }
      catalog.assets=[...new Set(assetsBeforeRelocation.map(file=>assetRenames.get(file)||file))];
      for (const file of relocated) writes.delete(file);
      for (const [file,bytes] of renamedWrites) writes.set(file,bytes);
      for (const [previousFolder,nextFolder] of folderMoves.values()) if(previousFolder!==nextFolder) {
        for (const file of assetsBeforeRelocation) if(path.posix.dirname(file)===previousFolder&&!/\.(md|markdown)$/i.test(file)) {
          const next=`${nextFolder}/${path.posix.basename(file)}`;
          const bytes=pendingWrites.get(file)||await fs.readFile(await contentPath(file));
          if(catalog.assets.includes(next)) { const existing=pendingWrites.get(next)||await fs.readFile(await contentPath(next)); if(!existing.equals(bytes))throw new Error(`An image named ${path.posix.basename(file)} already exists in the target section.`); }
          else {writes.set(next,bytes);catalog.assets.push(next)}
        }
      }
      const deleted = current.catalog.documents.filter(doc => !catalog.documents.some(value => value.id === doc.id));
      for (const doc of deleted) catalog.assets = catalog.assets.filter(file => file !== doc.file);
      validateCatalog(catalog);
      const backup = new Map();
      const navigationPath=path.join(contentRoot,'navigation.json');
      let originalNavigation=null;try{originalNavigation=await fs.readFile(navigationPath)}catch(error){if(error.code!=='ENOENT')throw error}
      const targets = [...writes.keys(), ...relocated, ...deleted.map(doc => doc.file)];
      for (const file of targets) { const target = await contentPath(file); try { backup.set(target, await fs.readFile(target)); } catch (error) { if (error.code !== 'ENOENT') throw error; backup.set(target, null); } }
      try {
        for (const [file, bytes] of writes) await atomicWrite(await contentPath(file), bytes);
        for (const file of [...relocated,...deleted.map(doc=>doc.file)]) if(!writes.has(file))await fs.rm(await contentPath(file), { force: true });
        await atomicWrite(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
        await atomicWrite(path.join(contentRoot,'navigation.json'),`${JSON.stringify(navigationDocument(catalog),null,2)}\n`);
        await preparePublic(root);
      } catch (error) {
        for (const [target, bytes] of backup) { if (bytes) await atomicWrite(target, bytes); else await fs.rm(target, { force: true }); }
        await atomicWrite(catalogPath, originalCatalog);
        if(originalNavigation)await atomicWrite(navigationPath,originalNavigation);else await fs.rm(navigationPath,{force:true});
        try { await preparePublic(root); } catch { /* Preserve the original failure. */ }
        throw error;
      }
      return { ...await load(), imported: (payload.imports || []).length, deleted: deleted.length };
    } finally { busy = false; }
  }
  return {
    load, apply, gitState,
    async read(id) { const { catalog } = await load(); const doc = catalog.documents.find(item => item.id === id); if (!doc) throw new Error('Document not found.'); return { document: doc, source: await fs.readFile(await contentPath(doc.file), 'utf8') }; },
    async drafts() { await fs.mkdir(draftsRoot, { recursive: true }); const names = (await fs.readdir(draftsRoot)).filter(name => /^[a-zA-Z0-9-]+\.json$/.test(name)); return Promise.all(names.map(async name => { const value = JSON.parse(await fs.readFile(path.join(draftsRoot, name), 'utf8')); return { id: name.slice(0, -5), title: value.title, savedAt: value.savedAt }; })); },
    async saveDraft(payload) { const id = payload.id && /^[a-zA-Z0-9-]+$/.test(payload.id) ? payload.id : randomUUID(); await fs.mkdir(draftsRoot, { recursive: true }); await atomicWrite(path.join(draftsRoot, `${id}.json`), JSON.stringify({ ...payload, id, savedAt: new Date().toISOString() })); return { id }; },
    async readDraft(id) { if (!/^[a-zA-Z0-9-]+$/.test(id)) throw new Error('Invalid draft.'); return JSON.parse(await fs.readFile(path.join(draftsRoot, `${id}.json`), 'utf8')); },
    async publish(message) {
      if (busy) throw new Error('An import is in progress.');
      busy = true;
      try {
      const state = await gitState(); if (!state.ready) throw new Error(state.reason);
      const staged = await git(['diff', '--cached', '--name-only', '-z']);
      if (staged.split('\0').some(file => file && !file.startsWith('content/'))) throw new Error('There are unrelated staged changes. Publish those separately before publishing content.');
      await git(['add', '--', 'content']);
      const changes = await git(['diff', '--cached', '--name-only']);
      if (changes) { if (!message?.trim()) throw new Error('Enter a commit message.'); await git(['commit', '-m', message.trim().slice(0, 200)]); }
      const commit = await git(['rev-parse', '--short', 'HEAD']);
      try { await git(['push', '-u', 'origin', 'HEAD']); return { pushed: true, commit, message: `Published commit ${commit}. GitHub Actions can now deploy it.` }; }
      catch { return { pushed: false, commit, message: `Commit ${commit} is saved locally, but the push failed. Check your Git connection, then retry Publish to push this existing commit.` }; }
      } finally { busy = false; }
    },
  };
}
