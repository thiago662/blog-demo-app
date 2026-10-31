import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import 'bootstrap/dist/css/bootstrap.min.css'
import { siteConfig } from '@/site.config'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl + '/'),
  title: 'Blog Demo',
  description: 'Site de exemplo do Ademiro de Blogs.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={GeistSans.className}>
      <body>{children}</body>
    </html>
  )
}
