import { useCallback, useMemo, useRef } from 'react'
import { useI18n } from '../i18n'
import type { CityScene } from '../three/cityScene'
import { hasWebGL, useLazyScene } from '../useLazyScene'
import { BracketLabel } from './Reveal'

/**
 * Carte « Ville procédurale ». Three.js n'est téléchargé que lorsque la carte approche
 * de l'écran, et le rendu s'arrête dès qu'elle en sort.
 */
export function CityCard() {
  const { t } = useI18n()
  const copy = t.projects.playground.city
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const webgl = useMemo(hasWebGL, [])
  const factory = useCallback(async (canvas: HTMLCanvasElement) => {
    const { createCityScene } = await import('../three/cityScene')
    return createCityScene(canvas)
  }, [])
  const { sceneRef, status } = useLazyScene<CityScene>(stageRef, canvasRef, factory, webgl)
  const effective = webgl ? status : 'unsupported'

  return (
    <article className="city-card">
      <div className="city-copy">
        <p className="label">{copy.tech}</p>
        <h4>{copy.name}</h4>
        <p>{copy.description}</p>
        <button
          type="button"
          className="bracket bracket-small"
          disabled={effective !== 'ready'}
          onClick={() => sceneRef.current?.rebuild()}
        >
          <BracketLabel>{copy.rebuild}</BracketLabel>
        </button>
      </div>
      <div className="city-stage" ref={stageRef}>
        {/* Tant que la ville n'est pas dessinée, seul le message de statut est lu : pas d'image vide annoncée. */}
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={copy.canvasLabel}
          aria-hidden={effective !== 'ready' || undefined}
        />
        {effective === 'ready' && <p className="city-hint label" aria-hidden="true">{copy.hint}</p>}
        {(effective === 'idle' || effective === 'loading') && <p className="city-status label">{copy.loading}</p>}
        {effective === 'unsupported' && <p className="city-status label">{copy.unsupported}</p>}
      </div>
    </article>
  )
}
