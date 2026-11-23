import { useI18n } from '../i18n'
import { Reveal, SectionHead, Sheet } from './Reveal'

/** Le travail avec des agents IA : le trajet d'une mission, puis les techniques qui le rendent fiable. */
export function Ai() {
  const { t } = useI18n()
  const ai = t.ai

  return (
    <section id="ai" className="section" aria-labelledby="ai-title">
      <div className="shell">
        <Sheet>
          <SectionHead title={ai.title} intro={ai.intro} headingId="ai-title" />

          <Reveal>
            <h3 className="subhead">{ai.flowTitle}</h3>
            <ol className="flow">
              {ai.flow.map((step, index) => (
                <li key={step.name} className="flow-step">
                  <h4>{step.name}</h4>
                  <p>{step.text}</p>
                  {index < ai.flow.length - 1 && (
                    <svg className="flow-arrow" viewBox="0 0 40 16" aria-hidden="true">
                      <path d="M0 8H36M29 2l7 6-7 6" />
                    </svg>
                  )}
                </li>
              ))}
            </ol>
            <svg className="flow-return" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
              <path d="M875 4V30H375V10" />
              <path d="M369 16l6-8 6 8" />
            </svg>
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
        </Sheet>
      </div>
    </section>
  )
}
