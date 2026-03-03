import { useEffect, useRef, useState, createContext, useContext } from 'react'
import { I18nProvider, useI18n } from './i18n'
import Game2048 from './Game2048'
import WordleGame from './WordleGame'
import './App.css'

/* ── Theme ── */
type Theme = 'dark' | 'light'
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void }>({ theme: 'light', toggleTheme: () => {} })
function useTheme() { return useContext(ThemeContext) }
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme) }, [theme])
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === 'dark' ? 'light' : 'dark') }}>
      {children}
    </ThemeContext.Provider>
  )
}

/* ── Scroll reveal ── */
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

/* ── Company logos ── */
const companyLogos: Record<string, string> = {
  'Daimler Buses France': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAoNwpPBHkD-u-pDr5QpIqArNbc3XFcqv9cA&s',
  'Kuehne + Nagel':       'https://companieslogo.com/img/orig/KNIN.SW-8785cbf6.png?t=1724404808',
  'Lidl France':          'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Lidl-Logo.svg/1280px-Lidl-Logo.svg.png',
  'Lycée Jean Prouvé':    'https://sites.ac-nancy-metz.fr/lyc-jean-prouve-nancy/wp-content/uploads/2022/06/siteon0.png',
}

function CompanyLogo({ company }: { company: string }) {
  const [ok, setOk] = useState(true)
  const url = companyLogos[company]
  if (url && ok) {
    return (
      <div className="clogo clogo--img">
        <img src={url} alt={company} onError={() => setOk(false)} />
      </div>
    )
  }
  return <div className="clogo clogo--text">{company.slice(0, 2).toUpperCase()}</div>
}

