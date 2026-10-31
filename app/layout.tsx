import type { Metadata } from 'next'
import Link from 'next/link'
import { GeistSans } from 'geist/font/sans'
import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'
import { defaultOgImage, siteConfig } from '@/site.config'
import { getBlog } from '@/lib/blog'
import ThemeToggle from './theme-toggle'

export async function generateMetadata(): Promise<Metadata> {
  const blog = await getBlog()
  return {
    metadataBase: new URL(siteConfig.siteUrl + '/'),
    title: { default: blog.name, template: `%s | ${blog.name}` },
    description: blog.description,
    // Páginas que definem o próprio `openGraph` (o post) substituem este objeto inteiro, não o mesclam.
    openGraph: {
      type: 'website',
      siteName: blog.name,
      locale: 'pt_BR',
      title: blog.name,
      description: blog.description,
      url: `${siteConfig.siteUrl}/`,
      images: [defaultOgImage],
    },
    twitter: { card: 'summary_large_image', title: blog.name, description: blog.description, images: [defaultOgImage] },
  }
}

// Roda antes da hidratação: tema salvo, ou o do sistema na 1ª visita (sem "piscar").
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-bs-theme',t)}catch(e){}})()`

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const blog = await getBlog()
  return (
    <html lang="pt-BR" className={GeistSans.className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <header className="site-header">
          <div className="wrap">
            <Link href="/" className="brand">
              {blog.name}
            </Link>
            <ThemeToggle />
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
