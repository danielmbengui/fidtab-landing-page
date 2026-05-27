'use client'

import { useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthProvider'
import { useLanguage } from '@/context/LanguageProvider'
import { useProducts } from '@/hooks/useProducts'
import { formatProductPrice } from '@/lib/productForm'

function formatProductLabel(product) {
  const parts = [product.name || product.uid]
  if (product.bar_code_number) parts.push(product.bar_code_number)
  parts.push(formatProductPrice(product.price))
  return parts.join(' · ')
}

export default function ProhibitedProductsPicker({ selectedUids = [], onChange, disabled = false }) {
  const { user } = useAuth()
  const { content: c } = useLanguage()
  const l = c.loyalty.fields
  const { products, loading } = useProducts(user?.uid_company)
  const [pendingUid, setPendingUid] = useState('')

  const uids = useMemo(
    () => [...new Set((selectedUids ?? []).map((uid) => String(uid ?? '').trim()).filter(Boolean))],
    [selectedUids],
  )
  const selectedSet = useMemo(() => new Set(uids), [uids])

  const catalogProducts = useMemo(
    () => [...products].sort((a, b) =>
      String(a.name ?? '').localeCompare(String(b.name ?? ''), 'fr', { sensitivity: 'base' }),
    ),
    [products],
  )

  const { availableProducts, excludedProducts } = useMemo(() => {
    const available = []
    const excluded = []
    for (const product of catalogProducts) {
      if (selectedSet.has(product.uid)) excluded.push(product)
      else available.push(product)
    }
    return { availableProducts: available, excludedProducts: excluded }
  }, [catalogProducts, selectedSet])

  function addUid(uid) {
    const normalized = String(uid ?? '').trim()
    if (!normalized || selectedSet.has(normalized)) return
    onChange?.([...uids, normalized])
    setPendingUid('')
  }

  function removeUid(uid) {
    onChange?.(uids.filter((entry) => entry !== uid))
  }

  const placeholder = loading
    ? l.prohibitedProductsLoading
    : catalogProducts.length === 0
      ? l.prohibitedProductsEmpty
      : l.prohibitedProductsSelect

  return (
    <div className="loyalty-prohibited-picker">
      <div className="loyalty-prohibited-add">
        <select
          value={pendingUid}
          onChange={(e) => {
            const uid = e.target.value
            if (uid) addUid(uid)
            else setPendingUid('')
          }}
          disabled={disabled || loading || availableProducts.length === 0}
          className="products-field select"
          aria-label={l.prohibitedProductsSelect}
        >
          <option value="">{placeholder}</option>
          {availableProducts.map((product) => (
            <option key={product.uid} value={product.uid}>
              {formatProductLabel(product)}
            </option>
          ))}
        </select>
      </div>

      {excludedProducts.length === 0 ? (
        <p className="loyalty-prohibited-empty">{l.prohibitedProductsNone}</p>
      ) : (
        <ul className="loyalty-prohibited-list">
          {excludedProducts.map((product) => (
            <li key={product.uid} className="loyalty-prohibited-chip">
              <span>{formatProductLabel(product)}</span>
              <button
                type="button"
                className="loyalty-prohibited-remove"
                onClick={() => removeUid(product.uid)}
                disabled={disabled}
                aria-label={l.prohibitedProductsRemove}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
