'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { useAuth } from '@/context/AuthProvider'
import { useLanguage } from '@/context/LanguageProvider'

export default function AdminShell({ children }) {
  const router = useRouter()
  const { authUser, loading } = useAuth()
  const { content: c } = useLanguage()
  const login = c.login

  useEffect(() => {
    if (!loading && !authUser) {
      router.replace('/')
    }
  }, [authUser, loading, router])

  if (loading || !authUser) {
    return (
      <div className="login-page">
        <div className="page-ambient" aria-hidden="true">
          <div className="ambient-grid" />
          <div className="ambient-orb ambient-orb-1" />
        </div>
        <div className="login-shell login-shell--loading" aria-busy="true">
          <p className="login-loading">{login.submitting}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <div className="dashboard-main">
        {children}
      </div>
    </div>
  )
}
