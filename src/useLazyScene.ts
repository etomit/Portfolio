import { useEffect, useRef, useState, type RefObject } from 'react'

export interface RunnableScene {
  setRunning(running: boolean): void
  dispose(): void
}

export type SceneStatus = 'idle' | 'loading' | 'ready' | 'unsupported'

/**
 * Charge une scène Three.js seulement quand son conteneur approche de l'écran,
 * met son rendu en pause dès qu'il en sort, et la libère au démontage.
 * `factory` fait l'import dynamique : Three.js n'est téléchargé qu'à ce moment-là.
 */
export function useLazyScene<T extends RunnableScene>(
  containerRef: RefObject<HTMLElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  factory: (canvas: HTMLCanvasElement) => Promise<T>,
  enabled = true,
) {
  const sceneRef = useRef<T | null>(null)
  const factoryRef = useRef(factory)
  const [status, setStatus] = useState<SceneStatus>('idle')

  useEffect(() => {
    factoryRef.current = factory
  }, [factory])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!enabled || !container || !canvas) return

    let cancelled = false
    let started = false
    let visible = false

    const start = async () => {
      started = true
      setStatus('loading')
      try {
        const scene = await factoryRef.current(canvas)
        if (cancelled) {
          scene.dispose()
          return
        }
        sceneRef.current = scene
        scene.setRunning(visible)
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
      { rootMargin: '240px 0px' },
    )
    observer.observe(container)

    return () => {
      cancelled = true
      observer.disconnect()
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [containerRef, canvasRef, enabled])

  return { sceneRef, status }
}

/** WebGL est-il disponible ? Évite de télécharger Three.js pour rien. */
export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    // Le contexte d'essai est rendu tout de suite : le navigateur en limite le nombre.
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return Boolean(gl)
  } catch {
    return false
  }
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
