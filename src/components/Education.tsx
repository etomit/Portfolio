import { useI18n } from '../i18n'
import { CoteChart } from './CoteChart'
import { Reveal, SectionHead, Sheet } from './Reveal'

export function Education() {
  const { t } = useI18n()
  const education = t.education

  return (
    <section id="education" className="section" aria-labelledby="education-title">
      <div className="shell">
        <Sheet>
          <SectionHead title={education.title} intro={education.intro} headingId="education-title" />

          <Reveal>
            <CoteChart
              label={education.chartLabel}
              todayLabel={t.experience.today}
              from={2018}
              to={2028}
              items={education.items.map((item) => ({
                id: item.period,
                label: item.level,
                sub: item.planned ? `${item.period} · ${education.planned}` : item.period,
                start: item.start,
                end: item.end,
                planned: item.planned,
                current: item.planned,
              }))}
            />
          </Reveal>

          <ol className="diplomas">
            {education.items.map((item, index) => (
              <Reveal as="li" key={item.period} className="diploma" delay={index * 50}>
                <p className="job-period">{item.period}</p>
                <div className="diploma-body">
                  <h3>{item.degree}</h3>
                  <p className="diploma-school">{item.school}</p>
                  <p className="diploma-note">{item.note}</p>
                </div>
                <p className="diploma-level">{item.level}</p>
              </Reveal>
            ))}
          </ol>
        </Sheet>
      </div>
    </section>
  )
}
