'use client'

import { onSnapshot } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { ClassShop } from '@/classes/ClassShop'
import { buildStoreShowcaseFromShops, fetchStatsForShops } from '@/lib/storeShowcase'
import { usePartnerCompanies } from '@/hooks/usePartnerCompanies'

function shopFromSnapshot(docSnap, uidCompany) {
  const data = docSnap.data()
  const record = ClassShop.toJSON(
    data instanceof ClassShop
      ? data
      : ClassShop.makeInstance(docSnap.id, { ...(data ?? {}), uid: docSnap.id }),
  )

  return {
    ...record,
    uid: record.uid || docSnap.id,
    uid_company: record.uid_company || uidCompany,
  }
}

export function useStoreShowcase(max = null) {
  const { companies, loading: companiesLoading } = usePartnerCompanies()
  const [shopsByCompany, setShopsByCompany] = useState({})
  const [statsByShopKey, setStatsByShopKey] = useState({})
  const [shopsLoading, setShopsLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(false)

  useEffect(() => {
    if (companiesLoading) return undefined

    if (companies.length === 0) {
      setShopsByCompany({})
      setShopsLoading(false)
      return undefined
    }

    let active = true
    setShopsLoading(true)
    const pending = new Set(companies.map((company) => company.uid).filter(Boolean))
    const unsubs = []

    for (const company of companies) {
      const uidCompany = company.uid
      if (!uidCompany) continue

      const unsub = onSnapshot(
        ClassShop.colRef(uidCompany),
        (snapshot) => {
          if (!active) return

          const shops = snapshot.docs
            .map((docSnap) => shopFromSnapshot(docSnap, uidCompany))
            .filter(
              (shop) => shop.enabled !== false && String(shop.name ?? '').trim(),
            )

          setShopsByCompany((prev) => ({ ...prev, [uidCompany]: shops }))
          pending.delete(uidCompany)
          if (pending.size === 0) {
            setShopsLoading(false)
          }
        },
        (error) => {
          if (!active) return
          console.error('useStoreShowcase shops', error)
          pending.delete(uidCompany)
          if (pending.size === 0) {
            setShopsLoading(false)
          }
        },
      )

      unsubs.push(unsub)
    }

    return () => {
      active = false
      unsubs.forEach((unsub) => unsub())
    }
  }, [companies, companiesLoading])

  const allShops = useMemo(
    () =>
      Object.entries(shopsByCompany).flatMap(([uidCompany, shops]) =>
        shops.map((shop) => ({
          ...shop,
          uid_company: shop.uid_company || uidCompany,
        })),
      ),
    [shopsByCompany],
  )

  useEffect(() => {
    if (shopsLoading) return undefined

    if (allShops.length === 0) {
      setStatsByShopKey({})
      setStatsLoading(false)
      return undefined
    }

    let active = true
    setStatsLoading(true)

    fetchStatsForShops(allShops)
      .then((stats) => {
        if (active) setStatsByShopKey(stats)
      })
      .finally(() => {
        if (active) setStatsLoading(false)
      })

    return () => {
      active = false
    }
  }, [allShops, shopsLoading])

  const stores = useMemo(() => {
    const companyMap = new Map(companies.map((company) => [company.uid, company]))
    const cards = buildStoreShowcaseFromShops(allShops, companyMap, statsByShopKey)
    return max ? cards.slice(0, max) : cards
  }, [allShops, companies, statsByShopKey, max])

  return {
    stores,
    loading: companiesLoading || shopsLoading || statsLoading,
  }
}
