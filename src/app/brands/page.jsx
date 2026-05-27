'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { useLanguage } from '@/context/LanguageProvider'
import { useBrands } from '@/hooks/useBrands'
import BrandImageThumb from '@/components/brands/BrandImageThumb'
import { formatBrandCategories } from '@/lib/brandForm'
import { BRANDS_PATH, WEBSITE_NAME } from '@/context/constants/constants_app'

export default function BrandsPage() {
  const { user } = useAuth()
  const { content: c, t } = useLanguage()
  const b = c.brands
  const { brands, loading } = useBrands(user?.uid_company)
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${b.metaTitle}`
  }, [b.metaTitle])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return brands
    return brands.filter((brand) =>
      String(brand.name ?? '').toLowerCase().includes(term)
      || String(brand.uid ?? '').toLowerCase().includes(term),
    )
  }, [brands, query])

  return (
    <div className="dashboard-page products-page">
      <header className="dashboard-page-header products-page-header">
        <div>
          <h1 className="dashboard-page-title">{b.title}</h1>
          <p className="dashboard-page-sub">
            {loading ? b.loading : t(b.sub, { count: filtered.length })}
          </p>
        </div>
        <Link href={`${BRANDS_PATH}/new`} className="btn-primary products-create-btn">
          {b.create}
        </Link>
      </header>
      <section className="dashboard-card products-card">
        <div className="products-toolbar">
          <input
            type="search"
            className="products-search"
            placeholder={b.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={b.searchPlaceholder}
          />
        </div>

        {loading ? (
          <p className="products-empty">{b.loading}</p>
        ) : filtered.length === 0 ? (
          <p className="products-empty">{b.empty}</p>
        ) : (
          <div className="products-table-wrap">
            <table className="products-table">
              <thead>
                <tr>
                  <th>{b.columns.name}</th>
                  <th>{b.columns.categories}</th>
                  <th>{b.columns.fidtabId}</th>
                  <th>{b.columns.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((brand) => (
                  <tr key={brand.uid}>
                    <td>
                      <div className="brands-table-name-cell">
                        <BrandImageThumb
                          photoUrl={brand.photo_url}
                          storagePath={brand.storage_url}
                        />
                        <span className="products-table-name">
                          {brand.name || c.dashboard.empty}
                        </span>
                      </div>
                    </td>
                    <td>
                      {formatBrandCategories(
                        brand.categories,
                        c.products.categories,
                        c.dashboard.empty,
                      )}
                    </td>
                    <td>{brand.uid || c.dashboard.empty}</td>
                    <td>
                      <div className="products-row-actions">
                        <Link href={`${BRANDS_PATH}/${brand.uid}`} className="btn-ghost products-action-link">
                          {b.actions.view}
                        </Link>
                        <Link href={`${BRANDS_PATH}/${brand.uid}/edit`} className="btn-ghost products-action-link">
                          {b.actions.edit}
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