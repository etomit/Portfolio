import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { I18nProvider, useI18n } from './i18n'
import Game2048 from './Game2048'
import WordleGame from './WordleGame'
import './App.css'

type Theme = 'dark' | 'light'
type GameKind = '2048' | 'wordle'
type ProjectFilter = 'all' | 'web' | 'mobile' | 'api' | 'play'

const NAV_IDS = ['work', 'expertise', 'experience', 'education', 'contact'] as const
const SKILLS = ['React', 'TypeScript', 'Symfony', 'Laravel', '.NET', 'Node.js', 'PostgreSQL', 'Docker', 'Git', 'Flutter', 'Python', 'Architecture SI']

const COPY = {
  fr: {
    skip: 'Aller au contenu', nav: ['Projets', 'Expertise', 'Parcours', 'Formation', 'Contact'],
    theme: 'Changer de thème', language: 'Passer le site en anglais', menu: 'Ouvrir le menu', close: 'Fermer',
    available: 'Disponible pour de nouveaux projets', eyebrow: 'Développeur full-stack · Grand Est, France',
    heroLead: 'Je transforme des besoins métier complexes en', heroAccent: 'expériences simples.',
    heroText: 'Du cadrage à la mise en production, je conçois des interfaces vivantes et des architectures robustes — avec le même niveau d’exigence des deux côtés de la stack.',
    viewWork: 'Explorer mes projets', contactMe: 'Me contacter', scroll: 'Défiler pour découvrir',
    codeTitle: 'currently_building.ts', codeComment: '// Une idée devient un produit',
    stats: [['3+', 'années de pratique'], ['1 200+', 'utilisateurs métier'], ['17+', 'technologies']],
    workKicker: 'Selected work · 01', workTitle: 'Des projets qui ne restent pas au stade du prototype.',
    workIntro: 'Une sélection de produits, d’expériences interactives et d’explorations techniques. Chaque lien ouvre une destination clairement identifiée.',
    featured: 'Projet vedette · 2026',
    pokelineDesc: 'Un jeu de combat multijoueur complet : hub 2D, moteur tactique côté serveur, modes solo/local/en ligne et synchronisation temps réel.',
    playProject: 'Jouer à PokéLine', source: 'Voir le code source', newTab: 'nouvel onglet',
    pokelineFacts: [['3', 'modes de jeu'], ['18', 'types gérés'], ['WebSocket', 'temps réel']],
    commerceLabel: 'Produit mis en avant', commerceTitle: 'Mon CommerceRapide',
    commerceDesc: 'Une expérience web orientée commerce, pensée comme un vrai produit : parcours lisibles, opérations rapides et logique applicative structurée.',
    commerceNote: 'Étude de cas produit', commerceAction: 'Présentation complète bientôt disponible',
    filters: ['Tout', 'Web', 'Mobile', 'API', 'Playground'], archive: 'Projet archive', openGithub: 'Ouvrir sur GitHub', launch: 'Lancer',
    projects: {
      pokemon: ['Pokémon Battle', 'Application Flutter avec Pokédex, création d’équipe et moteur de combat basé sur les statistiques.', 'Mobile · Flutter'],
      api: ['Python REST API', 'API Python et client desktop Tkinter : une exploration complète du flux données → service → interface.', 'API · Python'],
      game2048: ['2048 / React', 'Le classique revisité dans le design system du portfolio, jouable au clavier comme au tactile.', 'Playground · TypeScript'],
      wordle: ['Wordle bilingue', 'Un jeu de lettres français/anglais avec clavier virtuel, validation et animations de résultat.', 'Playground · React'],
    },
    expertiseKicker: 'Expertise · 02', expertiseTitle: 'Une vision produit, du pixel à la donnée.',
    expertiseIntro: 'Je ne traite pas le front et le back comme deux mondes séparés. Je conçois le parcours entier : usage, modèle, sécurité, performance et maintenabilité.',
    capabilities: [
      ['01', 'Interfaces produit', 'Design systems, accessibilité, responsive et micro-interactions utiles. Je cherche une interface lisible avant de chercher un effet.', ['React', 'TypeScript', 'UX engineering']],
      ['02', 'Applications métier', 'Des workflows fiables pour des utilisateurs réels : droits, validation, traçabilité et intégration au système d’information.', ['Symfony', '.NET', 'SQL']],
      ['03', 'Architecture & delivery', 'API, modélisation, conteneurisation et déploiement. Une base technique pensée pour évoluer sans ralentir l’équipe.', ['REST', 'PostgreSQL', 'Docker']],
    ],
    stackLabel: 'Stack & outils', stackText: 'Une boîte à outils volontairement large, utilisée selon le problème — jamais pour cocher des cases.',
    experienceKicker: 'Parcours · 03', experienceTitle: 'Construire dans le monde réel.',
    experienceIntro: 'Des environnements industriels, logistiques et numériques qui m’ont appris à relier contraintes terrain et décisions techniques.',
    current: 'Aujourd’hui', details: 'Missions clés',
    educationKicker: 'Formation · 04', educationTitle: 'Apprendre, consolider, transmettre.',
    educationIntro: 'Un parcours progressif du système et réseau vers l’architecture logicielle et le pilotage de projets.',
    contactKicker: 'Contact · 05', contactTitle: 'Un produit à rendre plus clair, plus rapide, plus vivant ?',
    contactText: 'Parlons de votre contexte et de ce que le logiciel peut réellement améliorer. Pas de formulaire opaque : vous choisissez directement le canal.',
    email: 'Écrire un email', linkedin: 'LinkedIn', github: 'GitHub', location: 'Grand Est, France · Travail hybride',
    footer: 'Conçu et développé par Timothée Maire.', rights: 'Portfolio personnel · Aucun formulaire de connexion ni collecte de données.',
  },
  en: {
    skip: 'Skip to content', nav: ['Work', 'Expertise', 'Journey', 'Education', 'Contact'],
    theme: 'Switch theme', language: 'Switch the website to French', menu: 'Open menu', close: 'Close',
    available: 'Available for new projects', eyebrow: 'Full-stack developer · Grand Est, France',
    heroLead: 'I turn complex business needs into', heroAccent: 'simple experiences.',
    heroText: 'From framing to production, I craft lively interfaces and robust architectures — with the same level of care on both sides of the stack.',
    viewWork: 'Explore my work', contactMe: 'Get in touch', scroll: 'Scroll to explore',
    codeTitle: 'currently_building.ts', codeComment: '// An idea becomes a product',
    stats: [['3+', 'years of practice'], ['1,200+', 'business users'], ['17+', 'technologies']],
    workKicker: 'Selected work · 01', workTitle: 'Projects that go beyond the prototype stage.',
    workIntro: 'A selection of products, interactive experiences and technical explorations. Every link opens a clearly identified destination.',
    featured: 'Featured project · 2026',
    pokelineDesc: 'A complete multiplayer battle game: 2D hub, server-side tactical engine, solo/local/online modes and real-time sync.',
    playProject: 'Play PokéLine', source: 'View source code', newTab: 'new tab',
    pokelineFacts: [['3', 'game modes'], ['18', 'managed types'], ['WebSocket', 'real time']],
    commerceLabel: 'Product spotlight', commerceTitle: 'Mon CommerceRapide',
    commerceDesc: 'A commerce-focused web experience designed as a real product: clear journeys, fast operations and structured application logic.',
    commerceNote: 'Product case study', commerceAction: 'Full presentation coming soon',
    filters: ['All', 'Web', 'Mobile', 'API', 'Playground'], archive: 'Archive project', openGithub: 'Open on GitHub', launch: 'Launch',
    projects: {
      pokemon: ['Pokémon Battle', 'A Flutter app with a Pokédex, team building and a battle engine based on Pokémon statistics.', 'Mobile · Flutter'],
      api: ['Python REST API', 'A Python API and Tkinter desktop client: an end-to-end exploration from data to service to interface.', 'API · Python'],
      game2048: ['2048 / React', 'The classic rebuilt in the portfolio design system, playable with a keyboard or touch gestures.', 'Playground · TypeScript'],
      wordle: ['Bilingual Wordle', 'A French/English word game with a virtual keyboard, validation and result animations.', 'Playground · React'],
    },
    expertiseKicker: 'Expertise · 02', expertiseTitle: 'A product mindset, from pixels to data.',
    expertiseIntro: 'I do not treat front end and back end as separate worlds. I design the full journey: usage, model, security, performance and maintainability.',
    capabilities: [
      ['01', 'Product interfaces', 'Design systems, accessibility, responsive layouts and purposeful micro-interactions. Clarity always comes before effects.', ['React', 'TypeScript', 'UX engineering']],
      ['02', 'Business applications', 'Reliable workflows for real users: permissions, validation, traceability and information-system integration.', ['Symfony', '.NET', 'SQL']],
      ['03', 'Architecture & delivery', 'APIs, data modelling, containers and deployment. A technical foundation designed to evolve without slowing the team down.', ['REST', 'PostgreSQL', 'Docker']],
    ],
    stackLabel: 'Stack & tools', stackText: 'A deliberately broad toolkit, selected for the problem at hand — never to tick boxes.',
    experienceKicker: 'Journey · 03', experienceTitle: 'Building in the real world.',
    experienceIntro: 'Industrial, logistics and digital environments taught me how to connect field constraints with technical decisions.',
    current: 'Today', details: 'Key work',
    educationKicker: 'Education · 04', educationTitle: 'Learn, consolidate, share.',
    educationIntro: 'A progressive journey from systems and networks to software architecture and project leadership.',
    contactKicker: 'Contact · 05', contactTitle: 'A product to make clearer, faster, more alive?',
    contactText: 'Let’s discuss your context and what software can truly improve. No opaque form: choose your preferred channel directly.',
    email: 'Write an email', linkedin: 'LinkedIn', github: 'GitHub', location: 'Grand Est, France · Hybrid work',
    footer: 'Designed and developed by Timothée Maire.', rights: 'Personal portfolio · No login form and no data collection.',
  },
} as const

