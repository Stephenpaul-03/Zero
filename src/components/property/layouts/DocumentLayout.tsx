import type { ReactNode } from "react"

type DocumentLayoutProps = {
  htmlContent: string
  quizNode?: ReactNode
}

export function DocumentLayout({ htmlContent, quizNode }: DocumentLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-10 md:py-12">
      <div
        className="markdown-body text-zinc-800 dark:text-zinc-200"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      {quizNode}
    </div>
  )
}
