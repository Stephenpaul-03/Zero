export type NavigationPageData = {
  label: string
  path: string
  slug?: string
  layout?: string
  resolvedUrl?: string
}

export type SidebarItemData = NavigationPageData & {
  label: string
  path: string
  slug: string
  layout?: string
}

export type SidebarCategoryData = {
  id?: string
  parentId?: string
  depth?: number
  title: string
  icon?: string
  items: SidebarItemData[]
}
