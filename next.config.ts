import type { NextConfig } from 'next'
import { siteConfig } from './site.config'

const config: NextConfig = {
  output: 'export',
  // O basePath existe por causa do GitHub Pages; no `npm run dev` o site abre em http://localhost:3000/.
  basePath: process.env.NODE_ENV === 'production' ? siteConfig.basePath : '',
  trailingSlash: true,
  images: { unoptimized: true },
}

export default config
