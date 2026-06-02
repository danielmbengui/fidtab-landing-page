'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import SiteFooter from '@/components/SiteFooter'
import SiteNav from '@/components/SiteNav'
import { useLanguage } from '@/context/LanguageProvider'
import {
  APP_STORE_URL,
  COMPANY_URL,
  CONTACT_PATH,
  PLAY_STORE_URL,
  WEBSITE_NAME,
} from '@/context/constants/constants_app'

export default function DownloadPage() {
  const { content: c, t } = useLanguage()
  const dl = c.downloadApp
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.title = `${WEBSITE_NAME} — ${dl.metaTitle}`
  }, [dl.metaTitle])

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
              {dl.back}
            </Link>

            <h1 className="request-demo-title">
              {dl.title} <em>{t(dl.titleEm)}</em>
            </h1>
            <p className="request-demo-sub">{t(dl.sub)}</p>

            <p className="download-free-label">{dl.freeLabel}</p>

            <div className="download-store-buttons">
              <a
                href={APP_STORE_URL}
                className="btn-primary download-store-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                {dl.appStore}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href={PLAY_STORE_URL}
                className="btn-ghost download-store-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                {dl.playStore}
              </a>
            </div>

            <div className="download-help">
              <h2>{dl.helpTitle}</h2>
              <p>{dl.helpText}</p>
              <Link href={CONTACT_PATH} className="sc-visit-link">
                {dl.helpCta} →
              </Link>
            </div>

            <div className="download-enterprise">
              <p className="download-enterprise-text">{c.enterprise.label}</p>
              <h2 className="download-enterprise-title">
                {c.enterprise.title} <em>{c.enterprise.titleEm}</em>
              </h2>
              <p className="download-enterprise-sub">{c.enterprise.sub}</p>
              <a
                href={COMPANY_URL}
                className="btn-ghost download-enterprise-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                {c.enterprise.cta} →
              </a>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter activePage="action" />
    </div>
  )
}
