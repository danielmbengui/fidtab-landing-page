'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import BrandLogo from '@/components/BrandLogo'
import LanguageSelector from '@/components/LanguageSelector'

export default function SiteNav({
  c,
  scrolled,
  menuOpen,
  setMenuOpen,
  activeSection = '',
  demoPageActive = false,
}) {
  const isNavLinkActive = (sectionId) => activeSection === sectionId

  const navLinks = [
    { href: '/#fonctionnalites', sectionId: 'fonctionnalites', label: c.nav.features },
    { href: '/#fidelite', sectionId: 'fidelite', label: c.nav.loyalty },
    { href: '/#comment', sectionId: 'comment', label: c.nav.how },
    { href: '/#tarifs', sectionId: 'tarifs', label: c.nav.pricing },
  ]

  useEffect(() => {
    if (!menuOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  return (
    <>
      <nav className={`nav${demoPageActive ? ' nav--minimal' : ''}${menuOpen ? ' nav--menu-open' : ''}${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-start">
            {!demoPageActive ? (
              <button
                type="button"
                className="nav-burger nav-burger--open"
                onClick={() => setMenuOpen(true)}
                aria-label="Ouvrir le menu"
                aria-expanded={menuOpen}
              >
                <span /><span /><span />
              </button>
            ) : null}
            <Link href="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
              <BrandLogo variant="nav" showName priority />
            </Link>
          </div>
          {!demoPageActive ? (
            <ul className="nav-links">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={isNavLinkActive(link.sectionId) ? 'active' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#demo"
                  className={`nav-cta${isNavLinkActive('demo') ? ' active' : ''}`}
                >
                  {c.nav.cta}
                </Link>
              </li>
            </ul>
          ) : null}
          <div className="nav-right">
            <LanguageSelector />
            {!demoPageActive ? (
              <button
                type="button"
                className="nav-burger nav-burger--close open"
                onClick={() => setMenuOpen(false)}
                aria-label="Fermer le menu"
              >
                <span /><span /><span />
              </button>
            ) : null}
          </div>
        </div>
      </nav>

      {!demoPageActive ? (
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isNavLinkActive(link.sectionId) ? 'active' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#demo"
            className={isNavLinkActive('demo') ? 'active' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {c.nav.cta}
          </Link>
        </div>
      ) : null}
    </>
  )
}
