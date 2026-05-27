'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { doc } from 'firebase/firestore'
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

export default function NewProductPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { content: c, t } = useLanguage()
  const p = c.products
  const [draftUid] = useState(() => doc(ClassProduct.colRef()).id)
  const [values, setValues] = useState(getDefaultProductFormValues)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [fieldsLocked, setFieldsLocked] = useState(false)
  const [barcodeChecking, setBarcodeChecking] = useState(false)
  const [barcodeError, setBarcodeError] = useState('')
  const [existingProductUid, setExistingProductUid] = useState('')
  const lookupTimeoutRef = useRef(null)
  const lookupRequestRef = useRef(0)
  const initialValues = useMemo(() => getDefaultProductFormValues(), [])
  const hasChanges = useMemo(
    () => hasProductFormChanges(values, initialValues),
    [values, initialValues],
  )

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${p.createTitle}`
  }, [p.createTitle])

  useEffect(() => () => {
    if (lookupTimeoutRef.current) clearTimeout(lookupTimeoutRef.current)
  }, [])

  const runBarcodeLookup = useCallback(async (normalized) => {
    const requestId = lookupRequestRef.current + 1
    lookupRequestRef.current = requestId
    setBarcodeChecking(true)
    setBarcodeError('')
    setExistingProductUid('')
    setFieldsLocked(false)

    try {
      const existing = await findProductByBarCode(normalized, user?.uid_company)
      if (lookupRequestRef.current !== requestId) return

      if (existing?.uid) {
        setValues(productToFormValues(existing))
        setFieldsLocked(true)
        setExistingProductUid(existing.uid)
        setBarcodeError(t(p.errors.barCodeExists, {
          name: existing.name || existing.uid,
          uid: existing.uid,
        }))
        return
      }

      setValues({ ...getDefaultProductFormValues(), bar_code_number: normalized })
    } catch (error) {
      console.error('NewProductPage.barcodeLookup', error)
      if (lookupRequestRef.current === requestId) {
        setValues({ ...getDefaultProductFormValues(), bar_code_number: normalized })
      }
    } finally {
      if (lookupRequestRef.current === requestId) {
        setBarcodeChecking(false)
      }
    }
  }, [p.errors.barCodeExists, t, user?.uid_company])

  const handleBarcodeChange = useCallback((barCode) => {
    const normalized = String(barCode ?? '').trim()
    setErrors({})
    setBarcodeError('')
    setExistingProductUid('')
    setFieldsLocked(false)
    setValues({ ...getDefaultProductFormValues(), bar_code_number: barCode })

    if (lookupTimeoutRef.current) clearTimeout(lookupTimeoutRef.current)

    if (!normalized) {
      lookupRequestRef.current += 1
      setBarcodeChecking(false)
      return
    }

    lookupTimeoutRef.current = setTimeout(() => {
      void runBarcodeLookup(normalized)
    }, 450)
  }, [runBarcodeLookup])

  async function handleSubmit() {
    if (fieldsLocked || barcodeChecking) return

    const nextErrors = validateForm(values, p)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const product = formValuesToProduct(values, {
        uid: draftUid,
        uidCompany: user?.uid_company || 'system',
      })
      const saved = await product.createFirestore()
      if (!saved?.uid) {
        setErrors({ form: p.errors.saveFailed })
        return
      }
      router.push(`${PRODUCTS_PATH}/${saved.uid}`)
    } catch (error) {
      console.error('NewProductPage', error)
      setErrors({ form: p.errors.saveFailed })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dashboard-page products-page">
      <header className="dashboard-page-header">
        <Link href={PRODUCTS_PATH} className="products-back-link">
          ← {p.backToList}
        </Link>
        <h1 className="dashboard-page-title">{p.createTitle}</h1>
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
          entityUid={draftUid}
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitDisabled={!hasChanges}
          errors={errors}
          submitLabel={p.save}
          enableBarcodeInput
          onBarcodeChange={handleBarcodeChange}
          barcodeChecking={barcodeChecking}
          fieldsLocked={fieldsLocked}
        />
      </section>
    </div>
  )
}
