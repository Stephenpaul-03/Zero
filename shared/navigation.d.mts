import type { Catalog, Collection } from '../src/zero/model'
export function groupPath(collection: Collection, groupId: string): string
export function publicPagePath(collection: Collection, groupId: string, leaf: string): string | undefined
export function destinationFolder(catalog: Catalog, collectionId: string, groupId: string): string
export function navigationDocument(catalog: Catalog): unknown
