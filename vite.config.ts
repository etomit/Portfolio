import { createHash } from 'node:crypto'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; frame-src 'none'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' ws: wss:; form-action 'self' mailto:; upgrade-insecure-requests",
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
}

/**
 * Au build seulement, la CSP de la balise meta se resserre : le script de thème en ligne est autorisé
 * par son empreinte au lieu de 'unsafe-inline', et ws: / wss: (rechargement à chaud) disparaissent.
 * En dev, la balise reste permissive : le préambule de @vitejs/plugin-react est un script en ligne.
 */
function strictCspAtBuild(): Plugin {
  return {
    name: 'strict-csp-at-build',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        // Seuls les <script> sans attribut sont exécutés en ligne (le bloc ld+json n'est pas exécuté).
        // Le navigateur calcule l'empreinte après avoir ramené les fins de ligne à LF : on fait pareil.
        const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
          ([, body]) => `'sha256-${createHash('sha256').update(body.replace(/\r\n?/g, '\n')).digest('base64')}'`,
        )
        if (hashes.length === 0) throw new Error('strict-csp-at-build : script de thème introuvable dans index.html')
        return html
          .replace("script-src 'self' 'unsafe-inline'", `script-src 'self' ${hashes.join(' ')}`)
          .replace("connect-src 'self' ws: wss:", "connect-src 'self'")
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), strictCspAtBuild()],
  build: {
    sourcemap: false,
    // Les polices restent des fichiers à part : la CSP n'autorise pas les polices en data: URI.
    assetsInlineLimit: 0,
    // Three.js forme un gros morceau à part, chargé seulement quand la scène 3D approche de l'écran.
    chunkSizeWarningLimit: 600,
  },
  server: {
    headers: securityHeaders,
  },
  preview: {
    headers: securityHeaders,
  },
})
