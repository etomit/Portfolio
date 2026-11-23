// Captures de contrôle du portfolio avec Playwright.
// Usage : node scripts/captures.mjs [url] [dossier]
//   url     : adresse du site (par défaut http://localhost:5173, lancer `npm run dev` avant)
//   dossier : où écrire les images (par défaut docs/portrait-ecitaro/captures)
// Prérequis : `npx playwright install chromium` une fois.

import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const url = process.argv[2] ?? 'http://localhost:5173'
const outDir = process.argv[3] ?? 'docs/portrait-ecitaro/captures'
mkdirSync(outDir, { recursive: true })

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
}

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const problems = []

/** Ouvre une page avec la langue, le thème et l'état de l'intro voulus. */
async function open(viewport, { lang = 'fr', theme = 'dark', intro = false, waitUntil = 'networkidle' } = {}) {
  const context = await browser.newContext({ viewport: VIEWPORTS[viewport], deviceScaleFactor: 1 })
  await context.addInitScript(
    ([l, th, skipIntro]) => {
      localStorage.setItem('portfolio-language', l)
      localStorage.setItem('portfolio-theme', th)
      if (skipIntro) sessionStorage.setItem('portfolio-intro-seen', '1')
    },
    [lang, theme, !intro],
  )
  const page = await context.newPage()
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(`[${viewport} ${lang} ${theme}] console : ${message.text()}`)
  })
  page.on('pageerror', (error) => problems.push(`[${viewport} ${lang} ${theme}] erreur : ${error.message}`))
  await page.goto(url, { waitUntil })
  if (waitUntil === 'networkidle') await page.evaluate(() => document.fonts.ready)
  return { context, page }
}

/** Fait défiler toute la page pour déclencher les apparitions et les scènes 3D. */
async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 160))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(600)
}

async function checkOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  if (overflow > 0) problems.push(`[${label}] défilement horizontal de ${overflow} px`)
}

const shot = (page, name, options = {}) =>
  page.screenshot({ path: path.join(outDir, name), type: name.endsWith('.png') ? 'png' : 'jpeg', quality: name.endsWith('.png') ? undefined : 78, ...options })

// 1. Séquence d'intro (desktop, plan bleu). Une capture sous SwiftShader dure plus longtemps
//    que l'écart entre deux instants : on fige donc les animations CSS et on les place
//    nous-mêmes à chaque instant. La minuterie qui clôt l'intro est annulée pour qu'elle reste affichée.
{
  const { context, page } = await open('desktop', { intro: true, waitUntil: 'commit' })
  await page.waitForSelector('.hero[data-intro="play"]')
  await page.evaluate(() => {
    const last = window.setTimeout(() => {}, 0)
    for (let id = 0; id <= last; id++) window.clearTimeout(id)
    for (const animation of document.getAnimations()) animation.pause()
  })
  await page.evaluate(() => document.fonts.ready)
  // 1. tracés de construction, 2. contour au trait, 3. hachures, 4. résultat final (ms depuis le début).
  const moments = [500, 1400, 2300, 3500]
  for (const [index, moment] of moments.entries()) {
    await page.evaluate((time) => {
      for (const animation of document.getAnimations()) {
        // Les animations en boucle (chevron) et celles de la scène 3D ne sont pas concernées.
        if (animation instanceof CSSAnimation && animation.effect?.getTiming().iterations !== Infinity) {
          animation.currentTime = time
        }
      }
    }, moment)
    await page.waitForTimeout(120)
    await shot(page, `intro-${index + 1}.png`, { clip: { x: 0, y: 64, width: 1440, height: 836 } })
  }
  await context.close()
}

// 2. Pages complètes et hero, dans chaque combinaison utile.
const combos = [
  ['desktop', 'fr', 'dark'],
  ['desktop', 'en', 'dark'],
  ['desktop', 'fr', 'light'],
  ['mobile', 'fr', 'dark'],
  ['mobile', 'en', 'light'],
]
for (const [viewport, lang, theme] of combos) {
  const { context, page } = await open(viewport, { lang, theme })
  const label = `${viewport}-${lang}-${theme}`
  await page.waitForTimeout(2500) // laisse la scène du bus se construire
  await shot(page, `${label}-hero.png`)
  await scrollThrough(page)
  await checkOverflow(page, label)
  await shot(page, `${label}-full.jpg`, { fullPage: true })
  await context.close()
}

