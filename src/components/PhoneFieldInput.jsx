'use client'

import { useMemo } from 'react'
import { useLanguage } from '@/context/LanguageProvider'
import {
  DEFAULT_PHONE_COUNTRY,
  getCountriesForPhoneSelect,
  getPlaceHolderPhoneNumber,
} from '@/context/functions/functions_phone'

export default function PhoneFieldInput({
  id,
  label,
  countryCode,
  nationalValue,
  onCountryChange,
  onNationalChange,
  onBlur,
  error,
  required = true,
}) {
  const { locale } = useLanguage()
  const countries = useMemo(() => getCountriesForPhoneSelect(locale), [locale])
  const placeholder = useMemo(
    () => getPlaceHolderPhoneNumber(countryCode || DEFAULT_PHONE_COUNTRY),
    [countryCode],
  )

  return (
    <label className="request-demo-field" htmlFor={id}>
      <span className="request-demo-field-label">
        {label}
        {required ? <span className="request-demo-required" aria-hidden="true"> *</span> : null}
      </span>
      <div className={`phone-field-row${error ? ' phone-field-row--error' : ''}`}>
        <div className="phone-prefix-wrap">
          <select
            className="phone-prefix-select"
            value={countryCode || DEFAULT_PHONE_COUNTRY}
            onChange={(e) => onCountryChange(e.target.value)}
            aria-label={label}
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flags?.str ?? ''} +{country.prefixes[0]}
              </option>
            ))}
          </select>
        </div>
        <input
          id={id}
          type="tel"
          name={id}
          required={required}
          value={nationalValue}
          onChange={onNationalChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete="tel-national"
          inputMode="tel"
        />
      </div>
      {error ? <span className="request-demo-field-error">{error}</span> : null}
    </label>
  )
}
