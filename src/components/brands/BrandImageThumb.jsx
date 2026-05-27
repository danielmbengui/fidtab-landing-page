'use client'

import { useEffect, useState } from 'react'
import { getStorageDownloadUrl } from '@/lib/storageImage'

export default function BrandImageThumb({ photoUrl, storagePath, className = 'brands-table-thumb' }) {
  const [src, setSrc] = useState(photoUrl || '')

  useEffect(() => {
    let active = true

    if (photoUrl) {
      setSrc(photoUrl)
      return () => {
        active = false
      }
    }

    if (!storagePath) {
      setSrc('')
      return () => {
        active = false
      }
    }

    getStorageDownloadUrl(storagePath).then((url) => {
      if (active) setSrc(url || '')
    })

    return () => {
      active = false
    }
  }, [photoUrl, storagePath])

  if (!src) return null

  return <img src={src} alt="" className={className} />
}
