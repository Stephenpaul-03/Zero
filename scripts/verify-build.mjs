import fs from 'node:fs/promises';
import path from 'node:path';
import {publicEntries} from '../shared/public-routes.mjs';

const root=path.resolve(import.meta.dirname,'..');
const dist=path.join(root,'dist');
const catalog=JSON.parse(await fs.readFile(path.join(root,'content/catalog.json'),'utf8'));
const base=process.env.ZERO_BASE_PATH||'/';
if(!base.startsWith('/')||!base.endsWith('/'))throw new Error('ZERO_BASE_PATH must be a path with leading and trailing slashes.');
let fileCount=0;
const builtFiles=new Set();
async function inspect(directory){
  for(const entry of await fs.readdir(directory,{withFileTypes:true})){
    const full=path.join(directory,entry.name),relative=path.relative(dist,full).replaceAll('\\','/');
    if(entry.isSymbolicLink())throw new Error(`Symlink in build artifact: ${relative}`);
    if(/(^|\/)(?:\.git|\.zero|\.env(?:\.[^/]*)?|node_modules|__zero)(?:\/|$)/.test(relative)||/^(?:server|archive)(?:\/|$)/.test(relative))throw new Error(`Local-only file in production: ${relative}`);
    if(entry.isDirectory()){await inspect(full);continue}
    fileCount++;
    builtFiles.add(relative);
    if(relative.endsWith('.js')){
      const text=await fs.readFile(full,'utf8');
      for(const marker of ['X-Zero-Token','/__zero/','createEditorHandler','node:child_process','Content manager'])if(text.includes(marker))throw new Error(`Admin code in public JavaScript: ${marker}`);
    }
  }
}
await inspect(dist);
let routes=0;
for(const route of publicEntries(catalog).keys()){
  const target=route==='/'?path.join(dist,'index.html'):path.join(dist,route.slice(1),'index.html');
  if(!target.startsWith(dist+path.sep))throw new Error('Published route leaves dist.');
  const html=await fs.readFile(target,'utf8');
  const scripts=[...html.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)].map(match=>match[1]);
  if(!scripts.some(src=>src.startsWith(`${base}assets/`)))throw new Error(`Invalid asset base for ${route}`);
  for(const match of html.matchAll(/<(?:a|img)\b[^>]*\b(?:href|src)="([^"]+)"/g)){
    const value=match[1];if(!value.startsWith('/')||value.startsWith('//'))continue;
    const pathname=new URL(value.replaceAll('&amp;','&'),'https://zero.invalid').pathname;
    if(!pathname.startsWith(base))throw new Error(`Internal link leaves deployment base in ${route}: ${value}`);
    const relative=decodeURIComponent(pathname.slice(base.length)).replace(/\/$/,'');
    if(!builtFiles.has(relative)&&!builtFiles.has(relative?`${relative}/index.html`:'index.html'))throw new Error(`Missing internal link or image in ${route}: ${value}`);
  }
  routes++;
}
await fs.access(path.join(dist,'.nojekyll'));await fs.access(path.join(dist,'404.html'));
console.log(`Production artifact verified: ${routes} direct-entry routes, ${fileCount} files, base ${base}, no admin code or local-only files.`);
