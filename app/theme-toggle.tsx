'use client'

// Sem estado: o ícone certo aparece por CSS conforme `data-bs-theme`, então não há diferença
// entre o HTML do servidor e o do navegador (o atributo é definido pelo script em layout.tsx).
export default function ThemeToggle() {
  const toggle = () => {
    const el = document.documentElement
    const next = el.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark'
    el.setAttribute('data-bs-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch {}
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label="Alternar entre tema claro e escuro">
      <svg className="icon-sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg className="icon-moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
      </svg>
    </button>
  )
}
