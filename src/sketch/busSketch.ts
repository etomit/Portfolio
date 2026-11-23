/**
 * Dessin technique du Mercedes-Benz eCitaro solo (12 m), en projection oblique, calculé
 * à partir de coordonnées 3D (en mètres). Le dessin est rangé en quatre calques qui peuvent
 * se tracer l'un après l'autre : le plan au sol, le volume, les détails, le rendu.
 *
 * Cotes : fiche constructeur (docs/ecitaro/REFERENCE.md). Positions des portes, des vitres
 * et de l'îlot de toit : relevées sur les vues officielles (docs/ecitaro/RELEVES.md).
 *
 * Repère du dessin : x le long du bus (0 = arrière, L = avant), y vers le haut, z en travers
 * (z = W est le flanc droit, côté portes, tourné vers le lecteur).
 */

type Span = [number, number]

// --- Gabarit partagé avec la scène 3D (repère de la scène : origine au centre, avant vers +x) ---
export const ECITARO_LENGTH = 12.135
export const ECITARO_WIDTH = 2.55
/** Sommet de l'îlot de toit (batteries et climatisation). */
export const ECITARO_HEIGHT = 3.4
/** Empattement 5 900 mm, porte-à-faux avant 2 805 mm, arrière 3 430 mm. */
export const ECITARO_FRONT_AXLE = 3.2625
export const ECITARO_REAR_AXLE = -2.6375
export const ECITARO_WINDOW: Span = [1.31, 2.28]
export const ECITARO_DOOR_TOP = 2.32
/** Ouvertures de 1,25 m, centrées sur les cadres relevés (portes 3, 2, 1). */
export const ECITARO_DOORS: Span[] = [[-4.87, -3.62], [-0.875, 0.375], [4.23, 5.48]]
export const ECITARO_RIGHT_PANES: Span[] = [[-5.5, -5.05], [-3.4, -1.87], [-1.68, -1.09], [0.54, 2.29], [2.55, 4.01]]
/** Partie plate de l'îlot de toit ; il descend ensuite vers le pare-brise. */
export const ECITARO_ISLAND: Span = [-5.45, 3.65]

const L = ECITARO_LENGTH
const W = ECITARO_WIDTH
const H = ECITARO_HEIGHT
const HALF = L / 2
const FLOOR = 0.32 // bas de caisse
const BAND = 3.05 // haut de la bande noire qui prolonge le vitrage vers le toit
const REAR_AXLE = HALF + ECITARO_REAR_AXLE
const FRONT_AXLE = HALF + ECITARO_FRONT_AXLE
const WHEEL_R = 0.48
const [WIN0, WIN1] = ECITARO_WINDOW
const DOORS = ECITARO_DOORS.map(([a, b]): Span => [a + HALF, b + HALF])
const PANES = ECITARO_RIGHT_PANES.map(([a, b]): Span => [a + HALF, b + HALF])
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

/** Rectangle dans le plan de la face avant (x = L), en (z, y). */
function frontRect(z0: number, z1: number, y0: number, y1: number): Vec3[] {
  return [
    [L, y0, z0],
    [L, y0, z1],
    [L, y1, z1],
    [L, y1, z0],
  ]
}

/** Profil latéral de la caisse (x, y), de l'arrière bas vers l'avant puis le haut de la bande noire. */
const PROFILE: [number, number][] = [
  [0, FLOOR],
  [L, FLOOR],
  [L, 0.95],
  [L - 0.32, 2.62],
  [L - 0.62, BAND],
  [0.3, BAND],
  [0.08, 2.92],
  [0, 2.62],
]

/** Îlot de toit vu de profil : plat au-dessus des batteries, en pente douce vers le pare-brise. */
const ISLAND: [number, number][] = [
  [0.62, BAND],
  [L - 0.75, BAND],
  [L - 1.35, 3.24],
  [L - 1.9, 3.36],
  [HALF + ECITARO_ISLAND[1], H],
  [HALF + ECITARO_ISLAND[0] + 0.25, H],
  [0.66, 3.32],
]
const ISLAND_INSET = 0.16

