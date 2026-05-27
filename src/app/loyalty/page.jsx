'use client'

import { useEffect, useMemo, useState } from 'react'
import LoyaltySettingsForm from '@/components/loyalty/LoyaltySettingsForm'
import { ClassSettings } from '@/classes/ClassSettings'
import { useLanguage } from '@/context/LanguageProvider'
import { useFidTabSettings } from '@/hooks/useFidTabSettings'
import {
  formValuesToSettings,
  getDefaultLoyaltyFormValues,
  hasLoyaltyFormChanges,
  settingsToFormValues,
  validateLoyaltyForm,
} from '@/lib/loyaltySettingsForm'
import { WEBSITE_NAME } from '@/context/constants/constants_app'

export default function LoyaltyPage() {
  const { content: c } = useLanguage()
  const l = c.loyalty
  const { settings, loading } = useFidTabSettings()
  const [values, setValues] = useState(getDefaultLoyaltyFormValues)
  const [initialValues, setInitialValues] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${l.metaTitle}`
  }, [l.metaTitle])

  useEffect(() => {
    if (loading) return
    const formValues = settings
      ? settingsToFormValues(settings)
      : getDefaultLoyaltyFormValues()
    setValues(formValues)
    setInitialValues(formValues)
  }, [settings, loading])

  const hasChanges = useMemo(
    () => hasLoyaltyFormChanges(values, initialValues),
    [values, initialValues],
  )

  function handleReset() {
    if (!initialValues) return
    setValues(initialValues)
    setErrors({})
    setFeedback('')
    setFormError('')
  }

  async function handleSubmit() {
    const nextErrors = validateLoyaltyForm(values, l.errors)
    setErrors(nextErrors)
    setFeedback('')
    setFormError('')
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      const instance = formValuesToSettings(values, {
        uid: settings?.uid || ClassSettings.DEFAULT_UID,
      })

      const saved = settings?.uid
        ? await instance.updateFirestore()
        : await instance.createFirestore()

      if (!saved) {
        setFormError(l.errors.saveFailed)
        return
      }

      const snapshot = settingsToFormValues(saved)
      setValues(snapshot)
      setInitialValues(snapshot)
      setFeedback(l.success)
    } catch (error) {
      console.error('LoyaltyPage', error)
      setFormError(l.errors.saveFailed)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !initialValues) {
    return (
      <div className="dashboard-page loyalty-page">
        <header className="dashboard-page-header">
          <h1 className="dashboard-page-title">{l.title}</h1>
        </header>
        <p className="products-empty">{l.loading}</p>
      </div>
    )
  }

  return (
    <div className="dashboard-page loyalty-page">
      <header className="dashboard-page-header">
        <h1 className="dashboard-page-title">{l.title}</h1>
        <p className="dashboard-page-sub">{l.subtitle}</p>
      </header>

      <LoyaltySettingsForm
        values={values}
        onChange={(nextValues) => {
          setValues(nextValues)
          setFeedback('')
          setFormError('')
        }}
        onSubmit={handleSubmit}
        onReset={handleReset}
        submitting={submitting}
        submitDisabled={!hasChanges}
        canReset={hasChanges}
        errors={errors}
        feedback={feedback}
        formError={formError}
      />
    </div>
  )
}
