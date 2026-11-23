import { About } from './components/About'
import { Ai } from './components/Ai'
import { Contact } from './components/Contact'
import { Education } from './components/Education'
import { Experience } from './components/Experience'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { I18nProvider, useI18n } from './i18n'
import { useTheme } from './useTheme'

function Portfolio() {
  const { t } = useI18n()
  const { theme, toggle } = useTheme()

  return (
    <div id="top">
      <a className="skip-link" href="#main">{t.a11y.skip}</a>
      <Header theme={theme} onToggleTheme={toggle} />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Ai />
        <Skills />
        <Education />
        <Contact />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <Portfolio />
    </I18nProvider>
  )
}
