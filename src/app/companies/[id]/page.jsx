'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import CompanyForm from '@/components/companies/CompanyForm'
import { ClassCompany } from '@/classes/ClassCompany'
import { useLanguage } from '@/context/LanguageProvider'
import { companyToFormValues } from '@/lib/companyForm'
import { COMPANIES_PATH, WEBSITE_NAME } from '@/context/constants/constants_app'

export default function ViewCompanyPage() {
  const params = useParams()
  const companyId = String(params?.id ?? '')
  const { content: c } = useLanguage()
  const co = c.companies
  const [values, setValues] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${co.viewTitle}`
  }, [co.viewTitle])

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
          setValues(null)
        } else {
          setNotFound(false)
          setValues(companyToFormValues(company))
        }
      } catch (error) {
        console.error('ViewCompanyPage', error)
        if (active) {
          setNotFound(true)
          setValues(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadCompany()
    return () => {
      active = false
    }
  }, [companyId])

  if (loading) {
    return (
      <div className="dashboard-page products-page">
        <p className="products-empty">{co.loading}</p>
      </div>
    )
  }

  if (notFound || !values) {
    return (
      <div className="dashboard-page products-page">
        <header className="dashboard-page-header">
          <Link href={COMPANIES_PATH} className="products-back-link">
            ← {co.backToList}
          </Link>
          <h1 className="dashboard-page-title">{co.viewTitle}</h1>
        </header>
        <section className="dashboard-card">
          <p className="products-empty">{co.errors.notFound}</p>
        </section>
      </div>
    )
  }

  return (
    <div className="dashboard-page products-page">
      <header className="dashboard-page-header products-page-header">
        <div>
          <Link href={COMPANIES_PATH} className="products-back-link">
            ← {co.backToList}
          </Link>
          <h1 className="dashboard-page-title">{values.name || co.viewTitle}</h1>
        </div>
        <Link href={`${COMPANIES_PATH}/${companyId}/edit`} className="btn-primary products-create-btn">
          {co.actions.edit}
        </Link>
      </header>

      <section className="dashboard-card">
        <CompanyForm
          entityUid={companyId}
          values={values}
          onChange={setValues}
          readOnly
        />
      </section>
    </div>
  )
}
