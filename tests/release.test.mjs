import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {renderMarkdown} from '../shared/markdown.mjs';
import {publicEntries} from '../shared/public-routes.mjs';
import {preparePublic} from '../scripts/prepare.mjs';

test('all renderers get sanitized HTML while keeping notes, images, tables, code, and checklists',()=>{
  const source='<script>window.bad=true</script>\n<img src="https://example.com/a.png" onerror="alert(1)">\n<a href="jav&#x61;script:alert(1)">Unsafe</a>\n<iframe srcdoc="<script>alert(1)</script>"></iframe>\n<details open><summary>Details</summary>Useful text</details>\n\n[Bad](javascript:alert%281%29)\n\n- [x] Done\n\n| One | Two |\n| --- | --- |\n| A | B |\n\n~~~js\nconst safe = "<script>example</script>";\n~~~\n';
  const {html}=renderMarkdown(source);
  assert.doesNotMatch(html,/<script|<iframe|onerror=|href="javascript:|href="jav&#/i);
  assert.match(html,/<details open>/);assert.match(html,/<summary>Details<\/summary>/);assert.match(html,/<table>/);assert.match(html,/type="checkbox"/);assert.match(html,/disabled/);assert.match(html,/https:\/\/example.com\/a.png/);assert.match(html,/language-js/);assert.match(html,/&lt;script&gt;/);
});

test('published static routes include Notes aliases and legal URLs without unlisted collections',()=>{
  const catalog={collections:[{id:'notes',kind:'learn',slug:'topic',title:'Topic',listed:true},{id:'hidden',kind:'learn',slug:'hidden',title:'Hidden',listed:false},{id:'app',kind:'build',buildType:'software',slug:'app',title:'App',listed:true}],documents:[{id:'note',collectionId:'notes',slug:'basics/first',title:'First'},{id:'hidden-note',collectionId:'hidden',slug:'secret',title:'Hidden'},{id:'legal',collectionId:'app',slug:'legal/privacy',title:'Privacy',publicPath:'/pages/app/privacy'}]};
  const routes=publicEntries(catalog);for(const route of ['/notes','/notes/topic','/notes/topic/basics/first','/learn/topic/basics/first','/build/software/app','/pages/app/privacy','/build/software/app/legal/privacy'])assert.ok(routes.has(route),route);assert.ok(![...routes.keys()].some(route=>route.includes('hidden')));
});

test('outline IDs remain unique for repeated headings and non-Latin text',()=>{
  const {headings}=renderMarkdown('## Definition\n\n### Definition\n\n## Definition\n\n## 日本語\n\n## 日本語\n',{legacyHeadings:true});
  assert.equal(new Set(headings.map(heading=>heading.id)).size,headings.length);assert.ok(headings.every(heading=>heading.id));assert.deepEqual(headings.slice(0,3).map(heading=>heading.id),['definition','definition-1','definition-2']);
});

test('legacy note links and exported image paths resolve under a repository base',()=>{
  const catalog={collections:[{id:'notes',kind:'learn',slug:'topic'}],documents:[{id:'first',collectionId:'notes',slug:'basics/first',file:'files/topic/first.md',legacy:'Topic-first'}],assets:['files/topic/Images/Joins1.png','files/topic/Images/img3.png'],assetAliases:{'files/topic/old-image.png':'files/topic/Images/img3.png'}};
  const {html}=renderMarkdown('[First](/Topic-first#section)\n\n![Joins](joins1.png)\n\n![Export](old/folder/Images/img3.png)\n\n![Alias](old-image.png)',{catalog,file:'files/topic/first.md',base:'/Zero/'});
  assert.match(html,/href="\/Zero\/notes\/topic\/basics\/first#section"/);assert.match(html,/src="\/Zero\/zero-content\/files\/topic\/Images\/Joins1.png"/);assert.equal((html.match(/src="\/Zero\/zero-content\/files\/topic\/Images\/img3.png"/g)||[]).length,2);
});

test('public generation copies only registered content and rejects symlinks',async t=>{
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'zero-public-test-'));t.after(async()=>{assert.ok(path.resolve(root).startsWith(path.resolve(os.tmpdir())+path.sep));await fs.rm(root,{recursive:true,force:true})});await fs.mkdir(path.join(root,'content/files'),{recursive:true});await fs.writeFile(path.join(root,'content/files/note.md'),'# Note');await fs.writeFile(path.join(root,'content/files/unpublished.md'),'# Private work');
  const catalog={assets:[],documents:[{file:'files/note.md'}]};await fs.writeFile(path.join(root,'content/catalog.json'),JSON.stringify(catalog));await preparePublic(root);assert.equal(await fs.readFile(path.join(root,'public/zero-content/files/note.md'),'utf8'),'# Note');await assert.rejects(fs.access(path.join(root,'public/zero-content/files/unpublished.md')));
  await fs.mkdir(path.join(root,'other'));await fs.writeFile(path.join(root,'other/linked.md'),'# Linked');await fs.symlink(path.join(root,'other'),path.join(root,'content/files/link'),'junction');catalog.assets=['files/link/linked.md'];await fs.writeFile(path.join(root,'content/catalog.json'),JSON.stringify(catalog));await assert.rejects(preparePublic(root),/symbolic links/);
});
