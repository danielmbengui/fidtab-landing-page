import { DM_Sans, Syne } from 'next/font/google'
import { WEBSITE_NAME } from '@/context/constants/constants_app'
import { messages } from '@/i18n/messages'
import Providers from './providers'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

const defaultMeta = messages.fr.meta

export const metadata = {
  title: `${WEBSITE_NAME} — ${defaultMeta.titleSuffix}`,
  description: defaultMeta.description,
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${syne.variable} ${dmSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
