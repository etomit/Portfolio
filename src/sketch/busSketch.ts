/**
 * Dessin technique d'un bus urbain de 12 m, en projection oblique, calculé à partir
 * de coordonnées 3D (en mètres). Le dessin est rangé en quatre calques qui peuvent
 * se tracer l'un après l'autre : le plan au sol, le volume, les détails, le rendu.
 *
 * Repère : x le long du bus (0 = arrière, L = avant), y vers le haut, z en travers
 * (z = W est le flanc droit, côté portes, tourné vers le lecteur).
 */

const L = 12
const W = 2.55
const H = 3.05
const FLOOR = 0.3 // bas de caisse
const REAR_AXLE = 3.0
const FRONT_AXLE = 9.0
const WHEEL_R = 0.48
const SCALE = 46 // pixels par mètre

type Vec3 = [number, number, number]
type Vec2 = [number, number]

// Axes de projection : x presque horizontal (le flanc se lit bien), z en fuite vers le bas à gauche.
const EX: Vec2 = [Math.cos((15 * Math.PI) / 180), Math.sin((15 * Math.PI) / 180)]
const EZ: Vec2 = [-0.62, 0.42]

function project([x, y, z]: Vec3): Vec2 {
  return [(x * EX[0] + z * EZ[0]) * SCALE, (x * EX[1] + z * EZ[1] - y) * SCALE]
}

export type StrokeKind = 'line' | 'thin' | 'hidden' | 'axis' | 'accent'

export interface SketchPath {
  d: string
  kind: StrokeKind
}

export interface SketchFill {
  d: string
  dense?: boolean
}

export interface SketchLabel {
  x: number
  y: number
  angle: number
  key: 'length' | 'width' | 'height'
}

export interface SketchLayer {
  paths: SketchPath[]
  fills: SketchFill[]
  labels: SketchLabel[]
}

export interface BusSketchData {
  viewBox: string
  layers: [SketchLayer, SketchLayer, SketchLayer, SketchLayer]
}

const fmt = (n: number) => Math.round(n * 10) / 10

