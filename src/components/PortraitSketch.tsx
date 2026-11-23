import { useEffect, useId, useRef, useState, type CSSProperties, type Ref } from 'react'

type PortraitPaths = typeof import('../sketch/portraitPaths')

interface PortraitSketchProps {
  alt: string
  caption: string
  /** Avancement initial des quatre calques (construction, contour, ombres, photo). */
  stages?: [number, number, number, number]
  /** Élément qui reçoit les variables --s1 à --s4 (écrites au défilement par « À propos »). */
  ref?: Ref<HTMLDivElement>
}

/**
 * Fenêtre de tracé de chaque trait dans son calque : les traits se suivent, chacun commençant
 * quand ses prédécesseurs ont fait l'essentiel de leur chemin. La longueur du chemin SVG
 * (en caractères) sert d'estimation de la longueur du trait.
 */
function windows(strokes: readonly string[]) {
  const total = strokes.reduce((sum, d) => sum + d.length, 0)
  let before = 0
  return strokes.map((d) => {
    const a = (before / total) * 0.8
    before += d.length
    return { '--a': a.toFixed(3), '--b': ((d.length / total) * 0.8 + 0.2).toFixed(3) } as CSSProperties
  })
}

/**
 * Le portrait d'« À propos » : quatre calques superposés à la photo, dans le repère de la photo
 * recadrée (viewBox 0 0 1000 1170). Les chemins, générés par scripts/portrait-lines.mjs, sont
 * chargés à part, à l'approche du dessin ; la boîte est réservée par son rapport largeur/hauteur.
 */
export function PortraitSketch({ alt, caption, stages = [1, 1, 1, 1], ref }: PortraitSketchProps) {
  const clipId = `${useId().replace(/:/g, '')}-sweep`
  const boxRef = useRef<HTMLDivElement>(null)
  const [paths, setPaths] = useState<PortraitPaths | null>(null)

  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    let cancelled = false
    const load = () => {
      import('../sketch/portraitPaths').then((module) => {
        if (!cancelled) setPaths(module)
      })
    }
    // À l'impression, le dessin doit être là même si l'on n'a jamais défilé jusqu'ici.
    window.addEventListener('beforeprint', load, { once: true })
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          load()
        }
      },
      { rootMargin: '900px 0px' },
    )
    observer.observe(box)
    return () => {
      cancelled = true
      observer.disconnect()
      window.removeEventListener('beforeprint', load)
    }
  }, [])

  const style = {
    '--s1': stages[0],
    '--s2': stages[1],
    '--s3': stages[2],
    '--s4': stages[3],
  } as CSSProperties

  return (
    <div className="portrait-sketch" ref={ref} style={style}>
      <div className="ps-box" ref={boxRef}>
        <img
          className="ps-photo"
          src="/portrait-520.webp"
          srcSet="/portrait-520.webp 520w, /portrait-900.webp 900w"
          sizes="(max-width: 900px) 26vh, 480px"
          width="900"
          height="1053"
          alt={alt}
          loading="eager"
          fetchPriority="low"
          decoding="async"
        />
        {paths && (
          <svg className="ps-svg" viewBox={paths.PORTRAIT_VIEWBOX} aria-hidden="true" focusable="false">
            <defs>
              <clipPath id={clipId}>
                {/* Demi-plan qui balaie le dessin en diagonale, du coin haut gauche au coin bas droit, selon --s3. */}
                <rect className="ps-sweep" x="-3000" y="-3000" width="3000" height="6000" />
              </clipPath>
            </defs>
            <g className="ps-l3" clipPath={`url(#${clipId})`}>
              <path className="ps-hatch" d={paths.hatchPaths[0]} />
              <path className="ps-hatch ps-hatch-odd" d={paths.hatchPaths[1]} />
            </g>
            <g className="ps-l1">
              {windows(paths.constructionStrokes).map((win, i) => (
                <path key={i} d={paths.constructionStrokes[i]} pathLength={1} className="ps-stroke" style={win} />
              ))}
            </g>
            <g className="ps-l2">
              {windows(paths.contourStrokes).map((win, i) => (
                <path key={i} d={paths.contourStrokes[i]} pathLength={1} className="ps-stroke" style={win} />
              ))}
            </g>
          </svg>
        )}
        <span className="ps-cartouche label">{caption}</span>
      </div>
    </div>
  )
}
