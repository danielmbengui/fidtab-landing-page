'use client'

import { useEffect, useId, useRef, useState } from 'react'
import ImageLightbox from '@/components/common/ImageLightbox'
import { useLanguage } from '@/context/LanguageProvider'
import {
  deleteStorageImage,
  getStorageDownloadUrl,
  isImageFile,
  uploadStorageImage,
} from '@/lib/storageImage'

export default function StorageImageField({
  label,
  storagePath = '',
  previewUrl = '',
  defaultStoragePath = '',
  readOnly = false,
  disabled = false,
  error,
  onChange,
}) {
  const { content: c } = useLanguage()
  const t = c.brands.fields
  const inputId = useId()
  const inputRef = useRef(null)
  const [resolvedUrl, setResolvedUrl] = useState('')
  const [localPreview, setLocalPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [fieldError, setFieldError] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const displayUrl = localPreview || previewUrl || resolvedUrl
  const hasImage = Boolean(displayUrl)
  const isBusy = disabled || uploading
  const pathForUpload = storagePath || defaultStoragePath

  useEffect(() => {
    let active = true
    setResolvedUrl('')

    if (previewUrl || localPreview || !storagePath) {
      return () => {
        active = false
      }
    }

    getStorageDownloadUrl(storagePath).then((url) => {
      if (active && url) setResolvedUrl(url)
    })

    return () => {
      active = false
    }
  }, [storagePath, previewUrl, localPreview])

  useEffect(() => () => {
    if (localPreview.startsWith('blob:')) {
      URL.revokeObjectURL(localPreview)
    }
  }, [localPreview])

  function openFilePicker() {
    if (isBusy || readOnly) return
    inputRef.current?.click()
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !isImageFile(file)) return

    const targetPath = pathForUpload
    if (!targetPath) {
      setFieldError(t.photoUploadError)
      return
    }

    const blobUrl = URL.createObjectURL(file)
    setLocalPreview((previous) => {
      if (previous.startsWith('blob:')) URL.revokeObjectURL(previous)
      return blobUrl
    })
    setFieldError('')
    setUploading(true)

    try {
      const downloadUrl = await uploadStorageImage(targetPath, file)
      setLocalPreview('')
      onChange?.({
        storage_url: targetPath,
        photo_url: downloadUrl,
      })
    } catch (uploadError) {
      console.error('StorageImageField.upload', uploadError)
      setLocalPreview('')
      setFieldError(t.photoUploadError)
    } finally {
      setUploading(false)
    }
  }

  async function handleRemove() {
    if (isBusy || readOnly || !hasImage) return

    setFieldError('')
    setUploading(true)

    try {
      if (storagePath) {
        await deleteStorageImage(storagePath)
      }
      setLocalPreview((previous) => {
        if (previous.startsWith('blob:')) URL.revokeObjectURL(previous)
        return ''
      })
      setResolvedUrl('')
      onChange?.({
        storage_url: defaultStoragePath || storagePath,
        photo_url: '',
      })
    } catch (removeError) {
      console.error('StorageImageField.remove', removeError)
      setFieldError(t.photoRemoveError)
    } finally {
      setUploading(false)
    }
  }

  function openLightbox() {
    if (!hasImage) return
    setLightboxOpen(true)
  }

  return (
    <div className="login-field products-field storage-image-field">
      <span>{label}</span>

      <div className="storage-image-field-body">
        {hasImage ? (
          <button
            type="button"
            className="storage-image-preview-btn"
            onClick={openLightbox}
            aria-label={t.openPreview}
            disabled={uploading}
          >
            <img src={displayUrl} alt="" className="storage-image-preview" />
          </button>
        ) : (
          <div className="storage-image-placeholder" aria-hidden="true">
            <span>{t.noPhoto}</span>
          </div>
        )}

        {!readOnly ? (
          <div className="storage-image-actions">
            <button
              type="button"
              className="btn-ghost storage-image-action"
              onClick={openFilePicker}
              disabled={isBusy || !pathForUpload}
            >
              {uploading ? t.uploadingPhoto : (hasImage ? t.changePhoto : t.addPhoto)}
            </button>
            {hasImage ? (
              <button
                type="button"
                className="btn-ghost storage-image-action storage-image-action--danger"
                onClick={handleRemove}
                disabled={isBusy}
              >
                {t.removePhoto}
              </button>
            ) : null}
          </div>
        ) : null}

        {!readOnly ? (
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/*"
            className="storage-image-input"
            onChange={handleFileChange}
            disabled={isBusy}
            tabIndex={-1}
          />
        ) : null}
      </div>

      {error || fieldError ? (
        <span className="login-field-error">{error || fieldError}</span>
      ) : null}

      {lightboxOpen && displayUrl ? (
        <ImageLightbox
          src={displayUrl}
          alt={t.openPreview}
          closeLabel={t.closePreview}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </div>
  )
}
