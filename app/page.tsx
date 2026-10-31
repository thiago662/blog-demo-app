import Link from 'next/link'
import { getBlog, listPosts } from '@/lib/blog'

export default async function Home() {
  const [blog, posts] = await Promise.all([getBlog(), listPosts()])
  return (
    <main className="container py-5">
      <h1>{blog.name}</h1>
      <p>{blog.description}</p>
      {posts.map((p) => (
        <Link key={p.id} href={`/${p.slug}/`} className="post-card d-block">
          <h2 className="h4">{p.title}</h2>
        </Link>
      ))}
    </main>
  )
}
