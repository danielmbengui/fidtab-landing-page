'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { WEBSITE_NAME } from '@/context/constants/constants_app'
import { interpolate, LOCALES, messages } from '@/i18n/messages'
import { getLocaleLabel, LOCALE_FLAGS, LOCALE_NAMES } from '@/i18n/locales'

const STORAGE_KEY = 'fidtab-locale'
const LanguageContext = createContext(null)

function getInitialLocale() {
  if (typeof window === 'undefined') return 'fr'
  const stored = localStorage.getItem(STORAGE_KEY)
  return LOCALES.includes(stored) ? stored : 'fr'
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState('fr')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setLocaleState(getInitialLocale())
    setReady(true)
  }, [])

  const setLocale = useCallback((next) => {
    if (!LOCALES.includes(next)) return
    setLocaleState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const content = useMemo(() => messages[locale] ?? messages.fr, [locale])

  const t = useCallback(
    (text, vars = {}) => interpolate(text, { name: WEBSITE_NAME, ...vars }),
    []
  )

  useEffect(() => {
    if (!ready) return
    document.documentElement.lang = locale
    document.title = `${WEBSITE_NAME} — ${t(content.meta.titleSuffix)}`
  }, [ready, locale, content.meta.titleSuffix, t])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      content,
      t,
      locales: LOCALES,
      localeFlags: LOCALE_FLAGS,
      getLocaleLabel: (code) => getLocaleLabel(locale, code),
      localeNames: LOCALE_NAMES[locale] ?? LOCALE_NAMES.fr,
    }),
    [locale, setLocale, content, t]
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
