'use client'

import { LanguageProvider } from '@/context/LanguageProvider'
import { ThemeProvider } from '@/context/ThemeProvider'

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  )
}
