'use client'

import { onAuthStateChanged, signOut } from 'firebase/auth'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ClassUser } from '@/classes/ClassUser'
import { auth } from '@/lib/firebaseConfig'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let unsubscribeUser = () => {}

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribeUser()
      setAuthUser(firebaseUser)
      setError(null)

      if (!firebaseUser) {
        setUser(null)
        setLoading(false)
        return
      }

      setLoading(true)
      unsubscribeUser = ClassUser.subscribeFirestore(
        firebaseUser.uid,
        (nextUser) => {
          setUser(nextUser)
          setLoading(false)
        },
        (err) => {
          console.error('[AuthProvider] Firestore user snapshot error:', err)
          setError(err)
          setUser(null)
          setLoading(false)
        },
      )
    })

    return () => {
      unsubscribeAuth()
      unsubscribeUser()
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
  }, [])

  const value = useMemo(
    () => ({
      authUser,
      user,
      loading,
      error,
      isAuthenticated: Boolean(authUser),
      logout,
    }),
    [authUser, user, loading, error, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
