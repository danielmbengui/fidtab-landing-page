'use client'

import { useMemo } from 'react'
import { ClassCountry } from '@/classes/ClassCountry'
import { usePartnerCompanies } from '@/hooks/usePartnerCompanies'

const CARD_THEMES = [
  { theme: 'card-theme-1', logoClass: 'blc-logo-1', accentColor: '#B8892A' },
  { theme: 'card-theme-2', logoClass: 'blc-logo-2', accentColor: '#2B7CB8' },
  { theme: 'card-theme-3', logoClass: 'blc-logo-3', accentColor: '#7B3FB8' },
]

const MEMBER_NAMES = ['Marie L.', 'Jean P.', 'Sophie R.', 'Luc M.', 'Anna B.', 'Paul D.']

function hashString(value) {
  let hash = 0
  const text = String(value ?? '')
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function formatPoints(value) {
  return value.toLocaleString('fr-CH')
}

function companyToLoyaltyCard(company, themeIndex) {
  const theme = CARD_THEMES[themeIndex % CARD_THEMES.length]
  const seed = hashString(company.uid || company.name)
  const points = 180 + (seed % 920)
  const rewardAt = Math.max(points + 40, Math.ceil(points / 0.82 / 50) * 50)
  const progress = Math.min(96, Math.round((points / rewardAt) * 100))
  const rewardAmount = Math.max(3, Math.round(rewardAt / 160))
  const currency = ClassCountry.DEFAULT_CURRENCY

  return {
    key: company.uid || `company-${company.name}`,
    source: 'firestore',
    ...theme,
    logo: '🏪',
    logoUrl: String(company.logo_url ?? '').trim(),
    store: company.name,
    subText: String(company.tag ?? '').trim(),
    subKey: '',
    points: formatPoints(points),
    reward: `-${rewardAmount} ${currency}`,
    rewardAt: formatPoints(rewardAt),
    barWidth: `${progress}%`,
    cardNumber: `${String(1000 + (seed % 9000)).padStart(4, '0')} ${String(1000 + ((seed >> 4) % 9000)).padStart(4, '0')}`,
    memberName: MEMBER_NAMES[seed % MEMBER_NAMES.length],
  }
}

export function useLoyaltyCards(exampleCards = []) {
  const { companies } = usePartnerCompanies()

  const cards = useMemo(() => {
    const examples = exampleCards.map((card, index) => ({
      ...card,
      key: `example-${index}-${card.store}`,
      source: 'example',
      subText: '',
      logoUrl: '',
    }))

    const exampleNames = new Set(
      examples.map((card) => String(card.store ?? '').trim().toLowerCase()).filter(Boolean),
    )

    const fromFirestore = companies
      .filter((company) => {
        const name = String(company.name ?? '').trim().toLowerCase()
        return name && !exampleNames.has(name)
      })
      .map((company, index) => companyToLoyaltyCard(company, index))

    return [...examples, ...fromFirestore]
  }, [exampleCards, companies])

  return { cards }
}
