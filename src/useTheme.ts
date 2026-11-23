import { useCallback, useEffect, useState } from 'react'

/** « dark » : le plan bleu (thème par défaut) ; « light » : le tirage papier. */
export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'portfolio-theme'
const THEME_COLORS: Record<Theme, string> = { light: '#f4f7fc', dark: '#0b2259' }

function initialTheme(): Theme {
  // Le script en ligne de index.html a déjà résolu le thème avant le premier rendu.
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
  }, [theme])

  // À l'impression, le plan bleu sort en « tirage papier » : encre bleue sur fond clair.
  useEffect(() => {
    const root = document.documentElement
    const toPaper = () => {
      root.dataset.theme = 'light'
    }
    const restore = () => {
      root.dataset.theme = theme
    }
    window.addEventListener('beforeprint', toPaper)
    window.addEventListener('afterprint', restore)
    return () => {
      window.removeEventListener('beforeprint', toPaper)
      window.removeEventListener('afterprint', restore)
    }
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // préférence non mémorisée, sans conséquence
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
