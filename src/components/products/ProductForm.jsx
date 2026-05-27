'use client'

import { ClassProduct } from '@/classes/ClassProduct'
import ProductBarcodeField from '@/components/products/ProductBarcodeField'
import { useLanguage } from '@/context/LanguageProvider'
import { getProductEnumOptions } from '@/lib/productForm'

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

export default function ProductForm({
  values,
  onChange,
  onSubmit,
  entityUid = '',
  readOnly = false,
  submitting = false,
  submitDisabled = false,
  submitLabel,
  errors = {},
  showBarCode = false,
  enableBarcodeInput = false,
  barcodeIntro,
  onBarcodeChange,
  barcodeChecking = false,
  fieldsLocked = false,
  onReset,
  resetDisabled = false,
}) {
  const { content: c } = useLanguage()
  const p = c.products
  const f = p.fields
  const inputsDisabled = submitting || fieldsLocked

  function handleChange(field, nextValue) {
    onChange({ ...values, [field]: nextValue })
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!readOnly && !fieldsLocked && onSubmit) onSubmit()
  }

  const categories = getProductEnumOptions(ClassProduct.CATEGORY)
  const statuses = getProductEnumOptions(ClassProduct.STATUS)
  const units = getProductEnumOptions(ClassProduct.UNIT)

  return (
    <form className="products-form" onSubmit={handleSubmit} noValidate>
      {enableBarcodeInput ? (
        <ProductBarcodeField
          value={values.bar_code_number ?? ''}
          onChange={onBarcodeChange}
          checking={barcodeChecking}
          disabled={submitting}
          intro={barcodeIntro}
        />
      ) : null}

      {entityUid ? (
        <Field label={f.fidtabId} htmlFor="product-fidtab-id">
          <ReadOnlyValue value={entityUid} />
        </Field>
      ) : null}

      <div className="products-form-grid">
        <Field label={f.name} htmlFor="product-name" error={errors.name}>
          {readOnly ? (
            <ReadOnlyValue value={values.name} />
          ) : (
            <input
              id="product-name"
              type="text"
              value={values.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={inputsDisabled}
              autoComplete="off"
            />
          )}
        </Field>

        <Field label={f.category} htmlFor="product-category" error={errors.category}>
          {readOnly ? (
            <ReadOnlyValue value={p.categories[values.category] ?? values.category} />
          ) : (
            <select
              id="product-category"
              value={values.category}
              onChange={(e) => handleChange('category', e.target.value)}
              disabled={inputsDisabled}
            >
              {categories.map((value) => (
                <option key={value} value={value}>
                  {p.categories[value] ?? value}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label={f.status} htmlFor="product-status" error={errors.status}>
          {readOnly ? (
            <ReadOnlyValue value={p.statuses[values.status] ?? values.status} />
          ) : (
            <select
              id="product-status"
              value={values.status}
              onChange={(e) => handleChange('status', e.target.value)}
              disabled={inputsDisabled}
            >
              {statuses.map((value) => (
                <option key={value} value={value}>
                  {p.statuses[value] ?? value}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label={f.unit} htmlFor="product-unit" error={errors.unit}>
          {readOnly ? (
            <ReadOnlyValue value={p.units[values.unit] ?? values.unit} />
          ) : (
            <select
              id="product-unit"
              value={values.unit}
              onChange={(e) => handleChange('unit', e.target.value)}
              disabled={inputsDisabled}
            >
              {units.map((value) => (
                <option key={value} value={value}>
                  {p.units[value] ?? value}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label={f.price} htmlFor="product-price" error={errors.price}>
          {readOnly ? (
            <ReadOnlyValue value={values.price} />
          ) : (
            <input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              value={values.price}
              onChange={(e) => handleChange('price', e.target.value)}
              disabled={inputsDisabled}
            />
          )}
        </Field>

        <Field label={f.oldPrice} htmlFor="product-old-price" error={errors.old_price}>
          {readOnly ? (
            <ReadOnlyValue value={values.old_price} />
          ) : (
            <input
              id="product-old-price"
              type="number"
              min="0"
              step="0.01"
              value={values.old_price}
              onChange={(e) => handleChange('old_price', e.target.value)}
              disabled={inputsDisabled}
            />
          )}
        </Field>

        <Field label={f.buyPrice} htmlFor="product-buy-price" error={errors.buy_price}>
          {readOnly ? (
            <ReadOnlyValue value={values.buy_price} />
          ) : (
            <input
              id="product-buy-price"
              type="number"
              min="0"
              step="0.01"
              value={values.buy_price}
              onChange={(e) => handleChange('buy_price', e.target.value)}
              disabled={inputsDisabled}
            />
          )}
        </Field>

        <Field label={f.stock} htmlFor="product-stock" error={errors.stock}>
          {readOnly ? (
            <ReadOnlyValue value={values.stock} />
          ) : (
            <input
              id="product-stock"
              type="number"
              min="0"
              step="1"
              value={values.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              disabled={inputsDisabled}
            />
          )}
        </Field>

        <Field label={f.quantity} htmlFor="product-quantity" error={errors.quantity}>
          {readOnly ? (
            <ReadOnlyValue value={values.quantity} />
          ) : (
            <input
              id="product-quantity"
              type="number"
              min="0"
              step="1"
              value={values.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              disabled={inputsDisabled}
            />
          )}
        </Field>

        {showBarCode ? (
          <Field label={f.barCode} htmlFor="product-bar-code">
            <ReadOnlyValue value={values.bar_code_number} />
          </Field>
        ) : null}
      </div>

      <Field label={f.shortDescription} htmlFor="product-short-description">
        {readOnly ? (
          <ReadOnlyValue value={values.short_description} />
        ) : (
          <input
            id="product-short-description"
            type="text"
            value={values.short_description}
            onChange={(e) => handleChange('short_description', e.target.value)}
            disabled={inputsDisabled}
          />
        )}
      </Field>

      <Field label={f.description} htmlFor="product-description">
        {readOnly ? (
          <ReadOnlyValue value={values.description} />
        ) : (
          <textarea
            id="product-description"
            rows={4}
            value={values.description}
            onChange={(e) => handleChange('description', e.target.value)}
            disabled={inputsDisabled}
          />
        )}
      </Field>

      <div className="products-form-checkboxes">
        <label className="products-checkbox">
          <input
            type="checkbox"
            checked={Boolean(values.is_deliverable)}
            onChange={(e) => handleChange('is_deliverable', e.target.checked)}
            disabled={readOnly || inputsDisabled}
          />
          <span>{f.isDeliverable}</span>
        </label>
        <label className="products-checkbox">
          <input
            type="checkbox"
            checked={Boolean(values.is_promo)}
            onChange={(e) => handleChange('is_promo', e.target.checked)}
            disabled={readOnly || inputsDisabled}
          />
          <span>{f.isPromo}</span>
        </label>
      </div>

      {!readOnly ? (
        <div className="products-form-actions">
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting || submitDisabled || fieldsLocked || barcodeChecking}
          >
            {submitting ? p.saving : (submitLabel ?? p.save)}
          </button>
          {onReset ? (
            <button
              type="button"
              className="btn-ghost"
              onClick={onReset}
              disabled={submitting || resetDisabled}
            >
              {p.reset}
            </button>
          ) : null}
        </div>
      ) : null}

      {errors.form ? <p className="login-form-error">{errors.form}</p> : null}
    </form>
  )
}
