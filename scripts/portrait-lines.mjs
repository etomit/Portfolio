// Génère les traits du portrait qui se dessine dans « À propos » : src/sketch/portraitPaths.ts.
// Usage : node scripts/portrait-lines.mjs
// Prérequis : `npx playwright install chromium` une fois (Playwright sert seulement à décoder le PNG).
//
// Trois calques, dans le repère de la photo recadrée (viewBox 0 0 1000 1170, le même recadrage
// que public/portrait-*.webp, voir assets-source/portrait-crop.mjs) :
//   1. tracés de construction, calculés à partir des repères mesurés plus bas ;
//   2. contour : silhouette tirée de la transparence + grandes lignes intérieures
//      (différence de gaussiennes, squelette, chaînage, simplification, Bézier) ;
//   3. hachures à 45° (tons moyens) et croisées à −45° (tons sombres), en deux jeux entrelacés.
// Chaque trait des calques 1 et 2 est une chaîne distincte : un <path> par trait à l'intégration.

import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'
import { PORTRAIT_CROP as CROP } from '../assets-source/portrait-crop.mjs'

const SOURCE = 'assets-source/profile-optimized.png'
const OUTPUT = 'src/sketch/portraitPaths.ts'
const W = CROP.width
const H = CROP.height
const BUDGET = 35 * 1024 // octets bruts, tous calques

// ---------------------------------------------------------------------------
// Repères mesurés une fois sur le recadrage (pixels du recadrage, origine en haut à gauche).
// Relevés sur une grille graduée tous les 10 px, au zoom ×2 sur le visage.
const LM = {
  axisX: 488, // milieu des pupilles ; passe par l'arête et la pointe du nez
  hairTop: 68, // sommet de la coiffure, sur l'axe
  chin: 532, // bas de la barbe, sur l'axe
  headCy: 300, // centre de l'ovale de construction (cheveux compris)
  headRx: 160, // demi-largeur : oreilles à x ≈ 332 et 637
  headRy: 236, // demi-hauteur : du sommet de la coiffure au bas de la barbe
  eyeY: 293, // pupilles : (432, 290) et (540, 297)
  noseY: 374, // base des narines ; pointe vers (488, 368)
  mouthY: 415, // fente des lèvres, commissures à x ≈ 410 et 556
  shoulderY: 598, // ligne des épaulettes : boutons à (237, 571) et (690, 582)
  shoulderL: 120, // naissance des épaules sur la silhouette
  shoulderR: 860,
}
// Zone de la tête (cheveux, oreilles, barbe) : seuils de détection propres, plus fins que pour le manteau.
const HEAD_BOX = { x0: 320, y0: 50, x1: 660, y1: 548 }

// Choix du procédé pour les traits du visage : 'auto' (détection) ou 'hand' (Bézier écrites à la main).
const FACE_MODE = 'hand'

// Exclusions manuelles du calque 2 : un trait dont la majorité des points tombe dans l'une de ces boîtes
// est retiré (peau du front et des joues : reflets et grain y donnent des traits isolés).
const EXCLUDE = [
  { name: 'front', x0: 372, y0: 150, x1: 612, y1: 248 },
  { name: 'joue gauche', x0: 350, y0: 345, x1: 438, y1: 470 },
  { name: 'joue droite', x0: 540, y0: 345, x1: 628, y1: 470 },
  { name: 'aile droite du nez', x0: 512, y0: 340, x1: 560, y1: 400 },
  { name: 'aile gauche du nez', x0: 420, y0: 340, x1: 462, y1: 400 },
]
const MAX_STROKES = 120

// ---------------------------------------------------------------------------
// Décodage : chromium sans interface, image en data URL dans un canvas, getImageData renvoyé à Node.
async function decode() {
  const src = 'data:image/png;base64,' + readFileSync(SOURCE).toString('base64')
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const b64 = await page.evaluate(
    async ({ src, crop }) => {
      const img = new Image()
      img.src = src
      await img.decode()
      const c = document.createElement('canvas')
      c.width = crop.width
      c.height = crop.height
      const g = c.getContext('2d', { willReadFrequently: true })
      g.drawImage(img, -crop.left, -crop.top)
      const d = g.getImageData(0, 0, crop.width, crop.height).data
      let s = ''
      for (let i = 0; i < d.length; i += 0x8000) s += String.fromCharCode.apply(null, d.subarray(i, i + 0x8000))
      return btoa(s)
    },
    { src, crop: CROP },
  )
  await browser.close()
  return new Uint8Array(Buffer.from(b64, 'base64'))
}

