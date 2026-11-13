export function collectionsForSection(catalog,kind,buildType='hardware'){
  return catalog.collections.filter(menu=>menu.kind===kind&&(kind!=='build'||(menu.buildType||'hardware')===buildType));
}
export function categoriesForSection(catalog,kind,buildType='hardware'){
  const menus=collectionsForSection(catalog,kind,buildType);
  return (catalog.categories||[]).filter(category=>{
    if(category.kind!==kind)return false;
    if(kind!=='build')return true;
    if(category.buildType)return category.buildType===buildType;
    const members=catalog.collections.filter(menu=>menu.categoryId===category.id);
    return !members.length||menus.some(menu=>menu.categoryId===category.id);
  }).sort((a,b)=>a.order-b.order);
}
