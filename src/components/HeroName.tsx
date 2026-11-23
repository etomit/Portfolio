import { useId } from 'react'

/**
 * Le nom en lettres de plan : lignes de construction, contour tracé au trait, puis hachures.
 * La séquence d'animation est pilotée en CSS par l'attribut data-intro du hero
 * (« play » pendant l'intro, « done » ensuite ou si elle est passée).
 */
export function HeroName({ lines }: { lines: string[] }) {
  const id = useId().replace(/:/g, '')
  const [first, second = ''] = lines.map((line) => line.toUpperCase())
  // Gabarit : deux lignes de 150 unités, chasse imposée pour que le dessin ne dépende pas de la police.
  const rows = [
    { text: first, baseline: 172, length: 940 },
    { text: second, baseline: 352, length: 590 },
  ]
  const capHeight = 124

  return (
    <svg className="hero-name" viewBox="0 0 980 380" aria-hidden="true">
      <defs>
        <pattern id={`${id}-hatch`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="9" className="hn-hatch-line" />
        </pattern>
      </defs>

      {/* 1. Tracés de construction : lignes de base, hauteurs de capitales, repères verticaux. */}
      <g className="hn-construct">
        {rows.map((row) => (
          <g key={row.baseline}>
            <path d={`M0 ${row.baseline}H980`} pathLength={1} />
            <path d={`M0 ${row.baseline - capHeight}H980`} pathLength={1} />
          </g>
        ))}
        <path d="M14 10V372" pathLength={1} />
        <path d={`M${14 + rows[0].length} 10V200`} pathLength={1} />
        <path d={`M${14 + rows[1].length} 190V372`} pathLength={1} />
      </g>

      {/* 3. Remplissage en hachures (sous le contour). */}
      <g className="hn-fill" fill={`url(#${id}-hatch)`}>
        {rows.map((row) => (
          <text key={row.baseline} x="14" y={row.baseline} textLength={row.length} lengthAdjust="spacing">
            {row.text}
          </text>
        ))}
      </g>

      {/* 2. Contour des lettres, tracé au trait. */}
      <g className="hn-outline">
        {rows.map((row) => (
          <text key={row.baseline} x="14" y={row.baseline} textLength={row.length} lengthAdjust="spacing">
            {row.text}
          </text>
        ))}
      </g>
    </svg>
  )
}
