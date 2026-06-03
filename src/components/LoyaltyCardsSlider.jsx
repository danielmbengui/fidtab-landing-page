'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { DOWNLOAD_APP_PATH, WEBSITE_NAME } from '@/context/constants/constants_app'
import { IMAGES } from '@/config/visuals'

function LoyaltyCardSlide({ card, loyalty, cardSubs, cardRewardLabel, t }) {
  return (
    <Link
      href={DOWNLOAD_APP_PATH}
      className={`big-loyalty-card loyalty-card-slide ${card.theme}`}
      aria-label={loyalty.cta}
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
      <div className="blc-type">{loyalty.cardTypeLabel}</div>
      <div className="blc-store" style={{ color: card.accentColor }}>{card.store}</div>
      <div className="blc-store-sub">
        {card.subText || (card.subKey ? cardSubs[card.subKey] : '')}
      </div>
      <div className="blc-body">
        <div className="blc-points-block">
          <div className="blc-pts-num" style={{ color: card.accentColor }}>{card.points}</div>
          <div className="blc-pts-label">{loyalty.pointsLabel}</div>
        </div>
        <div className="blc-reward">
          <div className="blc-reward-val" style={{ color: card.accentColor }}>{card.reward}</div>
          <div className="blc-reward-label">{t(cardRewardLabel, { pts: card.rewardAt })}</div>
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
          <span className="blc-field-label">{loyalty.cardMemberLabel}</span>
          <span className="blc-field-value">{card.memberName}</span>
        </div>
        <div className="blc-card-no">
          <span className="blc-field-label">{loyalty.cardNumberLabel}</span>
          <span className="blc-field-value">{card.cardNumber}</span>
        </div>
      </div>
      <div className="blc-bottom">
        <div className="blc-barcode" aria-hidden="true" />
        <div className="blc-brand">{WEBSITE_NAME}</div>
      </div>
    </Link>
  )
}

export default function LoyaltyCardsSlider({ cards, loyalty, cardSubs, cardRewardLabel, t }) {
  const [activeCard, setActiveCard] = useState(0)
  const trackRef = useRef(null)
  const slideRefs = useRef([])
  const pauseAutoRef = useRef(false)
  const scrollPauseTimerRef = useRef(null)

  const scrollToCard = useCallback((index, behavior = 'smooth') => {
    const track = trackRef.current
    const slide = slideRefs.current[index]
    if (!track || !slide) return

    const left = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2
    track.scrollTo({ left: Math.max(0, left), behavior })
    setActiveCard(index)
  }, [])

  useEffect(() => {
    setActiveCard((index) => (index >= cards.length ? 0 : index))
    slideRefs.current = slideRefs.current.slice(0, cards.length)
  }, [cards.length])

  useEffect(() => {
    if (cards.length <= 1) return undefined

    const timer = setInterval(() => {
      if (pauseAutoRef.current) return
      setActiveCard((current) => {
        const next = (current + 1) % cards.length
        const track = trackRef.current
        const slide = slideRefs.current[next]
        if (track && slide) {
          const left = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2
          track.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
        }
        return next
      })
    }, 3500)

    return () => clearInterval(timer)
  }, [cards.length])

  const onTrackScroll = useCallback(() => {
    pauseAutoRef.current = true
    if (scrollPauseTimerRef.current) {
      window.clearTimeout(scrollPauseTimerRef.current)
    }
    scrollPauseTimerRef.current = window.setTimeout(() => {
      pauseAutoRef.current = false
    }, 8000)

    const track = trackRef.current
    if (!track) return

    const slides = slideRefs.current.filter(Boolean)
    if (!slides.length) return

    const center = track.scrollLeft + track.clientWidth / 2
    let closest = 0
    let minDistance = Infinity

    slides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2
      const distance = Math.abs(center - slideCenter)
      if (distance < minDistance) {
        minDistance = distance
        closest = index
      }
    })

    setActiveCard(closest)
  }, [])

  const onDotClick = (index) => {
    pauseAutoRef.current = true
    scrollToCard(index)
    window.setTimeout(() => {
      pauseAutoRef.current = false
    }, 8000)
  }

  return (
    <div className="loyalty-visual-stack">
      <div className="loyalty-bg-photo">
        <Image src={IMAGES.loyalty} alt="" fill sizes="420px" />
      </div>

      <div className="floating-stat stat-tl">
        <span className="fs-num">+68%</span>
        <span className="fs-label">{loyalty.statReturn}</span>
      </div>

      <div
        ref={trackRef}
        className="loyalty-cards-track"
        onScroll={onTrackScroll}
        role="region"
        aria-roledescription="carousel"
        aria-label={loyalty.cardTypeLabel}
      >
        {cards.map((item, index) => (
          <div
            key={item.key}
            ref={(node) => {
              slideRefs.current[index] = node
            }}
            className="loyalty-card-slide-wrap"
            aria-hidden={index !== activeCard}
          >
            <LoyaltyCardSlide
              card={item}
              loyalty={loyalty}
              cardSubs={cardSubs}
              cardRewardLabel={cardRewardLabel}
              t={t}
            />
          </div>
        ))}
      </div>

      {cards.length > 1 && (
        <div className="card-switcher">
          {cards.map((item, index) => (
            <button
              key={item.key}
              type="button"
              className={`cs-dot${item.source === 'firestore' ? ' cs-dot-live' : ''}${index === activeCard ? ' active' : ''}`}
              onClick={() => onDotClick(index)}
              aria-label={item.store}
              aria-current={index === activeCard ? 'true' : undefined}
            />
          ))}
        </div>
      )}

      <div className="floating-stat stat-br">
        <span className="fs-num">3 200+</span>
        <span className="fs-label">{loyalty.statActive}</span>
      </div>
    </div>
  )
}
