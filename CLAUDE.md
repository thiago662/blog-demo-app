# CLAUDE.md — Blog Demo (React)

Contexto para o Claude Code. Plano e checklist: [PLAN.md](PLAN.md).

## Como trabalhar com o usuário

- Responder em **português**, de forma **curta e direta**, com passos numerados. Textos longos confundem.
- "Dúvida apenas" / "apenas ideias" / "não mexer em nada" = responder sem alterar código.
- Neste repositório (início): **commit e push direto na `main`**, sem branch/PR, até ele pedir outra coisa.
- Commits em português (`feat:`, `fix:`, `chore:`, `docs:`), terminando com:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
- Configurações no site do GitHub e no painel do Ademiro ele faz: entregar o passo a passo. Não há `gh` instalado.
- Verificar antes de dizer que está pronto: build, testes e um teste no navegador (Chrome headless via DevTools Protocol funcionou bem nos outros projetos; ver `C:\Projetos\Blogs\brain-logs-app\tools\check.mjs`).
- Ambiente: Windows, PowerShell 5.1 (sem `&&`; use `;`). Node 24.20, npm 11.19. Google Chrome instalado. Bash do Git em `C:\Program Files\Git\bin\bash.exe`.

## O que é

Site **de exemplo** que lê o blog `blog-demo` do **Ademiro de Blogs** (CMS do usuário: `C:\Projetos\Blogs\ademiro-de-blogs`, repo `thiago662/ademiro-de-blogs`, painel em https://thiago662.github.io/ademiro-de-blogs/). Serve de **modelo** para quem quiser montar o site do próprio blog. Repositório público `thiago662/blog-demo-app`, branch `main`, publicado em `https://thiago662.github.io/blog-demo-app/`.

O usuário pediu **React + Bootstrap**, visual **preto e branco simples** com **tema claro e escuro**, para testar algo diferente dos outros blogs (que são Angular).

## Projetos irmãos (referência)

- `C:\Projetos\Blogs\brain-logs-app` e `C:\Projetos\Blogs\blog-de-notas-app` — mesmo objetivo em **Angular** (prerender, Firestore lite, TransferState). Ler o `CLAUDE.md` deles para o contrato de dados, as armadilhas e o fluxo de deploy. A lógica é a mesma; muda o framework.
- `C:\Projetos\Blogs\ademiro-de-blogs` — o CMS. README: modelo de dados, rules e consultas públicas.

## Dados

Ver "Contrato de dados" no PLAN.md. Pontos críticos:
- Projeto Firebase `ademiro-dac27` (não é segredo: o `firebaseConfig` web já é público nos sites). Blog `slug: 'blog-demo'` (id `blog-demo`).
- **Toda consulta de posts filtra `status == 'published'`**; sem isso as rules negam.
- Leitura pública, sem login; dados buscados **no build**.
- Imagens do editor: `![1.00](url "legenda")` → alt numérico = proporção; usar o título como alt.
- O post de exemplo existente tem tabela, código, citação, lista e imagem — bom para testar o Markdown.

## Armadilhas conhecidas (vindas dos projetos Angular)

- **`npm ci` no Linux do Actions** pode recusar um lock gerado no Windows (peer dependency ausente ou pacotes opcionais de wasm com versão conflitante, ex.: `@emnapi/*`). Se acontecer, pedir ao usuário as linhas `npm error` do passo *Run npm ci*; corrigir com dependência explícita ou `overrides`, ou regenerar o lock com `npm install --package-lock-only` numa pasta limpa só com o `package.json`.
- O npm 11 do Windows às vezes troca `"devOptional": true` por `"dev": true` no lock: ruído, não commitar.
- GitHub Pages com Next estático: `basePath` = `/blog-demo-app`, `.nojekyll` no artefato (senão a pasta `_next` some), `trailingSlash: true` ajuda nas rotas.
- Meta tags Open Graph precisam de URL **absoluta**.
- **Build local com dado velho:** o Next guarda cache das consultas em `.next`. Mudou algo no Ademiro e o `npm run build` não refletiu? `Remove-Item .next -Recurse -Force` e refazer. (No Actions o build é sempre limpo.)
- `node_modules` não apaga no Windows (caminho longo): `Remove-Item -LiteralPath '\\?\<caminho>\node_modules' -Recurse -Force`.

## Pendências do usuário

- **Settings → Pages → Source: GitHub Actions** neste repositório.
- No Ademiro (blog `blog-demo`): URL pública e URL do deploy, quando o site estiver no ar.
