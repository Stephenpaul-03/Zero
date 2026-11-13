import { useEffect, useState } from "react"

import {
  ThemeProviderContext,
  type Theme,
} from "@/components/theme/theme-context"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

function getSystemTheme(defaultTheme: Theme): Theme {
  if (typeof window === "undefined" || !window.matchMedia) {
    return defaultTheme
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function getInitialTheme(defaultTheme: Theme, storageKey: string): Theme {
  if (typeof window !== "undefined") {
    const storedTheme = window.localStorage.getItem(storageKey)
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme
    }
  }

  return getSystemTheme(defaultTheme)
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => getInitialTheme(defaultTheme, storageKey)
  )

  const [splashCoords, setSplashCoords] = useState<{ x: number; y: number } | null>(null)
  const [splashTheme, setSplashTheme] = useState<Theme | null>(null)

  useEffect(() => {
    const root = window.document.documentElement

    // Disable transitions temporarily to prevent lag when switching themes
    const css = document.createElement("style")
    css.type = "text/css"
    css.appendChild(
      document.createTextNode(
        `* {
           -webkit-transition: none !important;
           -moz-transition: none !important;
           -o-transition: none !important;
           -ms-transition: none !important;
           transition: none !important;
        }`
      )
    )
    document.head.appendChild(css)

    root.classList.remove("light", "dark")
    root.classList.add(theme)

    // Force a reflow
    void window.getComputedStyle(css).opacity

    // Re-enable transitions
    setTimeout(() => {
      document.head.removeChild(css)
    }, 0)
  }, [theme])

  const value = {
    theme,
    setTheme: (nextTheme: Theme, coords?: { x: number; y: number }) => {
      if (coords) {
        setSplashCoords(coords)
        setSplashTheme(nextTheme)
        window.setTimeout(() => {
          localStorage.setItem(storageKey, nextTheme)
          setTheme(nextTheme)
        }, 400)
        window.setTimeout(() => {
          setSplashCoords(null)
          setSplashTheme(null)
        }, 1000)
      } else {
        localStorage.setItem(storageKey, nextTheme)
        setTheme(nextTheme)
      }
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
      {splashCoords && splashTheme && (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
          <div
            className="project-splash-circle"
            style={{
              left: `${splashCoords.x}px`,
              top: `${splashCoords.y}px`,
              backgroundColor: splashTheme === "dark" ? "oklch(0.141 0.005 285.823)" : "oklch(1 0 0)",
            }}
          />
        </div>
      )}
    </ThemeProviderContext.Provider>
  )
}
