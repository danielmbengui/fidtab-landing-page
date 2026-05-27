'use client'

import { LanguageProvider } from '@/context/LanguageProvider'

export default function Providers({ children }) {
  return <LanguageProvider>{children}</LanguageProvider>
}