function ArrowIcon({ direction = 'up-right' }: { direction?: 'up-right' | 'down' }) {
  return direction === 'down'
    ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v15M6.5 13.5 12 19l5.5-5.5" /></svg>
    : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
}

function GithubIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8a9.5 9.5 0 0 0-3 18.5c.5.1.6-.2.6-.5v-1.9c-2.7.6-3.3-1.1-3.3-1.1-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.2-4.4-1.1-4.4-4.7 0-1 .4-1.9 1-2.6-.1-.2-.4-1.2.1-2.5 0 0 .8-.3 2.6 1a9 9 0 0 1 4.8 0c1.8-1.2 2.6-1 2.6-1 .5 1.3.2 2.3.1 2.5.6.7 1 1.6 1 2.6 0 3.7-2.2 4.5-4.4 4.7.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.8Z" /></svg>
}

function MailIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5h18v12H3zM3.5 7l8.5 7 8.5-7" /></svg> }
function LinkedinIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.2 9v9M6.2 6.2v.1M10.2 18v-9m0 4c0-2.2 1.4-4.1 3.7-4.1 2.7 0 3.9 1.8 3.9 4.7V18" /></svg> }
function CodeIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8.5 7-5 5 5 5M15.5 7l5 5-5 5M14 4l-4 16" /></svg> }

