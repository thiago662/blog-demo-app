# Blog Demo — site de exemplo para o Ademiro de Blogs

Site de blog **de exemplo** que lê os posts publicados no [Ademiro de Blogs](https://github.com/thiago662/ademiro-de-blogs), um gerenciador de conteúdo para vários blogs.

Use este repositório como ponto de partida para o site do **seu** blog: ele já busca os posts no Firestore, gera uma página HTML por post no build (bom para SEO e para o card de links no LinkedIn e outras redes) e publica no GitHub Pages.

**No ar:** https://thiago662.github.io/blog-demo-app/

> Status: em construção — ver [PLAN.md](PLAN.md).

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

## Usando com o seu blog

1. Tenha o [Ademiro de Blogs](https://github.com/thiago662/ademiro-de-blogs) rodando com o seu projeto Firebase e um blog com posts publicados.
2. Configure o projeto e o slug do blog (ver `site.config.ts` e a seção *Configuração* no [PLAN.md](PLAN.md)).
3. No GitHub: **Settings → Pages → Source: GitHub Actions** e, se for um fork, habilite o Actions na aba **Actions**.
4. Push na `main` publica em `https://<seu-usuario>.github.io/<nome-do-repo>/`.
5. No Ademiro, em **Editar blog**, preencha a URL pública do site e a URL do workflow de deploy (botões *Ver no blog* e *Republicar site*).

## Personalizando

O visual fica concentrado no tema (cores e fontes) e nos componentes de página. Detalhes de onde trocar cada coisa entram aqui quando o projeto estiver pronto.

## Projetos relacionados

- [Ademiro de Blogs](https://github.com/thiago662/ademiro-de-blogs) — o painel (CMS)
- [Brain Logs](https://github.com/thiago662/brain-logs-app) e [Blog de Notas](https://github.com/thiago662/blog-de-notas-app) — blogs reais feitos com Angular no mesmo modelo

## Licença

Este projeto ainda não tem uma licença definida. O código pode ser visto e forkado aqui no GitHub; para outros usos, entre em contato.
