export const LOYALTY_TIER = Object.freeze({
  NORMAL: 'normal',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
})

export const LOYALTY_TIER_THRESHOLDS = Object.freeze({
  [LOYALTY_TIER.NORMAL]: 0,
  [LOYALTY_TIER.SILVER]: 500,
  [LOYALTY_TIER.GOLD]: 1500,
  [LOYALTY_TIER.PLATINUM]: 5000,
})

export const LOYALTY_TIER_LABELS = Object.freeze({
  [LOYALTY_TIER.NORMAL]: 'Standard',
  [LOYALTY_TIER.SILVER]: 'Argent',
  [LOYALTY_TIER.GOLD]: 'Or',
  [LOYALTY_TIER.PLATINUM]: 'Platine',
})

export const LOYALTY_POINTS_PER_CHF = 10
export const LOYALTY_CHF_PER_POINT = 0.01

export function normalizeLoyaltyPoints(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.floor(n)
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
  const tiers = Object.entries(LOYALTY_TIER_THRESHOLDS)
    .sort(([, a], [, b]) => b - a)
  for (const [tier, threshold] of tiers) {
    if (value >= threshold) return tier
  }
  return LOYALTY_TIER.NORMAL
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
