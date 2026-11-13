import type {
  NavigationPageData,
  SidebarCategoryData,
} from "@/types/navigation"

export type SidebarNavigationJson = {
  home: NavigationPageData
  categories: Array<{
    title: string
    icon?: string
    topics: Record<string, string | { path: string; layout?: string }>
  }>
}

const navigation: SidebarNavigationJson = {
  home: { label: "Overview", path: "/" },
  categories: [],
}

export function parseSidebarJson(nav: SidebarNavigationJson) {
  const homePage = nav.home
  const sidebarCategories: SidebarCategoryData[] = nav.categories.map((category) => ({
    title: category.title,
    icon: category.icon,
    items: Object.entries(category.topics).map(([label, value]) => {
      let path = ""
      let layout: string | undefined = undefined

      if (typeof value === "string") {
        path = value
      } else {
        path = value.path
        layout = value.layout
      }

      const slug = path.split("/")[2] ?? label.toLowerCase().replace(/\s+/g, "-")
      return { label, path, slug, layout }
    }),
  }))
  const sidebarItems = sidebarCategories.flatMap((category) => category.items)

  return {
    homePage,
    sidebarCategories,
    sidebarItems,
  }
}

const parsedDefault = parseSidebarJson(navigation)

export const homePage = parsedDefault.homePage
export const sidebarCategories = parsedDefault.sidebarCategories
export const sidebarItems = parsedDefault.sidebarItems

export function getSidebarItemByPath(path: string) {
  return sidebarItems.find((item) => item.path === path)
}

export function getSidebarItemBySlug(slug: string) {
  return sidebarItems.find((item) => item.slug === slug)
}