// ---------------------------------------------------------------------------
// Outils d'image (Float32Array de W × H).
function blur(src, s) {
  const r = Math.ceil(s * 3)
  const k = new Float32Array(2 * r + 1)
  let sum = 0
  for (let i = -r; i <= r; i++) sum += k[i + r] = Math.exp((-i * i) / (2 * s * s))
  for (let i = 0; i < k.length; i++) k[i] /= sum
  const tmp = new Float32Array(W * H)
  const out = new Float32Array(W * H)
  for (let y = 0; y < H; y++) {
    const row = y * W
    for (let x = 0; x < W; x++) {
      let acc = 0
      for (let i = -r; i <= r; i++) acc += src[row + Math.min(W - 1, Math.max(0, x + i))] * k[i + r]
      tmp[row + x] = acc
    }
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let acc = 0
      for (let i = -r; i <= r; i++) acc += tmp[Math.min(H - 1, Math.max(0, y + i)) * W + x] * k[i + r]
      out[y * W + x] = acc
    }
  }
  return out
}
// Flou normalisé par l'opacité : les valeurs intérieures débordent sans créer de bord au détourage.
function blurInside(v, a, s) {
  const va = new Float32Array(W * H)
  for (let i = 0; i < va.length; i++) va[i] = v[i] * a[i]
  const num = blur(va, s)
  const den = blur(a, s)
  for (let i = 0; i < num.length; i++) num[i] = den[i] > 1e-3 ? num[i] / den[i] : 0
  return num
}
function quantile(values, q) {
  const s = Float32Array.from(values).sort()
  return s[Math.min(s.length - 1, Math.floor(q * s.length))]
}
// Amincissement de Zhang et Suen : les zones détectées deviennent des lignes d'un pixel.
function thin(bin) {
  const n = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : bin[y * W + x])
  let changed = true
  while (changed) {
    changed = false
    for (const step of [0, 1]) {
      const del = []
      for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
          if (!bin[y * W + x]) continue
          const p = [n(x, y - 1), n(x + 1, y - 1), n(x + 1, y), n(x + 1, y + 1), n(x, y + 1), n(x - 1, y + 1), n(x - 1, y), n(x - 1, y - 1)]
          const b = p.reduce((s, v) => s + v, 0)
          if (b < 2 || b > 6) continue
          let a = 0
          for (let i = 0; i < 8; i++) if (!p[i] && p[(i + 1) % 8]) a++
          if (a !== 1) continue
          if (step === 0 ? p[0] * p[2] * p[4] || p[2] * p[4] * p[6] : p[0] * p[2] * p[6] || p[0] * p[4] * p[6]) continue
          del.push(y * W + x)
        }
      }
      for (const i of del) bin[i] = 0
      if (del.length) changed = true
    }
  }
  return bin
}
// Chaînage des pixels d'un squelette en polylignes : depuis les extrémités d'abord, en suivant la direction.
const N8 = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]
function chain(bin) {
  const seen = new Uint8Array(W * H)
  const nbrs = (i) => {
    const x = i % W
    const y = (i / W) | 0
    const out = []
    for (const [dx, dy] of N8) {
      const xx = x + dx
      const yy = y + dy
      if (xx >= 0 && yy >= 0 && xx < W && yy < H && bin[yy * W + xx]) out.push(yy * W + xx)
    }
    return out
  }
  const trace = (start) => {
    const pts = [start]
    seen[start] = 1
    let cur = start
    let dir = null
    for (;;) {
      let best = -1
      let bestScore = -Infinity
      const cx = cur % W
      const cy = (cur / W) | 0
      for (const nb of nbrs(cur)) {
        if (seen[nb]) continue
        const dx = (nb % W) - cx
        const dy = ((nb / W) | 0) - cy
        const len = Math.hypot(dx, dy)
        const score = (dir ? (dx * dir[0] + dy * dir[1]) / len : 0) + (len === 1 ? 0.1 : 0)
        if (score > bestScore) [best, bestScore] = [nb, score]
      }
      if (best < 0) break
      seen[best] = 1
      const dx = (best % W) - cx
      const dy = ((best / W) | 0) - cy
      dir = dir ? [dir[0] * 0.6 + dx * 0.4, dir[1] * 0.6 + dy * 0.4] : [dx, dy]
      pts.push(best)
      cur = best
    }
    return pts.map((i) => [i % W, (i / W) | 0])
  }
  const chains = []
  for (let i = 0; i < bin.length; i++) if (bin[i] && !seen[i] && nbrs(i).length === 1) chains.push(trace(i))
  for (let i = 0; i < bin.length; i++) if (bin[i] && !seen[i]) chains.push(trace(i))
  return chains
}
// Raccorde les chaînes dont les bouts se touchent presque et vont dans la même direction.
function join(chains, gap = 4, minCos = 0.6) {
  const endDir = (c, atEnd) => {
    const a = atEnd ? c[c.length - 1] : c[0]
    const b = atEnd ? c[Math.max(0, c.length - 6)] : c[Math.min(c.length - 1, 5)]
    const l = Math.hypot(a[0] - b[0], a[1] - b[1]) || 1
    return [(a[0] - b[0]) / l, (a[1] - b[1]) / l] // vers l'extérieur
  }
  let list = chains.filter((c) => c.length >= 3)
  // Passes successives ; les bouts sont rangés dans une grille pour ne comparer que les voisins.
  for (let pass = 0; pass < 10; pass++) {
    const grid = new Map()
    const key = (x, y) => (x >> 3) * 4096 + (y >> 3)
    list.forEach((c, i) => {
      for (const atEnd of [true, false]) {
        const p = atEnd ? c[c.length - 1] : c[0]
        const k = key(p[0], p[1])
        if (!grid.has(k)) grid.set(k, [])
        grid.get(k).push([i, atEnd])
      }
    })
    const dead = new Set()
    let merges = 0
    const n = list.length
    for (let i = 0; i < n; i++) {
      if (dead.has(i)) continue
      for (const ea of [true, false]) {
        const A = list[i]
        const pa = ea ? A[A.length - 1] : A[0]
        const da = endDir(A, ea)
        let found = null
        for (let gx = -1; gx <= 1 && !found; gx++) {
          for (let gy = -1; gy <= 1 && !found; gy++) {
            for (const [j, eb] of grid.get(key(pa[0] + gx * 8, pa[1] + gy * 8)) ?? []) {
              if (j === i || dead.has(j)) continue
              const B = list[j]
              const pb = eb ? B[B.length - 1] : B[0]
              if (Math.abs(pa[0] - pb[0]) > gap || Math.abs(pa[1] - pb[1]) > gap) continue
              const db = endDir(B, eb)
              if (-(da[0] * db[0] + da[1] * db[1]) < minCos) continue
              found = [j, eb]
              break
            }
          }
        }
        if (!found) continue
        const [j, eb] = found
        const B = list[j]
        list[i] = [...(ea ? A : [...A].reverse()), ...(eb ? [...B].reverse() : B)]
        dead.add(j)
        dead.add(i) // ses bouts ont changé : on le reprend à la passe suivante
        list.push(list[i])
        merges++
        break
      }
    }
    list = list.filter((_, i) => !dead.has(i))
    if (!merges) break
  }
  return list
}
const polyLength = (p) => p.reduce((s, q, i) => (i ? s + Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1]) : 0), 0)
function smooth(p, w) {
  if (p.length < 2 * w + 1) return p
  return p.map((q, i) => {
    if (i < w || i >= p.length - w) return q
    let sx = 0
    let sy = 0
    for (let k = -w; k <= w; k++) [sx, sy] = [sx + p[i + k][0], sy + p[i + k][1]]
    return [sx / (2 * w + 1), sy / (2 * w + 1)]
  })
}
function rdp(p, eps) {
  if (p.length < 3) return p
  const [a, b] = [p[0], p[p.length - 1]]
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  let idx = 0
  let max = 0
  for (let i = 1; i < p.length - 1; i++) {
    const d = Math.abs((b[0] - a[0]) * (a[1] - p[i][1]) - (a[0] - p[i][0]) * (b[1] - a[1])) / l
    if (d > max) [max, idx] = [d, i]
  }
  return max > eps ? [...rdp(p.slice(0, idx + 1), eps).slice(0, -1), ...rdp(p.slice(idx), eps)] : [a, b]
}

