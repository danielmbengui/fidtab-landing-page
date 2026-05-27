import { getDocs, limit, query, where } from 'firebase/firestore'
import { ClassProduct } from '@/classes/ClassProduct'

export async function findProductByBarCode(barCode, uidCompany) {
  const normalized = String(barCode ?? '').trim()
  if (!normalized) return null

  const constraints = [where('bar_code_number', '==', normalized), limit(1)]
  const company = String(uidCompany ?? '').trim()
  if (company && company !== 'system') {
    constraints.unshift(where('uid_company', '==', company))
  }

  try {
    const snapshot = await getDocs(query(ClassProduct.colRef(), ...constraints))
    if (snapshot.empty) return null
    return snapshot.docs[0].data()
  } catch (error) {
    console.error('findProductByBarCode', error)
    return null
  }
}

export function getProductEnumOptions(enumObject) {
  return Object.values(enumObject).filter((value) => typeof value === 'string')
}

export function getDefaultProductFormValues() {
  return {
    name: '',
    short_description: '',
    description: '',
    price: '',
    old_price: '',
    buy_price: '',
    stock: '',
    quantity: '',
    unit: ClassProduct.UNIT.PIECE,
    category: ClassProduct.CATEGORY.UNKNOWN,
    sub_category: ClassProduct.SUB_CATEGORY.UNKNOWN.value,
    type: ClassProduct.TYPE.UNKNOWN.value,
    status: ClassProduct.STATUS.AVAILABLE,
    bar_code_number: '',
    is_deliverable: false,
    is_promo: false,
  }
}

export function productToFormValues(product) {
  if (!product) return getDefaultProductFormValues()
  return {
    name: product.name ?? '',
    short_description: product.short_description ?? '',
    description: product.description ?? '',
    price: product.price ?? '',
    old_price: product.old_price ?? '',
    buy_price: product.buy_price ?? '',
    stock: product.stock ?? '',
    quantity: product.quantity ?? '',
    unit: product.unit ?? ClassProduct.UNIT.PIECE,
    category: product.category ?? ClassProduct.CATEGORY.UNKNOWN,
    sub_category: product.sub_category ?? ClassProduct.SUB_CATEGORY.UNKNOWN.value,
    type: product.type ?? ClassProduct.TYPE.UNKNOWN.value,
    status: product.status ?? ClassProduct.STATUS.UNKNOWN,
    bar_code_number: product.bar_code_number ?? '',
    is_deliverable: Boolean(product.is_deliverable),
    is_promo: Boolean(product.is_promo),
  }
}

function parseNumber(value) {
  if (value === '' || value === null || value === undefined) return 0
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formValuesToProduct(form, { uid = '', uidCompany = 'system' } = {}) {
  return ClassProduct.makeInstance(uid, {
    uid,
    uid_company: uidCompany,
    name: String(form.name ?? '').trim(),
    short_description: String(form.short_description ?? '').trim(),
    description: String(form.description ?? '').trim(),
    price: parseNumber(form.price),
    old_price: parseNumber(form.old_price),
    buy_price: parseNumber(form.buy_price),
    stock: parseNumber(form.stock),
    quantity: parseNumber(form.quantity),
    unit: form.unit || ClassProduct.UNIT.PIECE,
    category: form.category || ClassProduct.CATEGORY.UNKNOWN,
    sub_category: form.sub_category || ClassProduct.SUB_CATEGORY.UNKNOWN.value,
    type: form.type || ClassProduct.TYPE.UNKNOWN.value,
    status: form.status || ClassProduct.STATUS.UNKNOWN,
    bar_code_number: String(form.bar_code_number ?? '').trim(),
    is_deliverable: Boolean(form.is_deliverable),
    is_promo: Boolean(form.is_promo),
    last_edit_time: new Date(),
  })
}

export function formatProductPrice(value, locale = 'fr-CH') {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '—'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'CHF',
  }).format(amount)
}

const NUMERIC_FORM_FIELDS = ['price', 'old_price', 'buy_price', 'stock', 'quantity']

function normalizeProductFormValues(values = {}) {
  const defaults = getDefaultProductFormValues()
  const out = {}

  for (const key of Object.keys(defaults)) {
    if (key === 'bar_code_number') continue

    const value = values[key]
    if (typeof defaults[key] === 'boolean') {
      out[key] = Boolean(value)
      continue
    }
    if (NUMERIC_FORM_FIELDS.includes(key)) {
      if (value === '' || value === null || value === undefined) {
        out[key] = ''
      } else {
        const parsed = Number(value)
        out[key] = Number.isFinite(parsed) ? parsed : ''
      }
      continue
    }
    out[key] = String(value ?? '')
  }

  return out
}

export function hasProductFormChanges(current, baseline) {
  if (!baseline) return false
  return JSON.stringify(normalizeProductFormValues(current))
    !== JSON.stringify(normalizeProductFormValues(baseline))
}
