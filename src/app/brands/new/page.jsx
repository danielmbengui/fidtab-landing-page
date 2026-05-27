'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { doc } from 'firebase/firestore'
import BrandForm from '@/components/brands/BrandForm'
import { useAuth } from '@/context/AuthProvider'
import { useLanguage } from '@/context/LanguageProvider'
import {
  formValuesToBrand,
  getDefaultBrandFormValues,
  hasBrandFormChanges,
} from '@/lib/brandForm'
import { createBrandInstance, getBrandColRef, resolveBrandWriteCompany } from '@/lib/brandRepository'
import { BRANDS_PATH, WEBSITE_NAME } from '@/context/constants/constants_app'

function validateForm(values, b) {
  const errors = {}
  if (!String(values.name ?? '').trim()) {
    errors.name = b.errors.requiredName
  }
  return errors
}

export default function NewBrandPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { content: c } = useLanguage()
  const b = c.brands
  const uidCompany = user?.uid_company || 'system'
  const writeCompany = resolveBrandWriteCompany(uidCompany, '')
  const [draftUid] = useState(() => doc(getBrandColRef(writeCompany)).id)
  const [values, setValues] = useState(() => getDefaultBrandFormValues(draftUid, uidCompany))
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const initialValues = useMemo(
    () => getDefaultBrandFormValues(draftUid, uidCompany),
    [draftUid, uidCompany],
  )
  const hasChanges = useMemo(
    () => hasBrandFormChanges(values, initialValues),
    [values, initialValues],
  )

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${b.createTitle}`
  }, [b.createTitle])

  async function handleSubmit() {
    const nextErrors = validateForm(values, b)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const brand = formValuesToBrand(values, {
        uid: draftUid,
        uidCompany,
      })
      const saved = await createBrandInstance(brand, uidCompany)
      if (!saved?.uid) {
        setErrors({ form: b.errors.saveFailed })
        return
      }
      router.push(`${BRANDS_PATH}/${saved.uid}`)
    } catch (error) {
      console.error('NewBrandPage', error)
      setErrors({ form: b.errors.saveFailed })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dashboard-page products-page">
      <header className="dashboard-page-header">
        <Link href={BRANDS_PATH} className="products-back-link">
          ← {b.backToList}
        </Link>
        <h1 className="dashboard-page-title">{b.createTitle}</h1>
      </header>

      <section className="dashboard-card">
        <BrandForm
          entityUid={draftUid}
          uidCompany={writeCompany}
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitDisabled={!hasChanges}
          errors={errors}
          submitLabel={b.save}
        />
      </section>
    </div>
  )
}
