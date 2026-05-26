'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageProvider'

export default function LanguageSelector() {
  const { locale, setLocale, locales, localeFlags, getLocaleLabel } = useLanguage()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    const onClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const onEscape = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [])

  return (
    <div className={`lang-selector ${open ? 'open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="lang-selector-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
      >
        <span className="lang-flag" aria-hidden="true">{localeFlags[locale]}</span>
        <span className="lang-name">{getLocaleLabel(locale)}</span>
        <svg className="lang-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="lang-selector-menu" role="listbox" aria-label="Language">
          {locales.map((code) => (
            <li key={code} role="option" aria-selected={code === locale}>
              <button
                type="button"
                className={`lang-selector-option ${code === locale ? 'active' : ''}`}
                onClick={() => {
                  setLocale(code)
                  setOpen(false)
                }}
              >
                <span className="lang-flag" aria-hidden="true">{localeFlags[code]}</span>
                <span className="lang-name">{getLocaleLabel(code)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
