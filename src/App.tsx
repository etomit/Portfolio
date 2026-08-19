import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import {
  siClaudecode,
  siCss,
  siDocker,
  siDotnet,
  siFlutter,
  siGit,
  siGooglegemini,
  siJavascript,
  siLaravel,
  siNginx,
  siNodedotjs,
  siPhp,
  siPostgresql,
  siPython,
  siReact,
  siSymfony,
  siTypescript,
  siWordpress,
} from 'simple-icons/icons'
import { I18nProvider, useI18n } from './i18n'
import Game2048 from './Game2048'
import WordleGame from './WordleGame'
import './App.css'

type Theme = 'dark' | 'light'
type GameKind = '2048' | 'wordle'

const NAV_IDS = ['expertise', 'experience', 'work', 'education', 'contact'] as const
const SKILLS = ['React', 'TypeScript', 'Symfony', 'Laravel', '.NET', 'Node.js', 'PostgreSQL', 'Docker', 'Git', 'Flutter', 'Python', 'Architecture SI']
const AI_TOOLS = ['Claude Code', 'Codex', 'Gemini']

type BrandIcon = { title: string; path: string; hex: string }

const BRAND_ICONS: Record<string, BrandIcon> = {
  React: siReact,
  TypeScript: siTypescript,
  Symfony: siSymfony,
  Laravel: siLaravel,
  '.NET': siDotnet,
  'Node.js': siNodedotjs,
  PostgreSQL: siPostgresql,
  Docker: siDocker,
  Git: siGit,
  Flutter: siFlutter,
  Python: siPython,
  PHP: siPhp,
  JavaScript: siJavascript,
  CSS: siCss,
  NGINX: siNginx,
  WordPress: siWordpress,
  'Claude Code': siClaudecode,
  Gemini: siGooglegemini,
}

