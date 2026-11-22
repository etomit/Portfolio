import type { ReactNode } from 'react'
import { Dialog } from '../components/Dialog'

interface GameModalProps {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
}

/** Fenêtre des mini-jeux : la même feuille que les fiches projets, en plus étroit. */
export function GameModal({ title, subtitle, onClose, children }: GameModalProps) {
  return (
    <Dialog title={title} subtitle={subtitle} onClose={onClose} className="modal-game">
      {children}
    </Dialog>
  )
}
