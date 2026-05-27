'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '@/context/LanguageProvider'
import { useTheme } from '@/context/ThemeProvider'
import { getFloatingMenuPosition } from '@/lib/floatingMenuPosition'

const THEME_OPTIONS = [
  { id: 'system', icon: '💻' },
  { id: 'light', icon: '☀️' },
  { id: 'dark', icon: '🌙' },
]

function getMenuPosition(triggerEl) {
  return getFloatingMenuPosition(triggerEl, { minWidth: 240, maxHeight: 240 })
}

function getThemeIcon(preference, resolvedTheme) {
  if (preference === 'system') return '💻'
  if (preference === 'light') return '☀️'
  return '🌙'
}

export default function ThemeSelector({ compact = false }) {
  const { preference, resolvedTheme, setTheme } = useTheme()
  const { content: c } = useLanguage()
  const themeLabels = c.theme.options

  const [open, setOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState(null)
  const [mounted, setMounted] = useState(false)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const updateMenuPosition = useCallback(() => {
    setMenuPosition(getMenuPosition(triggerRef.current))
  }, [])

  useLayoutEffect(() => {
    if (!open) {
      setMenuPosition(null)
      return undefined
    }

    updateMenuPosition()

    const onResize = () => updateMenuPosition()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, true)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize, true)
    }
  }, [open, updateMenuPosition])

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      const target = event.target
      if (rootRef.current?.contains(target)) return
      if (menuRef.current?.contains(target)) return
      setOpen(false)
    }

    const onEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    const frame = requestAnimationFrame(() => {
      document.addEventListener('pointerdown', onPointerDown)
    })

    document.addEventListener('keydown', onEscape)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onEscape)
    }
  }, [open])

  const currentLabel = themeLabels[preference] ?? preference
  const triggerIcon = getThemeIcon(preference, resolvedTheme)

  const menu = open && menuPosition ? (
    <ul
      ref={menuRef}
      className="theme-selector-menu theme-selector-menu--fixed"
      dir="ltr"
      role="listbox"
      aria-label={c.theme.label}
      style={{
        top: menuPosition.top,
        left: menuPosition.left,
        right: menuPosition.right,
        minWidth: menuPosition.minWidth,
        maxWidth: menuPosition.maxWidth,
        maxHeight: menuPosition.maxHeight,
      }}
    >
      {THEME_OPTIONS.map((option) => (
        <li key={option.id} role="option" aria-selected={option.id === preference}>
          <button
            type="button"
            className={`theme-selector-option ${option.id === preference ? 'active' : ''}`}
            onClick={() => {
              setTheme(option.id)
              setOpen(false)
            }}
          >
            <span className="theme-option-icon" aria-hidden="true">{option.icon}</span>
            <span className="theme-option-label">{themeLabels[option.id]}</span>
            {option.id === 'system' ? (
              <span className="theme-option-meta">
                ({resolvedTheme === 'dark' ? themeLabels.dark : themeLabels.light})
              </span>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  ) : null

  return (
    <div className={`theme-selector ${open ? 'open' : ''}${compact ? ' theme-selector--compact' : ''}`} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="theme-selector-trigger"
        onClick={() => {
          setOpen((value) => {
            const next = !value
            if (next) {
              setMenuPosition(getMenuPosition(triggerRef.current))
            }
            return next
          })
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={c.theme.label}
        title={currentLabel}
      >
        <span className="theme-trigger-icon" aria-hidden="true">{triggerIcon}</span>
        {!compact ? <span className="theme-trigger-label">{currentLabel}</span> : null}
        <svg className="theme-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {mounted && menu ? createPortal(menu, document.body) : null}
    </div>
  )
}
