'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import CompanyForm from '@/components/companies/CompanyForm'
import { ClassCompany } from '@/classes/ClassCompany'
import { useLanguage } from '@/context/LanguageProvider'
import {
  companyToFormValues,
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

export default function EditCompanyPage() {
  const params = useParams()
  const router = useRouter()
  const companyId = String(params?.id ?? '')
  const { content: c } = useLanguage()
  const co = c.companies
  const [values, setValues] = useState(() => getDefaultCompanyFormValues())
  const [initialValues, setInitialValues] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${co.editTitle}`
  }, [co.editTitle])

  useEffect(() => {
    let active = true

    async function loadCompany() {
      if (!companyId) {
        if (active) {
          setNotFound(true)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      try {
        const company = await ClassCompany.getFirestore(companyId)
        if (!active) return
        if (!company) {
          setNotFound(true)
        } else {
          const formValues = companyToFormValues(company)
          setNotFound(false)
          setValues(formValues)
          setInitialValues(formValues)
        }
      } catch (error) {
        console.error('EditCompanyPage', error)
        if (active) setNotFound(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadCompany()
    return () => {
      active = false
    }
  }, [companyId])

  const hasChanges = useMemo(
    () => hasCompanyFormChanges(values, initialValues),
    [values, initialValues],
  )

  async function handleSubmit() {
    const nextErrors = validateForm(values, co)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const company = formValuesToCompany(values, { uid: companyId })
      const saved = await company.updateFirestore()
      if (!saved) {
        setErrors({ form: co.errors.saveFailed })
        return
      }
      router.push(`${COMPANIES_PATH}/${companyId}`)
    } catch (error) {
      console.error('EditCompanyPage', error)
      setErrors({ form: co.errors.saveFailed })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page products-page">
        <p className="products-empty">{co.loading}</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="dashboard-page products-page">
        <header className="dashboard-page-header">
          <Link href={COMPANIES_PATH} className="products-back-link">
            ← {co.backToList}
          </Link>
          <h1 className="dashboard-page-title">{co.editTitle}</h1>
        </header>
        <section className="dashboard-card">
          <p className="products-empty">{co.errors.notFound}</p>
        </section>
      </div>
    )
  }

  return (
    <div className="dashboard-page products-page">
      <header className="dashboard-page-header">
        <Link href={`${COMPANIES_PATH}/${companyId}`} className="products-back-link">
          ← {co.backToView}
        </Link>
        <h1 className="dashboard-page-title">{co.editTitle}</h1>
        {values.name ? (
          <p className="dashboard-page-sub">{values.name}</p>
        ) : null}
      </header>

      <section className="dashboard-card">
        {errors.form ? <p className="login-form-error">{errors.form}</p> : null}
        <CompanyForm
          entityUid={companyId}
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
