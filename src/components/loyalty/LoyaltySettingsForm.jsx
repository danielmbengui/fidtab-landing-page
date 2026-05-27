'use client'

import { ClassCountry } from '@/classes/ClassCountry'
import { ClassSettings } from '@/classes/ClassSettings'
import ProhibitedProductsPicker from '@/components/loyalty/ProhibitedProductsPicker'
import { useLanguage } from '@/context/LanguageProvider'

function Field({ label, hint, error, htmlFor, children }) {
  return (
    <label className="login-field products-field loyalty-field" htmlFor={htmlFor}>
      <span>{label}</span>
      {children}
      {error ? <span className="login-field-error">{error}</span> : null}
      {hint ? <span className="loyalty-field-hint">{hint}</span> : null}
    </label>
  )
}

export default function LoyaltySettingsForm({
  values,
  onChange,
  onSubmit,
  onReset,
  submitting = false,
  submitDisabled = false,
  canReset = false,
  errors = {},
  feedback = '',
  formError = '',
}) {
  const { content: c, t } = useLanguage()
  const l = c.loyalty
  const f = l.fields
  const currencies = ClassCountry.CURRENCIES

  function handleChange(field, nextValue) {
    onChange({ ...values, [field]: nextValue })
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit?.()
  }

  const earnSummary = t(l.summaryEarn, {
    min: values.min_amount_to_earn_one_point || '—',
    max: values.max_amount_to_earn_one_point || '—',
    currency: values.currency_to_earn_one_point || ClassSettings.DEFAULT_CURRENCY,
  })

  const useSummary = t(l.summaryUse, {
    amount: values.amount_to_use_one_point || '—',
    currency: values.currency_to_earn_one_point || ClassSettings.DEFAULT_CURRENCY,
  })

  return (
    <form className="products-form loyalty-form" onSubmit={handleSubmit} noValidate>
      <section className="dashboard-card loyalty-card">
        <h2 className="dashboard-card-title">{l.sections.settings}</h2>
        <p className="loyalty-section-intro">{l.settingsIntro}</p>

        <div className="loyalty-summary-grid">
          <p className="loyalty-summary-item">{earnSummary}</p>
          <p className="loyalty-summary-item">{useSummary}</p>
        </div>

        <div className="products-form-grid">
          <Field
            label={f.minAmountToEarn}
            htmlFor="loyalty-min-earn"
            hint={f.minAmountToEarnHint}
            error={errors.min_amount_to_earn_one_point}
          >
            <input
              id="loyalty-min-earn"
              type="number"
              min="0"
              step="0.01"
              value={values.min_amount_to_earn_one_point}
              onChange={(e) => handleChange('min_amount_to_earn_one_point', e.target.value)}
              disabled={submitting}
            />
          </Field>

          <Field
            label={f.maxAmountToEarn}
            htmlFor="loyalty-max-earn"
            hint={f.maxAmountToEarnHint}
            error={errors.max_amount_to_earn_one_point}
          >
            <input
              id="loyalty-max-earn"
              type="number"
              min="0"
              step="0.01"
              value={values.max_amount_to_earn_one_point}
              onChange={(e) => handleChange('max_amount_to_earn_one_point', e.target.value)}
              disabled={submitting}
            />
          </Field>

          <Field
            label={f.amountToUse}
            htmlFor="loyalty-use"
            hint={f.amountToUseHint}
            error={errors.amount_to_use_one_point}
          >
            <input
              id="loyalty-use"
              type="number"
              min="0"
              step="0.01"
              value={values.amount_to_use_one_point}
              onChange={(e) => handleChange('amount_to_use_one_point', e.target.value)}
              disabled={submitting}
            />
          </Field>

          <Field
            label={f.currency}
            htmlFor="loyalty-currency"
            error={errors.currency_to_earn_one_point}
          >
            <select
              id="loyalty-currency"
              value={values.currency_to_earn_one_point}
              onChange={(e) => handleChange('currency_to_earn_one_point', e.target.value)}
              disabled={submitting}
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className="dashboard-card loyalty-card">
        <h2 className="dashboard-card-title">{l.sections.prohibited}</h2>
        <p className="loyalty-section-intro">{l.prohibitedIntro}</p>
        <ProhibitedProductsPicker
          selectedUids={values.uids_products_prohibited_from_earning_points}
          onChange={(uids) => handleChange('uids_products_prohibited_from_earning_points', uids)}
          disabled={submitting}
        />
      </section>

      {formError ? <p className="login-form-error">{formError}</p> : null}
      {feedback ? <p className="loyalty-feedback-success">{feedback}</p> : null}

      <div className="products-form-actions loyalty-form-actions">
        <button type="submit" className="btn-primary" disabled={submitting || submitDisabled}>
          {submitting ? l.saving : l.save}
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={onReset}
          disabled={submitting || !canReset}
        >
          {l.reset}
        </button>
      </div>
    </form>
  )
}
