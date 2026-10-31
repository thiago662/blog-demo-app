# Plano — Blog Demo (React)

Site **de exemplo** que lê o blog `blog-demo` do Ademiro de Blogs (Firestore do projeto `ademiro-dac27`) e serve de **modelo** para quem quiser criar o site do próprio blog. Publicado em `https://thiago662.github.io/blog-demo-app/`.

Objetivos:
1. Exemplo limpo e genérico (sem o conteúdo e o visual dos blogs pessoais).
2. Testar uma stack diferente dos outros blogs: **React + Bootstrap** (os outros são Angular).
3. Mesmo resultado técnico: uma página HTML por post no build (SEO e card de links).

---

## Decisões

| Tema | Decisão | Motivo |
|---|---|---|
| Framework | **Next.js 16** (App Router) com `output: 'export'` | React com HTML estático por post (`generateStaticParams`), API de metadata para Open Graph, muito pedido no mercado. *Alternativa considerada:* Vite + React Router 8 com `prerender` — confirmar com o usuário antes de iniciar |
| UI | **Bootstrap 5.3** (CSS) + `data-bs-theme` | pedido do usuário; tema claro/escuro nativo |
| Visual | **preto e branco**, simples, tipografia limpa (ex.: Geist via `next/font`) | pedido do usuário; contraste com os outros blogs |
| Tema | claro/escuro: segue o sistema na 1ª visita, botão para alternar, escolha salva no `localStorage`, aplicada antes da hidratação (sem "piscar") | igual ao Ademiro |
| Dados | Firestore, **leitura pública**, só posts `status == 'published'`, buscados **no build** (Server Components) | as rules do Ademiro já liberam isso sem login |
| Acesso ao Firestore | Firestore lite (`firebase/firestore/lite`) com `projectId` (+ `apiKey` se necessário) **ou** API REST pública — escolher o mais simples que funcionar no build | não precisa de SDK no navegador: os dados já vêm no HTML |
| Configuração | `site.config.ts` com padrões do exemplo (`projectId: 'ademiro-dac27'`, `blogSlug: 'blog-demo'`, URL do site), sobrescrevíveis por variáveis de ambiente | quem clona roda sem configurar; quem adapta troca 2–3 valores. O `projectId` não é segredo (já é público nos sites) |
| Markdown | `marked` (GFM) no build + sanitização no servidor (ex.: `sanitize-html`) | o HTML sai pronto e limpo; nada de `dangerouslySetInnerHTML` com conteúdo não sanitizado |
| Imagens do Ademiro | `![1.00](url "legenda")` → usar o **título** como alt quando o alt for só número | particularidade do editor Milkdown do Ademiro |
| Rotas | `/` lista, `/[slug]` post, 404 | formato do botão "Ver no blog" do Ademiro |
| GitHub Pages | `basePath`/`assetPrefix` = `/<nome-do-repo>`; `trailingSlash: true`; arquivo `.nojekyll` no artefato (pasta `_next`) | exigências do Pages com Next estático |
| Deploy | Actions: push na `main`, manual (`workflow_dispatch`) e agendado (a cada 6h) | posts novos só ganham página após novo build |
| Testes | testes unitários das funções puras (Markdown, mapeamento dos dados) + build no CI | garantir que o exemplo não quebre |

---

## Contrato de dados (Ademiro)

```
blogs/{blogId}                 slug, name, description, publicUrl, deployUrl, fieldDefs[], settings{}
blogs/{blogId}/posts/{postId}  slug, title, subtitle, summary, coverUrl, body (markdown), tags[],
                               status ('draft'|'published'|'archived'), custom{}, extras[],
                               publishedAt (Timestamp), updatedAt
```

- Blog encontrado por `slug == blogSlug`.
- **Toda consulta de posts filtra `status == 'published'`** (sem o filtro as rules negam a consulta inteira).
- Índice `status ==` + `publishedAt desc` já existe no projeto do Ademiro.
- O blog `blog-demo` tem hoje 1 post publicado ("Bem-vindo ao Ademiro") e os campos:
  - `settings.autor` (texto)
  - `custom.humor` (lista: leve, reflexivo, técnico)
  - `custom.leitura_min` (número)
