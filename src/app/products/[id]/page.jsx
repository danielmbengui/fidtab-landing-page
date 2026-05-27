'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProductForm from '@/components/products/ProductForm'
import { ClassProduct } from '@/classes/ClassProduct'
import { useLanguage } from '@/context/LanguageProvider'
import { productToFormValues } from '@/lib/productForm'
import { PRODUCTS_PATH, WEBSITE_NAME } from '@/context/constants/constants_app'

export default function ViewProductPage() {
  const params = useParams()
  const productId = String(params?.id ?? '')
  const { content: c } = useLanguage()
  const p = c.products
  const [values, setValues] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${p.viewTitle}`
  }, [p.viewTitle])

  useEffect(() => {
    let active = true

    async function loadProduct() {
      if (!productId) {
        if (active) {
          setNotFound(true)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      try {
        const product = await ClassProduct.getFirestore(productId)
        if (!active) return
        if (!product) {
          setNotFound(true)
          setValues(null)
        } else {
          setNotFound(false)
          setValues(productToFormValues(product))
        }
      } catch (error) {
        console.error('ViewProductPage', error)
        if (active) {
          setNotFound(true)
          setValues(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProduct()
    return () => {
      active = false
    }
  }, [productId])

  if (loading) {
    return (
      <div className="dashboard-page products-page">
        <p className="products-empty">{p.loading}</p>
      </div>
    )
  }

  if (notFound || !values) {
    return (
      <div className="dashboard-page products-page">
        <header className="dashboard-page-header">
          <Link href={PRODUCTS_PATH} className="products-back-link">
            ← {p.backToList}
          </Link>
          <h1 className="dashboard-page-title">{p.viewTitle}</h1>
        </header>
        <section className="dashboard-card">
          <p className="products-empty">{p.errors.notFound}</p>
        </section>
      </div>
    )
  }

  return (
    <div className="dashboard-page products-page">
      <header className="dashboard-page-header products-page-header">
        <div>
          <Link href={PRODUCTS_PATH} className="products-back-link">
            ← {p.backToList}
          </Link>
          <h1 className="dashboard-page-title">{values.name || p.viewTitle}</h1>
        </div>
        <Link href={`${PRODUCTS_PATH}/${productId}/edit`} className="btn-primary products-create-btn">
          {p.actions.edit}
        </Link>
      </header>

      <section className="dashboard-card">
        <ProductForm
          entityUid={productId}
          values={values}
          onChange={setValues}
          readOnly
          showBarCode
        />
      </section>
    </div>
  )
}
