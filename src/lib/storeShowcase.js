import { getCountFromServer, getDocs, query, where } from 'firebase/firestore'
import { ClassCompany } from '@/classes/ClassCompany'
import { ClassShop } from '@/classes/ClassShop'
import { ClassStock } from '@/classes/ClassStock'
import { ClassUser } from '@/classes/ClassUser'
import { defaultLocale } from '@/i18n/locales'
import { ClassCountry } from '@/classes/ClassCountry'

const STORE_CLS = ['sc-vaakai', 'sc-amber', 'sc-blue']

/**
 * Couvertures partenaires — boutiques et commerces uniquement.
 * IDs Unsplash exclusifs : ne pas réutiliser ceux de `src/config/visuals.js`.
 */
const PARTNER_TABAC_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1757839158791-ff236648c9cb?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1769699077605-d07a1bdcc6a5?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1762424361539-b8a78fe25e79?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1754831217433-194c3846e9cb?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1746723386880-ca68b5f4b22d?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80&auto=format&fit=crop',
]

function hashString(value) {
  let hash = 0
  const text = String(value ?? '')
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function getShopCoverImage(shopKey) {
  const index = hashString(shopKey) % PARTNER_TABAC_COVER_IMAGES.length
  return PARTNER_TABAC_COVER_IMAGES[index]
}

export function formatStoreStat(value) {
  const n = Number(value) || 0
  if (n >= 1_000_000) {
    const m = n / 1_000_000
    return m >= 10 ? `${Math.round(m)}M` : `${m.toFixed(1).replace(/\.0$/, '')}M`
  }
  if (n >= 1000) {
    const k = n / 1000
    return k >= 10 ? `${Math.round(k)}k` : `${k.toFixed(1).replace(/\.0$/, '')}k`
  }
  return String(n)
}

/** Normalise une instance ClassShop ou un objet brut via ClassShop.toJSON. */
export function normalizeShopRecord(shop) {
  if (!shop) return null

  try {
    if (shop instanceof ClassShop) {
      return ClassShop.toJSON(shop)
    }

    if (typeof shop === 'object') {
      return ClassShop.toJSON(
        ClassShop.makeInstance(shop.uid ?? shop.id ?? '', shop),
      )
    }
  } catch (error) {
    console.error('normalizeShopRecord', error)
  }

  return null
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

export function formatShopAddress(shop, locale = defaultLocale) {
  try {
    const countryName = ClassCountry.getCountryByCode(shop.address.country_code, locale)?.name ?? '';
    return ClassShop._createFullAddress(shop, countryName)
  } catch (error) {
    console.error('formatShopAddress', error)
    return ''
  }
}

export function getCompanyWebsite(company) {
  return String(
    company?.contact?.socials?.website_url ??
      company?.socials?.website_url ??
      '',
  ).trim()
}

export function getShopWebsite(shop, company) {
  const fromShop = String(shop?.contact?.socials?.website_url ?? '').trim()
  if (fromShop) return fromShop
  return getCompanyWebsite(company)
}

export async function countCustomersForCompany(uidCompany) {
  const normalizedCompany = String(uidCompany ?? '').trim()
  if (!normalizedCompany) return 0

  try {
    const snap = await getCountFromServer(
      query(
        ClassUser.colRef(),
        where('uids_companies_loyalties', 'array-contains', normalizedCompany),
      ),
    )
    return snap.data().count
  } catch (error) {
    console.error('countCustomersForCompany', error)
    return 0
  }
}

export async function countStocksForCompany(uidCompany) {
  const normalizedCompany = String(uidCompany ?? '').trim()
  if (!normalizedCompany) return 0

  try {
    const snap = await getCountFromServer(
      query(
        ClassStock.colGroupRef(),
        where('uid_company', '==', normalizedCompany),
      ),
    )
    return snap.data().count
  } catch (error) {
    console.error('countStocksForCompany', error)

    try {
      const stocks = await ClassStock.listFirestoreForCompany(normalizedCompany)
      return stocks.length
    } catch (fallbackError) {
      console.error('countStocksForCompany fallback', fallbackError)
      return 0
    }
  }
}

export async function sumLoyaltyPointsForCompany(uidCompany) {
  const normalizedCompany = String(uidCompany ?? '').trim()
  if (!normalizedCompany) return 0

  try {
    const snap = await getDocs(
      query(
        ClassUser.colRef(),
        where('uids_companies_loyalties', 'array-contains', normalizedCompany),
      ),
    )

    let total = 0
    for (const docSnap of snap.docs) {
      const data = docSnap.data()
      const loyalties = Array.isArray(data?.loyalties) ? data.loyalties : []

      for (const loyalty of loyalties) {
        const companyUid = String(loyalty?.uid_company ?? '').trim()
        if (companyUid !== normalizedCompany) continue
        total += Number(loyalty?.loyalty_points ?? 0) || 0
      }
    }

    return total
  } catch (error) {
    console.error('sumLoyaltyPointsForCompany', error)
    return 0
  }
}

export async function fetchStatsForShops(shops = []) {
  const companyUids = [
    ...new Set(
      shops.map((shop) => String(shop.uid_company ?? '').trim()).filter(Boolean),
    ),
  ]

  const statsByCompany = {}
  await Promise.all(
    companyUids.map(async (uidCompany) => {
      const [clients, products, loyaltyPoints] = await Promise.all([
        countCustomersForCompany(uidCompany),
        countStocksForCompany(uidCompany),
        sumLoyaltyPointsForCompany(uidCompany),
      ])

      statsByCompany[uidCompany] = {
        clients,
        products,
        loyaltyPoints,
      }
    }),
  )

  const statsByShopKey = {}
  for (const shop of shops) {
    const uidCompany = String(shop.uid_company ?? '').trim()
    const uidShop = String(shop.uid ?? '').trim()
    if (!uidCompany || !uidShop) continue

    statsByShopKey[`${uidCompany}:${uidShop}`] = statsByCompany[uidCompany] ?? {
      clients: 0,
      products: 0,
      loyaltyPoints: 0,
    }
  }

  return statsByShopKey
}

export function shopToStoreCard(shop, company, index = 0, stats = {}, locale = defaultLocale) {
  const record = normalizeShopRecord(shop)
  if (!record) return null

  const uidCompany = String(record.uid_company ?? company?.uid ?? '').trim()
  const shopKey = `${uidCompany}:${record.uid}`
  const name = String(record.name ?? '').trim()
  if (!name) return null

  const companyRecord = company ? normalizeCompanyRecord(company) : null
  const website = getShopWebsite(record, companyRecord)
  const logoUrl = String(companyRecord?.logo_url ?? '').trim()

  return {
    key: shopKey,
    source: 'firestore',
    cls: STORE_CLS[index % STORE_CLS.length],
    logoUrl: logoUrl || undefined,
    companyName: String(companyRecord?.name ?? '').trim(),
    name,
    tag: String(record.tag ?? companyRecord?.tag ?? '').trim(),
    addr: formatShopAddress(shop, locale),
    openingHours: shop.opening_hours ?? null,
    url: website,
    online: Boolean(website),
    cover_image: shop.cover_image,
    showStats: true,
    clients: formatStoreStat(stats.clients ?? 0),
    loyaltyPoints: formatStoreStat(stats.loyaltyPoints ?? 0),
    products: formatStoreStat(stats.products ?? 0),
  }
}

export function buildStoreShowcaseFromShops(
  shops = [],
  companyMap = new Map(),
  statsByShopKey = {},
  locale = defaultLocale,
) {
  return shops
    .map((shop, index) => {
      const uidCompany = String(shop.uid_company ?? '').trim()
      const company = companyMap.get(uidCompany)
      const key = `${uidCompany}:${shop.uid}`
      return shopToStoreCard(shop, company, index, statsByShopKey[key] ?? {}, locale)
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }))
}
