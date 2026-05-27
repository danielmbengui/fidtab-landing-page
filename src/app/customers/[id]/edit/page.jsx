'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import CustomerForm from '@/components/customers/CustomerForm'
import { ClassUser } from '@/classes/ClassUser'
import { useLanguage } from '@/context/LanguageProvider'
import {
  customerToFormValues,
  formValuesToCustomer,
  getDefaultCustomerFormValues,
  hasCustomerFormChanges,
} from '@/lib/customerForm'
import { CUSTOMERS_PATH, WEBSITE_NAME } from '@/context/constants/constants_app'

function validateForm(values, cu) {
  const errors = {}
  if (!String(values.display_name ?? '').trim() && !String(values.email ?? '').trim()) {
    errors.display_name = cu.errors.requiredIdentity
  }
  return errors
}

export default function EditCustomerPage() {
  const params = useParams()
  const router = useRouter()
  const customerId = String(params?.id ?? '')
  const { content: c } = useLanguage()
  const cu = c.customers
  const [values, setValues] = useState(getDefaultCustomerFormValues)
  const [initialValues, setInitialValues] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${cu.editTitle}`
  }, [cu.editTitle])

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
        } else {
          const formValues = customerToFormValues(customer)
          setNotFound(false)
          setValues(formValues)
          setInitialValues(formValues)
        }
      } catch (error) {
        console.error('EditCustomerPage', error)
        if (active) setNotFound(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadCustomer()
    return () => {
      active = false
    }
  }, [customerId])

  const hasChanges = useMemo(
    () => hasCustomerFormChanges(values, initialValues),
    [values, initialValues],
  )

  async function handleSubmit() {
    const nextErrors = validateForm(values, cu)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const customer = formValuesToCustomer(values, { uid: customerId })
      const saved = await customer.updateFirestore()
      if (!saved) {
        setErrors({ form: cu.errors.saveFailed })
        return
      }
      router.push(`${CUSTOMERS_PATH}/${customerId}`)
    } catch (error) {
      console.error('EditCustomerPage', error)
      setErrors({ form: cu.errors.saveFailed })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page products-page">
        <p className="products-empty">{cu.loading}</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="dashboard-page products-page">
        <header className="dashboard-page-header">
          <Link href={CUSTOMERS_PATH} className="products-back-link">
            ← {cu.backToList}
          </Link>
          <h1 className="dashboard-page-title">{cu.editTitle}</h1>
        </header>
        <section className="dashboard-card">
          <p className="products-empty">{cu.errors.notFound}</p>
        </section>
      </div>
    )
  }

  return (
    <div className="dashboard-page products-page">
      <header className="dashboard-page-header">
        <Link href={`${CUSTOMERS_PATH}/${customerId}`} className="products-back-link">
          ← {cu.backToView}
        </Link>
        <h1 className="dashboard-page-title">{cu.editTitle}</h1>
        {values.display_name ? (
          <p className="dashboard-page-sub">{values.display_name}</p>
        ) : null}
      </header>

      <section className="dashboard-card">
        {errors.form ? <p className="login-form-error">{errors.form}</p> : null}
        <CustomerForm
          entityUid={customerId}
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
