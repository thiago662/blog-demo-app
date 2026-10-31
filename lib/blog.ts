import { siteConfig } from '@/site.config'
import { decodeFields, docId, runQuery, type FsDoc } from './firestore'
import type { Blog, Post } from './types'

const str = (v: unknown) => (typeof v === 'string' ? v : '')
const obj = (v: unknown) => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {})

export function toBlog(doc: FsDoc): Blog {
  const f = decodeFields(doc.fields)
  return {
    id: docId(doc),
    slug: str(f.slug),
    name: str(f.name),
    description: str(f.description),
    publicUrl: str(f.publicUrl),
    settings: obj(f.settings),
  }
}

export function toPost(doc: FsDoc): Post {
  const f = decodeFields(doc.fields)
  return {
    id: docId(doc),
    slug: str(f.slug),
    title: str(f.title),
    subtitle: str(f.subtitle),
    summary: str(f.summary),
    coverUrl: str(f.coverUrl),
    body: str(f.body),
    tags: Array.isArray(f.tags) ? f.tags.filter((t): t is string => typeof t === 'string') : [],
    custom: obj(f.custom),
    publishedAt: str(f.publishedAt),
  }
}

// Cada build consulta o Firestore uma vez só, mesmo com uma página por post.
let cache: Promise<{ blog: Blog; posts: Post[] }> | undefined

async function load() {
  const [blogDoc] = await runQuery({
    from: [{ collectionId: 'blogs' }],
    where: { fieldFilter: { field: { fieldPath: 'slug' }, op: 'EQUAL', value: { stringValue: siteConfig.blogSlug } } },
    limit: 1,
  })
  if (!blogDoc) throw new Error(`Blog "${siteConfig.blogSlug}" não encontrado no Firestore`)
  const blog = toBlog(blogDoc)
  // O filtro status == 'published' é obrigatório: sem ele as rules negam a consulta inteira.
  const postDocs = await runQuery(
    {
      from: [{ collectionId: 'posts' }],
      where: { fieldFilter: { field: { fieldPath: 'status' }, op: 'EQUAL', value: { stringValue: 'published' } } },
      orderBy: [{ field: { fieldPath: 'publishedAt' }, direction: 'DESCENDING' }],
    },
    `blogs/${blog.id}`,
  )
  return { blog, posts: postDocs.map(toPost) }
}

const data = () => (cache ??= load())

export const getBlog = async () => (await data()).blog
export const listPosts = async () => (await data()).posts
export const getPost = async (slug: string) => (await data()).posts.find((p) => p.slug === slug)
