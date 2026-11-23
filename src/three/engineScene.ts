import {
  BufferAttribute,
  BufferGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  OrthographicCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  type Material,
} from 'three'
import type { RunnableScene } from '../useLazyScene'

export interface EngineScene extends RunnableScene {
  /** Écarte (true) ou remonte (false) culasse, pistons et bielles, vilebrequin. */
  setExploded(exploded: boolean): void
}

// --- Cotes : 1 unité de la scène = 100 mm ---------------------------------------------------
// Sourcées (docs/ecitaro/REFERENCE.md §5) :
const BORE = 1.1 // alésage 110 mm [D12]
const STROKE = 1.35 // course 135 mm [D12]
const PITCH = 1.28 // entraxe des cylindres 128 mm [D12]
const CYLINDERS = 6 // six-cylindres en ligne [C26]
// Longueur hors tout 1 057 mm et largeur 680 mm [PT] : la poulie avant, le carter de
// distribution arrière, le volant et les collecteurs sont dimensionnés pour s'y tenir.

// Estimées (aucune source publique) : à lire comme un schéma de principe.
const CRANK_R = STROKE / 2 // rayon de manivelle, déduit de la course
const ROD = 2.16 // entraxe de bielle ≈ 1,6 × la course, proportion usuelle
const CROWN = 0.6 // de l'axe de piston à la calotte
const SKIRT = 0.45 // de l'axe de piston au bas de la jupe
const DECK = CRANK_R + ROD + CROWN + 0.02 // plan de joint : la calotte affleure au point mort haut
const HALF_LEN = (CYLINDERS / 2) * PITCH + 0.46 // demi-longueur du bloc
const HALF_W = 1.75 // demi-largeur du bloc
const CRANKCASE_Y = -1.1 // bas du carter-cylindres
const PAN_Y = -4.2 // fond du carter d'huile : hauteur totale ≈ 975 mm (1 050 mm « selon l'équipement » [PT])
const HEAD_H = 1.3
const COVER_H = 0.8
const FLYWHEEL_R = 2.0 // volant de 400 mm environ
// Calage des manetons à 120° deux par deux (1-6, 2-5, 3-4) : usuel sur un six-cylindres en ligne,
// non confirmé pour l'OM 936.
const PHASES = [0, 240, 120, 120, 240, 0].map((deg) => (deg * Math.PI) / 180)

// Écart de chaque groupe en vue éclatée.
const LIFT_HEAD = 3.2
const LIFT_PISTONS = 1.6
const DROP_CRANK = -2.0
const DROP_PAN = -3.4

const CRANK_SPEED = 3.2 // rad/s : un tour en deux secondes, lisible
const SPIN_SPEED = 0.12
const EXPLODE_DURATION = 0.9
const VIEW = new Vector3(0.95, 0.46, 1.05).normalize()

const cylinderX = (index: number) => (index - (CYLINDERS - 1) / 2) * PITCH

// --- Dessin au trait ------------------------------------------------------------------------
type P3 = [number, number, number]
/** 0 = x, 1 = y, 2 = z. */
type Axis = 0 | 1 | 2

function seg(out: number[], a: P3, b: P3) {
  out.push(a[0], a[1], a[2], b[0], b[1], b[2])
}

function polygon(out: number[], points: P3[]) {
  points.forEach((point, index) => seg(out, point, points[(index + 1) % points.length]))
}

/** Point d'un cercle perpendiculaire à `axis`. Autour de x : angle 0 vers +y, π/2 vers +z. */
function onCircle(center: P3, axis: Axis, radius: number, angle: number): P3 {
  const point: P3 = [center[0], center[1], center[2]]
  point[(axis + 1) % 3] += Math.cos(angle) * radius
  point[(axis + 2) % 3] += Math.sin(angle) * radius
  return point
}

function ring(out: number[], center: P3, axis: Axis, radius: number, steps = 24) {
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2
    const b = ((i + 1) / steps) * Math.PI * 2
    seg(out, onCircle(center, axis, radius, a), onCircle(center, axis, radius, b))
  }
}

