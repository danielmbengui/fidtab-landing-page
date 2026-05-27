'use client'

import { useEffect, useState } from 'react'
import { ClassSettings } from '@/classes/ClassSettings'

export function useFidTabSettings() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    const unsubscribe = ClassSettings.subscribeFirestore(
      ClassSettings.DEFAULT_UID,
      (nextSettings) => {
        if (!active) return
        setSettings(nextSettings)
        setLoading(false)
      },
      (subscribeError) => {
        if (!active) return
        console.error('useFidTabSettings', subscribeError)
        setError(subscribeError)
        setSettings(null)
        setLoading(false)
      },
    )

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return { settings, loading, error }
}
