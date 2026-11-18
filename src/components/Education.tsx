import { useI18n } from '../i18n'
import { Reveal, SectionHead } from './Reveal'

export function Education() {
  const { t } = useI18n()
  const education = t.education

  return (
    <section id="education" className="section" aria-labelledby="education-title">
      <div className="shell">
        <SectionHead title={education.title} intro={education.intro} headingId="education-title" />

        <ol className="edu-list">
          {education.items.map((item, index) => (
            <li key={item.period}>
              <Reveal className="edu-item" delay={index * 60}>
                <p className="edu-period">{item.period}</p>
                <div className="edu-main">
                  <h3>{item.degree}</h3>
                  <p className="edu-school">{item.school}</p>
                  <p className="edu-note">{item.note}</p>
                </div>
                <p className="edu-level">{item.level}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
