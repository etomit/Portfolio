import { useI18n } from '../i18n'
import { Reveal, SectionHead } from './Reveal'

/**
 * Les outils sont rangés par contexte d'usage (au travail, sur mes projets, déjà pratiqués)
 * plutôt qu'en mur de logos : on sait ainsi d'où vient chaque ligne.
 */
export function Skills() {
  const { t } = useI18n()
  const skills = t.skills

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="shell">
        <SectionHead title={skills.title} intro={skills.intro} headingId="skills-title" />

        <Reveal>
          <dl className="tools">
            {skills.groups.map((group) => (
              <div key={group.label}>
                <dt>{group.label}</dt>
                <dd>{group.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
