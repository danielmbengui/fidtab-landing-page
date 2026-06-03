'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AppPhoneMockup from '@/components/AppPhoneMockup'
import HeroSidePhone from '@/components/HeroSidePhone'
import PartnerMarquee from '@/components/PartnerMarquee'
import SiteFooter from '@/components/SiteFooter'
import SiteNav from '@/components/SiteNav'
import { useLanguage } from '@/context/LanguageProvider'
import {
  APP_STORE_URL,
  COMPANY_URL,
  DOWNLOAD_APP_PATH,
  PLAY_STORE_URL,
  PWA_URL,
} from '@/context/constants/constants_app'
import { FEATURE_LAYOUT, IMAGES } from '@/config/visuals'
import { formatShopOpensInLabel, getShopOpeningHoursToday } from '@/lib/openingHoursDisplay'
import { AnimatedCounter, useParallax, useScrollReveal } from '@/hooks/useAnimations'
import { useLoyaltyCards } from '@/hooks/useLoyaltyCards'
import { useStoreShowcase } from '@/hooks/useStoreShowcase'
import LoyaltyCardsSlider from '@/components/LoyaltyCardsSlider'
import { AppleIcon, GooglePlayIcon, PwaIcon } from '@/components/DownloadPlatformIcons'

const NAV_SECTIONS = ['fonctionnalites', 'fidelite', 'comment', 'partenaires', 'app']