// ---------------------------------------------------------------------------
// Écriture SVG compacte : coordonnées entières, commandes relatives.
const nums = (...v) => v.map((n) => String(Math.round(n))).join(' ').replace(/ -/g, '-')
// Courbe de Catmull-Rom convertie en Bézier cubiques (c puis s : la tangente est continue).
function bezier(points) {
  const P = []
  for (const [x, y] of points) {
    const q = [Math.round(x), Math.round(y)]
    if (!P.length || q[0] !== P[P.length - 1][0] || q[1] !== P[P.length - 1][1]) P.push(q)
  }
  if (P.length < 2) return null
  let d = `M${nums(...P[0])}`
  if (P.length === 2) return d + `l${nums(P[1][0] - P[0][0], P[1][1] - P[0][1])}`
  for (let i = 0; i < P.length - 1; i++) {
    const [p0, p1, p2, p3] = [P[i - 1] ?? P[i], P[i], P[i + 1], P[i + 2] ?? P[i + 1]]
    const c1 = [Math.round(p1[0] + (p2[0] - p0[0]) / 6), Math.round(p1[1] + (p2[1] - p0[1]) / 6)]
    const c2 = [Math.round(p2[0] - (p3[0] - p1[0]) / 6), Math.round(p2[1] - (p3[1] - p1[1]) / 6)]
    const rel = (q) => [q[0] - p1[0], q[1] - p1[1]]
    d += i === 0 ? `c${nums(...rel(c1), ...rel(c2), ...rel(p2))}` : `${i === 1 ? 's' : ' '}${nums(...rel(c2), ...rel(p2))}`
  }
  return d.replace(/ -/g, '-')
}

