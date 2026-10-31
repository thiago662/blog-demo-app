// Padrões do exemplo; quem adapta troca estes valores (ou define as variáveis de ambiente).
export const siteConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID ?? 'ademiro-dac27',
  blogSlug: process.env.BLOG_SLUG ?? 'blog-demo',
  siteUrl: process.env.SITE_URL ?? 'https://thiago662.github.io/blog-demo-app',
  // Nome do repositório no GitHub Pages; vazio se o site fica na raiz do domínio.
  basePath: process.env.BASE_PATH ?? '/blog-demo-app',
}

/** Imagem do card de links (1200x630) quando a página não tem a sua; troque o arquivo em `public/`. */
export const defaultOgImage = `${siteConfig.siteUrl}/og-default.png`
