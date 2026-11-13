export interface Quiz { question: string; options: string[]; correctIndex: number; explanation?: string }
export interface Heading { id: string; text: string; depth: number }
export interface RenderContext { base?: string; file?: string; legacyHeadings?: boolean; assetUrls?: Record<string, string>; catalog?: { collections: { id: string; kind: string; slug: string }[]; documents: { id: string; collectionId: string; file: string; slug: string; legacy?: string }[]; assets?: string[]; assetAliases?: Record<string,string> } }
export function escapeHtml(value?: unknown): string
export function slugify(value: string): string
export function normalizePath(value: string): string
export function parseSource(raw: string): { meta: Record<string, string>; body: string; quizzes: Quiz[] }
export function renderMarkdown(raw: string, context?: RenderContext): { html: string; meta: Record<string, string>; quizzes: Quiz[]; headings: Heading[] }
export function documentRoute(doc: { collectionId: string; slug: string; publicPath?: string }, catalog: { collections: { id: string; kind: string; slug: string; buildType?:string }[] }): string
