import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Polices auto-hébergées : aucune requête vers un service tiers.
import '@fontsource-variable/bricolage-grotesque/opsz.css'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import './styles/index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
