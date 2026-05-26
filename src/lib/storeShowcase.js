import { ClassCompany } from '@/classes/ClassCompany'
import { VAAKAI_STORE_PARTNER } from '@/config/partnerData'

const GENEVA_CITY_CODES = new Set(['GE'])
const GENEVA_CITY_NAMES = ['genève', 'geneve', 'geneva', 'meyrin', 'carouge', 'vernier', 'lancy']

const STORE_CLS = ['sc-vaakai', 'sc-amber', 'sc-blue']

/** Couvertures des données test — libres, sans contrainte éditoriale. */
export const STORE_COVER_IMAGES = {
  vaakai:
    'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=600&q=80&auto=format&fit=crop',
  tabacRhein:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80&auto=format&fit=crop',
  swissTabac:
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80&auto=format&fit=crop',
}

/**
 * Couvertures partenaires Firestore (ClassCompany) — boutiques et commerces uniquement.
 * Sans alcool, cigarettes, cigares, vape ni jeux d'argent visibles.
 * IDs Unsplash exclusifs : ne pas réutiliser ceux de `src/config/visuals.js` ni `STORE_COVER_IMAGES`.
 */
const PARTNER_TABAC_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1757839158791-ff236648c9cb?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1769699077605-d07a1bdcc6a5?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1762424361539-b8a78fe25e79?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1754831217433-194c3846e9cb?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1746723386880-ca68b5f4b22d?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=600&q=80&auto=format&fit=crop',
]

function getPartnerTabacCoverImage(index = 0) {
  return PARTNER_TABAC_COVER_IMAGES[index % PARTNER_TABAC_COVER_IMAGES.length]
}

/** Exemples genevois — stats et libellés fictifs */
export const GENEVA_FALLBACK_STORES = [
  {
    key: 'fallback-tabac-rhein',
    source: 'fallback',
    cls: 'sc-amber',
    name: 'Tabac Rhein',
    tag: 'Cigares · Genève centre',
    addr: 'Rue du Mont-Blanc 3, 1201 Genève',
    coverImage: STORE_COVER_IMAGES.tabacRhein,
    showStats: true,
    clients: '520',
    orders: '1.1k',
  },
  {
    key: 'fallback-swiss-tabac',
    source: 'fallback',
    cls: 'sc-blue',
    name: 'Swiss Tabac',
    tag: 'Tabac · Épicerie',
    addr: 'Rue de Berne 46, 1201 Genève',
    coverImage: STORE_COVER_IMAGES.swissTabac,
    showStats: true,
    clients: '430',
    orders: '960',
  },
]

function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

/** Donnée partenaire connue (snapshot Firestore) — toujours disponible hors ligne. */
export function getSeedPartnerCompanies() {
  return [
    {
      uid: VAAKAI_STORE_PARTNER.uid,
      name: VAAKAI_STORE_PARTNER.name,
      tag: VAAKAI_STORE_PARTNER.tag,
      logo_url: VAAKAI_STORE_PARTNER.logoUrl,
      address: {
        street: 'Chemin Terroux 5C',
        zip_code: '1216',
        city_name: 'Genève',
        city_code: 'GE',
        province: 'Meyrin',
        country_code: 'CH',
        full_address: VAAKAI_STORE_PARTNER.address,
      },
      contact: {
        socials: {
          website_url: VAAKAI_STORE_PARTNER.websiteUrl,
        },
      },
    },
  ]
}

/** Normalise une instance ClassCompany ou un objet brut via ClassCompany.toJSON. */
export function normalizeCompanyRecord(company) {
  if (!company) return null

  try {
    if (company instanceof ClassCompany) {
      return ClassCompany.toJSON(company)
    }

    if (typeof company === 'object') {
      return ClassCompany.toJSON(
        ClassCompany.makeInstance(company.uid ?? company.id ?? '', company),
      )
    }
  } catch (error) {
    console.error('normalizeCompanyRecord', error)
  }

  return null
}

export function isGenevaCompany(company) {
  const address = company?.address ?? {}
  const city = normalizeText(address.city_name)
  const province = normalizeText(address.province)
  const district = normalizeText(address.district)
  const zip = String(address.zip_code ?? '').trim()
  const code = String(address.city_code ?? '').toUpperCase()

  if (GENEVA_CITY_CODES.has(code)) return true
  if (zip.startsWith('12')) return true

  return GENEVA_CITY_NAMES.some(
    (name) => city.includes(name) || province.includes(name) || district.includes(name),
  )
}

export function formatCompanyAddress(company) {
  const address = company?.address ?? {}
  if (address.full_address) return address.full_address

  const locality = [address.zip_code, address.city_name].filter(Boolean).join(' ')
  const parts = [address.street, locality].filter(Boolean)

  if (address.country_code === 'CH') {
    parts.push('Suisse')
  } else if (address.country_code) {
    parts.push(address.country_code)
  }

  return parts.join(', ')
}

export function getCompanyWebsite(company) {
  return String(company?.contact?.socials?.website_url ?? '').trim()
}

export function companyToStoreCard(company, index = 0) {
  const record = normalizeCompanyRecord(company)
  if (!record) return null

  const website = getCompanyWebsite(record)
  const logoUrl = String(record.logo_url ?? '').trim()
  const name = String(record.name ?? '').trim()

  return {
    key: record.uid || `company-${name}`,
    source: 'firestore',
    cls: STORE_CLS[index % STORE_CLS.length],
    logoUrl: logoUrl || undefined,
    name,
    tag: String(record.tag ?? '').trim(),
    addr: formatCompanyAddress(record),
    url: website,
    online: Boolean(website),
    coverImage: getPartnerTabacCoverImage(index),
    showStats: false,
  }
}

function mergeCompanyRecords(liveCompanies = []) {
  const byUid = new Map()

  for (const seed of getSeedPartnerCompanies()) {
    byUid.set(seed.uid, seed)
  }

  for (const company of liveCompanies) {
    const record = normalizeCompanyRecord(company)
    if (!record?.uid) continue
    byUid.set(record.uid, record)
  }

  return [...byUid.values()]
}

export function buildStoreShowcase(companies = [], max = 3) {
  const merged = mergeCompanyRecords(companies)
  const genevaCompanies = merged.filter(isGenevaCompany)
  const fromFirestore = genevaCompanies
    .map((company, index) => companyToStoreCard(company, index))
    .filter(Boolean)

  const usedNames = new Set(
    fromFirestore.map((store) => normalizeText(store.name)).filter(Boolean),
  )

  const fallbacks = GENEVA_FALLBACK_STORES.filter(
    (store) => !usedNames.has(normalizeText(store.name)),
  )

  return [...fromFirestore, ...fallbacks].slice(0, max)
}
