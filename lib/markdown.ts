import { Marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

const marked = new Marked({
  gfm: true,
  renderer: {
    // O editor do Ademiro grava `![1.00](url "legenda")`: o alt é a proporção, a legenda vai no título.
    image({ href, title, text }) {
      const alt = /^\d+(\.\d+)?$/.test(text) ? (title ?? '') : text
      const img = `<img src="${href}" alt="${alt.replace(/"/g, '&quot;')}">`
      // A legenda fica visível; aria-hidden evita o leitor de tela ler o mesmo texto do alt duas vezes.
      return title ? `<span class="fig">${img}<span class="fig-caption" aria-hidden="true">${title}</span></span>` : img
    },
  },
})

const sanitize = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'del'],
    allowedAttributes: {
      a: ['href', 'title'],
      img: ['src', 'alt', 'class', 'loading'],
      code: ['class'],
      table: ['class'],
      span: ['class', 'aria-hidden'],
    },
    allowedClasses: { code: [/^language-/], img: ['img-fluid'], table: ['table'], span: ['fig', 'fig-caption'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['https'] },
    transformTags: {
      table: sanitizeHtml.simpleTransform('table', { class: 'table' }),
      img: sanitizeHtml.simpleTransform('img', { class: 'img-fluid', loading: 'lazy' }),
    },
  })

/** Markdown (GFM) → HTML já sanitizado, seguro para `dangerouslySetInnerHTML`. */
export const renderMarkdown = (md: string) => sanitize(marked.parse(md, { async: false }))
