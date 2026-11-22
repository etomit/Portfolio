// Captures de contrôle du portfolio avec Playwright.
// Usage : node scripts/captures.mjs [url] [dossier]
//   url     : adresse du site (par défaut http://localhost:5173, lancer `npm run dev` avant)
//   dossier : où écrire les images (par défaut docs/refonte-blueprint/captures)
// Prérequis : `npx playwright install chromium` une fois.

import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const url = process.argv[2] ?? 'http://localhost:5173'
const outDir = process.argv[3] ?? 'docs/refonte-blueprint/captures'
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

// 1. Séquence d'intro (desktop, plan bleu). On n'attend pas le chargement complet :
//    l'intro démarre dès le premier rendu, il faut la saisir en cours de route.
{
  const { context, page } = await open('desktop', { intro: true, waitUntil: 'commit' })
  await page.waitForSelector('.hero[data-intro="play"]')
  const start = Date.now()
  // 1. tracés de construction, 2. contour au trait, 3. hachures, 4. résultat final (instants depuis le début).
  const moments = [300, 1100, 2200, 3600]
  for (const [index, moment] of moments.entries()) {
    await page.waitForTimeout(Math.max(0, moment - (Date.now() - start)))
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

await browser.close()

if (problems.length) {
  console.log('Points à vérifier :')
  for (const problem of problems) console.log(` - ${problem}`)
} else {
  console.log('Aucune erreur console, aucun défilement horizontal.')
}
console.log(`Captures écrites dans ${outDir}`)
