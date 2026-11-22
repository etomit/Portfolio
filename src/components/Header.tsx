import { useEffect, useState } from 'react'
import { LINKS, SECTION_IDS, type SectionId } from '../content'
import { useI18n } from '../i18n'
import type { Theme } from '../useTheme'
import { GithubIcon, MoonIcon, SunIcon } from './icons'

/** Suit la section actuellement à l'écran pour souligner le lien correspondant. */
function useActiveSection() {
  const [active, setActive] = useState<SectionId | null>(null)

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter((node) => node !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId)
        }
      },
      // Une bande fine au tiers supérieur de l'écran : une seule section la traverse à la fois.
      { rootMargin: '-30% 0px -69% 0px' },
    )
    sections.forEach((section) => observer.observe(section))

    const onScroll = () => {
      if (window.scrollY < 200) setActive(null)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return active
}

export function Header({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const { lang, setLang, t } = useI18n()
  const active = useActiveSection()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header className={`site-header ${menuOpen ? 'is-menu-open' : ''}`}>
      <div className="shell header-inner">
        <a className="brand" href="#top" aria-label={t.a11y.home} onClick={() => setMenuOpen(false)}>
          <span className="brand-slash" aria-hidden="true">/</span>
          {t.brand}
        </a>

        <nav id="site-nav" className="site-nav" aria-label={t.a11y.mainNav}>
          {SECTION_IDS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? 'is-active' : ''}
              aria-current={active === id ? 'location' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-label">{t.nav[id]}</span>
            </a>
          ))}
        </nav>

        <div className="header-tools">
          <a
            className="tool-button"
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub — ${t.a11y.newTab}`}
          >
            <GithubIcon />
          </a>
          <button
            className="tool-button lang-toggle"
            type="button"
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
          >
            {/* Le nom accessible reprend le texte visible, puis l'action, dans la langue visée. */}
            <span className={lang === 'fr' ? 'is-current' : ''}>FR</span>
            <span aria-hidden="true">/</span>
            <span className={lang === 'en' ? 'is-current' : ''}>EN</span>
            <span className="sr-only" lang={lang === 'fr' ? 'en' : 'fr'}>
              {' — '}
              {t.a11y.switchLang}
            </span>
          </button>
          <button
            className="tool-button"
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? t.a11y.toLight : t.a11y.toDark}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            className="tool-button menu-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? t.a11y.closeMenu : t.a11y.openMenu}
            aria-expanded={menuOpen}
            aria-controls="site-nav"
          >
            <span className="menu-bars" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}
