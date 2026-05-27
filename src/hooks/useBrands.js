'use client'

import { onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { ClassBrand } from '@/classes/ClassBrand'
import { ClassCompanyBrand } from '@/classes/ClassCompany'
import { getBrandColRef, resolveBrandWriteCompany } from '@/lib/brandRepository'

function sortBrands(list) {
  return [...list].sort((a, b) =>
    String(a.name ?? '').localeCompare(String(b.name ?? ''), 'fr', { sensitivity: 'base' }),
  )
}

function mergeBrandLists(...lists) {
  const byUid = new Map()
  for (const list of lists) {
    for (const brand of list) {
      if (!brand?.uid) continue
      byUid.set(brand.uid, brand)
    }
  }
  return sortBrands([...byUid.values()])
}

export function useBrands(uidCompany) {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const writeCompany = useMemo(
    () => resolveBrandWriteCompany(uidCompany, ''),
    [uidCompany],
  )

  useEffect(() => {
    let active = true
    let companyBrands = []
    let globalBrands = []
    let companyReady = false
    let globalReady = false

    function publish() {
      if (!active || !companyReady || !globalReady) return
      setBrands(mergeBrandLists(companyBrands, globalBrands))
      setLoading(false)
    }

    const unsubscribers = [
      onSnapshot(
        query(getBrandColRef(writeCompany)),
        (snapshot) => {
          companyBrands = snapshot.docs.map((docSnap) => docSnap.data())
          companyReady = true
          publish()
        },
        (error) => {
          console.error('useBrands.company', error)
          companyBrands = []
          companyReady = true
          publish()
        },
      ),
      onSnapshot(
        query(
          ClassBrand.colRef(),
          ...(String(uidCompany ?? '').trim() && uidCompany !== 'system'
            ? [where('uid_company', '==', uidCompany)]
            : []),
        ),
        (snapshot) => {
          globalBrands = snapshot.docs.map((docSnap) => docSnap.data())
          globalReady = true
          publish()
        },
        (error) => {
          console.error('useBrands.global', error)
          globalBrands = []
          globalReady = true
          publish()
        },
      ),
    ]

    return () => {
      active = false
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }, [uidCompany, writeCompany])

  return { brands, loading }
}
