import { useI18n } from '../i18n'
import { yearNow } from '../years'
import { CoteChart } from './CoteChart'
import { Reveal, SectionHead, Sheet, Tags } from './Reveal'

export function Experience() {
  const { t } = useI18n()
  const xp = t.experience

  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="shell">
        <Sheet>
          <SectionHead title={xp.title} intro={xp.intro} headingId="experience-title" />

          <Reveal>
            <CoteChart
              label={xp.chartLabel}
              todayLabel={xp.today}
              from={2022}
              to={Math.max(2027, Math.ceil(yearNow()))}
              items={xp.jobs.map((job, index) => ({
                id: job.company,
                label: job.company,
                sub: job.period,
                start: job.start,
                end: job.end,
                current: index === 0,
              }))}
            />
          </Reveal>

          <ol className="jobs">
            {xp.jobs.map((job, index) => (
              <Reveal as="li" key={job.company} className={`job ${index === 0 ? 'is-current' : ''}`} delay={index * 50}>
                <div className="job-meta">
                  <p className="job-period">{job.period}</p>
                  <p className="label">{job.location}</p>
                </div>
                <div className="job-body">
                  <h3>
                    {job.company}
                    {index === 0 && <span className="badge">{xp.current}</span>}
                  </h3>
                  <p className="job-role">{job.role}</p>
                  <p className="job-summary">{job.summary}</p>
                  {job.points.length > 0 && (
                    <ul className="bullets">
                      {job.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                  <Tags items={job.tags} />
                </div>
              </Reveal>
            ))}
          </ol>
        </Sheet>
      </div>
    </section>
  )
}
