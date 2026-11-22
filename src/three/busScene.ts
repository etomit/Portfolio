import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CircleGeometry,
  CylinderGeometry,
  DoubleSide,
  EdgesGeometry,
  ExtrudeGeometry,
  Group,
  LatheGeometry,
  LinearFilter,
  LineBasicMaterial,
  LineDashedMaterial,
  LineSegments,
  Material,
  Mesh,
  MeshBasicMaterial,
  Path,
  PerspectiveCamera,
  Scene,
  Shape,
  ShapeGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'

export interface BusSceneOptions {
  /** Libellés des cotes, déjà formatés et traduits par l'appelant, ex. '12 000 mm'. */
  labels: { length: string; width: string; height: string }
}

export interface BusScene {
  /** Vue éclatée (true) ou assemblée (false), avec une transition animée. */
  setExploded(exploded: boolean): void
  /** Met le rendu en pause quand la scène n'est pas à l'écran. */
  setRunning(running: boolean): void
  dispose(): void
}

type V2 = [number, number]
type P3 = [number, number, number]
type Ring = V2[]
/** Projette un point d'un plan de dessin (u, v) dans le repère du bus. */
type Mapper = (u: number, v: number) => P3

// --- Gabarit : bus urbain standard de 12 m (1 unité = 1 m) -----------------------
// Repère du bus : avant vers +X, côté portes (droit) vers +Z, sol à y = 0.
const HALF_L = 6
const WIDTH = 2.55
const HALF_W = WIDTH / 2
const HEIGHT = 3.05
const FLOOR_Y = 0.32 // bas de caisse
const ROOF_Y = 2.8 // dessus du pavillon, hors climatisation
const ROOF_CUT_Y = 2.6 // jonction flancs / pavillon
const FRONT_CUT_X = 5.6 // jonction flancs / face avant
const REAR_CUT_X = -5.6 // jonction flancs / face arrière
const SHELL = 0.04 // épaisseur des flancs
const WHEEL_R = 0.48
const ARCH_R = 0.6
const FRONT_AXLE = 3.2
const REAR_AXLE = -2.65
const ARCH_BETA = Math.asin((WHEEL_R - FLOOR_Y) / ARCH_R)
const ARCH_HALF = ARCH_R * Math.cos(ARCH_BETA) // demi-largeur d'un passage de roue au bas de caisse
const WINDOW_Y0 = 1.3
const WINDOW_Y1 = 2.42
const DOOR_TOP = 2.45
const SCREEN_Y0 = 1.0 // bas du pare-brise
const SCREEN_Y1 = 2.55 // haut de la face avant, sous l'arrondi du pavillon
const SCREEN_LEAN = 0.15 // recul du haut du pare-brise
const AC_X0 = -4.9
const AC_X1 = -1.9
const STEP = 0.3 // pas du maillage fin

const RIGHT_DOORS: V2[] = [[-4.58, -3.38], [-0.36, 0.94], [4.04, 5.3]]
const RIGHT_PANES: V2[] = [[-5.45, -4.7], [-3.26, -2.06], [-1.94, -0.48], [1.06, 2.36], [2.48, 3.92]]
const LEFT_PANES: V2[] = [
  ...Array.from({ length: 7 }, (_, index): V2 => {
    const width = (9.77 - 6 * 0.12) / 7
    const start = -5.45 + index * (width + 0.12)
    return [start, start + width]
  }),
  [4.44, 5.42], // vitre du poste de conduite
]

// --- Mise en scène ----------------------------------------------------------------
const FOV = 24
const ELEVATION = 0.46 // la caméra regarde le bus d'un peu au-dessus
const FIT_MARGIN = 0.96
const PIVOT_Y = 1.5 // hauteur autour de laquelle le bus s'incline
const START_ANGLE = -0.7 // vue 3/4 avant, côté portes
const SPIN_SPEED = 0.11
const BUILD_TIME = 1.2
const TRACE_SPAN = 0.45 // part de la séquence d'arrivée consacrée au tracé d'une pièce
const EXPLODE_TIME = 0.8
const LABEL_FONT = "'Geist Mono Variable', ui-monospace, monospace"

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const near = (a: number, b: number) => Math.abs(a - b) < 1e-6
const clamp = (value: number, min: number, max: number) => (min > max ? (min + max) / 2 : Math.min(max, Math.max(min, value)))

/** Angle de texte qui suit une ligne sans jamais passer la tête en bas, avec une hystérésis autour de la verticale. */
function uprightAngle(raw: number, previous: number) {
  let best = raw
  let bestScore = Infinity
  for (const candidate of [raw - Math.PI, raw, raw + Math.PI]) {
    if (Math.abs(candidate) > Math.PI / 2 + 0.35) continue
    const score = Math.abs(candidate - previous)
    if (score < bestScore) {
      best = candidate
      bestScore = score
    }
  }
  return best
}

// --- Géométrie 2D -----------------------------------------------------------------

/** Échantillonne un arc de cercle, extrémités comprises. */
function arc(cx: number, cy: number, radius: number, from: number, to: number, steps: number): Ring {
  return Array.from({ length: steps + 1 }, (_, index): V2 => {
    const angle = from + ((to - from) * index) / steps
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]
  })
}

function circle(cx: number, cy: number, radius: number, steps: number): Ring {
  return arc(cx, cy, radius, 0, Math.PI * 2, steps).slice(0, steps)
}

function rect(u0: number, v0: number, u1: number, v1: number): Ring {
  return [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]
}

function roundedRect(u0: number, v0: number, u1: number, v1: number, radius: number, steps = 5): Ring {
  return [
    ...arc(u1 - radius, v0 + radius, radius, -Math.PI / 2, 0, steps),
    ...arc(u1 - radius, v1 - radius, radius, 0, Math.PI / 2, steps),
    ...arc(u0 + radius, v1 - radius, radius, Math.PI / 2, Math.PI, steps),
    ...arc(u0 + radius, v0 + radius, radius, Math.PI, Math.PI * 1.5, steps),
  ]
}

/** Supprime les sommets confondus (raccords d'arcs), qui produiraient des faces dégénérées. */
function dedupe(ring: Ring): Ring {
  const out: Ring = []
  for (const point of ring) {
    const last = out[out.length - 1]
    if (!last || Math.hypot(point[0] - last[0], point[1] - last[1]) > 1e-6) out.push(point)
  }
  const first = out[0]
  const last = out[out.length - 1]
  if (out.length > 1 && Math.hypot(first[0] - last[0], first[1] - last[1]) < 1e-6) out.pop()
  return out
}

/** Intervalles [x0, x1] restants une fois retirés les morceaux `cuts`. */
function spansWithout(start: number, end: number, cuts: V2[]): V2[] {
  const spans: V2[] = []
  let cursor = start
  for (const [from, to] of [...cuts].sort((p, q) => p[0] - q[0])) {
    if (from > cursor) spans.push([cursor, from])
    cursor = Math.max(cursor, to)
  }
  if (end > cursor) spans.push([cursor, end])
  return spans
}

function toShape(outer: Ring, holes: Ring[] = []): Shape {
  const shape = new Shape(outer.map(([u, v]) => new Vector2(u, v)))
  for (const hole of holes) shape.holes.push(new Path(hole.map(([u, v]) => new Vector2(u, v))))
  return shape
}

// --- Traits ------------------------------------------------------------------------

function segment(out: number[], a: P3, b: P3) {
  out.push(a[0], a[1], a[2], b[0], b[1], b[2])
}

