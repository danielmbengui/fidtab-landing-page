'use client'

import StorageImageField from '@/components/common/StorageImageField'
import { useLanguage } from '@/context/LanguageProvider'
import { buildCompanyStoragePath } from '@/lib/companyForm'

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

export default function CompanyForm({
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
  const co = c.companies
  const f = co.fields
  const defaultStoragePath = buildCompanyStoragePath(entityUid)

  function handleChange(field, nextValue) {
    onChange({ ...values, [field]: nextValue })
  }

  function handleLogoChange({ storage_url, photo_url }) {
    onChange({ ...values, storage_url, logo_url: photo_url })
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!readOnly && onSubmit) onSubmit()
  }

  return (
    <form className="products-form" onSubmit={handleSubmit} noValidate>
      <StorageImageField
        label={f.logo}
        storagePath={values.storage_url}
        previewUrl={values.logo_url}
        defaultStoragePath={defaultStoragePath}
        readOnly={readOnly}
        disabled={submitting}
        error={errors.storage_url}
        onChange={handleLogoChange}
      />

      {entityUid ? (
        <Field label={f.fidtabId} htmlFor="company-fidtab-id">
          <ReadOnlyValue value={entityUid} />
        </Field>
      ) : null}

      <div className="products-form-grid">
        <Field label={f.name} htmlFor="company-name" error={errors.name}>
          {readOnly ? (
            <ReadOnlyValue value={values.name} />
          ) : (
            <input
              id="company-name"
              type="text"
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={submitting}
              autoComplete="off"
            />
          )}
        </Field>

        <Field label={f.tag} htmlFor="company-tag" error={errors.tag}>
          {readOnly ? (
            <ReadOnlyValue value={values.tag} />
          ) : (
            <input
              id="company-tag"
              type="text"
              value={values.tag}
              onChange={(e) => handleChange('tag', e.target.value)}
              disabled={submitting}
              autoComplete="off"
            />
          )}
        </Field>

        <Field label={f.emailContact} htmlFor="company-email" error={errors.email_contact}>
          {readOnly ? (
            <ReadOnlyValue value={values.email_contact} />
          ) : (
            <input
              id="company-email"
              type="email"
              value={values.email_contact}
              onChange={(e) => handleChange('email_contact', e.target.value)}
              disabled={submitting}
              autoComplete="off"
            />
          )}
        </Field>

        <Field label={f.phone} htmlFor="company-phone" error={errors.phone}>
          {readOnly ? (
            <ReadOnlyValue value={values.phone} />
          ) : (
            <input
              id="company-phone"
              type="tel"
              value={values.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              disabled={submitting}
              autoComplete="off"
            />
          )}
        </Field>

        <Field label={f.addressStreet} htmlFor="company-street" error={errors.address_street}>
          {readOnly ? (
            <ReadOnlyValue value={values.address_street} />
          ) : (
            <input
              id="company-street"
              type="text"
              value={values.address_street}
              onChange={(e) => handleChange('address_street', e.target.value)}
              disabled={submitting}
              autoComplete="off"
            />
          )}
        </Field>

        <Field label={f.addressZip} htmlFor="company-zip" error={errors.address_zip}>
          {readOnly ? (
            <ReadOnlyValue value={values.address_zip} />
          ) : (
            <input
              id="company-zip"
              type="text"
              value={values.address_zip}
              onChange={(e) => handleChange('address_zip', e.target.value)}
              disabled={submitting}
              autoComplete="off"
            />
          )}
        </Field>

        <Field label={f.addressCity} htmlFor="company-city" error={errors.address_city}>
          {readOnly ? (
            <ReadOnlyValue value={values.address_city} />
          ) : (
            <input
              id="company-city"
              type="text"
              value={values.address_city}
              onChange={(e) => handleChange('address_city', e.target.value)}
              disabled={submitting}
              autoComplete="off"
            />
          )}
        </Field>

        <Field label={f.addressCountry} htmlFor="company-country" error={errors.address_country}>
          {readOnly ? (
            <ReadOnlyValue value={values.address_country} />
          ) : (
            <input
              id="company-country"
              type="text"
              value={values.address_country}
              onChange={(e) => handleChange('address_country', e.target.value.toUpperCase())}
              disabled={submitting}
              autoComplete="off"
              maxLength={2}
            />
          )}
        </Field>
      </div>

      {!readOnly ? (
        <div className="products-form-actions">
          <button type="submit" className="btn-primary" disabled={submitting || submitDisabled}>
            {submitting ? co.saving : (submitLabel || co.save)}
          </button>
        </div>
      ) : null}
    </form>
  )
}
