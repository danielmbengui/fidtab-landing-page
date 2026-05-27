'use client'

import { useEffect } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { useLanguage } from '@/context/LanguageProvider'
import { WEBSITE_NAME } from '@/context/constants/constants_app'

function getStatusLabel(status, labels) {
  if (!status || !labels) return null
  return labels[status] ?? labels.unknown
}

export default function DashboardPage() {
  const { user, authUser } = useAuth()
  const { content: c, t } = useLanguage()
  const d = c.dashboard

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${d.metaTitle}`
  }, [d.metaTitle])

  const displayName = user?.display_name || user?.email || authUser?.email || d.empty
  const statusLabel = getStatusLabel(user?.status, d.statusLabels)

  return (
    <div className="dashboard-page">
      <header className="dashboard-page-header">
        <h1 className="dashboard-page-title">
          {d.nav.home}
        </h1>
        <p className="dashboard-page-sub">
          {t(d.welcome, { name: displayName })}
        </p>
      </header>

      <section className="dashboard-card">
        <h2 className="dashboard-card-title">{d.accountTitle}</h2>
        <dl className="dashboard-details">
          <div className="dashboard-detail-row">
            <dt>{d.fields.email}</dt>
            <dd>{user?.email || authUser?.email || d.empty}</dd>
          </div>
          {user?.role ? (
            <div className="dashboard-detail-row">
              <dt>{d.fields.role}</dt>
              <dd>{user.role}</dd>
            </div>
          ) : null}
          {statusLabel ? (
            <div className="dashboard-detail-row">
              <dt>{d.fields.status}</dt>
              <dd>{statusLabel}</dd>
            </div>
          ) : null}
        </dl>
      </section>
    </div>
  )
}
