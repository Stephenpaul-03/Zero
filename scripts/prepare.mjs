import { promises as fs } from 'node:fs';
import path from 'node:path';
export async function preparePublic(root) {
  root = path.resolve(root);
  const catalog = JSON.parse(await fs.readFile(path.join(root, 'content/catalog.json'), 'utf8'));
  const publicRoot = path.join(root, 'public');
  await fs.mkdir(publicRoot, {recursive: true});
  if ((await fs.lstat(publicRoot)).isSymbolicLink()) throw new Error('Public output cannot be a symbolic link.');
  const output = path.join(root, 'public/zero-content');
  if (!output.startsWith(path.join(root, 'public') + path.sep)) throw new Error('Generated output must remain inside public.');
  try { if ((await fs.lstat(output)).isSymbolicLink()) throw new Error('Generated output cannot be a symbolic link.'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  // This directory contains generated output only. Clear stale files after document deletion.
  await fs.rm(output, { recursive: true, force: true });
  await fs.mkdir(output, { recursive: true });
  await fs.mkdir(path.join(output, 'files'), {recursive: true});
  const files = new Set([...(catalog.assets || []), ...catalog.documents.map(doc => doc.file)]);
  for (const file of files) {
    if (!file.startsWith('files/') || file.includes('\\') || file.includes('\0') || file.split('/').some(part => !part || part === '.' || part === '..')) throw new Error('Invalid published content path.');
    let source = path.join(root, 'content');
    for (const segment of file.split('/')) {
      source = path.join(source, segment);
      if ((await fs.lstat(source)).isSymbolicLink()) throw new Error('Published content cannot contain symbolic links.');
    }
    const destination = path.join(output, file);
    await fs.mkdir(path.dirname(destination), {recursive: true});
    await fs.copyFile(source, destination);
  }
  await fs.copyFile(path.join(root, 'content/catalog.json'), path.join(output, 'catalog.json'));
}
if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) await preparePublic(path.resolve(import.meta.dirname, '..'));
