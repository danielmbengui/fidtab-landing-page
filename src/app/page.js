'use client'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import BrandLogo from '@/components/BrandLogo'
import LanguageSelector from '@/components/LanguageSelector'
import ThemeSelector from '@/components/ThemeSelector'
import { useAuth } from '@/context/AuthProvider'
import { useLanguage } from '@/context/LanguageProvider'
import { DASHBOARD_PATH, WEBSITE_NAME } from '@/context/constants/constants_app'
import { auth } from '@/lib/firebaseConfig'
import { getAuthErrorMessage } from '@/lib/authErrors'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '').trim())
}

export default function LoginPage() {
  const router = useRouter()
  const { authUser, loading: authLoading } = useAuth()
  const { content: c, t } = useLanguage()
  const login = c.login

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${login.metaTitle}`
  }, [login.metaTitle])

  useEffect(() => {
    if (!authLoading && authUser) {
      router.replace(DASHBOARD_PATH)
    }
  }, [authUser, authLoading, router])

  const emailError = touched.email && !isValidEmail(email) ? login.errors.invalidEmail : ''
  const passwordError = touched.password && !password.trim() ? login.errors.required : ''

  async function handleSubmit(event) {
    event.preventDefault()
    setTouched({ email: true, password: true })
    setError('')

    if (!isValidEmail(email) || !password.trim()) return

    setSubmitting(true)
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      router.replace(DASHBOARD_PATH)
    } catch (err) {
      setError(getAuthErrorMessage(err?.code, login))
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || authUser) {
    return (
      <div className="login-page">
        <div className="page-ambient" aria-hidden="true">
          <div className="ambient-grid" />
          <div className="ambient-orb ambient-orb-1" />
          <div className="ambient-orb ambient-orb-2" />
        </div>
        <div className="login-shell login-shell--loading" aria-busy="true" aria-live="polite">
          <p className="login-loading">{login.submitting}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="page-ambient" aria-hidden="true">
        <div className="ambient-grid" />
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      <div className="login-shell">
        <header className="login-header">
          <BrandLogo variant="hero" tag="div" showName />
          <div className="login-header-actions">
            <ThemeSelector />
            <LanguageSelector />
          </div>
        </header>

        <main className="login-card">
          <h1 className="login-title">
            {login.title} <em>{login.titleEm}</em>
          </h1>
          <p className="login-sub">{t(login.sub)}</p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <label className="login-field">
              <span>{login.email}</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                className={emailError ? 'login-input--error' : ''}
                aria-invalid={emailError ? 'true' : undefined}
                disabled={submitting}
              />
              {emailError ? <span className="login-field-error">{emailError}</span> : null}
            </label>

            <label className="login-field">
              <span>{login.password}</span>
              <div className="login-password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  className={passwordError ? 'login-input--error' : ''}
                  aria-invalid={passwordError ? 'true' : undefined}
                  disabled={submitting}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? login.hidePassword : login.showPassword}
                  disabled={submitting}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M3 3l18 18M10.58 10.58A2 2 0 0012 15a2 2 0 001.41-.59M9.88 4.24A10.94 10.94 0 0112 5c4.27 0 7.94 2.66 10 6.5a11.2 11.2 0 01-2.05 2.85M6.11 6.11A11.18 11.18 0 002 11.5C4.06 15.34 7.73 18 12 18a10.9 10.9 0 004.12-.79" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError ? <span className="login-field-error">{passwordError}</span> : null}
            </label>

            {error ? (
              <p className="login-form-error" role="alert">{error}</p>
            ) : null}

            <button type="submit" className="btn-primary login-submit" disabled={submitting}>
              {submitting ? login.submitting : login.submit}
            </button>
          </form>
        </main>
      </div>
    </div>
  )
}
