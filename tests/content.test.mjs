import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createContentStore, validateCatalog } from '../server/store.mjs';
import { createEditorHandler } from '../server/api.mjs';
import { parseSource, renderMarkdown, documentRoute } from '../shared/markdown.mjs';
import { preparePublic } from '../scripts/prepare.mjs';
const execute = promisify(execFile);
const raw = '---\r\ntitle: Circuit notes\r\nlayout: split\r\nmdn: https://example.com/reference\r\ncustom-field: keep this\r\n---\r\n\r\n# Circuit notes\r\n\r\nUseful symbols: Ω, µ, 日本語.\r\n\r\n:::quiz\r\nquestion: Which unit?\r\noptions:\r\n- Ohm (correct)\r\n- Volt\r\nexplanation: Resistance is measured in ohms.\r\n:::\r\n';
async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'zero-test-'));
  t.after(async () => { const resolved = path.resolve(root); assert.ok(resolved.startsWith(path.resolve(os.tmpdir()) + path.sep)); await fs.rm(resolved, { recursive: true, force: true }); });
  await fs.mkdir(path.join(root, 'content/files'), { recursive: true });
  const catalog = { schemaVersion: 2, collections: [{ id: 'learn-electronics', kind: 'learn', title: 'Electronics', slug: 'electronics', description: '', listed: true, order: 0, tags: [], groups: [{ id: 'basics', slug: 'basics', title: 'Basics', order: 0 }] }], documents: [], assets: [] };
  await fs.writeFile(path.join(root, 'content/catalog.json'), JSON.stringify(catalog, null, 2) + '\n');
  return { root, store: createContentStore(root) };
}
const incoming = (name = 'resistance.md', source = raw) => ({ name, source, title: 'Resistance', slug: name.replace(/\.md$/, ''), collectionId: 'learn-electronics', groupId: 'basics' });

test('note collections generate canonical Notes URLs', () => {
  const catalog={collections:[{id:'learn-example',kind:'learn',slug:'example'}]};
  assert.equal(documentRoute({collectionId:'learn-example',slug:''},catalog),'/notes/example');
  assert.equal(documentRoute({collectionId:'learn-example',slug:'basics/first-note'},catalog),'/notes/example/basics/first-note');
});

test('legal imports belong to a Software project while public URLs survive replacement and menu changes', async t => {
  const {store}=await fixture(t);const current=await store.load();const menu=current.catalog.collections[0];menu.kind='build';menu.buildType='software';menu.groups[0].publicApp='example';menu.websiteUrl='https://example.com/';
  const saved=await store.apply({...current,imports:[incoming('privacy.md','# Privacy\n')]});const doc=saved.catalog.documents[0];
  assert.equal(doc.publicPath,'/pages/example/privacy');assert.equal(documentRoute(doc,saved.catalog),'/pages/example/privacy');assert.equal(doc.collectionId,menu.id);
  saved.catalog.collections[0].title='Renamed project';saved.catalog.collections[0].groups[0].title='Legal information';
  const updated=await store.apply({...saved,imports:[{...incoming('renamed.md','# Updated privacy\n'),replaceId:doc.id}]});
  assert.equal(updated.catalog.documents[0].publicPath,doc.publicPath);assert.equal((await store.read(doc.id)).source,'# Updated privacy\n');
  const duplicate=structuredClone(updated.catalog);duplicate.documents.push({...duplicate.documents[0],id:'another-document',slug:'another-slug',file:'files/another.md'});assert.throws(()=>validateCatalog(duplicate),/Duplicate document or URL/);
});

test('live-site and public-page routing metadata reject unsafe URLs', async t => {
  const {store}=await fixture(t);const {catalog}=await store.load();catalog.collections[0].websiteUrl='javascript:alert(1)';assert.throws(()=>validateCatalog(catalog),/HTTP or HTTPS/);
  catalog.collections[0].websiteUrl='https://user:password@example.com';assert.throws(()=>validateCatalog(catalog),/without credentials/);
  catalog.collections[0].websiteUrl='https://example.com';catalog.collections[0].groups[0].publicApp='../escape';assert.throws(()=>validateCatalog(catalog),/valid URL slug/);
});

test('publishing excludes concurrent filesystem saves and releases its lock on failure', async t => {
  const {store}=await fixture(t);const current=await store.load();const publishing=store.publish('Publish').catch(error=>error);
  await assert.rejects(store.apply(current),/Another save is in progress/);
  assert.ok(await publishing instanceof Error);
  const saved=await store.apply(current);assert.equal(saved.imported,0);
});

