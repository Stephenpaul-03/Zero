import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme, type Theme } from "@/components/theme/theme-context"

const themeCycle: Theme[] = ["dark", "light"]

const themeIcons = {
  dark: Moon,
  light: Sun,
} satisfies Record<Theme, typeof Moon>

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const Icon = themeIcons[theme]

  function cycleTheme(event: React.MouseEvent<HTMLButtonElement>) {
    const currentIndex = themeCycle.indexOf(theme)
    const nextTheme = themeCycle[(currentIndex + 1) % themeCycle.length] ?? "dark"

    setTheme(nextTheme, { x: event.clientX, y: event.clientY })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Theme: ${theme}. Click to change theme.`}
      title={`Theme: ${theme}`}
      className="border-zinc-200 bg-white text-zinc-600 shadow-none hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/[0.1] dark:bg-white/[0.045] dark:text-zinc-400 dark:hover:bg-white/[0.075] dark:hover:text-zinc-100"
    >
      <Icon className="size-4" aria-hidden="true" />
    </Button>
  )
}

