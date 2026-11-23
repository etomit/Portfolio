import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Décalage en millisecondes, pour échelonner plusieurs blocs voisins. */
  delay?: number
  as?: ElementType
}

/** Fait apparaître son contenu la première fois qu'il entre dans la fenêtre. */
export function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setVisible(true)
        observer.disconnect()
      },
      { threshold: 0.06, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}

/** Croix de repérage (⊕) d'un coin de feuille. */
function Cross({ corner }: { corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  return (
    <svg className={`cross cross-${corner}`} viewBox="0 0 26 26" aria-hidden="true">
      <circle cx="13" cy="13" r="6.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M13 0v26M0 13h26" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function Crosses() {
  return (
    <div className="crosses" aria-hidden="true">
      <Cross corner="tl" />
      <Cross corner="tr" />
      <Cross corner="bl" />
      <Cross corner="br" />
    </div>
  )
}

/** Une feuille de plan : cadre fin, double filet et croix de repérage aux quatre coins. */
export function Sheet({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`sheet ${className}`}>
      <Crosses />
      {children}
    </div>
  )
}

interface SectionHeadProps {
  title: string
  intro: string
  headingId: string
}

/** En-tête de section : « / Titre », sans numéro, suivi d'une phrase à la première personne. */
export function SectionHead({ title, intro, headingId }: SectionHeadProps) {
  return (
    <Reveal className="section-head">
      <h2 id={headingId}>
        <span className="slash" aria-hidden="true">/</span>
        {title}
      </h2>
      {intro && <p className="section-intro">{intro}</p>}
    </Reveal>
  )
}

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="tags">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

/** Bouton ou lien en crochets : [ Libellé ] suivi d'une icône facultative. */
export function BracketLabel({ children }: { children: ReactNode }) {
  return <span className="bracket-label">{children}</span>
}
