import { ClassOpeningHours } from '@/classes/ClassOpeningHours'
import { appLocaleToIntlLocale } from '@/i18n/locales'

const WEEKDAY_KEYS = Object.freeze([
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
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
 * Horaires du jour (fuseau Europe/Zurich) pour affichage landing.
 * @returns {{ isOpenNow: boolean, isOpenToday: boolean, openTime: string, closeTime: string } | null}
 */
export function getShopOpeningHoursToday(openingHours, locale = 'fr', now = new Date()) {
  if (!openingHours || typeof openingHours !== 'object') return null

  const weekday = getZurichWeekdayKey(now)
  const dayItem =
    ClassOpeningHours.getDayItem(openingHours, weekday) ?? openingHours[weekday] ?? null

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

export { WEEKDAY_KEYS }
