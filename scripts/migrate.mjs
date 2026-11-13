import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { parseSource, slugify } from '../shared/markdown.mjs';
const root = path.resolve(import.meta.dirname, '..');
const target = path.join(root, 'content');
const catalogPath = path.join(target, 'catalog.json');
try { await fs.access(catalogPath); console.log('Catalog exists; initial migration skipped.'); process.exit(0); } catch { /* Initial import. */ }
const catalog = { schemaVersion: 2, collections: [], documents: [], assets: [], migration: { createdAt: new Date().toISOString(), sources: [] } };
const id = value => createHash('sha256').update(value).digest('hex').slice(0, 16);
async function files(dir, prefix = '') {
  const result = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) result.push(...await files(path.join(dir, entry.name), relative));
    else if (entry.isFile()) result.push(relative);
  }
  return result;
}
const sidebarNames = { ComputerNetwork: 'Computer_Network', DatabaseManagementSystem: 'Database_Management_System' };
for (const repo of ['Lattice', 'Crucible', 'LogBook']) {
  const source = path.resolve(root, '..', repo);
  const sourceContent = path.join(source, 'public', 'content');
  const sourceFiles = await files(sourceContent);
  const namespace = repo.toLowerCase();
  const kind = repo === 'Lattice' ? 'learn' : repo === 'Crucible' ? 'docs' : 'pages';
  let metadata = '';
  try { metadata = await fs.readFile(path.join(source, 'src/constants/subjects.ts'), 'utf8'); } catch { /* LogBook uses projects. */ }
  const labels = new Map([...metadata.matchAll(/id:\s*"([^"]+)"[\s\S]*?label:\s*"([^"]+)"/g)].map(match => [match[1], match[2]]));
  for (const folder of (await fs.readdir(sourceContent, { withFileTypes: true })).filter(item => item.isDirectory())) {
    const mdFiles = sourceFiles.filter(file => file.startsWith(`${folder.name}/`) && /\.md$/i.test(file));
    if (!mdFiles.length) continue;
    let navigation = { categories: [] };
    try { navigation = JSON.parse(await fs.readFile(path.join(sourceContent, `${sidebarNames[folder.name] || folder.name}_Sidebar.json`), 'utf8')); } catch { /* Retain orphan folders. */ }
    const slug = folder.name === 'Template' ? `${namespace}-guide` : slugify(folder.name);
    const collectionId = `${kind}-${slug}`;
    const collection = { id: collectionId, kind, slug, title: labels.get(folder.name) || (folder.name === 'Template' ? `${repo} guide` : folder.name), description: kind === 'learn' ? `Notes, references, and lessons on ${labels.get(folder.name) || folder.name}.` : kind === 'docs' ? 'The Crucible guide to documenting projects, experiments, and the process.' : `${folder.name} documentation and legal pages.`, listed: kind !== 'pages', order: catalog.collections.length, tags: [], groups: [], source: repo, ...(repo === 'Crucible' ? { projectId: 'build-crucible' } : {}) };
    const navLookup = new Map();
    for (const [index, category] of navigation.categories.entries()) {
      const groupId = `${collectionId}-${slugify(category.title)}`;
      collection.groups.push({ id: groupId, title: category.title, slug: slugify(category.title), order: index });
      for (const [label, value] of Object.entries(category.topics || {})) {
        const route = typeof value === 'string' ? value : value.path;
        navLookup.set(route.split('/').filter(Boolean).at(-1) || 'home', { label, groupId, order: navLookup.size });
      }
    }
    const overviewId = `${collectionId}-overview`;
    collection.groups.unshift({ id: overviewId, title: 'Overview', slug: 'overview', order: -1 });
    for (const relative of mdFiles) {
      const bytes = await fs.readFile(path.join(sourceContent, relative));
      const raw = bytes.toString('utf8');
      const parsed = parseSource(raw);
      const basename = path.basename(relative, '.md').replace(/^\d+-/, '');
      const home = basename === 'home' || basename === 'index';
      const nav = navLookup.get(basename);
      const folderName = relative.split('/').length > 2 ? relative.split('/')[1] : 'Notes';
      let groupId = home ? overviewId : nav?.groupId || collection.groups.find(group => group.title === folderName)?.id;
      if (!groupId) { groupId = `${collectionId}-${slugify(folderName)}`; collection.groups.push({ id: groupId, title: folderName, slug: slugify(folderName), order: collection.groups.length }); }
      const group = collection.groups.find(item => item.id === groupId);
      const docSlug = kind === 'pages' ? (home ? 'home' : basename) : home ? '' : `${group.slug}/${basename}`;
      const title = parsed.meta.title || nav?.label || raw.match(/^#\s+(.+)$/m)?.[1] || basename.replace(/-/g, ' ');
      catalog.documents.push({ id: id(`${repo}/${relative}`), collectionId, groupId, slug: docSlug, title, file: `files/${namespace}/${relative}`, order: home ? -1 : nav?.order ?? catalog.documents.length, source: { repo, path: relative, sha256: createHash('sha256').update(bytes).digest('hex') }, legacy: `${folder.name}-${home ? 'home' : basename}` });
    }
    catalog.collections.push(collection);
  }
  for (const relative of sourceFiles) {
    const file = `files/${namespace}/${relative}`;
    const output = path.join(target, file);
    await fs.mkdir(path.dirname(output), { recursive: true });
    await fs.copyFile(path.join(sourceContent, relative), output);
    catalog.assets.push(file);
  }
  catalog.migration.sources.push({ repo, markdown: sourceFiles.filter(file => /\.md$/i.test(file)).length, files: sourceFiles.length });
}
const projectFile = 'files/projects/crucible/README.md';
await fs.mkdir(path.dirname(path.join(target, projectFile)), { recursive: true });
await fs.copyFile(path.resolve(root, '..', 'Crucible/README.md'), path.join(target, projectFile));
catalog.assets.push(projectFile);
catalog.collections.unshift({ id: 'build-crucible', kind: 'build', slug: 'crucible', title: 'Crucible', description: 'A hardware journal for projects, experiments, and the useful things learned along the way.', listed: true, order: 0, status: 'Workspace', tags: ['Hardware', 'Experiments'], source: 'Crucible', sourceUrl: 'https://github.com/Stephenpaul-03/Crucible', groups: [{ id: 'build-crucible-overview', title: 'Overview', slug: 'overview', order: 0 }] });
catalog.documents.push({ id: 'crucible-project-overview', collectionId: 'build-crucible', groupId: 'build-crucible-overview', slug: '', title: 'Crucible', file: projectFile, order: 0 });
await fs.writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Migrated ${catalog.documents.length} documents into ${catalog.collections.length} collections (327 original Markdown files and 1 project overview).`);
