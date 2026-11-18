import type { CSSProperties } from 'react'
import { useI18n } from '../i18n'
import { ArrowDown } from './icons'
import { Stop } from './Reveal'

const enter = (delay: number) => ({ '--enter-delay': `${delay}ms` }) as CSSProperties

export function Hero() {
  const { t } = useI18n()
  const hero = t.hero

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="shell">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="enter" style={enter(0)}>
              <Stop terminus>{hero.stop}</Stop>
            </div>
            <h1 id="hero-title" className="enter" style={enter(80)}>
              {hero.titleLead} <em>{hero.titleName}</em> <span>{hero.titleRest}</span>
            </h1>
            <p className="hero-lead enter" style={enter(180)}>{hero.lead}</p>
            <div className="hero-actions enter" style={enter(260)}>
              <a className="button button-primary" href="#projects">
                {hero.primary}
                <ArrowDown />
              </a>
              <a className="button button-ghost" href="#contact">{hero.secondary}</a>
            </div>
          </div>

          <figure className="portrait enter" style={enter(140)}>
            <div className="portrait-frame">
              <img
                src="/portrait-900.webp"
                srcSet="/portrait-520.webp 520w, /portrait-900.webp 900w"
                sizes="(min-width: 900px) 380px, 70vw"
                width="900"
                height="1053"
                alt={hero.portraitAlt}
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <figcaption>
              <span>{hero.portraitCaption}</span>
              <span>{hero.portraitPlace}</span>
            </figcaption>
          </figure>
        </div>

        <dl className="hero-facts enter" style={enter(340)}>
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
      </div>
    </section>
  )
}
