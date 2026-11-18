import { useState } from 'react'
import { useI18n } from '../i18n'
import { PlusIcon } from './icons'
import { Reveal, SectionHead, Tags } from './Reveal'

export function Experience() {
  const { t } = useI18n()
  const xp = t.experience
  // Le poste actuel est déplié d'office ; un clic sur une ligne ouverte la referme.
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="shell">
        <SectionHead title={xp.title} intro={xp.intro} headingId="experience-title" />

        <Reveal>
          <ol className="xp-list">
            {xp.jobs.map((job, index) => {
              const isOpen = open === index
              return (
                <li key={job.company} className={`xp-item ${isOpen ? 'is-open' : ''}`}>
                  <h3>
                    <button
                      type="button"
                      className="xp-row"
                      id={`xp-button-${index}`}
                      aria-expanded={isOpen}
                      aria-controls={`xp-panel-${index}`}
                      onClick={() => setOpen(isOpen ? null : index)}
                    >
                      <span className="xp-period">{job.period}</span>
                      <span className="xp-title">
                        <span className="xp-company">
                          {job.company}
                          {index === 0 && <span className="xp-now">{xp.current}</span>}
                        </span>
                        <span className="xp-role">{job.role}</span>
                      </span>
                      <span className="xp-place">{job.location}</span>
                      <span className="xp-toggle" aria-hidden="true"><PlusIcon /></span>
                    </button>
                  </h3>
                  <div className="xp-panel" id={`xp-panel-${index}`} role="region" aria-labelledby={`xp-button-${index}`}>
                    <div className="xp-panel-clip">
                      <div className="xp-panel-body">
                        <p className="xp-summary">{job.summary}</p>
                        {job.points.length > 0 && (
                          <ul className="xp-tasks">
                            {job.points.map((point) => (
                              <li key={point}>{point}</li>
                            ))}
                          </ul>
                        )}
                        <Tags items={job.tags} />
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
