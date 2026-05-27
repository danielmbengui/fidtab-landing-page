'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { doc } from 'firebase/firestore'
import CustomerForm from '@/components/customers/CustomerForm'
import { ClassUser } from '@/classes/ClassUser'
import { useAuth } from '@/context/AuthProvider'
import { useLanguage } from '@/context/LanguageProvider'
import {
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

export default function NewCustomerPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { content: c } = useLanguage()
  const cu = c.customers
  const uidCompany = user?.uid_company || 'system'
  const [draftUid] = useState(() => doc(ClassUser.colRef()).id)
  const [values, setValues] = useState(() => ({
    ...getDefaultCustomerFormValues(),
    uid_company: uidCompany !== 'system' ? uidCompany : '',
  }))
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const initialValues = useMemo(
    () => ({
      ...getDefaultCustomerFormValues(),
      uid_company: uidCompany !== 'system' ? uidCompany : '',
    }),
    [uidCompany],
  )
  const hasChanges = useMemo(
    () => hasCustomerFormChanges(values, initialValues),
    [values, initialValues],
  )

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${cu.createTitle}`
  }, [cu.createTitle])

  async function handleSubmit() {
    const nextErrors = validateForm(values, cu)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const customer = formValuesToCustomer(values, { uid: draftUid, uidCompany })
      const saved = await customer.createFirestore()
      if (!saved?.uid) {
        setErrors({ form: cu.errors.saveFailed })
        return
      }
      router.push(`${CUSTOMERS_PATH}/${saved.uid}`)
    } catch (error) {
      console.error('NewCustomerPage', error)
      setErrors({ form: cu.errors.saveFailed })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dashboard-page products-page">
      <header className="dashboard-page-header">
        <Link href={CUSTOMERS_PATH} className="products-back-link">
          ← {cu.backToList}
        </Link>
        <h1 className="dashboard-page-title">{cu.createTitle}</h1>
      </header>

      <section className="dashboard-card">
        {errors.form ? <p className="login-form-error">{errors.form}</p> : null}
        <CustomerForm
          entityUid={draftUid}
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitDisabled={!hasChanges}
          errors={errors}
          submitLabel={cu.save}
        />
      </section>
    </div>
  )
}
