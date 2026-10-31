import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { siteConfig } from '@/site.config'
import { getBlog, getPost, listPosts } from '@/lib/blog'
import { formatDate, postFacts } from '@/lib/fields'
import { renderMarkdown } from '@/lib/markdown'

type Props = { params: Promise<{ slug: string }> }

// Exportação estática: só existem as páginas dos posts publicados no momento do build.
export const dynamicParams = false

export async function generateStaticParams() {
  return (await listPosts()).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug)
  if (!post) return {}
  const description = post.summary || post.subtitle
  const images = post.coverUrl ? [post.coverUrl] : undefined
  return {
    title: post.title,
    description,
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: `${siteConfig.siteUrl}/${post.slug}/`,
      publishedTime: post.publishedAt || undefined,
      tags: post.tags,
      images,
    },
    twitter: { card: images ? 'summary_large_image' : 'summary', title: post.title, description, images },
  }
}

export default async function PostPage({ params }: Props) {
  const [blog, post] = await Promise.all([getBlog(), getPost((await params).slug)])
  if (!post) notFound()
  const { autor, humor, leituraMin } = postFacts(blog, post)
  const facts = [
    formatDate(post.publishedAt),
    autor && `por ${autor}`,
    leituraMin > 0 && `${leituraMin} min de leitura`,
    humor && `humor: ${humor}`,
  ].filter(Boolean)

  return (
    <main className="container py-5">
      <article>
        <h1>{post.title}</h1>
        {post.subtitle && <p className="lead">{post.subtitle}</p>}
        <p className="text-body-secondary">{facts.join(' · ')}</p>
        {post.coverUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- export estático, sem otimização de imagem
          <img src={post.coverUrl} alt="" className="img-fluid mb-4" />
        )}
        <div className="post-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
        {post.tags.length > 0 && <p className="text-body-secondary mt-4">Tags: {post.tags.join(', ')}</p>}
      </article>
    </main>
  )
}