// ---------------------------------------------------------------------------
// Calque 1 : tracés de construction (un trait par élément).
function construction() {
  const { axisX, hairTop, chin, headCy, headRx, headRy, eyeY, noseY, mouthY, shoulderY, shoulderL, shoulderR } = LM
  const F = { x0: 28, y0: 28, x1: 972, y1: 1142 } // cadre de mise au carreau
  const hline = (y, x0, x1) => `M${nums(x0, y)}h${nums(x1 - x0)}`
  const cross = (x, y) => `M${nums(x - 22, y)}h44M${nums(x, y - 22)}v44`
  // Carreau : divisions en quarts, marquées par de courtes graduations vers l'intérieur du cadre.
  let ticks = ''
  for (let i = 1; i < 4; i++) {
    const x = F.x0 + ((F.x1 - F.x0) * i) / 4
    const y = F.y0 + ((F.y1 - F.y0) * i) / 4
    ticks += `M${nums(x, F.y0)}v18M${nums(x, F.y1)}v-18M${nums(F.x0, y)}h18M${nums(F.x1, y)}h-18`
  }
  // Cote de la tête (sommet de la coiffure au bas de la barbe) : graduations seulement, aucune valeur.
  const cx = 262
  let cote = `M${nums(cx, hairTop)}V${nums(chin)}M${nums(cx - 14, hairTop)}h28M${nums(cx - 14, chin)}h28`
  for (let i = 1; i < 10; i++) {
    const y = hairTop + ((chin - hairTop) * i) / 10
    const l = i === 5 ? 10 : 5
    cote += `M${nums(cx - l, y)}h${nums(2 * l)}`
  }
  return [
    `M${nums(F.x0, F.y0)}H${F.x1}V${F.y1}H${F.x0}Z`,
    cross(F.x0, F.y0),
    cross(F.x1, F.y0),
    cross(F.x1, F.y1),
    cross(F.x0, F.y1),
    ticks,
    `M${nums(axisX, hairTop - 34)}V${nums(shoulderY + 40)}`,
    `M${nums(axisX - headRx, headCy)}a${nums(headRx, headRy)} 0 1 0 ${nums(2 * headRx)} 0a${nums(headRx, headRy)} 0 1 0 ${nums(-2 * headRx)} 0`,
    hline(eyeY, axisX - headRx - 40, axisX + headRx + 40),
    hline(noseY, axisX - 110, axisX + 110),
    hline(mouthY, axisX - 125, axisX + 125),
    hline(shoulderY, shoulderL, shoulderR),
    cote,
  ].map((d) => d.replace(/ -/g, '-'))
}

