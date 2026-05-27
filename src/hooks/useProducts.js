'use client'

import { onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { ClassProduct } from '@/classes/ClassProduct'

function sortProducts(list) {
  return [...list].sort((a, b) =>
    String(a.name ?? '').localeCompare(String(b.name ?? ''), 'fr', { sensitivity: 'base' }),
  )
}

export function useProducts(uidCompany) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const constraints = useMemo(() => {
    const company = String(uidCompany ?? '').trim()
    if (company && company !== 'system') {
      return [where('uid_company', '==', company)]
    }
    return []
  }, [uidCompany])

  useEffect(() => {
    let active = true

    const q = constraints.length > 0
      ? query(ClassProduct.colRef(), ...constraints)
      : query(ClassProduct.colRef())

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!active) return
        const list = snapshot.docs.map((docSnap) => docSnap.data())
        setProducts(sortProducts(list))
        setLoading(false)
      },
      (error) => {
        if (!active) return
        console.error('useProducts', error)
        setProducts([])
        setLoading(false)
      },
    )

    return () => {
      active = false
      unsubscribe()
    }
  }, [constraints])

  return { products, loading }
}
