/**
 * Positionne un menu flottant (portal) sous un trigger en restant dans le viewport.
 */
export function getFloatingMenuPosition(triggerEl, options = {}) {
  const padding = options.padding ?? 12
  const menuMinWidth = options.minWidth ?? 220
  const maxHeightLimit = options.maxHeight ?? 280

  if (!triggerEl || typeof window === 'undefined') return null

  const rect = triggerEl.getBoundingClientRect()
  const top = rect.bottom + 8
  const menuWidth = Math.max(rect.width, menuMinWidth)
  const maxHeight = Math.min(maxHeightLimit, window.innerHeight - top - padding)

  let left = rect.left

  if (left + menuWidth > window.innerWidth - padding) {
    left = window.innerWidth - padding - menuWidth
  }
  if (left < padding) {
    left = padding
  }

  return {
    top,
    left,
    right: 'auto',
    minWidth: menuWidth,
    maxWidth: window.innerWidth - padding * 2,
    maxHeight: Math.max(120, maxHeight),
  }
}
