'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import BrandForm from '@/components/brands/BrandForm'
import { useAuth } from '@/context/AuthProvider'
import { useLanguage } from '@/context/LanguageProvider'
import { brandToFormValues } from '@/lib/brandForm'
import { getBrandFromFirestore, resolveBrandWriteCompany } from '@/lib/brandRepository'
import { BRANDS_PATH, WEBSITE_NAME } from '@/context/constants/constants_app'

export default function ViewBrandPage() {
  const params = useParams()
  const brandId = String(params?.id ?? '')
  const { user } = useAuth()
  const { content: c } = useLanguage()
  const b = c.brands
  const uidCompany = user?.uid_company || 'system'
  const [brandUidCompany, setBrandUidCompany] = useState('')
  const writeCompany = resolveBrandWriteCompany(uidCompany, brandUidCompany)
  const [values, setValues] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  console.log('uidCompany', uidCompany)

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${b.viewTitle}`
  }, [b.viewTitle])

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
          setValues(null)
        } else {
          setBrandUidCompany(brand.uid_company || '')
          setNotFound(false)
          setValues(brandToFormValues(brand, uidCompany, brand.uid_company || ''))
        }
      } catch (error) {
        console.error('ViewBrandPage', error)
        if (active) {
          setNotFound(true)
          setValues(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadBrand()
    return () => {
      active = false
    }
  }, [brandId, uidCompany])

  if (loading) {
    return (
      <div className="dashboard-page products-page">
        <p className="products-empty">{b.loading}</p>
      </div>
    )
  }

  if (notFound || !values) {
    return (
      <div className="dashboard-page products-page">
        <header className="dashboard-page-header">
          <Link href={BRANDS_PATH} className="products-back-link">
            ← {b.backToList}
          </Link>
          <h1 className="dashboard-page-title">{b.viewTitle}</h1>
        </header>
        <section className="dashboard-card">
          <p className="products-empty">{b.errors.notFound}</p>
        </section>
      </div>
    )
  }

  return (
    <div className="dashboard-page products-page">
      <header className="dashboard-page-header products-page-header">
        <div>
          <Link href={BRANDS_PATH} className="products-back-link">
            ← {b.backToList}
          </Link>
          <h1 className="dashboard-page-title">{values.name || b.viewTitle}</h1>
        </div>
        <Link href={`${BRANDS_PATH}/${brandId}/edit`} className="btn-primary products-create-btn">
          {b.actions.edit}
        </Link>
      </header>

      <section className="dashboard-card">
        <BrandForm
          entityUid={brandId}
          uidCompany={writeCompany}
          values={values}
          onChange={setValues}
          readOnly
        />
      </section>
    </div>
  )
}
