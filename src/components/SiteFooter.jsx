'use client'

import Link from 'next/link'
import BrandLogo from '@/components/BrandLogo'
import { useLanguage } from '@/context/LanguageProvider'
import {
  CONTACT_PATH,
  getCopyrightYearLabel,
  LEGAL_NOTICE_PATH,
  PRIVACY_PATH,
  REQUEST_DEMO_PATH,
  TERMS_PATH,
} from '@/context/constants/constants_app'

const FOOTER_LINKS_HOME = [
  { href: '/#fonctionnalites', labelKey: 'features' },
  { href: '/#tarifs', labelKey: 'pricing' },
  { href: LEGAL_NOTICE_PATH, labelKey: 'legal', pageKey: 'legal' },
  { href: TERMS_PATH, labelKey: 'terms', pageKey: 'terms' },
  { href: PRIVACY_PATH, labelKey: 'privacy', pageKey: 'privacy' },
  { href: CONTACT_PATH, labelKey: 'contact', pageKey: 'contact' },
]

const FOOTER_LINKS_SECONDARY = [
  { href: '/', labelKey: 'home' },
  { href: LEGAL_NOTICE_PATH, labelKey: 'legal', pageKey: 'legal' },
  { href: TERMS_PATH, labelKey: 'terms', pageKey: 'terms' },
  { href: PRIVACY_PATH, labelKey: 'privacy', pageKey: 'privacy' },
  { href: CONTACT_PATH, labelKey: 'contact', pageKey: 'contact' },
  { href: REQUEST_DEMO_PATH, labelKey: 'cta', pageKey: 'action', useNavLabel: true },
]

export default function SiteFooter({ activePage = null }) {
  const { content: c, t } = useLanguage()
  const links = activePage ? FOOTER_LINKS_SECONDARY : FOOTER_LINKS_HOME

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <BrandLogo variant="footer" className="footer-logo" showName />
          <ul className="footer-links">
            {links.map((link) => {
              const isActive = link.pageKey && activePage === link.pageKey
              const className = isActive ? 'active' : undefined
              const label = link.useNavLabel ? c.nav.cta : c.footer[link.labelKey]

              if (link.href.startsWith('/#')) {
                return (
                  <li key={link.href}>
                    <a href={link.href} className={className}>
                      {label}
                    </a>
                  </li>
                )
              }

              return (
                <li key={link.href}>
                  <Link href={link.href} className={className} aria-current={isActive ? 'page' : undefined}>
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="footer-copy">
            {t(c.footer.copyright, { year: getCopyrightYearLabel() })}
          </div>
        </div>
      </div>
    </footer>
  )
}
