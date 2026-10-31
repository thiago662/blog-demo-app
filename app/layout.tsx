import type { Metadata } from 'next'
import Link from 'next/link'
import { GeistSans } from 'geist/font/sans'
import 'bootstrap/dist/css/bootstrap.min.css'
import { siteConfig } from '@/site.config'
import { getBlog } from '@/lib/blog'

export async function generateMetadata(): Promise<Metadata> {
  const blog = await getBlog()
  return {
    metadataBase: new URL(siteConfig.siteUrl + '/'),
    title: { default: blog.name, template: `%s | ${blog.name}` },
    description: blog.description,
    openGraph: { siteName: blog.name, locale: 'pt_BR' },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const blog = await getBlog()
  return (
    <html lang="pt-BR" className={GeistSans.className}>
      <body>
        <header className="border-bottom">
          <div className="container py-3">
            <Link href="/" className="fw-bold text-decoration-none">
              {blog.name}
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
