'use client'

import { useEffect, useState } from 'react'
import SiteFooter from '@/components/SiteFooter'
import SiteNav from '@/components/SiteNav'
import { useLanguage } from '@/context/LanguageProvider'
import { WEBSITE_NAME } from '@/context/constants/constants_app'

export default function SecondaryPageShell({ metaTitle, children, activeFooterPage = null }) {
  const { content: c } = useLanguage()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (metaTitle) {
      document.title = `${WEBSITE_NAME} — ${metaTitle}`
    }
  }, [metaTitle])

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

      <main className="secondary-page">{children}</main>

      <SiteFooter activePage={activeFooterPage} />
    </div>
  )
}
