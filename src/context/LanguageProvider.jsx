'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from 'react'
import { WEBSITE_NAME } from '@/context/constants/constants_app'
import { interpolate, LOCALES, messages } from '@/i18n/messages'
import { getLocaleLabel, getSortedLocales, isRtlLocale, LOCALE_FLAGS, LOCALE_NAMES } from '@/i18n/locales'

const STORAGE_KEY = 'fidtab-locale'
const LanguageContext = createContext(null)

const localeListeners = new Set()

function subscribeToLocale(callback) {
  localeListeners.add(callback)
  return () => localeListeners.delete(callback)
}

function getClientLocale() {
  if (typeof window === 'undefined') return 'fr'
  const stored = localStorage.getItem(STORAGE_KEY)
  return LOCALES.includes(stored) ? stored : 'fr'
}

function notifyLocaleChange() {
  localeListeners.forEach((listener) => listener())
}

export function LanguageProvider({ children }) {
  const locale = useSyncExternalStore(subscribeToLocale, getClientLocale, () => 'fr')

  const setLocale = useCallback((next) => {
    if (!LOCALES.includes(next)) return
    localStorage.setItem(STORAGE_KEY, next)
    notifyLocaleChange()
  }, [])

  const content = useMemo(() => messages[locale] ?? messages.fr, [locale])

  const t = useCallback(
    (text, vars = {}) => interpolate(text, { name: WEBSITE_NAME, ...vars }),
    []
  )

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = isRtlLocale(locale) ? 'rtl' : 'ltr'
    document.title = `${WEBSITE_NAME} — ${t(content.meta.titleSuffix)}`
  }, [locale, content.meta.titleSuffix, t])

  const sortedLocales = useMemo(() => getSortedLocales(locale), [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      content,
      t,
      locales: sortedLocales,
      localeFlags: LOCALE_FLAGS,
      getLocaleLabel: (code) => getLocaleLabel(locale, code),
      localeNames: LOCALE_NAMES[locale] ?? LOCALE_NAMES.fr,
      isRtl: isRtlLocale(locale),
    }),
    [locale, setLocale, content, t, sortedLocales]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
