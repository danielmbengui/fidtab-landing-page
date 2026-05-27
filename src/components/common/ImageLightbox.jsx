'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function ImageLightbox({ src, alt = '', closeLabel = 'Close', onClose }) {
  useEffect(() => {
    if (!src) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [src, onClose])

  if (!src || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
    >
      <button
        type="button"
        className="image-lightbox-close"
        onClick={onClose}
        aria-label={closeLabel}
      >
        ×
      </button>
      <img
        src={src}
        alt={alt}
        className="image-lightbox-img"
        onClick={(event) => event.stopPropagation()}
      />
    </div>,
    document.body,
  )
}
