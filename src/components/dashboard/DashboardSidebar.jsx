'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import BrandLogo from '@/components/BrandLogo'
import LanguageSelector from '@/components/LanguageSelector'
import ThemeSelector from '@/components/ThemeSelector'
import { useAuth } from '@/context/AuthProvider'
import { useLanguage } from '@/context/LanguageProvider'
import {
  BRANDS_PATH,
  COMPANIES_PATH,
  CUSTOMERS_PATH,
  DASHBOARD_PATH,
  LOYALTY_PATH,
  PRODUCTS_PATH,
} from '@/context/constants/constants_app'

function getUserLabel(user, authUser, fallback) {
  if (user?.display_name) return user.display_name
  if (user?.email) return user.email
  if (authUser?.email) return authUser.email
  return fallback
}

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { user, authUser, logout } = useAuth()
  const { content: c } = useLanguage()
  const login = c.login
  const d = c.dashboard
  const [signingOut, setSigningOut] = useState(false)

  const navItems = useMemo(
    () => [
      { href: DASHBOARD_PATH, label: d.nav.home, icon: '🏠', match: 'exact' },
      { href: COMPANIES_PATH, label: d.nav.companies, icon: '🏢', match: 'prefix' },
      { href: PRODUCTS_PATH, label: d.nav.products, icon: '📦', match: 'prefix' },
      { href: BRANDS_PATH, label: d.nav.brands, icon: '🏷️', match: 'prefix' },
      { href: CUSTOMERS_PATH, label: d.nav.customers, icon: '👤', match: 'prefix' },
      { href: LOYALTY_PATH, label: d.nav.loyalty, icon: '💳', match: 'exact' },
    ],
    [d.nav.home, d.nav.companies, d.nav.products, d.nav.brands, d.nav.customers, d.nav.loyalty],
  )

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await logout()
    } finally {
      setSigningOut(false)
    }
  }

  const userLabel = getUserLabel(user, authUser, d.userFallback)

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar-brand">
        <BrandLogo variant="nav" tag="div" showName />
      </div>

      <nav className="dashboard-sidebar-nav" aria-label={d.navAria}>
        {navItems.map((item) => {
          const isActive = item.match === 'prefix'
            ? pathname === item.href || pathname.startsWith(`${item.href}/`)
            : pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`dashboard-nav-link${isActive ? ' active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="dashboard-nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="dashboard-sidebar-footer">
        <div className="dashboard-sidebar-preferences">
          <LanguageSelector />
          <ThemeSelector />
        </div>
        <div className="dashboard-user-card">
          <div className="dashboard-user-avatar" aria-hidden="true">
            {(userLabel.charAt(0) || '?').toUpperCase()}
          </div>
          <div className="dashboard-user-meta">
            <span className="dashboard-user-name">{userLabel}</span>
            {user?.role ? (
              <span className="dashboard-user-role">{user.role}</span>
            ) : null}
          </div>
        </div>
        <button
          type="button"
          className="btn-ghost dashboard-signout"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? login.submitting : d.signOut}
        </button>
      </div>
    </aside>
  )
}
