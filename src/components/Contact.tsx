import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LINKS } from '../content'
import { useI18n } from '../i18n'
import type { WaveScene } from '../three/waveScene'
import { hasWebGL, prefersReducedMotion, useLazyScene } from '../useLazyScene'
import { ArrowUp, ArrowUpRight, CheckIcon, CopyIcon, GithubIcon, LinkedinIcon, MailIcon } from './icons'
import { BracketLabel, Crosses, Reveal } from './Reveal'

/** Une enveloppe en perspective, dessinée au trait, avec ses cotes. */
function Envelope({ label }: { label: string }) {
  return (
    <svg className="envelope" viewBox="0 0 320 220" role="img" aria-label={label}>
      <defs>
        <pattern id="envelope-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="6" className="sk-hatch-line" />
        </pattern>
      </defs>
      <g className="env-lines">
        <path d="M40 70 L232 34 L292 136 L100 176 Z" pathLength={1} className="trace" />
        <path d="M40 70 L170 120 L232 34" pathLength={1} className="trace" />
        <path d="M100 176 L150 112 M292 136 L196 108" pathLength={1} className="thin trace" />
        <path d="M40 70 L100 176 L292 136 L170 120 Z" fill="url(#envelope-hatch)" className="env-fill" />
        <path d="M30 86 L90 192" className="dim trace" pathLength={1} />
        <path d="M108 194 L300 154" className="dim trace" pathLength={1} />
        <path d="M84 188 L90 192 L91 185 M102 191 L108 194 L102 197" className="dim" />
      </g>
    </svg>
  )
}

/** Fond animé : une nappe filaire qui ondule, chargée seulement si WebGL et le mouvement sont permis. */
function WaveBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const enabled = useMemo(() => hasWebGL() && !prefersReducedMotion(), [])
  const factory = useCallback(async (canvas: HTMLCanvasElement) => {
    const { createWaveScene } = await import('../three/waveScene')
    return createWaveScene(canvas)
  }, [])
  const { status } = useLazyScene<WaveScene>(containerRef, canvasRef, factory, enabled)
  if (!enabled) return null
  return (
    <div className={`wave-bg ${status === 'ready' ? 'is-ready' : ''}`} ref={containerRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}

// L'adresse ne se coupe qu'après l'arobase sur les écrans étroits.
const [EMAIL_USER, EMAIL_DOMAIN] = LINKS.email.split('@')

export function Contact() {
  const { t } = useI18n()
  const contact = t.contact
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2200)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(LINKS.email)
      setCopied(true)
    } catch {
      // Presse-papiers refusé : le lien mailto juste à côté reste utilisable.
    }
  }

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="shell">
        <div className="sheet contact-sheet">
          <Crosses />
          <WaveBackground />
          <div className="contact-grid">
            <Reveal className="contact-copy">
              <h2 id="contact-title">
                <span className="slash" aria-hidden="true">/</span>
                {contact.title}
              </h2>
              <p className="contact-text">{contact.text}</p>

              <div className="contact-email">
                <a className="bracket" href={`mailto:${LINKS.email}`}>
                  <MailIcon />
                  <BracketLabel>
                    {EMAIL_USER}@<wbr />
                    {EMAIL_DOMAIN}
                  </BracketLabel>
                </a>
                <button type="button" className="tool-button copy-button" onClick={copyEmail} aria-label={contact.copy}>
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
                <span className="copy-status label" aria-live="polite">{copied ? contact.copied : ''}</span>
              </div>

              <ul className="contact-links">
                <li>
                  <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
                    <LinkedinIcon />
                    {contact.linkedin}
                    <ArrowUpRight />
                    <span className="sr-only"> — {t.a11y.newTab}</span>
                  </a>
                </li>
                <li>
                  <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
                    <GithubIcon />
                    {contact.github}
                    <ArrowUpRight />
                    <span className="sr-only"> — {t.a11y.newTab}</span>
                  </a>
                </li>
              </ul>
              {/* Chaque lieu reste d'un bloc : « Ligny-en-Barrois » ne se coupe pas au trait d'union. */}
              <p className="contact-location label">
                {contact.location.split(' · ').map((place, index) => (
                  <span key={place}>
                    {index > 0 && ' · '}
                    <span className="nowrap">{place}</span>
                  </span>
                ))}
              </p>
            </Reveal>

            <Reveal className="contact-drawing" delay={120}>
              <Envelope label={contact.envelopeLabel} />
            </Reveal>
          </div>

          <footer className="site-footer">
            <dl className="title-block">
              {[...contact.titleBlock, { label: contact.dateLabel, value: String(new Date().getFullYear()) }].map((cell) => (
                <div key={cell.label}>
                  <dt className="label">{cell.label}</dt>
                  <dd>{cell.value}</dd>
                </div>
              ))}
            </dl>
            <a className="tool-button back-to-top" href="#top" aria-label={t.a11y.backToTop}>
              <ArrowUp />
            </a>
          </footer>
        </div>
      </div>
    </section>
  )
}
