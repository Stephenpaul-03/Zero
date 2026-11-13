import { promises as fs } from 'node:fs';
import path from 'node:path';
import { renderMarkdown, escapeHtml } from '../shared/markdown.mjs';
import { publicEntries } from '../shared/public-routes.mjs';
const root = path.resolve(import.meta.dirname, '..');
const catalog = JSON.parse(await fs.readFile(path.join(root, 'content/catalog.json'), 'utf8'));
const template = await fs.readFile(path.join(root, 'dist/index.html'), 'utf8');
const base = process.env.ZERO_BASE_PATH || '/';
let count = 0;
for (const [route, {doc, collection, title}] of publicEntries(catalog)) {
  if (route === '/') continue;
  let html = template.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)} · Zero</title>`);
  if(doc){
    const source = await fs.readFile(path.join(root, 'content', doc.file), 'utf8');
    const rendered = renderMarkdown(source, { catalog, file: doc.file, base, legacyHeadings:true });
    const surface = collection.kind === 'learn' ? 'learn' : `build ${collection.buildType || 'hardware'}`;
    html = html.replace('<div id="root"></div>', `<div id="root"><div class="reader-surface ${surface} flex h-screen flex-col"><header class="flex h-16 shrink-0 items-center border-b px-6"><a class="text-sm font-semibold" href="${escapeHtml(base)}">Zero</a></header><main class="min-h-0 flex-1 overflow-y-auto"><div class="mx-auto max-w-4xl px-6 py-10"><div class="mb-8 text-xs text-zinc-500">${escapeHtml(collection.title)}</div><article class="markdown-body">${rendered.html}</article></div></main></div></div>`);
  }
  const destination = path.join(root, 'dist', route.slice(1), 'index.html');
  await fs.mkdir(path.dirname(destination), { recursive: true }); await fs.writeFile(destination, html); count++;
}
await fs.copyFile(path.join(root, 'dist/index.html'), path.join(root, 'dist/404.html'));
await fs.writeFile(path.join(root, 'dist/.nojekyll'), '');
console.log(`Generated ${count} published route entries, .nojekyll, and the public route fallback.`);
