'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AppPhoneMockup from '@/components/AppPhoneMockup'
import PartnerMarquee from '@/components/PartnerMarquee'
import SiteFooter from '@/components/SiteFooter'
import SiteNav from '@/components/SiteNav'
import { useLanguage } from '@/context/LanguageProvider'
import { REQUEST_DEMO_PATH, WEBSITE_NAME } from '@/context/constants/constants_app'
import { ClassCountry } from '@/classes/ClassCountry'
import { FEATURE_LAYOUT, IMAGES } from '@/config/visuals'
import { AnimatedCounter, useParallax, useScrollReveal } from '@/hooks/useAnimations'
import { useLoyaltyCards } from '@/hooks/useLoyaltyCards'
import { useStoreShowcase } from '@/hooks/useStoreShowcase'

const NAV_SECTIONS = ['fonctionnalites', 'fidelite', 'comment', 'tarifs', 'demo']

export default function Home() {
  const { content: c, t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCard, setActiveCard] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [billingPeriod, setBillingPeriod] = useState('monthly')

  useScrollReveal(c)
  useParallax()
  const { cards: loyaltyCards } = useLoyaltyCards(c.cards)
  const { stores: storeCards } = useStoreShowcase(3)

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
    if (loyaltyCards.length <= 1) return undefined
    const timer = setInterval(
      () => setActiveCard((i) => (i + 1) % loyaltyCards.length),
      3500,
    )
    return () => clearInterval(timer)
  }, [loyaltyCards.length])

  useEffect(() => {
    setActiveCard((index) => (index >= loyaltyCards.length ? 0 : index))
  }, [loyaltyCards.length])

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

  const card = loyaltyCards[activeCard] ?? loyaltyCards[0]
  const isAnnualBilling = billingPeriod === 'annual'

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
                <Link href={REQUEST_DEMO_PATH} className="btn-primary">
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
            </div>

            <div className="hero-visual">
              <div className="hero-visual-stage">
                <div className="hero-flank-photo left" data-parallax="0.08">
                  <Image
                    src={IMAGES.hero.shop}
                    alt={c.cardSubs.presse}
                    fill
                    sizes="240px"
                    priority
                  />
                  <span className="hero-photo-caption">{c.cardSubs.presse}</span>
                </div>

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

                <div className="hero-flank-photo right" data-parallax="0.1">
                  <Image
                    src={IMAGES.hero.side}
                    alt={c.cardSubs.coiffeur}
                    fill
                    sizes="240px"
                    priority
                  />
                  <span className="hero-photo-caption">{c.cardSubs.coiffeur}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE PARTNERS */}
      <PartnerMarquee />

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
                <Link href={REQUEST_DEMO_PATH} className="btn-primary">
                  {c.loyalty.cta}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="big-card-wrap reveal reveal-delay-1">
              <div className="loyalty-visual-stack">
                <div className="loyalty-bg-photo">
                  <Image src={IMAGES.loyalty} alt="" fill sizes="420px" />
                </div>

                <div className="floating-stat stat-tl">
                  <span className="fs-num">+68%</span>
                  <span className="fs-label">{c.loyalty.statReturn}</span>
                </div>

                <Link
                  href={REQUEST_DEMO_PATH}
                  className={`big-loyalty-card ${card.theme}`}
                  aria-label={c.loyalty.cta}
                >
                  <div className="blc-shine" aria-hidden="true" />
                  <div className="blc-stripe" aria-hidden="true" />
                  <div className="blc-header">
                    <div className="blc-chip" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className={`blc-logo ${card.logoClass}`}>
                      {card.logoUrl ? (
                        <Image
                          src={card.logoUrl}
                          alt=""
                          width={28}
                          height={28}
                          className="blc-logo-img"
                          unoptimized
                        />
                      ) : (
                        card.logo
                      )}
                    </div>
                  </div>
                  <div className="blc-type">{c.loyalty.cardTypeLabel}</div>
                  <div className="blc-store" style={{ color: card.accentColor }}>{card.store}</div>
                  <div className="blc-store-sub">
                    {card.subText || (card.subKey ? c.cardSubs[card.subKey] : '')}
                  </div>
                  <div className="blc-body">
                    <div className="blc-points-block">
                      <div className="blc-pts-num" style={{ color: card.accentColor }}>{card.points}</div>
                      <div className="blc-pts-label">{c.loyalty.pointsLabel}</div>
                    </div>
                    <div className="blc-reward">
                      <div className="blc-reward-val" style={{ color: card.accentColor }}>{card.reward}</div>
                      <div className="blc-reward-label">{t(c.cardRewardLabel, { pts: card.rewardAt })}</div>
                    </div>
                  </div>
                  <div className="blc-progress">
                    <div className="blc-bar">
                      <div
                        className="blc-bar-fill"
                        style={{
                          width: card.barWidth,
                          background: `linear-gradient(90deg, ${card.accentColor}, ${card.accentColor}cc)`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="blc-perforation" aria-hidden="true" />
                  <div className="blc-footer">
                    <div className="blc-member">
                      <span className="blc-field-label">{c.loyalty.cardMemberLabel}</span>
                      <span className="blc-field-value">{card.memberName}</span>
                    </div>
                    <div className="blc-card-no">
                      <span className="blc-field-label">{c.loyalty.cardNumberLabel}</span>
                      <span className="blc-field-value">{card.cardNumber}</span>
                    </div>
                  </div>
                  <div className="blc-bottom">
                    <div className="blc-barcode" aria-hidden="true" />
                    <div className="blc-brand">{WEBSITE_NAME}</div>
                  </div>
                </Link>

                <div className="card-switcher">
                  {loyaltyCards.map((item, i) => (
                    <button
                      key={item.key}
                      type="button"
                      className={`cs-dot${item.source === 'firestore' ? ' cs-dot-live' : ''}${i === activeCard ? ' active' : ''}`}
                      onClick={() => setActiveCard(i)}
                      aria-label={item.store}
                      aria-current={i === activeCard ? 'true' : undefined}
                    />
                  ))}
                </div>

                <div className="floating-stat stat-br">
                  <span className="fs-num">3 200+</span>
                  <span className="fs-label">{c.loyalty.statActive}</span>
                </div>
              </div>
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
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STORES */}
      <section className="stores-section">
        <div className="container">
          <div className="stores-header reveal">
            <div className="section-label">{c.stores.label}</div>
            <h2 className="stores-title">{c.stores.title} <em>{c.stores.titleEm}</em></h2>
            <p className="stores-sub">{c.stores.sub}</p>
          </div>
          <div className="stores-grid">
            {storeCards.map((store, i) => (
              <div
                className={`store-card reveal reveal-delay-${i + 1}${store.cls ? ` ${store.cls}` : ''}`}
                key={store.key ?? i}
              >
                <div className={`store-card-top${store.cls ? ` ${store.cls}` : ''}`}>
                  <Image
                    src={store.coverImage ?? IMAGES.stores[i] ?? IMAGES.stores[0]}
                    alt={store.name}
                    fill
                    sizes="(max-width:768px) 100vw, 400px"
                    className="store-card-cover"
                  />
                  {store.online && (
                    <span className="sc-live-badge">{c.stores.online}</span>
                  )}
                </div>
                <div className="store-card-body">
                  {store.source === 'firestore' && store.logoUrl ? (
                    <div className="sc-logo">
                      <Image
                        src={store.logoUrl}
                        alt={`${store.name} logo`}
                        width={140}
                        height={48}
                        className="sc-logo-img"
                        unoptimized
                      />
                    </div>
                  ) : null}
                  <div className="sc-name">{store.name}</div>
                  {store.tag && <div className="sc-tag">{store.tag}</div>}
                  <div className="sc-addr">📍 {store.addr}</div>
                  {store.showStats !== false && store.clients && store.orders ? (
                    <div className="sc-stats">
                      <div>
                        <span className="sc-stat-num">{store.clients}</span>
                        <span className="sc-stat-label">{c.stores.loyalClients}</span>
                      </div>
                      <div>
                        <span className="sc-stat-num">{store.orders}</span>
                        <span className="sc-stat-label">{c.stores.orders}</span>
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
            ))}
          </div>
        </div>
      </section>

      {/* PARTNER HIGHLIGHTS */}
      <section className="testimonials-section">
        <div className="container">
          <div className="testimonials-header reveal">
            <div className="section-label">{c.testimonials.label}</div>
            <h2 className="testimonials-title">
              {WEBSITE_NAME} <em>{c.testimonials.titleEm}</em>
            </h2>
            <p className="testimonials-sub">{t(c.testimonials.sub)}</p>
          </div>
          <div className="testimonials-grid">
            {c.testimonials.items.map((item, i) => (
              <div
                className={`testimonial-card reveal reveal-delay-${i + 1}${
                  item.kind === 'partner' ? ' testimonial-card-partner' : ' testimonial-card-benefit'
                }`}
                key={i}
              >
                {item.kind === 'partner' ? (
                  <>
                    <span className="tc-partner-badge">{c.testimonials.partnerBadge}</span>
                    {item.logoUrl ? (
                      <div className="tc-partner-logo">
                        <Image
                          src={item.logoUrl}
                          alt={item.name}
                          width={120}
                          height={44}
                          className="tc-partner-logo-img"
                        />
                      </div>
                    ) : (
                      <div className="tc-partner-logo tc-partner-logo--text">{item.name}</div>
                    )}
                    <h3 className="tc-partner-name">{item.name}</h3>
                    <p className="tc-partner-meta">{item.tag} · {item.location}</p>
                    <p className="tc-quote">{item.description}</p>
                    {item.url ? (
                      <a
                        className="sc-visit-link"
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {c.stores.visitSite} →
                      </a>
                    ) : null}
                  </>
                ) : (
                  <>
                    <div className="tc-benefit-icon">{item.icon}</div>
                    <h3 className="tc-benefit-title">{item.title}</h3>
                    <p className="tc-quote">{item.text}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="tarifs">
        <div className="container">
          <div className="pricing-header reveal">
            <div className="section-label">{c.pricing.label}</div>
            <h2 className="pricing-title">{c.pricing.title} <em>{c.pricing.titleEm}</em></h2>
            <p style={{ color: 'var(--white-60)', fontSize: '15px' }}>{c.pricing.sub}</p>
          </div>
          <div className="pricing-billing-toggle reveal" role="tablist" aria-label={c.pricing.label}>
            <button
              type="button"
              role="tab"
              aria-selected={!isAnnualBilling}
              className={`pricing-billing-option${!isAnnualBilling ? ' active' : ''}`}
              onClick={() => setBillingPeriod('monthly')}
            >
              {c.pricing.billingMonthly}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isAnnualBilling}
              className={`pricing-billing-option${isAnnualBilling ? ' active' : ''}`}
              onClick={() => setBillingPeriod('annual')}
            >
              {c.pricing.billingAnnual}
              <span className="pricing-billing-save">{c.pricing.billingSave}</span>
            </button>
          </div>
          <div className="pricing-grid">
            {c.pricing.plans.map((plan, i) => (
              <div
                className={`price-card ${plan.featured ? 'featured' : ''} reveal reveal-delay-${i + 1}`}
                key={plan.plan}
              >
                {plan.featured ? <span className="price-badge">{c.pricing.popular}</span> : null}
                <div className="price-plan">{plan.plan}</div>
                <div className="price-amount">
                  <sup>{ClassCountry.DEFAULT_CURRENCY}</sup>
                  {isAnnualBilling ? plan.priceAnnual : plan.price}
                  <sub>{isAnnualBilling ? c.pricing.perYear : c.pricing.perMonth}</sub>
                </div>
                <p className="price-desc">{plan.desc}</p>
                <ul className="price-features">
                  {plan.features.map((feature, j) => <li key={j}>{feature}</li>)}
                </ul>
                <Link href={REQUEST_DEMO_PATH} className={`btn-price ${plan.featured ? 'primary' : ''}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="pricing-addon reveal">
            <div className="pricing-addon-body">
              <div className="section-label">{c.pricing.websiteOption.label}</div>
              <h3 className="pricing-addon-title">{c.pricing.websiteOption.title}</h3>
              <p className="pricing-addon-desc">{c.pricing.websiteOption.desc}</p>
            </div>
            <div className="pricing-addon-side">
              <div className="price-amount pricing-addon-price">
                <sup>{ClassCountry.DEFAULT_CURRENCY}</sup>{c.pricing.websiteOption.price}
                <sub>{c.pricing.websiteOption.priceOnce}</sub>
              </div>
              <Link href={REQUEST_DEMO_PATH} className="btn-price">{c.pricing.websiteOption.cta}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="demo">
        <div className="cta-banner">
          <div className="cta-bg">
            <Image src={IMAGES.cta} alt="" fill sizes="100vw" priority={false} />
          </div>
          <div className="cta-content">
            <div className="gold-divider reveal" />
            <h2 className="cta-title reveal">
              {c.cta.title}
              <em>{c.cta.titleEm}</em>
            </h2>
            <p className="cta-sub reveal reveal-delay-1">{t(c.cta.sub)}</p>
            <div className="cta-btns reveal reveal-delay-2">
              <Link href={REQUEST_DEMO_PATH} className="btn-primary">
                {c.cta.primary}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a href="tel:+33123456789" className="btn-ghost">{c.cta.secondary}</a>
            </div>
            <p className="cta-note reveal reveal-delay-3">{c.cta.note}</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  )
}
