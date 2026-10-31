import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="container py-5">
      <h1>Página não encontrada</h1>
      <p>Esse post não existe ou ainda não foi publicado.</p>
      <Link href="/">Voltar para a lista de posts</Link>
    </main>
  )
}
