import { useCallback, useEffect, useState } from 'react'
import { useI18n } from '../i18n'
import { GameModal } from './GameModal'
import { WORDS_EN, WORDS_FR } from './words'

type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'active'
interface Cell { letter: string; state: LetterState }

const ROWS = 6
const COLS = 5
const REVEAL_DELAY = COLS * 120 + 100
/** Du meilleur indice au moins bon : une touche garde toujours son meilleur état connu. */
const STATE_RANK: LetterState[] = ['correct', 'present', 'absent', 'empty', 'active']

const KEYBOARDS = {
  fr: [
    ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
    ['ENTER', 'W', 'X', 'C', 'V', 'B', 'N', 'BACKSPACE'],
  ],
  en: [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
  ],
}

const emptyBoard = (): Cell[][] =>
  Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => ({ letter: '', state: 'empty' as LetterState })))

const pickWord = (words: string[]) => words[Math.floor(Math.random() * words.length)].toUpperCase()

/** Compare une proposition au mot cherché, en gérant correctement les lettres en double. */
function scoreGuess(guess: string, target: string): LetterState[] {
  const result: LetterState[] = Array(COLS).fill('absent')
  const remaining = target.split('')
  for (let i = 0; i < COLS; i++) {
    if (guess[i] === target[i]) {
      result[i] = 'correct'
      remaining[i] = ''
    }
  }
  for (let i = 0; i < COLS; i++) {
    if (result[i] === 'correct') continue
    const found = remaining.indexOf(guess[i])
    if (found !== -1) {
      result[i] = 'present'
      remaining[found] = ''
    }
  }
  return result
}

export default function WordleGame({ onClose }: { onClose: () => void }) {
  const { lang } = useI18n()
  // Changer de langue change de dictionnaire : la clé remet la partie à zéro.
  return <WordleBoard key={lang} onClose={onClose} />
}

function WordleBoard({ onClose }: { onClose: () => void }) {
  const { lang, t } = useI18n()
  const words = lang === 'fr' ? WORDS_FR : WORDS_EN

  const [target, setTarget] = useState(() => pickWord(words))
  const [board, setBoard] = useState(emptyBoard)
  const [row, setRow] = useState(0)
  const [col, setCol] = useState(0)
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [keyStates, setKeyStates] = useState<Record<string, LetterState>>({})
  const [revealing, setRevealing] = useState<number | null>(null)
  const [shake, setShake] = useState(false)
  const [unknownWord, setUnknownWord] = useState(false)

  const restart = () => {
    setTarget(pickWord(words))
    setBoard(emptyBoard())
    setRow(0)
    setCol(0)
    setStatus('playing')
    setKeyStates({})
    setRevealing(null)
  }

  const setCell = (r: number, c: number, cell: Cell) =>
    setBoard((previous) => previous.map((line, i) => (i === r ? line.map((old, j) => (j === c ? cell : old)) : line)))

  const reject = useCallback((unknown: boolean) => {
    setShake(true)
    setUnknownWord(unknown)
    window.setTimeout(() => {
      setShake(false)
      setUnknownWord(false)
    }, unknown ? 1200 : 500)
  }, [])

  const submit = useCallback(() => {
    if (col !== COLS) return reject(false)
    const guess = board[row].map((cell) => cell.letter).join('')
    if (!words.includes(guess.toLowerCase())) return reject(true)

    const result = scoreGuess(guess, target)
    setRevealing(row)
    window.setTimeout(() => {
      setBoard((previous) =>
        previous.map((line, i) => (i === row ? line.map((cell, j) => ({ ...cell, state: result[j] })) : line)),
      )
      setKeyStates((previous) => {
        const next = { ...previous }
        result.forEach((state, i) => {
          const letter = guess[i]
          if (!next[letter] || STATE_RANK.indexOf(state) < STATE_RANK.indexOf(next[letter])) next[letter] = state
        })
        return next
      })
      setRevealing(null)
      if (guess === target) setStatus('won')
      else if (row + 1 >= ROWS) setStatus('lost')
      else {
        setRow(row + 1)
        setCol(0)
      }
    }, REVEAL_DELAY)
  }, [board, col, reject, row, target, words])

  const press = useCallback(
    (key: string) => {
      if (status !== 'playing' || revealing !== null) return
      if (key === 'ENTER') submit()
      else if (key === 'BACKSPACE') {
        if (col === 0) return
        setCell(row, col - 1, { letter: '', state: 'empty' })
        setCol(col - 1)
      } else if (/^[A-Z]$/.test(key) && col < COLS) {
        setCell(row, col, { letter: key, state: 'active' })
        setCol(col + 1)
      }
    },
    [col, revealing, row, status, submit],
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.altKey || event.metaKey) return
      // Entrée sur un bouton doit activer ce bouton, pas valider le mot en plus.
      if (event.key === 'Enter' && (event.target as HTMLElement).closest('button')) return
      press(event.key.toUpperCase())
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [press])

  return (
    <GameModal title="Wordle" subtitle={t.games.wordleHint} onClose={onClose}>
      <div className="wl-board">
        {board.map((line, r) => (
          <div key={r} className={`wl-row ${r === row && shake ? 'is-shaking' : ''} ${revealing === r ? 'is-revealing' : ''}`}>
            {line.map((cell, c) => (
              <span key={c} className="wl-cell" data-state={cell.state} style={{ animationDelay: `${c * 120}ms` }}>
                {cell.letter}
              </span>
            ))}
          </div>
        ))}
        {unknownWord && <p className="wl-toast" role="status">{t.games.wordleUnknown}</p>}
        {status !== 'playing' && (
          <div className="game-result" role="status">
            <p>{status === 'won' ? t.games.won : `${t.games.wordleAnswer} ${target}`}</p>
            <button type="button" className="bracket bracket-small" onClick={restart}><span className="bracket-label">{t.games.retry}</span></button>
          </div>
        )}
      </div>

      <div className="wl-keyboard">
        {KEYBOARDS[lang].map((keys, index) => (
          <div key={index} className="wl-keys">
            {keys.map((key) => (
              <button
                key={key}
                type="button"
                className={`wl-key ${key.length > 1 ? 'is-wide' : ''}`}
                data-state={keyStates[key]}
                aria-label={key === 'ENTER' ? t.games.enter : key === 'BACKSPACE' ? t.games.backspace : undefined}
                // Un clic de souris ne donne pas le focus à la touche : sinon l'Entrée du clavier physique
                // réactiverait cette touche au lieu de valider le mot.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => press(key)}
              >
                {key === 'ENTER' ? '↵' : key === 'BACKSPACE' ? '⌫' : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </GameModal>
  )
}
