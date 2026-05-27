import { ClassUser } from '@/classes/ClassUser'
import { ClassUserCustomer } from '@/classes/ClassUser'
import { LOYALTY_TIER } from '@/lib/loyaltyUserStatics'

export function getCustomerStatusOptions() {
  return Object.values(ClassUser.STATUS).filter((value) => typeof value === 'string')
}

export function getCustomerGenderOptions() {
  return Object.values(ClassUser.GENDER).filter((value) => typeof value === 'string')
}

export function getCustomerLoyaltyTierOptions() {
  return Object.values(LOYALTY_TIER).filter((value) => typeof value === 'string')
}

export function getDefaultCustomerFormValues() {
  return {
    display_name: '',
    email: '',
    phone_number: '',
    uid_company: '',
    status: ClassUser.STATUS.ACTIVE,
    gender: ClassUser.GENDER.UNKNOWN,
    country_code: 'CH',
    loyalty_points: '0',
    loyalty_amount: '0',
    loyalty_tier: LOYALTY_TIER.NORMAL,
  }
}

export function customerToFormValues(customer) {
  if (!customer) return getDefaultCustomerFormValues()
  return {
    display_name: customer.display_name ?? '',
    email: customer.email ?? '',
    phone_number: customer.phone_number ?? '',
    uid_company: customer.uid_company ?? '',
    status: customer.status ?? ClassUser.STATUS.UNKNOWN,
    gender: customer.gender ?? ClassUser.GENDER.UNKNOWN,
    country_code: customer.country_code ?? '',
    loyalty_points: customer.loyalty_points ?? 0,
    loyalty_amount: customer.loyalty_amount ?? 0,
    loyalty_tier: customer.loyalty_tier ?? LOYALTY_TIER.NORMAL,
  }
}

function normalizeCustomerFormValues(values = {}) {
  return {
    display_name: String(values.display_name ?? '').trim(),
    email: String(values.email ?? '').trim().toLowerCase(),
    phone_number: String(values.phone_number ?? '').trim(),
    uid_company: String(values.uid_company ?? '').trim(),
    status: String(values.status ?? ClassUser.STATUS.UNKNOWN),
    gender: String(values.gender ?? ClassUser.GENDER.UNKNOWN),
    country_code: String(values.country_code ?? '').trim().toUpperCase(),
    loyalty_points: String(values.loyalty_points ?? '0'),
    loyalty_amount: String(values.loyalty_amount ?? '0'),
    loyalty_tier: String(values.loyalty_tier ?? LOYALTY_TIER.NORMAL),
  }
}

export function hasCustomerFormChanges(current, baseline) {
  if (!baseline) return false
  return JSON.stringify(normalizeCustomerFormValues(current))
    !== JSON.stringify(normalizeCustomerFormValues(baseline))
}

export function formValuesToCustomer(form, { uid = '', uidCompany = 'system' } = {}) {
  const normalized = normalizeCustomerFormValues(form)
  const points = Number(normalized.loyalty_points)
  const amount = Number(normalized.loyalty_amount)

  return new ClassUserCustomer({
    uid,
    display_name: normalized.display_name,
    email: normalized.email,
    phone_number: normalized.phone_number,
    uid_company: normalized.uid_company || uidCompany,
    status: normalized.status,
    gender: normalized.gender,
    country_code: normalized.country_code,
    loyalty_points: Number.isFinite(points) ? points : 0,
    loyalty_amount: Number.isFinite(amount) ? amount : 0,
    loyalty_tier: normalized.loyalty_tier,
    last_edit_time: new Date(),
  })
}

export function formatCustomerDisplayName(customer, empty = '—') {
  const name = String(customer?.display_name ?? '').trim()
  if (name) return name
  const email = String(customer?.email ?? '').trim()
  if (email) return email
  return customer?.uid || empty
}
