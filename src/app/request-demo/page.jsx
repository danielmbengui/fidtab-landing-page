'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import PhoneFieldInput from '@/components/PhoneFieldInput'
import SiteFooter from '@/components/SiteFooter'
import SiteNav from '@/components/SiteNav'
import { useLanguage } from '@/context/LanguageProvider'
import {
  DEFAULT_PHONE_COUNTRY,
  validatePhoneParts,
} from '@/context/functions/functions_phone'
import { WEBSITE_NAME } from '@/context/constants/constants_app'

const CONTACT_METHODS = ['email', 'phone', 'whatsapp']

function hasMinLength(value) {
  return String(value ?? '').trim().length >= 1
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '').trim())
}

function isPhoneValid(nationalValue, countryCode) {
  if (!String(nationalValue ?? '').trim()) return false
  return validatePhoneParts(nationalValue, countryCode).is_valid
}

function isRequestDemoFormValid(form, method) {
  if (!hasMinLength(form.shop) || !hasMinLength(form.name)) {
    return false
  }

  if (method === 'email') {
    return isValidEmail(form.email)
  }

  if (method === 'phone' || method === 'whatsapp') {
    return isPhoneValid(form.phoneNational, form.phoneCountry)
  }

  return false
}

function getEmailFieldError(email, touched, message) {
  if (!touched) return ''
  const value = String(email ?? '').trim()
  if (!value || !isValidEmail(value)) return message
  return ''
}

function getPhoneFieldError(nationalValue, countryCode, touched, message) {
  if (!touched) return ''
  if (!isPhoneValid(nationalValue, countryCode)) return message
  return ''
}

function RequestDemoFieldLabel({ children, required = false, optional }) {
  return (
    <span className="request-demo-field-label">
      {children}
      {required ? <span className="request-demo-required" aria-hidden="true"> *</span> : null}
      {optional ? <span className="request-demo-optional"> ({optional})</span> : null}
    </span>
  )
}

