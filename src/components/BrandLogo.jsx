import Image from 'next/image'
import { BRAND_LOGO, getBrandLogoParts, WEBSITE_NAME } from '@/context/constants/constants_app'

const VARIANTS = {
  nav: { src: BRAND_LOGO.only, width: 30, height: 30 },
  hero: { src: BRAND_LOGO.only, width: 56, height: 56 },
  footer: { src: BRAND_LOGO.only, width: 32, height: 32 },
  default: { src: BRAND_LOGO.only, width: 36, height: 36 },
}

export default function BrandLogo({
  className = '',
  tag: Tag = 'span',
  variant = 'default',
  priority = false,
  showName = false,
}) {
  const { src, width, height } = VARIANTS[variant] ?? VARIANTS.default
  const { primary, accent } = getBrandLogoParts(WEBSITE_NAME)

  return (
    <Tag className={`brand-logo brand-logo-${variant} ${className}`.trim()}>
      <Image
        src={src}
        alt={showName ? '' : WEBSITE_NAME}
        width={width}
        height={height}
        className="brand-logo-img"
        priority={priority}
        loading="eager"
        style={{ width: 'auto', height: 'auto' }}
      />
      {showName && (
        <span className="brand-logo-text" aria-hidden="true">
          {primary}
          {accent ? <span className="brand-logo-accent">{accent}</span> : null}
        </span>
      )}
    </Tag>
  )
}
