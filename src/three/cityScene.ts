import {
  BoxGeometry,
  Color,
  ConeGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  InstancedMesh,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  OrthographicCamera,
  Scene,
  WebGLRenderer,
} from 'three'

export interface CityScene {
  /** Génère une nouvelle ville et rejoue l'animation de construction. */
  rebuild(): void
  /** Met le rendu en pause quand la scène n'est pas à l'écran. */
  setRunning(running: boolean): void
  dispose(): void
}

// Plan de la ville : GRID × GRID parcelles séparées par des rues, ceinturées par un boulevard.
const GRID = 7
const LOT = 1
const STREET = 0.34
const PITCH = LOT + STREET
const SPAN = GRID * PITCH - STREET
const HALF = SPAN / 2
const RING = 1.1
const LOOP = HALF + RING / 2
const CENTER = (GRID - 1) / 2
const SIDEWALK = 0.05

const BUILD_DURATION = 0.75
const BUS_SPEED = 1.15
const SPIN_SPEED = 0.07

type Role = 'light' | 'sand' | 'dark' | 'accent'

interface Block {
  x: number
  z: number
  width: number
  depth: number
  height: number
  /** Altitude du pied du bloc : non nulle pour l'étage supérieur d'une tour. */
  base: number
  delay: number
  role: Role
}

interface Tree { x: number; z: number; size: number; delay: number }
interface Lot { x: number; z: number; park: boolean }
interface CityPlan { blocks: Block[]; trees: Tree[]; lots: Lot[] }

const PALETTES = {
  light: {
    ground: '#c9c1ae', lot: '#e6e0d1', park: '#b4bd94', tree: '#5d7848', glass: '#2a2923',
    light: '#f7f3ea', sand: '#dcd3be', dark: '#2f2e27', accent: '#e2421b', sky: '#ffffff', bounce: '#d9cfb8',
  },
  dark: {
    ground: '#2c2b26', lot: '#3d3c35', park: '#44543a', tree: '#7c9c62', glass: '#171610',
    light: '#8a877a', sand: '#5f5d53', dark: '#f0ebde', accent: '#ff6b3d', sky: '#e6e9f5', bounce: '#3a3933',
  },
} as const

/** Générateur pseudo-aléatoire déterministe : une graine donne toujours la même ville. */
function mulberry32(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function planCity(seed: number): CityPlan {
  const random = mulberry32(seed)
  const plan: CityPlan = { blocks: [], trees: [], lots: [] }

  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      const x = -HALF + LOT / 2 + i * PITCH
      const z = -HALF + LOT / 2 + j * PITCH
      const distance = Math.hypot(i - CENTER, j - CENTER)
      // 1 au centre-ville, 0 en périphérie : les tours se concentrent au milieu.
      const centrality = Math.max(0, 1 - distance / (CENTER * 1.42))
      const delay = distance * 0.09 + random() * 0.15
      const park = centrality < 0.8 && random() < 0.15
      plan.lots.push({ x, z, park })

      if (park) {
        const count = 2 + Math.floor(random() * 3)
        for (let n = 0; n < count; n++) {
          plan.trees.push({
            x: x + (random() - 0.5) * 0.62,
            z: z + (random() - 0.5) * 0.62,
            size: 0.75 + random() * 0.6,
            delay: delay + n * 0.06,
          })
        }
        continue
      }

      const height = 0.35 + (0.45 + 3 * centrality) * Math.pow(random(), 1.6)
      const width = 0.6 + random() * 0.3
      const depth = 0.6 + random() * 0.3
      const pick = random()
      const role: Role = pick < 0.07 ? 'accent' : pick < 0.2 ? 'dark' : pick < 0.55 ? 'sand' : 'light'
      plan.blocks.push({ x, z, width, depth, height, base: 0, delay, role })

      if (height > 1.7 && random() < 0.6) {
        plan.blocks.push({
          x, z,
          width: width * 0.56,
          depth: depth * 0.56,
          height: height * (0.2 + random() * 0.25),
          base: height,
          delay: delay + 0.12,
          role,
        })
      }
    }
  }
  return plan
}

