export const WEBSITE_NAME = 'FidTab'

export function getBrandLogoParts(name = WEBSITE_NAME) {
  const match = name.match(/^(.+?)([A-Z][a-zA-Z]*)$/)
  if (match) return { primary: match[1], accent: match[2] }
  const mid = Math.ceil(name.length / 2)
  return { primary: name.slice(0, mid), accent: name.slice(mid) }
}
