import type {Catalog,Category,Collection,Kind} from '../src/zero/model'
export function collectionsForSection(catalog:Catalog,kind:Kind,buildType?:'hardware'|'software'):Collection[]
export function categoriesForSection(catalog:Catalog,kind:Kind,buildType?:'hardware'|'software'):Category[]