export default function RequestDemoPage() {
  const { content: c, t } = useLanguage()
  const rd = c.requestDemo
  const [scrolled, setScrolled] = useState(false)
  const [method, setMethod] = useState('email')
  const [submitted, setSubmitted] = useState(false)
  const [touched, setTouched] = useState({ email: false, phone: false })
  const [form, setForm] = useState({
    shop: '',
    name: '',
    email: '',
    phoneCountry: DEFAULT_PHONE_COUNTRY,
    phoneNational: '',
    message: '',
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${rd.metaTitle}`
  }, [rd.metaTitle])

  const isFormValid = useMemo(
    () => isRequestDemoFormValid(form, method),
    [form, method],
  )

  const emailError = useMemo(() => {
    if (method !== 'email') return ''
    return getEmailFieldError(form.email, touched.email, rd.fields.emailInvalid)
  }, [form.email, method, rd.fields.emailInvalid, touched.email])

  const phoneError = useMemo(() => {
    if (method !== 'phone' && method !== 'whatsapp') return ''
    return getPhoneFieldError(
      form.phoneNational,
      form.phoneCountry,
      touched.phone,
      rd.fields.phoneInvalid,
    )
  }, [form.phoneCountry, form.phoneNational, method, rd.fields.phoneInvalid, touched.phone])

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleMethodChange = (id) => {
    setMethod(id)
    setTouched({ email: false, phone: false })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    setTouched({ email: true, phone: true })

    if (!isRequestDemoFormValid(form, method)) {
      return
    }

    let contactValue = form.email

    if (method === 'phone' || method === 'whatsapp') {
      const validation = validatePhoneParts(form.phoneNational, form.phoneCountry)
      contactValue = validation.international || validation.phone_number || ''
    }

    const methodLabel = rd.methods[method]?.label ?? method

    const body = [
      `Commerce : ${form.shop}`,
      `Contact : ${form.name}`,
      `Rappel souhaité : ${methodLabel}`,
      `Coordonnées : ${contactValue}`,
      form.message ? `Message : ${form.message}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    const mailto = `mailto:contact@fidtab.com?subject=${encodeURIComponent(
      `[${WEBSITE_NAME}] Demande de démo — ${form.shop}`
    )}&body=${encodeURIComponent(body)}`

    window.location.href = mailto
    setSubmitted(true)
  }

  return (
    <div className="page-wrap">
      <div className="page-ambient" aria-hidden="true">
        <div className="ambient-grid" />
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
      </div>

      <SiteNav
        c={c}
        scrolled={scrolled}
        menuOpen={false}
        setMenuOpen={() => {}}
        demoPageActive
      />

      <main className="request-demo-page">
        <div className="container">
          <div className="request-demo-card reveal visible">
            <Link href="/" className="request-demo-back">
              {rd.back}
            </Link>

            <h1 className="request-demo-title">
              {rd.title} <em>{rd.titleEm}</em>
            </h1>
            <p className="request-demo-sub">{t(rd.sub)}</p>

            {submitted ? (
              <div className="request-demo-success">
                <div className="request-demo-success-icon">✓</div>
                <h2>{rd.successTitle}</h2>
                <p>{rd.successText}</p>
              </div>
            ) : (
              <form className="request-demo-form" onSubmit={handleSubmit} noValidate>
                <fieldset className="request-demo-fieldset">
                  <legend className="request-demo-legend">{rd.methodLabel}</legend>
                  <div className="request-demo-methods">
                    {CONTACT_METHODS.map((id) => {
                      const item = rd.methods[id]
                      return (
                        <button
                          key={id}
                          type="button"
                          className={`request-demo-method${method === id ? ' active' : ''}`}
                          onClick={() => handleMethodChange(id)}
                          aria-pressed={method === id}
                        >
                          <span className="request-demo-method-icon">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </fieldset>

                <div className="request-demo-fields">
                  <label className="request-demo-field">
                    <RequestDemoFieldLabel required>{rd.fields.shop}</RequestDemoFieldLabel>
                    <input
                      type="text"
                      name="shop"
                      value={form.shop}
                      onChange={updateField('shop')}
                      autoComplete="organization"
                    />
                  </label>

                  <label className="request-demo-field">
                    <RequestDemoFieldLabel required>{rd.fields.name}</RequestDemoFieldLabel>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={updateField('name')}
                      autoComplete="name"
                    />
                  </label>

                  {method === 'email' && (
                    <label className="request-demo-field">
                      <RequestDemoFieldLabel required>{rd.fields.email}</RequestDemoFieldLabel>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={updateField('email')}
                        onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                        autoComplete="email"
                        aria-invalid={emailError ? 'true' : undefined}
                        className={emailError ? 'request-demo-input--error' : undefined}
                      />
                      {emailError ? <span className="request-demo-field-error">{emailError}</span> : null}
                    </label>
                  )}

                  {method === 'phone' && (
                    <PhoneFieldInput
                      id="phone"
                      label={rd.fields.phone}
                      countryCode={form.phoneCountry}
                      nationalValue={form.phoneNational}
                      onCountryChange={(code) => {
                        setForm((prev) => ({ ...prev, phoneCountry: code }))
                      }}
                      onNationalChange={(e) => {
                        setForm((prev) => ({ ...prev, phoneNational: e.target.value }))
                      }}
                      onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                      error={phoneError}
                    />
                  )}

                  {method === 'whatsapp' && (
                    <PhoneFieldInput
                      id="whatsapp"
                      label={rd.fields.whatsapp}
                      countryCode={form.phoneCountry}
                      nationalValue={form.phoneNational}
                      onCountryChange={(code) => {
                        setForm((prev) => ({ ...prev, phoneCountry: code }))
                      }}
                      onNationalChange={(e) => {
                        setForm((prev) => ({ ...prev, phoneNational: e.target.value }))
                      }}
                      onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                      error={phoneError}
                    />
                  )}

                  <label className="request-demo-field">
                    <RequestDemoFieldLabel optional={rd.fields.optional}>{rd.fields.message}</RequestDemoFieldLabel>
                    <textarea
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={updateField('message')}
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-primary request-demo-submit"
                  disabled={!isFormValid}
                  aria-disabled={!isFormValid}
                >
                  {rd.submit}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <SiteFooter activePage="action" />
    </div>
  )
}