/** Cylindre : deux cercles et quelques génératrices. */
function tube(out: number[], start: P3, axis: Axis, length: number, radius: number, steps = 24, generators = 4, phase = Math.PI / 4) {
  const end: P3 = [start[0], start[1], start[2]]
  end[axis] += length
  ring(out, start, axis, radius, steps)
  ring(out, end, axis, radius, steps)
  for (let g = 0; g < generators; g++) {
    const angle = phase + (g / generators) * Math.PI * 2
    seg(out, onCircle(start, axis, radius, angle), onCircle(end, axis, radius, angle))
  }
}

function box(out: number[], x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
  for (const y of [y0, y1]) polygon(out, [[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]])
  for (const [x, z] of [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]) seg(out, [x, y0, z], [x, y1, z])
}

/** Tronc de pyramide horizontal (carter d'huile) : rectangle du haut, rectangle du bas. */
function frustum(out: number[], top: [number, number, number, number], y0: number, bottom: [number, number, number, number], y1: number) {
  const corners = (r: [number, number, number, number], y: number): P3[] => [[r[0], y, r[1]], [r[2], y, r[1]], [r[2], y, r[3]], [r[0], y, r[3]]]
  const a = corners(top, y0)
  const b = corners(bottom, y1)
  polygon(out, a)
  polygon(out, b)
  a.forEach((point, index) => seg(out, point, b[index]))
}

// --- Pièces ---------------------------------------------------------------------------------

/** Carter-cylindres « en transparence » : enveloppe, cloisons des paliers, carter de distribution. */
function drawBlock(shell: number[], liners: number[]) {
  box(shell, -HALF_LEN, CRANKCASE_Y, -HALF_W, HALF_LEN, DECK, HALF_W)
  // Ceinture du carter et cloisons des paliers, sur les deux flancs.
  for (const z of [-HALF_W, HALF_W]) seg(shell, [-HALF_LEN, 0.9, z], [HALF_LEN, 0.9, z])
  for (let i = 0; i <= CYLINDERS; i++) {
    const x = cylinderX(i) - PITCH / 2
    for (const z of [-HALF_W, HALF_W]) seg(shell, [x, CRANKCASE_Y, z], [x, 0.9, z])
    // Chapeau de palier : demi-cercle autour de l'axe du vilebrequin.
    for (let s = 0; s < 8; s++) {
      const a = Math.PI / 2 + (s / 8) * Math.PI
      const b = Math.PI / 2 + ((s + 1) / 8) * Math.PI
      seg(shell, onCircle([x, 0, 0], 0, 0.62, a), onCircle([x, 0, 0], 0, 0.62, b))
    }
  }
  // Chemises, vues en coupe à travers le bloc, et chambre d'eau autour du plan de joint.
  for (let i = 0; i < CYLINDERS; i++) {
    const x = cylinderX(i)
    tube(liners, [x, DECK - 2.25, 0], 1, 2.25, BORE / 2, 32, 4, 0)
    ring(shell, [x, DECK, 0], 1, BORE / 2 + 0.13, 28)
  }
  // Carter de distribution à l'arrière, côté volant [TE12], avec la cascade de pignons.
  const gx = HALF_LEN + 0.22
  box(shell, HALF_LEN, CRANKCASE_Y, -HALF_W - 0.1, HALF_LEN + 0.45, DECK, HALF_W + 0.1)
  ring(liners, [gx, 1.35, 0.7], 0, 0.5, 20)
  ring(liners, [gx, 2.75, 0.15], 0, 0.42, 18)
}

/** Carter d'huile, sous le bloc. */
function drawPan(out: number[]) {
  frustum(out, [-HALF_LEN + 0.2, -HALF_W + 0.05, HALF_LEN - 0.2, HALF_W - 0.05], CRANKCASE_Y, [-HALF_LEN + 0.7, -1.2, HALF_LEN - 1.4, 1.2], PAN_Y)
  for (const t of [0.35, 0.7]) {
    const y = CRANKCASE_Y + (PAN_Y - CRANKCASE_Y) * t
    const x0 = -HALF_LEN + 0.2 + 0.5 * t
    const x1 = HALF_LEN - 0.2 - 1.2 * t
    const z = HALF_W - 0.05 - 0.5 * t
    polygon(out, [[x0, y, -z], [x1, y, -z], [x1, y, z], [x0, y, z]])
  }
  ring(out, [0.4, PAN_Y, 0], 1, 0.16, 12)
}

