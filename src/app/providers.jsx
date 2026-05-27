'use client'

import { AuthProvider } from '@/context/AuthProvider'
import { LanguageProvider } from '@/context/LanguageProvider'
import { ThemeProvider } from '@/context/ThemeProvider'

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>{children}</AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
