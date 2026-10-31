import { siteConfig } from '@/site.config'

type FsValue = Record<string, unknown>
export type FsDoc = { name: string; fields?: Record<string, FsValue> }

const root = () =>
  `https://firestore.googleapis.com/v1/projects/${siteConfig.projectId}/databases/(default)/documents`

/** Converte um valor da API REST do Firestore em valor JS. Timestamps viram string ISO. */
export function decode(v: FsValue): unknown {
  if ('stringValue' in v) return v.stringValue
  if ('integerValue' in v) return Number(v.integerValue)
  if ('doubleValue' in v) return v.doubleValue
  if ('booleanValue' in v) return v.booleanValue
  if ('timestampValue' in v) return v.timestampValue
  if ('arrayValue' in v) {
    const values = (v.arrayValue as { values?: FsValue[] }).values ?? []
    return values.map(decode)
  }
  if ('mapValue' in v) return decodeFields((v.mapValue as { fields?: Record<string, FsValue> }).fields)
  return null
}

export function decodeFields(fields: Record<string, FsValue> = {}): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decode(v)]))
}

/** Consulta pública (sem login). `parent` é o caminho do documento pai, ex.: `blogs/blog-demo`. */
export async function runQuery(structuredQuery: object, parent = ''): Promise<FsDoc[]> {
  const res = await fetch(`${root()}${parent && '/' + parent}:runQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ structuredQuery }),
  })
  if (!res.ok) throw new Error(`Firestore ${res.status}: ${await res.text()}`)
  const rows = (await res.json()) as { document?: FsDoc }[]
  return rows.flatMap((r) => (r.document ? [r.document] : []))
}

export const docId = (doc: FsDoc) => doc.name.split('/').pop() as string