function ThemeIcon({ theme }: { theme: Theme }) {
  return theme === 'dark'
    ? <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
    : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z" /></svg>
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { threshold: 0.12 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${className}`} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>{children}</div>
}

function SectionIntro({ kicker, title, intro }: { kicker: string; title: string; intro: string }) {
  return <Reveal className="section-intro"><p className="section-kicker">{kicker}</p><div className="section-intro-grid"><h2>{title}</h2><p>{intro}</p></div></Reveal>
}

function Header({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  const { lang, setLang } = useI18n()
  const c = COPY[lang]
  const [active, setActive] = useState('work')
  const [menuOpen, setMenuOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0)
    }
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV_IDS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible?.target.id) setActive(visible.target.id)
    }, { rootMargin: '-20% 0px -62% 0px', threshold: [0.1, 0.35, 0.6] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const goTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }
  return <header className="site-header">
    <div className="scroll-progress" style={{ transform: `scaleX(${progress / 100})` }} />
    <div className="header-inner">
      <button className="brand-mark" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Timothée Maire — accueil"><span>TM</span><i /></button>
      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navigation principale">
        {NAV_IDS.map((id, index) => <button key={id} className={active === id ? 'is-active' : ''} onClick={() => goTo(id)}><span>0{index + 1}</span>{c.nav[index]}</button>)}
      </nav>
      <div className="header-actions">
        <button className="icon-button language-button" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} aria-label={c.language}>{lang === 'fr' ? 'EN' : 'FR'}</button>
        <button className="icon-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={c.theme}><ThemeIcon theme={theme} /></button>
        <button className={`menu-button ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? c.close : c.menu} aria-expanded={menuOpen}><span /><span /></button>
      </div>
    </div>
  </header>
}

