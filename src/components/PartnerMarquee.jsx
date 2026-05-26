'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { useLanguage } from '@/context/LanguageProvider'
import { usePartnerCompanies } from '@/hooks/usePartnerCompanies'

export default function PartnerMarquee() {
  const { content: c, t } = useLanguage()
  const { companies } = usePartnerCompanies()

  const items = useMemo(() => {
    const fromFirestore = companies.map((company) => ({
      key: company.uid,
      name: company.name,
      tag: company.tag,
      logoUrl: company.logo_url,
    }))

    const existingNames = new Set(
      fromFirestore.map((item) => String(item.name ?? '').trim().toLowerCase()).filter(Boolean),
    )

    const fromFallback = c.partnerLogos
      .filter((name) => {
        const normalized = String(name ?? '').trim().toLowerCase()
        return normalized && !existingNames.has(normalized)
      })
      .map((name, index) => ({
        key: `fallback-${index}-${name}`,
        name,
        tag: '',
        logoUrl: '',
      }))

    return [...fromFirestore, ...fromFallback]
  }, [companies, c.partnerLogos])

  const marqueeDuration = Math.min(180, Math.max(90, items.length * 2.8))

  return (
    <div className="logos-strip">
      <p className="logos-label">{t(c.logos.label)}</p>
      <div
        className="marquee-track"
        style={{ '--marquee-duration': `${marqueeDuration}s` }}
      >
        {[0, 1].map((copy) => (
          <div className="marquee-content" key={copy} aria-hidden={copy === 1}>
            {items.map((item) => (
              <div className="logo-pill" key={`${copy}-${item.key}`}>
                {item.logoUrl ? (
                  <Image
                    src={item.logoUrl}
                    alt=""
                    width={24}
                    height={24}
                    className="logo-pill-logo"
                    unoptimized
                  />
                ) : (
                  <span className="logo-pill-dot" aria-hidden="true" />
                )}
                <span className="logo-pill-name">{item.name}</span>
                {item.tag ? <span className="logo-pill-tag">{item.tag}</span> : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
