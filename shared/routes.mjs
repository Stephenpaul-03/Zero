export function documentRoute(doc, catalog) {
  if (doc.publicPath) return doc.publicPath;
  const collection = catalog.collections.find(item => item.id === doc.collectionId);
  if (!collection) return '/';
  const prefix=collection.kind==='build'?`/build/${collection.buildType||'hardware'}`:collection.kind==='learn'?'/notes':`/${collection.kind}`;
  return `${prefix}/${collection.slug}${doc.slug ? `/${doc.slug}` : ''}`;
}