function polyline(out: number[], points: P3[], closed = false) {
  const count = closed ? points.length : points.length - 1
  for (let index = 0; index < count; index++) segment(out, points[index], points[(index + 1) % points.length])
}

function outline(out: number[], ring: Ring, map: Mapper) {
  polyline(out, ring.map(([u, v]) => map(u, v)), true)
}

/** Abscisses où la droite (axe = valeur) entre et sort des anneaux, règle pair-impair (les trous sont exclus). */
function scan(rings: Ring[], axis: 0 | 1, value: number): number[] {
  const other = axis === 0 ? 1 : 0
  const hits: number[] = []
  for (const ring of rings) {
    for (let index = 0; index < ring.length; index++) {
      const a = ring[index]
      const b = ring[(index + 1) % ring.length]
      if (a[axis] <= value !== b[axis] <= value) {
        const t = (value - a[axis]) / (b[axis] - a[axis])
        hits.push(a[other] + t * (b[other] - a[other]))
      }
    }
  }
  return hits.sort((p, q) => p - q)
}

/**
 * Maillage fin d'une face plane : droites à pas régulier selon u et v, découpées par le contour
 * (les trous, les vitres par exemple, restent nus). Le quadrillage est calé sur des multiples du pas
 * pour se raccorder d'une pièce à l'autre.
 */
function planarGrid(out: number[], rings: Ring[], map: Mapper, originU = 0, originV = 0) {
  const origins = [originU, originV]
  for (const axis of [0, 1] as const) {
    let min = Infinity
    let max = -Infinity
    for (const ring of rings) {
      for (const point of ring) {
        min = Math.min(min, point[axis])
        max = Math.max(max, point[axis])
      }
    }
    const origin = origins[axis]
    for (let k = Math.ceil((min - origin) / STEP + 1e-6); origin + k * STEP < max - 1e-6; k++) {
      const value = origin + k * STEP
      const hits = scan(rings, axis, value)
      for (let index = 0; index + 1 < hits.length; index += 2) {
        if (axis === 0) segment(out, map(value, hits[index]), map(value, hits[index + 1]))
        else segment(out, map(hits[index], value), map(hits[index + 1], value))
      }
    }
  }
}

/**
 * Maillage des faces d'un profil extrudé selon Z : chaque côté du profil est une bande plane (z, t),
 * t étant l'abscisse curviligne le long du profil, ce qui dessine aussi les arrondis.
 */
function extrusionGrid(
  out: number[],
  profile: Ring,
  skip: (a: V2, b: V2) => boolean,
  holes: (a: V2, b: V2, length: number) => Ring[] = () => [],
) {
  let travelled = 0
  profile.forEach((a, index) => {
    const b = profile[(index + 1) % profile.length]
    const length = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (length > 1e-6 && !skip(a, b)) {
      const map: Mapper = (z, t) => [a[0] + ((b[0] - a[0]) * t) / length, a[1] + ((b[1] - a[1]) * t) / length, z]
      planarGrid(out, [rect(-HALF_W, 0, HALF_W, length), ...holes(a, b, length)], map, 0, -travelled)
    }
    travelled += length
  })
}

/** Deux traits obliques en haut d'une vitre : la convention des plans pour figurer le verre. */
function glints(out: number[], u0: number, v0: number, u1: number, v1: number, map: Mapper) {
  const size = Math.min(u1 - u0, v1 - v0)
  const inset = Math.min(0.12, size * 0.14)
  for (const length of [size * 0.26, size * 0.46]) {
    segment(out, map(u0 + inset, v1 - inset - length), map(u0 + inset + length, v1 - inset))
  }
}

const onSegment = (a: V2, b: V2, axis: 0 | 1, value: number) => near(a[axis], value) && near(b[axis], value)

// --- Volumes ------------------------------------------------------------------------