// 3. Sections clés en plein écran (desktop, plan bleu) : à propos à mi-parcours, projets, une fiche.
{
  const { context, page } = await open('desktop')
  await page.waitForTimeout(2500)
  const exploded = page.getByRole('button', { name: /Vue éclatée/ })
  if (await exploded.count()) {
    await exploded.click()
    await page.waitForTimeout(1400)
    await shot(page, 'desktop-fr-dark-bus-eclate.png')
  } else {
    problems.push('Bouton « Vue éclatée » absent (scène 3D non chargée ?)')
  }
  for (const id of ['about', 'experience', 'projects', 'ai', 'skills', 'contact']) {
    await page.evaluate((sectionId) => {
      const section = document.getElementById(sectionId)
      if (section) window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY - 64 + (sectionId === 'about' ? 420 : 0))
    }, id)
    await page.waitForTimeout(id === 'contact' ? 2200 : 900)
    await shot(page, `desktop-fr-dark-${id}.png`)
  }
  await page.evaluate(() => document.getElementById('projects')?.scrollIntoView())
  await page.getByRole('button', { name: /PokéLine/ }).first().click()
  await page.waitForTimeout(700)
  await shot(page, 'desktop-fr-dark-fiche-projet.png')
  await context.close()
}

/** Amène « À propos » à l'écran et attend que les traits du portrait soient chargés. */
async function reachPortrait(page, label) {
  await page.locator('#about').scrollIntoViewIfNeeded()
  try {
    await page.waitForSelector('.ps-l2 path', { timeout: 15000 })
    return true
  } catch {
    problems.push(`[${label}] traits du portrait non chargés`)
    return false
  }
}

// 4. « À propos » : le portrait à la fin de chacune des quatre étapes du parcours.
for (const [viewport, lang, theme] of [
  ['desktop', 'fr', 'dark'],
  ['desktop', 'fr', 'light'],
  ['desktop', 'en', 'dark'],
  ['mobile', 'fr', 'dark'],
  ['mobile', 'en', 'light'],
]) {
  const label = `${viewport}-${lang}-${theme}`
  const { context, page } = await open(viewport, { lang, theme })
  if (await reachPortrait(page, label)) {
    for (let stage = 0; stage < 4; stage++) {
      await page.evaluate((index) => {
        const item = document.querySelectorAll('.about-steps > li')[index]
        if (!item) return
        const height = window.innerHeight
        const rect = item.getBoundingClientRect()
        // Même calcul que About.tsx : l'étape est finie quand son haut a passé la ligne de lecture
        // (60 % de l'écran) d'au moins sa hauteur, ou d'un quart d'écran si elle est plus courte.
        const span = Math.max(rect.height, height * 0.25)
        window.scrollTo(0, window.scrollY + rect.top - (height * 0.6 - span) + 4)
      }, stage)
      await page.waitForTimeout(800)
      await shot(page, `about-${label}-${stage + 1}.png`)
    }
  }
  await context.close()
}

// 5. Le calque du contour seul (desktop, plan bleu) : les variables sont imposées par une feuille
//    en !important, qui l'emporte sur celles qu'écrit le défilement.
{
  const { context, page } = await open('desktop')
  if (await reachPortrait(page, 'contour seul')) {
    await page.addStyleTag({ content: '.portrait-sketch { --s1: 0 !important; --s2: 1 !important; --s3: 0 !important; --s4: 0 !important; }' })
    await page.waitForTimeout(400)
    await page.locator('.ps-box').screenshot({ path: path.join(outDir, 'about-contour-seul.png') })
  }
  await context.close()
}

// 6. Bus éclaté sur mobile et en tirage papier, carte du moteur assemblée puis éclatée.
for (const [viewport, theme] of [
  ['desktop', 'dark'],
  ['desktop', 'light'],
  ['mobile', 'dark'],
]) {
  const label = `${viewport}-fr-${theme}`
  const { context, page } = await open(viewport, { theme })
  await page.waitForTimeout(2500)
  if (viewport === 'mobile' || theme === 'light') {
    const exploded = page.getByRole('button', { name: /Vue éclatée/ })
    if (await exploded.count()) {
      await exploded.click()
      await page.waitForTimeout(1400)
      await page.locator('.hero').screenshot({ path: path.join(outDir, `${label}-bus-eclate.png`) })
    } else {
      problems.push(`[${label}] bouton « Vue éclatée » absent`)
    }
  }
  const card = page.locator('.engine-card')
  await card.scrollIntoViewIfNeeded()
  try {
    await page.waitForSelector('.engine-card canvas[role="img"]', { timeout: 20000 })
    await page.waitForTimeout(1200)
    await card.screenshot({ path: path.join(outDir, `${label}-moteur-assemble.png`) })
    await card.getByRole('button', { name: /Éclater le moteur/ }).click()
    await page.waitForTimeout(1600)
    await card.screenshot({ path: path.join(outDir, `${label}-moteur-eclate.png`) })
  } catch {
    problems.push(`[${label}] scène du moteur non chargée`)
  }
  await context.close()
}

await browser.close()

if (problems.length) {
  console.log('Points à vérifier :')
  for (const problem of problems) console.log(` - ${problem}`)
} else {
  console.log('Aucune erreur console, aucun défilement horizontal.')
}
console.log(`Captures écrites dans ${outDir}`)
