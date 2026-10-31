import { describe, expect, it } from 'vitest'
import { toPost } from './blog'
import { decode } from './firestore'
import { renderMarkdown } from './markdown'

describe('renderMarkdown', () => {
  it('usa o título como alt quando o alt é a proporção do editor', () => {
    const html = renderMarkdown('![1.00](https://x.com/a.png "Minha legenda")')
    expect(html).toContain('alt="Minha legenda"')
  })

  it('mantém o alt comum', () => {
    expect(renderMarkdown('![Logo](https://x.com/a.png)')).toContain('alt="Logo"')
  })

  it('remove script, eventos e javascript:', () => {
    const html = renderMarkdown('<script>alert(1)</script>\n\n<img src="https://x.com/a.png" onerror="x()">\n\n[a](javascript:alert(1))')
    expect(html).not.toMatch(/script|onerror|javascript:/)
    expect(html).toContain('>a</a>')
  })

  it('aceita só imagens https', () => {
    expect(renderMarkdown('![a](http://x.com/a.png)')).not.toContain('src=')
  })

  it('renderiza tabela GFM com classe do Bootstrap e código com linguagem', () => {
    const html = renderMarkdown('| a | b |\n| - | - |\n| 1 | 2 |\n\n```ts\nconst x = 1\n```')
    expect(html).toContain('<table class="table">')
    expect(html).toContain('class="language-ts"')
  })
})

describe('decode / toPost', () => {
  it('decodifica tipos do Firestore', () => {
    expect(decode({ integerValue: '2' })).toBe(2)
    expect(decode({ arrayValue: {} })).toEqual([])
    expect(decode({ mapValue: { fields: { a: { stringValue: 'b' } } } })).toEqual({ a: 'b' })
  })

  it('tolera campos ausentes', () => {
    const post = toPost({ name: 'x/blogs/b/posts/p1', fields: { title: { stringValue: 'Oi' } } })
    expect(post).toMatchObject({ id: 'p1', title: 'Oi', subtitle: '', tags: [], custom: {}, publishedAt: '' })
  })
})
