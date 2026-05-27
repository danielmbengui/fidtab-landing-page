'use client'

import { onSnapshot, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { ClassCompany } from '@/classes/ClassCompany'

function sortCompanies(list) {
  return [...list].sort((a, b) =>
    String(a.name ?? '').localeCompare(String(b.name ?? ''), 'fr', { sensitivity: 'base' }),
  )
}

export function useCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const unsubscribe = onSnapshot(
      query(ClassCompany.colRef()),
      (snapshot) => {
        if (!active) return
        const list = snapshot.docs.map((docSnap) => docSnap.data())
        setCompanies(sortCompanies(list))
        setLoading(false)
      },
      (error) => {
        if (!active) return
        console.error('useCompanies', error)
        setCompanies([])
        setLoading(false)
      },
    )

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return { companies, loading }
}