const at = (profile: [number, number][], z: number) => profile.map(([x, y]) => [x, y, z] as Vec3)

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
  // Essieux et empreintes des roues (jumelées à l'arrière).
  for (const axle of [REAR_AXLE, FRONT_AXLE]) {
    paths.push({ d: segment([axle, 0, -0.5], [axle, 0, W + 0.5]), kind: 'axis' })
    const tracks = axle === REAR_AXLE ? [0.12, W - 0.72] : [0.12, W - 0.42]
    const tread = axle === REAR_AXLE ? 0.6 : 0.3
    for (const z of tracks) {
      paths.push({
        d: polyline([[axle - WHEEL_R, 0, z], [axle + WHEEL_R, 0, z], [axle + WHEEL_R, 0, z + tread], [axle - WHEEL_R, 0, z + tread]], true),
        kind: 'thin',
      })
    }
  }
  return { paths, fills: [], labels: [] }
}

function buildVolume(): SketchLayer {
  const paths: SketchPath[] = []
  const near = at(PROFILE, W)
  const far = at(PROFILE, 0)
  const last = PROFILE.length - 1
  // Flanc droit, entier et visible.
  paths.push({ d: polyline(near, true), kind: 'line' })
  // Flanc gauche : le haut et l'avant se voient, l'arrière et le bas sont cachés (en tirets).
  paths.push({ d: polyline(far.slice(1)), kind: 'line' })
  paths.push({ d: polyline([far[last], far[0], far[1]]), kind: 'hidden' })
  // Arêtes transversales : visibles en haut et à l'avant, cachée en bas à l'arrière.
  for (let i = 1; i <= last; i++) paths.push({ d: segment(near[i], far[i]), kind: 'line' })
  paths.push({ d: segment(near[0], far[0]), kind: 'hidden' })
  // Îlot de toit, un peu en retrait des flancs.
  const islandNear = at(ISLAND, W - ISLAND_INSET)
  const islandFar = at(ISLAND, ISLAND_INSET)
  paths.push({ d: polyline(islandNear, true), kind: 'line' })
  paths.push({ d: polyline(islandFar.slice(1)), kind: 'line' })
  for (let i = 2; i < ISLAND.length; i++) paths.push({ d: segment(islandNear[i], islandFar[i]), kind: 'line' })
  // Ligne de ceinture et bas de la bande noire au-dessus des vitres.
  paths.push({ d: segment([0.05, 1.2, W], [L - 0.02, 1.2, W]), kind: 'thin' })
  paths.push({ d: segment([0.2, 2.36, W], [L - 0.5, 2.36, W]), kind: 'thin' })
  return { paths, fills: [], labels: [] }
}