export default function Home() {
  const { content: c, t, locale } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  const { cards: loyaltyCards } = useLoyaltyCards(c.cards)
  const { stores: storeCards, loading: storesLoading } = useStoreShowcase()

  useScrollReveal(c, storeCards.length)
  useParallax()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const offset = 120

    const updateActiveSection = () => {
      let current = ''

      for (const id of NAV_SECTIONS) {
        const el = document.getElementById(id)
        if (!el) continue
        if (window.scrollY >= el.offsetTop - offset) {
          current = id
        }
      }

      setActiveSection(current)
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const cards = document.querySelectorAll('.bento-card')
    const onMove = (e) => {
      const card = e.currentTarget
      const rect = card.getBoundingClientRect()
      const mx = ((e.clientX - rect.left) / rect.width) * 100
      const my = ((e.clientY - rect.top) / rect.height) * 100
      card.style.setProperty('--mx', `${mx}%`)
      card.style.setProperty('--my', `${my}%`)
    }
    cards.forEach((card) => card.addEventListener('mousemove', onMove))
    return () => cards.forEach((card) => card.removeEventListener('mousemove', onMove))
  }, [c])

  console.log("storew", storeCards)

  return (
    <div className="page-wrap">
      <div className="page-ambient" aria-hidden="true">
        <div className="ambient-grid" />
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      <SiteNav
        c={c}
        scrolled={scrolled}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        activeSection={activeSection}
      />

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-dot" />
                {c.hero.eyebrow}
              </div>
              <h1 className="hero-title">
                {c.hero.titleLines.map((line, i) => (
                  <span key={i} className={`block${i === c.hero.titleGoldIndex ? ' gold' : ''}`}>
                    {line}
                  </span>
                ))}
              </h1>
              <p className="hero-sub">{c.hero.sub}</p>
              <div className="hero-ctas">
                <Link href={DOWNLOAD_APP_PATH} className="btn-primary">
                  {c.hero.ctaPrimary}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <a href="#comment" className="btn-ghost">{c.hero.ctaSecondary}</a>
              </div>
              <div className="hero-stats">
                {c.hero.stats.map((stat, i) => (
                  <div key={i}>
                    <span className="hero-stat-num">
                      <AnimatedCounter value={stat.num} />
                    </span>
                    <span className="hero-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
              <p className="hero-enterprise reveal reveal-delay-4">
                {c.hero.enterpriseText}{' '}
                <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer">
                  {c.hero.enterpriseLink}
                </a>
              </p>
            </div>

            <div className="hero-visual">
              <div className="hero-visual-stage">
                <HeroSidePhone phone={c.hero.sidePhones.left} className="left" />

                <div className="hero-phone-wrap">
                  <div className="glass-float top-left">
                    <div className="gf-label">{c.hero.floatReward.label}</div>
                    <div className="gf-value">{c.hero.floatReward.value}</div>
                    <div className="gf-sub">{c.hero.floatReward.sub}</div>
                  </div>

                  <AppPhoneMockup
                    hero={c.hero}
                    phoneItems={c.phoneItems}
                    storeSub={c.cardSubs.presse}
                  />

                  <div className="glass-float bottom-right">
                    <div className="gf-label">{c.hero.floatOrder.label}</div>
                    <div className="gf-value">{c.hero.floatOrder.value}</div>
                    <div className="gf-sub">{c.hero.floatOrder.sub}</div>
                  </div>
                </div>

                <HeroSidePhone phone={c.hero.sidePhones.right} className="right" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE PARTNERS */}
      <PartnerMarquee />

      {/* AVAILABILITY */}
      <section className="availability-section" id="disponibilite">
        <div className="container">
          <div className="availability-card reveal">
            <div className="availability-content">
              <div className="section-label">{c.availability.label}</div>
              <h2 className="availability-title">
                {c.availability.title} <em>{c.availability.titleEm}</em>
              </h2>
              <p className="availability-sub">{c.availability.sub}</p>
              <ul className="availability-points">
                {c.availability.points.map((point, i) => (
                  <li className={`availability-point reveal reveal-delay-${i + 1}`} key={i}>
                    <span className="availability-point-icon" aria-hidden="true">{point.icon}</span>
                    <div>
                      <div className="availability-point-title">{point.title}</div>
                      <p className="availability-point-text">{point.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="availability-visual" aria-hidden="true">
              {c.availability.alerts.map((alert, i) => (
                <div className="availability-alert" key={i}>
                  <div className="availability-alert-badge">🔔 {alert.badge}</div>
                  <div className="availability-alert-product">{alert.product}</div>
                  <div className="availability-alert-meta">{alert.shop}</div>
                  <div className="availability-alert-status">✓ {alert.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES BENTO */}
      <section className="features-section" id="fonctionnalites">
        <div className="container">
          <div className="features-header reveal">
            <div className="section-label">{c.features.label}</div>
            <h2 className="features-title">
              {c.features.title} <em>{c.features.titleEm}</em>
            </h2>
            <p className="features-sub">{c.features.sub}</p>
          </div>
          <div className="bento-grid">
            {c.features.items.map((feature, i) => {
              const layout = FEATURE_LAYOUT[i] || {}
              const imageKey = layout.image
              const imageSrc = imageKey ? IMAGES.features[imageKey] : null
              const imageMode = layout.imageMode || 'background'
              return (
                <div
                  className={[
                    'bento-card',
                    'reveal',
                    `reveal-delay-${(i % 3) + 1}`,
                    layout.span || '',
                    imageSrc ? 'bento-has-image' : '',
                    imageSrc ? `bento-image--${imageMode}` : '',
                    layout.image === 'dashboard' ? 'bento-card-dashboard' : '',
                    layout.comingSoon ? 'bento-card-coming-soon' : '',
                  ].filter(Boolean).join(' ')}
                  key={i}
                >
                  {layout.comingSoon && (
                    <span className="feature-soon-badge">{c.features.comingSoon}</span>
                  )}
                  {imageSrc && layout.image !== 'dashboard' && (
                    <div className={`bento-image bento-image-${imageMode}`}>
                      <Image
                        src={imageSrc}
                        alt=""
                        fill
                        sizes={layout.span === 'bento-wide' ? '(max-width:768px) 100vw, 800px' : '(max-width:768px) 100vw, 400px'}
                      />
                    </div>
                  )}
                  {imageSrc && layout.image === 'dashboard' && (
                    <div
                      className="bento-image bento-image-background bento-image-dashboard-only"
                      style={{ backgroundImage: `url(${imageSrc})` }}
                      role="img"
                      aria-label=""
                    />
                  )}
                  <div className={`bento-body${imageMode === 'full' ? ' bento-body-full' : ''}`}>
                    {!layout.hideIcon && (
                      <div className="feature-icon">{feature.icon}</div>
                    )}
                    <div className="feature-name">{feature.name}</div>
                    <p className="feature-desc">{feature.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* LOYALTY */}
      <section className="loyalty-section" id="fidelite">
        <div className="container">
          <div className="loyalty-grid">
            <div className="loyalty-content">
              <div className="section-label">{c.loyalty.label}</div>
              <h2 className="loyalty-title reveal">
                {c.loyalty.title} <em>{c.loyalty.titleEm}</em>
              </h2>
              <p className="loyalty-desc reveal reveal-delay-1">{c.loyalty.desc}</p>
              <div className="loyalty-points reveal reveal-delay-2">
                {c.loyalty.points.map((point, i) => (
                  <div className="loyalty-point" key={i}>
                    <div className="lp-check">✓</div>
                    <p className="lp-text"><strong>{point.title} — </strong>{point.text}</p>
                  </div>
                ))}
              </div>
              <div className="reveal reveal-delay-3">
                <Link href={DOWNLOAD_APP_PATH} className="btn-primary">
                  {c.loyalty.cta}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="big-card-wrap reveal reveal-delay-1">
              <LoyaltyCardsSlider
                cards={loyaltyCards}
                loyalty={c.loyalty}
                cardSubs={c.cardSubs}
                cardRewardLabel={c.cardRewardLabel}
                t={t}
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="comment">
        <div className="container">
          <div className="how-header reveal">
            <div className="section-label">{c.how.label}</div>
            <h2 className="how-title">{c.how.title} <em>{c.how.titleEm}</em></h2>
          </div>
          <div className="how-steps">
            {c.how.steps.map((step, i) => (
              <div className={`how-step reveal reveal-delay-${i + 1}`} key={i}>
                <span className="step-num">{step.num}</span>
                <div className="step-icon-wrap">{step.icon}</div>
                <div className="step-title">{step.title}</div>
                <p className="step-desc">{t(step.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORES */}
      <section className="stores-section" id="partenaires">
        <div className="container">
          <div className="stores-header reveal">
            <div className="section-label">{c.stores.label}</div>
            <h2 className="stores-title">{c.stores.title} <em>{c.stores.titleEm}</em></h2>
            <p className="stores-sub">{c.stores.sub}</p>
            <p className="stores-enterprise reveal reveal-delay-1">
              {c.stores.enterpriseText}{' '}
              <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer">
                {c.stores.enterpriseLink}
              </a>
            </p>
          </div>
          <div className="stores-grid">
            {!storesLoading && storeCards.length === 0 ? (
              <p className="stores-empty reveal visible">{c.stores.empty}</p>
            ) : null}
            {storeCards.map((store, i) => {
              const hoursToday = getShopOpeningHoursToday(store.openingHours, locale)
              const hoursStatusLabel = !hoursToday
                ? null
                : !hoursToday.isOpenToday
                  ? c.stores.closedToday
                  : hoursToday.isOpenNow
                    ? c.stores.openNow
                    : c.stores.closedNow
              const hoursTimeLabel =
                hoursToday?.isOpenToday && hoursToday.openTime && hoursToday.closeTime
                  ? `${hoursToday.openTime} – ${hoursToday.closeTime}`
                  : null
              const opensInLabel =
                hoursToday && !hoursToday.isOpenNow
                  ? formatShopOpensInLabel(store.openingHours, locale, c.stores)
                  : null

              return (
              <div
                className={`store-card reveal reveal-delay-${i + 1}${store.cls ? ` ${store.cls}` : ''}`}
                key={store.key ?? i}
              >
                <div className={`store-card-top${store.cls ? ` ${store.cls}` : ''}`}>
                  <Image
                    src={store.cover_image || null}
                    alt={store.name}
                    fill
                    sizes="(max-width:768px) 100vw, 400px"
                    className="store-card-cover"
                    loading="eager"
                    //style={{ width: 'auto', height: 'auto' }}
                  />
                  {store.logoUrl ? (
                    <div className="sc-logo-overlay">
                      <Image
                        src={store.logoUrl}
                        alt={`${store.companyName || store.name} logo`}
                        width={120}
                        height={40}
                        className="sc-logo-overlay-img"
                        unoptimized
                      />
                    </div>
                  ) : null}
                  {store.online && (
                    <span className="sc-live-badge">{c.stores.online}</span>
                  )}
                </div>
                <div className="store-card-body">
                  <div className="sc-name">{store.name}</div>
                  {store.tag && <div className="sc-tag">{store.tag}</div>}
                  <div className="sc-addr">📍 {store.addr}</div>
                  {hoursStatusLabel ? (
                    <div className="sc-hours">
                      <span
                        className={`sc-hours-status${hoursToday?.isOpenNow ? ' is-open' : ' is-closed'}`}
                      >
                        {hoursStatusLabel}
                      </span>
                      {hoursTimeLabel ? (
                        <span className="sc-hours-times">{hoursTimeLabel}</span>
                      ) : null}
                      {opensInLabel ? (
                        <span className="sc-hours-opens-in">{opensInLabel}</span>
                      ) : null}
                    </div>
                  ) : null}
                  {store.showStats !== false ? (
                    <div className="sc-stats">
                      <div>
                        <span className="sc-stat-num">{store.clients}</span>
                        <span className="sc-stat-label">{c.stores.loyalClients}</span>
                      </div>
                      <div>
                        <span className="sc-stat-num">{store.loyaltyPoints}</span>
                        <span className="sc-stat-label">{c.stores.loyaltyPoints}</span>
                      </div>
                      <div>
                        <span className="sc-stat-num">{store.products}</span>
                        <span className="sc-stat-label">{c.stores.availableProducts}</span>
                      </div>
                    </div>
                  ) : null}
                  {store.url && (
                    <a
                      className="sc-visit-link"
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {c.stores.visitSite} →
                    </a>
                  )}
                </div>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="app">
        <div className="container">
          <div className="cta-banner reveal">
            <div className="cta-banner-glow" aria-hidden="true" />
            <div className="cta-inner">
              <div className="cta-content">
                <div className="gold-divider cta-divider reveal" />
                <h2 className="cta-title reveal reveal-delay-1">
                  {c.cta.title}
                  <em>{c.cta.titleEm}</em>
                </h2>
                <p className="cta-sub reveal reveal-delay-2">{t(c.cta.sub)}</p>
                <div className="cta-btns cta-download-btns reveal reveal-delay-3">
                  <a
                    href={PLAY_STORE_URL}
                    className="btn-primary download-store-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GooglePlayIcon />
                    <span>{c.cta.android}</span>
                  </a>
                  <a
                    href={APP_STORE_URL}
                    className="btn-ghost download-store-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AppleIcon />
                    <span>{c.cta.ios}</span>
                  </a>
                  <a
                    href={PWA_URL}
                    className="btn-ghost download-store-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PwaIcon />
                    <span>{c.cta.pwa}</span>
                  </a>
                </div>
              </div>

              <div className="cta-visual reveal reveal-delay-2" aria-hidden="true">
                <div className="cta-visual-orb cta-visual-orb-1" />
                <div className="cta-visual-orb cta-visual-orb-2" />
                <div className="cta-visual-frame">
                  <Image
                    src={IMAGES.cta}
                    alt=""
                    fill
                    sizes="(max-width:768px) 100vw, 520px"
                  />
                </div>
                <div className="cta-chip cta-chip-1">
                  <span className="cta-chip-icon">🎁</span>
                  <div>
                    <div className="cta-chip-label">{c.hero.floatReward.label}</div>
                    <div className="cta-chip-value">{c.hero.floatReward.value}</div>
                  </div>
                </div>
                <div className="cta-chip cta-chip-2">
                  <span className="cta-chip-icon">⭐</span>
                  <div>
                    <div className="cta-chip-label">{c.hero.stats[0].label}</div>
                    <div className="cta-chip-value">{c.hero.stats[0].num}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENTERPRISE */}
      <section className="enterprise-section" id="entreprise">
        <div className="container">
          <div className="enterprise-card reveal">
            <div className="enterprise-glow" aria-hidden="true" />
            <div className="enterprise-content">
              <div className="section-label">{c.enterprise.label}</div>
              <h2 className="enterprise-title">
                {c.enterprise.title} <em>{t(c.enterprise.titleEm)}</em>
              </h2>
              <p className="enterprise-sub">{c.enterprise.sub}</p>
            </div>
            <div className="enterprise-actions">
              <a
                href={COMPANY_URL}
                className="btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                {c.enterprise.cta}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <p className="enterprise-note">{c.enterprise.note}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  )
}
