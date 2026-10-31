import type { Blog, Post } from './types'

/** Leitura tolerante dos campos customizados do blog-demo (qualquer um pode faltar). */
export function postFacts(blog: Blog, post: Post) {
  const { autor } = blog.settings
  const { humor, leitura_min } = post.custom
  return {
    autor: typeof autor === 'string' ? autor : '',
    humor: typeof humor === 'string' ? humor : '',
    leituraMin: typeof leitura_min === 'number' ? leitura_min : 0,
  }
}

export const formatDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('pt-BR', { dateStyle: 'long', timeZone: 'America/Sao_Paulo' }) : ''
