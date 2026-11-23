import { lazy, Suspense, useState } from 'react'
import type { ProjectItem } from '../content'
import { useI18n } from '../i18n'
import { CityCard } from './CityCard'
import { Dialog } from './Dialog'
import { ArrowRight, ArrowUpRight } from './icons'
import { BracketLabel, Reveal, SectionHead, Sheet, Tags } from './Reveal'
import { Sketch } from './Sketch'

// Les jeux ne sont téléchargés qu'au moment où on les ouvre.
const Game2048 = lazy(() => import('../games/Game2048'))
const WordleGame = lazy(() => import('../games/WordleGame'))

type GameKind = '2048' | 'wordle'

const PREVIEW_2048 = [2, 0, 0, 4, 0, 8, 16, 0, 0, 32, 64, 2, 4, 0, 128, 2048]
const PREVIEW_WORDLE: Array<[string, string]> = [
  ['C', 'absent'], ['O', 'present'], ['D', 'absent'], ['E', 'present'], ['R', 'present'],
  ['R', 'correct'], ['E', 'correct'], ['A', 'correct'], ['C', 'correct'], ['T', 'correct'],
]

/** La fiche détaillée d'un projet, ouverte par-dessus la page. */
function ProjectSheet({ project, onClose }: { project: ProjectItem; onClose: () => void }) {
  const { t } = useI18n()
  const copy = t.projects
  const meta = [project.kind, project.year].filter(Boolean).join(' · ')

  return (
    <Dialog title={project.name} kicker={`/ ${copy.sheetPath} — ${meta}`} onClose={onClose} className="modal-sheet">
      <div className="sheet-body">
        <div className="sheet-media">
          {project.image ? (
            <img
              src={project.image.src}
              srcSet={project.image.srcSet}
              sizes="(min-width: 900px) 480px, 90vw"
              width={project.image.width}
              height={project.image.height}
              alt={project.image.alt}
              decoding="async"
            />
          ) : (
            <Sketch id={project.sketch} />
          )}
        </div>
        <div className="sheet-copy">
          <p className="sheet-summary">{project.summary}</p>
          <p className="sheet-description">{project.description}</p>
          {project.highlights.length > 0 && (
            <>
              <h3 className="subhead">{copy.highlightsTitle}</h3>
              <ul className="bullets">
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
          {project.note && <p className="sheet-note hand">{project.note}</p>}
          <Tags items={project.tags} />
          <div className="sheet-actions">
            {project.links.map((link) => (
              <a key={link.href} className="bracket bracket-small" href={link.href} target="_blank" rel="noopener noreferrer">
                <BracketLabel>{link.label}</BracketLabel>
                <ArrowUpRight />
                <span className="sr-only"> — {t.a11y.newTab}</span>
              </a>
            ))}
            {project.privateRepo && <span className="label">{copy.privateRepo}</span>}
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export function Projects() {
  const { t } = useI18n()
  const copy = t.projects
  const { playground } = copy
  const [openProject, setOpenProject] = useState<string | null>(null)
  const [openGame, setOpenGame] = useState<GameKind | null>(null)
  const current = copy.items.find((item) => item.id === openProject)

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="shell">
        <Sheet>
          <SectionHead title={copy.title} intro={copy.intro} headingId="projects-title" />

          <ul className="project-grid">
            {copy.items.map((project, index) => (
              <Reveal as="li" key={project.id} delay={(index % 3) * 70}>
                <button type="button" className="project-card" onClick={() => setOpenProject(project.id)}>
                  <span className="project-vignette">
                    <Sketch id={project.sketch} />
                  </span>
                  <span className="project-meta label">
                    {[project.kind, project.year].filter(Boolean).join(' · ')}
                  </span>
                  <span className="project-name">{project.name}</span>
                  <span className="project-summary">{project.summary}</span>
                  {project.agents && <span className="badge badge-quiet">{copy.agentsBadge}</span>}
                  <span className="project-open">
                    {copy.open}
                    <ArrowRight />
                  </span>
                </button>
              </Reveal>
            ))}
          </ul>

          <Reveal className="archive">
            <h3 className="subhead">{copy.archiveTitle}</h3>
            <p className="archive-intro">{copy.archiveIntro}</p>
            <ol className="archive-list">
              {copy.archive.map((item) => (
                <li key={item.name}>
                  <span className="archive-year">{item.year}</span>
                  <span className="archive-main">
                    <strong>{item.name}</strong>
                    <span>{item.text}</span>
                  </span>
                  <span className="archive-tech label">{item.tech}</span>
                  <a className="archive-link" href={item.href} target="_blank" rel="noopener noreferrer">
                    {copy.archiveLink}
                    <ArrowUpRight />
                    <span className="sr-only"> — {item.name}, {t.a11y.newTab}</span>
                  </a>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="playground">
            <h3 className="subhead">{playground.title}</h3>
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
                  <button type="button" className="bracket bracket-small" onClick={() => setOpenGame('2048')}>
                    <BracketLabel>{playground.launch}</BracketLabel>
                    <span className="sr-only"> — {playground.g2048.name}</span>
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
                  <button type="button" className="bracket bracket-small" onClick={() => setOpenGame('wordle')}>
                    <BracketLabel>{playground.launch}</BracketLabel>
                    <span className="sr-only"> — {playground.wordle.name}</span>
                  </button>
                </div>
              </article>
            </div>
          </Reveal>
        </Sheet>
      </div>

      {current && <ProjectSheet project={current} onClose={() => setOpenProject(null)} />}
      <Suspense fallback={null}>
        {openGame === '2048' && <Game2048 onClose={() => setOpenGame(null)} />}
        {openGame === 'wordle' && <WordleGame onClose={() => setOpenGame(null)} />}
      </Suspense>
    </section>
  )
}
