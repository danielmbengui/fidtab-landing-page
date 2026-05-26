export const LOCALES = ['fr', 'en', 'de', 'it', 'pt', 'es', 'nl', 'ru', 'hi', 'zh', 'ja', 'ln', 'ar']
export const defaultLocale = 'fr'

export const RTL_LOCALES = ['ar']

export const LOCALE_FLAGS = {
  fr: '🇫🇷',
  en: '🇬🇧',
  de: '🇩🇪',
  it: '🇮🇹',
  pt: '🇵🇹',
  es: '🇪🇸',
  nl: '🇳🇱',
  ru: '🇷🇺',
  hi: '🇮🇳',
  zh: '🇨🇳',
  ja: '🇯🇵',
  ln: '🇨🇩',
  ar: '🇸🇦',
}

const LANG = {
  fr: 'Français',
  en: 'Anglais',
  de: 'Allemand',
  it: 'Italien',
  pt: 'Portugais',
  es: 'Espagnol',
  nl: 'Néerlandais',
  ru: 'Russe',
  hi: 'Hindi',
  zh: 'Chinois',
  ja: 'Japonais',
  ln: 'Lingala',
  ar: 'Arabe',
}

/** Noms des langues affichés dans la langue UI courante */
export const LOCALE_NAMES = {
  fr: { ...LANG, fr: 'Français' },
  en: { fr: 'French', en: 'English', de: 'German', it: 'Italian', pt: 'Portuguese', es: 'Spanish', nl: 'Dutch', ru: 'Russian', hi: 'Hindi', zh: 'Chinese', ja: 'Japanese', ln: 'Lingala', ar: 'Arabic' },
  de: { fr: 'Französisch', en: 'Englisch', de: 'Deutsch', it: 'Italienisch', pt: 'Portugiesisch', es: 'Spanisch', nl: 'Niederländisch', ru: 'Russisch', hi: 'Hindi', zh: 'Chinesisch', ja: 'Japanisch', ln: 'Lingala', ar: 'Arabisch' },
  it: { fr: 'Francese', en: 'Inglese', de: 'Tedesco', it: 'Italiano', pt: 'Portoghese', es: 'Spagnolo', nl: 'Olandese', ru: 'Russo', hi: 'Hindi', zh: 'Cinese', ja: 'Giapponese', ln: 'Lingala', ar: 'Arabo' },
  pt: { fr: 'Francês', en: 'Inglês', de: 'Alemão', it: 'Italiano', pt: 'Português', es: 'Espanhol', nl: 'Holandês', ru: 'Russo', hi: 'Hindi', zh: 'Chinês', ja: 'Japonês', ln: 'Lingala', ar: 'Árabe' },
  es: { fr: 'Francés', en: 'Inglés', de: 'Alemán', it: 'Italiano', pt: 'Portugués', es: 'Español', nl: 'Neerlandés', ru: 'Ruso', hi: 'Hindi', zh: 'Chino', ja: 'Japonés', ln: 'Lingala', ar: 'Árabe' },
  nl: { fr: 'Frans', en: 'Engels', de: 'Duits', it: 'Italiaans', pt: 'Portugees', es: 'Spaans', nl: 'Nederlands', ru: 'Russisch', hi: 'Hindi', zh: 'Chinees', ja: 'Japans', ln: 'Lingala', ar: 'Arabisch' },
  ru: { fr: 'Французский', en: 'Английский', de: 'Немецкий', it: 'Итальянский', pt: 'Португальский', es: 'Испанский', nl: 'Голландский', ru: 'Русский', hi: 'Хинди', zh: 'Китайский', ja: 'Японский', ln: 'Лингала', ar: 'Арабский' },
  hi: { fr: 'फ़्रेंच', en: 'अंग्रेज़ी', de: 'जर्मन', it: 'इतालवी', pt: 'पुर्तगाली', es: 'स्पैनिश', nl: 'डच', ru: 'रूसी', hi: 'हिंदी', zh: 'चीनी', ja: 'जापानी', ln: 'लिंगाला', ar: 'अरबी' },
  zh: { fr: '法语', en: '英语', de: '德语', it: '意大利语', pt: '葡萄牙语', es: '西班牙语', nl: '荷兰语', ru: '俄语', hi: '印地语', zh: '中文', ja: '日语', ln: '林加拉语', ar: '阿拉伯语' },
  ja: { fr: 'フランス語', en: '英語', de: 'ドイツ語', it: 'イタリア語', pt: 'ポルトガル語', es: 'スペイン語', nl: 'オランダ語', ru: 'ロシア語', hi: 'ヒンディー語', zh: '中国語', ja: '日本語', ln: 'リンガラ語', ar: 'アラビア語' },
  ln: { fr: 'Lifalansiki', en: 'Lingeléshe', de: 'Lialemá', it: 'Liitaliano', pt: 'Liputugalé', es: 'Lispanyoli', nl: 'Liholanda', ru: 'Lirisi', hi: 'Lihindi', zh: 'Lichinois', ja: 'Lijaponé', ln: 'Lingala', ar: 'Liarabe' },
  ar: { fr: 'الفرنسية', en: 'الإنجليزية', de: 'الألمانية', it: 'الإيطالية', pt: 'البرتغالية', es: 'الإسبانية', nl: 'الهولندية', ru: 'الروسية', hi: 'الهندية', zh: 'الصينية', ja: 'اليابانية', ln: 'Lingala', ar: 'العربية' },
}

export const INTL_LOCALE_MAP = {
  fr: 'fr-FR',
  en: 'en-GB',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-PT',
  es: 'es-ES',
  nl: 'nl-NL',
  ru: 'ru-RU',
  hi: 'hi-IN',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ln: 'ln-CD',
  ar: 'ar-SA',
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