/** Flasque de manivelle : œil du maneton d'un côté, contrepoids de l'autre, tourné de `phase`. */
function web(out: number[], x0: number, x1: number, phase: number) {
  const local: Array<[number, number]> = []
  for (let s = 0; s <= 8; s++) {
    const a = -Math.PI / 2 + (s / 8) * Math.PI
    local.push([CRANK_R + 0.5 * Math.cos(a), 0.5 * Math.sin(a)])
  }
  for (let s = 0; s <= 10; s++) {
    const a = (125 + (s / 10) * 110) * (Math.PI / 180)
    local.push([1.05 * Math.cos(a), 1.05 * Math.sin(a)])
  }
  const cos = Math.cos(phase)
  const sin = Math.sin(phase)
  const at = (x: number, [u, v]: [number, number]): P3 => [x, u * cos - v * sin, u * sin + v * cos]
  polygon(out, local.map((point) => at(x0, point)))
  polygon(out, local.map((point) => at(x1, point)))
  for (const index of [0, 4, 8, 9, 14, 19]) seg(out, at(x0, local[index]), at(x1, local[index]))
}

/** Vilebrequin dans son repère tournant : tourillons, manetons, flasques, poulie et volant. */
function drawCrank(out: number[], flywheel: number[]) {
  const pinHalf = 0.3
  const webT = 0.16
  for (let i = 0; i < CYLINDERS; i++) {
    const x = cylinderX(i)
    const phase = PHASES[i]
    tube(out, [x - pinHalf, CRANK_R * Math.cos(phase), CRANK_R * Math.sin(phase)], 0, pinHalf * 2, 0.34, 16, 4)
    web(out, x - pinHalf - webT, x - pinHalf, phase)
    web(out, x + pinHalf, x + pinHalf + webT, phase)
  }
  // Tourillons entre les flasques, puis les bouts d'arbre.
  for (let i = 0; i <= CYLINDERS; i++) {
    const from = i === 0 ? -HALF_LEN : cylinderX(i - 1) + pinHalf + webT
    const to = i === CYLINDERS ? HALF_LEN : cylinderX(i) - pinHalf - webT
    tube(out, [from, 0, 0], 0, to - from, 0.42, 18, 4)
  }
  tube(out, [-HALF_LEN - 0.6, 0, 0], 0, 0.6, 0.3, 14, 4)
  // Amortisseur de vibrations à l'avant.
  tube(out, [-HALF_LEN - 0.95, 0, 0], 0, 0.35, 0.95, 32, 8)
  ring(out, [-HALF_LEN - 0.95, 0, 0], 0, 0.55, 24)
  // Pignon de vilebrequin dans le carter de distribution, puis la bride.
  tube(out, [HALF_LEN, 0, 0], 0, 0.5, 0.55, 20, 4)
  ring(out, [HALF_LEN + 0.22, 0, 0], 0, 0.68, 30)
  // Volant : couronne dentée, perçages et rayons pour que la rotation se lise.
  const fx = HALF_LEN + 0.55
  tube(flywheel, [fx, 0, 0], 0, 0.42, FLYWHEEL_R, 48, 12, 0)
  ring(flywheel, [fx + 0.42, 0, 0], 0, 0.7, 24)
  ring(flywheel, [fx + 0.42, 0, 0], 0, FLYWHEEL_R - 0.25, 44)
  for (let k = 0; k < 6; k++) {
    const angle = (k / 6) * Math.PI * 2
    ring(flywheel, onCircle([fx + 0.42, 0, 0], 0, 1.25, angle), 0, 0.2, 12)
    seg(flywheel, onCircle([fx + 0.42, 0, 0], 0, 0.7, angle + Math.PI / 6), onCircle([fx + 0.42, 0, 0], 0, FLYWHEEL_R - 0.25, angle + Math.PI / 6))
  }
  for (let k = 0; k < 60; k++) {
    const angle = (k / 60) * Math.PI * 2
    seg(flywheel, onCircle([fx + 0.42, 0, 0], 0, FLYWHEEL_R, angle), onCircle([fx + 0.42, 0, 0], 0, FLYWHEEL_R - 0.09, angle))
  }
}

