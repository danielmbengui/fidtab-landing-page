'use client'

import { onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'
import { ClassUser } from '@/classes/ClassUser'

function sortCustomers(list) {
  return [...list].sort((a, b) =>
    String(a.display_name ?? a.email ?? '').localeCompare(
      String(b.display_name ?? b.email ?? ''),
      'fr',
      { sensitivity: 'base' },
    ),
  )
}

export function useCustomers(uidCompany) {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  const constraints = useMemo(() => {
    const company = String(uidCompany ?? '').trim()
    const base = [where('role', '==', ClassUser.ROLE.CUSTOMER)]
    if (company && company !== 'system') {
      base.push(where('uid_company', '==', company))
    }
    return base
  }, [uidCompany])

  useEffect(() => {
    let active = true

    const unsubscribe = onSnapshot(
      query(ClassUser.colRef(), ...constraints),
      (snapshot) => {
        if (!active) return
        const list = snapshot.docs
          .map((docSnap) => docSnap.data())
          .filter((user) => user?.role === ClassUser.ROLE.CUSTOMER)
        setCustomers(sortCustomers(list))
        setLoading(false)
      },
      (error) => {
        if (!active) return
        console.error('useCustomers', error)
        setCustomers([])
        setLoading(false)
      },
    )

    return () => {
      active = false
      unsubscribe()
    }
  }, [constraints])

  return { customers, loading }
}
