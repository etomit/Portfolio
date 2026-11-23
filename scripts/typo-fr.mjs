// Pose la typographie française (espaces insécables) dans la partie française de src/content.ts.
// Usage : node scripts/typo-fr.mjs
// Ne touche qu'à la zone comprise entre les repères « FRANÇAIS » et « FIN DU FRANÇAIS ».

import { readFileSync, writeFileSync } from 'node:fs'

const file = new URL('../src/content.ts', import.meta.url)
const source = readFileSync(file, 'utf8')

const startMarker = '// FRANÇAIS'
const endMarker = '// FIN DU FRANÇAIS'
const start = source.indexOf(startMarker)
const end = source.indexOf(endMarker)
if (start < 0 || end < 0 || end < start) {
  console.error('Repères FRANÇAIS / FIN DU FRANÇAIS introuvables : rien modifié.')
  process.exit(1)
}

const NBSP = ' ' // espace insécable, avant « : » et à l'intérieur des guillemets
const NNBSP = ' ' // espace fine insécable, avant ; ? ! et dans les milliers

const lines = source.slice(start, end).split('\n').map((line) => {
  const trimmed = line.trimStart()
  // Les commentaires restent en espaces ordinaires (ESLint refuse les espaces irréguliers dans le code).
  if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return line
  return line
    .replace(/ :(?=[\s'’])/g, `${NBSP}:`)
    .replace(/ ;/g, `${NNBSP};`)
    .replace(/ \?/g, `${NNBSP}?`)
    .replace(/ !/g, `${NNBSP}!`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/ »/g, `${NBSP}»`)
    .replace(/(\d) (\d{3})(?!\d)/g, `$1${NNBSP}$2`)
    // Un nombre ne se sépare pas de son unité ni de ce qu'il compte, ni une version de son nom.
    .replace(/(\d) (%)/g, `$1${NNBSP}$2`)
    .replace(
      /(\d) (mm|m|secondes|salles|salle|types|salariés|mètres|parties|agents|rôles|journées|modèles|services|objets|équipes|ans|mois)(?=[\s,.;:'’)]|$)/g,
      `$1${NBSP}$2`,
    )
    .replace(/\b(Laravel|PHP|Tailwind|GLM|Gemma|Opus|Fable|Java|Bac|niveau|salle) (\d)/g, `$1${NBSP}$2`)
    // Pas de barre oblique en début de ligne : « Cisco / réseaux » reste lié à gauche.
    .replace(/(\S) \/ /g, `$1${NBSP}/ `)
})

writeFileSync(file, source.slice(0, start) + lines.join('\n') + source.slice(end))
console.log('Typographie française appliquée.')
