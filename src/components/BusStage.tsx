import { useCallback, useMemo, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import type { BusScene } from '../three/busScene'
import { hasWebGL, useLazyScene } from '../useLazyScene'
import { BusSketch } from './BusSketch'
import { BracketLabel } from './Reveal'

/**
 * Le bus du hero : une scène Three.js en fil de fer, chargée à la demande.
 * Tant qu'elle n'est pas prête (ou si WebGL manque), le dessin technique SVG la remplace.
 */
export function BusStage() {
  const { t } = useI18n()
  const hero = t.hero
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const webgl = useMemo(hasWebGL, [])
  const [exploded, setExploded] = useState(false)

  const factory = useCallback(
    async (canvas: HTMLCanvasElement) => {
      const { createBusScene } = await import('../three/busScene')
      return createBusScene(canvas, { labels: hero.dims })
    },
    // Les cotes sont identiques en français et en anglais (séparateur de milliers à l'espace fine, norme SI).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const { sceneRef, status } = useLazyScene<BusScene>(containerRef, canvasRef, factory, webgl)
  const ready = status === 'ready'

  const toggle = () => {
    const next = !exploded
    setExploded(next)
    sceneRef.current?.setExploded(next)
  }

  return (
    <div className="bus-stage" ref={containerRef}>
      <div className={`bus-view ${ready ? 'is-ready' : ''}`}>
        {/* Tant que la scène n'est pas affichée, seul le dessin de secours est annoncé : jamais deux images à la fois. */}
        {webgl && <canvas ref={canvasRef} role="img" aria-label={hero.canvasLabel} aria-hidden={!ready || undefined} />}
        <BusSketch className="bus-fallback" labels={hero.dims} label={hero.sketchLabel} hidden={ready} />
      </div>

      <p className="model-note hand" aria-hidden="true">
        <svg className="note-arrow" viewBox="0 0 90 60">
          <path d="M6 8 C 30 4, 58 18, 72 46" />
          <path d="M62 42 L72 47 L74 35" />
        </svg>
        <span>{hero.modelNote[0]}</span>
        <span>{hero.modelNote[1]}</span>
      </p>

      {ready && (
        <div className="bus-controls">
          {/* Pas d'aria-pressed : le libellé dit déjà l'action suivante. */}
          <button type="button" className="bracket bracket-small" onClick={toggle}>
            <BracketLabel>{exploded ? hero.assemble : hero.explode}</BracketLabel>
          </button>
          <span className="label">{hero.dragHint}</span>
        </div>
      )}
    </div>
  )
}
