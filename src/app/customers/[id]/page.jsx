'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import CustomerForm from '@/components/customers/CustomerForm'
import { ClassUser } from '@/classes/ClassUser'
import { useLanguage } from '@/context/LanguageProvider'
import { customerToFormValues, formatCustomerDisplayName } from '@/lib/customerForm'
import { CUSTOMERS_PATH, WEBSITE_NAME } from '@/context/constants/constants_app'

export default function ViewCustomerPage() {
  const params = useParams()
  const customerId = String(params?.id ?? '')
  const { content: c } = useLanguage()
  const cu = c.customers
  const [values, setValues] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${cu.viewTitle}`
  }, [cu.viewTitle])

  useEffect(() => {
    let active = true

    async function loadCustomer() {
      if (!customerId) {
        if (active) {
          setNotFound(true)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      try {
        const customer = await ClassUser.getFirestore(customerId)
        if (!active) return
        if (!customer || customer.role !== ClassUser.ROLE.CUSTOMER) {
          setNotFound(true)
          setValues(null)
        } else {
          setNotFound(false)
          setValues(customerToFormValues(customer))
        }
      } catch (error) {
        console.error('ViewCustomerPage', error)
        if (active) {
          setNotFound(true)
          setValues(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadCustomer()
    return () => {
      active = false
    }
  }, [customerId])

  if (loading) {
    return (
      <div className="dashboard-page products-page">
        <p className="products-empty">{cu.loading}</p>
      </div>
    )
  }

  if (notFound || !values) {
    return (
      <div className="dashboard-page products-page">
        <header className="dashboard-page-header">
          <Link href={CUSTOMERS_PATH} className="products-back-link">
            ← {cu.backToList}
          </Link>
          <h1 className="dashboard-page-title">{cu.viewTitle}</h1>
        </header>
        <section className="dashboard-card">
          <p className="products-empty">{cu.errors.notFound}</p>
        </section>
      </div>
    )
  }

  return (
    <div className="dashboard-page products-page">
      <header className="dashboard-page-header products-page-header">
        <div>
          <Link href={CUSTOMERS_PATH} className="products-back-link">
            ← {cu.backToList}
          </Link>
          <h1 className="dashboard-page-title">
            {formatCustomerDisplayName({ display_name: values.display_name, email: values.email }, cu.viewTitle)}
          </h1>
        </div>
        <Link href={`${CUSTOMERS_PATH}/${customerId}/edit`} className="btn-primary products-create-btn">
          {cu.actions.edit}
        </Link>
      </header>

      <section className="dashboard-card">
        <CustomerForm
          entityUid={customerId}
          values={values}
          onChange={setValues}
          readOnly
        />
      </section>
    </div>
  )
}