const COPY = {
  fr: {
    skip: 'Aller au contenu', nav: ['Approche', 'Expérience', 'Projets personnels', 'Formation', 'Contact'],
    theme: 'Changer de thème', language: 'Passer le site en anglais', menu: 'Ouvrir le menu', close: 'Fermer',
    available: 'Concevoir · Construire · Améliorer', eyebrow: 'Développeur full-stack · Grand Est, France',
    heroLead: 'Je transforme les besoins métier en logiciels', heroAccent: 'utiles et durables.',
    heroText: 'Développeur full-stack orienté produit, je relie les usages terrain, une interface claire et une architecture robuste pour livrer des applications réellement adoptées.',
    viewWork: 'Découvrir mon approche', contactMe: 'Voir mon GitHub', scroll: 'Découvrir mon parcours',
    codeTitle: 'product_mindset.ts', codeComment: '// Construire des produits utiles',
    stats: [['3+', 'années de pratique'], ['1 200+', 'utilisateurs métier'], ['4', 'projets lançables']],
    approachKicker: 'Ma façon de travailler', approachTitle: 'Comprendre le besoin, construire juste, améliorer dans la durée.',
    approachText: 'J’aime partir du terrain, confronter les choix techniques aux usages réels et avancer par itérations. Le résultat attendu : un produit clair pour ses utilisateurs et sain pour l’équipe qui le fait évoluer.',
    approachFacts: [['Point de départ', 'Usage & métier'], ['Terrain technique', 'Applications web & SI'], ['Méthode', 'Produit × Design × Tech']], approachGithub: 'Explorer mon GitHub',
    workKicker: 'Projets personnels · 03', workTitle: 'Quatre projets, quatre expériences à lancer.',
    workIntro: 'Aucun projet dormant dans cette sélection : chaque réalisation peut être ouverte ou jouée directement depuis cette page.',
    featured: 'Projet vedette · 2026',
    pokelineDesc: 'Un jeu de combat multijoueur complet : hub 2D, moteur tactique côté serveur, modes solo/local/en ligne et synchronisation temps réel.',
    playProject: 'Jouer à PokéLine', source: 'Voir le code source', newTab: 'nouvel onglet',
    pokelineFacts: [['3', 'modes de jeu'], ['18', 'types gérés'], ['WebSocket', 'temps réel']],
    commerceLabel: 'Projet personnel · Produit SaaS', commerceTitle: 'MonCommerce Rapide',
    commerceDesc: 'Une solution de vitrine digitale et de click & collect pensée pour les commerces indépendants : catalogue, commandes, créneaux de retrait et expérience client unifiée.',
    commerceRoadmap: 'Roadmap transparente : cartes de fidélité dans Apple Wallet et Google Wallet — fonctionnalité prévue, pas encore disponible.',
    commerceNote: 'Maquette accessible', commerceAction: 'Tester la maquette',
    playgroundLabel: 'Jouables ici', playgroundTitle: 'Deux expériences intégrées au portfolio.', launch: 'Jouer ici',
    projects: {
      game2048: ['2048 / React', 'Le classique revisité dans le design system du portfolio, jouable au clavier comme au tactile.', 'Playground · TypeScript'],
      wordle: ['Wordle bilingue', 'Un jeu de lettres français/anglais avec clavier virtuel, validation et animations de résultat.', 'Playground · React'],
    },
    expertiseKicker: 'Approche & compétences · 01', expertiseTitle: 'Comprendre le produit avant d’écrire le code.',
    expertiseIntro: 'Mon terrain de jeu va de l’interface au modèle de données. Mon objectif reste constant : rendre le métier plus simple, le système plus fiable et le code plus facile à faire évoluer.',
    capabilities: [
      ['01', 'Interfaces produit', 'Design systems, accessibilité, responsive et micro-interactions utiles. Je cherche une interface lisible avant de chercher un effet.', ['React', 'TypeScript', 'UX engineering']],
      ['02', 'Applications métier', 'Des workflows fiables pour des utilisateurs réels : droits, validation, traçabilité et intégration au système d’information.', ['Symfony', '.NET', 'SQL']],
      ['03', 'Architecture & delivery', 'API, modélisation, conteneurisation et déploiement. Une base technique pensée pour évoluer sans ralentir l’équipe.', ['REST', 'PostgreSQL', 'Docker']],
    ],
    stackLabel: 'Stack & outils', stackText: 'Une boîte à outils volontairement large, utilisée selon le problème — jamais pour cocher des cases.',
    aiLabel: 'IA de développement', aiTitle: 'Claude Code, Codex & Gemini',
    aiText: 'Je les utilise pour explorer une base de code, prototyper, refactorer, tester et documenter plus vite. Les choix d’architecture, la revue et la validation finale restent sous contrôle humain.',
    aiNote: 'Outils maîtrisés · décisions vérifiées',
    experienceKicker: 'Expérience · 02', experienceTitle: 'Construire dans le monde réel.',
    experienceIntro: 'Des environnements industriels, logistiques et numériques qui m’ont appris à relier contraintes terrain et décisions techniques.',
    current: 'Aujourd’hui', details: 'Missions clés',
    educationKicker: 'Formation · 04', educationTitle: 'Apprendre, consolider, transmettre.',
    educationIntro: 'Un parcours progressif du système et réseau vers l’architecture logicielle et le pilotage de projets.',
    contactKicker: 'Contact · 05', contactTitle: 'Faisons avancer une idée, un produit ou un outil métier.',
    contactText: 'Une idée, un besoin métier ou un défi technique mérite mieux qu’une solution générique. Échangeons directement par email ou LinkedIn.',
    email: 'Écrire un email', linkedin: 'LinkedIn', github: 'GitHub', location: 'Grand Est, France · Travail hybride',
    footer: 'Conçu et développé par Timothée Maire.', rights: 'Portfolio personnel · Aucun formulaire de connexion ni collecte de données.',
  },
  en: {
    skip: 'Skip to content', nav: ['Approach', 'Experience', 'Personal projects', 'Education', 'Contact'],
    theme: 'Switch theme', language: 'Switch the website to French', menu: 'Open menu', close: 'Close',
    available: 'Design · Build · Improve', eyebrow: 'Full-stack developer · Grand Est, France',
    heroLead: 'I turn business needs into software that is', heroAccent: 'useful and built to last.',
    heroText: 'As a product-minded full-stack developer, I connect field use cases, clear interfaces and robust architecture to ship applications people actually adopt.',
    viewWork: 'Discover my approach', contactMe: 'View my GitHub', scroll: 'Explore my journey',
    codeTitle: 'product_mindset.ts', codeComment: '// Build useful products',
    stats: [['3+', 'years of practice'], ['1,200+', 'business users'], ['4', 'launchable projects']],
    approachKicker: 'How I work', approachTitle: 'Understand the need, build the right thing, improve it over time.',
    approachText: 'I like to start from real use cases, challenge technical choices against actual needs and move forward iteratively. The goal: a clear product for its users and a healthy codebase for the team evolving it.',
    approachFacts: [['Starting point', 'Users & business'], ['Technical scope', 'Web apps & IS'], ['Method', 'Product × Design × Tech']], approachGithub: 'Explore my GitHub',
    workKicker: 'Personal projects · 03', workTitle: 'Four projects, four experiences ready to launch.',
    workIntro: 'No dormant repository in this selection: every project can be opened or played directly from this page.',
    featured: 'Featured project · 2026',
    pokelineDesc: 'A complete multiplayer battle game: 2D hub, server-side tactical engine, solo/local/online modes and real-time sync.',
    playProject: 'Play PokéLine', source: 'View source code', newTab: 'new tab',
    pokelineFacts: [['3', 'game modes'], ['18', 'managed types'], ['WebSocket', 'real time']],
    commerceLabel: 'Personal project · SaaS product', commerceTitle: 'MonCommerce Rapide',
    commerceDesc: 'A digital storefront and click-and-collect solution for independent businesses: catalogue, orders, pickup slots and one consistent customer journey.',
    commerceRoadmap: 'Transparent roadmap: loyalty cards in Apple Wallet and Google Wallet — planned, not yet available.',
    commerceNote: 'Live prototype', commerceAction: 'Try the prototype',
    playgroundLabel: 'Play here', playgroundTitle: 'Two experiences embedded in the portfolio.', launch: 'Play here',
    projects: {
      game2048: ['2048 / React', 'The classic rebuilt in the portfolio design system, playable with a keyboard or touch gestures.', 'Playground · TypeScript'],
      wordle: ['Bilingual Wordle', 'A French/English word game with a virtual keyboard, validation and result animations.', 'Playground · React'],
    },
    expertiseKicker: 'Approach & skills · 01', expertiseTitle: 'Understand the product before writing code.',
    expertiseIntro: 'My scope runs from the interface to the data model. The goal stays the same: simplify the business, strengthen the system and make the code easier to evolve.',
    capabilities: [
      ['01', 'Product interfaces', 'Design systems, accessibility, responsive layouts and purposeful micro-interactions. Clarity always comes before effects.', ['React', 'TypeScript', 'UX engineering']],
      ['02', 'Business applications', 'Reliable workflows for real users: permissions, validation, traceability and information-system integration.', ['Symfony', '.NET', 'SQL']],
      ['03', 'Architecture & delivery', 'APIs, data modelling, containers and deployment. A technical foundation designed to evolve without slowing the team down.', ['REST', 'PostgreSQL', 'Docker']],
    ],
    stackLabel: 'Stack & tools', stackText: 'A deliberately broad toolkit, selected for the problem at hand — never to tick boxes.',
    aiLabel: 'AI development tools', aiTitle: 'Claude Code, Codex & Gemini',
    aiText: 'I use them to explore codebases, prototype, refactor, test and document faster. Architecture choices, reviews and final validation remain under human control.',
    aiNote: 'Tools mastered · decisions verified',
    experienceKicker: 'Experience · 02', experienceTitle: 'Building in the real world.',
    experienceIntro: 'Industrial, logistics and digital environments taught me how to connect field constraints with technical decisions.',
    current: 'Today', details: 'Key work',
    educationKicker: 'Education · 04', educationTitle: 'Learn, consolidate, share.',
    educationIntro: 'A progressive journey from systems and networks to software architecture and project leadership.',
    contactKicker: 'Contact · 05', contactTitle: 'Let’s move an idea, a product or a business tool forward.',
    contactText: 'An idea, a business need or a technical challenge deserves more than a generic solution. Let’s talk directly by email or LinkedIn.',
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

function GenericTechGlyph({ name }: { name: string }) {
  if (name === 'Codex') return <svg viewBox="0 0 24 24"><rect x="2.5" y="4.5" width="19" height="15" rx="3" /><path d="m7 10 2.5 2L7 14M12.5 15H17" /></svg>
  if (name === 'Architecture SI') return <svg viewBox="0 0 24 24"><rect x="9" y="2.5" width="6" height="5" rx="1" /><rect x="2.5" y="16.5" width="6" height="5" rx="1" /><rect x="15.5" y="16.5" width="6" height="5" rx="1" /><path d="M12 7.5v4.5M5.5 16.5V12h13v4.5" /></svg>
  if (name === 'SQL') return <svg viewBox="0 0 24 24"><ellipse cx="12" cy="5.5" rx="7.5" ry="3" /><path d="M4.5 5.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6M4.5 11.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" /></svg>
  if (name === 'PokeAPI') return <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M3 12h6M15 12h6" /><circle cx="12" cy="12" r="3" /></svg>
  if (name === 'Reverb') return <svg viewBox="0 0 24 24"><path d="M5 9v6M9 6v12M13 9v6M17 4v16M21 8v8" /></svg>
  if (name === 'REST') return <svg viewBox="0 0 24 24"><path d="M8 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M8 9l-3 3 3 3M16 9l3 3-3 3" /></svg>
  if (name === 'UX engineering' || name === 'Expérience client') return <svg viewBox="0 0 24 24"><rect x="3" y="3.5" width="18" height="14" rx="2" /><path d="M3 8h18M8 21l4-3.5 4 3.5" /></svg>
  if (name === 'Logistique') return <svg viewBox="0 0 24 24"><path d="m4 7 8-4 8 4-8 4-8-4ZM4 7v10l8 4 8-4V7M12 11v10" /></svg>
  if (name === 'Click & collect') return <svg viewBox="0 0 24 24"><path d="M5 8h14l-1 13H6L5 8ZM9 9V6a3 3 0 0 1 6 0v3M9 15l2 2 4-4" /></svg>
  return <CodeIcon />
}

function TechIcon({ name }: { name: string }) {
  const normalized = name.replace(/\s+12$/, '')
  const icon = BRAND_ICONS[normalized] ?? (normalized === 'C#' ? siDotnet : undefined)
  if (!icon) return <span className="tech-logo tech-logo-generic" aria-hidden="true"><GenericTechGlyph name={normalized} /></span>
  return <span className="tech-logo tech-logo-brand" style={{ '--logo-color': `#${icon.hex}` } as CSSProperties} aria-hidden="true"><svg viewBox="0 0 24 24"><path d={icon.path} /></svg></span>
}

function TechLabel({ name, className = '' }: { name: string; className?: string }) {
  return <span className={`tech-label ${className}`}><TechIcon name={name} /><span>{name}</span></span>
}

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

function SectionIntro({ kicker, title, intro, headingId }: { kicker: string; title: string; intro: string; headingId?: string }) {
  return <Reveal className="section-intro"><p className="section-kicker">{kicker}</p><div className="section-intro-grid"><h2 id={headingId}>{title}</h2><p>{intro}</p></div></Reveal>
}

function Header({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  const { lang, setLang } = useI18n()
  const c = COPY[lang]
  const [active, setActive] = useState('expertise')
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
        <a className="icon-button github-button" href="https://github.com/etomit" target="_blank" rel="noopener noreferrer" aria-label={`${c.github} — ${c.newTab}`}><GithubIcon /></a>
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
            <button className="primary-button" onClick={() => document.getElementById('expertise')?.scrollIntoView({ behavior: 'smooth' })}>{c.viewWork}<ArrowIcon direction="down" /></button>
            <a className="text-link" href="https://github.com/etomit" target="_blank" rel="noopener noreferrer">{c.contactMe}<GithubIcon /></a>
          </div>
        </div>
        <div className="hero-visual hero-enter" style={{ '--enter-delay': '260ms' } as CSSProperties} aria-label="Portrait et aperçu technique de Timothée Maire">
          <div className="portrait-rail"><span>FULL-STACK</span><span>2026</span></div>
          <div className="portrait-frame"><div className="portrait-glow" /><img src="/profile-optimized.png" alt="Timothée Maire" width="1080" height="1440" fetchPriority="high" /><div className="portrait-caption"><p>Timothée Maire</p><span>Developer / Builder</span></div></div>
          <div className="floating-card floating-card-code"><div className="floating-card-head"><i /><i /><i /><span>{c.codeTitle}</span></div><pre><span className="code-muted">{c.codeComment}</span>{'\n'}<span className="code-purple">const</span> product = {'{'}{'\n'}  interface: <span className="code-green">'fluide'</span>,{'\n'}  architecture: <span className="code-green">'solide'</span>{'\n'}{'}'}</pre></div>
          <div className="floating-card floating-card-stack"><span className="floating-tech-icons"><TechIcon name="React" /><TechIcon name="Symfony" /></span><div><strong>React × Symfony</strong><small>production ready</small></div></div>
        </div>
        <div className="hero-footer hero-enter" style={{ '--enter-delay': '480ms' } as CSSProperties}>
          <div className="hero-stats">{c.stats.map(([number, label]) => <div key={label}><strong>{number}</strong><span>{label}</span></div>)}</div>
          <button className="scroll-cue" onClick={() => document.getElementById('expertise')?.scrollIntoView({ behavior: 'smooth' })}><span>{c.scroll}</span><i><ArrowIcon direction="down" /></i></button>
        </div>
      </div>
    </section><KineticStrip />
  </main>
}

function ApproachBrief() {
  const { lang } = useI18n(); const c = COPY[lang]
  return <section className="approach-brief" aria-labelledby="approach-title"><div className="page-shell">
    <Reveal className="approach-brief-grid">
      <div className="approach-brief-copy"><p className="section-kicker">{c.approachKicker}</p><h2 id="approach-title">{c.approachTitle}</h2><p>{c.approachText}</p><a href="https://github.com/etomit" target="_blank" rel="noopener noreferrer"><GithubIcon />{c.approachGithub}<ArrowIcon /></a></div>
      <div className="approach-facts">{c.approachFacts.map(([label, value], index) => <div key={label}><span>0{index + 1}</span><p>{label}</p><strong>{value}</strong></div>)}</div>
    </Reveal>
  </div></section>
}

function KineticStrip() {
  const items = [...SKILLS.slice(0, 8), ...SKILLS.slice(0, 8)]
  return <div className="kinetic-strip" aria-hidden="true"><div className="kinetic-track">{items.map((skill, index) => <span key={`${skill}-${index}`}><TechIcon name={skill} /><b>{skill}</b><i>✦</i></span>)}</div></div>
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
      <div><TechLabel name="Click & collect" /><TechLabel name="React" /><TechLabel name="Expérience client" /></div>
      <p className="commerce-roadmap"><span>→</span>{c.commerceRoadmap}</p>
      <a className="primary-button" href="https://moncommercerapide-production.up.railway.app/" target="_blank" rel="noopener noreferrer">{c.commerceAction}<ArrowIcon /><small>{c.newTab}</small></a>
    </div>
    <div className="commerce-visual">
      <div className="commerce-window"><div className="browser-chrome"><i /><i /><i /><span>moncommercerapide-production.up.railway.app</span><b>↗</b></div><img src="/mon-commerce-rapide-brand.png" alt="Page d’accueil MonCommerce Rapide présentant une vitrine digitale pour commerçants" width="1677" height="938" loading="lazy" /></div>
      <span className="commerce-note"><i />{c.commerceNote} · 02</span>
    </div>
  </Reveal>
}

function WorkSection() {
  const { lang } = useI18n(); const c = COPY[lang]
  const [openGame, setOpenGame] = useState<GameKind | null>(null)
  const projects = [
    { id: '2048', year: 'PLAY', color: 'aqua', game: '2048' as const, content: c.projects.game2048, mark: '20', tech: 'TypeScript' },
    { id: 'wordle', year: 'PLAY', color: 'orange', game: 'wordle' as const, content: c.projects.wordle, mark: 'W', tech: 'React' },
  ]
  useEffect(() => {
    if (!openGame) return
    const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [openGame])
  return <section id="work" className="section work-section page-shell" aria-labelledby="work-heading">
    <SectionIntro kicker={c.workKicker} title={c.workTitle} intro={c.workIntro} headingId="work-heading" />
    <Reveal className="featured-wrap" delay={80}><TiltCard className="featured-project">
      <div className="featured-copy">
        <div className="project-meta"><span className="live-badge"><i />Live</span><span>{c.featured}</span></div>
        <div><p className="project-index">PERSONAL / 001</p><h3>Poké<span>Line</span></h3><p className="featured-description">{c.pokelineDesc}</p></div>
        <div className="tech-pills"><TechLabel name="Laravel 12" /><TechLabel name="Reverb" /><TechLabel name="PostgreSQL" /><TechLabel name="PokeAPI" /></div>
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
      <div className="playground-heading"><div><p className="section-kicker">{c.playgroundLabel}</p><h3>{c.playgroundTitle}</h3></div><span>03—04</span></div>
      <div className="project-grid project-grid-playable">{projects.map((project, index) => <article className={`project-card project-card-${project.color}`} key={project.id} style={{ '--card-delay': `${index * 70}ms` } as CSSProperties}>
        <div className="project-card-top"><span>{project.year}</span><span>0{index + 3}</span></div><div className="project-mark" aria-hidden="true"><span>{project.mark}</span><i /><i /></div>
        <div className="project-card-copy"><p>{c.playgroundLabel}</p><h3>{project.content[0]}</h3><TechLabel name={project.tech} /><p>{project.content[1]}</p></div>
        <button onClick={() => setOpenGame(project.game)}>{c.launch}<ArrowIcon /></button>
      </article>)}</div>
    </Reveal>
    {openGame === '2048' && <Game2048 onClose={() => setOpenGame(null)} />}{openGame === 'wordle' && <WordleGame onClose={() => setOpenGame(null)} />}
  </section>
}

function ExpertiseSection() {
  const { lang } = useI18n(); const c = COPY[lang]
  return <section id="expertise" className="section expertise-section"><div className="page-shell">
    <SectionIntro kicker={c.expertiseKicker} title={c.expertiseTitle} intro={c.expertiseIntro} />
    <div className="capability-grid">{c.capabilities.map(([index, title, description, tags], itemIndex) => <Reveal key={index} delay={itemIndex * 90}><article className="capability-card"><div className="capability-number"><span>{index}</span><CodeIcon /></div><h3>{title}</h3><p>{description}</p><div>{tags.map((tag) => <TechLabel name={tag} key={tag} />)}</div></article></Reveal>)}</div>
    <Reveal className="stack-panel" delay={120}><div className="stack-copy"><p>{c.stackLabel}</p><h3>{c.stackText}</h3></div><div className="stack-groups"><div className="stack-cloud">{SKILLS.map((skill) => <TechLabel name={skill} key={skill} className="stack-tech" />)}</div><div className="ai-practice"><div className="ai-practice-copy"><p>{c.aiLabel}</p><h4>{c.aiTitle}</h4><span>{c.aiText}</span><small>{c.aiNote}</small></div><div className="ai-tools">{AI_TOOLS.map((tool) => <TechLabel name={tool} key={tool} className="ai-tool" />)}</div></div></div></Reveal>
  </div></section>
}

function ExperienceSection() {
  const { lang, t } = useI18n(); const c = COPY[lang]; const [active, setActive] = useState(0); const [direction, setDirection] = useState<'forward' | 'backward'>('forward'); const [wheelTurn, setWheelTurn] = useState(0); const jobs = t.experience.jobs
  const getWheelOffset = (index: number) => {
    const half = Math.floor(jobs.length / 2)
    return ((index - active + half + jobs.length) % jobs.length) - half
  }
  const selectJob = (index: number) => {
    const offset = getWheelOffset(index)
    if (offset === 0) return
    setDirection(offset > 0 ? 'forward' : 'backward')
    setWheelTurn((turn) => turn + offset)
    setActive(index)
  }
  return <section id="experience" className="section experience-section page-shell">
    <SectionIntro kicker={c.experienceKicker} title={c.experienceTitle} intro={c.experienceIntro} />
    <Reveal className="experience-layout" delay={90}>
      <div className="experience-wheel" role="tablist" aria-label={c.experienceTitle} style={{ '--wheel-turn': wheelTurn } as CSSProperties}>
        <div className="experience-wheel-ring" aria-hidden="true" />
        <div className="experience-wheel-hub" aria-hidden="true"><strong>0{active + 1}</strong><span>/ 0{jobs.length}</span></div>
        {jobs.map((job, index) => {
          const offset = getWheelOffset(index)
          return <div className="experience-wheel-spoke" key={`${job.company}-${job.period}`} style={{ '--wheel-offset': offset, '--wheel-depth': Math.abs(offset), zIndex: 10 - Math.abs(offset) } as CSSProperties}>
            <button id={`experience-tab-${index}`} role="tab" aria-controls="experience-detail" aria-selected={index === active} tabIndex={index === active ? 0 : -1} className={index === active ? 'is-active' : ''} onClick={() => selectJob(index)} onKeyDown={(event) => {
              if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(event.key)) return
              event.preventDefault()
              const step = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1
              const nextIndex = (active + step + jobs.length) % jobs.length
              selectJob(nextIndex)
              requestAnimationFrame(() => document.getElementById(`experience-tab-${nextIndex}`)?.focus())
            }}>
              <span className="experience-index">0{index + 1}</span><span className="experience-job-copy"><strong>{job.company}</strong><small>{job.period}</small></span><i><ArrowIcon /></i>
            </button>
          </div>
        })}
      </div>
      <article id="experience-detail" role="tabpanel" aria-labelledby={`experience-tab-${active}`} className={`experience-detail is-${direction}`} key={`${lang}-${active}`}><div className="detail-head"><span className="company-monogram">{jobs[active].company.split(' ').map((word) => word[0]).slice(0, 2).join('')}</span><div><p>{active === 0 ? c.current : jobs[active].location}</p><h3>{jobs[active].role}</h3><span>{jobs[active].company} · {jobs[active].period}</span></div></div><div className="detail-body"><p>{c.details}</p><ul>{jobs[active].tasks.map((task, index) => <li key={task} style={{ '--task-index': index } as CSSProperties}>{task}</li>)}</ul></div><div className="detail-tags">{jobs[active].tags.map((tag) => <TechLabel name={tag} key={tag} className="detail-tech" />)}</div></article>
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
  return <div className="app"><a className="skip-link" href="#main-content">{COPY[lang].skip}</a><div className="pointer-glow" aria-hidden="true" /><Header theme={theme} setTheme={setTheme} /><Hero /><ApproachBrief /><ExpertiseSection /><ExperienceSection /><WorkSection /><EducationSection /><ContactSection /></div>
}

export default function App() { return <I18nProvider><Portfolio /></I18nProvider> }
