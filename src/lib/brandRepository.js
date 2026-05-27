import { ClassBrand } from '@/classes/ClassBrand'
import { ClassCompany, ClassCompanyBrand } from '@/classes/ClassCompany'

/** Compagnie effective pour lire/écrire une marque dans l’admin. */
export function resolveBrandWriteCompany(sessionCompany, brandCompany) {
  const session = String(sessionCompany ?? '').trim()
  const brand = String(brandCompany ?? '').trim()

  if (session && session !== 'system') return session
  if (brand && brand !== 'system') return brand
  return ClassCompany.DEFAULT_UID
}

export function resolveBrandCompany(uidCompany) {
  return resolveBrandWriteCompany(uidCompany, '')
}

export function isCompanyScopedBrand(writeCompany) {
  const company = String(writeCompany ?? '').trim()
  return Boolean(company)
}

export function getBrandColRef(writeCompany) {
  return ClassCompanyBrand.colRef(resolveBrandWriteCompany(writeCompany, ''))
}

export function getBrandDocRef(writeCompany, brandId) {
  const company = resolveBrandWriteCompany(writeCompany, '')
  return ClassCompanyBrand.docRef(company, brandId)
}

export async function getBrandFromFirestore(sessionCompany, brandId, brandCompany = '') {
  const writeCompany = resolveBrandWriteCompany(sessionCompany, brandCompany)

  const companyBrand = await ClassCompanyBrand.getFirestoreForCompany(writeCompany, brandId)
  if (companyBrand) return companyBrand

  return ClassBrand.getFirestore(brandId)
}

export function buildBrandStoragePath(uid, writeCompany = ClassCompany.DEFAULT_UID) {
  const id = String(uid ?? '').trim()
  if (!id) return ''

  const company = resolveBrandWriteCompany(writeCompany, '')
  return `${ClassCompany.STORAGE_FOLDER}/${company}/${ClassCompanyBrand.STORAGE_FOLDER}/${id}/brand.jpg`
}

function toBrandPayload(brand) {
  if (brand instanceof ClassCompanyBrand) {
    return ClassCompanyBrand.toJSON(brand)
  }
  return ClassBrand.toJSON(brand)
}

export function makeBrandInstance(uid, data = {}, sessionCompany = 'system', brandCompany = '') {
  const writeCompany = resolveBrandWriteCompany(sessionCompany, brandCompany || data.uid_company)
  return ClassCompanyBrand.makeInstance(uid, {
    ...data,
    uid,
    uid_company: writeCompany,
    storage_url: data.storage_url || buildBrandStoragePath(uid, writeCompany),
  })
}

export async function createBrandInstance(brand, sessionCompany = 'system', brandCompany = '') {
  if (!brand) return null

  const writeCompany = resolveBrandWriteCompany(sessionCompany, brandCompany || brand.uid_company)
  const companyBrand = brand instanceof ClassCompanyBrand
    ? brand
    : ClassCompanyBrand.makeInstance(brand.uid, {
        ...toBrandPayload(brand),
        uid_company: writeCompany,
      })

  companyBrand.uid_company = writeCompany
  return companyBrand.createFirestore()
}

export async function updateBrandInstance(brand, sessionCompany = 'system', brandCompany = '') {
  if (!brand) return null

  const writeCompany = resolveBrandWriteCompany(sessionCompany, brandCompany || brand.uid_company)
  const companyBrand = brand instanceof ClassCompanyBrand
    ? brand
    : ClassCompanyBrand.makeInstance(brand.uid, {
        ...toBrandPayload(brand),
        uid_company: writeCompany,
      })

  companyBrand.uid_company = writeCompany

  const exists = await ClassCompanyBrand.getFirestoreForCompany(writeCompany, companyBrand.uid)
  if (exists) {
    return companyBrand.updateFirestore()
  }

  return companyBrand.createFirestore()
}
