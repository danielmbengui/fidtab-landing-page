'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { useLanguage } from '@/context/LanguageProvider'
import { useCustomers } from '@/hooks/useCustomers'
import { formatCustomerDisplayName } from '@/lib/customerForm'
import { CUSTOMERS_PATH, WEBSITE_NAME } from '@/context/constants/constants_app'

export default function CustomersPage() {
  const { user } = useAuth()
  const { content: c, t } = useLanguage()
  const cu = c.customers
  const { customers, loading } = useCustomers(user?.uid_company)
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${cu.metaTitle}`
  }, [cu.metaTitle])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return customers
    return customers.filter((customer) =>
      String(customer.display_name ?? '').toLowerCase().includes(term)
      || String(customer.email ?? '').toLowerCase().includes(term)
      || String(customer.phone_number ?? '').toLowerCase().includes(term)
      || String(customer.uid ?? '').toLowerCase().includes(term)
      || String(customer.uid_company ?? '').toLowerCase().includes(term),
    )
  }, [customers, query])

  return (
    <div className="dashboard-page products-page">
      <header className="dashboard-page-header products-page-header">
        <div>
          <h1 className="dashboard-page-title">{cu.title}</h1>
          <p className="dashboard-page-sub">
            {loading ? cu.loading : t(cu.sub, { count: filtered.length })}
          </p>
        </div>
        <Link href={`${CUSTOMERS_PATH}/new`} className="btn-primary products-create-btn">
          {cu.create}
        </Link>
      </header>

      <section className="dashboard-card products-card">
        <div className="products-toolbar">
          <input
            type="search"
            className="products-search"
            placeholder={cu.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={cu.searchPlaceholder}
          />
        </div>

        {loading ? (
          <p className="products-empty">{cu.loading}</p>
        ) : filtered.length === 0 ? (
          <p className="products-empty">{cu.empty}</p>
        ) : (
          <div className="products-table-wrap">
            <table className="products-table">
              <thead>
                <tr>
                  <th>{cu.columns.name}</th>
                  <th>{cu.columns.email}</th>
                  <th>{cu.columns.phone}</th>
                  <th>{cu.columns.company}</th>
                  <th>{cu.columns.points}</th>
                  <th>{cu.columns.status}</th>
                  <th>{cu.columns.fidtabId}</th>
                  <th>{cu.columns.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr key={customer.uid}>
                    <td>
                      <span className="products-table-name">
                        {formatCustomerDisplayName(customer, c.dashboard.empty)}
                      </span>
                    </td>
                    <td>{customer.email || c.dashboard.empty}</td>
                    <td>{customer.phone_number || c.dashboard.empty}</td>
                    <td>{customer.uid_company || c.dashboard.empty}</td>
                    <td>{customer.loyalty_points ?? c.dashboard.empty}</td>
                    <td>
                      <span className={`products-status products-status--${customer.status || 'unknown'}`}>
                        {cu.statuses[customer.status] ?? customer.status ?? c.dashboard.empty}
                      </span>
                    </td>
                    <td>{customer.uid || c.dashboard.empty}</td>
                    <td>
                      <div className="products-row-actions">
                        <Link href={`${CUSTOMERS_PATH}/${customer.uid}`} className="btn-ghost products-action-link">
                          {cu.actions.view}
                        </Link>
                        <Link href={`${CUSTOMERS_PATH}/${customer.uid}/edit`} className="btn-ghost products-action-link">
                          {cu.actions.edit}
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
