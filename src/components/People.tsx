import { useI18n } from '../i18n'
import { Reveal, SectionHead } from './Reveal'

/** Savoir-être : pas d'adjectifs, seulement ce que le parcours permet d'affirmer. */
export function People() {
  const { t } = useI18n()
  const people = t.people

  return (
    <section id="people" className="section" aria-labelledby="people-title">
      <div className="shell">
        <SectionHead title={people.title} intro={people.intro} headingId="people-title" />

        <Reveal>
          <dl className="rows">
            {people.items.map((item) => (
              <div key={item.name}>
                <dt>{item.name}</dt>
                <dd>{item.text}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
