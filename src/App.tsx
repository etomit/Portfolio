import { useEffect, useRef, useState } from 'react'
import { I18nProvider, useI18n } from './i18n'
import Game2048 from './Game2048'
import WordleGame from './WordleGame'
import './App.css'

/* ── Skill icons via devicons CDN ── */
const skillIcons: Record<string, string> = {
  React: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  TypeScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  JavaScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  Laravel: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg',
  'C#': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg',
  '.NET': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg',
  SQL: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  Docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  Git: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  NGINX: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg',
  Flutter: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg',
  PHP: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
  Python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  PostgreSQL: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
}

function SkillBubble({ name }: { name: string }) {
  const src = skillIcons[name]
  return (
    <div className="skill-bubble">
      <div className="skill-icon-wrap">
        {src ? (
          <img src={src} alt={name} className="skill-icon" />
        ) : (
          <span className="skill-fallback">{name[0]}</span>
        )}
      </div>
      <span className="skill-label">{name}</span>
    </div>
  )
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, visible }
}

function Navbar() {
  const { t, lang, setLang } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { key: 'about', label: t.nav.about },
    { key: 'experience', label: t.nav.experience },
    { key: 'skills', label: t.nav.skills },
    { key: 'education', label: t.nav.education },
    { key: 'projects', label: t.nav.projects },
    { key: 'contact', label: t.nav.contact },
  ]

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar-inner">
        <div className="navbar-brand" onClick={() => scrollTo('hero')}>
          <span className="brand-name">Timothée Maire</span>
          <button
            className={`lang-toggle ${lang === 'en' ? 'active' : ''}`}
            onClick={(e) => { e.stopPropagation(); setLang(lang === 'fr' ? 'en' : 'fr') }}
          >
            {lang.toUpperCase()}
          </button>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {links.map((l) => (
            <li key={l.key}>
              <button onClick={() => scrollTo(l.key)}>{l.label}</button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

function HeroSection() {
  const { t } = useI18n()
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" className="hero">
      <div className="hero-bg">
        <div className="hero-orb orb1" />
        <div className="hero-orb orb2" />
        <div className="hero-grid" />
      </div>
      <div className="hero-content">
        <div className="hero-text">
          <p className="hero-greeting animate-in delay-1">
            {t.hero.greeting} <span className="hero-name">Timothée</span>
          </p>
          <h1 className="hero-title animate-in delay-2">{t.hero.title}</h1>
          <p className="hero-desc animate-in delay-3">{t.hero.description}</p>
          <div className="hero-actions animate-in delay-4">
            <button className="btn-primary" onClick={() => scrollTo('contact')}>
              {t.hero.cta}
            </button>
            <div className="hero-meta">
              <span>📍 Grand Est, France</span>
            </div>
          </div>
        </div>
        <div className="hero-avatar animate-in delay-2">
          <div className="avatar-ring">
            <div className="avatar-inner">
              <div className="avatar-initials">TM</div>
            </div>
          </div>
          <div className="avatar-badge">FullStack</div>
        </div>
      </div>
    </section>
  )
}

function AboutSection() {
  const { t } = useI18n()
  const { ref, visible } = useScrollReveal()

  const cards = [
    {
      icon: '◈',
      title: t.about.frontend.title,
      desc: t.about.frontend.desc,
    },
    {
      icon: '⬡',
      title: t.about.backend.title,
      desc: t.about.backend.desc,
    },
    {
      icon: '◉',
      title: t.about.uiux.title,
      desc: t.about.uiux.desc,
    },
  ]

  return (
    <section id="about" className="section section--dark">
      <div ref={ref} className={`container reveal ${visible ? 'revealed' : ''}`}>
        <h2 className="section-title">{t.about.title}</h2>
        <div className="about-grid">
          <div className="about-avatar-wrap">
            <div className="about-avatar">
              <div className="about-initials">TM</div>
              <div className="about-ring about-ring--1" />
              <div className="about-ring about-ring--2" />
            </div>
          </div>
          <div className="about-cards">
            {cards.map((c, i) => (
              <div className="about-card" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
                <span className="about-card-icon">{c.icon}</span>
                <div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ExperienceSection() {
  const { t } = useI18n()
  const { ref, visible } = useScrollReveal()

  return (
    <section id="experience" className="section section--darker">
      <div ref={ref} className={`container reveal ${visible ? 'revealed' : ''}`}>
        <h2 className="section-title">{t.experience.title}</h2>
        <div className="timeline">
          {t.experience.jobs.map((job, i) => (
            <div className="exp-card" key={i} style={{ animationDelay: `${i * 0.2}s` }}>
              <div className="exp-card-header">
                <div className="exp-company-logo">
                  <span>{job.company[0]}</span>
                </div>
                <div className="exp-header-info">
                  <div className="exp-type-badge">
                    {job.type === 'contractor'
                      ? t.experience.contractor
                      : t.experience.internship}
                  </div>
                  <h3 className="exp-role">
                    {job.role},{' '}
                    <span className="exp-company">{job.company}</span>
                  </h3>
                  <p className="exp-period">
                    {job.period} · {job.location}
                  </p>
                </div>
              </div>
              <ul className="exp-tasks">
                {job.tasks.map((task, j) => (
                  <li key={j}>{task}</li>
                ))}
              </ul>
              <div className="exp-tags">
                {job.tags.map((tag) => (
                  <span className="exp-tag" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SkillsSection() {
  const { t } = useI18n()
  const { ref, visible } = useScrollReveal()

  const frontendSkills = ['React', 'Next.js', 'JavaScript', 'TypeScript']
  const backendSkills = ['Node.js', '.NET', 'C#', 'Laravel', 'PHP', 'Python']
  const dbSkills = ['SQL', 'PostgreSQL']
  const toolSkills = ['Docker', 'Git', 'NGINX', 'Flutter']

  return (
    <section id="skills" className="section section--dark">
      <div ref={ref} className={`container reveal ${visible ? 'revealed' : ''}`}>
        <h2 className="section-title">{t.skills.title}</h2>

        <div className="skills-block">
          <h3 className="skills-category">{t.skills.frontend}</h3>
          <div className="skills-row">
            {frontendSkills.map((s) => <SkillBubble key={s} name={s} />)}
          </div>
        </div>

        <div className="skills-block">
          <h3 className="skills-category">{t.skills.backend}</h3>
          <div className="skills-row">
            {backendSkills.map((s) => <SkillBubble key={s} name={s} />)}
          </div>
        </div>

        <div className="skills-block">
          <h3 className="skills-category">{t.skills.databases}</h3>
          <div className="skills-row">
            {dbSkills.map((s) => <SkillBubble key={s} name={s} />)}
          </div>
        </div>

        <div className="skills-block">
          <h3 className="skills-category">{t.skills.tools}</h3>
          <div className="skills-row">
            {toolSkills.map((s) => <SkillBubble key={s} name={s} />)}
          </div>
        </div>

        <div className="skills-block">
          <h3 className="skills-category">{t.skills.languages}</h3>
          <div className="skills-row">
            <div className="lang-badge">
              <span className="flag">🇫🇷</span>
              <span>Français — Natif</span>
            </div>
            <div className="lang-badge">
              <span className="flag">🇬🇧</span>
              <span>Anglais — Intermédiaire</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function EducationSection() {
  const { t } = useI18n()
  const { ref, visible } = useScrollReveal()

  return (
    <section id="education" className="section section--darker">
      <div ref={ref} className={`container reveal ${visible ? 'revealed' : ''}`}>
        <h2 className="section-title">{t.education.title}</h2>
        <div className="edu-list">
          {t.education.items.map((item, i) => (
            <div className="edu-card" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="edu-logo">
                <span>CESI</span>
              </div>
              <div className="edu-info">
                <div className="edu-header">
                  <h3>{item.degree}</h3>
                  <span className="edu-level">{item.level}</span>
                </div>
                <p className="edu-meta">
                  {item.school} · <span>{item.period}</span>
                </p>
                <ul className="edu-tasks">
                  {item.tasks.map((task, j) => <li key={j}>{task}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const { t } = useI18n()
  const { ref, visible } = useScrollReveal()

  return (
    <section id="contact" className="section section--dark">
      <div ref={ref} className={`container reveal ${visible ? 'revealed' : ''}`}>
        <h2 className="section-title">{t.contact.title}</h2>
        <div className="contact-wrap">
          <div className="contact-text">
            <h3 className="contact-subtitle">{t.contact.subtitle}</h3>
            <p>{t.contact.description}</p>
          </div>
          <div className="contact-cards">
            <a href="mailto:timothee.maire54300@gmail.com" className="contact-card">
              <div className="contact-icon">✉</div>
              <div>
                <span className="contact-card-label">{t.contact.email}</span>
                <span className="contact-card-value">timothee.maire54300@gmail.com</span>
              </div>
            </a>
            <a href="tel:+33649284368" className="contact-card">
              <div className="contact-icon">✆</div>
              <div>
                <span className="contact-card-label">{t.contact.phone}</span>
                <span className="contact-card-value">+33 6 49 28 43 68</span>
              </div>
            </a>
            <div className="contact-card">
              <div className="contact-icon">⊕</div>
              <div>
                <span className="contact-card-label">{t.contact.location}</span>
                <span className="contact-card-value">{t.contact.locationValue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectsSection() {
  const { t } = useI18n()
  const { ref, visible } = useScrollReveal()
  const [openGame, setOpenGame] = useState<null | '2048' | 'wordle'>(null)

  const projects = [
    {
      id: '2048' as const,
      title: t.projects.game2048Title,
      desc: t.projects.game2048Desc,
      tags: ['React', 'TypeScript'],
      icon: '🎮',
      color: 'linear-gradient(135deg, #1a5fa8, #17b8c4)',
    },
    {
      id: 'wordle' as const,
      title: t.projects.wordleTitle,
      desc: t.projects.wordleDesc,
      tags: ['React', 'i18n', 'TypeScript'],
      icon: '🔤',
      color: 'linear-gradient(135deg, #4f8ef7, #6fa3ff)',
    },
  ]

  return (
    <section id="projects" className="section section--darker">
      <div ref={ref} className={`container reveal ${visible ? 'revealed' : ''}`}>
        <h2 className="section-title">{t.projects.title}</h2>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <div
              className="project-card"
              key={p.id}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="project-card-header" style={{ background: p.color }}>
                <span className="project-icon">{p.icon}</span>
                <span className="project-card-title">{p.title}</span>
              </div>
              <div className="project-card-body">
                <p className="project-desc">{p.desc}</p>
                <div className="project-tags">
                  {p.tags.map((tag) => (
                    <span className="exp-tag" key={tag}>{tag}</span>
                  ))}
                </div>
                <button
                  className="btn-primary project-btn"
                  onClick={() => setOpenGame(p.id)}
                >
                  {t.projects.playNow} ▶
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

function ScrollToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const fn = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return show ? (
    <button
      className="scroll-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >↑</button>
  ) : null
}

function Portfolio() {
  return (
    <div className="app">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <EducationSection />
      <ProjectsSection />
      <ContactSection />
      <ScrollToTop />
    </div>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <Portfolio />
    </I18nProvider>
  )
}