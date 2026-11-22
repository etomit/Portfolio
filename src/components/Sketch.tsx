import { useId } from 'react'
import type { SketchId } from '../content'

/**
 * Vignettes des cartes projets, dessinées au trait (viewBox 200 × 120).
 * Des croquis volontairement simples : un objet par projet, sans logo ni personnage sous licence.
 */
export function Sketch({ id }: { id: SketchId }) {
  const uid = useId().replace(/:/g, '')
  const hatch = `url(#${uid}-h)`
  return (
    <svg className="sketch" viewBox="0 0 200 120" aria-hidden="true">
      <defs>
        <pattern id={`${uid}-h`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="5" className="sketch-hatch" />
        </pattern>
      </defs>
      {id === 'pokeline' && (
        <g>
          {/* Deux plateformes d'arène, une trajectoire d'attaque et deux barres de vie. */}
          <ellipse cx="58" cy="92" rx="40" ry="11" />
          <ellipse cx="58" cy="92" rx="26" ry="6" className="thin" />
          <ellipse cx="146" cy="50" rx="34" ry="9" />
          <ellipse cx="146" cy="50" rx="21" ry="5" className="thin" />
          <path d="M70 76 Q 104 14 134 40" className="dash" />
          <path d="M126 36 L135 41 L127 47" />
          <rect x="12" y="14" width="70" height="20" />
          <rect x="16" y="26" width="44" height="4" fill={hatch} className="thin" />
          <path d="M16 20h30" className="thin" />
          <rect x="118" y="82" width="70" height="20" />
          <rect x="122" y="94" width="58" height="4" fill={hatch} className="thin" />
          <path d="M122 88h30" className="thin" />
        </g>
      )}
      {id === 'commerce' && (
        <g>
          {/* Une boutique : store festonné, vitrine, porte, et un ticket de commande. */}
          <path d="M24 46h112v62H24z" />
          <path d="M18 46 L30 22 H130 L142 46" />
          <path d="M18 46 q7 9 15.5 0 q7 9 15.5 0 q7 9 15.5 0 q7 9 15.5 0 q7 9 15.5 0 q7 9 15.5 0 q7 9 15.5 0" className="thin" />
          <path d="M38 22 L32 46 M58 22 L56 46 M80 22 V46 M102 22 L104 46 M122 22 L128 46" className="thin" />
          <rect x="34" y="62" width="46" height="32" fill={hatch} className="thin" />
          <path d="M94 62h26v46H94z" />
          <circle cx="114" cy="86" r="1.6" />
          <path d="M152 30h34v62l-5-4-5 4-5-4-5 4-5-4-5 4-4-4z" />
          <path d="M158 42h22M158 52h22M158 62h14M158 76h22" className="thin" />
        </g>
      )}
      {id === 'dungeon' && (
        <g>
          {/* Un donjon vu de dessus : salles reliées par des couloirs, un escalier, un boss. */}
          <rect x="14" y="16" width="40" height="30" />
          <rect x="80" y="12" width="44" height="36" />
          <rect x="150" y="18" width="36" height="28" fill={hatch} />
          <rect x="22" y="72" width="44" height="34" />
          <rect x="96" y="72" width="38" height="34" />
          <path d="M54 31h26M124 30h26M34 46v26M66 89h30M116 48v24" className="thin" />
          <path d="M104 80h22M104 86h22M104 92h22M104 98h22" className="thin" />
          <path d="M162 26 l12 12 M174 26 l-12 12" />
          <path d="M150 90h36M168 72v36" className="dash" />
        </g>
      )}
      {id === 'market' && (
        <g>
          {/* Des chandeliers, une courbe, et cinq modèles qui convergent vers une décision. */}
          <path d="M12 104h176M12 104V12" className="thin" />
          {[24, 40, 56, 72, 88].map((x, i) => {
            const top = [52, 40, 58, 34, 46][i]
            const bottom = [80, 66, 84, 62, 72][i]
            return (
              <g key={x}>
                <path d={`M${x} ${top - 8}V${bottom + 8}`} className="thin" />
                <rect x={x - 4} y={top} width="8" height={bottom - top} fill={i % 2 ? hatch : 'none'} />
              </g>
            )
          })}
          <path d="M20 70 L40 58 L56 66 L72 44 L92 52" className="dash" />
          {[22, 40, 58, 76, 94].map((y) => (
            <g key={y}>
              <circle cx="124" cy={y} r="5" />
              <path d={`M129 ${y} L168 58`} className="thin" />
            </g>
          ))}
          <rect x="168" y="48" width="20" height="20" fill={hatch} />
        </g>
      )}
      {id === 'city' && (
        <g>
          {/* Quelques bâtiments en axonométrie, sur une grille de ville. */}
          <path d="M10 92 L100 112 L190 92 L100 72 Z" className="thin" />
          <path d="M40 86 v-34 l18 -6 l18 4 v34 M58 46 v34 M40 52 l18 4 l18 -6" />
          <path d="M92 80 v-56 l16 -5 l16 4 v56 M108 19 v56 M92 24 l16 4 l16 -5" />
          <path d="M108 28 l16 -5 v56 l-16 5 z" fill={hatch} className="thin" />
          <path d="M136 92 v-22 l14 -4 l14 3 v22 M150 66 v22 M136 70 l14 3 l14 -4" />
          <path d="M28 98 l14 3 M156 98 l14 -3" className="dash" />
        </g>
      )}
      {id === 'phone' && (
        <g>
          {/* Un téléphone : Pokédex en liste, recherche, et un combat esquissé à côté. */}
          <rect x="30" y="8" width="58" height="104" rx="8" />
          <path d="M52 15h14" className="thin" />
          <rect x="38" y="24" width="42" height="9" className="thin" />
          {[42, 56, 70, 84].map((y) => (
            <g key={y}>
              <circle cx="44" cy={y + 4} r="4" className="thin" />
              <path d={`M52 ${y + 2}h24M52 ${y + 7}h16`} className="thin" />
            </g>
          ))}
          <path d="M104 60 h20 M118 54 l6 6 l-6 6" />
          <ellipse cx="158" cy="86" rx="28" ry="8" />
          <ellipse cx="166" cy="38" rx="22" ry="6" />
          <rect x="132" y="56" width="36" height="8" fill={hatch} className="thin" />
        </g>
      )}
    </svg>
  )
}
