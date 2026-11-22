import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { prefersReducedMotion } from '../useLazyScene'
import { BusSketch } from './BusSketch'
import { SectionHead, Sheet } from './Reveal'

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/**
 * « À propos » : quatre étapes de parcours, et à côté un bus qui se dessine au défilement.
 * L'avancement est écrit directement dans les variables CSS du dessin (--s1 à --s4),
 * sans repasser par React à chaque image ; seuls le changement d'étape et le nombre de calques finis déclenchent un rendu.
 */
export function About() {
  const { t } = useI18n()
  const about = t.about
  const stepsRef = useRef<HTMLOListElement>(null)
  const sketchRef = useRef<SVGSVGElement>(null)
  const drawingRef = useRef<HTMLDivElement>(null)
  // Mouvement réduit : tout le dessin est là d'emblée, la légende entièrement allumée, aucune étape mise en avant.
  const [reduced] = useState(prefersReducedMotion)
  // Étape lue en ce moment (-1 : aucune) et nombre de calques entièrement tracés.
  const [active, setActive] = useState(-1)
  const [lit, setLit] = useState(0)

  useEffect(() => {
    const steps = stepsRef.current
    const sketch = sketchRef.current
    const drawing = drawingRef.current
    if (!steps || !sketch || !drawing) return

    if (reduced) {
      for (let i = 1; i <= 4; i++) sketch.style.setProperty(`--s${i}`, '1')
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const viewport = window.innerHeight
      // La ligne de lecture : une étape avance pendant qu'elle passe sous 60 % de l'écran.
      const line = viewport * 0.6
      const items = Array.from(steps.children) as HTMLElement[]
      let current = -1
      const progress = items.map((item, index) => {
        const rect = item.getBoundingClientRect()
        if (rect.top < line) current = index
        return clamp01((line - rect.top) / Math.max(rect.height, viewport * 0.25))
      })
      // Le premier calque (le plan) se trace dès que le dessin entre dans l'écran : la zone n'est jamais vide.
      const entry = clamp01((viewport * 0.95 - drawing.getBoundingClientRect().top) / (viewport * 0.35))
      progress[0] = Math.max(progress[0], entry)
      progress.forEach((value, index) => sketch.style.setProperty(`--s${index + 1}`, value.toFixed(3)))
      setActive(current)
      setLit(progress.filter((value) => value > 0.98).length)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduced])

  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="shell">
        <Sheet>
          <SectionHead title={about.title} intro={about.intro} headingId="about-title" />

          <div className="about-grid">
            <div className="about-text">
              <figure className="portrait">
                <img
                  src="/portrait-520.webp"
                  srcSet="/portrait-520.webp 520w, /portrait-900.webp 900w"
                  sizes="(min-width: 900px) 220px, 46vw"
                  width="520"
                  height="608"
                  alt={about.portraitAlt}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="label">{about.portraitCaption}</figcaption>
              </figure>

              <ol className="about-steps" ref={stepsRef}>
                {about.stages.map((stage, index) => (
                  <li key={stage.note} className={!reduced && index === active ? 'is-active' : ''}>
                    <p className="about-note hand">{stage.note}</p>
                    <p className="about-step-text">{stage.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="about-drawing" ref={drawingRef}>
              <div className="about-drawing-inner">
                <BusSketch ref={sketchRef} labels={t.hero.dims} label={about.sketchLabel} stages={[0, 0, 0, 0]} />
                <ul className="about-legend" aria-hidden="true">
                  {about.stages.map((stage, index) => (
                    <li key={stage.note} className={reduced || index < lit ? 'is-on' : ''}>
                      {stage.note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Sheet>
      </div>
    </section>
  )
}
