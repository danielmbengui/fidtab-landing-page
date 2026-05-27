'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ProductForm from '@/components/products/ProductForm'
import { ClassProduct } from '@/classes/ClassProduct'
import { useAuth } from '@/context/AuthProvider'
import { useLanguage } from '@/context/LanguageProvider'
import {
  findProductByBarCode,
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
  const { content: c, t } = useLanguage()
  const p = c.products
  const [values, setValues] = useState(getDefaultProductFormValues)
  const [initialValues, setInitialValues] = useState(null)
  const [uidCompany, setUidCompany] = useState('system')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [fieldsLocked, setFieldsLocked] = useState(false)
  const [barcodeChecking, setBarcodeChecking] = useState(false)
  const [barcodeError, setBarcodeError] = useState('')
  const [existingProductUid, setExistingProductUid] = useState('')
  const lookupTimeoutRef = useRef(null)
  const lookupRequestRef = useRef(0)

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${p.editTitle}`
  }, [p.editTitle])

  useEffect(() => () => {
    if (lookupTimeoutRef.current) clearTimeout(lookupTimeoutRef.current)
  }, [])

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
          const formValues = productToFormValues(product)
          setNotFound(false)
          setValues(formValues)
          setInitialValues(formValues)
          setUidCompany(product.uid_company || user?.uid_company || 'system')
          setFieldsLocked(false)
          setBarcodeError('')
          setExistingProductUid('')
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
  }, [productId, user?.uid_company])

  const hasChanges = useMemo(
    () => hasProductFormChanges(values, initialValues),
    [values, initialValues],
  )

  const runBarcodeLookup = useCallback(async (normalized, baseValues) => {
    const requestId = lookupRequestRef.current + 1
    lookupRequestRef.current = requestId
    setBarcodeChecking(true)
    setBarcodeError('')
    setExistingProductUid('')
    setFieldsLocked(false)

    try {
      const existing = await findProductByBarCode(normalized, user?.uid_company)
      if (lookupRequestRef.current !== requestId) return

      if (existing?.uid && existing.uid !== productId) {
        setValues(productToFormValues(existing))
        setFieldsLocked(true)
        setExistingProductUid(existing.uid)
        setBarcodeError(t(p.errors.barCodeExists, {
          name: existing.name || existing.uid,
          uid: existing.uid,
        }))
        return
      }

      setValues({ ...baseValues, bar_code_number: normalized })
    } catch (error) {
      console.error('EditProductPage.barcodeLookup', error)
      if (lookupRequestRef.current === requestId) {
        setValues({ ...baseValues, bar_code_number: normalized })
      }
    } finally {
      if (lookupRequestRef.current === requestId) {
        setBarcodeChecking(false)
      }
    }
  }, [p.errors.barCodeExists, productId, t, user?.uid_company])

  const handleBarcodeChange = useCallback((barCode) => {
    setErrors({})
    setBarcodeError('')
    setExistingProductUid('')
    setFieldsLocked(false)

    const baseValues = fieldsLocked && initialValues
      ? { ...initialValues }
      : { ...values, bar_code_number: barCode }

    setValues({ ...baseValues, bar_code_number: barCode })

    if (lookupTimeoutRef.current) clearTimeout(lookupTimeoutRef.current)

    const normalized = String(barCode ?? '').trim()
    if (!normalized) {
      lookupRequestRef.current += 1
      setBarcodeChecking(false)
      if (initialValues) setValues({ ...initialValues })
      return
    }

    lookupTimeoutRef.current = setTimeout(() => {
      void runBarcodeLookup(normalized, baseValues)
    }, 450)
  }, [fieldsLocked, initialValues, runBarcodeLookup, values])

  function handleReset() {
    if (!initialValues) return
    if (lookupTimeoutRef.current) clearTimeout(lookupTimeoutRef.current)
    lookupRequestRef.current += 1
    setBarcodeChecking(false)
    setFieldsLocked(false)
    setBarcodeError('')
    setExistingProductUid('')
    setErrors({})
    setValues({ ...initialValues })
  }

  async function handleSubmit() {
    if (fieldsLocked || barcodeChecking) return

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

  if (notFound || !initialValues) {
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
        {barcodeError ? (
          <p className="login-form-error products-barcode-conflict" role="alert">
            {barcodeError}
            {existingProductUid ? (
              <>
                {' '}
                <Link href={`${PRODUCTS_PATH}/${existingProductUid}`} className="products-barcode-conflict-link">
                  {p.errors.viewExistingProduct}
                </Link>
              </>
            ) : null}
          </p>
        ) : null}

        <ProductForm
          entityUid={productId}
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          onReset={handleReset}
          submitting={submitting}
          submitDisabled={!hasChanges}
          resetDisabled={!hasChanges && !fieldsLocked && !barcodeError}
          errors={errors}
          enableBarcodeInput
          barcodeIntro={p.editIntro}
          onBarcodeChange={handleBarcodeChange}
          barcodeChecking={barcodeChecking}
          fieldsLocked={fieldsLocked}
        />
      </section>
    </div>
  )
}
