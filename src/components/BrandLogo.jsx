import { getBrandLogoParts } from '@/context/constants/constants_app'

export default function BrandLogo({ className = '', tag: Tag = 'span' }) {
  const { primary, accent } = getBrandLogoParts()

  return (
    <Tag className={className}>
      {primary}
      {accent ? <span>{accent}</span> : null}
    </Tag>
  )
}
