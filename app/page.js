'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import AppPhoneMockup from '@/components/AppPhoneMockup'
import BrandLogo from '@/components/BrandLogo'
import LanguageSelector from '@/components/LanguageSelector'
import { useLanguage } from '@/context/LanguageProvider'
import { FEATURE_LAYOUT, IMAGES } from '@/config/visuals'
import { AnimatedCounter, useParallax, useScrollReveal } from '@/hooks/useAnimations'

export default function Home() {
  const { content: c, t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCard, setActiveCard] = useState(0)

  useScrollReveal([c])
  useParallax()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const timer = setInterval(() => setActiveCard((i) => (i + 1) % c.cards.length), 3500)
    return () => clearInterval(timer)
  }, [c.cards.length])

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

  const card = c.cards[activeCard]
  const navLinks = [
    { href: '#fonctionnalites', label: c.nav.features },
    { href: '#fidelite', label: c.nav.loyalty },
    { href: '#comment', label: c.nav.how },
    { href: '#tarifs', label: c.nav.pricing },
  ]

  return (
    <div className="page-wrap">
      <div className="page-ambient" aria-hidden="true">
        <div className="ambient-grid" />
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#" className="nav-logo" onClick={() => setMenuOpen(false)}>
            <BrandLogo />
          </a>
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.href}><a href={link.href}>{link.label}</a></li>
            ))}
            <li><a href="#demo" className="nav-cta">{c.nav.cta}</a></li>
          </ul>
          <div className="nav-right">
            <LanguageSelector />
            <button
              type="button"
              className={`nav-burger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
        ))}
        <a href="#demo" onClick={() => setMenuOpen(false)}>{c.nav.cta}</a>
      </div>

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
                <a href="#demo" className="btn-primary">
                  {c.hero.ctaPrimary}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
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
              <div className="hero-photo-back left" data-parallax="0.08">
                <Image src={IMAGES.hero.shop} alt="" fill sizes="220px" priority />
                <span className="hero-photo-caption">{c.cardSubs.presse}</span>
              </div>
              <div className="hero-photo-back right" data-parallax="0.12">
                <Image src={IMAGES.hero.counter} alt="" fill sizes="200px" priority />
                <span className="hero-photo-caption">{c.hero.floatOrder.label}</span>
              </div>

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
          </div>
        </div>
      </section>

      {/* MARQUEE PARTNERS */}
      <div className="logos-strip">
        <p className="logos-label">{t(c.logos.label)}</p>
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div className="marquee-content" key={copy} aria-hidden={copy === 1}>
              {c.partnerLogos.map((name) => (
                <div className="logo-pill" key={`${copy}-${name}`}>
                  <span className="logo-pill-dot" />
                  <span className="logo-pill-name">{name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

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
              <a href="#demo" className="btn-primary reveal reveal-delay-3">
                {c.loyalty.cta}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
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

                <div className={`big-loyalty-card ${card.theme}`}>
                  <div className="blc-top">
                    <div>
                      <div className="blc-store" style={{ color: card.accentColor }}>{card.store}</div>
                      <div className="blc-store-sub">{c.cardSubs[card.subKey]}</div>
                    </div>
                    <div className={`blc-logo ${card.logoClass}`}>{card.logo}</div>
                  </div>
                  <div className="blc-mid">
                    <div>
                      <div className="blc-pts-num" style={{ color: card.accentColor }}>{card.points}</div>
                      <div className="blc-pts-label">{c.loyalty.pointsLabel}</div>
                    </div>
                    <div className="blc-reward">
                      <div className="blc-reward-val" style={{ color: card.accentColor }}>{card.reward}</div>
                      <div className="blc-reward-label">{t(c.cardRewardLabel, { pts: card.rewardAt })}</div>
                    </div>
                  </div>
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

                <div className="card-switcher">
                  {c.cards.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`cs-dot ${i === activeCard ? 'active' : ''}`}
                      onClick={() => setActiveCard(i)}
                      aria-label={`Card ${i + 1}`}
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
            {c.storeCards.map((store, i) => (
              <div
                className={`store-card reveal reveal-delay-${i + 1}${store.cls ? ` ${store.cls}` : ''}`}
                key={i}
              >
                <div className={`store-card-top${store.cls ? ` ${store.cls}` : ''}`}>
                  <Image
                    src={IMAGES.stores[i]}
                    alt={store.name}
                    fill
                    sizes="(max-width:768px) 100vw, 400px"
                  />
                  {store.online && (
                    <span className="sc-live-badge">{c.stores.online}</span>
                  )}
                  <div className="sc-logo">
                    {store.logoUrl ? (
                      <Image
                        src={store.logoUrl}
                        alt={store.name}
                        width={140}
                        height={48}
                        className="sc-logo-img"
                      />
                    ) : (
                      store.logo
                    )}
                  </div>
                </div>
                <div className="store-card-body">
                  <div className="sc-name">{store.name}</div>
                  {store.tag && <div className="sc-tag">{store.tag}</div>}
                  <div className="sc-addr">📍 {store.addr}</div>
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
              {c.testimonials.title} <em>{c.testimonials.titleEm}</em>
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
                    <div className="tc-partner-logo">
                      <Image
                        src={item.logoUrl}
                        alt={item.name}
                        width={120}
                        height={44}
                        className="tc-partner-logo-img"
                      />
                    </div>
                    <h3 className="tc-partner-name">{item.name}</h3>
                    <p className="tc-partner-meta">{item.tag} · {item.location}</p>
                    <p className="tc-quote">{item.description}</p>
                    <a
                      className="sc-visit-link"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {c.stores.visitSite} →
                    </a>
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
          <div className="pricing-grid">
            {c.pricing.plans.map((plan, i) => (
              <div className={`price-card ${plan.featured ? 'featured' : ''} reveal reveal-delay-${i + 1}`} key={i}>
                {plan.featured ? <span className="price-badge">{c.pricing.popular}</span> : null}
                <div className="price-plan">{plan.plan}</div>
                <div className="price-amount">
                  <sup>€</sup>{plan.price}<sub>{c.pricing.perMonth}</sub>
                </div>
                <p className="price-desc">{plan.desc}</p>
                <ul className="price-features">
                  {plan.features.map((feature, j) => <li key={j}>{feature}</li>)}
                </ul>
                <a href="#demo" className={`btn-price ${plan.featured ? 'primary' : ''}`}>{plan.cta}</a>
              </div>
            ))}
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
              <a href="mailto:contact@fidtab.com" className="btn-primary">
                {c.cta.primary}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="tel:+33123456789" className="btn-ghost">{c.cta.secondary}</a>
            </div>
            <p className="cta-note reveal reveal-delay-3">{c.cta.note}</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <BrandLogo className="footer-logo" />
            <ul className="footer-links">
              <li><a href="#fonctionnalites">{c.footer.features}</a></li>
              <li><a href="#tarifs">{c.footer.pricing}</a></li>
              <li><a href="#">{c.footer.legal}</a></li>
              <li><a href="#demo">{c.footer.contact}</a></li>
            </ul>
            <div className="footer-copy">{t(c.footer.copyright)}</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
