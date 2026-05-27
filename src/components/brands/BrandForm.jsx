'use client'

import StorageImageField from '@/components/common/StorageImageField'
import { useLanguage } from '@/context/LanguageProvider'
import { buildBrandStoragePath, getBrandCategoryOptions } from '@/lib/brandForm'

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

export default function BrandForm({
  values,
  onChange,
  onSubmit,
  entityUid = '',
  uidCompany = 'system',
  readOnly = false,
  submitting = false,
  submitDisabled = false,
  submitLabel,
  errors = {},
}) {
  const { content: c } = useLanguage()
  const b = c.brands
  const f = b.fields
  const categoryLabels = c.products.categories
  const categories = getBrandCategoryOptions()
  const defaultStoragePath = buildBrandStoragePath(entityUid, uidCompany)

  function handleChange(field, nextValue) {
    onChange({ ...values, [field]: nextValue })
  }

  function handlePhotoChange({ storage_url, photo_url }) {
    onChange({ ...values, storage_url, photo_url })
  }

  function toggleCategory(category) {
    const set = new Set(values.categories ?? [])
    if (set.has(category)) set.delete(category)
    else set.add(category)
    handleChange('categories', [...set])
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!readOnly && onSubmit) onSubmit()
  }

  return (
    <form className="products-form" onSubmit={handleSubmit} noValidate>
      <StorageImageField
        label={f.photo}
        storagePath={values.storage_url}
        previewUrl={values.photo_url}
        defaultStoragePath={defaultStoragePath}
        readOnly={readOnly}
        disabled={submitting}
        error={errors.storage_url}
        onChange={handlePhotoChange}
      />

      <div className="products-form-grid">
        <Field label={f.name} htmlFor="brand-name" error={errors.name}>
          {readOnly ? (
            <ReadOnlyValue value={values.name} />
          ) : (
            <input
              id="brand-name"
              type="text"
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={submitting}
              autoComplete="off"
            />
          )}
        </Field>

        <Field label={f.uidFidtabBrand} htmlFor="brand-fidtab-id">
          <ReadOnlyValue value={entityUid} />
        </Field>
      </div>

      <fieldset className="brands-categories-fieldset">
        <legend>{f.categories}</legend>
        {readOnly ? (
          <ReadOnlyValue
            value={(values.categories ?? [])
              .map((value) => categoryLabels[value] ?? value)
              .join(', ')}
          />
        ) : (
          <div className="brands-categories-grid">
            {categories.map((category) => (
              <label key={category} className="products-checkbox">
                <input
                  type="checkbox"
                  checked={(values.categories ?? []).includes(category)}
                  onChange={() => toggleCategory(category)}
                  disabled={submitting}
                />
                <span>{categoryLabels[category] ?? category}</span>
              </label>
            ))}
          </div>
        )}
      </fieldset>

      {!readOnly ? (
        <div className="products-form-actions">
          <button type="submit" className="btn-primary" disabled={submitting || submitDisabled}>
            {submitting ? b.saving : (submitLabel ?? b.save)}
          </button>
        </div>
      ) : null}

      {errors.form ? <p className="login-form-error">{errors.form}</p> : null}
    </form>
  )
}
