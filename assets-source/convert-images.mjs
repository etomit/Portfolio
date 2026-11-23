import sharp from 'sharp'
import { statSync } from 'node:fs'
import path from 'node:path'
import { PORTRAIT_CROP } from './portrait-crop.mjs'

// Usage : node assets-source/convert-images.mjs <dossier des PNG sources> [dossier de sortie]
// Exemple : node assets-source/convert-images.mjs assets-source public
const pub = process.argv[2]
const dest = process.argv[3] ?? pub
const out = (name) => path.join(dest, name)
const kb = (file) => `${Math.round(statSync(file).size / 1024)} KB`

// Portrait : on retire le vide au-dessus de la tête, on garde la transparence.
for (const width of [520, 900]) {
  const file = out(`portrait-${width}.webp`)
  await sharp(path.join(pub, 'profile-optimized.png'))
    .extract(PORTRAIT_CROP)
    .resize({ width })
    .webp({ quality: 82, alphaQuality: 90 })
    .toFile(file)
  console.log(file, kb(file))
}

for (const [src, base, widths] of [
  ['pokeline-preview.png', 'pokeline', [640, 1024]],
  ['mon-commerce-rapide-brand.png', 'moncommerce', [800, 1600]],
]) {
  for (const width of widths) {
    const file = out(`${base}-${width}.webp`)
    await sharp(path.join(pub, src)).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(file)
    console.log(file, kb(file))
  }
}

// Image de partage (Open Graph) : 1200x630, format largement supporté.
const og = out('og-image.jpg')
await sharp(path.join(pub, 'pokeline-preview.png'))
  .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(og)
console.log(og, kb(og))
