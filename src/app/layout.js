import { DM_Sans, Noto_Sans_Arabic, Syne } from 'next/font/google'
import { WEBSITE_NAME } from '@/context/constants/constants_app'
import { themeInitScript } from '@/lib/theme'
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

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
})

export const metadata = {
  title: `${WEBSITE_NAME} — Administration`,
  description: 'Espace d\'administration FidTab.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${syne.variable} ${dmSans.variable} ${notoArabic.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
