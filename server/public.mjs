import fs from 'node:fs/promises';
import path from 'node:path';
const types={'.json':'application/json; charset=utf-8','.md':'text/markdown; charset=utf-8','.markdown':'text/markdown; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml','.gif':'image/gif','.ico':'image/x-icon'};
// Vite caches public filenames at startup. Read this generated subtree dynamically so new imports work immediately.
export function createPublicContentHandler(root,base='/') {
  const directory=path.resolve(root,'public/zero-content');
  return async(req,res,next)=>{
    let pathname;try{pathname=decodeURIComponent(new URL(req.url||'/','http://localhost').pathname)}catch{return next()}
    const prefix=base.replace(/\/$/,'')+'/zero-content/';
    const matched=pathname.startsWith(prefix)?prefix:pathname.startsWith('/zero-content/')?'/zero-content/':null;
    if(!matched)return next();
    const relative=pathname.slice(matched.length);
    if(relative.split('/').some(part=>part==='..'||part==='.')||relative.includes('\\')||relative.includes('\0')){res.statusCode=403;res.end();return}
    const target=path.resolve(directory,relative);
    if(!target.startsWith(directory+path.sep)){res.statusCode=403;res.end();return}
    try{
      const bytes=await fs.readFile(target);res.setHeader('Content-Type',types[path.extname(target).toLowerCase()]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.statusCode=200;res.end(req.method==='HEAD'?undefined:bytes)
    }catch{res.statusCode=404;res.setHeader('Content-Type','text/plain');res.end('Content file not found')}
  }
}
export function watchSavedCatalog(server,root){
 const source=path.resolve(root,'content/catalog.json'),generated=path.resolve(root,'public/zero-content/catalog.json');
 let timer,lastSent='';
 async function ready(attempt=0){
  try{const [a,b]=await Promise.all([fs.readFile(source,'utf8'),fs.readFile(generated,'utf8')]);if(a===b){if(lastSent!==a){lastSent=a;server.ws.send({type:'full-reload'})}return}}catch{/* Wait until generation finishes. */}
  if(attempt<80)timer=setTimeout(()=>void ready(attempt+1),100)
 }
 const changed=file=>{if(path.resolve(file).toLowerCase()===source.toLowerCase()){clearTimeout(timer);timer=setTimeout(()=>void ready(),100)}};
 server.watcher.add(source);server.watcher.on('change',changed);server.watcher.on('add',changed);server.httpServer?.on('close',()=>{clearTimeout(timer);server.watcher.off('change',changed);server.watcher.off('add',changed)})
}
