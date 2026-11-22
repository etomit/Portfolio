import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  ConeGeometry,
  DynamicDrawUsage,
  EdgesGeometry,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineDashedMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
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

// Dessin au trait : hauteur d'étage des façades, rayon et nombre de pans des arbres.
const STOREY = 0.24
const TREE_RADIUS = 0.17
const TREE_HEIGHT = 0.5
const TREE_SIDES = 6
const MAX_BLOCKS = GRID * GRID * 2
const MAX_TREES = GRID * GRID * 4
const MAX_STOREYS = 18

/** Style de façade : 'light' n'a que les étages, les autres ajoutent des meneaux verticaux. */
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

/** Tampon de segments réécrit pendant la construction, puis figé. */
class SegmentBuffer {
  readonly array: Float32Array
  readonly geometry = new BufferGeometry()
  private cursor = 0

  constructor(maxSegments: number) {
    this.array = new Float32Array(maxSegments * 6)
    const attribute = new BufferAttribute(this.array, 3)
    attribute.setUsage(DynamicDrawUsage)
    this.geometry.setAttribute('position', attribute)
  }

  reset() {
    this.cursor = 0
  }

  push(ax: number, ay: number, az: number, bx: number, by: number, bz: number) {
    if (this.cursor + 6 > this.array.length) return
    this.array.set([ax, ay, az, bx, by, bz], this.cursor)
    this.cursor += 6
  }

  /** Contour d'un rectangle horizontal à l'altitude y. */
  rectangle(x0: number, z0: number, x1: number, z1: number, y: number) {
    this.push(x0, y, z0, x1, y, z0)
    this.push(x1, y, z0, x1, y, z1)
    this.push(x1, y, z1, x0, y, z1)
    this.push(x0, y, z1, x0, y, z0)
  }

  commit() {
    this.geometry.setDrawRange(0, this.cursor / 3)
    this.geometry.getAttribute('position').needsUpdate = true
    // Indispensable pour que la ville ne disparaisse pas par erreur hors du champ de la caméra.
    this.geometry.computeBoundingSphere()
  }
}

