export const THEME_STORAGE_KEY = 'fidtab-theme'
export const THEME_PREFERENCES = ['system', 'light', 'dark']

export function getSystemTheme() {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function resolveTheme(preference) {
  if (preference === 'system') return getSystemTheme()
  return preference === 'light' ? 'light' : 'dark'
}

export function applyTheme(preference) {
  const resolved = resolveTheme(preference)
  document.documentElement.setAttribute('data-theme', resolved)
  document.documentElement.setAttribute('data-theme-preference', preference)
}

export function getStoredThemePreference() {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  return THEME_PREFERENCES.includes(stored) ? stored : 'system'
}

/** Script inline pour appliquer le thème avant le premier rendu (évite le flash). */
export const themeInitScript = `(function(){try{var k='${THEME_STORAGE_KEY}';var p=localStorage.getItem(k)||'system';var r=p;if(p==='system'){r=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',r);document.documentElement.setAttribute('data-theme-preference',p);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`