function Hero() {
  const { lang } = useI18n(); const c = COPY[lang]
  return <main id="main-content">
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-grid-overlay" /><div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
      <div className="hero-content page-shell">
        <div className="hero-copy">
          <div className="availability hero-enter" style={{ '--enter-delay': '80ms' } as CSSProperties}><span /><p>{c.available}</p></div>
          <p className="hero-eyebrow hero-enter" style={{ '--enter-delay': '150ms' } as CSSProperties}>{c.eyebrow}</p>
          <h1 id="hero-title" className="hero-enter" style={{ '--enter-delay': '220ms' } as CSSProperties}>{c.heroLead}<br /><em>{c.heroAccent}</em></h1>
          <p className="hero-description hero-enter" style={{ '--enter-delay': '310ms' } as CSSProperties}>{c.heroText}</p>
          <div className="hero-actions hero-enter" style={{ '--enter-delay': '390ms' } as CSSProperties}>
            <button className="primary-button" onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}>{c.viewWork}<ArrowIcon direction="down" /></button>
            <a className="text-link" href="mailto:timothee.maire54300@gmail.com">{c.contactMe}<ArrowIcon /></a>
          </div>
        </div>
        <div className="hero-visual hero-enter" style={{ '--enter-delay': '260ms' } as CSSProperties} aria-label="Portrait et aperçu technique de Timothée Maire">
          <div className="portrait-rail"><span>FULL-STACK</span><span>2026</span></div>
          <div className="portrait-frame"><div className="portrait-glow" /><img src="/profile-optimized.png" alt="Timothée Maire" width="1080" height="1440" fetchPriority="high" /><div className="portrait-caption"><p>Timothée Maire</p><span>Developer / Builder</span></div></div>
          <div className="floating-card floating-card-code"><div className="floating-card-head"><i /><i /><i /><span>{c.codeTitle}</span></div><pre><span className="code-muted">{c.codeComment}</span>{'\n'}<span className="code-purple">const</span> product = {'{'}{'\n'}  interface: <span className="code-green">'fluide'</span>,{'\n'}  architecture: <span className="code-green">'solide'</span>{'\n'}{'}'}</pre></div>
          <div className="floating-card floating-card-stack"><span className="pulse-dot" /><div><strong>React × Symfony</strong><small>production ready</small></div></div>
        </div>
        <div className="hero-footer hero-enter" style={{ '--enter-delay': '480ms' } as CSSProperties}>
          <div className="hero-stats">{c.stats.map(([number, label]) => <div key={label}><strong>{number}</strong><span>{label}</span></div>)}</div>
          <button className="scroll-cue" onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}><span>{c.scroll}</span><i><ArrowIcon direction="down" /></i></button>
        </div>
      </div>
    </section><KineticStrip />
  </main>
}

