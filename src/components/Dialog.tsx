import { useEffect, useRef, type ReactNode } from 'react'
import { useI18n } from '../i18n'
import { CloseIcon } from './icons'
import { Crosses } from './Reveal'

interface DialogProps {
  title: string
  /** Petite ligne au-dessus du titre, ex. « / Projets ». */
  kicker?: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  className?: string
}

/**
 * Fenêtre modale au format feuille de plan : Échap ou clic à côté pour fermer,
 * défilement de la page bloqué, focus rendu à l'élément d'origine à la fermeture.
 */
export function Dialog({ title, kicker, subtitle, onClose, children, className = '' }: DialogProps) {
  const { t } = useI18n()
  const dialogRef = useRef<HTMLDivElement>(null)
  // Seule la zone intérieure défile : les croix du cadre peuvent ainsi déborder du bord sans être coupées.
  const scrollRef = useRef<HTMLDivElement>(null)
  // Référence stable : l'effet ci-dessous ne doit pas se relancer à chaque rendu du parent.
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Le focus va sur la zone défilante : la touche Entrée reste disponible pour les jeux,
    // et les flèches font défiler une fiche longue.
    scrollRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current()
      // Garde le focus dans la fenêtre.
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && (document.activeElement === first || document.activeElement === scrollRef.current)) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={dialogRef}
        className={`modal ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <Crosses />
        <div ref={scrollRef} className="modal-scroll" tabIndex={-1}>
          <header className="modal-head">
            <div>
              {kicker && <p className="modal-kicker label">{kicker}</p>}
              <h2 id="modal-title">{title}</h2>
              {subtitle && <p className="modal-subtitle">{subtitle}</p>}
            </div>
            <button type="button" className="tool-button" onClick={onClose} aria-label={t.a11y.close}>
              <CloseIcon />
            </button>
          </header>
          {children}
        </div>
      </div>
    </div>
  )
}
