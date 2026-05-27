'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import ProductForm from '@/components/products/ProductForm'
import { ClassProduct } from '@/classes/ClassProduct'
import { useAuth } from '@/context/AuthProvider'
import { useLanguage } from '@/context/LanguageProvider'
import {
  formValuesToProduct,
  getDefaultProductFormValues,
  hasProductFormChanges,
  productToFormValues,
} from '@/lib/productForm'
import { PRODUCTS_PATH, WEBSITE_NAME } from '@/context/constants/constants_app'

function validateForm(values, p) {
  const errors = {}
  if (!String(values.name ?? '').trim()) {
    errors.name = p.errors.requiredName
  }
  const price = Number(values.price)
  if (values.price === '' || !Number.isFinite(price) || price < 0) {
    errors.price = p.errors.invalidPrice
  }
  return errors
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = String(params?.id ?? '')
  const { user } = useAuth()
  const { content: c } = useLanguage()
  const p = c.products
  const [values, setValues] = useState(getDefaultProductFormValues)
  const [initialValues, setInitialValues] = useState(null)
  const [uidCompany, setUidCompany] = useState('system')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${p.editTitle}`
  }, [p.editTitle])

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
        } else {
          setNotFound(false)
          const formValues = productToFormValues(product)
          setValues(formValues)
          setInitialValues(formValues)
          setUidCompany(product.uid_company || user?.uid_company || 'system')
        }
      } catch (error) {
        console.error('EditProductPage', error)
        if (active) setNotFound(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProduct()
    return () => {
      active = false
    }
  }, [productId])

  const hasChanges = useMemo(
    () => hasProductFormChanges(values, initialValues),
    [values, initialValues],
  )

  async function handleSubmit() {
    const nextErrors = validateForm(values, p)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const product = formValuesToProduct(values, {
        uid: productId,
        uidCompany,
      })
      const saved = await product.updateFirestore()
      if (!saved) {
        setErrors({ form: p.errors.saveFailed })
        return
      }
      router.push(`${PRODUCTS_PATH}/${productId}`)
    } catch (error) {
      console.error('EditProductPage', error)
      setErrors({ form: p.errors.saveFailed })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page products-page">
        <p className="products-empty">{p.loading}</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="dashboard-page products-page">
        <header className="dashboard-page-header">
          <Link href={PRODUCTS_PATH} className="products-back-link">
            ← {p.backToList}
          </Link>
          <h1 className="dashboard-page-title">{p.editTitle}</h1>
        </header>
        <section className="dashboard-card">
          <p className="products-empty">{p.errors.notFound}</p>
        </section>
      </div>
    )
  }

  return (
    <div className="dashboard-page products-page">
      <header className="dashboard-page-header">
        <Link href={`${PRODUCTS_PATH}/${productId}`} className="products-back-link">
          ← {p.backToView}
        </Link>
        <h1 className="dashboard-page-title">{p.editTitle}</h1>
        {values.name ? (
          <p className="dashboard-page-sub">{values.name}</p>
        ) : null}
      </header>

      <section className="dashboard-card">
        <ProductForm
          entityUid={productId}
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitDisabled={!hasChanges}
          errors={errors}
          showBarCode
        />
      </section>
    </div>
  )
}
