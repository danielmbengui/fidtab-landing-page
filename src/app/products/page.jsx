'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { useLanguage } from '@/context/LanguageProvider'
import BrandImageThumb from '@/components/brands/BrandImageThumb'
import { useProducts } from '@/hooks/useProducts'
import { formatProductPrice } from '@/lib/productForm'
import { PRODUCTS_PATH, WEBSITE_NAME } from '@/context/constants/constants_app'

export default function ProductsPage() {
  const { user } = useAuth()
  const { content: c, t } = useLanguage()
  const p = c.products
  const { products, loading } = useProducts(user?.uid_company)
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${p.metaTitle}`
  }, [p.metaTitle])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return products
    return products.filter((product) =>
      String(product.name ?? '').toLowerCase().includes(term)
      || String(product.uid ?? '').toLowerCase().includes(term)
      || String(product.bar_code_number ?? '').toLowerCase().includes(term),
    )
  }, [products, query])

  return (
    <div className="dashboard-page products-page">
      <header className="dashboard-page-header products-page-header">
        <div>
          <h1 className="dashboard-page-title">{p.title}</h1>
          <p className="dashboard-page-sub">
            {loading ? p.loading : t(p.sub, { count: filtered.length })}
          </p>
        </div>
        <Link href={`${PRODUCTS_PATH}/new`} className="btn-primary products-create-btn">
          {p.create}
        </Link>
      </header>

      <section className="dashboard-card products-card">
        <div className="products-toolbar">
          <input
            type="search"
            className="products-search"
            placeholder={p.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={p.searchPlaceholder}
          />
        </div>

        {loading ? (
          <p className="products-empty">{p.loading}</p>
        ) : filtered.length === 0 ? (
          <p className="products-empty">{p.empty}</p>
        ) : (
          <div className="products-table-wrap">
            <table className="products-table">
              <thead>
                <tr>
                  <th>{p.columns.name}</th>
                  <th>{p.columns.fidtabId}</th>
                  <th>{p.columns.category}</th>
                  <th>{p.columns.price}</th>
                  <th>{p.columns.stock}</th>
                  <th>{p.columns.status}</th>
                  <th>{p.columns.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.uid}>
                    <td>
                      <div className="brands-table-name-cell">
                        <BrandImageThumb
                          photoUrl={product.photo_url}
                          storagePath={product.storage_url}
                          className="products-table-thumb"
                        />
                        <div>
                          <span className="products-table-name">{product.name || c.dashboard.empty}</span>
                          {product.bar_code_number ? (
                            <span className="products-table-meta">{product.bar_code_number}</span>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td>{product.uid || c.dashboard.empty}</td>
                    <td>{p.categories[product.category] ?? product.category ?? c.dashboard.empty}</td>
                    <td>{formatProductPrice(product.price)}</td>
                    <td>{product.stock ?? c.dashboard.empty}</td>
                    <td>
                      <span className={`products-status products-status--${product.status || 'unknown'}`}>
                        {p.statuses[product.status] ?? product.status ?? c.dashboard.empty}
                      </span>
                    </td>
                    <td>
                      <div className="products-row-actions">
                        <Link href={`${PRODUCTS_PATH}/${product.uid}`} className="btn-ghost products-action-link">
                          {p.actions.view}
                        </Link>
                        <Link href={`${PRODUCTS_PATH}/${product.uid}/edit`} className="btn-ghost products-action-link">
                          {p.actions.edit}
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
