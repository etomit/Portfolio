import { useEffect, useRef, type ReactNode } from 'react'
import { CloseIcon } from '../components/icons'
import { useI18n } from '../i18n'

interface GameModalProps {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
}

/** Fenêtre modale commune aux mini-jeux : Échap pour fermer, focus rendu à la page ensuite. */
export function GameModal({ title, subtitle, onClose, children }: GameModalProps) {
  const { t } = useI18n()
  const dialogRef = useRef<HTMLDivElement>(null)
  // Référence stable : l'effet ci-dessous ne doit pas se relancer à chaque rendu du parent.
  const closeRef = useRef(onClose)
  useEffect(() => { closeRef.current = onClose }, [onClose])

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Le focus va sur la fenêtre elle-même : la touche Entrée reste disponible pour le jeu.
    dialogRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRef.current()
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
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-modal-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-head">
          <div>
            <h2 id="game-modal-title">{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="tool-button" onClick={onClose} aria-label={t.a11y.close}>
            <CloseIcon />
          </button>
        </header>
        {children}
      </div>
    </div>
  )
}