// ---------------------------------------------------------------------------
// Calque 2 : contour.
function contour(L, A) {
  const aSoft = blur(A, 2.5)
  const mask = aSoft.map((v) => (v > 0.5 ? 1 : 0))
  // Silhouette : pixels du masque qui touchent le fond, hors bords du recadrage (le buste est coupé net).
  const edge = new Uint8Array(W * H)
  for (let y = 2; y < H - 2; y++) {
    for (let x = 2; x < W - 2; x++) {
      const i = y * W + x
      if (mask[i] && (!mask[i - 1] || !mask[i + 1] || !mask[i - W] || !mask[i + W])) edge[i] = 1
    }
  }
  // Le côté gauche sort du cadre vers y = 900 : les deux côtés s'arrêtent à la même hauteur.
  // Sur la calotte, le contour suit le bord réel des cheveux : presque pas lissé.
  const onHair = ([x, y]) => y < 250 && x > 320 && x < 680
  const pieces = []
  for (const c of join(chain(thin(edge)), 6, 0.3)) {
    let cur = []
    for (const p of c) {
      if (p[1] <= SIL_END) cur.push(p)
      else if (cur.length) {
        pieces.push(cur)
        cur = []
      }
    }
    if (cur.length) pieces.push(cur)
  }
  const silhouette = pieces
    .filter((c) => c.length > 80)
    .map((c) => {
      const soft = smooth(c, 6)
      const mixed = c.map((p, i) => (onHair(p) ? smooth(c.slice(Math.max(0, i - 1), i + 2), 1)[Math.min(i, 1)] : soft[i]))
      return { pts: rdp(mixed, 1.1), len: polyLength(c), kind: 'silhouette' }
    })

  // Lignes intérieures : différence de gaussiennes sur la luminance floutée (traits sombres).
  const L0 = blurInside(L, A, 1.2)
  const g1 = blurInside(L0, A, 1.6)
  const g2 = blurInside(L0, A, 1.6 * 1.6)
  const inner = blur(A, 5) // loin du détourage seulement
  const v = new Float32Array(W * H)
  const inHead = (i) => {
    const x = i % W
    const y = (i / W) | 0
    return x >= HEAD_BOX.x0 && x <= HEAD_BOX.x1 && y >= HEAD_BOX.y0 && y <= HEAD_BOX.y1
  }
  const headVals = []
  const bodyVals = []
  for (let i = 0; i < v.length; i++) {
    if (inner[i] < 0.97) continue
    v[i] = Math.max(0, g2[i] - g1[i])
    ;(inHead(i) ? headVals : bodyVals).push(v[i])
  }
  const th = {
    head: { hi: quantile(headVals, 0.94), lo: quantile(headVals, 0.87) },
    body: { hi: quantile(bodyVals, 0.955), lo: quantile(bodyVals, 0.91) },
  }
  // Seuil à hystérésis : les pixels forts gagnent leurs voisins moyens.
  const bin = new Uint8Array(W * H)
  const stack = []
  for (let i = 0; i < v.length; i++) {
    const t = inHead(i) ? th.head : th.body
    if (v[i] > t.hi) {
      bin[i] = 1
      stack.push(i)
    }
  }
  while (stack.length) {
    const i = stack.pop()
    const x = i % W
    const y = (i / W) | 0
    for (const [dx, dy] of N8) {
      const xx = x + dx
      const yy = y + dy
      if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue
      const j = yy * W + xx
      if (bin[j]) continue
      if (v[j] > (inHead(j) ? th.head : th.body).lo) {
        bin[j] = 1
        stack.push(j)
      }
    }
  }
  const strength = (c) => c.reduce((s, [x, y]) => s + v[y * W + x], 0) / c.length
  let lines = join(chain(thin(bin)), 5, 0.5)
    .map((c) => {
      const head = c.filter(([x, y]) => inHead(y * W + x)).length > c.length / 2
      const len = polyLength(c)
      return { raw: c, len, head, score: (len * strength(c)) / (head ? th.head.hi : th.body.hi), kind: head ? 'tête' : 'corps' }
    })
    .filter((s) => s.len >= (s.head ? 24 : 55))
    .filter((s) => !EXCLUDE.some((b) => s.raw.filter(([x, y]) => x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1).length > s.raw.length / 2))
  // Repli : les traits détectés sur le visage cèdent la place aux traits écrits à la main.
  const inFace = ([x, y]) => x >= FACE_BOX.x0 && x <= FACE_BOX.x1 && y >= FACE_BOX.y0 && y <= FACE_BOX.y1
  if (FACE_MODE === 'hand') lines = lines.filter((s) => !s.head && s.raw.filter(inFace).length <= s.raw.length / 2)
  const hand = FACE_MODE === 'hand' ? HAND_FACE.map(({ pts, closed }) => ({ pts, closed, kind: 'main', head: true })) : []
  lines.sort((a, b) => b.score - a.score)
  const keep = lines.slice(0, MAX_STROKES - silhouette.length - hand.length)
  const detected = keep
    .map((s) => ({ ...s, pts: trimHooks(rdp(smooth(s.raw, s.head ? 2 : 3), s.head ? 1.2 : 1.8)) }))
    .filter((s) => polyLength(s.pts) >= MIN_TRIMMED)
  // Bruit : un trait détecté court, bas (sous y = 640) et isolé, sans extrémité près d'un autre trait, est écarté.
  const others = [...silhouette, ...hand, ...detected]
  const isolated = (s) => [s.pts[0], s.pts[s.pts.length - 1]].every((p) => others.every((o) => o === s || distToPolyline(p, o.pts) >= NOISE.gap))
  const noise = detected.filter((s) => polyLength(s.pts) < NOISE.maxLen && s.pts.every(([, y]) => y > NOISE.minY) && isolated(s))
  const strokes = [...silhouette, ...hand, ...detected.filter((s) => !noise.includes(s))]
  // Ordre de tracé : la silhouette d'abord, puis de haut en bas.
  const midY = (s) => s.pts.reduce((t, q) => t + q[1], 0) / s.pts.length
  strokes.sort((a, b) => (b.kind === 'silhouette') - (a.kind === 'silhouette') || midY(a) - midY(b))
  const paths = strokes.map((s) => (s.closed ? bezierClosed(s.pts) : bezier(s.pts))).filter(Boolean)
  const coatLines = strokes.filter((s) => s.kind === 'corps').map((s) => s.pts)
  return { paths, coatLines, stats: { silhouette: silhouette.length, main: hand.length, corps: coatLines.length, candidats: lines.length, bruit: noise.length } }
}
// Seuils du bruit écarté sur le calque 2, en unités du viewBox.
const NOISE = { maxLen: 45, minY: 640, gap: 20 }
/** Distance d'un point à une polyligne (segments successifs). */
function distToPolyline([px, py], pts) {
  if (pts.length === 1) return Math.hypot(px - pts[0][0], py - pts[0][1])
  let best = Infinity
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1]
    const [bx, by] = pts[i]
    const dx = bx - ax
    const dy = by - ay
    const t = dx || dy ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))) : 0
    best = Math.min(best, Math.hypot(px - ax - t * dx, py - ay - t * dy))
  }
  return best
}
// Ébarbage : un bout de trait court qui tourne brusquement (crochet laissé par le squelette) est retiré.
const SIL_END = 900
const MIN_TRIMMED = 40
function trimHooks(pts) {
  const p = [...pts]
  // Épines : un aller-retour court au milieu du trait (départ d'une branche du squelette).
  for (let i = 1; i < p.length - 1; i++) {
    const u = [p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]]
    const v = [p[i + 1][0] - p[i][0], p[i + 1][1] - p[i][1]]
    const cos = (u[0] * v[0] + u[1] * v[1]) / ((Math.hypot(...u) || 1) * (Math.hypot(...v) || 1))
    if (Math.min(Math.hypot(...u), Math.hypot(...v)) < 30 && cos < -0.3) p.splice(i--, 1)
  }
  const hook = (a, b, c) => {
    const u = [b[0] - a[0], b[1] - a[1]]
    const v = [c[0] - b[0], c[1] - b[1]]
    const lv = Math.hypot(...v)
    const cos = (u[0] * v[0] + u[1] * v[1]) / ((Math.hypot(...u) || 1) * (lv || 1))
    // crochet franc, ou petit retour en bout de trait (le lissage de Bézier en ferait une virgule)
    return (lv < 40 && cos < 0.7) || (lv < 14 && cos < 0.97)
  }
  while (p.length > 2 && hook(p[p.length - 3], p[p.length - 2], p[p.length - 1])) p.pop()
  while (p.length > 2 && hook(p[2], p[1], p[0])) p.shift()
  return p
}
// Boucle fermée de Catmull-Rom (verres des lunettes).
function bezierClosed(P) {
  const n = P.length
  let d = `M${nums(...P[0])}`
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [P[(i - 1 + n) % n], P[i], P[(i + 1) % n], P[(i + 2) % n]]
    const c1 = [Math.round(p1[0] + (p2[0] - p0[0]) / 6), Math.round(p1[1] + (p2[1] - p0[1]) / 6)]
    const c2 = [Math.round(p2[0] - (p3[0] - p1[0]) / 6), Math.round(p2[1] - (p3[1] - p1[1]) / 6)]
    const rel = (q) => [q[0] - p1[0], q[1] - p1[1]]
    d += i === 0 ? `c${nums(...rel(c1), ...rel(c2), ...rel(p2))}` : `${i === 1 ? 's' : ' '}${nums(...rel(c2), ...rel(p2))}`
  }
  return (d + 'z').replace(/ -/g, '-')
}
// Repli : traits du visage écrits à la main, points de passage relevés sur la grille graduée
// (zoom ×2 puis ×4 sur le visage, mêmes coordonnées que LM). Lissés en Catmull-Rom → Bézier.
const FACE_BOX = { x0: 340, y0: 150, x1: 640, y1: 545 }
const HAND_FACE = [
  // Naissance des cheveux, en traits interrompus, de la tempe gauche à la tempe droite (voir HAIRLINE).
  { pts: [[352, 236], [362, 210], [378, 192]] },
  { pts: [[392, 182], [420, 170], [452, 163]] },
  { pts: [[470, 161], [505, 160], [535, 163]] },
  { pts: [[556, 167], [584, 179], [602, 196]] },
  { pts: [[608, 208], [614, 232]] },
  // Quelques mèches, relevées vers la droite jusqu'à la houppe.
  { pts: [[372, 196], [384, 150], [410, 112], [446, 88]] },
  { pts: [[420, 168], [436, 128], [466, 98], [505, 80]] },
  { pts: [[480, 150], [500, 115], [528, 98], [554, 104]] },
  { pts: [[548, 112], [572, 122], [594, 150], [606, 185]] },
  // Sourcils.
  { pts: [[372, 262], [395, 252], [425, 248], [452, 251], [470, 258]] },
  { pts: [[514, 262], [540, 256], [568, 258], [592, 266], [606, 276]] },
  // Verres des lunettes (le droit est plus bas : tête légèrement inclinée), pont et départ des branches.
  { pts: [[364, 268], [415, 262], [466, 266], [473, 296], [460, 328], [425, 339], [386, 335], [364, 305]], closed: true },
  { pts: [[504, 288], [542, 275], [592, 277], [613, 285], [609, 313], [590, 345], [560, 352], [524, 343], [505, 318]], closed: true },
  { pts: [[472, 282], [487, 276], [504, 288]] },
  { pts: [[364, 270], [346, 267]] },
  { pts: [[613, 286], [630, 292]] },
  // Yeux : paupière haute, paupière basse, iris.
  { pts: [[395, 291], [410, 284], [428, 282], [447, 286], [462, 292]] },
  { pts: [[403, 294], [420, 298], [440, 298], [457, 294]] },
  { pts: [[424, 284], [423, 290], [430, 295], [437, 290], [436, 284]] },
  { pts: [[512, 297], [525, 290], [542, 287], [560, 290], [574, 298]] },
  { pts: [[519, 301], [536, 305], [555, 305], [569, 301]] },
  { pts: [[545, 290], [544, 296], [551, 301], [558, 296], [557, 290]] },
  // Nez : ombre du flanc droit, puis base (ailes, narines, pointe).
  { pts: [[500, 300], [505, 325], [514, 348]] },
  { pts: [[450, 352], [447, 363], [458, 371], [473, 369], [487, 376], [502, 371], [516, 369], [523, 359], [517, 349]] },
  // Moustache, fente des lèvres, lèvre basse.
  { pts: [[440, 398], [468, 392], [490, 395], [512, 392], [540, 399]] },
  { pts: [[412, 418], [430, 413], [460, 412], [490, 415], [520, 418], [545, 423]] },
  { pts: [[442, 432], [475, 437], [510, 434]] },
  // Barbe : bord inférieur, d'un côté du cou à l'autre.
  { pts: [[380, 476], [400, 500], [430, 520], [465, 529], [500, 531], [530, 524], [555, 505], [574, 482]] },
]

