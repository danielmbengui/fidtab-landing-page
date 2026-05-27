/** Arrête proprement une instance Html5Qrcode (stop + clear). */
export async function stopHtml5QrcodeScanner(scanner) {
  if (!scanner) return

  try {
    if (scanner.isScanning) {
      await scanner.stop()
    }
  } catch {
    /* ignore */
  }

  try {
    scanner.clear()
  } catch {
    /* ignore */
  }
}
