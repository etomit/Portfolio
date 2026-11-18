/* eslint-disable react-refresh/only-export-components -- le provider et son hook partagent volontairement ce module */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { content, type Content, type Lang } from './content'

const STORAGE_KEY = 'portfolio-language'

interface I18nValue {
  lang: Lang
  t: Content
  setLang: (lang: Lang) => void
}

const I18nContext = createContext<I18nValue>({ lang: 'fr', t: content.fr, setLang: () => {} })

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'fr' || saved === 'en') return saved
  } catch {
    // stockage indisponible (navigation privée) : on retombe sur la langue du navigateur
  }
  return navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang)

  useEffect(() => {
    const { title, description } = content[lang].meta
    document.documentElement.lang = lang
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // préférence non mémorisée, sans conséquence
    }
  }, [lang])

  const value = useMemo(() => ({ lang, t: content[lang], setLang }), [lang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
