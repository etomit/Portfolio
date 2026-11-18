import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import type { CityScene } from '../three/cityScene'

type Status = 'idle' | 'loading' | 'ready' | 'unsupported'

/**
 * Carte « Ville procédurale ». Three.js pèse lourd : il n'est téléchargé que
 * lorsque la carte approche de l'écran, et le rendu s'arrête dès qu'elle en sort.
 */
export function CityCard() {
  const { t } = useI18n()
  const copy = t.projects.playground.city
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<CityScene | null>(null)
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return

    let cancelled = false
    let started = false
    let visible = false

    const start = async () => {
      started = true
      setStatus('loading')
      try {
        const { createCityScene } = await import('../three/cityScene')
        if (cancelled) return
        sceneRef.current = createCityScene(canvas)
        sceneRef.current.setRunning(visible)
        setStatus('ready')
      } catch {
        if (!cancelled) setStatus('unsupported')
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !started) void start()
        sceneRef.current?.setRunning(visible)
      },
      { rootMargin: '200px 0px' },
    )
    observer.observe(stage)

    return () => {
      cancelled = true
      observer.disconnect()
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [])

  return (
    <article className="city-card">
      <div className="city-copy">
        <p className="label">{copy.tech}</p>
        <h4>{copy.name}</h4>
        <p>{copy.description}</p>
        <button
          type="button"
          className="button button-ghost"
          disabled={status !== 'ready'}
          onClick={() => sceneRef.current?.rebuild()}
        >
          {copy.rebuild}
        </button>
      </div>
      <div className="city-stage" ref={stageRef}>
        <canvas ref={canvasRef} role="img" aria-label={copy.canvasLabel} />
        {status === 'ready' && <p className="city-hint" aria-hidden="true">{copy.hint}</p>}
        {(status === 'idle' || status === 'loading') && <p className="city-status">{copy.loading}</p>}
        {status === 'unsupported' && <p className="city-status">{copy.unsupported}</p>}
      </div>
    </article>
  )
}
