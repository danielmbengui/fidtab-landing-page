'use client'

import Link from 'next/link'
import SecondaryPageShell from '@/components/SecondaryPageShell'
import { useLanguage } from '@/context/LanguageProvider'
import {
  CONTACT_EMAIL,
  CONTACT_WHATSAPP,
} from '@/context/constants/constants_app'

function whatsappHref(number) {
  return `https://wa.me/${number.replace(/\D/g, '')}`
}

export default function ContactPage() {
  const { content: c, t } = useLanguage()
  const page = c.contactPage

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t(page.emailSubject))}`
  const whatsapp = whatsappHref(CONTACT_WHATSAPP)

  return (
    <SecondaryPageShell metaTitle={page.metaTitle} activeFooterPage="contact">
      <div className="container">
        <div className="contact-card reveal visible">
          <Link href="/" className="secondary-back">
            {page.back}
          </Link>

          <h1 className="secondary-title">
            {page.title} <em>{page.titleEm}</em>
          </h1>
          <p className="secondary-sub">{t(page.sub)}</p>

          <div className="contact-methods">
            <a href={mailto} className="contact-method">
              <span className="contact-method-icon" aria-hidden="true">✉️</span>
              <div className="contact-method-body">
                <h2>{page.methods.email.label}</h2>
                <p>{page.methods.email.desc}</p>
                <span className="contact-method-value">{CONTACT_EMAIL}</span>
              </div>
              <span className="contact-method-action">{page.methods.email.action}</span>
            </a>
          </div>
        </div>
      </div>
    </SecondaryPageShell>
  )
}
