import { ClassBrand } from '@/classes/ClassBrand'
import {
  buildBrandStoragePath,
  makeBrandInstance,
  resolveBrandWriteCompany,
} from '@/lib/brandRepository'

export function getBrandCategoryOptions() {
  return Object.values(ClassBrand.CATEGORY).filter((value) => typeof value === 'string')
}

export { buildBrandStoragePath }

export function getDefaultBrandFormValues(uid = '', sessionCompany = 'system', brandCompany = '') {
  const writeCompany = resolveBrandWriteCompany(sessionCompany, brandCompany)
  return {
    name: '',
    uid_fidtab_brand: '',
    storage_url: buildBrandStoragePath(uid, writeCompany),
    photo_url: '',
    categories: [],
  }
}

export function brandToFormValues(brand, sessionCompany = 'system', brandCompany = '') {
  if (!brand) return getDefaultBrandFormValues('', sessionCompany, brandCompany)
  const uid = brand.uid ?? ''
  const writeCompany = resolveBrandWriteCompany(sessionCompany, brandCompany || brand.uid_company)
  return {
    name: brand.name ?? '',
    uid_fidtab_brand: brand.uid_fidtab_brand ?? '',
    storage_url: buildBrandStoragePath(uid, writeCompany),
    photo_url: brand.photo_url ?? '',
    categories: Array.isArray(brand.categories) ? [...brand.categories] : [],
  }
}

function normalizeBrandFormValues(values = {}) {
  return {
    name: String(values.name ?? '').trim(),
    uid_fidtab_brand: String(values.uid_fidtab_brand ?? '').trim(),
    storage_url: String(values.storage_url ?? '').trim(),
    photo_url: String(values.photo_url ?? '').trim(),
    categories: [...(values.categories ?? [])].sort(),
  }
}

export function hasBrandFormChanges(current, baseline) {
  if (!baseline) return false
  return JSON.stringify(normalizeBrandFormValues(current))
    !== JSON.stringify(normalizeBrandFormValues(baseline))
}

export function formValuesToBrand(form, { uid = '', uidCompany = 'system', brandUidCompany = '' } = {}) {
  return makeBrandInstance(uid, {
    name: String(form.name ?? '').trim(),
    uid_fidtab_brand: String(form.uid_fidtab_brand ?? '').trim(),
    storage_url: String(form.storage_url ?? '').trim() || buildBrandStoragePath(uid, resolveBrandWriteCompany(uidCompany, brandUidCompany)),
    photo_url: String(form.photo_url ?? '').trim(),
    categories: Array.isArray(form.categories) ? form.categories : [],
    last_edit_time: new Date(),
  }, uidCompany, brandUidCompany)
}

export function formatBrandCategories(categories, labels, empty = '—') {
  if (!Array.isArray(categories) || categories.length === 0) return empty
  return categories
    .map((value) => labels[value] ?? value)
    .join(', ')
}
