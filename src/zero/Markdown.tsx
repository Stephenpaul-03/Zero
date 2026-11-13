import { useMemo } from 'react'
import { renderMarkdown } from '../../shared/markdown.mjs'
import type { Catalog } from './model'
import { base } from './model'
import { QuizCard } from '@/components/property/layouts/QuizCard'
import { DocumentLayout } from '@/components/property/layouts/DocumentLayout'
import 'prismjs/themes/prism-tomorrow.css'

export function Markdown({ source, file, catalog, assetUrls }: { source: string; file: string; catalog: Catalog; assetUrls?: Record<string, string> }) {
  const rendered = useMemo(() => renderMarkdown(source, { file, catalog, base, assetUrls, legacyHeadings: true }), [source, file, catalog, assetUrls])
  return <DocumentLayout htmlContent={rendered.html} quizNode={rendered.quizzes.length > 0 ? <QuizCard key={source} quizzes={rendered.quizzes} /> : null} />
}
