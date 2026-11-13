import { createContext, useContext } from "react"

export type Theme = "dark" | "light"

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme, coords?: { x: number; y: number }) => void
}

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
}


export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState)

export function useTheme() {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
