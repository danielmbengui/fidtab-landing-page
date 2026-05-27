'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { useLanguage } from '@/context/LanguageProvider'
import { stopHtml5QrcodeScanner } from '@/lib/html5QrcodeCleanup'

const BARCODE_FORMATS = [
  'EAN_13',
  'EAN_8',
  'UPC_A',
  'UPC_E',
  'CODE_128',
  'CODE_39',
  'QR_CODE',
]

export default function ProductBarcodeField({
  value,
  onChange,
  disabled = false,
  checking = false,
  intro,
}) {
  const { content: c } = useLanguage()
  const b = c.products.barcode
  const introText = intro ?? c.products.createIntro
  const readerId = useId().replace(/:/g, '')
  const scannerRef = useRef(null)
  const onChangeRef = useRef(onChange)
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState('')

  onChangeRef.current = onChange

  useEffect(() => {
    if (!scanning) return undefined

    let cancelled = false

    async function startScanner() {
      try {
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode')
        if (cancelled) return

        const formatsToSupport = BARCODE_FORMATS.map(
          (format) => Html5QrcodeSupportedFormats[format],
        ).filter(Boolean)

        const scanner = new Html5Qrcode(readerId)
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 280, height: 120 },
            formatsToSupport,
          },
          (decodedText) => {
            onChangeRef.current(String(decodedText ?? '').trim())
            setScanError('')
            setScanning(false)
          },
          () => {},
        )
      } catch (err) {
        if (!cancelled) {
          setScanError(err?.message ?? b.cameraError)
          setScanning(false)
        }
      }
    }

    startScanner()

    return () => {
      cancelled = true
      const scanner = scannerRef.current
      scannerRef.current = null
      void stopHtml5QrcodeScanner(scanner)
    }
  }, [scanning, readerId, b.cameraError])

  function toggleScanner() {
    if (disabled || checking) return
    setScanError('')
    setScanning((current) => !current)
  }

  return (
    <div className="products-barcode-field">
      <p className="products-barcode-intro">{introText}</p>
      <label className="login-field products-field" htmlFor="product-bar-code-input">
        <span>{c.products.fields.barCode}</span>
        <span className="loyalty-field-hint">{b.hint}</span>
        <div className="products-barcode-row">
          <input
            id="product-bar-code-input"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            inputMode="numeric"
            autoComplete="off"
            placeholder={b.placeholder}
            aria-busy={checking}
          />
          <button
            type="button"
            className="btn-ghost products-barcode-scan-btn"
            onClick={toggleScanner}
            disabled={disabled || checking}
          >
            {scanning ? b.stopScan : b.scan}
          </button>
        </div>
        {checking ? (
          <span className="loyalty-field-hint">{b.checking}</span>
        ) : null}
        {scanning ? (
          <div id={readerId} className="products-barcode-scanner" />
        ) : null}
        {scanError ? (
          <span className="login-field-error">{scanError}</span>
        ) : null}
      </label>
    </div>
  )
}
