import { ClassOpeningHours } from '@/classes/ClassOpeningHours'
import { appLocaleToIntlLocale } from '@/i18n/locales'

const WEEKDAY_ORDER = Object.freeze([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
])

const WEEKDAY_FROM_EN = Object.freeze({
  Sunday: 'sunday',
  Monday: 'monday',
  Tuesday: 'tuesday',
  Wednesday: 'wednesday',
  Thursday: 'thursday',
  Friday: 'friday',
  Saturday: 'saturday',
})

function getZurichWeekdayKey(date = new Date()) {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Zurich',
    weekday: 'long',
  }).format(date)

  return WEEKDAY_FROM_EN[weekday] ?? 'monday'
}

function getZurichTimeDecimal(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Zurich',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(date)

  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0)
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0)

  return hour + minute / 60
}

function getZurichDateParts(date = new Date()) {
  const [year, month, day] = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Zurich',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .split('-')
    .map(Number)

  return { year, month, day }
}

function getDayItem(openingHours, weekday) {
  return ClassOpeningHours.getDayItem(openingHours, weekday) ?? openingHours?.[weekday] ?? null
}

export function formatOpeningTime(value, locale = 'fr') {
  if (value === null || value === undefined || value === '') return ''

  const totalMinutes = Math.round(Number(value) * 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const date = new Date(2000, 0, 1, hours, minutes)

  return date.toLocaleTimeString(appLocaleToIntlLocale(locale), {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * @returns {{ minutesUntilOpen: number, openTimeFormatted: string, dayOffset: number, weekdayKey: string } | null}
 */
export function getNextOpeningSlot(openingHours, locale = 'fr', now = new Date()) {
  if (!openingHours || typeof openingHours !== 'object') return null

  const currentDecimal = getZurichTimeDecimal(now)
  const startWeekday = getZurichWeekdayKey(now)
  const startIndex = WEEKDAY_ORDER.indexOf(startWeekday)
  if (startIndex < 0) return null

  for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
    const weekdayKey = WEEKDAY_ORDER[(startIndex + dayOffset) % 7]
    const dayItem = getDayItem(openingHours, weekdayKey)
    if (!dayItem?.is_open) continue

    const openRaw = Number(dayItem.open_time ?? dayItem.openTime)
    if (!Number.isFinite(openRaw)) continue

    if (dayOffset === 0) {
      const closeRaw = Number(dayItem.close_time ?? dayItem.closeTime)
      if (Number.isFinite(closeRaw) && currentDecimal >= openRaw && currentDecimal < closeRaw) {
        return null
      }
      if (currentDecimal < openRaw) {
        return {
          minutesUntilOpen: Math.round((openRaw - currentDecimal) * 60),
          openTimeFormatted: formatOpeningTime(openRaw, locale),
          dayOffset: 0,
          weekdayKey,
        }
      }
      continue
    }

    const minutesUntilOpen = Math.round(
      (24 - currentDecimal) * 60 + (dayOffset - 1) * 24 * 60 + openRaw * 60,
    )

    return {
      minutesUntilOpen,
      openTimeFormatted: formatOpeningTime(openRaw, locale),
      dayOffset,
      weekdayKey,
    }
  }

  return null
}

function formatWeekdayName(dayOffset, locale, now = new Date()) {
  const { year, month, day } = getZurichDateParts(now)
  const target = new Date(Date.UTC(year, month - 1, day + dayOffset, 12, 0, 0))

  return target.toLocaleDateString(appLocaleToIntlLocale(locale), {
    weekday: 'long',
    timeZone: 'Europe/Zurich',
  })
}

function interpolate(template, vars = {}) {
  return String(template ?? '').replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''))
}

/**
 * Libellé « ouvre dans … » affiché quand le magasin est fermé.
 */
export function formatShopOpensInLabel(openingHours, locale, labels, now = new Date()) {
  const today = getShopOpeningHoursToday(openingHours, locale, now)
  if (!today || today.isOpenNow) return null

  const next = getNextOpeningSlot(openingHours, locale, now)
  if (!next || next.minutesUntilOpen <= 0) return null

  if (next.minutesUntilOpen < 60) {
    return labels.opensInLessThanHour
  }

  if (next.dayOffset === 0) {
    const hours = Math.ceil(next.minutesUntilOpen / 60)
    return interpolate(labels.opensInHours, { hours })
  }

  if (next.dayOffset === 1) {
    return interpolate(labels.opensTomorrowAt, { time: next.openTimeFormatted })
  }

  const day = formatWeekdayName(next.dayOffset, locale, now)
  return interpolate(labels.opensOnDayAt, { day, time: next.openTimeFormatted })
}

/**
 * Horaires du jour (fuseau Europe/Zurich) pour affichage landing.
 */
export function getShopOpeningHoursToday(openingHours, locale = 'fr', now = new Date()) {
  if (!openingHours || typeof openingHours !== 'object') return null

  const weekday = getZurichWeekdayKey(now)
  const dayItem = getDayItem(openingHours, weekday)

  if (!dayItem || !dayItem.is_open) {
    return {
      isOpenNow: false,
      isOpenToday: false,
      openTime: '',
      closeTime: '',
      weekday,
    }
  }

  const openRaw = dayItem.open_time ?? dayItem.openTime
  const closeRaw = dayItem.close_time ?? dayItem.closeTime
  const openTime = formatOpeningTime(openRaw, locale)
  const closeTime = formatOpeningTime(closeRaw, locale)
  const current = getZurichTimeDecimal(now)
  const isOpenNow =
    openRaw != null &&
    closeRaw != null &&
    current >= Number(openRaw) &&
    current < Number(closeRaw)

  return {
    isOpenNow,
    isOpenToday: true,
    openTime,
    closeTime,
    weekday,
  }
}

export { WEEKDAY_ORDER as WEEKDAY_KEYS }
