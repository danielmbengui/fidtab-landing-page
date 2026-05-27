'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { doc } from 'firebase/firestore'
import CompanyForm from '@/components/companies/CompanyForm'
import { ClassCompany } from '@/classes/ClassCompany'
import { useLanguage } from '@/context/LanguageProvider'
import {
  formValuesToCompany,
  getDefaultCompanyFormValues,
  hasCompanyFormChanges,
} from '@/lib/companyForm'
import { COMPANIES_PATH, WEBSITE_NAME } from '@/context/constants/constants_app'

function validateForm(values, co) {
  const errors = {}
  if (!String(values.name ?? '').trim()) {
    errors.name = co.errors.requiredName
  }
  return errors
}

export default function NewCompanyPage() {
  const router = useRouter()
  const { content: c } = useLanguage()
  const co = c.companies
  const [draftUid] = useState(() => doc(ClassCompany.colRef()).id)
  const [values, setValues] = useState(() => getDefaultCompanyFormValues(draftUid))
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const initialValues = useMemo(() => getDefaultCompanyFormValues(draftUid), [draftUid])
  const hasChanges = useMemo(
    () => hasCompanyFormChanges(values, initialValues),
    [values, initialValues],
  )

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${co.createTitle}`
  }, [co.createTitle])

  async function handleSubmit() {
    const nextErrors = validateForm(values, co)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const company = formValuesToCompany(values, { uid: draftUid })
      const saved = await company.createFirestore()
      if (!saved?.uid) {
        setErrors({ form: co.errors.saveFailed })
        return
      }
      router.push(`${COMPANIES_PATH}/${saved.uid}`)
    } catch (error) {
      console.error('NewCompanyPage', error)
      setErrors({ form: co.errors.saveFailed })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dashboard-page products-page">
      <header className="dashboard-page-header">
        <Link href={COMPANIES_PATH} className="products-back-link">
          ← {co.backToList}
        </Link>
        <h1 className="dashboard-page-title">{co.createTitle}</h1>
      </header>

      <section className="dashboard-card">
        {errors.form ? <p className="login-form-error">{errors.form}</p> : null}
        <CompanyForm
          entityUid={draftUid}
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitDisabled={!hasChanges}
          errors={errors}
          submitLabel={co.save}
        />
      </section>
    </div>
  )
}
