import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { MonitorUp } from "lucide-react"

const desktopQuery = "(min-width: 1100px) and (min-height: 700px) and (hover: hover) and (pointer: fine)"

function getIsDesktop() {
  if (typeof window === "undefined") {
    return true
  }

  return window.matchMedia(desktopQuery).matches
}

type DesktopOnlyGuardProps = {
  children: ReactNode
}

export function DesktopOnlyGuard({ children }: DesktopOnlyGuardProps) {
  const [isDesktop, setIsDesktop] = useState(getIsDesktop)

  useEffect(() => {
    const mediaQuery = window.matchMedia(desktopQuery)
    const handleChange = () => setIsDesktop(mediaQuery.matches)

    handleChange()
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  if (!isDesktop) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050608] px-6 text-center text-zinc-100">
        <div className="max-w-sm">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.055]">
            <MonitorUp className="size-5 text-zinc-300" aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-normal">
            Lattice is desktop-only for now.
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            This foundation shell is tuned for wide screens, precise pointers,
            and focused side-by-side lesson references.
          </p>
        </div>
      </div>
    )
  }

  return children
}