// ---------------------------------------------------------------------------
// Calque 3 : hachures.
// Quatre régions dans la silhouette : la calotte (au-dessus de la naissance des cheveux), le visage,
// le manteau (sombre, hors tête) et la peau hors visage (cou), laissée en blanc.
const HATCH = {
  faceSpacing: 10, // visage et calotte : écart entre lignes voisines (perpendiculaire)
  coatSpacing: 14, // trame du manteau ; une ligne sur deux s'efface vers le bas : écart maximal 28
  fadeFrom: 640, // les lignes impaires du manteau s'arrêtent entre ces deux hauteurs,
  fadeTo: 1140, //   chacune à une hauteur tirée au sort : la densité baisse sans palier
  hairAngle: -62, // calotte : une seule direction, celle des mèches (montantes vers la droite)
  // Centiles de luminance, comptés à part pour la tête et pour le corps.
  faceMidQ: 0.5, // visage, tons moyens : hachures à 45°
  faceDarkQ: 0.2, // visage, tons sombres : croisées à −45°
  hairQ: 0.62, // calotte : tout ce qui est plus sombre que ce centile de la tête
  coatDarkQ: 0.08, // manteau : croisées seulement dans les plis les plus sombres
  reserve: 9, // demi-largeur des réserves sans hachures le long des revers, du col et de la glissière
  minRun: 12,
}
function rng(seed) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32)
}
// Naissance des cheveux (les mêmes points que les traits interrompus de HAND_FACE).
const HAIRLINE = [[352, 236], [366, 202], [396, 180], [440, 165], [495, 161], [550, 165], [588, 181], [606, 200], [614, 232]]
function hairY(x) {
  if (x < HAIRLINE[0][0]) return 300
  for (let i = 1; i < HAIRLINE.length; i++) {
    const [x0, y0] = HAIRLINE[i - 1]
    const [x1, y1] = HAIRLINE[i]
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0)
  }
  return 260
}
function inPolygon(x, y, poly) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
function hatches(L, A, coatLines) {
  const T = blurInside(L, A, 5)
  const inside = blur(A, 2)
  const headW = (x, y) => {
    const r = Math.hypot((x - LM.axisX) / LM.headRx, (y - LM.headCy) / LM.headRy)
    return Math.min(1, Math.max(0, (1.12 - r) / 0.24))
  }
  // Réserves : bande épargnée de part et d'autre des lignes du manteau.
  const reserve = new Uint8Array(W * H)
  const R = HATCH.reserve
  for (const pts of coatLines) {
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1]
      const [x1, y1] = pts[i]
      const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 2)
      for (let s = 0; s <= n; s++) {
        const cx = x0 + ((x1 - x0) * s) / n
        const cy = y0 + ((y1 - y0) * s) / n
        for (let dy = -R; dy <= R; dy++) {
          for (let dx = -R; dx <= R; dx++) {
            const xx = Math.round(cx + dx)
            const yy = Math.round(cy + dy)
            if (dx * dx + dy * dy <= R * R && xx >= 0 && yy >= 0 && xx < W && yy < H) reserve[yy * W + xx] = 1
          }
        }
      }
    }
  }
  // Verres des lunettes (et donc les yeux) : épargnés.
  const lenses = HAND_FACE.filter((s) => s.closed).map((s) => s.pts)
  const lens = new Uint8Array(W * H)
  for (let y = 250; y < 365; y++) for (let x = 340; x < 640; x++) if (lenses.some((p) => inPolygon(x, y, p))) lens[y * W + x] = 1

  const head = []
  const body = []
  for (let i = 0; i < T.length; i += 3) {
    if (inside[i] <= 0.5) continue
    const x = i % W
    const y = (i / W) | 0
    if (headW(x, y) >= 0.5) head.push(T[i])
    else body.push(T[i])
  }
  const faceMid = quantile(head, HATCH.faceMidQ)
  const faceDark = quantile(head, HATCH.faceDarkQ)
  const hairTone = quantile(head, HATCH.hairQ)
  const coatDark = quantile(body, HATCH.coatDarkQ)
  const coatTone = (quantile(body, 0.5) + quantile(head, 0.6)) / 2 // sépare le drap sombre de la peau du cou
  const HAIR = 1
  const FACE = 2
  const COAT = 3
  const region = new Uint8Array(W * H)
  for (let i = 0; i < T.length; i++) {
    if (inside[i] <= 0.5) continue
    const x = i % W
    const y = (i / W) | 0
    const w = headW(x, y)
    if (w > 0.35 && y < hairY(x)) region[i] = HAIR
    else if (w >= 0.5) region[i] = FACE
    else if (T[i] < coatTone) region[i] = COAT
  }

  const rand = rng(1170)
  const sets = [[], []] // lignes paires, impaires
  // Une famille de lignes parallèles ; test(i, biais) dit si le pixel i est hachuré.
  // Le biais, tiré par ligne, décale un peu le seuil : les bords de zone deviennent irréguliers.
  function family(angle, spacing, test, { jitter = 7, cut = () => Infinity } = {}) {
    const rad = (angle * Math.PI) / 180
    const d = [Math.cos(rad), Math.sin(rad)]
    const n = [-d[1], d[0]]
    const corners = [[0, 0], [W, 0], [0, H], [W, H]]
    const cs = corners.map(([x, y]) => x * n[0] + y * n[1])
    const ts = corners.map(([x, y]) => x * d[0] + y * d[1])
    const [t0, t1] = [Math.min(...ts), Math.max(...ts)]
    let k = 0
    for (let c = Math.min(...cs) + spacing / 2; c < Math.max(...cs); c += spacing, k++) {
      const yCut = cut(k)
      const bias = 1 + (rand() - 0.5) * 0.24
      const at = (t) => [c * n[0] + t * d[0], c * n[1] + t * d[1]]
      let run = null
      const runs = []
      for (let t = t0; t <= t1 + 2; t += 2) {
        const [x, y] = at(t)
        const xi = Math.floor(x)
        const yi = Math.floor(y)
        const on = xi >= 0 && yi >= 0 && xi < W && yi < H && y < yCut && test(yi * W + xi, bias)
        if (on && !run) run = [t, t]
        else if (on) run[1] = t
        else if (run) {
          runs.push(run)
          run = null
        }
      }
      for (const [ta, tb] of runs) {
        // Extrémités irrégulières : chaque bout recule d'une longueur aléatoire.
        const a = ta + rand() * jitter
        const b = tb - rand() * jitter
        if (b - a < HATCH.minRun) continue
        sets[k % 2].push([...at(a), ...at(b)].map(Math.round))
      }
    }
  }
  const coatCut = (k) => (k % 2 ? HATCH.fadeFrom + rand() * (HATCH.fadeTo - HATCH.fadeFrom) : Infinity)
  family(HATCH.hairAngle, HATCH.faceSpacing - 1, (i, b) => region[i] === HAIR && T[i] < hairTone * b, { jitter: 12 })
  family(-45, HATCH.faceSpacing, (i, b) => region[i] === FACE && !lens[i] && T[i] < faceMid * b, { jitter: 34 })
  family(45, HATCH.faceSpacing, (i, b) => region[i] === FACE && !lens[i] && T[i] < faceDark * b, { jitter: 34 })
  family(-45, HATCH.coatSpacing, (i) => region[i] === COAT && !reserve[i], { cut: coatCut })
  family(45, HATCH.coatSpacing, (i, b) => region[i] === COAT && !reserve[i] && T[i] < coatDark * b) // sans effacement : pas de treillis en bas

  return sets.map((segs) => {
    let d = ''
    let px = 0
    let py = 0
    for (const [x0, y0, x1, y1] of segs) {
      d += d ? `m${nums(x0 - px, y0 - py)}` : `M${nums(x0, y0)}`
      d += `l${nums(x1 - x0, y1 - y0)}`
      ;[px, py] = [x1, y1]
    }
    return d.replace(/ -/g, '-')
  })
}