function polyline(points: Vec3[], closed = false): string {
  const projected = points.map(project)
  return projected.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${fmt(x)} ${fmt(y)}`).join(' ') + (closed ? ' Z' : '')
}

function segment(a: Vec3, b: Vec3): string {
  return polyline([a, b])
}

/** Cercle dans le plan du flanc (z fixe), échantillonné puis projeté : une ellipse à l'écran. */
function circleOnSide(cx: number, cy: number, z: number, r: number, from = 0, to = Math.PI * 2, steps = 40): Vec3[] {
  const points: Vec3[] = []
  for (let i = 0; i <= steps; i++) {
    const a = from + ((to - from) * i) / steps
    points.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r, z])
  }
  return points
}

/** Rectangle dans le plan du flanc droit (z = W). */
function sideRect(x0: number, x1: number, y0: number, y1: number, z = W): Vec3[] {
  return [
    [x0, y0, z],
    [x1, y0, z],
    [x1, y1, z],
    [x0, y1, z],
  ]
}

/** Profil latéral de la caisse (x, y), parcouru de l'arrière bas vers l'avant puis le toit. */
const PROFILE: [number, number][] = [
  [0, FLOOR],
  [L, FLOOR],
  [L, 1.15],
  [L - 0.33, H - 0.12],
  [L - 0.55, H],
  [0.28, H],
  [0, H - 0.28],
]

const at = (z: number) => PROFILE.map(([x, y]) => [x, y, z] as Vec3)

/** Ligne de cote : traits d'attache, ligne, flèches ouvertes et position du libellé. */
function dimension(a: Vec3, b: Vec3, offset: Vec3, key: SketchLabel['key']): { paths: SketchPath[]; label: SketchLabel } {
  const a2: Vec3 = [a[0] + offset[0], a[1] + offset[1], a[2] + offset[2]]
  const b2: Vec3 = [b[0] + offset[0], b[1] + offset[1], b[2] + offset[2]]
  const pa = project(a2)
  const pb = project(b2)
  const dx = pb[0] - pa[0]
  const dy = pb[1] - pa[1]
  const len = Math.hypot(dx, dy)
  const ux = dx / len
  const uy = dy / len
  const arrow = 9
  const spread = 0.42
  const head = (p: Vec2, dirX: number, dirY: number) => {
    const cos = Math.cos(spread)
    const sin = Math.sin(spread)
    const lx = p[0] + arrow * (dirX * cos - dirY * sin)
    const ly = p[1] + arrow * (dirX * sin + dirY * cos)
    const rx = p[0] + arrow * (dirX * cos + dirY * sin)
    const ry = p[1] + arrow * (-dirX * sin + dirY * cos)
    return `M${fmt(lx)} ${fmt(ly)} L${fmt(p[0])} ${fmt(p[1])} L${fmt(rx)} ${fmt(ry)}`
  }
  // Le libellé suit la ligne, toujours lisible de gauche à droite.
  let angle = (Math.atan2(dy, dx) * 180) / Math.PI
  if (angle > 90) angle -= 180
  if (angle < -90) angle += 180
  const normal: Vec2 = [uy, -ux]
  const side = normal[1] > 0 ? -1 : 1 // place le texte au-dessus de la ligne
  return {
    paths: [
      { d: segment(a, a2), kind: 'thin' },
      { d: segment(b, b2), kind: 'thin' },
      { d: segment(a2, b2), kind: 'accent' },
      { d: head(pa, ux, uy), kind: 'accent' },
      { d: head(pb, -ux, -uy), kind: 'accent' },
    ],
    label: {
      x: fmt((pa[0] + pb[0]) / 2 + normal[0] * 12 * side),
      y: fmt((pa[1] + pb[1]) / 2 + normal[1] * 12 * side),
      angle: fmt(angle),
      key,
    },
  }
}

const DOORS: [number, number][] = [
  [1.0, 2.1],
  [5.6, 6.9],
  [10.0, 11.4],
]

function buildPlan(): SketchLayer {
  const paths: SketchPath[] = []
  // Lignes de construction prolongées au-delà de l'emprise.
  paths.push({ d: segment([-1.4, 0, W], [L + 1.4, 0, W]), kind: 'thin' })
  paths.push({ d: segment([-1.4, 0, 0], [L + 1.4, 0, 0]), kind: 'thin' })
  paths.push({ d: segment([0, 0, -0.9], [0, 0, W + 0.9]), kind: 'thin' })
  paths.push({ d: segment([L, 0, -0.9], [L, 0, W + 0.9]), kind: 'thin' })
  // Emprise au sol et axe longitudinal.
  paths.push({ d: polyline([[0, 0, 0], [L, 0, 0], [L, 0, W], [0, 0, W]], true), kind: 'line' })
  paths.push({ d: segment([-0.8, 0, W / 2], [L + 0.8, 0, W / 2]), kind: 'axis' })
  // Essieux et empreintes des roues.
  for (const axle of [REAR_AXLE, FRONT_AXLE]) {
    paths.push({ d: segment([axle, 0, -0.5], [axle, 0, W + 0.5]), kind: 'axis' })
    for (const z of [0.12, W - 0.42]) {
      paths.push({
        d: polyline([[axle - WHEEL_R, 0, z], [axle + WHEEL_R, 0, z], [axle + WHEEL_R, 0, z + 0.3], [axle - WHEEL_R, 0, z + 0.3]], true),
        kind: 'thin',
      })
    }
  }
  return { paths, fills: [], labels: [] }
}

function buildVolume(): SketchLayer {
  const paths: SketchPath[] = []
  const near = at(W)
  const far = at(0)
  // Flanc droit, entier et visible.
  paths.push({ d: polyline(near, true), kind: 'line' })
  // Flanc gauche : le toit et l'avant se voient, l'arrière et le bas sont cachés (en tirets).
  paths.push({ d: polyline([far[1], far[2], far[3], far[4], far[5], far[6]]), kind: 'line' })
  paths.push({ d: polyline([far[6], far[0], far[1]]), kind: 'hidden' })
  // Arêtes transversales : visibles au toit et à l'avant, cachée en bas à l'arrière.
  for (const i of [1, 2, 3, 4, 5, 6]) paths.push({ d: segment(near[i], far[i]), kind: 'line' })
  paths.push({ d: segment(near[0], far[0]), kind: 'hidden' })
  // Ligne de ceinture.
  paths.push({ d: segment([0.05, 1.62, W], [L - 0.02, 1.62, W]), kind: 'thin' })
  return { paths, fills: [], labels: [] }
}

function buildDetails(): SketchLayer {
  const paths: SketchPath[] = []
  // Portes : cadre, séparation des vantaux et vitrages.
  for (const [x0, x1] of DOORS) {
    paths.push({ d: polyline(sideRect(x0, x1, FLOOR + 0.04, 2.78), true), kind: 'line' })
    const mid = (x0 + x1) / 2
    paths.push({ d: segment([mid, FLOOR + 0.04, W], [mid, 2.78, W]), kind: 'thin' })
    paths.push({ d: polyline(sideRect(x0 + 0.08, mid - 0.06, 0.9, 2.62), true), kind: 'thin' })
    paths.push({ d: polyline(sideRect(mid + 0.06, x1 - 0.08, 0.9, 2.62), true), kind: 'thin' })
  }
  // Vitres latérales, en évitant les portes.
  const panes: [number, number][] = []
  let x = 0.4
  while (x < L - 0.9) {
    const door = DOORS.find(([d0, d1]) => x >= d0 - 0.12 && x < d1 + 0.12)
    if (door) {
      x = door[1] + 0.14
      continue
    }
    const nextDoor = DOORS.find(([d0]) => d0 > x)
    const limit = Math.min(nextDoor ? nextDoor[0] - 0.14 : L - 0.85, L - 0.85)
    const end = Math.min(x + 1.25, limit)
    if (end - x > 0.35) panes.push([x, end])
    x = end + 0.1
  }
  for (const [x0, x1] of panes) paths.push({ d: polyline(sideRect(x0, x1, 1.78, 2.74), true), kind: 'line' })
  // Roues, jantes, moyeux et passages de roue.
  for (const axle of [REAR_AXLE, FRONT_AXLE]) {
    paths.push({ d: polyline(circleOnSide(axle, WHEEL_R, W, 0.62, 0, Math.PI)), kind: 'line' })
    paths.push({ d: polyline(circleOnSide(axle, WHEEL_R, W + 0.02, WHEEL_R), true), kind: 'line' })
    paths.push({ d: polyline(circleOnSide(axle, WHEEL_R, W + 0.02, 0.3), true), kind: 'thin' })
    paths.push({ d: polyline(circleOnSide(axle, WHEEL_R, W + 0.02, 0.07), true), kind: 'thin' })
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3
      paths.push({
        d: segment(
          [axle + Math.cos(a) * 0.08, WHEEL_R + Math.sin(a) * 0.08, W + 0.02],
          [axle + Math.cos(a) * 0.29, WHEEL_R + Math.sin(a) * 0.29, W + 0.02],
        ),
        kind: 'thin',
      })
    }
  }
  // Face avant : pare-brise sur la partie inclinée, girouette, phares.
  const glass = (z0: number, z1: number) => [
    [L, 1.2, z0],
    [L, 1.2, z1],
    [L - 0.3, H - 0.32, z1],
    [L - 0.3, H - 0.32, z0],
  ] as Vec3[]
  paths.push({ d: polyline(glass(0.14, W - 0.14), true), kind: 'line' })
  paths.push({
    d: polyline([[L - 0.32, H - 0.27, 0.4], [L - 0.32, H - 0.27, W - 0.4], [L - 0.42, H - 0.08, W - 0.4], [L - 0.42, H - 0.08, 0.4]], true),
    kind: 'thin',
  })
  for (const [z0, z1] of [[0.18, 0.62], [W - 0.62, W - 0.18]] as [number, number][]) {
    paths.push({ d: polyline([[L, 0.52, z0], [L, 0.52, z1], [L, 0.74, z1], [L, 0.74, z0]], true), kind: 'thin' })
  }
  // Rétroviseur côté portes.
  paths.push({ d: polyline([[L - 0.05, 2.35, W], [L + 0.3, 2.42, W + 0.25], [L + 0.3, 1.95, W + 0.25]]), kind: 'line' })
  // Module de climatisation sur le toit.
  const ac: Vec3[] = [
    [4.0, H, 0.45],
    [7.2, H, 0.45],
    [7.2, H, 2.1],
    [4.0, H, 2.1],
  ]
  const acTop = ac.map(([ax, , az]) => [ax, H + 0.32, az] as Vec3)
  paths.push({ d: polyline(acTop, true), kind: 'line' })
  paths.push({ d: polyline([ac[3], ac[2], ac[1]]), kind: 'line' })
  for (const i of [1, 2, 3]) paths.push({ d: segment(ac[i], acTop[i]), kind: 'line' })
  for (let gx = 4.4; gx < 7.0; gx += 0.4) paths.push({ d: segment([gx, H + 0.32, 0.6], [gx, H + 0.32, 1.95]), kind: 'thin' })
  return { paths, fills: [], labels: [] }
}

function buildRender(): SketchLayer {
  const paths: SketchPath[] = []
  const labels: SketchLabel[] = []
  const fills: SketchFill[] = [
    // Flanc entier, hachures légères ; vitrages et pare-brise, hachures denses.
    { d: polyline(at(W), true) },
    { d: polyline([[L, 1.2, 0.14], [L, 1.2, W - 0.14], [L - 0.3, H - 0.32, W - 0.14], [L - 0.3, H - 0.32, 0.14]], true), dense: true },
  ]
  for (const [x0, x1] of DOORS) fills.push({ d: polyline(sideRect(x0 + 0.08, x1 - 0.08, 0.9, 2.62), true), dense: true })

  const length = dimension([0, 0, W], [L, 0, W], [0, 0, 1.25], 'length')
  const height = dimension([0, 0, W], [0, H, W], [-0.95, 0, 0], 'height')
  const width = dimension([L, 0, 0], [L, 0, W], [1.1, 0, 0], 'width')
  for (const dim of [length, height, width]) {
    paths.push(...dim.paths)
    labels.push(dim.label)
  }
  return { paths, fills, labels }
}

let cache: BusSketchData | null = null

export function buildBusSketch(): BusSketchData {
  if (cache) return cache
  const layers: BusSketchData['layers'] = [buildPlan(), buildVolume(), buildDetails(), buildRender()]

  // Cadrage : on projette les extrémités du dessin pour calculer la viewBox.
  const extremes: Vec3[] = [
    [-1.6, 0, -1],
    [L + 1.6, 0, -1],
    [-1.6, 0, W + 1.5],
    [L + 1.6, 0, W + 1.5],
    [-1.2, H + 0.5, W],
    [L + 0.5, H + 0.5, 0],
  ]
  const xs = extremes.map((p) => project(p)[0])
  const ys = extremes.map((p) => project(p)[1])
  const pad = 26
  const minX = Math.min(...xs) - pad
  const minY = Math.min(...ys) - pad
  const width = Math.max(...xs) - minX + pad
  const height = Math.max(...ys) - minY + pad
  cache = { viewBox: `${fmt(minX)} ${fmt(minY)} ${fmt(width)} ${fmt(height)}`, layers }
  return cache
}
