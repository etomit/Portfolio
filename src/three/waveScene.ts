import {
  BufferAttribute,
  BufferGeometry,
  Color,
  LineSegments,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three'

export interface WaveScene {
  /** Met le rendu en pause quand la scène n'est pas à l'écran. */
  setRunning(running: boolean): void
  dispose(): void
}

// Nappe de COLUMNS × ROWS mailles, vue en perspective rasante.
const COLUMNS = 70
const ROWS = 36
const SIZE_X = 36
const SIZE_Z = 21
const NEAR_Z = 7
const FRAME_INTERVAL = 1 / 30 // un décor n'a pas besoin de 60 images par seconde
const STILL_TIME = 7.5 // instant figé affiché quand le mouvement est réduit

// Le relief est calculé dans le vertex shader : la géométrie ne change jamais côté JS.
const vertexShader = /* glsl */ `
  uniform float uTime;
  varying float vFade;
  varying float vCrest;

  void main() {
    vec3 p = position;
    // Collines (produit de deux ondes) + houle oblique + petite ride.
    float swell = sin(p.x * 0.36 + uTime * 0.4) * cos(p.z * 0.42 - uTime * 0.26) * 0.95
      + sin((p.x + p.z) * 0.55 + uTime * 0.5) * 0.32
      + sin(p.x * 1.1 - p.z * 0.9 + uTime * 0.8) * 0.1;
    p.y += swell;
    vCrest = smoothstep(0.35, 1.25, swell);
    vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
    // Fondu vers l'horizon et sur les bords latéraux.
    vFade = (1.0 - smoothstep(7.0, 18.0, -viewPosition.z))
      * (1.0 - smoothstep(0.55, 1.0, abs(position.x) / ${(SIZE_X / 2).toFixed(1)}));
    gl_Position = projectionMatrix * viewPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 uSoft;
  uniform vec3 uLine;
  varying float vFade;
  varying float vCrest;

  void main() {
    // Les crêtes prennent la couleur des traits principaux, comme les sommets éclairés de la maquette.
    gl_FragColor = vec4(mix(uSoft, uLine, vCrest * 0.7), vFade * (0.5 + 0.5 * vCrest));
    #include <colorspace_fragment>
  }
`

export function createWaveScene(canvas: HTMLCanvasElement): WaveScene {
  // Lève une exception si WebGL est indisponible : l'appelant affiche alors son dessin de secours.
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const scene = new Scene()
  const camera = new PerspectiveCamera(38, 1, 0.1, 60)

  // --- Grille : sommets partagés, segments indexés le long des lignes et des colonnes -------
  const positions = new Float32Array((COLUMNS + 1) * (ROWS + 1) * 3)
  for (let row = 0; row <= ROWS; row++) {
    for (let column = 0; column <= COLUMNS; column++) {
      const offset = (row * (COLUMNS + 1) + column) * 3
      positions[offset] = (column / COLUMNS - 0.5) * SIZE_X
      positions[offset + 2] = NEAR_Z - (row / ROWS) * SIZE_Z
    }
  }
  const indices: number[] = []
  const vertex = (row: number, column: number) => row * (COLUMNS + 1) + column
  for (let row = 0; row <= ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) indices.push(vertex(row, column), vertex(row, column + 1))
  }
  for (let column = 0; column <= COLUMNS; column++) {
    for (let row = 0; row < ROWS; row++) indices.push(vertex(row, column), vertex(row + 1, column))
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setIndex(indices)

  const material = new ShaderMaterial({
    uniforms: {
      uTime: { value: STILL_TIME },
      uSoft: { value: new Color() },
      uLine: { value: new Color() },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
  })
  const mesh = new LineSegments(geometry, material)
  mesh.frustumCulled = false // le relief sort de la boîte englobante calculée à plat
  scene.add(mesh)

  // --- État --------------------------------------------------------------------------------
  let running = true
  let dirty = true
  let frame = 0
  let lastTime = performance.now() / 1000
  let lastRender = 0
  let elapsed = STILL_TIME

  function applyColors() {
    const style = getComputedStyle(document.documentElement)
    const soft = style.getPropertyValue('--3d-line-soft').trim()
    const line = style.getPropertyValue('--3d-line').trim()
    if (soft) material.uniforms.uSoft.value.set(soft)
    if (line) material.uniforms.uLine.value.set(line)
    dirty = true
  }

  function resize() {
    const { clientWidth: width, clientHeight: height } = canvas
    if (width === 0 || height === 0) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    // Sur un écran haut et étroit, on élargit le champ pour garder la nappe sur toute la largeur.
    camera.fov = camera.aspect < 1 ? 52 : 38
    camera.position.set(0, 3.1, 9)
    camera.lookAt(0, -0.2, -3.5)
    camera.updateProjectionMatrix()
    dirty = true
  }

  function tick() {
    frame = requestAnimationFrame(tick)
    const now = performance.now() / 1000
    const delta = Math.min(0.1, now - lastTime)
    lastTime = now
    if (!reducedMotion) {
      elapsed += delta
      if (now - lastRender >= FRAME_INTERVAL) dirty = true
    }
    if (!dirty) return
    dirty = false
    lastRender = now
    material.uniforms.uTime.value = elapsed
    renderer.render(scene, camera)
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  const themeObserver = new MutationObserver(applyColors)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  applyColors()
  resize()
  frame = requestAnimationFrame(tick)

  return {
    setRunning(next) {
      if (next === running) return
      running = next
      cancelAnimationFrame(frame)
      if (running) {
        lastTime = performance.now() / 1000
        dirty = true
        frame = requestAnimationFrame(tick)
      }
    },
    dispose() {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    },
  }
}
