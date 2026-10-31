// Teste no navegador do build estÃ¡tico: `npm run build && npm run check`.
// Serve `out/` sob o basePath (como o GitHub Pages), abre o Chrome headless via CDP e confere
// erros de console, requisiÃ§Ãµes ao Firestore (esperado 0: os dados vÃªm no HTML) e o conteÃºdo das pÃ¡ginas.
// Requer Google Chrome instalado (caminho padrÃ£o do Windows abaixo).
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'

const BASE_PATH = '/blog-demo-app'
const root = 'out'
const BASE = `http://localhost:4311${BASE_PATH}`
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain', '.woff2': 'font/woff2' }
const server = createServer((req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0])
  let file = path.startsWith(BASE_PATH) ? join(root, path.slice(BASE_PATH.length)) : ''
  if (file && existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
  const found = file && existsSync(file)
  if (!found) file = join(root, '404.html') // como o Pages: rota sem pÃ¡gina â†’ 404.html
  res.writeHead(found ? 200 : 404, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
  res.end(readFileSync(file))
}).listen(4311)

const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--remote-debugging-port=9335', '--no-first-run', '--user-data-dir=' + join(process.env.TEMP, 'blog-demo-check-profile'), 'about:blank',
])
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
let target
for (let i = 0; i < 40 && !target; i++) {
  await sleep(250)
  try { target = (await (await fetch('http://127.0.0.1:9335/json')).json()).find((t) => t.type === 'page') } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r))
let id = 0
const pending = new Map()
const problems = []
let firestoreRequests = 0
ws.addEventListener('message', ({ data }) => {
  const msg = JSON.parse(data)
  if (msg.id) pending.get(msg.id)?.(msg)
  if (msg.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(msg.params.type))
    problems.push(`console.${msg.params.type}: ` + msg.params.args.map((a) => a.value ?? a.description).join(' '))
  if (msg.method === 'Runtime.exceptionThrown') problems.push('exception: ' + msg.params.exceptionDetails.exception?.description)
  if (msg.method === 'Log.entryAdded' && ['error', 'warning'].includes(msg.params.entry.level))
    problems.push(`log.${msg.params.entry.source}: ${msg.params.entry.text} ${msg.params.entry.url ?? ''}`)
  if (msg.method === 'Network.requestWillBeSent' && msg.params.request.url.includes('firestore.googleapis.com')) firestoreRequests++
})
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.result?.value
const go = async (url) => { await send('Page.navigate', { url }); await sleep(2500) }

await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable'); await send('Network.enable')
const out = {}

await go(`${BASE}/`)
out.home = await evaluate(`document.title + ' | h1=' + document.querySelector('h1')?.textContent + ' | cards=' + document.querySelectorAll('.post-card').length`)
const href = await evaluate(`document.querySelector('.post-card-link')?.getAttribute('href') ?? ''`)

if (href) {
  await go(`http://localhost:4311${href}`)
  out.postDireto = await evaluate(`location.pathname + ' | ' + document.title + ' | h1=' + document.querySelector('h1')?.textContent`)
  out.postCorpo = await evaluate(`'tabelas=' + document.querySelectorAll('.post-body table.table').length + ' | codigo=' + document.querySelectorAll('.post-body pre code').length + ' | citacao=' + document.querySelectorAll('.post-body blockquote').length + ' | listas=' + document.querySelectorAll('.post-body li').length + ' | imgs=' + document.querySelectorAll('.post-body img[alt]').length`)
  out.postFatos = await evaluate(`document.querySelector('article > p.text-body-secondary')?.textContent`)
  out.postMeta = await evaluate(`['description','og:title','og:url','og:image','og:type','twitter:card'].map((k) => k + '=' + (document.querySelector('meta[name="' + k + '"],meta[property="' + k + '"]')?.content ?? '-')).join('\\n')`)
}

await go(`${BASE}/nao-existe-esse-post/`)
out.postInexistente = await evaluate(`document.title + ' | h1=' + document.querySelector('h1')?.textContent + ' | robots=' + document.querySelector('meta[name=robots]')?.content`)

out.firestoreNoNavegador = firestoreRequests // esperado 0
console.log(JSON.stringify(out, null, 2))
console.log(problems.length ? 'PROBLEMAS:\n' + [...new Set(problems)].join('\n') : 'Nenhum erro de console.')
ws.close(); chrome.kill(); server.close()
process.exit(0)