/** Piston dans son repère : origine sur l'axe de piston. */
function drawPiston(out: number[]) {
  const radius = BORE / 2 - 0.02
  for (const y of [CROWN, CROWN - 0.12, CROWN - 0.22, CROWN - 0.32, -SKIRT]) ring(out, [0, y, 0], 1, radius, 28)
  for (let g = 0; g < 4; g++) {
    const angle = Math.PI / 4 + (g / 4) * Math.PI * 2
    seg(out, onCircle([0, -SKIRT, 0], 1, radius, angle), onCircle([0, CROWN, 0], 1, radius, angle))
  }
  // Bol de combustion (moteur à injection directe) et axe de piston.
  ring(out, [0, CROWN, 0], 1, 0.3, 20)
  ring(out, [0, CROWN - 0.16, 0], 1, 0.2, 16)
  for (let g = 0; g < 4; g++) {
    const angle = (g / 4) * Math.PI * 2
    seg(out, onCircle([0, CROWN, 0], 1, 0.3, angle), onCircle([0, CROWN - 0.16, 0], 1, 0.2, angle))
  }
  tube(out, [-0.42, 0, 0], 0, 0.84, 0.15, 10, 2, 0)
}

/** Bielle dans son repère : tête au maneton (origine), pied à l'axe de piston (+y). */
function drawRod(out: number[]) {
  for (const x of [-0.17, 0.17]) {
    ring(out, [x, 0, 0], 0, 0.5, 22)
    ring(out, [x, 0, 0], 0, 0.34, 16)
    ring(out, [x, ROD, 0], 0, 0.25, 14)
    ring(out, [x, ROD, 0], 0, 0.15, 10)
    seg(out, [x, 0.46, 0.2], [x, ROD - 0.23, 0.11])
    seg(out, [x, 0.46, -0.2], [x, ROD - 0.23, -0.11])
    // Plan de coupe du chapeau de tête de bielle.
    seg(out, [x, 0, 0.5], [x, 0, 0.66])
    seg(out, [x, 0, -0.5], [x, 0, -0.66])
  }
  for (const [y, z] of [[0.46, 0.2], [0.46, -0.2], [ROD - 0.23, 0.11], [ROD - 0.23, -0.11], [0, 0.66], [0, -0.66]] as const) {
    seg(out, [-0.17, y, z], [0.17, y, z])
  }
}

/** Arbre à cames dans son repère tournant : une came par soupape, deux soupapes par cylindre. */
function drawCamshaft(out: number[], lobeOffset: number) {
  tube(out, [-HALF_LEN + 0.15, 0, 0], 0, HALF_LEN * 2 + 0.07, 0.13, 10, 2, 0)
  for (let i = 0; i < CYLINDERS; i++) {
    const nose = lobeOffset - PHASES[i] / 2
    for (const dx of [-0.27, 0.27]) {
      const x = cylinderX(i) + dx
      const profile: Array<[number, number]> = []
      for (let s = 0; s < 20; s++) {
        const a = (s / 20) * Math.PI * 2
        const r = 0.2 + 0.13 * Math.pow(Math.max(0, Math.cos(a - nose)), 3)
        profile.push([r * Math.cos(a), r * Math.sin(a)])
      }
      polygon(out, profile.map(([y, z]) => [x - 0.07, y, z]))
      polygon(out, profile.map(([y, z]) => [x + 0.07, y, z]))
      const [ny, nz] = [0.33 * Math.cos(nose), 0.33 * Math.sin(nose)]
      seg(out, [x - 0.07, ny, nz], [x + 0.07, ny, nz])
    }
  }
}

const CAM_Y = DECK + HEAD_H - 0.3
const CAM_Z = 0.55

/** Culasse : enveloppe, quatre soupapes par cylindre par paires parallèles, injecteurs, pignons. */
function drawHead(shell: number[], detail: number[]) {
  const top = DECK + HEAD_H
  box(shell, -HALF_LEN, DECK, -HALF_W - 0.1, HALF_LEN, top, HALF_W + 0.1)
  box(shell, HALF_LEN, DECK, -HALF_W - 0.1, HALF_LEN + 0.45, top, HALF_W + 0.1)
  for (const z of [-CAM_Z, CAM_Z]) ring(detail, [HALF_LEN + 0.22, CAM_Y, z], 0, 0.5, 22)
  for (let i = 0; i < CYLINDERS; i++) {
    const x = cylinderX(i)
    // Admission côté -z, échappement côté +z (culasse à flux transversal [TE12]).
    for (const dx of [-0.27, 0.27]) {
      for (const z of [-0.27, 0.27]) {
        ring(detail, [x + dx, DECK + 0.03, z], 1, 0.19, 14)
        seg(detail, [x + dx, DECK + 0.03, z], [x + dx, CAM_Y - 0.2, z])
      }
    }
    tube(detail, [x, DECK, 0], 1, HEAD_H + COVER_H * 0.6, 0.08, 8, 2, 0)
  }
}

