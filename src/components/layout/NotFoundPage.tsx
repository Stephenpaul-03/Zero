import iconDark from "@/assets/icon-dark.png"
import iconLight from "@/assets/icon-light.png"
import copy from "@/constants/ui-copy.json"
import { siteRoot } from "@/lib/site-path"

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-xl text-center">
        <div className="mx-auto mb-8 flex size-24 items-center justify-center rounded-[2rem] border border-zinc-200 bg-white/70 p-5 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.03]">
          <picture>
            <source media="(prefers-color-scheme: dark)" srcSet={iconDark} />
            <img src={iconLight} alt="" className="size-full object-contain" aria-hidden="true" />
          </picture>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">{copy.notFound.eyebrow}</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 md:text-5xl">
          {copy.notFound.title}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-zinc-500 dark:text-zinc-400">
          {copy.notFound.description}
        </p>
        <a
          href={siteRoot}
          className="mt-8 inline-flex items-center rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-zinc-50 dark:text-zinc-950"
        >
          {copy.notFound.backLabel}
        </a>
      </section>
    </div>
  )
}
