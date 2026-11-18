import { useI18n } from '../i18n'
import { Reveal, SectionHead } from './Reveal'

/** Le travail avec des agents IA : les projets concernés, puis les techniques qui le rendent fiable. */
export function Ai() {
  const { t } = useI18n()
  const ai = t.ai

  return (
    <section id="ai" className="section" aria-labelledby="ai-title">
      <div className="shell">
        <SectionHead title={ai.title} intro={ai.intro} headingId="ai-title" />

        <Reveal>
          <h3 className="subhead">{ai.projectsTitle}</h3>
          <dl className="rows">
            {ai.projects.map((project) => (
              <div key={project.name}>
                <dt>
                  {project.name}
                  <small>{project.status}</small>
                </dt>
                <dd>{project.text}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal>
          <h3 className="subhead">{ai.techniquesTitle}</h3>
          <ul className="techniques">
            {ai.techniques.map((technique) => (
              <li key={technique.name}>
                <h4>{technique.name}</h4>
                <p>{technique.text}</p>
              </li>
            ))}
          </ul>
          <p className="aside-note">{ai.note}</p>
        </Reveal>
      </div>
    </section>
  )
}
