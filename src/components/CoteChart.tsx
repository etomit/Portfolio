import type { CSSProperties } from 'react'
import { yearNow } from '../years'

export interface CoteItem {
  id: string
  label: string
  sub: string
  start: number
  /** null = en cours (jusqu'à aujourd'hui). */
  end: number | null
  /** Fin prévue, pas encore atteinte : tracée en pointillés. */
  planned?: boolean
  current?: boolean
}

interface CoteChartProps {
  items: CoteItem[]
  from: number
  to: number
  label: string
  todayLabel: string
}

/**
 * Une chronologie dessinée comme des cotes de plan : chaque période est une ligne de cote
 * avec ses flèches, posée sur un axe des années. Le texte reste lisible sans le dessin.
 */
export function CoteChart({ items, from, to, label, todayLabel }: CoteChartProps) {
  const now = yearNow()
  const span = to - from
  const pct = (year: number) => `${(((Math.min(Math.max(year, from), to) - from) / span) * 100).toFixed(2)}%`
  const years: number[] = []
  for (let year = Math.ceil(from); year <= Math.floor(to); year++) years.push(year)
  const todayInRange = now > from && now < to

  return (
    // Une image pour les lecteurs d'écran : son libellé suffit, la liste qui suit donne le détail.
    <figure className="cote-chart" role="img" aria-label={label}>
      <div className="cote-plot">
        <div className="cote-grid" aria-hidden="true">
          {years.map((year) => (
            <span key={year} style={{ left: pct(year) }} />
          ))}
          {todayInRange && (
            <span className="cote-today" style={{ left: pct(now) }}>
              <em>{todayLabel}</em>
            </span>
          )}
        </div>

        <ol className="cote-rows">
          {items.map((item) => {
            const end = item.end ?? now
            const left = (Math.max(item.start, from) - from) / span
            const style = {
              '--left': pct(item.start),
              '--width': `calc(${pct(end)} - ${pct(item.start)})`,
            } as CSSProperties
            const classes = [
              'cote-row',
              item.current ? 'is-current' : '',
              item.end === null ? 'is-open' : '',
              item.planned ? 'is-planned' : '',
              // Passé le milieu de l'axe, l'étiquette s'aligne sur la fin de sa ligne : elle ne déborde jamais à droite.
              left > 0.45 ? 'is-anchored-end' : '',
            ].join(' ')
            return (
              <li key={item.id} className={classes} style={style}>
                <span className="cote-line" aria-hidden="true" />
                <span className="cote-text">
                  <strong>{item.label}</strong>
                  <span>{item.sub}</span>
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="cote-axis" aria-hidden="true">
        {years.map((year) => (
          <span key={year} style={{ left: pct(year) }}>
            {year}
          </span>
        ))}
      </div>
    </figure>
  )
}
