export interface Blog {
  id: string
  slug: string
  name: string
  description: string
  publicUrl: string
  settings: Record<string, unknown>
}

export interface Post {
  id: string
  slug: string
  title: string
  subtitle: string
  summary: string
  coverUrl: string
  body: string
  tags: string[]
  custom: Record<string, unknown>
  /** ISO 8601; vazio se o post não tem data. */
  publishedAt: string
}