/** Cache-culbuteurs : profil arrondi extrudé le long du moteur. */
function drawCover(out: number[], soft: number[]) {
  const y0 = DECK + HEAD_H
  const y1 = y0 + COVER_H
  const w = HALF_W - 0.15
  const r = 0.38
  // Profil (y, z) : flanc gauche, deux congés de rayon r, flanc droit.
  const section: Array<[number, number]> = [[y0, -w]]
  for (let s = 0; s <= 4; s++) {
    const a = (s / 4) * (Math.PI / 2)
    section.push([y1 - r + r * Math.sin(a), -w + r - r * Math.cos(a)])
  }
  for (let s = 4; s >= 0; s--) {
    const a = (s / 4) * (Math.PI / 2)
    section.push([y1 - r + r * Math.sin(a), w - r + r * Math.cos(a)])
  }
  section.push([y0, w])
  const x0 = -HALF_LEN + 0.12
  const x1 = HALF_LEN - 0.12
  polygon(out, section.map(([y, z]) => [x0, y, z]))
  polygon(out, section.map(([y, z]) => [x1, y, z]))
  section.forEach(([y, z]) => seg(out, [x0, y, z], [x1, y, z]))
  // Nervures au droit de chaque cylindre et bouchon de remplissage d'huile.
  for (let i = 0; i < CYLINDERS; i++) {
    const x = cylinderX(i)
    for (let k = 1; k < section.length - 2; k++) seg(soft, [x, section[k][0], section[k][1]], [x, section[k + 1][0], section[k + 1][1]])
  }
  tube(out, [cylinderX(1) - PITCH / 2, y1, 0], 1, 0.16, 0.3, 18, 4)
}

/** Collecteurs et turbocompresseur, sur les flancs de la culasse. */
function drawManifolds(out: number[], exhaust: number[], turbo: number[]) {
  // Admission, côté -z : répartiteur et six pipes courtes.
  const iy0 = DECK + 0.15
  const iy1 = DECK + 1.05
  box(out, -HALF_LEN + 0.35, iy0, -2.95, HALF_LEN - 0.35, iy1, -2.25)
  for (let i = 0; i < CYLINDERS; i++) {
    const x = cylinderX(i)
    box(out, x - 0.3, iy0 + 0.15, -2.25, x + 0.3, iy1 - 0.15, -HALF_W - 0.1)
  }
  ring(out, [-HALF_LEN + 0.35, (iy0 + iy1) / 2, -2.6], 0, 0.3, 18)

  // Échappement, côté +z : deux demi-collecteurs (cylindres 1 à 3 et 4 à 6) pour la turbine
  // double flux [D12]. Leur tracé exact est estimé.
  const ey = DECK + 0.45
  const ez = 2.45
  for (let i = 0; i < CYLINDERS; i++) {
    tube(exhaust, [cylinderX(i), ey + 0.15, HALF_W + 0.1], 2, ez - HALF_W - 0.1, 0.2, 12, 2, 0)
  }
  tube(exhaust, [cylinderX(0) - 0.25, ey + 0.15, ez], 0, -cylinderX(0) - 0.2, 0.28, 16, 4)
  tube(exhaust, [0.2, ey + 0.15, ez], 0, cylinderX(5) + 0.25 - 0.2, 0.28, 16, 4)
  // Coudes vers la turbine, sous les demi-collecteurs.
  const ty = DECK - 0.95
  const tz = 2.8
  for (const x of [-0.18, 0.18]) seg(exhaust, [x, ey + 0.15, ez], [x, ty + 0.62, tz])

  // Turbocompresseur à un étage (jusqu'à 220 kW [D12]) : turbine, paliers, compresseur, axe le long du moteur.
  tube(turbo, [-0.34, ty, tz], 0, 0.68, 0.62, 30, 6)
  ring(turbo, [0, ty, tz], 0, 0.62, 30) // cloison de la turbine double flux
  tube(turbo, [0.34, ty, tz], 0, 0.36, 0.26, 14, 4)
  tube(turbo, [0.7, ty, tz], 0, 0.55, 0.7, 30, 6)
  tube(turbo, [1.25, ty, tz], 0, 0.3, 0.34, 18, 4)
  ring(turbo, [0.98, ty, tz], 0, 0.3, 16)
}

