import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { validateCatalog } from '../server/store.mjs';
const root = path.resolve(import.meta.dirname, '..');
const catalog = JSON.parse(await fs.readFile(path.join(root, 'content/catalog.json'), 'utf8'));
validateCatalog(catalog);
let sourceCount = 0;
for (const doc of catalog.documents) {
  const bytes = await fs.readFile(path.join(root, 'content', doc.file));
  if (doc.source && !doc.modifiedAt) {
    const hash = createHash('sha256').update(bytes).digest('hex');
    if (hash !== doc.source.sha256) throw new Error(`Source Markdown changed: ${doc.source.repo}/${doc.source.path}`);
    sourceCount++;
  }
}
for (const asset of catalog.assets) await fs.access(path.join(root, 'content', asset));
console.log(`Catalog valid: ${catalog.collections.length} collections; ${catalog.documents.length} active documents; ${sourceCount} original Markdown files match their migration hashes; ${catalog.assets.length} content assets present.`);
