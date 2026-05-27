'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import BrandImageThumb from '@/components/brands/BrandImageThumb'
import { useLanguage } from '@/context/LanguageProvider'
import { useCompanies } from '@/hooks/useCompanies'
import { formatCompanyCity } from '@/lib/companyForm'
import { COMPANIES_PATH, WEBSITE_NAME } from '@/context/constants/constants_app'

export default function CompaniesPage() {
  const { content: c, t } = useLanguage()
  const co = c.companies
  const { companies, loading } = useCompanies()
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${co.metaTitle}`
  }, [co.metaTitle])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return companies
    return companies.filter((company) =>
      String(company.name ?? '').toLowerCase().includes(term)
      || String(company.uid ?? '').toLowerCase().includes(term)
      || String(company.tag ?? '').toLowerCase().includes(term)
      || formatCompanyCity(company, '').toLowerCase().includes(term),
    )
  }, [companies, query])

  return (
    <div className="dashboard-page products-page">
      <header className="dashboard-page-header products-page-header">
        <div>
          <h1 className="dashboard-page-title">{co.title}</h1>
          <p className="dashboard-page-sub">
            {loading ? co.loading : t(co.sub, { count: filtered.length })}
          </p>
        </div>
        <Link href={`${COMPANIES_PATH}/new`} className="btn-primary products-create-btn">
          {co.create}
        </Link>
      </header>

      <section className="dashboard-card products-card">
        <div className="products-toolbar">
          <input
            type="search"
            className="products-search"
            placeholder={co.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={co.searchPlaceholder}
          />
        </div>

        {loading ? (
          <p className="products-empty">{co.loading}</p>
        ) : filtered.length === 0 ? (
          <p className="products-empty">{co.empty}</p>
        ) : (
          <div className="products-table-wrap">
            <table className="products-table">
              <thead>
                <tr>
                  <th>{co.columns.name}</th>
                  <th>{co.columns.tag}</th>
                  <th>{co.columns.city}</th>
                  <th>{co.columns.fidtabId}</th>
                  <th>{co.columns.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((company) => (
                  <tr key={company.uid}>
                    <td>
                      <div className="brands-table-name-cell">
                        <BrandImageThumb
                          photoUrl={company.logo_url}
                          storagePath={company.storage_url}
                          className="products-table-thumb"
                        />
                        <span className="products-table-name">
                          {company.name || c.dashboard.empty}
                        </span>
                      </div>
                    </td>
                    <td>{company.tag || c.dashboard.empty}</td>
                    <td>{formatCompanyCity(company, c.dashboard.empty)}</td>
                    <td>{company.uid || c.dashboard.empty}</td>
                    <td>
                      <div className="products-row-actions">
                        <Link href={`${COMPANIES_PATH}/${company.uid}`} className="btn-ghost products-action-link">
                          {co.actions.view}
                        </Link>
                        <Link href={`${COMPANIES_PATH}/${company.uid}/edit`} className="btn-ghost products-action-link">
                          {co.actions.edit}
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
