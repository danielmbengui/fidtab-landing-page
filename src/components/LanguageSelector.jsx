'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '@/context/LanguageProvider'

function getMenuPosition(triggerEl) {
  if (!triggerEl) return null
  const rect = triggerEl.getBoundingClientRect()
  const top = rect.bottom + 8
  const maxHeight = Math.min(360, window.innerHeight - top - 12)

  return {
    top,
    minWidth: Math.max(rect.width, 220),
    maxHeight: Math.max(160, maxHeight),
    right: Math.max(8, window.innerWidth - rect.right),
    left: 'auto',
  }
}

export default function LanguageSelector() {
  const { locale, setLocale, locales, localeFlags, getLocaleLabel } = useLanguage()
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

  const menu = open && menuPosition ? (
    <ul
      ref={menuRef}
      className="lang-selector-menu lang-selector-menu--fixed"
      dir="ltr"
      role="listbox"
      aria-label="Language"
      style={{
        top: menuPosition.top,
        right: menuPosition.right,
        left: menuPosition.left,
        minWidth: menuPosition.minWidth,
        maxHeight: menuPosition.maxHeight,
      }}
    >
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
  ) : null

  return (
    <div className={`lang-selector ${open ? 'open' : ''}`} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="lang-selector-trigger"
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
        aria-label="Language"
      >
        <span className="lang-flag" aria-hidden="true">{localeFlags[locale]}</span>
        <span className="lang-name">{getLocaleLabel(locale)}</span>
        <svg className="lang-chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {mounted && menu ? createPortal(menu, document.body) : null}
    </div>
  )
}