function box(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): BufferGeometry {
  const [ax, bx] = [Math.min(x0, x1), Math.max(x0, x1)]
  const [ay, by] = [Math.min(y0, y1), Math.max(y0, y1)]
  const [az, bz] = [Math.min(z0, z1), Math.max(z0, z1)]
  return new BoxGeometry(bx - ax, by - ay, bz - az).translate((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2)
}

/** Profil (x, y) extrudé entre z0 et z1. */
function extrudeZ(ring: Ring, z0: number, z1: number, holes: Ring[] = []): BufferGeometry {
  const geometry = new ExtrudeGeometry(toShape(ring, holes), { depth: z1 - z0, bevelEnabled: false, steps: 1 })
  return geometry.translate(0, 0, z0)
}

/** Section (z, y) extrudée entre x0 et x1. */
function extrudeX(section: Ring, x0: number, x1: number): BufferGeometry {
  // rotateY(π/2) envoie (u, v, w) sur (w, v, -u) : on inverse u pour retrouver z.
  const shape = toShape(section.map(([z, y]): V2 => [-z, y]))
  const geometry = new ExtrudeGeometry(shape, { depth: x1 - x0, bevelEnabled: false, steps: 1 })
  return geometry.rotateY(Math.PI / 2).translate(x0, 0, 0)
}

/** Plaque sans épaisseur (vitre, vantail) dans le plan z. */
function flatPanel(ring: Ring, z: number): BufferGeometry {
  return new ShapeGeometry(toShape(ring)).translate(0, 0, z)
}

/**
 * Une pièce du dessin : remplissages opaques et traits classés par rôle
 * (arêtes vives, détails, accent, maillage fin).
 */
class Sketch {
  readonly edges: number[] = []
  readonly detail: number[] = []
  readonly accent: number[] = []
  readonly soft: number[] = []
  readonly fills: BufferGeometry[] = []

  /** Volume plein : remplissage qui masque les arêtes cachées + arêtes vives. */
  solid(geometry: BufferGeometry, threshold = 25) {
    this.fills.push(geometry)
    const edges = new EdgesGeometry(geometry, threshold)
    const positions = edges.getAttribute('position').array
    for (let index = 0; index < positions.length; index++) this.edges.push(positions[index])
    edges.dispose()
  }
}

// --- Sous-ensembles du bus ----------------------------------------------------------

function buildChassis(): Sketch {
  const sketch = new Sketch()
  const inner = HALF_W - SHELL
  // Plancher bas en trois tronçons, interrompu par les passages de roue.
  const spans: V2[] = [
    [REAR_CUT_X, REAR_AXLE - ARCH_HALF],
    [REAR_AXLE + ARCH_HALF, FRONT_AXLE - ARCH_HALF],
    [FRONT_AXLE + ARCH_HALF, FRONT_CUT_X],
  ]
  for (const [x0, x1] of spans) {
    sketch.solid(box(x0, FLOOR_Y, -inner, x1, FLOOR_Y + 0.06, inner))
    planarGrid(sketch.soft, [rect(x0, -inner, x1, inner)], (x, z) => [x, FLOOR_Y + 0.06, z])
  }
  for (const axle of [FRONT_AXLE, REAR_AXLE]) {
    // Passage de roue : demi-cylindre qui ferme la découpe des flancs au-dessus de la roue.
    const housing = new CylinderGeometry(ARCH_R, ARCH_R, 2 * inner, 28, 1, true, Math.PI / 2 - ARCH_BETA, Math.PI + 2 * ARCH_BETA)
    sketch.solid(housing.rotateX(Math.PI / 2).translate(axle, WHEEL_R, 0))
    sketch.solid(box(axle - 0.05, WHEEL_R - 0.05, -0.95, axle + 0.05, WHEEL_R + 0.05, 0.95)) // essieu
  }
  sketch.solid(box(REAR_AXLE - 0.17, WHEEL_R - 0.15, -0.2, REAR_AXLE + 0.17, WHEEL_R + 0.15, 0.2)) // pont arrière
  return sketch
}

/** Contour d'un flanc : bas de caisse découpé par les passages de roue et, à droite, par les portes. */
function sideOutline(doors: V2[]): Ring {
  const corner = 0.06
  const cuts = [
    ...[REAR_AXLE, FRONT_AXLE].map((axle) => ({
      x: axle - ARCH_HALF,
      points: arc(axle, WHEEL_R, ARCH_R, Math.PI + ARCH_BETA, -ARCH_BETA, 16),
    })),
    ...doors.map(([x0, x1]) => ({
      x: x0,
      points: [
        [x0, FLOOR_Y] as V2,
        ...arc(x0 + corner, DOOR_TOP - corner, corner, Math.PI, Math.PI / 2, 4),
        ...arc(x1 - corner, DOOR_TOP - corner, corner, Math.PI / 2, 0, 4),
        [x1, FLOOR_Y] as V2,
      ],
    })),
  ].sort((p, q) => p.x - q.x)
  return dedupe([
    [REAR_CUT_X, FLOOR_Y],
    ...cuts.flatMap((cut) => cut.points),
    [FRONT_CUT_X, FLOOR_Y],
    [FRONT_CUT_X, ROOF_CUT_Y],
    [REAR_CUT_X, ROOF_CUT_Y],
  ])
}

function buildWall(side: 1 | -1): Sketch {
  const sketch = new Sketch()
  const doors = side === 1 ? RIGHT_DOORS : []
  const panes = side === 1 ? RIGHT_PANES : LEFT_PANES
  const contour = sideOutline(doors)
  const holes = panes.map(([x0, x1]) => roundedRect(x0, WINDOW_Y0, x1, WINDOW_Y1, 0.07))
  const outer = side * HALF_W
  const inner = side * (HALF_W - SHELL)
  sketch.solid(extrudeZ(contour, Math.min(outer, inner), Math.max(outer, inner), holes))
  const onSide: Mapper = (x, y) => [x, y, outer]
  planarGrid(sketch.soft, [contour, ...holes], onSide)
  // Ceinture sous les vitres et jonc de bas de caisse, interrompus par les portes et les passages de roue.
  for (const [x0, x1] of spansWithout(REAR_CUT_X, FRONT_CUT_X, doors)) segment(sketch.detail, onSide(x0, 1.18), onSide(x1, 1.18))
  const arches = [REAR_AXLE, FRONT_AXLE].map((axle): V2 => [axle - 0.59, axle + 0.59])
  for (const [x0, x1] of spansWithout(REAR_CUT_X, FRONT_CUT_X, [...doors, ...arches])) {
    segment(sketch.detail, onSide(x0, 0.66), onSide(x1, 0.66))
  }
  return sketch
}

/** Vitres latérales (et vantaux des portes à droite) : elles s'écartent en vue éclatée. */
function buildGlazing(side: 1 | -1): Sketch {
  const sketch = new Sketch()
  const z = side * (HALF_W - 0.012)
  const onGlass: Mapper = (x, y) => [x, y, z]
  for (const [x0, x1] of side === 1 ? RIGHT_PANES : LEFT_PANES) {
    sketch.solid(flatPanel(roundedRect(x0, WINDOW_Y0, x1, WINDOW_Y1, 0.07), z))
    outline(sketch.detail, roundedRect(x0 + 0.045, WINDOW_Y0 + 0.045, x1 - 0.045, WINDOW_Y1 - 0.045, 0.05), onGlass)
    glints(sketch.detail, x0, WINDOW_Y0, x1, WINDOW_Y1, onGlass)
  }
  if (side === 1) {
    const zDoor = HALF_W - 0.016
    const onDoor: Mapper = (x, y) => [x, y, zDoor]
    for (const [x0, x1] of RIGHT_DOORS) {
      const middle = (x0 + x1) / 2
      const leaves: V2[] = [[x0 + 0.015, middle - 0.008], [middle + 0.008, x1 - 0.015]]
      for (const [a, b] of leaves) {
        sketch.solid(flatPanel(roundedRect(a, FLOOR_Y + 0.03, b, DOOR_TOP - 0.02, 0.05), zDoor))
        outline(sketch.edges, roundedRect(a + 0.07, 0.6, b - 0.07, DOOR_TOP - 0.11, 0.05), onDoor)
        glints(sketch.detail, a + 0.07, 0.6, b - 0.07, DOOR_TOP - 0.11, onDoor)
      }
    }
  }
  return sketch
}

function buildRoof(): Sketch {
  const sketch = new Sketch()
  sketch.solid(box(REAR_CUT_X, ROOF_CUT_Y, -HALF_W, FRONT_CUT_X, ROOF_Y, HALF_W))
  planarGrid(sketch.soft, [rect(REAR_CUT_X, -HALF_W, FRONT_CUT_X, HALF_W)], (x, z) => [x, ROOF_Y, z])
  for (const side of [1, -1]) {
    planarGrid(sketch.soft, [rect(REAR_CUT_X, ROOF_CUT_Y, FRONT_CUT_X, ROOF_Y)], (x, y) => [x, y, side * HALF_W])
  }
  // Trappes de toit.
  for (const x of [1.3, 4.0]) {
    sketch.solid(box(x - 0.4, ROOF_Y, -0.36, x + 0.4, ROOF_Y + 0.05, 0.36))
    outline(sketch.detail, rect(x - 0.32, -0.28, x + 0.32, 0.28), (u, v) => [u, ROOF_Y + 0.05, v])
  }
  return sketch
}

function buildAirConditioning(): Sketch {
  const sketch = new Sketch()
  const shoulder = ROOF_Y + 0.09
  sketch.solid(extrudeX([[-1, ROOF_Y], [1, ROOF_Y], [1, shoulder], [0.8, HEIGHT], [-0.8, HEIGHT], [-1, shoulder]], AC_X0, AC_X1))
  // Nervures sur les pans coupés.
  for (let k = Math.ceil(AC_X0 / STEP + 1e-6); k * STEP < AC_X1 - 1e-6; k++) {
    const x = k * STEP
    for (const side of [1, -1]) {
      segment(sketch.soft, [x, ROOF_Y, side], [x, shoulder, side])
      segment(sketch.soft, [x, shoulder, side], [x, HEIGHT, side * 0.8])
    }
  }
  // Deux ventilateurs sur le dessus.
  const onTop: Mapper = (x, z) => [x, HEIGHT, z]
  for (const cx of [-4.15, -2.65]) {
    outline(sketch.edges, circle(cx, 0, 0.32, 32), onTop)
    outline(sketch.detail, circle(cx, 0, 0.08, 16), onTop)
    for (let k = 0; k < 3; k++) {
      const angle = (k / 3) * Math.PI * 2 + 0.4
      segment(
        sketch.detail,
        onTop(cx + 0.08 * Math.cos(angle), 0.08 * Math.sin(angle)),
        onTop(cx + 0.29 * Math.cos(angle + 0.35), 0.29 * Math.sin(angle + 0.35)),
      )
    }
  }
  return sketch
}

/** Abscisse de la face avant (légèrement inclinée) à la hauteur y. */
const faceX = (y: number) => HALF_L - (SCREEN_LEAN * (y - SCREEN_Y0)) / (SCREEN_Y1 - SCREEN_Y0)
const onScreen: Mapper = (z, y) => [faceX(y), y, z]

function frontProfile(): Ring {
  return dedupe([
    [FRONT_CUT_X, FLOOR_Y],
    ...arc(HALF_L - 0.12, FLOOR_Y + 0.12, 0.12, -Math.PI / 2, 0, 6),
    [HALF_L, SCREEN_Y0],
    ...arc(FRONT_CUT_X, SCREEN_Y1, HALF_L - SCREEN_LEAN - FRONT_CUT_X, 0, Math.PI / 2, 8),
  ])
}

function buildFront(): Sketch {
  const sketch = new Sketch()
  const profile = frontProfile()
  sketch.solid(extrudeZ(profile, -HALF_W, HALF_W))
  for (const side of [1, -1]) planarGrid(sketch.soft, [profile], (x, y) => [x, y, side * HALF_W])

  const windshield = roundedRect(-1.16, 1.07, 1.16, 2.24, 0.1)
  const sign = roundedRect(-0.92, 2.3, 0.92, 2.5, 0.03)
  const screenLength = Math.hypot(SCREEN_LEAN, SCREEN_Y1 - SCREEN_Y0)
  const onFace = (ring: Ring) => ring.map(([z, y]): V2 => [z, ((y - SCREEN_Y0) / (SCREEN_Y1 - SCREEN_Y0)) * screenLength])
  extrusionGrid(
    sketch.soft,
    profile,
    (a, b) => onSegment(a, b, 0, FRONT_CUT_X) || onSegment(a, b, 1, FLOOR_Y),
    (a) => (near(a[0], HALF_L) && near(a[1], SCREEN_Y0) ? [onFace(windshield), onFace(sign)] : []),
  )

  // Arêtes de raccordement des arrondis : sans elles, la silhouette se perdrait dans le fond.
  for (const [x, y] of [[HALF_L, FLOOR_Y + 0.12], [HALF_L - SCREEN_LEAN, SCREEN_Y1]]) {
    segment(sketch.edges, [x, y, -HALF_W], [x, y, HALF_W])
  }

  // Pare-brise, joint, reflets et essuie-glaces au repos.
  outline(sketch.edges, windshield, onScreen)
  outline(sketch.detail, roundedRect(-1.11, 1.12, 1.11, 2.19, 0.07), onScreen)
  glints(sketch.detail, -1.16, 1.07, 1.16, 2.24, onScreen)
  segment(sketch.detail, onScreen(-0.98, 1.12), onScreen(-0.18, 1.15))
  segment(sketch.detail, onScreen(0.06, 1.12), onScreen(0.86, 1.15))
  // Girouette (afficheur de ligne) au-dessus du pare-brise.
  outline(sketch.edges, sign, onScreen)
  outline(sketch.accent, roundedRect(-0.86, 2.34, 0.86, 2.46, 0.02), onScreen)

  // Phares et bouclier.
  const onNose: Mapper = (z, y) => [HALF_L, y, z]
  for (const side of [1, -1]) {
    outline(sketch.edges, roundedRect(0.7, 0.6, 1.12, 0.8, 0.06).map(([z, y]): V2 => [side * z, y]), onNose)
    for (const z of [0.81, 1.01]) outline(sketch.detail, circle(side * z, 0.7, 0.055, 14), onNose)
  }
  segment(sketch.detail, onNose(-HALF_W, 0.5), onNose(HALF_W, 0.5))

  // Rétroviseurs « cornes de bélier » qui retombent devant le pare-brise.
  for (const side of [1, -1]) {
    const p0: P3 = [5.72, 2.62, side * 1.18]
    const p1: P3 = [6.26, 2.74, side * 1.43]
    const p2: P3 = [6.24, 2.42, side * 1.43]
    const arm = Array.from({ length: 11 }, (_, index): P3 => {
      const t = index / 10
      const u = 1 - t
      return [0, 1, 2].map((axis) => u * u * p0[axis] + 2 * u * t * p1[axis] + t * t * p2[axis]) as P3
    })
    polyline(sketch.edges, arm)
    sketch.solid(box(6.205, 1.99, side * 1.32, 6.275, 2.41, side * 1.54))
  }
  return sketch
}

function rearProfile(): Ring {
  return dedupe([
    [REAR_CUT_X, ROOF_Y],
    ...arc(-HALF_L + 0.3, ROOF_Y - 0.3, 0.3, Math.PI / 2, Math.PI, 8),
    ...arc(-HALF_L + 0.1, FLOOR_Y + 0.1, 0.1, Math.PI, Math.PI * 1.5, 6),
    [REAR_CUT_X, FLOOR_Y],
  ])
}

function buildRear(): Sketch {
  const sketch = new Sketch()
  const profile = rearProfile()
  sketch.solid(extrudeZ(profile, -HALF_W, HALF_W))
  for (const side of [1, -1]) planarGrid(sketch.soft, [profile], (x, y) => [x, y, side * HALF_W])

  const onTail: Mapper = (z, y) => [-HALF_L, y, z]
  const backlight = roundedRect(-0.98, 1.72, 0.98, 2.36, 0.08)
  extrusionGrid(
    sketch.soft,
    profile,
    (a, b) => onSegment(a, b, 0, REAR_CUT_X) || onSegment(a, b, 1, FLOOR_Y),
    (a, b) => (onSegment(a, b, 0, -HALF_L) ? [backlight.map(([z, y]): V2 => [z, Math.abs(y - a[1])])] : []),
  )
  // Arêtes de raccordement des arrondis.
  for (const [x, y] of [[-HALF_L, ROOF_Y - 0.3], [-HALF_L + 0.3, ROOF_Y], [-HALF_L, FLOOR_Y + 0.1]]) {
    segment(sketch.edges, [x, y, -HALF_W], [x, y, HALF_W])
  }
  // Lunette arrière.
  outline(sketch.edges, backlight, onTail)
  outline(sketch.detail, roundedRect(-0.93, 1.77, 0.93, 2.31, 0.06), onTail)
  glints(sketch.detail, -0.98, 1.72, 0.98, 2.36, onTail)
  // Feux, grille du compartiment moteur, bouclier.
  for (const side of [1, -1]) {
    outline(sketch.edges, roundedRect(0.92, 0.62, 1.16, 1.5, 0.05).map(([z, y]): V2 => [side * z, y]), onTail)
    for (const y of [0.9, 1.2]) segment(sketch.detail, onTail(side * 0.92, y), onTail(side * 1.16, y))
  }
  for (let k = 0; k < 6; k++) segment(sketch.detail, onTail(-0.62, 0.68 + k * 0.075), onTail(0.62, 0.68 + k * 0.075))
  segment(sketch.detail, onTail(-HALF_W, 0.5), onTail(HALF_W, 0.5))
  return sketch
}

// Demi-section d'un pneu (rayon, position sur l'axe), flancs et épaulements arrondis.
const TIRE_PROFILE: Ring = dedupe([
  [0.3, -0.15],
  ...arc(0.41, -0.08, 0.07, -Math.PI / 2, 0, 5),
  ...arc(0.41, 0.08, 0.07, 0, Math.PI / 2, 5),
  [0.3, 0.15],
])
const TIRE_SEGMENTS = 36

function addTire(sketch: Sketch, cx: number, cz: number, side: 1 | -1, rim: boolean) {
  // Le tour est généré autour de Y puis couché selon Z ; les sommets tombent aux angles -π/2 + k·2π/36.
  const tire = new LatheGeometry(TIRE_PROFILE.map(([r, h]) => new Vector2(r, h)), TIRE_SEGMENTS).rotateX(Math.PI / 2)
  if (side < 0) tire.scale(1, 1, -1)
  sketch.fills.push(tire.translate(cx, WHEEL_R, cz))
  // Disques qui ferment l'alésage : on ne voit pas au travers de la roue.
  for (const h of [0.1, -0.1]) sketch.fills.push(new CircleGeometry(0.3, TIRE_SEGMENTS).translate(cx, WHEEL_R, cz + side * h))

  const at = (r: number, angle: number, h: number): P3 => [cx + r * Math.cos(angle), WHEEL_R + r * Math.sin(angle), cz + side * h]
  const angles = Array.from({ length: TIRE_SEGMENTS }, (_, k) => -Math.PI / 2 + (k / TIRE_SEGMENTS) * Math.PI * 2)
  const ring = (out: number[], r: number, h: number) => polyline(out, angles.map((angle) => at(r, angle, h)), true)

  ring(sketch.edges, 0.48, 0.08) // arêtes de la bande de roulement
  ring(sketch.edges, 0.48, -0.08)
  ring(sketch.edges, 0.3, 0.15) // talons
  ring(sketch.edges, 0.3, -0.15)
  ring(sketch.soft, 0.37, 0.15) // flanc
  const [shoulderR, shoulderH] = TIRE_PROFILE[TIRE_PROFILE.length - 4]
  ring(sketch.soft, shoulderR, shoulderH)
  for (const angle of angles) segment(sketch.soft, at(0.48, angle, -0.08), at(0.48, angle, 0.08)) // sculptures

  if (rim) {
    ring(sketch.detail, 0.27, 0.1) // rebord de jante
    ring(sketch.edges, 0.2, 0.1) // voile
    ring(sketch.edges, 0.085, 0.1) // moyeu
    for (let k = 0; k < 6; k++) {
      const angle = (k / 6) * Math.PI * 2 + 0.26
      segment(sketch.edges, at(0.085, angle, 0.1), at(0.27, angle, 0.1)) // rayons
    }
  }
}

function buildWheel(axle: number, side: 1 | -1): Sketch {
  const sketch = new Sketch()
  const outer = side * (HALF_W - SHELL - 0.15)
  addTire(sketch, axle, outer, side, true)
  if (axle < 0) addTire(sketch, axle, outer - side * 0.31, side, false) // roues jumelées à l'arrière
  return sketch
}

/** Réordonne les segments selon une clé : le tracé d'arrivée suit alors un balayage régulier. */
function sortSegments(positions: number[], key: (x: number, y: number, z: number) => number): Float32Array {
  const count = positions.length / 6
  const keys = new Float32Array(count)
  for (let index = 0; index < count; index++) {
    const o = index * 6
    keys[index] = key((positions[o] + positions[o + 3]) / 2, (positions[o + 1] + positions[o + 4]) / 2, (positions[o + 2] + positions[o + 5]) / 2)
  }
  const order = Array.from({ length: count }, (_, index) => index).sort((a, b) => keys[a] - keys[b])
  const sorted = new Float32Array(positions.length)
  order.forEach((source, target) => {
    for (let k = 0; k < 6; k++) sorted[target * 6 + k] = positions[source * 6 + k]
  })
  return sorted
}

// --- Cadrage --------------------------------------------------------------------------

interface Framing { distance: number; target: number }

/**
 * Distance de caméra pour qu'un cylindre (le bus en rotation, cotes comprises) tienne dans le champ,
 * puis recentrage vertical sur un cylindre plus étroit, plus proche de l'encombrement réel du bus à l'écran.
 */
function frame(radius: number, yMin: number, yMax: number, aspect: number, core = 3): Framing {
  const tanV = Math.tan((FOV * Math.PI) / 360) * FIT_MARGIN
  const tanH = tanV * aspect
  const sin = Math.sin(ELEVATION)
  const cos = Math.cos(ELEVATION)
  const ring = (r: number) => {
    const points: P3[] = []
    for (let index = 0; index < 32; index++) {
      const angle = (index / 32) * Math.PI * 2
      for (const y of [yMin, yMax]) points.push([Math.cos(angle) * r, y, Math.sin(angle) * r])
    }
    return points
  }
  const samples = ring(radius)
  const centering = ring(core)
  let target = (yMin + yMax) / 2
  const fit = () => {
    let needed = 0
    for (const [x, y, z] of samples) {
      const up = (y - target) * cos - z * sin
      const toward = (y - target) * sin + z * cos
      needed = Math.max(needed, toward + Math.abs(x) / tanH, toward + Math.abs(up) / tanV)
    }
    return needed
  }
  let distance = fit()
  for (let pass = 0; pass < 4; pass++) {
    let low = Infinity
    let high = -Infinity
    for (const [, y, z] of centering) {
      const up = (y - target) * cos - z * sin
      const toward = (y - target) * sin + z * cos
      const ndc = up / ((distance - toward) * tanV)
      low = Math.min(low, ndc)
      high = Math.max(high, ndc)
    }
    target += (((high + low) / 2) * distance * tanV) / cos
    distance = fit()
  }
  return { distance, target }
}

// --- Scène -------------------------------------------------------------------------------

interface PartConfig {
  /** Déplacement de la pièce en vue éclatée. */
  offset: P3
  /** Retard (0 à 0,2) de la pièce dans l'éclatement : les sous-ensembles ne partent pas tous ensemble. */
  delay: number
  /** Instant (0 à 1) où la pièce commence à se tracer pendant l'arrivée. */
  start: number
  /** Points reliés à leur position d'origine par un trait d'axe en vue éclatée. */
  anchors?: P3[]
  /** Ordre de tracé des segments. */
  key?: (x: number, y: number, z: number) => number
}

interface Part { group: Group; offset: Vector3; delay: number }
interface Trace { object: Mesh | LineSegments; start: number; span: number; vertices: number }

interface Label {
  text: string
  sprite: Sprite
  material: SpriteMaterial
  texture: CanvasTexture | null
  widthPx: number
  heightPx: number
  /** Texte couché le long d'une ligne de cote presque verticale. */
  steep: boolean
}

interface Dimension {
  lines: LineSegments
  material: LineBasicMaterial
  label: Label
  /** Extrémités de la ligne de cote, dans le repère du bus. */
  start: Vector3
  end: Vector3
  /** Opacité selon la direction de la caméra (repère du bus) : une cote ne s'affiche que du côté visible. */
  visibility: (view: Vector3) => number
}

export function createBusScene(canvas: HTMLCanvasElement, options: BusSceneOptions): BusScene {
  // Lève une exception si WebGL est indisponible : l'appelant affiche alors son dessin de secours.
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const scene = new Scene()
  const camera = new PerspectiveCamera(FOV, 1, 0.5, 120)

  // pivot (inclinaison vers la souris) → spin (rotation verticale) → bus (pièces dans le repère du bus)
  const pivot = new Group()
  pivot.position.y = PIVOT_Y
  const spin = new Group()
  const bus = new Group()
  bus.position.y = -PIVOT_Y
  scene.add(pivot)
  pivot.add(spin)
  spin.add(bus)

  // --- Matériaux : les couleurs viennent des variables CSS du thème ---------------------
  const fillMaterial = new MeshBasicMaterial({
    side: DoubleSide,
    // Repousse légèrement les remplissages pour que les traits posés dessus ne scintillent pas.
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  })
  const lineMaterial = new LineBasicMaterial()
  const detailMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.62, depthWrite: false })
  const softMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.4, depthWrite: false })
  const accentMaterial = new LineBasicMaterial()
  const axisMaterial = new LineDashedMaterial({ dashSize: 0.12, gapSize: 0.09, transparent: true, opacity: 0, depthWrite: false })
  const colors = { line: '', soft: '', fill: '', accent: '' }

  // --- Pièces ------------------------------------------------------------------------------
  const parts: Part[] = []
  const traces: Trace[] = []
  const anchors: Array<{ part: Part; point: Vector3 }> = []
  const sweep = (x: number, y: number) => x + y * 0.3

  function addPart(sketch: Sketch, config: PartConfig) {
    const group = new Group()
    for (const geometry of sketch.fills) {
      const mesh = new Mesh(geometry, fillMaterial)
      group.add(mesh)
      // Le remplissage arrive aux deux tiers du tracé : on voit d'abord les traits, puis la pièce devient opaque.
      traces.push({ object: mesh, start: config.start + TRACE_SPAN * 0.65, span: 0, vertices: 0 })
    }
    const layers: Array<[number[], Material, number]> = [
      [sketch.edges, lineMaterial, 0],
      [sketch.accent, accentMaterial, 0.1],
      [sketch.detail, detailMaterial, 0.12],
      [sketch.soft, softMaterial, 0.16],
    ]
    for (const [positions, material, lag] of layers) {
      if (positions.length === 0) continue
      const geometry = new BufferGeometry()
      geometry.setAttribute('position', new BufferAttribute(sortSegments(positions, config.key ?? sweep), 3))
      const lines = new LineSegments(geometry, material)
      group.add(lines)
      traces.push({ object: lines, start: config.start + lag, span: TRACE_SPAN, vertices: positions.length / 3 })
    }
    bus.add(group)
    const part: Part = { group, offset: new Vector3(...config.offset), delay: config.delay }
    parts.push(part)
    for (const point of config.anchors ?? []) anchors.push({ part, point: new Vector3(...point) })
  }

  addPart(buildChassis(), {
    offset: [0, -0.85, 0],
    delay: 0.06,
    start: 0,
    anchors: [[REAR_CUT_X + 0.4, FLOOR_Y, HALF_W - SHELL], [FRONT_CUT_X - 0.4, FLOOR_Y, HALF_W - SHELL]],
  })
  for (const side of [1, -1] as const) {
    addPart(buildWall(side), { offset: [0, 0, 0], delay: 0, start: side === 1 ? 0.06 : 0.1 })
  }
  addPart(buildRear(), {
    offset: [-1.3, 0, 0],
    delay: 0.04,
    start: 0.16,
    key: (_x, y) => y,
    anchors: [[REAR_CUT_X, 1.4, HALF_W], [REAR_CUT_X, 1.4, -HALF_W]],
  })
  addPart(buildFront(), {
    offset: [1.3, 0, 0],
    delay: 0.04,
    start: 0.22,
    key: (_x, y) => y,
    anchors: [[FRONT_CUT_X, 1.4, HALF_W], [FRONT_CUT_X, 1.4, -HALF_W]],
  })
  let wheelIndex = 0
  for (const axle of [REAR_AXLE, FRONT_AXLE]) {
    for (const side of [1, -1] as const) {
      addPart(buildWheel(axle, side), {
        offset: [0, -0.5, side * 1.5],
        delay: 0.14,
        start: 0.2 + 0.03 * wheelIndex++,
        key: (x, y) => Math.atan2(y - WHEEL_R, x - axle),
        anchors: [[axle, WHEEL_R, side * (HALF_W - SHELL - 0.05)]],
      })
    }
  }
  addPart(buildRoof(), {
    offset: [0, 1.25, 0],
    delay: 0.02,
    start: 0.3,
    anchors: [-HALF_W, HALF_W].flatMap((z): P3[] => [[REAR_CUT_X + 0.3, ROOF_CUT_Y, z], [FRONT_CUT_X - 0.3, ROOF_CUT_Y, z]]),
  })
  for (const side of [1, -1] as const) {
    addPart(buildGlazing(side), {
      offset: [0, 0, side * 1.35],
      delay: 0.1,
      start: side === 1 ? 0.36 : 0.4,
      anchors: [[-4.0, 1.86, side * HALF_W], [3.0, 1.86, side * HALF_W]],
    })
  }
  addPart(buildAirConditioning(), {
    offset: [0, 1.85, 0],
    delay: 0.12,
    start: 0.45,
    anchors: [[(AC_X0 + AC_X1) / 2, ROOF_Y, 0]],
  })

  // Traits d'axe pointillés de la vue éclatée : de la position d'origine à la position courante.
  const axisPositions = new Float32Array(anchors.length * 6)
  const axisDistances = new Float32Array(anchors.length * 2)
  const axisGeometry = new BufferGeometry()
  axisGeometry.setAttribute('position', new BufferAttribute(axisPositions, 3))
  axisGeometry.setAttribute('lineDistance', new BufferAttribute(axisDistances, 1))
  const axes = new LineSegments(axisGeometry, axisMaterial)
  axes.frustumCulled = false
  axes.visible = false
  bus.add(axes)

  // --- Cotes --------------------------------------------------------------------------------
  const dimensions: Dimension[] = []
  const labelCanvas = document.createElement('canvas')
  const labelContext = labelCanvas.getContext('2d')

  function createLabel(text: string, position: Vector3): Label {
    const material = new SpriteMaterial({ transparent: true, depthTest: false, depthWrite: false, sizeAttenuation: false, opacity: 0 })
    const sprite = new Sprite(material)
    sprite.position.copy(position)
    sprite.renderOrder = 10
    sprite.visible = false
    bus.add(sprite)
    return { text, sprite, material, texture: null, widthPx: 0, heightPx: 0, steep: false }
  }

  let compactLabels = false
  function drawLabel(label: Label) {
    if (!labelContext || !colors.accent) return
    const ratio = renderer.getPixelRatio()
    const fontPx = compactLabels ? 11 : 12
    const font = `500 ${fontPx * ratio}px ${LABEL_FONT}`
    labelContext.font = font
    const width = Math.ceil(labelContext.measureText(label.text).width + 4 * ratio)
    const height = Math.ceil((fontPx + 4) * ratio)
    const paint = document.createElement('canvas')
    paint.width = width
    paint.height = height
    const context = paint.getContext('2d')
    if (!context) return
    context.font = font
    context.fillStyle = colors.accent
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(label.text, width / 2, height / 2 + 0.5 * ratio)
    label.texture?.dispose()
    const texture = new CanvasTexture(paint)
    texture.colorSpace = SRGBColorSpace
    texture.minFilter = LinearFilter
    texture.generateMipmaps = false
    label.texture = texture
    label.material.map = texture
    label.material.needsUpdate = true
    label.widthPx = width / ratio
    label.heightPx = height / ratio
  }
  const drawLabels = () => {
    for (const dimension of dimensions) drawLabel(dimension.label)
    dirty = true
  }

  /** Ligne de cote avec flèches aux deux bouts, lignes d'attache et libellé. */
  function addDimension(
    text: string,
    start: Vector3,
    end: Vector3,
    across: Vector3,
    extensions: Array<[Vector3, Vector3]>,
    visibility: (view: Vector3) => number,
  ) {
    const positions: number[] = []
    const push = (a: Vector3, b: Vector3) => positions.push(a.x, a.y, a.z, b.x, b.y, b.z)
    push(start, end)
    const direction = end.clone().sub(start).normalize()
    for (const [tip, toward] of [[end, direction], [start, direction.clone().negate()]] as const) {
      const base = tip.clone().addScaledVector(toward, -0.22)
      push(tip, base.clone().addScaledVector(across, 0.07))
      push(tip, base.clone().addScaledVector(across, -0.07))
    }
    // Lignes d'attache : un petit jour côté objet, un léger dépassement au-delà de la ligne de cote.
    for (const [from, to] of extensions) {
      const along = to.clone().sub(from).normalize()
      push(from.clone().addScaledVector(along, 0.06), to.clone().addScaledVector(along, 0.14))
    }
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
    const material = new LineBasicMaterial({ transparent: true, depthWrite: false, opacity: 0 })
    const lines = new LineSegments(geometry, material)
    lines.visible = false
    bus.add(lines)
    const label = createLabel(text, start.clone().add(end).multiplyScalar(0.5))
    dimensions.push({ lines, material, label, start, end, visibility })
  }

  const v = (x: number, y: number, z: number) => new Vector3(x, y, z)
  const LENGTH_Y = -0.55
  const HEIGHT_X = -HALF_L - 0.75
  const WIDTH_X = HALF_L + 0.85
  for (const side of [1, -1]) {
    const z = side * HALF_W
    const facing = (view: Vector3) => smoothstep(0.12, 0.4, side * view.z)
    // Longueur, sous le bus, du côté visible.
    addDimension(options.labels.length, v(-HALF_L, LENGTH_Y, z), v(HALF_L, LENGTH_Y, z), v(0, 1, 0), [
      [v(-HALF_L, FLOOR_Y + 0.1, z), v(-HALF_L, LENGTH_Y, z)],
      [v(HALF_L, FLOOR_Y + 0.12, z), v(HALF_L, LENGTH_Y, z)],
    ], facing)
    // Hauteur, à l'arrière, au droit du sommet de la climatisation.
    const zh = side * 0.8
    addDimension(options.labels.height, v(HEIGHT_X, 0, zh), v(HEIGHT_X, HEIGHT, zh), v(1, 0, 0), [
      [v(-HALF_L, 0, zh), v(HEIGHT_X, 0, zh)],
      [v(AC_X0, HEIGHT, zh), v(HEIGHT_X, HEIGHT, zh)],
    ], facing)
  }
  // Largeur, à l'avant, au sol.
  addDimension(options.labels.width, v(WIDTH_X, 0, -HALF_W), v(WIDTH_X, 0, HALF_W), v(1, 0, 0), [
    [v(HALF_L, 0, -HALF_W), v(WIDTH_X, 0, -HALF_W)],
    [v(HALF_L, 0, HALF_W), v(WIDTH_X, 0, HALF_W)],
  ], (view) => smoothstep(0.12, 0.4, view.x))

  // --- État --------------------------------------------------------------------------------
  let running = true
  let disposed = false
  let dirty = true
  let frameId = 0
  let lastTime = performance.now() / 1000
  const buildStart = lastTime
  let building = !reducedMotion
  let buildProgress = reducedMotion ? 2 : 0
  let explodeTarget = 0
  let explodeProgress = 0
  let angle = 0
  let spinVelocity = 0
  let dragging = false
  let lastPointerX = 0
  let yaw = 0
  let yawTarget = 0
  let tilt = 0
  let tiltTarget = 0
  let viewWidth = 1
  let viewHeight = 1
  const framing = { assembled: frame(7.1, -0.85, 3.1, 1), exploded: frame(7.75, -0.65, 4.95, 1) }

  function applyColors() {
    const style = getComputedStyle(document.documentElement)
    const read = (name: string, previous: string) => style.getPropertyValue(name).trim() || previous
    colors.line = read('--3d-line', colors.line)
    colors.soft = read('--3d-line-soft', colors.soft)
    colors.fill = read('--3d-fill', colors.fill)
    colors.accent = read('--3d-accent', colors.accent)
    if (colors.fill) fillMaterial.color.set(colors.fill)
    if (colors.line) {
      lineMaterial.color.set(colors.line)
      detailMaterial.color.set(colors.line)
    }
    if (colors.soft) {
      softMaterial.color.set(colors.soft)
      axisMaterial.color.set(colors.soft)
    }
    if (colors.accent) {
      accentMaterial.color.set(colors.accent)
      for (const dimension of dimensions) dimension.material.color.set(colors.accent)
    }
    drawLabels()
  }

  /** Avancement de la séquence d'arrivée : chaque pièce se trace segment par segment. */
  function updateBuild(progress: number) {
    for (const trace of traces) {
      const local = trace.span === 0 ? (progress >= trace.start ? 1 : 0) : clamp01((progress - trace.start) / trace.span)
      if (trace.object instanceof Mesh) {
        trace.object.visible = local > 0
      } else {
        const segments = Math.ceil((trace.vertices / 2) * local)
        trace.object.geometry.setDrawRange(0, segments * 2)
        trace.object.visible = segments > 0
      }
    }
  }

  function updateParts() {
    for (const part of parts) {
      const local = clamp01((explodeProgress - part.delay) / 0.8)
      part.group.position.copy(part.offset).multiplyScalar(easeInOutCubic(local))
    }
    anchors.forEach(({ part, point }, index) => {
      const offset = part.group.position
      axisPositions.set([point.x, point.y, point.z, point.x + offset.x, point.y + offset.y, point.z + offset.z], index * 6)
      axisDistances[index * 2 + 1] = offset.length()
    })
    axisGeometry.getAttribute('position').needsUpdate = true
    axisGeometry.getAttribute('lineDistance').needsUpdate = true
    const exploded = easeInOutCubic(explodeProgress)
    axisMaterial.opacity = smoothstep(0.05, 0.6, exploded) * 0.9
    axes.visible = exploded > 0.01
  }

  function updateCamera() {
    const amount = easeInOutCubic(explodeProgress)
    const distance = lerp(framing.assembled.distance, framing.exploded.distance, amount)
    const target = lerp(framing.assembled.target, framing.exploded.target, amount)
    camera.position.set(0, target + Math.sin(ELEVATION) * distance, Math.cos(ELEVATION) * distance)
    camera.lookAt(0, target, 0)
  }

  const view = new Vector3()
  const projectedA = new Vector3()
  const projectedB = new Vector3()
  const projectedCenter = new Vector3()

  /**
   * Opacité des cotes et placement des libellés à l'écran : horizontaux et posés à côté de la ligne,
   * couchés le long des lignes presque verticales, toujours entiers dans le canevas.
   */
  function updateDimensions() {
    const fade = (1 - easeInOutCubic(explodeProgress)) * smoothstep(0.72, 1, buildProgress)
    view.copy(camera.position)
    bus.worldToLocal(view)
    view.y = 0
    view.normalize()
    projectedCenter.set(0, 1.4, 0).applyMatrix4(bus.matrixWorld).project(camera)
    const scale = 2 / (camera.projectionMatrix.elements[5] * viewHeight)
    for (const dimension of dimensions) {
      projectedA.copy(dimension.start).applyMatrix4(bus.matrixWorld).project(camera)
      projectedB.copy(dimension.end).applyMatrix4(bus.matrixWorld).project(camera)
      const ax = (projectedA.x * viewWidth) / 2
      const ay = (projectedA.y * viewHeight) / 2
      const dx = (projectedB.x * viewWidth) / 2 - ax
      const dy = (projectedB.y * viewHeight) / 2 - ay
      const length = Math.hypot(dx, dy)
      const opacity = fade * dimension.visibility(view) * smoothstep(24, 56, length)
      dimension.material.opacity = opacity
      dimension.lines.visible = opacity > 0.01
      const { label } = dimension
      label.material.opacity = opacity
      label.sprite.visible = opacity > 0.01 && label.texture !== null
      if (!label.sprite.visible || length < 1e-3) continue
      // Normale à la ligne, orientée à l'opposé du bus : le libellé se pose du côté libre.
      let nx = -dy / length
      let ny = dx / length
      const cx = (projectedCenter.x * viewWidth) / 2 - (ax + dx / 2)
      const cy = (projectedCenter.y * viewHeight) / 2 - (ay + dy / 2)
      if (nx * cx + ny * cy > 0) {
        nx = -nx
        ny = -ny
      }
      const steep = Math.abs(dy) > Math.abs(dx) * (label.steep ? 1.4 : 1.9)
      const rotation = steep ? uprightAngle(Math.atan2(dy, dx), label.steep ? label.material.rotation : Math.PI / 2) : 0
      label.steep = steep
      label.material.rotation = rotation
      // Axe du texte à l'écran, puis demi-encombrement du libellé dans la direction de la normale.
      const tx = Math.cos(rotation)
      const ty = Math.sin(rotation)
      const halfW = label.widthPx / 2
      const halfH = label.heightPx / 2
      const reach = Math.abs(nx * tx + ny * ty) * halfW + Math.abs(ny * tx - nx * ty) * halfH + 5
      const mx = ax + dx / 2
      const my = ay + dy / 2
      const boxX = Math.abs(tx) * halfW + Math.abs(ty) * halfH + 4
      const boxY = Math.abs(ty) * halfW + Math.abs(tx) * halfH + 4
      const ox = clamp(mx + nx * reach, -viewWidth / 2 + boxX, viewWidth / 2 - boxX) - mx
      const oy = clamp(my + ny * reach, -viewHeight / 2 + boxY, viewHeight / 2 - boxY) - my
      // Le décalage s'exprime dans le repère (tourné) du sprite.
      label.sprite.center.set(0.5 - (ox * tx + oy * ty) / label.widthPx, 0.5 - (oy * tx - ox * ty) / label.heightPx)
      label.sprite.scale.set(label.widthPx * scale, label.heightPx * scale, 1)
    }
  }

  function resize() {
    const { clientWidth: width, clientHeight: height } = canvas
    if (width === 0 || height === 0) return
    viewWidth = width
    viewHeight = height
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    framing.assembled = frame(7.1, -0.85, 3.1, camera.aspect)
    framing.exploded = frame(7.75, -0.65, 4.95, camera.aspect)
    const compact = width < 520
    if (compact !== compactLabels) {
      compactLabels = compact
      drawLabels()
    }
    dirty = true
  }

  function tick() {
    frameId = requestAnimationFrame(tick)
    const now = performance.now() / 1000
    const delta = Math.min(0.05, now - lastTime)
    lastTime = now

    if (building) {
      buildProgress = (now - buildStart) / BUILD_TIME
      if (buildProgress >= 1.15) {
        building = false
        buildProgress = 2
      }
      updateBuild(buildProgress)
      dirty = true
    }
    if (explodeProgress !== explodeTarget) {
      const step = reducedMotion ? 1 : delta / EXPLODE_TIME
      explodeProgress = explodeTarget > explodeProgress
        ? Math.min(explodeTarget, explodeProgress + step)
        : Math.max(explodeTarget, explodeProgress - step)
      dirty = true
    }
    if (!dragging && Math.abs(spinVelocity) > 0.0001) {
      angle += spinVelocity
      spinVelocity *= 0.92
      dirty = true
    }
    if (!reducedMotion) {
      if (!dragging) angle += delta * SPIN_SPEED
      const ease = 1 - Math.exp(-delta * 3.5)
      yaw += (yawTarget - yaw) * ease
      tilt += (tiltTarget - tilt) * ease
      dirty = true
    }
    if (!dirty) return
    dirty = false

    pivot.rotation.x = tilt
    spin.rotation.y = START_ANGLE + angle + yaw
    updateParts()
    updateCamera()
    scene.updateMatrixWorld()
    updateDimensions()
    renderer.render(scene, camera)
  }

  // --- Interaction ------------------------------------------------------------------------
  // Glisser horizontalement sur le canevas pour faire tourner le bus.
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
    angle += turn
    spinVelocity = reducedMotion ? 0 : turn
    dirty = true
  }
  const onPointerUp = (event: PointerEvent) => {
    dragging = false
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
  }
  // Survol de la page à la souris : le bus se tourne et s'incline légèrement vers le pointeur.
  const onHover = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || reducedMotion || !running) return
    const bounds = canvas.getBoundingClientRect()
    const nx = (event.clientX - (bounds.left + bounds.width / 2)) / (window.innerWidth / 2)
    const ny = (event.clientY - (bounds.top + bounds.height / 2)) / (window.innerHeight / 2)
    yawTarget = Math.max(-1, Math.min(1, nx)) * 0.3
    tiltTarget = Math.max(-1, Math.min(1, ny)) * 0.09
  }
  const onLeave = (event: PointerEvent) => {
    if (event.relatedTarget) return
    yawTarget = 0
    tiltTarget = 0
  }

  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerUp)
  window.addEventListener('pointermove', onHover)
  window.addEventListener('pointerout', onLeave)

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  const themeObserver = new MutationObserver(applyColors)
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  // Les libellés sont redessinés une fois la police à chasse fixe chargée.
  const redrawWhenFontsReady = () => {
    if (!disposed) drawLabels()
  }
  document.fonts?.load(`12px ${LABEL_FONT}`).then(redrawWhenFontsReady, () => undefined)
  document.fonts?.ready.then(redrawWhenFontsReady, () => undefined)

  updateBuild(buildProgress)
  applyColors()
  resize()
  frameId = requestAnimationFrame(tick)

  return {
    setExploded(exploded) {
      explodeTarget = exploded ? 1 : 0
      if (reducedMotion) explodeProgress = explodeTarget
      dirty = true
    },
    setRunning(next) {
      if (next === running || disposed) return
      running = next
      cancelAnimationFrame(frameId)
      if (running) {
        lastTime = performance.now() / 1000
        dirty = true
        frameId = requestAnimationFrame(tick)
      }
    },
    dispose() {
      disposed = true
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('pointermove', onHover)
      window.removeEventListener('pointerout', onLeave)
      const materials = new Set<Material>()
      scene.traverse((object) => {
        if (object instanceof Mesh || object instanceof LineSegments) {
          object.geometry.dispose()
          materials.add(object.material as Material)
        } else if (object instanceof Sprite) {
          materials.add(object.material)
        }
      })
      for (const dimension of dimensions) dimension.label.texture?.dispose()
      for (const material of materials) material.dispose()
      renderer.dispose()
    },
  }
}