function KineticStrip() {
  const items = [...SKILLS.slice(0, 8), ...SKILLS.slice(0, 8)]
  return <div className="kinetic-strip" aria-hidden="true"><div className="kinetic-track">{items.map((skill, index) => <span key={`${skill}-${index}`}>{skill}<i>✦</i></span>)}</div></div>
}

function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = ref.current.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width; const y = (event.clientY - rect.top) / rect.height
    ref.current.style.setProperty('--tilt-x', `${(0.5 - y) * 6}deg`); ref.current.style.setProperty('--tilt-y', `${(x - 0.5) * 7}deg`)
    ref.current.style.setProperty('--shine-x', `${x * 100}%`); ref.current.style.setProperty('--shine-y', `${y * 100}%`)
  }
  const reset = () => { ref.current?.style.setProperty('--tilt-x', '0deg'); ref.current?.style.setProperty('--tilt-y', '0deg') }
  return <div ref={ref} className={`tilt-card ${className}`} onPointerMove={onMove} onPointerLeave={reset}>{children}</div>
}

function CommerceSpotlight() {
  const { lang } = useI18n(); const c = COPY[lang]
  return <Reveal className="commerce-spotlight" delay={120}>
    <div className="commerce-copy">
      <p className="section-kicker">{c.commerceLabel}</p><h3>{c.commerceTitle}</h3><p>{c.commerceDesc}</p>
      <div><span>Product design</span><span>Web app</span><span>Business logic</span></div>
      <button type="button" disabled aria-disabled="true">{c.commerceAction}</button>
    </div>
    <div className="commerce-visual" aria-label="Aperçu abstrait d’un tableau de bord commerce">
      <div className="commerce-window"><div className="commerce-window-head"><i /><i /><i /><span>Mon CommerceRapide</span></div>
        <div className="commerce-dashboard"><aside><b>MC</b><i /><i /><i /><i /></aside><div className="commerce-main"><header><span /><span /></header><div className="commerce-metrics"><i /><i /><i /></div><div className="commerce-chart"><span /><span /><span /><span /><span /><span /><span /></div><div className="commerce-rows"><i /><i /><i /></div></div></div>
      </div><span className="commerce-note">{c.commerceNote} · 02</span>
    </div>
  </Reveal>
}

