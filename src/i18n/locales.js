export const LOCALES = ['fr', 'en', 'de', 'it']

export const LOCALE_FLAGS = {
  fr: '🇫🇷',
  en: '🇬🇧',
  de: '🇩🇪',
  it: '🇮🇹',
}

/** Noms des langues affichés dans la langue UI courante */
export const LOCALE_NAMES = {
  fr: { fr: 'Français', en: 'Anglais', de: 'Allemand', it: 'Italien' },
  en: { fr: 'French', en: 'English', de: 'German', it: 'Italian' },
  de: { fr: 'Französisch', en: 'Englisch', de: 'Deutsch', it: 'Italienisch' },
  it: { fr: 'Francese', en: 'Inglese', de: 'Tedesco', it: 'Italiano' },
}

export function getLocaleLabel(uiLocale, targetLocale) {
  return LOCALE_NAMES[uiLocale]?.[targetLocale] ?? LOCALE_NAMES.fr[targetLocale]
}
