import { useEffect, useState } from 'react'
import { LINKS } from '../content'
import { useI18n } from '../i18n'
import { ArrowUp, ArrowUpRight, CheckIcon, CopyIcon, GithubIcon, LinkedinIcon } from './icons'
import { Reveal, Stop } from './Reveal'

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
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="shell">
        <Reveal>
          <Stop terminus>{contact.stop}</Stop>
          <h2 id="contact-title">{contact.title}</h2>
          <p className="contact-text">{contact.text}</p>

          <div className="contact-email">
            <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
            <button type="button" className="copy-button" onClick={copyEmail}>
              {copied ? <CheckIcon /> : <CopyIcon />}
              <span aria-live="polite">{copied ? contact.copied : contact.copy}</span>
            </button>
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
            <li className="contact-location">{contact.location}</li>
          </ul>
        </Reveal>

        <footer className="site-footer">
          <p>© {new Date().getFullYear()} {contact.footer}</p>
          <p>{contact.rights}</p>
          <a href="#top" aria-label={t.a11y.backToTop}><ArrowUp /></a>
        </footer>
      </div>
    </section>
  )
}
