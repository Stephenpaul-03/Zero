import { documentRoute } from './routes.mjs';

// Static entry documents let Pages serve published routes with HTTP 200.
export function publicEntries(catalog) {
  const entries = new Map([
    ['/', {title: 'Zero'}], ['/build', {title: 'Zero'}],
    ['/notes', {title: 'Notes'}], ['/build/hardware', {title: 'Hardware builds'}],
    ['/build/software', {title: 'Software projects'}],
  ]);
  for (const collection of catalog.collections.filter(value => value.listed && ['learn', 'build'].includes(value.kind))) {
    const docs = catalog.documents.filter(doc => doc.collectionId === collection.id);
    const overview = docs.find(doc => !doc.slug) || docs[0];
    entries.set(documentRoute({collectionId: collection.id, slug: ''}, catalog), {title: collection.title, doc: overview, collection});
    for (const doc of docs) {
      const entry = {title: doc.title, doc, collection};
      entries.set(documentRoute(doc, catalog), entry);
      if(doc.legacy&&/^[a-zA-Z0-9_-]+$/.test(doc.legacy))entries.set(`/${doc.legacy}`,entry);
      if (doc.publicPath) entries.set(documentRoute({...doc, publicPath: undefined}, catalog), entry);
    }
  }
  for (const [route, entry] of [...entries]) {
    if (route === '/notes' || route.startsWith('/notes/')) entries.set(route.replace(/^\/notes(?=\/|$)/, '/learn'), entry);
  }
  return entries;
}
