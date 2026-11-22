import { useId, type CSSProperties, type Ref } from 'react'
import { buildBusSketch } from '../sketch/busSketch'

interface BusSketchProps {
  /** Libellés des cotes, déjà formatés. */
  labels: { length: string; width: string; height: string }
  label: string
  /** Avancement de chaque calque, de 0 à 1 (plan, volume, détails, rendu). Tout tracé par défaut. */
  stages?: [number, number, number, number]
  className?: string
  /** Retire le dessin de l'arbre d'accessibilité (quand la scène 3D l'a remplacé). */
  hidden?: boolean
  ref?: Ref<SVGSVGElement>
}

/**
 * Le bus en dessin technique. Chaque calque se trace selon sa variable CSS --s1 à --s4 :
 * la section « À propos » les fait varier au défilement, le hero s'en sert tel quel
 * comme dessin de secours quand WebGL n'est pas disponible.
 */
export function BusSketch({ labels, label, stages = [1, 1, 1, 1], className = '', hidden = false, ref }: BusSketchProps) {
  const { viewBox, layers } = buildBusSketch()
  const id = useId().replace(/:/g, '')
  const style = {
    '--s1': stages[0],
    '--s2': stages[1],
    '--s3': stages[2],
    '--s4': stages[3],
  } as CSSProperties

  return (
    <svg
      ref={ref}
      className={`bus-sketch ${className}`}
      viewBox={viewBox}
      role={hidden ? undefined : 'img'}
      aria-label={hidden ? undefined : label}
      aria-hidden={hidden || undefined}
      style={style}
    >
      <defs>
        <pattern id={`${id}-hatch`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="7" className="sk-hatch-line" />
        </pattern>
        <pattern id={`${id}-hatch-dense`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="4" className="sk-hatch-line" />
        </pattern>
      </defs>
      {layers.map((layer, index) => (
        <g key={index} className={`sk-layer sk-layer-${index + 1}`}>
          {layer.fills.map((fill, i) => (
            <path key={`f${i}`} d={fill.d} className="sk-fill" fill={`url(#${id}-${fill.dense ? 'hatch-dense' : 'hatch'})`} />
          ))}
          {layer.paths.map((path, i) =>
            // Les traits pleins se dessinent (pathLength + dashoffset) ; les tirets apparaissent en fondu,
            // car leur motif de tirets occupe déjà stroke-dasharray.
            path.kind === 'hidden' || path.kind === 'axis' ? (
              <path key={i} d={path.d} className={`sk-path sk-${path.kind}`} />
            ) : (
              <path key={i} d={path.d} pathLength={1} className={`sk-path sk-draw sk-${path.kind}`} />
            ),
          )}
          {layer.labels.map((item) => (
            <text
              key={item.key}
              className="sk-label"
              x={item.x}
              y={item.y}
              transform={`rotate(${item.angle} ${item.x} ${item.y})`}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {labels[item.key]}
            </text>
          ))}
        </g>
      ))}
    </svg>
  )
}
