import { ClassLoyalty } from '@/classes/ClassLoyalty'

export const LOYALTY_TIER = ClassLoyalty.TIER

export const LOYALTY_TIER_THRESHOLDS = Object.freeze(
  Object.fromEntries(
    ClassLoyalty.TIER_STEPS.map(({ tier, minAmount }) => [tier, minAmount]),
  ),
)

export const LOYALTY_POINTS_PER_CHF = 10
export const LOYALTY_CHF_PER_POINT = 0.01

export function normalizeLoyaltyPoints(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return 0
  return n
}

export function normalizeLoyaltyPointsDecimal(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.round(n * 100) / 100
}

export function normalizeLoyaltyAmount(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.round(n * 100) / 100
}

export function calculateLoyaltyPointsFromAmount(amount) {
  return normalizeLoyaltyPoints(normalizeLoyaltyAmount(amount) * LOYALTY_POINTS_PER_CHF)
}

export function getLoyaltyAmountFromPoints(points) {
  return normalizeLoyaltyAmount(normalizeLoyaltyPoints(points) * LOYALTY_CHF_PER_POINT)
}

export function getLoyaltyTierFromAmount(amount) {
  const value = normalizeLoyaltyAmount(amount)
  for (const step of ClassLoyalty.TIER_STEPS) {
    if (value >= step.minAmount) return step.tier
  }
  return ClassLoyalty.TIER.NORMAL
}

export function getLoyaltyTierFromPoints(points) {
  return getLoyaltyTierFromAmount(getLoyaltyAmountFromPoints(points))
}

export function getLoyaltyLabelFromAmount(amount) {
  return `${normalizeLoyaltyAmount(amount).toFixed(2)} CHF`
}

export function getLoyaltyLabelFromPoints(points) {
  const p = normalizeLoyaltyPoints(points)
  return `${p} pt${p !== 1 ? 's' : ''}`
}

export function resolveLoyaltyTierFromCustomer(customer) {
  if (!customer) return ClassLoyalty.TIER.NORMAL
  const fromGetter = customer.loyaltyTierFromAmount
  if (typeof fromGetter === 'string' && fromGetter) return fromGetter
  return getLoyaltyTierFromAmount(customer.loyalty_amount ?? 0)
}

export function resolveLoyaltyTierLabel(tierKey, tierLabels = {}) {
  const key = String(tierKey ?? '').trim()
  if (!key) {
    return tierLabels[ClassLoyalty.TIER.UNKNOWN] ?? ClassLoyalty.TIER.UNKNOWN
  }
  return tierLabels[key] ?? key
}
