import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Décalage en millisecondes, pour échelonner plusieurs blocs voisins. */
  delay?: number
}

/** Fait apparaître son contenu la première fois qu'il entre dans la fenêtre. */
export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
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
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}

/** Nom d'un « arrêt » : chaque section en est un sur la ligne qui longe la page. */
export function Stop({ children, terminus = false }: { children: ReactNode; terminus?: boolean }) {
  return (
    <p className={`stop ${terminus ? 'stop-terminus' : ''}`}>
      <span className="stop-dot" aria-hidden="true" />
      {children}
    </p>
  )
}

interface SectionHeadProps {
  title: string
  intro: string
  headingId: string
}

/** En-tête de section : le titre est le nom de l'arrêt, suivi d'un paragraphe écrit à la première personne. */
export function SectionHead({ title, intro, headingId }: SectionHeadProps) {
  return (
    <Reveal className="section-head">
      <h2 id={headingId} className="stop-title">
        <span className="stop-dot" aria-hidden="true" />
        {title}
      </h2>
      <p className="section-intro">{intro}</p>
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
