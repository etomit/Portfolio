import { useEffect, useState } from 'react'
import { useI18n } from '../i18n'
import { prefersReducedMotion } from '../useLazyScene'
import { BusStage } from './BusStage'
import { HeroName } from './HeroName'
import { ArrowDown, ArrowRight } from './icons'
import { BracketLabel, Crosses } from './Reveal'

const INTRO_KEY = 'portfolio-intro-seen'
// Fin de la dernière animation de l'intro (hn-settle et hn-glow, 3,4 s), plus une marge.
const INTRO_DURATION = 3500

type IntroState = 'play' | 'done'

/**
 * L'intro se joue une fois par session : tracés de construction, contour du nom,
 * hachures, puis le reste du hero. Un clic, une touche ou le bouton la passent ;
 * elle est sautée si l'utilisateur préfère réduire les animations.
 */
function useIntro() {
  const [state, setState] = useState<IntroState>(() => {
    try {
      if (sessionStorage.getItem(INTRO_KEY)) return 'done'
    } catch {
      // stockage indisponible : on joue l'intro
    }
    return prefersReducedMotion() ? 'done' : 'play'
  })

  useEffect(() => {
    if (state !== 'play') return
    const finish = () => setState('done')
    const timer = window.setTimeout(finish, INTRO_DURATION)
    window.addEventListener('keydown', finish, { once: true })
    window.addEventListener('pointerdown', finish, { once: true })
    window.addEventListener('wheel', finish, { once: true, passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', finish)
      window.removeEventListener('pointerdown', finish)
      window.removeEventListener('wheel', finish)
    }
  }, [state])

  useEffect(() => {
    if (state !== 'done') return
    try {
      sessionStorage.setItem(INTRO_KEY, '1')
    } catch {
      // sans conséquence
    }
  }, [state])

  return { state, skip: () => setState('done') }
}

export function Hero() {
  const { t } = useI18n()
  const hero = t.hero
  const intro = useIntro()

  return (
    <section className="hero section" aria-labelledby="hero-title" data-intro={intro.state}>
      <div className="shell">
        <div className="sheet hero-sheet">
          <Crosses />
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="hero-annotation hand" aria-hidden="true">
                {hero.annotation.map((line) => (
                  <span key={line}>{line}</span>
                ))}
                <svg className="note-arrow" viewBox="0 0 80 70">
                  <path d="M8 6 C 46 10, 62 28, 58 62" />
                  <path d="M50 54 L58 63 L65 52" />
                </svg>
              </p>

              <p className="hero-kicker label">{hero.kicker}</p>
              <h1 id="hero-title">
                <span className="sr-only">{hero.nameLines.join(' ')}</span>
                <HeroName lines={hero.nameLines} />
              </h1>

              <p className="hero-roles">
                {hero.roles.map((role, index) => (
                  <span key={role}>
                    {index > 0 && (
                      <>
                        <span className="sr-only">, </span>
                        <span className="hero-roles-sep" aria-hidden="true">·</span>
                      </>
                    )}
                    {role}
                  </span>
                ))}
              </p>

              <div className="hero-text">
                <p className="hero-greeting">{hero.greeting}</p>
                <p className="hero-lead">{hero.lead}</p>
              </div>

              <div className="hero-actions">
                <a className="bracket" href="#projects">
                  <BracketLabel>{hero.cta}</BracketLabel>
                  <ArrowRight />
                </a>
                <a className="bracket bracket-quiet" href="#contact">
                  <BracketLabel>{hero.secondary}</BracketLabel>
                </a>
              </div>
            </div>

            <BusStage />
          </div>

          <dl className="hero-facts">
            {hero.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>
                  <strong>{fact.value}</strong>
                  <span>{fact.detail}</span>
                </dd>
              </div>
            ))}
          </dl>

          <a className="scroll-cue" href="#about" aria-label={hero.scroll}>
            <ArrowDown />
          </a>

          {intro.state === 'play' && (
            <button type="button" className="intro-skip label" onClick={intro.skip}>
              {hero.skipIntro}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