export function createCityScene(canvas: HTMLCanvasElement): CityScene {
  // Lève une exception si WebGL est indisponible : l'appelant affiche alors un message.
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 80)
  camera.position.set(12, 10.5, 12)
  camera.lookAt(0, 0.9, 0)

  const city = new Group()
  city.rotation.y = -0.35
  scene.add(city)

  // --- Matériaux : rendu au trait, couleurs lues dans les variables CSS du thème ---------
  // Remplissage de la couleur du fond : il masque les arêtes cachées, comme sur un plan.
  const fillMaterial = new MeshBasicMaterial({ polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 })
  const lineMaterial = new LineBasicMaterial()
  const softMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.85, depthWrite: false })
  const facadeMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.45, depthWrite: false })
  const accentMaterial = new LineBasicMaterial()
  const routeMaterial = new LineDashedMaterial({ dashSize: 0.16, gapSize: 0.12, transparent: true, opacity: 0.8, depthWrite: false })

  // --- Géométries -----------------------------------------------------------------------
  const unitBox = new BoxGeometry(1, 1, 1).translate(0, 0.5, 0) // pied posé à y = 0
  const cone = new ConeGeometry(TREE_RADIUS, TREE_HEIGHT, TREE_SIDES).translate(0, TREE_HEIGHT / 2, 0)

  const groundSize = SPAN + RING * 2
  const groundGeometry = new BoxGeometry(groundSize, 0.4, groundSize).translate(0, -0.2, 0)
  const ground = new Mesh(groundGeometry, fillMaterial)
  const groundEdges = new LineSegments(new EdgesGeometry(groundGeometry), lineMaterial)

  // Remplissages instanciés (immeubles, arbres) ; leurs arêtes sont recalculées à part.
  const blockMesh = new InstancedMesh(unitBox, fillMaterial, MAX_BLOCKS)
  const treeMesh = new InstancedMesh(cone, fillMaterial, MAX_TREES)

  const blockEdges = new SegmentBuffer(MAX_BLOCKS * 12)
  const facadeLines = new SegmentBuffer(MAX_BLOCKS * (MAX_STOREYS * 4 + 8))
  const treeEdges = new SegmentBuffer(MAX_TREES * TREE_SIDES * 2)
  const groundLines = new SegmentBuffer(GRID * GRID * 16) // trottoirs et hachures des parcs
  const blockLines = new LineSegments(blockEdges.geometry, lineMaterial)
  const facades = new LineSegments(facadeLines.geometry, facadeMaterial)
  const treeLines = new LineSegments(treeEdges.geometry, softMaterial)
  const lotLines = new LineSegments(groundLines.geometry, softMaterial)

  // Boulevard : axe pointillé sur lequel tourne le bus.
  const routeGeometry = new BufferGeometry()
  const corners = [[-LOOP, -LOOP], [LOOP, -LOOP], [LOOP, LOOP], [-LOOP, LOOP]]
  const routePositions: number[] = []
  corners.forEach(([x, z], index) => {
    const [nx, nz] = corners[(index + 1) % corners.length]
    routePositions.push(x, 0.002, z, nx, 0.002, nz)
  })
  routeGeometry.setAttribute('position', new BufferAttribute(new Float32Array(routePositions), 3))
  const route = new LineSegments(routeGeometry, routeMaterial)
  route.computeLineDistances()

  // Le bus de la ville, dessiné en couleur d'accent.
  const bus = new Group()
  const busBodyGeometry = new BoxGeometry(0.95, 0.34, 0.38).translate(0, 0.23, 0)
  const busWindowGeometry = new BoxGeometry(0.82, 0.11, 0.4).translate(0, 0.3, 0)
  bus.add(
    new Mesh(busBodyGeometry, fillMaterial),
    new Mesh(busWindowGeometry, fillMaterial),
    new LineSegments(new EdgesGeometry(busBodyGeometry), accentMaterial),
    new LineSegments(new EdgesGeometry(busWindowGeometry), accentMaterial),
  )

  city.add(ground, groundEdges, route, lotLines, blockMesh, blockLines, facades, treeMesh, treeLines, bus)

  // --- État -------------------------------------------------------------------------------
  const dummy = new Object3D()
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

  function applyColors() {
    const style = getComputedStyle(document.documentElement)
    const read = (name: string) => style.getPropertyValue(name).trim()
    const fill = read('--3d-fill')
    const line = read('--3d-line')
    const soft = read('--3d-line-soft')
    const accent = read('--3d-accent')
    if (fill) fillMaterial.color.set(fill)
    if (line) lineMaterial.color.set(line)
    if (soft) {
      softMaterial.color.set(soft)
      facadeMaterial.color.set(soft)
      routeMaterial.color.set(soft)
    }
    if (accent) accentMaterial.color.set(accent)
    dirty = true
  }

  /** Bordures des parcelles et hachures obliques des parcs (convention des espaces verts). */
  function drawLots() {
    groundLines.reset()
    const half = LOT / 2
    for (const lot of plan.lots) {
      groundLines.rectangle(lot.x - half, lot.z - half, lot.x + half, lot.z + half, SIDEWALK)
      if (!lot.park) continue
      const inset = half - 0.08
      for (let c = -2 * inset + 0.16; c < 2 * inset - 0.04; c += 0.16) {
        // Droite x - z = c, découpée par le carré [-inset, inset]².
        const from = Math.max(-inset, -inset + c)
        const to = Math.min(inset, inset + c)
        groundLines.push(lot.x + from, SIDEWALK, lot.z + from - c, lot.x + to, SIDEWALK, lot.z + to - c)
      }
    }
    groundLines.commit()
  }

  /** Positionne immeubles et arbres selon l'avancement de la construction. Renvoie true une fois terminée. */
  function placeBuildings(elapsed: number) {
    let finished = true
    const growth = (delay: number) => {
      const progress = reducedMotion ? 1 : clamp01((elapsed - delay) / BUILD_DURATION)
      if (progress < 1) finished = false
      return Math.max(0.0001, easeOutCubic(progress))
    }

    blockEdges.reset()
    facadeLines.reset()
    plan.blocks.forEach((block, index) => {
      const grown = growth(block.delay)
      const y0 = SIDEWALK + block.base * grown
      const height = block.height * grown
      dummy.position.set(block.x, y0, block.z)
      dummy.scale.set(block.width, height, block.depth)
      dummy.updateMatrix()
      blockMesh.setMatrixAt(index, dummy.matrix)

      // Arêtes du parallélépipède.
      const y1 = y0 + height
      const x0 = block.x - block.width / 2
      const x1 = block.x + block.width / 2
      const z0 = block.z - block.depth / 2
      const z1 = block.z + block.depth / 2
      blockEdges.rectangle(x0, z0, x1, z1, y0)
      blockEdges.rectangle(x0, z0, x1, z1, y1)
      for (const [x, z] of [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]) blockEdges.push(x, y0, z, x, y1, z)

      // Façades : un trait par étage, et des meneaux pour les immeubles de bureaux.
      for (let storey = 1; storey <= MAX_STOREYS && storey * STOREY < height - 0.06; storey++) {
        facadeLines.rectangle(x0, z0, x1, z1, y0 + storey * STOREY)
      }
      if (block.role !== 'light' && height > 0.2) {
        for (const t of [1 / 3, 2 / 3]) {
          const x = x0 + (x1 - x0) * t
          const z = z0 + (z1 - z0) * t
          facadeLines.push(x, y0, z0, x, y1, z0)
          facadeLines.push(x, y0, z1, x, y1, z1)
          facadeLines.push(x0, y0, z, x0, y1, z)
          facadeLines.push(x1, y0, z, x1, y1, z)
        }
      }
    })
    blockMesh.count = plan.blocks.length
    blockMesh.instanceMatrix.needsUpdate = true
    blockMesh.computeBoundingSphere()
    blockEdges.commit()
    facadeLines.commit()

    treeEdges.reset()
    plan.trees.forEach((tree, index) => {
      const size = tree.size * growth(tree.delay)
      dummy.position.set(tree.x, SIDEWALK, tree.z)
      dummy.scale.setScalar(size)
      dummy.updateMatrix()
      treeMesh.setMatrixAt(index, dummy.matrix)

      // Cône à six pans : arêtes vers la pointe et contour de la base.
      const apexY = SIDEWALK + TREE_HEIGHT * size
      for (let side = 0; side < TREE_SIDES; side++) {
        const a = (side / TREE_SIDES) * Math.PI * 2
        const b = ((side + 1) / TREE_SIDES) * Math.PI * 2
        const ax = tree.x + Math.sin(a) * TREE_RADIUS * size
        const az = tree.z + Math.cos(a) * TREE_RADIUS * size
        treeEdges.push(ax, SIDEWALK, az, tree.x, apexY, tree.z)
        treeEdges.push(ax, SIDEWALK, az, tree.x + Math.sin(b) * TREE_RADIUS * size, SIDEWALK, tree.z + Math.cos(b) * TREE_RADIUS * size)
      }
    })
    treeMesh.count = plan.trees.length
    treeMesh.instanceMatrix.needsUpdate = true
    treeMesh.computeBoundingSphere()
    treeEdges.commit()
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

  // --- Interaction : glisser horizontalement pour faire pivoter la ville -------------------
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

  drawLots()
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
      drawLots()
      dirty = true
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
      for (const mesh of [blockMesh, treeMesh]) mesh.dispose()
      scene.traverse((object) => {
        if (object instanceof Mesh || object instanceof LineSegments) object.geometry.dispose()
      })
      for (const material of [fillMaterial, lineMaterial, softMaterial, facadeMaterial, accentMaterial, routeMaterial]) material.dispose()
      renderer.dispose()
    },
  }
}
