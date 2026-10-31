# Blog Demo — site de exemplo para o Ademiro de Blogs

Site de blog **de exemplo** que lê os posts publicados no [Ademiro de Blogs](https://github.com/thiago662/ademiro-de-blogs), um gerenciador de conteúdo para vários blogs.

Use este repositório como ponto de partida para o site do **seu** blog: ele já busca os posts no Firestore, gera uma página HTML por post no build (bom para SEO e para o card de links no LinkedIn e outras redes) e publica no GitHub Pages.

**No ar:** https://thiago662.github.io/blog-demo-app/

> Status: funcionando (lista, post, 404, metadata, tema claro/escuro). Plano e andamento em [PLAN.md](PLAN.md).

---

## Como funciona

```
Ademiro de Blogs (painel)  ──grava──▶  Firestore  ──lê no build──▶  este site (HTML estático)
```

- Você escreve e publica no painel do Ademiro.
- No build, este site busca os posts **publicados** do blog configurado e gera uma página por post.
- O deploy roda a cada push, manualmente e de tempos em tempos, para posts novos entrarem no site.

## Tecnologias

| | |
|---|---|
| [Next.js](https://nextjs.org/) (App Router, exportação estática) | React com uma página HTML gerada por post |
| [Bootstrap 5](https://getbootstrap.com/) | interface, tema claro/escuro via `data-bs-theme` |
| Firestore (leitura pública) | fonte dos posts, gerenciados no Ademiro |
| [marked](https://marked.js.org/) | Markdown (GFM) → HTML, sanitizado no build |
| GitHub Actions + Pages | deploy |

Visual: preto e branco, simples, com tema claro e escuro.

## Rodando localmente

**Requisitos:** Node.js 24+.

```bash
npm install
npm run dev        # http://localhost:3000
```

Por padrão o site lê o blog **`blog-demo`** do Ademiro de exemplo, então funciona sem nenhuma configuração.

| Comando | Para quê |
|---|---|
| `npm run dev` | desenvolvimento em http://localhost:3000 |
| `npm run build` | gera o site estático na pasta `out/` |
| `npm test` | testes das funções puras (Markdown e leitura dos dados) |
| `npm run lint` | ESLint |
| `npm run check` | depois do build: abre o Chrome headless e confere páginas, tema, console e requisições (requer Google Chrome; `SHOT=<pasta>` salva capturas de tela) |

## Usando com o seu blog

1. Tenha o [Ademiro de Blogs](https://github.com/thiago662/ademiro-de-blogs) rodando com o seu projeto Firebase e um blog com pelo menos um post **publicado**.
2. Faça um fork (ou use como modelo) e edite os valores de [`site.config.ts`](site.config.ts):

   | Campo | O que é | Padrão do exemplo |
   |---|---|---|
   | `projectId` | projeto Firebase do seu Ademiro | `ademiro-dac27` |
   | `blogSlug` | slug do seu blog no Ademiro | `blog-demo` |
   | `siteUrl` | endereço público do site (sem `/` no fim); usado nas URLs absolutas do Open Graph | `https://thiago662.github.io/blog-demo-app` |
   | `basePath` | `/<nome-do-repo>` no GitHub Pages; vazio (`''`) se o site fica na raiz do domínio | `/blog-demo-app` |

   Para testar sem editar o arquivo, os mesmos valores aceitam as variáveis de ambiente `FIREBASE_PROJECT_ID`, `BLOG_SLUG`, `SITE_URL` e `BASE_PATH`.
3. No GitHub: **Settings → Pages → Source: GitHub Actions** e, se for um fork, habilite o Actions na aba **Actions**.
4. Push na `main` publica em `https://<seu-usuario>.github.io/<nome-do-repo>/`. O workflow [`deploy.yml`](.github/workflows/deploy.yml) também roda manualmente (*Run workflow*) e a cada 6 horas, para posts novos ganharem página.
5. No Ademiro, em **Editar blog**, preencha a URL pública do site e a URL do workflow de deploy (botões *Ver no blog* e *Republicar site*).

**Leitura pública:** o site lê o Firestore sem login, direto pela API REST, e só consulta posts com `status == 'published'`. As Security Rules do Ademiro já permitem isso e protegem os rascunhos. Nada é escrito no banco.

**Post novo:** só ganha página depois de um novo build. Publicou no painel? Use *Republicar site* (ou espere o agendamento). Enquanto isso, o endereço do post mostra a página 404.

## Personalizando

| Quero mudar | Onde |
|---|---|
| Cores, largura da coluna de leitura, espaçamentos | [`app/globals.css`](app/globals.css): as variáveis do Bootstrap no começo do arquivo definem as cores dos dois temas |
| Fonte | [`app/layout.tsx`](app/layout.tsx) (hoje Geist, pacote `geist`) |
| Cabeçalho, título e metadata do site | [`app/layout.tsx`](app/layout.tsx) |
| Lista de posts | [`app/page.tsx`](app/page.tsx) |
| Página do post (título, data, autor, capa, tags) | [`app/[slug]/page.tsx`](app/[slug]/page.tsx) |
| Página 404 | [`app/not-found.tsx`](app/not-found.tsx) |
| Favicon | [`app/icon.svg`](app/icon.svg) |
| Campos personalizados do blog (hoje `autor`, `humor`, `leitura_min`) | [`lib/fields.ts`](lib/fields.ts); crie os campos em *Configurações* do blog no Ademiro. Qualquer campo pode faltar |
| Markdown (tags e atributos HTML permitidos) | [`lib/markdown.ts`](lib/markdown.ts); o HTML é sanitizado no build |

Notas:

- **Tema:** segue o sistema na primeira visita e salva a escolha no `localStorage`. O script que aplica o tema antes da página aparecer está em `app/layout.tsx`.
- **Imagens do editor do Ademiro:** o editor grava `![1.00](url "legenda")`. O número é a proporção e não serve de texto alternativo, então o site usa a legenda (o título) como `alt` e a mostra abaixo da imagem.
- **Outro `basePath`:** o teste `npm run check` (`tools/check.mjs`) tem o `/blog-demo-app` escrito na constante `BASE_PATH`. Troque lá também.

## Projetos relacionados

- [Ademiro de Blogs](https://github.com/thiago662/ademiro-de-blogs) — o painel (CMS)
- [Brain Logs](https://github.com/thiago662/brain-logs-app) e [Blog de Notas](https://github.com/thiago662/blog-de-notas-app) — blogs reais feitos com Angular no mesmo modelo

## Licença

Este projeto ainda não tem uma licença definida. O código pode ser visto e forkado aqui no GitHub; para outros usos, entre em contato.
