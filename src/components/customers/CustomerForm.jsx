'use client'

import { useLanguage } from '@/context/LanguageProvider'
import {
  getCustomerGenderOptions,
  getCustomerLoyaltyTierOptions,
  getCustomerStatusOptions,
} from '@/lib/customerForm'

function Field({ label, htmlFor, error, children }) {
  return (
    <label className="login-field products-field" htmlFor={htmlFor}>
      <span>{label}</span>
      {children}
      {error ? <span className="login-field-error">{error}</span> : null}
    </label>
  )
}

function ReadOnlyValue({ value }) {
  const { content: c } = useLanguage()
  const empty = c.dashboard.empty
  const display = value === '' || value === null || value === undefined ? empty : String(value)
  return <p className="products-readonly">{display}</p>
}

export default function CustomerForm({
  values,
  onChange,
  onSubmit,
  entityUid = '',
  readOnly = false,
  submitting = false,
  submitDisabled = false,
  submitLabel,
  errors = {},
}) {
  const { content: c } = useLanguage()
  const cu = c.customers
  const f = cu.fields
  const statuses = getCustomerStatusOptions()
  const genders = getCustomerGenderOptions()
  const loyaltyTiers = getCustomerLoyaltyTierOptions()

  function handleChange(field, nextValue) {
    onChange({ ...values, [field]: nextValue })
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!readOnly && onSubmit) onSubmit()
  }

  return (
    <form className="products-form" onSubmit={handleSubmit} noValidate>
      {entityUid ? (
        <Field label={f.fidtabId} htmlFor="customer-fidtab-id">
          <ReadOnlyValue value={entityUid} />
        </Field>
      ) : null}

      <div className="products-form-grid">
        <Field label={f.displayName} htmlFor="customer-name" error={errors.display_name}>
          {readOnly ? (
            <ReadOnlyValue value={values.display_name} />
          ) : (
            <input
              id="customer-name"
              type="text"
              value={values.display_name}
              onChange={(e) => handleChange('display_name', e.target.value)}
              disabled={submitting}
              autoComplete="off"
            />
          )}
        </Field>

        <Field label={f.email} htmlFor="customer-email" error={errors.email}>
          {readOnly ? (
            <ReadOnlyValue value={values.email} />
          ) : (
            <input
              id="customer-email"
              type="email"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={submitting}
              autoComplete="off"
            />
          )}
        </Field>

        <Field label={f.phone} htmlFor="customer-phone" error={errors.phone_number}>
          {readOnly ? (
            <ReadOnlyValue value={values.phone_number} />
          ) : (
            <input
              id="customer-phone"
              type="tel"
              value={values.phone_number}
              onChange={(e) => handleChange('phone_number', e.target.value)}
              disabled={submitting}
              autoComplete="off"
            />
          )}
        </Field>

        <Field label={f.uidCompany} htmlFor="customer-company" error={errors.uid_company}>
          {readOnly ? (
            <ReadOnlyValue value={values.uid_company} />
          ) : (
            <input
              id="customer-company"
              type="text"
              value={values.uid_company}
              onChange={(e) => handleChange('uid_company', e.target.value)}
              disabled={submitting}
              autoComplete="off"
            />
          )}
        </Field>

        <Field label={f.status} htmlFor="customer-status" error={errors.status}>
          {readOnly ? (
            <ReadOnlyValue value={cu.statuses[values.status] ?? values.status} />
          ) : (
            <select
              id="customer-status"
              value={values.status}
              onChange={(e) => handleChange('status', e.target.value)}
              disabled={submitting}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {cu.statuses[status] ?? status}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label={f.gender} htmlFor="customer-gender" error={errors.gender}>
          {readOnly ? (
            <ReadOnlyValue value={cu.genders[values.gender] ?? values.gender} />
          ) : (
            <select
              id="customer-gender"
              value={values.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              disabled={submitting}
            >
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {cu.genders[gender] ?? gender}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label={f.countryCode} htmlFor="customer-country" error={errors.country_code}>
          {readOnly ? (
            <ReadOnlyValue value={values.country_code} />
          ) : (
            <input
              id="customer-country"
              type="text"
              value={values.country_code}
              onChange={(e) => handleChange('country_code', e.target.value.toUpperCase())}
              disabled={submitting}
              autoComplete="off"
              maxLength={2}
            />
          )}
        </Field>

        <Field label={f.loyaltyPoints} htmlFor="customer-points" error={errors.loyalty_points}>
          {readOnly ? (
            <ReadOnlyValue value={values.loyalty_points} />
          ) : (
            <input
              id="customer-points"
              type="number"
              min="0"
              step="1"
              value={values.loyalty_points}
              onChange={(e) => handleChange('loyalty_points', e.target.value)}
              disabled={submitting}
            />
          )}
        </Field>

        <Field label={f.loyaltyAmount} htmlFor="customer-amount" error={errors.loyalty_amount}>
          {readOnly ? (
            <ReadOnlyValue value={values.loyalty_amount} />
          ) : (
            <input
              id="customer-amount"
              type="number"
              min="0"
              step="0.01"
              value={values.loyalty_amount}
              onChange={(e) => handleChange('loyalty_amount', e.target.value)}
              disabled={submitting}
            />
          )}
        </Field>

        <Field label={f.loyaltyTier} htmlFor="customer-tier" error={errors.loyalty_tier}>
          {readOnly ? (
            <ReadOnlyValue value={cu.loyaltyTiers[values.loyalty_tier] ?? values.loyalty_tier} />
          ) : (
            <select
              id="customer-tier"
              value={values.loyalty_tier}
              onChange={(e) => handleChange('loyalty_tier', e.target.value)}
              disabled={submitting}
            >
              {loyaltyTiers.map((tier) => (
                <option key={tier} value={tier}>
                  {cu.loyaltyTiers[tier] ?? tier}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      {!readOnly ? (
        <div className="products-form-actions">
          <button type="submit" className="btn-primary" disabled={submitting || submitDisabled}>
            {submitting ? cu.saving : (submitLabel || cu.save)}
          </button>
        </div>
      ) : null}
    </form>
  )
}
