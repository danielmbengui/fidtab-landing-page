'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react'
import {
  applyTheme,
  getStoredThemePreference,
  getSystemTheme,
  resolveTheme,
  THEME_PREFERENCES,
  THEME_STORAGE_KEY,
} from '@/lib/theme'

const ThemeContext = createContext(null)
const themeListeners = new Set()

function subscribeToTheme(callback) {
  themeListeners.add(callback)
  return () => themeListeners.delete(callback)
}

function notifyThemeChange() {
  themeListeners.forEach((listener) => listener())
}

function readThemePreference() {
  return getStoredThemePreference()
}

export function ThemeProvider({ children }) {
  const preference = useSyncExternalStore(subscribeToTheme, readThemePreference, () => 'system')
  const resolvedTheme = useMemo(() => resolveTheme(preference), [preference])

  const setTheme = useCallback((next) => {
    if (!THEME_PREFERENCES.includes(next)) return
    localStorage.setItem(THEME_STORAGE_KEY, next)
    applyTheme(next)
    notifyThemeChange()
  }, [])

  useEffect(() => {
    applyTheme(preference)
  }, [preference])

  useEffect(() => {
    if (preference !== 'system') return undefined

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      applyTheme('system')
      notifyThemeChange()
    }

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [preference])

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      setTheme,
      isDark: resolvedTheme === 'dark',
      isLight: resolvedTheme === 'light',
      isSystem: preference === 'system',
      systemTheme: getSystemTheme(),
    }),
    [preference, resolvedTheme, setTheme],
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
