// Régénère l'image de partage (public/og-image.jpg, 1200 × 630) à partir du hero, en plan bleu.
// Usage : node scripts/og-image.mjs [url]   (par défaut http://localhost:5173, lancer `npm run dev` avant)
// Prérequis : `npx playwright install chromium` une fois.

import { chromium } from 'playwright'

const url = process.argv[2] ?? 'http://localhost:5173'
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const context = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await context.addInitScript(() => {
  localStorage.setItem('portfolio-language', 'fr')
  localStorage.setItem('portfolio-theme', 'dark')
  sessionStorage.setItem('portfolio-intro-seen', '1')
})
const page = await context.newPage()
await page.goto(url, { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
// La scène 3D du bus est prête quand son conteneur reçoit la classe is-ready ; on laisse ensuite l'arrivée se tracer.
await page.waitForSelector('.bus-view.is-ready', { timeout: 15000 }).catch(() => {})
await page.waitForTimeout(2200)
// Une vignette de partage montre le nom, le cartouche et le bus : l'en-tête, le paragraphe
// (qui serait coupé au bord bas), les boutons, les commandes du bus et le chevron n’y ont pas leur place.
await page.addStyleTag({
  content: '.site-header, .scroll-cue, .intro-skip, .hero-lead, .hero-actions, .hero-facts, .bus-controls { display: none !important; }',
})
await page.screenshot({ path: 'public/og-image.jpg', type: 'jpeg', quality: 86 })
await browser.close()
console.log('public/og-image.jpg écrite.')
