'use client'

import { useMemo } from 'react'
import { getSeedPartnerCompanies, buildStoreShowcase } from '@/lib/storeShowcase'
import { usePartnerCompanies } from '@/hooks/usePartnerCompanies'

export function useStoreShowcase(max = 3) {
  const { companies, loading } = usePartnerCompanies()

  const stores = useMemo(() => {
    if (loading && companies.length === 0) {
      return buildStoreShowcase(getSeedPartnerCompanies(), max)
    }
    return buildStoreShowcase(companies, max)
  }, [companies, loading, max])

  return { stores, loading }
}
