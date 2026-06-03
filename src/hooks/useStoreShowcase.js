'use client'

import { collectionGroup, onSnapshot, query } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { ClassShop } from '@/classes/ClassShop'
import { buildStoreShowcaseFromShops, fetchStatsForShops } from '@/lib/storeShowcase'
import { usePartnerCompanies } from '@/hooks/usePartnerCompanies'
import { firestore } from '@/lib/firebaseConfig'
import { useLanguage } from '@/context/LanguageProvider'

function shopFromSnapshot(docSnap) {
  try {
    const data = docSnap.data()
    const instance =
      data instanceof ClassShop
        ? data
        : ClassShop.makeInstance(docSnap.id, {
            uid: docSnap.id,
            ...(typeof data === 'object' && data ? data : {}),
          })

    const record = ClassShop.toJSON(instance)
    const pathCompanyUid = docSnap.ref.parent.parent?.id ?? ''

    return {
      ...instance,
      uid: record.uid || docSnap.id,
      uid_company: String(record.uid_company || pathCompanyUid || '').trim(),
    }
  } catch (error) {
    console.error('shopFromSnapshot', docSnap.id, error)
    return null
  }
}

export function useStoreShowcase(max = null) {
  const { companies, loading: companiesLoading } = usePartnerCompanies()
  const [shops, setShops] = useState([])
  const [statsByShopKey, setStatsByShopKey] = useState({})
  const [shopsLoading, setShopsLoading] = useState(true)
  const [shopsError, setShopsError] = useState(null);
  const {locale} = useLanguage();

  useEffect(() => {
    let active = true
    setShopsLoading(true)
    setShopsError(null)

    const unsubscribe = onSnapshot(
      query(collectionGroup(firestore, ClassShop.COLLECTION)).withConverter(ClassShop.converter),
      (snapshot) => {
        if (!active) return

        const list = snapshot.docs
          .map((docSnap) => docSnap.data())
          .filter(
            (shop) =>
              shop &&
              String(shop.name ?? '').trim() &&
              shop.enabled !== false,
          )

        setShops(list)
        setShopsLoading(false)
      },
      (error) => {
        if (!active) return
        console.error('useStoreShowcase shops', error)
        setShops([])
        setShopsError(error)
        setShopsLoading(false)
      },
    )

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (shopsLoading || shops.length === 0) {
      setStatsByShopKey({})
      return undefined
    }

    let active = true

    fetchStatsForShops(shops)
      .then((stats) => {
        if (active) setStatsByShopKey(stats)
      })
      .catch((error) => {
        console.error('useStoreShowcase stats', error)
      })

    return () => {
      active = false
    }
  }, [shops, shopsLoading])

  const stores = useMemo(() => {
    const companyMap = new Map(companies.map((company) => [company.uid, company]))
    const cards = buildStoreShowcaseFromShops(shops, companyMap, statsByShopKey, locale)
    return max ? cards.slice(0, max) : cards
  }, [shops, companies, statsByShopKey, max, locale])

  return {
    stores,
    loading: companiesLoading || shopsLoading,
    error: shopsError,
  }
}