function buildDetails(): SketchLayer {
  const paths: SketchPath[] = []
  // Portes : cadre, séparation des vantaux et vitrages.
  for (const [x0, x1] of DOORS) {
    paths.push({ d: polyline(sideRect(x0, x1, FLOOR + 0.04, ECITARO_DOOR_TOP), true), kind: 'line' })
    const mid = (x0 + x1) / 2
    paths.push({ d: segment([mid, FLOOR + 0.04, W], [mid, ECITARO_DOOR_TOP, W]), kind: 'thin' })
    paths.push({ d: polyline(sideRect(x0 + 0.08, mid - 0.06, 0.62, ECITARO_DOOR_TOP - 0.12), true), kind: 'thin' })
    paths.push({ d: polyline(sideRect(mid + 0.06, x1 - 0.08, 0.62, ECITARO_DOOR_TOP - 0.12), true), kind: 'thin' })
  }
  // Vitres latérales relevées sur la vue officielle.
  for (const [x0, x1] of PANES) paths.push({ d: polyline(sideRect(x0, x1, WIN0, WIN1), true), kind: 'line' })
  // Roues, jantes, moyeux, passages de roue et leur relief qui monte vers les vitres.
  for (const axle of [REAR_AXLE, FRONT_AXLE]) {
    paths.push({ d: polyline(circleOnSide(axle, WHEEL_R, W, 0.6, 0, Math.PI)), kind: 'line' })
    const flare = Math.asin((WHEEL_R - FLOOR) / 0.78)
    paths.push({ d: polyline(circleOnSide(axle, WHEEL_R, W, 0.78, -flare, Math.PI + flare)), kind: 'thin' })
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
  // Prise de recharge CCS2, au-dessus de la roue avant droite.
  paths.push({ d: polyline(sideRect(FRONT_AXLE - 0.16, FRONT_AXLE + 0.16, 1.1, 1.28), true), kind: 'accent' })
  // Feu arrière enveloppant, dans le montant d'angle.
  paths.push({ d: polyline(sideRect(0.03, 0.3, 0.86, 1.58), true), kind: 'thin' })
  // Face avant : pare-brise qui monte dans le toit et englobe la girouette, montants A0.
  const glass = (z0: number, z1: number) => [
    [L, 1.02, z0],
    [L, 1.02, z1],
    [L - 0.3, 2.58, z1],
    [L - 0.3, 2.58, z0],
  ] as Vec3[]
  paths.push({ d: polyline(glass(0.14, W - 0.14), true), kind: 'line' })
  paths.push({
    d: polyline([[L - 0.25, 2.32, 0.42], [L - 0.25, 2.32, W - 0.42], [L - 0.28, 2.5, W - 0.42], [L - 0.28, 2.5, 0.42]], true),
    kind: 'thin',
  })
  // Panneau noir et phares LED en amande.
  paths.push({ d: polyline(frontRect(0.08, W - 0.08, 0.5, 0.92), true), kind: 'thin' })
  for (const [zc, side] of [[0.42, -1], [W - 0.42, 1]] as [number, number][]) {
    const lens: Vec3[] = []
    const point = (t: number, bulge: number): Vec3 => [L, 0.71 + side * 0.03 * t + bulge * (1 - t * t), zc + side * 0.22 * t]
    for (let i = 0; i <= 8; i++) lens.push(point(-1 + i / 4, 0.09))
    for (let i = 7; i >= 0; i--) lens.push(point(-1 + i / 4, -0.05))
    paths.push({ d: polyline(lens), kind: 'thin' })
  }
  // Pare-chocs avec support de plaque.
  paths.push({ d: polyline(frontRect(W / 2 - 0.26, W / 2 + 0.26, 0.34, 0.46), true), kind: 'thin' })
  // Rétroviseur côté portes, en corne de bélier.
  paths.push({ d: polyline([[L - 0.3, 2.58, W], [L + 0.25, 2.62, W + 0.2], [L + 0.25, 1.98, W + 0.2]]), kind: 'line' })
  return { paths, fills: [], labels: [] }
}

function buildRender(): SketchLayer {
  const paths: SketchPath[] = []
  const labels: SketchLabel[] = []
  const fills: SketchFill[] = [
    // Flanc entier, hachures légères ; vitrages et pare-brise, hachures denses.
    { d: polyline(at(PROFILE, W), true) },
    { d: polyline([[L, 1.02, 0.14], [L, 1.02, W - 0.14], [L - 0.3, 2.58, W - 0.14], [L - 0.3, 2.58, 0.14]], true), dense: true },
  ]
  for (const [x0, x1] of DOORS) fills.push({ d: polyline(sideRect(x0 + 0.08, x1 - 0.08, 0.62, ECITARO_DOOR_TOP - 0.12), true), dense: true })
  for (const [x0, x1] of PANES) fills.push({ d: polyline(sideRect(x0, x1, WIN0, WIN1), true), dense: true })

  // Hauteur au sommet de l'îlot de toit ; le pavillon n'est pas coté.
  const islandRear = HALF + ECITARO_ISLAND[0] + 0.25
  const length = dimension([0, 0, W], [L, 0, W], [0, 0, 1.25], 'length')
  const height = dimension([islandRear, 0, W], [islandRear, H, W], [-islandRear - 0.95, 0, 0], 'height')
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
