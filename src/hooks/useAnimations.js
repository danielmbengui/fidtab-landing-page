'use client'

import { useEffect, useRef, useState } from 'react'

export function useScrollReveal(contentKey, rescanKey = '') {
  useEffect(() => {
    const observed = new WeakSet()
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )

    const observeNew = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => {
        if (observed.has(el)) return
        observed.add(el)
        observer.observe(el)
      })
    }

    observeNew()

    const mutationObserver = new MutationObserver(observeNew)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [contentKey, rescanKey])
}

export function useParallax() {
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      document.querySelectorAll('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax') || '0.15')
        el.style.transform = `translateY(${y * speed}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

function parseCounterValue(value) {
  const match = value.match(/^([+]?)(\d+(?:\s\d+)*)(.*)$/)
  if (!match) return null

  const target = parseInt(match[2].replace(/\s/g, ''), 10)
  if (Number.isNaN(target)) return null

  return {
    prefix: match[1],
    rest: match[3],
    target,
  }
}

export function AnimatedCounter({ value, suffix = '' }) {
  const parsed = parseCounterValue(value)

  if (!parsed) {
    return <span>{value}{suffix}</span>
  }

  return (
    <AnimatedCounterInner
      prefix={parsed.prefix}
      rest={parsed.rest}
      target={parsed.target}
      suffix={suffix}
    />
  )
}

function AnimatedCounterInner({ prefix, rest, target, suffix }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState(`${prefix}0${rest}`)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const duration = 1400
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - (1 - p) ** 3
          const current = Math.round(target * eased)
          const formatted = current >= 1000
            ? current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
            : String(current)
          setDisplay(`${prefix}${formatted}${rest}${suffix}`)
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [prefix, rest, suffix, target])

  return <span ref={ref}>{display}</span>
}
