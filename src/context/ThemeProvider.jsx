'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from 'react'

const STORAGE_KEY = 'fidtab-theme'
export const THEME_MODES = ['light', 'dark', 'system']

const themeListeners = new Set()

function subscribeToTheme(callback) {
  themeListeners.add(callback)
  return () => themeListeners.delete(callback)
}

function getStoredThemeMode() {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(STORAGE_KEY)
  return THEME_MODES.includes(stored) ? stored : 'system'
}

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(mode) {
  if (mode === 'system') return getSystemTheme()
  return mode
}

function notifyThemeChange() {
  themeListeners.forEach((listener) => listener())
}

function applyTheme(resolved) {
  document.documentElement.setAttribute('data-theme', resolved)
  document.documentElement.style.colorScheme = resolved
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const mode = useSyncExternalStore(subscribeToTheme, getStoredThemeMode, () => 'system')
  const resolved = useMemo(() => resolveTheme(mode), [mode])

  const setMode = useCallback((next) => {
    if (!THEME_MODES.includes(next)) return
    localStorage.setItem(STORAGE_KEY, next)
    applyTheme(resolveTheme(next))
    notifyThemeChange()
  }, [])

  useEffect(() => {
    applyTheme(resolved)
  }, [resolved])

  useEffect(() => {
    if (mode !== 'system') return undefined

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      applyTheme(getSystemTheme())
      notifyThemeChange()
    }

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [mode])

  const value = useMemo(
    () => ({ mode, resolved, setMode }),
    [mode, resolved, setMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