- Tolerar campos ausentes.

---

## Fases

### Fase 0 — Base
- [x] Confirmar a stack com o usuário (Next.js estático × Vite + React Router) — **Next.js** escolhido
- [x] Criar o projeto (TypeScript 6, ESLint, Vitest), Bootstrap, fonte Geist
- [x] `site.config.ts` com os padrões do exemplo
- [x] Workflow de deploy no Pages (`basePath`, `.nojekyll`) e primeiro deploy — no ar
- [x] Usuário: **Settings → Pages → Source: GitHub Actions**

### Fase 1 — Dados
- [x] Busca do blog pelo slug, lista de posts publicados (mais recentes primeiro) e post pelo slug, no build — API REST do Firestore (`lib/firestore.ts`, `lib/blog.ts`), sem SDK e sem chave
- [x] Tipos do blog e do post; datas como string ISO (`lib/types.ts`)
- [x] Markdown → HTML sanitizado (com testes, incluindo o caso da imagem do Ademiro) — `lib/markdown.ts`, `lib/lib.test.ts`

### Fase 2 — Páginas
- [x] `/` lista de posts
- [x] `/[slug]` post (título, subtítulo, data, autor, campos `humor`/`leitura_min`, capa, corpo)
- [x] 404 (`noindex` automático)
- [x] Metadata por página: título, description, Open Graph (URL absoluta), Twitter

### Fase 3 — Tema e visual
- [x] Preto e branco, claro/escuro com botão, sem "piscar" ao carregar (`app/globals.css`, `app/theme-toggle.tsx`, script em `app/layout.tsx`)
- [x] Layout responsivo e acessível (contraste, foco visível, alvos ≥ 44px) — coluna de 680px; conferido em 1280px e 390px, sem rolagem horizontal
- [x] Favicon simples (`app/icon.svg`)

### Fase 4 — Publicação e integração
- [x] Deploy agendado (6h) e manual (no `deploy.yml`)
- [x] No Ademiro, blog `blog-demo`: URL pública `https://thiago662.github.io/blog-demo-app` e URL do deploy `https://github.com/thiago662/blog-demo-app/actions/workflows/deploy.yml`
- [x] Conferir o card do link (Post Inspector do LinkedIn) — imagem 1200x630, título e domínio corretos
- [x] README final: seção "Personalizando" e "Usando com o seu blog" completas
- [x] No README do Ademiro: link para este repositório como "modelo de site" (feito pelo usuário)

---

## Fora do primeiro ciclo
- Paginação, busca, página por tag, RSS, comentários.

---

## Andamento

- **Fase 4 feita (todas as fases concluídas).** Card do LinkedIn conferido pelo usuário. README final pronto; URLs preenchidas no Ademiro; post de exemplo com imagem legendada, conferida no build.
- **basePath só em produção** (`next.config.ts`): `npm run dev` abre em `http://localhost:3000/`; o build usa `/blog-demo-app`.
- **Fase 3 feita.** Legenda das imagens do editor (título) aparece abaixo da imagem (`.fig-caption`, `aria-hidden` para não repetir o alt). `SHOT=<pasta> npm run check` salva capturas de tela. O 404 de prefetch (`__next.$d$slug.__PAGE__.txt`) só aparece no build do Windows; no Linux do Actions o arquivo existe.
- **Fase 2 feita** (HTML sem estilo próprio, só Bootstrap; o visual é a Fase 3). Com 0 posts publicados `generateStaticParams` devolve lista vazia: não testado.
- **Fase 0 e 1 feitas.** Acesso ao Firestore pela API REST (`runQuery`), sem apiKey: as rules liberam a leitura pública. Verificação: `npm test`, `npm run build` e `npm run check` (Chrome headless, `tools/check.mjs`).
- Dependências fixadas por causa do CI: `@popperjs/core` explícito (peer do Bootstrap; o lock do Windows não gravava), `eslint@9` (plugins do `eslint-config-next` não aceitam o 10), `typescript@6` (typescript-eslint não aceita o 7), `vite` explícito (peer do Vitest).