/* ── Skill data ── */
const ALL_SKILLS = [
  // Frontend
  { name: 'HTML5',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',                 cat: 'Frontend' },
  { name: 'CSS3',        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',                   cat: 'Frontend' },
  { name: 'JavaScript',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',        cat: 'Frontend' },
  { name: 'TypeScript',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',        cat: 'Frontend' },
  { name: 'React.js',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',                  cat: 'Frontend' },
  { name: 'Vue.js',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',                  cat: 'Frontend' },
  { name: 'Next.js',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',                cat: 'Frontend' }, // (devicon existe, souvent noir)
  { name: 'Nuxt.js',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg',                cat: 'Frontend' },
  { name: 'Bootstrap',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',          cat: 'Frontend' },
  { name: 'Material UI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg',        cat: 'Frontend' },
  { name: 'WordPress',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg',             cat: 'Frontend' },

  // Backend
  { name: 'PHP',         icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',                      cat: 'Backend' },
  { name: 'Laravel',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',              cat: 'Backend' },
  { name: 'Symfony',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/symfony/symfony-original.svg',              cat: 'Backend' }, // (souvent noir)
  { name: 'Node.js',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',                cat: 'Backend' },
  { name: 'Python',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',                cat: 'Backend' },
  { name: 'C#',          icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',                cat: 'Backend' },
  { name: '.NET',        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg',              cat: 'Backend' },
  { name: 'Java',        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',                    cat: 'Backend' },

  // Data
  { name: 'SQL',                  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',                         cat: 'Data' },
  { name: 'MySQL',                icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',                         cat: 'Data' },
  { name: 'PostgreSQL',           icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',               cat: 'Data' },
  { name: 'SQLite',               icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg',                       cat: 'Data' },
  { name: 'Microsoft SQL Server', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg',  cat: 'Data' },

  // DevOps & Tools
  { name: 'Git',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',                 cat: 'DevOps' },
  { name: 'GitHub',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',           cat: 'DevOps' },
  { name: 'GitLab',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg',           cat: 'DevOps' },
  { name: 'Docker',   icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',           cat: 'DevOps' },
  { name: 'NGINX',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg',             cat: 'DevOps' },
  { name: 'Postman',  icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg',         cat: 'DevOps' },
  { name: 'APIs',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openapi/openapi-original.svg',         cat: 'DevOps' }, // OpenAPI = bon proxy visuel pour “APIs”
  { name: 'JSON',     icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/json/json-original.svg',               cat: 'DevOps' }, // parfois dispo, sinon à remplacer

  // Mobile
  { name: 'React Native', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',         cat: 'Mobile' },
  { name: 'Flutter',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',     cat: 'Mobile' },

  // Languages (misc / low-level)
  { name: 'C',        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',                     cat: 'Languages' },
  { name: 'VB',       icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualbasic/visualbasic-original.svg', cat: 'Languages' },
  { name: 'VBA',      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualbasic/visualbasic-original.svg', cat: 'Languages' },
]

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   NAVBAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Navbar() {
  const { t, lang, setLang } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { key: 'experience', label: t.nav.experience },
    { key: 'skills',     label: t.nav.skills },
    { key: 'education',  label: t.nav.education },
    { key: 'projects',   label: t.nav.projects },
    { key: 'contact',    label: t.nav.contact },
  ]

  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }

  return (
    <nav className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => go('hero')}>
          <span className="nav-logo-dot" />
          Timothée Maire
        </button>

        <ul className="nav-links">
          {links.map(l => (
            <li key={l.key}><button onClick={() => go(l.key)}>{l.label}</button></li>
          ))}
        </ul>

        <div className="nav-controls">
          <button className="nav-lang" onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}>
            {lang === 'fr' ? '🇬🇧' : '🇫🇷'}
          </button>
          <button className="nav-theme" onClick={toggleTheme} title={theme === 'dark' ? 'Thème clair' : 'Thème sombre'}>
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          <button className={`nav-burger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="nav-mobile">
          {links.map(l => (
            <button key={l.key} onClick={() => go(l.key)}>{l.label}</button>
          ))}
          <div className="nav-mobile-controls">
            <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}>{lang === 'fr' ? 'English' : 'Français'}</button>
            <button onClick={toggleTheme}>{theme === 'dark' ? 'Thème clair' : 'Thème sombre'}</button>
          </div>
        </div>
      )}
    </nav>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HERO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function HeroSection() {
  const { t } = useI18n()
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" className="hero">
      {/* background orbs */}
      <div className="hero-orb hero-orb--1" />
      <div className="hero-orb hero-orb--2" />

      {/* photo — right side blending into bg */}
      <div className="hero-photo-wrap">
        <img src="/profile2.png" alt="Timothée Maire" className="hero-photo" />
        <div className="hero-photo-fade" />
        <div className="hero-photo-fade-b" />
        <div className="hero-photo-fade-t" />
        <div className="hero-chip chip-avail animate-in delay-3">
          <span className="chip-dot" /> {t.hero.available}
        </div>
        <div className="hero-chip chip-stack animate-in delay-4">FullStack</div>
      </div>

      {/* content */}
      <div className="hero-body">
        <div className="hero-eyebrow animate-in delay-1">
          <span className="eyebrow-line" />
          {t.hero.greeting}
        </div>
        <h1 className="hero-name animate-in delay-2">
          Timothée<br />
          <span className="hero-name-accent">Maire.</span>
        </h1>
        <p className="hero-role animate-in delay-3">{t.hero.title}</p>
        <p className="hero-desc animate-in delay-3">{t.hero.description}</p>

        <div className="hero-cta animate-in delay-4">
          <button className="btn-cta" onClick={() => go('contact')}>{t.hero.cta}</button>
          <button className="btn-ghost" onClick={() => go('experience')}>
            {t.nav.experience} ↓
          </button>
        </div>

        <div className="hero-stats animate-in delay-4">
          <div className="hero-stat">
            <span className="hero-stat-n">3+</span>
            <span className="hero-stat-l">{t.hero.yearsXp ?? 'ans d\'exp.'}</span>
          </div>
          <div className="hero-stat-div" />
          <div className="hero-stat">
            <span className="hero-stat-n">17+</span>
            <span className="hero-stat-l">{t.hero.techs ?? 'technos'}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   EXPERIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ExperienceSection() {
  const { t } = useI18n()
  const { ref, visible } = useScrollReveal()

  const badgeStyle: Record<string, React.CSSProperties> = {
    current:  { background: 'rgba(34,197,94,.12)',  color: '#16a34a', border: '1px solid rgba(34,197,94,.35)' },
    parttime: { background: 'rgba(249,115,22,.1)',  color: '#ea580c', border: '1px solid rgba(249,115,22,.3)' },
    internship:{ background: 'rgba(99,102,241,.1)', color: '#6366f1', border: '1px solid rgba(99,102,241,.3)' },
  }

  return (
    <section id="experience" className="section section--tinted">
      <div ref={ref} className={`container reveal ${visible ? 'revealed' : ''}`}>
        <h2 className="section-heading">{t.experience.title}</h2>

        <div className="xp-list">
          {t.experience.jobs.map((job, i) => (
            <div className="xp-item" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="xp-aside">
                <CompanyLogo company={job.company} />
                <div className="xp-line" />
              </div>
              <div className="xp-body">
                <div className="xp-top">
                  <div className="xp-meta">
                    <h3 className="xp-role">{job.role}</h3>
                    <span className="xp-company">{job.company}</span>
                    <span className="xp-period">{job.period} · {job.location}</span>
                  </div>
                  {(job.type === 'current' || job.type === 'parttime' || job.type === 'internship') && (
                    <span className="xp-badge" style={badgeStyle[job.type]}>
                      {job.type === 'current' ? t.experience.current : job.type === 'parttime' ? t.experience.parttime : t.experience.internship}
                    </span>
                  )}
                </div>
                <ul className="xp-tasks">
                  {job.tasks.map((task, j) => <li key={j}>{task}</li>)}
                </ul>
                <div className="xp-tags">
                  {job.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SKILLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SkillsSection() {
  const { t } = useI18n()
  const { ref, visible } = useScrollReveal()

  const cats = [...new Set(ALL_SKILLS.map(s => s.cat))]

  return (
    <section id="skills" className="section">
      <div ref={ref} className={`container reveal ${visible ? 'revealed' : ''}`}>
        <h2 className="section-heading">{t.skills.title}</h2>

        <div className="sk-layout">
          {cats.map(cat => (
            <div className="sk-group" key={cat}>
              <h3 className="sk-cat">{cat}</h3>
              <div className="sk-chips">
                {ALL_SKILLS.filter(s => s.cat === cat).map(s => (
                  <div className="sk-chip" key={s.name}>
                    <img src={s.icon} alt={s.name} />
                    <span>{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sk-langs">
          <h3 className="sk-cat">{t.skills.languages}</h3>
          <div className="sk-lang-row">
            <div className="sk-lang-item">
              <span className="sk-lang-flag">🇫🇷</span>
              <div className="sk-lang-info">
                <span className="sk-lang-name">{t.skills.langFrName}</span>
                <span className="sk-lang-level">{t.skills.langFrLevel}</span>
              </div>
              <div className="sk-dots">
                {[1,2,3,4,5].map(n => <span key={n} className="sk-dot sk-dot--on" />)}
              </div>
            </div>
            <div className="sk-lang-item">
              <span className="sk-lang-flag">🇬🇧</span>
              <div className="sk-lang-info">
                <span className="sk-lang-name">{t.skills.langEnName}</span>
                <span className="sk-lang-level">{t.skills.langEnLevel}</span>
              </div>
              <div className="sk-dots">
                {[1,2,3].map(n => <span key={n} className="sk-dot sk-dot--on" />)}
                <span className="sk-dot" />
                <span className="sk-dot" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SOFT SKILLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SoftSkillsSection() {
  const { lang } = useI18n()
  const { ref, visible } = useScrollReveal()

  const title = lang === 'fr' ? 'Soft Skills' : 'Soft Skills'
  const items = lang === 'fr'
    ? ['Communication claire', 'Organisation & priorisation', 'Orientation client', 'Autonomie', 'Résolution de problèmes', 'Vision architecture']
    : ['Clear communication', 'Organization & prioritization', 'Client mindset', 'Autonomy', 'Problem solving', 'Architecture mindset']

  return (
    <section id="softskills" className="section section">
      <div ref={ref} className={`container reveal ${visible ? 'revealed' : ''}`}>
        <h2 className="section-heading">{title}</h2>
        <div className="soft-badges">
          {items.map(it => <span className="soft-badge" key={it}>{it}</span>)}
        </div>
      </div>
    </section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   EDUCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function EducationSection() {
  const { t } = useI18n()
  const { ref, visible } = useScrollReveal()

  const schoolMap: Record<string, string> = {
    'CESI, Nancy': 'CESI',
    'Lycée Frédéric Chopin, Nancy': 'Chopin',
    'Lycée Frédéric Chopin': 'Chopin',
    'Lycée Charles de Gaulle, Nancy': 'CdG',
  }

  return (
    <section id="education" className="section section--tinted">
      <div ref={ref} className={`container reveal ${visible ? 'revealed' : ''}`}>
        <h2 className="section-heading">{t.education.title}</h2>

        <div className="edu-grid">
          {t.education.items.map((item, i) => (
            <div className="edu-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="edu-card-top">
                <div className="edu-logo-badge">
                  {schoolMap[item.school] ?? item.school.slice(0, 5)}
                </div>
                <div className="edu-level-badge">{item.level}</div>
              </div>
              <h3 className="edu-degree">{item.degree}</h3>
              <p className="edu-meta">{item.school} · {item.period}</p>
              <ul className="edu-tasks">
                {item.tasks.map((task, j) => <li key={j}>{task}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PROJECTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProjectsSection() {
  const { t } = useI18n()
  const { ref, visible } = useScrollReveal()
  const [openGame, setOpenGame] = useState<null | '2048' | 'wordle'>(null)

  const projects = [
    { id: '2048' as const, title: t.projects.game2048Title, desc: t.projects.game2048Desc, tags: ['React', 'TypeScript'], emoji: '🎮', accent: '#6366f1' },
    { id: 'wordle' as const, title: t.projects.wordleTitle, desc: t.projects.wordleDesc, tags: ['React', 'i18n', 'TypeScript'], emoji: '🔤', accent: '#0ea5e9' },
  ]

  return (
    <section id="projects" className="section">
      <div ref={ref} className={`container reveal ${visible ? 'revealed' : ''}`}>
        <h2 className="section-heading">{t.projects.title}</h2>

        <div className="proj-grid">
          {projects.map((p) => (
            <div className="proj-card" key={p.id} style={{ '--proj-accent': p.accent } as React.CSSProperties}>
              <div className="proj-card-inner">
                <div className="proj-emoji">{p.emoji}</div>
                <h3 className="proj-title">{p.title}</h3>
                <p className="proj-desc">{p.desc}</p>
                <div className="proj-tags">
                  {p.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
                </div>
                <button className="proj-btn" onClick={() => setOpenGame(p.id)}>
                  {t.projects.playNow} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {openGame === '2048' && <Game2048 onClose={() => setOpenGame(null)} />}
      {openGame === 'wordle' && <WordleGame onClose={() => setOpenGame(null)} />}
    </section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ContactSection() {
  const { t } = useI18n()
  const { ref, visible } = useScrollReveal()

  return (
    <section id="contact" className="section section--tinted">
      <div ref={ref} className={`container reveal ${visible ? 'revealed' : ''}`}>
        <p className="section-label">{t.contact.title}</p>
        <div className="contact-layout">
          <div className="contact-left">
            <h2 className="contact-big">{t.contact.subtitle}</h2>
            <p className="contact-sub">{t.contact.description}</p>
          </div>
          <div className="contact-right">
            <a href="mailto:timothee.maire54300@gmail.com" className="contact-line contact-line--main">
              <span className="contact-line-label">{t.contact.email}</span>
              <span className="contact-line-val">timothee.maire54300@gmail.com ↗</span>
            </a>
            <a href="https://www.linkedin.com/in/timoth%C3%A9e-maire-476bb8194/" target="_blank" rel="noopener noreferrer" className="contact-line contact-line--linkedin">
              <span className="contact-line-label">{t.contact.linkedin}</span>
              <span className="contact-line-val">linkedin.com/in/timothée-maire ↗</span>
            </a>
            <div className="contact-line">
              <span className="contact-line-label">{t.contact.location}</span>
              <span className="contact-line-val">{t.contact.locationValue}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FOOTER + SCROLL TOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>© 2026 Timothée Maire</span>
      </div>
    </footer>
  )
}

function ScrollTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return show ? (
    <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
  ) : null
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   APP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Portfolio() {
  return (
    <div className="app">
      <Navbar />
      <HeroSection />
      <ExperienceSection />
      <SkillsSection />
      <SoftSkillsSection />
      <EducationSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
      <ScrollTop />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <Portfolio />
      </I18nProvider>
    </ThemeProvider>
  )
}