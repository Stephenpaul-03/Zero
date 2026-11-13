import { slugify } from './markdown.mjs';
export function groupPath(collection, groupId) {
  const chain = []; const seen = new Set();
  let group = collection.groups.find(value => value.id === groupId);
  while (group) {
    if (seen.has(group.id)) throw new Error('Sidebar sections cannot contain a cycle.');
    seen.add(group.id); chain.unshift(group.slug);
    group = group.parentId ? collection.groups.find(value => value.id === group.parentId) : undefined;
  }
  return chain.join('/');
}
export function publicPagePath(collection, groupId, leaf) {
  let group=collection.groups.find(value=>value.id===groupId);const seen=new Set();
  while(group){if(seen.has(group.id))throw new Error('Sidebar sections cannot contain a cycle.');seen.add(group.id);if(group.publicApp)return `/pages/${group.publicApp}/${leaf}`;group=collection.groups.find(value=>value.id===group.parentId)}
}
export function destinationFolder(catalog, collectionId, groupId) {
  const collection = catalog.collections.find(value => value.id === collectionId);
  if (!collection) throw new Error('Choose a menu first.');
  const category = catalog.categories?.find(value => value.id === collection.categoryId)?.title || collection.category || (collection.kind === 'pages' ? 'Apps' : 'Notes');
  return `files/managed/${collection.kind}/${collection.kind==='build'?(collection.buildType||'hardware')+'/':''}${slugify(category)}/${collection.slug}/${groupPath(collection, groupId)}`;
}
export function navigationDocument(catalog) {
  const sections = {};
  for (const kind of ['learn', 'build', 'pages']) {
    const categories = (catalog.categories || []).filter(value => value.kind === kind).sort((a,b)=>a.order-b.order);
    const menus = catalog.collections.filter(value=>value.kind===kind).sort((a,b)=>a.order-b.order);
    const groupsFor = (collection, parentId) => collection.groups.filter(value=>(value.parentId||undefined)===parentId).sort((a,b)=>a.order-b.order).map(group=>({ title:group.title, publicApp:group.publicApp, slug:group.slug, order:group.order, documents:catalog.documents.filter(doc=>doc.groupId===group.id).sort((a,b)=>a.order-b.order).map(doc=>({id:doc.id,title:doc.title,publicPath:doc.publicPath,slug:doc.slug,file:doc.file,order:doc.order})), children:groupsFor(collection,group.id) }));
    const menuFor=menu=>({id:menu.id,buildType:menu.buildType,title:menu.title,slug:menu.slug,listed:kind==='pages'?false:menu.listed,order:menu.order,sections:groupsFor(menu)});
    sections[kind] = categories.length ? categories.map(category=>({id:category.id,title:category.title,buildType:category.buildType,order:category.order,menus:menus.filter(menu=>menu.categoryId===category.id).map(menuFor)})) : [{title:'Menus',order:0,menus:menus.map(menuFor)}];
  }
  return { version:1, sections };
}
