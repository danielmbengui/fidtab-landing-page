'use client'

import Link from 'next/link'
import SecondaryPageShell from '@/components/SecondaryPageShell'
import { useLanguage } from '@/context/LanguageProvider'
import {
  LEGAL_NOTICE_PATH,
  PRIVACY_PATH,
  TERMS_PATH,
} from '@/context/constants/constants_app'

const RELATED_LINKS = {
  legalNotice: [
    { path: TERMS_PATH, key: 'terms' },
    { path: PRIVACY_PATH, key: 'privacy' },
  ],
  terms: [
    { path: LEGAL_NOTICE_PATH, key: 'legal' },
    { path: PRIVACY_PATH, key: 'privacy' },
  ],
  privacy: [
    { path: LEGAL_NOTICE_PATH, key: 'legal' },
    { path: TERMS_PATH, key: 'terms' },
  ],
}

const FOOTER_ACTIVE = {
  legalNotice: 'legal',
  terms: 'terms',
  privacy: 'privacy',
}

export default function LegalDocument({ contentKey }) {
  const { content: c, t } = useLanguage()
  const page = c[contentKey]
  const related = RELATED_LINKS[contentKey] ?? []
  const activeFooterPage = FOOTER_ACTIVE[contentKey] ?? null

  return (
    <SecondaryPageShell metaTitle={page.metaTitle} activeFooterPage={activeFooterPage}>
      <div className="container">
        <article className="legal-card reveal visible">
          <Link href="/" className="secondary-back">
            {page.back}
          </Link>

          <h1 className="secondary-title">{page.title}</h1>
          <p className="legal-updated">{page.updated}</p>

          <div className="legal-body">
            {page.sections.map((section, index) => (
              <section key={index} className="legal-section">
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i}>{t(paragraph)}</p>
                ))}
              </section>
            ))}
          </div>

          {related.length > 0 ? (
            <nav className="legal-related" aria-label={page.relatedLabel}>
              {related.map((link) => (
                <Link key={link.path} href={link.path}>
                  {c.footer[link.key]}
                </Link>
              ))}
            </nav>
          ) : null}
        </article>
      </div>
    </SecondaryPageShell>
  )
}
