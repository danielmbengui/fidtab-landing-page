export const COMPANY_NAME = 'FidTab'
export const WEBSITE_NAME = 'FidTab'
/** @deprecated Utiliser COMPANY_NAME */
export const COMPNY_NAME = COMPANY_NAME
export const COMPANY_URL = 'https://www.company.fidtab.ch/'
export const DOWNLOAD_APP_PATH = '/download'
/** @deprecated Utiliser DOWNLOAD_APP_PATH */
export const REQUEST_DEMO_PATH = DOWNLOAD_APP_PATH
export const APP_STORE_URL = 'https://apps.apple.com/app/fidtab'
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.fidtab.app'
export const PWA_URL = 'https://app.fidtab.ch/get-pwa';
export const LEGAL_NOTICE_PATH = '/legal-notice'
export const TERMS_PATH = '/terms'
export const PRIVACY_PATH = '/privacy'
export const CONTACT_PATH = '/contact'
export const CONTACT_EMAIL = 'contact@fidtab.com'
export const CONTACT_WHATSAPP = '+33123456789'
export const START_DATE_WEBSITE = new Date(2026, 4, 26)
export const YEAR_WEBSITE = START_DATE_WEBSITE.getFullYear()
export const BRAND_LOGO = {
  /** Icône sans fond — à utiliser sur le site */
  only: '/logo-solo.png',
  solo: '/logo-solo.png',
  full: '/logo.png',
}

export function getBrandLogoParts(name = WEBSITE_NAME) {
  const match = name.match(/^(.+?)([A-Z][a-zA-Z]*)$/)
  if (match) return { primary: match[1], accent: match[2] }
  const mid = Math.ceil(name.length / 2)
  return { primary: name.slice(0, mid), accent: name.slice(mid) }
}

/** Ex. 2026 ou 2026-2027 si l'année courante diffère de l'année de création */
export function getCopyrightYearLabel(now = new Date()) {
  const currentYear = now.getFullYear()
  if (currentYear === YEAR_WEBSITE) return String(YEAR_WEBSITE)
  return `${YEAR_WEBSITE}-${currentYear}`
}