const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3)
const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function createCityScene(canvas: HTMLCanvasElement): CityScene {
  // Lève une exception si WebGL est indisponible : l'appelant affiche alors un message.
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 80)
  camera.position.set(12, 10.5, 12)
  camera.lookAt(0, 0.9, 0)

  const hemisphere = new HemisphereLight('#ffffff', '#d9cfb8', 1.5)
  const sun = new DirectionalLight('#ffffff', 2.4)
  sun.position.set(5, 11, 3)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  sun.shadow.camera.left = -9
  sun.shadow.camera.right = 9
  sun.shadow.camera.top = 9
  sun.shadow.camera.bottom = -9
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 30
  sun.shadow.bias = -0.0006
  scene.add(hemisphere, sun)

  const city = new Group()
  city.rotation.y = -0.35
  scene.add(city)

  // --- Géométries et matériaux, partagés entre toutes les instances -----------
  const unitBox = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0) // pied posé à y = 0
  const cone = new ConeGeometry(0.17, 0.5, 6).translate(0, 0.25, 0)
  const groundMaterial = new MeshLambertMaterial()
  const instanceMaterial = new MeshLambertMaterial() // blanc : la teinte vient de chaque instance
  const treeMaterial = new MeshLambertMaterial()
  const busMaterial = new MeshLambertMaterial()
  const glassMaterial = new MeshLambertMaterial()

  const groundSize = SPAN + RING * 2
  const ground = new Mesh(new BoxGeometry(groundSize, 0.4, groundSize), groundMaterial)
  ground.position.y = -0.2
  ground.receiveShadow = true

  const lotMesh = new InstancedMesh(unitBox, instanceMaterial, GRID * GRID)
  lotMesh.receiveShadow = true
  const blockMesh = new InstancedMesh(unitBox, instanceMaterial, GRID * GRID * 2)
  blockMesh.castShadow = true
  blockMesh.receiveShadow = true
  const treeMesh = new InstancedMesh(cone, treeMaterial, GRID * GRID * 4)
  treeMesh.castShadow = true

  const bus = new Group()
  const busBody = new Mesh(new BoxGeometry(0.95, 0.34, 0.38), busMaterial)
  busBody.position.y = 0.23
  busBody.castShadow = true
  const busWindows = new Mesh(new BoxGeometry(0.82, 0.11, 0.4), glassMaterial)
  busWindows.position.y = 0.3
  bus.add(busBody, busWindows)

  city.add(ground, lotMesh, blockMesh, treeMesh, bus)

  // --- État --------------------------------------------------------------------
  const dummy = new Object3D()
  const tint = new Color()
  let plan = planCity(Math.floor(Math.random() * 1e9))
  let buildStart = performance.now() / 1000
  let building = true
  let running = true
  let dirty = true
  let frame = 0
  let lastTime = performance.now() / 1000
  let busDistance = 0
  let dragging = false
  let lastPointerX = 0
  let spinVelocity = 0

  const currentPalette = () => PALETTES[document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light']

  function applyColors() {
    const palette = currentPalette()
    groundMaterial.color.set(palette.ground)
    treeMaterial.color.set(palette.tree)
    busMaterial.color.set(palette.accent)
    glassMaterial.color.set(palette.glass)
    hemisphere.color.set(palette.sky)
    hemisphere.groundColor.set(palette.bounce)

    plan.lots.forEach((lot, index) => lotMesh.setColorAt(index, tint.set(lot.park ? palette.park : palette.lot)))
    plan.blocks.forEach((block, index) => blockMesh.setColorAt(index, tint.set(palette[block.role])))
    if (lotMesh.instanceColor) lotMesh.instanceColor.needsUpdate = true
    if (blockMesh.instanceColor) blockMesh.instanceColor.needsUpdate = true
    dirty = true
  }

  function placeLots() {
    plan.lots.forEach((lot, index) => {
      dummy.position.set(lot.x, 0, lot.z)
      dummy.scale.set(LOT, SIDEWALK, LOT)
      dummy.updateMatrix()
      lotMesh.setMatrixAt(index, dummy.matrix)
    })
    lotMesh.count = plan.lots.length
    lotMesh.instanceMatrix.needsUpdate = true
  }

  /** Positionne immeubles et arbres selon l'avancement de la construction. Renvoie true une fois terminée. */
  function placeBuildings(elapsed: number) {
    let finished = true
    const growth = (delay: number) => {
      const progress = reducedMotion ? 1 : clamp01((elapsed - delay) / BUILD_DURATION)
      if (progress < 1) finished = false
      return Math.max(0.0001, easeOutCubic(progress))
    }

    plan.blocks.forEach((block, index) => {
      const grown = growth(block.delay)
      dummy.position.set(block.x, SIDEWALK + block.base * grown, block.z)
      dummy.scale.set(block.width, block.height * grown, block.depth)
      dummy.updateMatrix()
      blockMesh.setMatrixAt(index, dummy.matrix)
    })
    blockMesh.count = plan.blocks.length
    blockMesh.instanceMatrix.needsUpdate = true

    plan.trees.forEach((tree, index) => {
      const grown = growth(tree.delay)
      dummy.position.set(tree.x, SIDEWALK, tree.z)
      dummy.scale.setScalar(tree.size * grown)
      dummy.updateMatrix()
      treeMesh.setMatrixAt(index, dummy.matrix)
    })
    treeMesh.count = plan.trees.length
    treeMesh.instanceMatrix.needsUpdate = true
    return finished
  }

  /** Fait circuler le bus sur le boulevard carré qui entoure la ville. */
  function placeBus() {
    const side = LOOP * 2
    const distance = ((busDistance % (side * 4)) + side * 4) % (side * 4)
    const edge = Math.floor(distance / side)
    const along = distance - edge * side - LOOP
    if (edge === 0) { bus.position.set(along, 0, -LOOP); bus.rotation.y = 0 }
    else if (edge === 1) { bus.position.set(LOOP, 0, along); bus.rotation.y = -Math.PI / 2 }
    else if (edge === 2) { bus.position.set(-along, 0, LOOP); bus.rotation.y = Math.PI }
    else { bus.position.set(-LOOP, 0, -along); bus.rotation.y = Math.PI / 2 }
  }

  function resize() {
    const { clientWidth: width, clientHeight: height } = canvas
    if (width === 0 || height === 0) return
    renderer.setSize(width, height, false)
    const aspect = width / height
    // Sur un écran étroit, on dézoome pour que la ville tienne en largeur.
    const viewHeight = Math.max(12.5, 16.5 / aspect)
    camera.left = (-viewHeight * aspect) / 2
    camera.right = (viewHeight * aspect) / 2
    camera.top = viewHeight / 2
    camera.bottom = -viewHeight / 2
    camera.updateProjectionMatrix()
    dirty = true
  }

  function tick() {
    frame = requestAnimationFrame(tick)
    const now = performance.now() / 1000
    const delta = Math.min(0.05, now - lastTime)
    lastTime = now

    if (building) {
      building = !placeBuildings(now - buildStart)
      dirty = true
    }
    if (!dragging && Math.abs(spinVelocity) > 0.0001) {
      city.rotation.y += spinVelocity
      spinVelocity *= 0.92
      dirty = true
    }
    if (!reducedMotion) {
      if (!dragging) city.rotation.y += delta * SPIN_SPEED
      busDistance += delta * BUS_SPEED
      placeBus()
      dirty = true
    }
    if (!dirty) return
    dirty = false
    renderer.render(scene, camera)
  }

  // --- Interaction : glisser horizontalement pour faire pivoter la ville -------
  const onPointerDown = (event: PointerEvent) => {
    dragging = true
    lastPointerX = event.clientX
    spinVelocity = 0
    canvas.setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event: PointerEvent) => {
    if (!dragging) return
    const turn = (event.clientX - lastPointerX) * 0.008
    lastPointerX = event.clientX
    city.rotation.y += turn
    spinVelocity = turn
    dirty = true
  }
  const onPointerUp = () => { dragging = false }

  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerUp)

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  const themeObserver = new MutationObserver(applyColors)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  placeLots()
  placeBuildings(0)
  placeBus()
  applyColors()
  resize()
  frame = requestAnimationFrame(tick)

  return {
    rebuild() {
      plan = planCity(Math.floor(Math.random() * 1e9))
      buildStart = performance.now() / 1000
      building = true
      placeLots()
      applyColors()
    },
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
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      for (const mesh of [lotMesh, blockMesh, treeMesh]) mesh.dispose()
      for (const geometry of [unitBox, cone, ground.geometry, busBody.geometry, busWindows.geometry]) geometry.dispose()
      for (const material of [groundMaterial, instanceMaterial, treeMaterial, busMaterial, glassMaterial]) material.dispose()
      renderer.dispose()
    },
  }
}
