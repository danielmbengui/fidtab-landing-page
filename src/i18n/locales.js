export const LOCALES = ['fr', 'en', 'de', 'it']
export const defaultLocale = 'fr'

export const RTL_LOCALES = []

export const LOCALE_FLAGS = {
  fr: '🇫🇷',
  en: '🇬🇧',
  de: '🇩🇪',
  it: '🇮🇹',
}

const LANG = {
  fr: 'Français',
  en: 'Anglais',
  de: 'Allemand',
  it: 'Italien',
}

/** Noms des langues affichés dans la langue UI courante */
export const LOCALE_NAMES = {
  fr: { ...LANG, fr: 'Français' },
  en: { fr: 'French', en: 'English', de: 'German', it: 'Italian' },
  de: { fr: 'Französisch', en: 'Englisch', de: 'Deutsch', it: 'Italienisch' },
  it: { fr: 'Francese', en: 'Inglese', de: 'Tedesco', it: 'Italiano' },
}

export const INTL_LOCALE_MAP = {
  fr: 'fr-FR',
  en: 'en-GB',
  de: 'de-DE',
  it: 'it-IT',
}

export function isRtlLocale(locale) {
  return RTL_LOCALES.includes(locale)
}

export function appLocaleToIntlLocale(locale) {
  return INTL_LOCALE_MAP[locale] ?? INTL_LOCALE_MAP.fr
}

export function getLocaleLabel(uiLocale, targetLocale) {
  return LOCALE_NAMES[uiLocale]?.[targetLocale] ?? LOCALE_NAMES.fr[targetLocale]
}

/** Locales triées par nom affiché dans la langue UI courante */
export function getSortedLocales(uiLocale) {
  const collator = appLocaleToIntlLocale(uiLocale)
  return [...LOCALES].sort((a, b) =>
    getLocaleLabel(uiLocale, a).localeCompare(
      getLocaleLabel(uiLocale, b),
      collator,
      { sensitivity: 'base' },
    ),
  )
}