test('batch import preserves exact Markdown, unknown metadata, quizzes, images, and stable replacement routes', async t => {
  const { root, store } = await fixture(t); const current = await store.load();
  const result = await store.apply({ ...current, imports: [incoming(), incoming('voltage.md', '# Voltage\n')], assets: [{ name: 'diagram.svg', data: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>').toString('base64'), collectionId: 'learn-electronics', groupId: 'basics' }] });
  assert.equal(result.catalog.documents.length, 2);
  const doc = result.catalog.documents[0];
  assert.equal((await store.read(doc.id)).source, raw);
  assert.equal(parseSource(raw).meta['custom-field'], 'keep this');
  assert.equal(renderMarkdown(raw).quizzes.length, 1);
  assert.match(await fs.readFile(path.join(root, 'public/zero-content', doc.file), 'utf8'), /:::quiz/);
  const changed = await store.apply({ ...result, imports: [{ ...incoming('renamed.md', raw + '\r\nMore notes.'), replaceId: doc.id, slug: 'changed-title' }] });
  const replaced = changed.catalog.documents.find(item => item.id === doc.id);
  assert.equal(replaced.slug, 'basics/resistance'); assert.equal(replaced.file, doc.file);
  assert.equal((await store.read(doc.id)).source, raw + '\r\nMore notes.');
});

test('duplicate imports, stale workspaces, and path changes fail without partial saves', async t => {
  const { store } = await fixture(t); const current = await store.load();
  await assert.rejects(store.apply({ ...current, imports: [incoming(), incoming()] }), /same destination|Duplicate/);
  assert.equal((await store.load()).revision, current.revision);
  const result = await store.apply({ ...current, imports: [incoming()] });
  await assert.rejects(store.apply({ ...current, imports: [incoming('old.md')] }), /changed since/);
  const unsafe = structuredClone(result.catalog); unsafe.documents[0].file = 'files/../../outside.md';
  await assert.rejects(store.apply({ catalog: unsafe, revision: result.revision, imports: [] }), /file paths/);
  assert.equal((await store.read(result.catalog.documents[0].id)).source, raw);
});

test('drafts remain outside public output and deletion removes generated documents', async t => {
  const { root, store } = await fixture(t); const state = await store.load();
  const draft = await store.saveDraft({ title: 'Unpublished experiment', imports: [incoming()], catalog: state.catalog, revision: state.revision });
  assert.equal((await store.readDraft(draft.id)).imports[0].source, raw);
  assert.equal((await store.drafts()).length, 1);
  await preparePublic(root);
  assert.equal((await fs.readdir(path.join(root, 'public/zero-content/files'))).length, 0);
  const result = await store.apply({ ...state, imports: [incoming()] });
  const removed = structuredClone(result.catalog); removed.documents = [];
  await store.apply({ revision: result.revision, catalog: removed, imports: [] });
  await assert.rejects(fs.access(path.join(root, 'public/zero-content', result.catalog.documents[0].file)), { code: 'ENOENT' });
});

test('menus and sidebar sections can be created in the same batch as unlisted legal pages', async t => {
  const { store } = await fixture(t); const state = await store.load();
  state.catalog.collections.push({ id: 'app-echo', kind: 'pages', title: 'Echo', slug: 'echo', listed: true, order: 1, tags: [], description: '', groups: [{ id: 'legal', title: 'Legal', slug: 'legal', order: 0 }] });
  const result = await store.apply({ ...state, imports: [{ ...incoming('privacy-policy.md', '# Privacy policy\n'), collectionId: 'app-echo', groupId: 'legal' }] });
  assert.equal(result.catalog.collections.find(item => item.id === 'app-echo').listed, false);
  assert.equal(documentRoute(result.catalog.documents[0], result.catalog), '/pages/echo/privacy-policy');
});

test('local API requires same-origin requests and a session token for writes', async t => {
  const { root } = await fixture(t);
  const server = http.createServer(createEditorHandler(root)); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const state = await (await fetch(`${origin}/__zero/state`)).json();
  assert.ok(state.token); assert.equal(state.catalog.schemaVersion, 2);
  assert.equal((await fetch(`${origin}/__zero/draft`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status, 403);
  assert.equal((await fetch(`${origin}/__zero/draft`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://example.com', 'X-Zero-Token': state.token }, body: '{}' })).status, 403);
  const saved = await fetch(`${origin}/__zero/draft`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Zero-Token': state.token }, body: JSON.stringify({ title: 'Draft', imports: [] }) });
  assert.equal(saved.status, 200);
});

test('publishing commits content and retries a failed push without creating a second commit', async t => {
  const { root, store } = await fixture(t);
  const remote = await fs.mkdtemp(path.join(os.tmpdir(), 'zero-remote-'));
  t.after(async () => { assert.ok(path.resolve(remote).startsWith(path.resolve(os.tmpdir()) + path.sep)); await fs.rm(remote, { recursive: true, force: true }); });
  const git = async args => (await execute('git', ['-c', `safe.directory=${root}`, ...args], { cwd: root })).stdout.trim();
  await execute('git', ['init', '--bare', remote]); await git(['init', '-b', 'main']);
  await git(['config', 'user.name', 'Zero Fixture']); await git(['config', 'user.email', 'zero@example.test']);
  await git(['add', '.']); await git(['commit', '-m', 'Initial fixture']); await git(['remote', 'add', 'origin', remote]);
  const state = await store.load(); const imported = await store.apply({ ...state, imports: [incoming()] });
  await fs.writeFile(path.join(root, 'content/日本語.md'), '# Unicode filename\n');
  await git(['add', '--', 'content/日本語.md']);
  await git(['remote', 'set-url', 'origin', path.join(remote, 'missing')]);
  const failed = await store.publish('Import a note'); assert.equal(failed.pushed, false);
  assert.equal((await git(['log', '-1', '--format=%s'])), 'Import a note');
  await git(['remote', 'set-url', 'origin', remote]);
  const retried = await store.publish('No second commit'); assert.equal(retried.pushed, true); assert.equal(retried.commit, failed.commit);
  assert.equal((await git(['rev-list', '--count', 'HEAD'])), '2'); assert.equal(imported.catalog.documents.length, 1);
});
