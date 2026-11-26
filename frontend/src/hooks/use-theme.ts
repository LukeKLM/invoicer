import { useSyncExternalStore } from "react"

export type Theme = "light" | "dark" | "system"

const STORAGE_KEY = "theme"

const readStoredTheme = (): Theme => {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === "light" || value === "dark" ? value : "system"
  } catch {
    return "system"
  }
}

const media = window.matchMedia("(prefers-color-scheme: dark)")

// One module-level store, so every theme control shows the same selection
let current: Theme = readStoredTheme()
const listeners = new Set<() => void>()

const applyTheme = () => {
  const dark = current === "dark" || (current === "system" && media.matches)
  document.documentElement.classList.toggle("dark", dark)
}

// follow OS changes while in system mode
media.addEventListener("change", applyTheme)

const setTheme = (next: Theme) => {
  try {
    if (next === "system") localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // storage unavailable - theme still applies for this session
  }
  current = next
  applyTheme()
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, () => current)
  return { theme, setTheme }
}
