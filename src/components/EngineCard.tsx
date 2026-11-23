import { useCallback, useMemo, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import type { EngineScene } from '../three/engineScene'
import { hasWebGL, useLazyScene } from '../useLazyScene'
import { BracketLabel } from './Reveal'

/**
 * Carte « Moteur OM 936 » : le diesel du Citaro en fil de fer, pistons animés.
 * Même cycle de vie que la ville : chargé à l'approche, en pause hors de l'écran.
 */
export function EngineCard() {
  const { t } = useI18n()
  const copy = t.projects.playground.engine
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [exploded, setExploded] = useState(false)
  const webgl = useMemo(hasWebGL, [])
  const factory = useCallback(async (canvas: HTMLCanvasElement) => {
    const { createEngineScene } = await import('../three/engineScene')
    return createEngineScene(canvas)
  }, [])
  const { sceneRef, status } = useLazyScene<EngineScene>(stageRef, canvasRef, factory, webgl)
  const effective = webgl ? status : 'unsupported'
  const ready = effective === 'ready'

  const toggle = () => {
    const next = !exploded
    setExploded(next)
    sceneRef.current?.setExploded(next)
  }

  return (
    <article className="city-card engine-card">
      <div className="city-copy">
        <p className="label">{copy.tech}</p>
        <h4>{copy.name}</h4>
        <p>{copy.description}</p>
        <button
          type="button"
          className="bracket bracket-small"
          disabled={!ready}
          onClick={toggle}
        >
          <BracketLabel>{exploded ? copy.assemble : copy.explode}</BracketLabel>
        </button>
        <p className="engine-source label">{copy.source}</p>
      </div>
      <div className="city-stage" ref={stageRef}>
        {/* Tant que le moteur n'est pas dessiné, seul le message de statut est lu. */}
        <canvas
          ref={canvasRef}
          role={ready ? 'img' : undefined}
          aria-label={ready ? copy.canvasLabel : undefined}
          aria-hidden={ready ? undefined : true}
        />
        {ready && <p className="city-hint label" aria-hidden="true">{copy.hint}</p>}
        {(effective === 'idle' || effective === 'loading') && <p className="city-status label">{copy.loading}</p>}
        {effective === 'unsupported' && <p className="city-status label">{copy.unsupported}</p>}
      </div>
    </article>
  )
}
