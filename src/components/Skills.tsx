import { useI18n } from '../i18n'
import { Reveal, SectionHead, Sheet } from './Reveal'

/**
 * Compétences : une nomenclature, comme sur un plan, rangée par contexte d'usage plutôt
 * qu'en mur de logos ; puis le côté humain, appuyé sur des faits du parcours.
 */
export function Skills() {
  const { t } = useI18n()
  const skills = t.skills

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="shell">
        <Sheet>
          <SectionHead title={skills.title} intro={skills.intro} headingId="skills-title" />

          <Reveal>
            <table className="nomenclature">
              <caption className="sr-only">{skills.tableCaption}</caption>
              <thead>
                <tr>
                  <th scope="col">{skills.tableHead[0]}</th>
                  <th scope="col">{skills.tableHead[1]}</th>
                </tr>
              </thead>
              <tbody>
                {skills.groups.map((group) => (
                  <tr key={group.label}>
                    <th scope="row">{group.label}</th>
                    <td>{group.items.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          <Reveal className="people">
            <h3 className="subhead">{skills.peopleTitle}</h3>
            <p className="people-intro">{skills.peopleIntro}</p>
            <dl className="people-list">
              {skills.people.map((item) => (
                <div key={item.name}>
                  <dt className="hand">{item.name}</dt>
                  <dd>{item.text}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Sheet>
      </div>
    </section>
  )
}
