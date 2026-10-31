import type { NextConfig } from 'next'
import { siteConfig } from './site.config'

const config: NextConfig = {
  output: 'export',
  basePath: siteConfig.basePath,
  trailingSlash: true,
  images: { unoptimized: true },
}

export default config
