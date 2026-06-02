import { DM_Sans, Noto_Sans_Arabic, Syne } from 'next/font/google'
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

const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
})

const defaultMeta = messages.fr.meta

export const metadata = {
  title: `${WEBSITE_NAME} — ${defaultMeta.titleSuffix}`,
  description: defaultMeta.description,
}

const themeInitScript = `(function(){try{var t=localStorage.getItem('fidtab-theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-theme',d?'dark':'light');document.documentElement.style.colorScheme=d?'dark':'light'}catch(e){}})();`

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${syne.variable} ${dmSans.variable} ${notoArabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
