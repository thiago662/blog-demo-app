import Link from 'next/link'
import { getBlog, listPosts } from '@/lib/blog'
import { formatDate } from '@/lib/fields'

export default async function Home() {
  const [blog, posts] = await Promise.all([getBlog(), listPosts()])
  return (
    <main className="container py-5">
      <h1>{blog.name}</h1>
      <p className="lead">{blog.description}</p>
      {posts.length === 0 && <p>Nenhum post publicado ainda.</p>}
      {posts.map((p) => (
        <article key={p.id} className="post-card py-3 border-top">
          <h2 className="h4">
            <Link href={`/${p.slug}/`} className="post-card-link">
              {p.title}
            </Link>
          </h2>
          {p.subtitle && <p className="mb-1">{p.subtitle}</p>}
          {p.summary && <p className="text-body-secondary mb-1">{p.summary}</p>}
          <small className="text-body-secondary">
            {formatDate(p.publishedAt)}
            {p.tags.length > 0 && ` · ${p.tags.join(', ')}`}
          </small>
        </article>
      ))}
    </main>
  )
}
