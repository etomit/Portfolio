import { lazy, Suspense, useState } from 'react'
import { LINKS } from '../content'
import { useI18n } from '../i18n'
import { CityCard } from './CityCard'
import { ArrowUpRight, GithubIcon } from './icons'
import { Reveal, SectionHead, Tags } from './Reveal'

// Les jeux ne sont téléchargés qu'au moment où on les ouvre.
const Game2048 = lazy(() => import('../games/Game2048'))
const WordleGame = lazy(() => import('../games/WordleGame'))

type GameKind = '2048' | 'wordle'

const host = (url: string) => new URL(url).host

function BrowserFrame({ url, label, children }: { url: string; label: string; children: React.ReactNode }) {
  return (
    <a className="frame" href={url} target="_blank" rel="noopener noreferrer" aria-label={label}>
      <span className="frame-bar" aria-hidden="true">
        <i /><i /><i />
        <span>{host(url)}</span>
        <ArrowUpRight />
      </span>
      {children}
    </a>
  )
}

const PREVIEW_2048 = [2, 0, 0, 4, 0, 8, 16, 0, 0, 32, 64, 2, 4, 0, 128, 2048]
const PREVIEW_WORDLE: Array<[string, string]> = [
  ['C', 'absent'], ['O', 'present'], ['D', 'absent'], ['E', 'present'], ['R', 'present'],
  ['R', 'correct'], ['E', 'correct'], ['A', 'correct'], ['C', 'correct'], ['T', 'correct'],
]

export function Projects() {
  const { t } = useI18n()
  const { pokeline, commerce, playground } = t.projects
  const [openGame, setOpenGame] = useState<GameKind | null>(null)
  const newTab = t.a11y.newTab

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="shell">
        <SectionHead title={t.projects.title} intro={t.projects.intro} headingId="projects-title" />

        <Reveal>
          <article className="project">
            <div className="project-copy">
              <p className="label">{pokeline.label}</p>
              <h3>{pokeline.name}</h3>
              <p className="project-description">{pokeline.description}</p>
              <ul className="project-highlights">
                {pokeline.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Tags items={pokeline.tags} />
              <div className="project-actions">
                <a className="button button-primary" href={LINKS.pokeline} target="_blank" rel="noopener noreferrer">
                  {pokeline.play}
                  <ArrowUpRight />
                  <span className="sr-only"> — {newTab}</span>
                </a>
                <a className="button button-ghost" href={LINKS.pokelineRepo} target="_blank" rel="noopener noreferrer">
                  <GithubIcon />
                  {pokeline.source}
                  <span className="sr-only"> — {newTab}</span>
                </a>
              </div>
            </div>
            <div className="project-media">
              <BrowserFrame url={LINKS.pokeline} label={`${pokeline.play} — ${newTab}`}>
                <img
                  src="/pokeline-1024.webp"
                  srcSet="/pokeline-640.webp 640w, /pokeline-1024.webp 1024w"
                  sizes="(min-width: 900px) 52vw, 92vw"
                  width="1024"
                  height="796"
                  alt={pokeline.alt}
                  loading="lazy"
                  decoding="async"
                />
              </BrowserFrame>
            </div>
          </article>
        </Reveal>

        <Reveal>
          <article className="project project-flip">
            <div className="project-copy">
              <p className="label">{commerce.label}</p>
              <h3>{commerce.name}</h3>
              <p className="project-description">{commerce.description}</p>
              <p className="project-note">{commerce.roadmap}</p>
              <Tags items={commerce.tags} />
              <div className="project-actions">
                <a className="button button-primary" href={LINKS.commerce} target="_blank" rel="noopener noreferrer">
                  {commerce.action}
                  <ArrowUpRight />
                  <span className="sr-only"> — {newTab}</span>
                </a>
              </div>
            </div>
            <div className="project-media">
              <BrowserFrame url={LINKS.commerce} label={`${commerce.action} — ${newTab}`}>
                <img
                  src="/moncommerce-1600.webp"
                  srcSet="/moncommerce-800.webp 800w, /moncommerce-1600.webp 1600w"
                  sizes="(min-width: 900px) 52vw, 92vw"
                  width="1600"
                  height="895"
                  alt={commerce.alt}
                  loading="lazy"
                  decoding="async"
                />
              </BrowserFrame>
            </div>
          </article>
        </Reveal>

        <Reveal className="playground">
          <div className="playground-head">
            <h3>{playground.title}</h3>
          </div>

          <CityCard />

          <div className="game-cards">
            <article className="game-card">
              <div className="mini-2048" aria-hidden="true">
                {PREVIEW_2048.map((value, index) => (
                  <span key={index} data-value={value}>{value || ''}</span>
                ))}
              </div>
              <div className="game-card-copy">
                <p className="label">{playground.g2048.tech}</p>
                <h4>{playground.g2048.name}</h4>
                <p>{playground.g2048.description}</p>
                <button type="button" className="button button-ghost" onClick={() => setOpenGame('2048')}>
                  {playground.launch}
                  <span className="sr-only"> — {playground.g2048.name}</span>
                  <ArrowUpRight />
                </button>
              </div>
            </article>

            <article className="game-card">
              <div className="mini-wordle" aria-hidden="true">
                {PREVIEW_WORDLE.map(([letter, state], index) => (
                  <span key={index} data-state={state}>{letter}</span>
                ))}
              </div>
              <div className="game-card-copy">
                <p className="label">{playground.wordle.tech}</p>
                <h4>{playground.wordle.name}</h4>
                <p>{playground.wordle.description}</p>
                <button type="button" className="button button-ghost" onClick={() => setOpenGame('wordle')}>
                  {playground.launch}
                  <span className="sr-only"> — {playground.wordle.name}</span>
                  <ArrowUpRight />
                </button>
              </div>
            </article>
          </div>
        </Reveal>
      </div>

      <Suspense fallback={null}>
        {openGame === '2048' && <Game2048 onClose={() => setOpenGame(null)} />}
        {openGame === 'wordle' && <WordleGame onClose={() => setOpenGame(null)} />}
      </Suspense>
    </section>
  )
}