/** Segments à plat (x, y, z, x, y, z…) vers une géométrie de traits. */
function toGeometry(positions: number[]) {
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
  return geometry
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function createEngineScene(canvas: HTMLCanvasElement): EngineScene {
  // Lève une exception si WebGL est indisponible : l'appelant affiche alors un message.
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 120)

  const engine = new Group()
  // Vue de trois quarts : le flanc échappement et le turbocompresseur face à la caméra.
  engine.rotation.y = 0.35
  scene.add(engine)

  // --- Matériaux : rendu au trait, couleurs lues dans les variables CSS du thème -----------
  const lineMaterial = new LineBasicMaterial()
  const detailMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.62, depthWrite: false })
  const softMaterial = new LineBasicMaterial({ transparent: true, opacity: 0.5, depthWrite: false })
  const accentMaterial = new LineBasicMaterial()
  const materials: Material[] = [lineMaterial, detailMaterial, softMaterial, accentMaterial]

  const geometries: BufferGeometry[] = []
  function lines(target: Group, positions: number[], material: Material) {
    const geometry = toGeometry(positions)
    geometries.push(geometry)
    const object = new LineSegments(geometry, material)
    target.add(object)
    return object
  }

  // Bloc, fixe.
  const block = new Group()
  const blockShell: number[] = []
  const blockLiners: number[] = []
  drawBlock(blockShell, blockLiners)
  lines(block, blockShell, softMaterial)
  lines(block, blockLiners, detailMaterial)

  const pan = new Group()
  const panLines: number[] = []
  drawPan(panLines)
  lines(pan, panLines, softMaterial)

  // Vilebrequin : le groupe extérieur s'écarte, l'intérieur tourne.
  const crankMount = new Group()
  const crank = new Group()
  crankMount.add(crank)
  const crankLines: number[] = []
  const flywheelLines: number[] = []
  drawCrank(crankLines, flywheelLines)
  lines(crank, crankLines, lineMaterial)
  lines(crank, flywheelLines, detailMaterial)

  // Pistons et bielles : une géométrie partagée par cylindre.
  const moving = new Group()
  const pistonPositions: number[] = []
  const rodPositions: number[] = []
  drawPiston(pistonPositions)
  drawRod(rodPositions)
  const pistonGeometry = toGeometry(pistonPositions)
  const rodGeometry = toGeometry(rodPositions)
  geometries.push(pistonGeometry, rodGeometry)
  const pistons: LineSegments[] = []
  const rods: LineSegments[] = []
  for (let i = 0; i < CYLINDERS; i++) {
    const piston = new LineSegments(pistonGeometry, accentMaterial)
    const rod = new LineSegments(rodGeometry, lineMaterial)
    piston.position.x = cylinderX(i)
    moving.add(piston, rod)
    pistons.push(piston)
    rods.push(rod)
  }

  // Culasse, cache-culbuteurs, arbres à cames, collecteurs et turbocompresseur.
  const head = new Group()
  const headShell: number[] = []
  const headDetail: number[] = []
  const coverLines: number[] = []
  const coverSoft: number[] = []
  const manifoldLines: number[] = []
  const exhaustLines: number[] = []
  const turboLines: number[] = []
  drawHead(headShell, headDetail)
  drawCover(coverLines, coverSoft)
  drawManifolds(manifoldLines, exhaustLines, turboLines)
  lines(head, headShell, softMaterial)
  lines(head, headDetail, detailMaterial)
  lines(head, coverLines, lineMaterial)
  lines(head, coverSoft, softMaterial)
  lines(head, manifoldLines, softMaterial)
  lines(head, exhaustLines, detailMaterial)
  lines(head, turboLines, lineMaterial)
  const camshafts: Group[] = []
  for (const [z, offset] of [[-CAM_Z, 0], [CAM_Z, Math.PI * 0.6]] as const) {
    const camshaft = new Group()
    camshaft.position.set(0, CAM_Y, z)
    const camLines: number[] = []
    drawCamshaft(camLines, offset)
    lines(camshaft, camLines, lineMaterial)
    head.add(camshaft)
    camshafts.push(camshaft)
  }

  engine.add(block, pan, crankMount, moving, head)

  // --- État -------------------------------------------------------------------------------
  let theta = 0.9 // angle du vilebrequin ; figé en mouvement réduit, pistons à des hauteurs variées
  let exploded = 0
  let target = 0
  let running = true
  let dirty = true
  let frame = 0
  let lastTime = performance.now() / 1000
  let dragging = false
  let lastPointerX = 0
  let spinVelocity = 0
  let aspect = 1

  function applyColors() {
    const style = getComputedStyle(document.documentElement)
    const read = (name: string) => style.getPropertyValue(name).trim()
    const line = read('--3d-line')
    const soft = read('--3d-line-soft')
    const accent = read('--3d-accent')
    if (line) {
      lineMaterial.color.set(line)
      detailMaterial.color.set(line)
    }
    if (soft) softMaterial.color.set(soft)
    if (accent) accentMaterial.color.set(accent)
    dirty = true
  }

  /** Bielle-manivelle : chaque piston suit son maneton, la bielle s'incline entre les deux. */
  function pose() {
    crank.rotation.x = theta
    for (let i = 0; i < CYLINDERS; i++) {
      const angle = theta + PHASES[i]
      const pinY = CRANK_R * Math.cos(angle)
      const pinZ = CRANK_R * Math.sin(angle)
      const pistonY = pinY + Math.sqrt(ROD * ROD - pinZ * pinZ)
      pistons[i].position.y = pistonY
      rods[i].position.set(cylinderX(i), pinY, pinZ)
      rods[i].rotation.x = Math.atan2(-pinZ, pistonY - pinY)
    }
    // Les arbres à cames tournent deux fois moins vite que le vilebrequin.
    for (const camshaft of camshafts) camshaft.rotation.x = theta / 2
  }

  /** Écartement des groupes et cadrage, selon l'avancement de la vue éclatée. */
  function layout() {
    const e = easeInOut(exploded)
    head.position.y = LIFT_HEAD * e
    moving.position.y = LIFT_PISTONS * e
    crankMount.position.y = DROP_CRANK * e
    pan.position.y = DROP_PAN * e

    // Sur un canevas étroit, on dézoome pour que le moteur tienne en largeur pendant qu'il tourne.
    const viewHeight = Math.max(12.6 + 8.2 * e, 15.5 / aspect)
    camera.left = (-viewHeight * aspect) / 2
    camera.right = (viewHeight * aspect) / 2
    camera.top = viewHeight / 2
    camera.bottom = -viewHeight / 2
    camera.updateProjectionMatrix()
    const focus = new Vector3(0, 0.6 + 0.9 * e, 0)
    camera.position.copy(focus).addScaledVector(VIEW, 40)
    camera.lookAt(focus)
    dirty = true
  }

  function resize() {
    const { clientWidth: width, clientHeight: height } = canvas
    if (width === 0 || height === 0) return
    renderer.setSize(width, height, false)
    aspect = width / height
    layout()
  }

  function tick() {
    frame = requestAnimationFrame(tick)
    const now = performance.now() / 1000
    const delta = Math.min(0.05, now - lastTime)
    lastTime = now

    if (exploded !== target) {
      const step = reducedMotion ? 1 : delta / EXPLODE_DURATION
      exploded = target > exploded ? Math.min(target, exploded + step) : Math.max(target, exploded - step)
      layout()
    }
    if (!dragging && Math.abs(spinVelocity) > 0.0001) {
      engine.rotation.y += spinVelocity
      spinVelocity *= 0.92
      dirty = true
    }
    if (!reducedMotion) {
      if (!dragging) engine.rotation.y += delta * SPIN_SPEED
      theta += delta * CRANK_SPEED
      pose()
      dirty = true
    }
    if (!dirty) return
    dirty = false
    renderer.render(scene, camera)
  }

  // --- Interaction : glisser horizontalement pour faire pivoter le moteur ------------------
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
    engine.rotation.y += turn
    spinVelocity = reducedMotion ? 0 : turn
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

  pose()
  applyColors()
  resize()
  frame = requestAnimationFrame(tick)

  return {
    setExploded(next) {
      target = next ? 1 : 0
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
      for (const geometry of geometries) geometry.dispose()
      for (const material of materials) material.dispose()
      renderer.dispose()
    },
  }
}
