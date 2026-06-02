'use client'

import { useLanguage } from '@/context/LanguageProvider'
import { THEME_MODES, useTheme } from '@/context/ThemeProvider'

const ICONS = {
  light: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  dark: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6.2 1.8a6.5 6.5 0 1 0 7 7 5.2 5.2 0 0 1-7-7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  system: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
}

export default function ThemeToggle() {
  const { content: c } = useLanguage()
  const { mode, setMode } = useTheme()
  const labels = c.themeToggle

  return (
    <div className="theme-toggle" role="group" aria-label={labels.group}>
      {THEME_MODES.map((item) => (
        <button
          key={item}
          type="button"
          className={`theme-toggle-btn${mode === item ? ' active' : ''}`}
          onClick={() => setMode(item)}
          aria-pressed={mode === item}
          title={labels[item]}
        >
          {ICONS[item]}
          <span className="theme-toggle-label">{labels[item]}</span>
        </button>
      ))}
    </div>
  )
}