function WorkSection() {
  const { lang } = useI18n(); const c = COPY[lang]
  const [filter, setFilter] = useState<ProjectFilter>('all'); const [openGame, setOpenGame] = useState<GameKind | null>(null)
  const filters: ProjectFilter[] = ['all', 'web', 'mobile', 'api', 'play']
  const projects = [
    { id: 'pokemon', filter: 'mobile' as const, year: '2025', color: 'violet', github: 'https://github.com/etomit/Pokemon_battle', content: c.projects.pokemon, mark: 'PK' },
    { id: 'api', filter: 'api' as const, year: '2025', color: 'blue', github: 'https://github.com/etomit/python_api_rest', content: c.projects.api, mark: 'API' },
    { id: '2048', filter: 'play' as const, year: 'LAB', color: 'lime', game: '2048' as const, content: c.projects.game2048, mark: '20' },
    { id: 'wordle', filter: 'play' as const, year: 'LAB', color: 'orange', game: 'wordle' as const, content: c.projects.wordle, mark: 'W' },
  ]
  useEffect(() => {
    if (!openGame) return
    const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [openGame])
  const shown = filter === 'all' || filter === 'web' ? projects : projects.filter((project) => project.filter === filter)

  return <section id="work" className="section work-section page-shell" aria-labelledby="work-heading">
    <SectionIntro kicker={c.workKicker} title={c.workTitle} intro={c.workIntro} />
    <Reveal className="featured-wrap" delay={80}><TiltCard className="featured-project">
      <div className="featured-copy">
        <div className="project-meta"><span className="live-badge"><i />Live</span><span>{c.featured}</span></div>
        <div><p className="project-index">PROJECT / 001</p><h3>Poké<span>Line</span></h3><p className="featured-description">{c.pokelineDesc}</p></div>
        <div className="tech-pills"><span>Laravel 12</span><span>Reverb</span><span>PostgreSQL</span><span>PokeAPI</span></div>
        <div className="project-actions">
          <a className="primary-button" href="https://pokeline-production.up.railway.app/" target="_blank" rel="noopener noreferrer">{c.playProject}<ArrowIcon /><small>{c.newTab}</small></a>
          <a className="secondary-button" href="https://github.com/etomit/PokeLine" target="_blank" rel="noopener noreferrer"><GithubIcon />{c.source}<span className="sr-only"> — {c.newTab}</span></a>
        </div>
      </div>
      <div className="featured-media">
        <div className="browser-chrome"><i /><i /><i /><span>pokeline-production.up.railway.app</span><b>↗</b></div>
        <img src="/pokeline-preview.png" alt="Combat dans PokéLine : Florizarre affronte Métalosse dans une arène rétro" width="1024" height="796" loading="lazy" /><div className="media-scanline" />
        <div className="featured-facts">{c.pokelineFacts.map(([number, label]) => <div key={label}><strong>{number}</strong><span>{label}</span></div>)}</div>
      </div>
    </TiltCard></Reveal>
    <CommerceSpotlight />
    <Reveal className="project-browser" delay={100}>
      <div className="project-filter" role="tablist" aria-label="Filtrer les projets">{filters.map((item, index) => <button key={item} role="tab" aria-selected={filter === item} className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)}>{c.filters[index]}</button>)}</div>
      <div className="project-grid">{shown.map((project, index) => <article className={`project-card project-card-${project.color}`} key={project.id} style={{ '--card-delay': `${index * 70}ms` } as CSSProperties}>
        <div className="project-card-top"><span>{project.year}</span><span>{project.filter}</span></div><div className="project-mark" aria-hidden="true"><span>{project.mark}</span><i /><i /></div>
        <div className="project-card-copy"><p>{c.archive}</p><h3>{project.content[0]}</h3><span>{project.content[2]}</span><p>{project.content[1]}</p></div>
        {project.github ? <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`${c.openGithub} — ${project.content[0]} — ${c.newTab}`}>{c.openGithub}<ArrowIcon /></a> : <button onClick={() => setOpenGame(project.game ?? null)}>{c.launch}<ArrowIcon /></button>}
      </article>)}</div>
    </Reveal>
    {openGame === '2048' && <Game2048 onClose={() => setOpenGame(null)} />}{openGame === 'wordle' && <WordleGame onClose={() => setOpenGame(null)} />}
  </section>
}

