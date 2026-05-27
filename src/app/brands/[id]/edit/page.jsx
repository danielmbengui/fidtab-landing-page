'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import BrandForm from '@/components/brands/BrandForm'
import { useAuth } from '@/context/AuthProvider'
import { useLanguage } from '@/context/LanguageProvider'
import {
  brandToFormValues,
  formValuesToBrand,
  getDefaultBrandFormValues,
  hasBrandFormChanges,
} from '@/lib/brandForm'
import { getBrandFromFirestore, resolveBrandWriteCompany, updateBrandInstance } from '@/lib/brandRepository'
import { BRANDS_PATH, WEBSITE_NAME } from '@/context/constants/constants_app'

function validateForm(values, b) {
  const errors = {}
  if (!String(values.name ?? '').trim()) {
    errors.name = b.errors.requiredName
  }
  return errors
}

export default function EditBrandPage() {
  const params = useParams()
  const router = useRouter()
  const brandId = String(params?.id ?? '')
  const { user } = useAuth()
  const { content: c } = useLanguage()
  const b = c.brands
  const uidCompany = user?.uid_company || 'system'
  const [brandUidCompany, setBrandUidCompany] = useState('')
  const writeCompany = resolveBrandWriteCompany(uidCompany, brandUidCompany)
  const [values, setValues] = useState(() => getDefaultBrandFormValues('', uidCompany, brandUidCompany))
  const [initialValues, setInitialValues] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${b.editTitle}`
  }, [b.editTitle])

  useEffect(() => {
    let active = true

    async function loadBrand() {
      if (!brandId) {
        if (active) {
          setNotFound(true)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      try {
        const brand = await getBrandFromFirestore(uidCompany, brandId)
        if (!active) return
        if (!brand) {
          setNotFound(true)
        } else {
          const loadedBrandCompany = brand.uid_company || ''
          const formValues = brandToFormValues(brand, uidCompany, loadedBrandCompany)
          setBrandUidCompany(loadedBrandCompany)
          setNotFound(false)
          setValues(formValues)
          setInitialValues(formValues)
        }
      } catch (error) {
        console.error('EditBrandPage', error)
        if (active) setNotFound(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadBrand()
    return () => {
      active = false
    }
  }, [brandId, uidCompany])

  const hasChanges = useMemo(
    () => hasBrandFormChanges(values, initialValues),
    [values, initialValues],
  )

  async function handleSubmit() {
    const nextErrors = validateForm(values, b)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const brand = formValuesToBrand(values, {
        uid: brandId,
        uidCompany,
        brandUidCompany,
      })
      const saved = await updateBrandInstance(brand, uidCompany, brandUidCompany)
      if (!saved) {
        setErrors({ form: b.errors.saveFailed })
        return
      }
      router.push(`${BRANDS_PATH}/${brandId}`)
    } catch (error) {
      console.error('EditBrandPage', error)
      setErrors({ form: b.errors.saveFailed })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page products-page">
        <p className="products-empty">{b.loading}</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="dashboard-page products-page">
        <header className="dashboard-page-header">
          <Link href={BRANDS_PATH} className="products-back-link">
            ← {b.backToList}
          </Link>
          <h1 className="dashboard-page-title">{b.editTitle}</h1>
        </header>
        <section className="dashboard-card">
          <p className="products-empty">{b.errors.notFound}</p>
        </section>
      </div>
    )
  }

  return (
    <div className="dashboard-page products-page">
      <header className="dashboard-page-header">
        <Link href={`${BRANDS_PATH}/${brandId}`} className="products-back-link">
          ← {b.backToView}
        </Link>
        <h1 className="dashboard-page-title">{b.editTitle}</h1>
        {values.name ? (
          <p className="dashboard-page-sub">{values.name}</p>
        ) : null}
      </header>

      <section className="dashboard-card">
        <BrandForm
          entityUid={brandId}
          uidCompany={writeCompany}
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitDisabled={!hasChanges}
          errors={errors}
        />
      </section>
    </div>
  )
}