// ---------------------------------------------------------------------------
const rgba = await decode()
const L = new Float32Array(W * H)
const A = new Float32Array(W * H)
for (let i = 0; i < W * H; i++) {
  const [r, g, b, a] = rgba.subarray(i * 4, i * 4 + 4)
  L[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  A[i] = a / 255
}
const layer1 = construction()
const { paths: layer2, coatLines, stats } = contour(L, A)
const layer3 = hatches(L, A, coatLines)

const list = (a) => `[\n  ${a.map((s) => JSON.stringify(s)).join(',\n  ')},\n]`
const ts = `// Généré par scripts/portrait-lines.mjs : ne pas modifier à la main.
// Repère : photo recadrée (assets-source/portrait-crop.mjs), viewBox 0 0 1000 1170.
// Calques 1 et 2 : un trait par chaîne, donc un <path> par trait. Calque 3 : deux jeux entrelacés.

export const PORTRAIT_VIEWBOX = '0 0 ${W} ${H}'

/** Calque 1 : tracés de construction (cadre, repères, axe, ovale, lignes du visage, cote). */
export const constructionStrokes: readonly string[] = ${list(layer1)}

/** Calque 2 : contour (silhouette puis lignes intérieures, procédé : ${FACE_MODE === 'auto' ? 'détection automatique' : 'visage à la main'}). */
export const contourStrokes: readonly string[] = ${list(layer2)}

/** Calque 3 : hachures, lignes paires puis impaires (une seule sur mobile). */
export const hatchPaths: readonly [string, string] = ${list(layer3)}
`
writeFileSync(OUTPUT, ts)
const bytes = Buffer.byteLength(ts)
console.log(`calque 1 : ${layer1.length} traits, ${layer1.join('').length} o`)
console.log(`calque 2 : ${layer2.length} traits ${JSON.stringify(stats)}, ${layer2.join('').length} o`)
console.log(`calque 3 : ${layer3.map((d) => d.length).join(' + ')} o`)
console.log(`${OUTPUT} : ${bytes} o${bytes > BUDGET ? ' : AU-DELÀ DU BUDGET' : ''}`)