function ExpertiseSection() {
  const { lang } = useI18n(); const c = COPY[lang]
  return <section id="expertise" className="section expertise-section"><div className="page-shell">
    <SectionIntro kicker={c.expertiseKicker} title={c.expertiseTitle} intro={c.expertiseIntro} />
    <div className="capability-grid">{c.capabilities.map(([index, title, description, tags], itemIndex) => <Reveal key={index} delay={itemIndex * 90}><article className="capability-card"><div className="capability-number"><span>{index}</span><CodeIcon /></div><h3>{title}</h3><p>{description}</p><div>{tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article></Reveal>)}</div>
    <Reveal className="stack-panel" delay={120}><div className="stack-copy"><p>{c.stackLabel}</p><h3>{c.stackText}</h3></div><div className="stack-cloud">{SKILLS.map((skill, index) => <span key={skill} style={{ '--skill-index': index } as CSSProperties}>{skill}</span>)}</div></Reveal>
  </div></section>
}

function ExperienceSection() {
  const { lang, t } = useI18n(); const c = COPY[lang]; const [active, setActive] = useState(0); const jobs = t.experience.jobs
  return <section id="experience" className="section experience-section page-shell">
    <SectionIntro kicker={c.experienceKicker} title={c.experienceTitle} intro={c.experienceIntro} />
    <Reveal className="experience-layout" delay={90}>
      <div className="experience-list" role="tablist" aria-label={c.experienceTitle}>{jobs.map((job, index) => <button key={`${job.company}-${job.period}`} role="tab" aria-selected={index === active} className={index === active ? 'is-active' : ''} onClick={() => setActive(index)}><span className="experience-index">0{index + 1}</span><span><strong>{job.company}</strong><small>{job.period}</small></span><i><ArrowIcon /></i></button>)}</div>
      <article className="experience-detail" key={`${lang}-${active}`}><div className="detail-head"><span className="company-monogram">{jobs[active].company.split(' ').map((word) => word[0]).slice(0, 2).join('')}</span><div><p>{active === 0 ? c.current : jobs[active].location}</p><h3>{jobs[active].role}</h3><span>{jobs[active].company} · {jobs[active].period}</span></div></div><div className="detail-body"><p>{c.details}</p><ul>{jobs[active].tasks.map((task) => <li key={task}>{task}</li>)}</ul></div><div className="detail-tags">{jobs[active].tags.map((tag) => <span key={tag}>{tag}</span>)}</div></article>
    </Reveal>
  </section>
}

function EducationSection() {
  const { lang, t } = useI18n(); const c = COPY[lang]
  return <section id="education" className="section education-section"><div className="page-shell">
    <SectionIntro kicker={c.educationKicker} title={c.educationTitle} intro={c.educationIntro} />
    <div className="education-timeline">{t.education.items.map((item, index) => <Reveal key={`${item.school}-${item.period}`} className="education-item" delay={index * 80}><div className="education-date"><span>{item.period}</span><i /></div><article><div className="education-top"><span>{item.level}</span><p>0{index + 1}</p></div><h3>{item.degree}</h3><p>{item.school}</p><div>{item.tasks.map((task) => <span key={task}>{task}</span>)}</div></article></Reveal>)}</div>
  </div></section>
}

function ContactSection() {
  const { lang } = useI18n(); const c = COPY[lang]; const year = new Date().getFullYear()
  return <section id="contact" className="contact-section" aria-labelledby="contact-title"><div className="contact-orb" /><div className="page-shell">
    <Reveal className="contact-grid"><p className="section-kicker">{c.contactKicker}</p><div className="contact-main"><h2 id="contact-title">{c.contactTitle}</h2><p>{c.contactText}</p><div className="contact-links"><a className="primary-button" href="mailto:timothee.maire54300@gmail.com"><MailIcon />{c.email}<ArrowIcon /></a><a className="contact-icon-link" href="https://www.linkedin.com/in/timoth%C3%A9e-maire-476bb8194/" target="_blank" rel="noopener noreferrer" aria-label={`${c.linkedin} — ${c.newTab}`}><LinkedinIcon /><span>{c.linkedin}</span></a><a className="contact-icon-link" href="https://github.com/etomit" target="_blank" rel="noopener noreferrer" aria-label={`${c.github} — ${c.newTab}`}><GithubIcon /><span>{c.github}</span></a></div><p className="location-line"><span />{c.location}</p></div></Reveal>
    <footer><div><span className="footer-mark">TM</span><p>© {year} {c.footer}</p></div><p>{c.rights}</p><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Retour en haut"><ArrowIcon direction="down" /></button></footer>
  </div></section>
}

function Portfolio() {
  const { lang } = useI18n()
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('portfolio-theme') as Theme | null
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })
  useEffect(() => { document.documentElement.dataset.theme = theme; document.documentElement.style.colorScheme = theme; localStorage.setItem('portfolio-theme', theme) }, [theme])
  useEffect(() => {
    let frame = 0
    const onPointerMove = (event: PointerEvent) => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`); document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`) }) }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', onPointerMove) }
  }, [])
  return <div className="app"><a className="skip-link" href="#main-content">{COPY[lang].skip}</a><div className="pointer-glow" aria-hidden="true" /><Header theme={theme} setTheme={setTheme} /><Hero /><WorkSection /><ExpertiseSection /><ExperienceSection /><EducationSection /><ContactSection /></div>
}

export default function App() { return <I18nProvider><Portfolio /></I18nProvider> }
