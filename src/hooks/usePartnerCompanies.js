'use client'

import { onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { ClassCompany } from '@/classes/ClassCompany'

function sortCompanies(list) {
  return [...list].sort((a, b) =>
    String(a.name ?? '').localeCompare(String(b.name ?? ''), 'fr', { sensitivity: 'base' }),
  )
}

export function usePartnerCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const unsubscribe = onSnapshot(
      ClassCompany.colRef(),
      (snapshot) => {
        if (!active) return
        const list = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data()
            const record = ClassCompany.toJSON(data)
            return {
              ...record,
              uid: record.uid || docSnap.id,
            }
          })
          .filter((company) => String(company?.name ?? '').trim())
        setCompanies(sortCompanies(list))
        setLoading(false)
      },
      (error) => {
        if (!active) return
        console.error('usePartnerCompanies', error)
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
