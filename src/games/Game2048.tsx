import { useCallback, useEffect, useReducer, useRef } from 'react'
import { useI18n } from '../i18n'
import { GameModal } from './GameModal'

type Grid = number[][]
type Direction = 'left' | 'right' | 'up' | 'down'
type Status = 'playing' | 'won' | 'lost'

const SIZE = 4
const BEST_KEY = '2048-best'

/** Deux tirages aléatoires par tuile : la case libre choisie, puis la valeur (2 ou 4). */
type Roll = [pick: number, value: number]
const roll = (): Roll => [Math.random(), Math.random()]

function addTile(grid: Grid, [pick, value]: Roll): Grid {
  const empties: Array<[number, number]> = []
  grid.forEach((row, r) => row.forEach((cell, c) => { if (cell === 0) empties.push([r, c]) }))
  if (empties.length === 0) return grid
  const [r, c] = empties[Math.floor(pick * empties.length)]
  const next = grid.map((row) => [...row])
  next[r][c] = value < 0.9 ? 2 : 4
  return next
}

function slideRow(row: number[]): { row: number[]; gained: number } {
  const tiles = row.filter((value) => value !== 0)
  const merged: number[] = []
  let gained = 0
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] === tiles[i + 1]) {
      merged.push(tiles[i] * 2)
      gained += tiles[i] * 2
      i++
    } else {
      merged.push(tiles[i])
    }
  }
  while (merged.length < SIZE) merged.push(0)
  return { row: merged, gained }
}

const rotate = (grid: Grid): Grid => grid[0].map((_, c) => grid.map((row) => row[c]).reverse())

/** Tout mouvement se ramène à un glissement vers la gauche, à quelques quarts de tour près. */
const TURNS: Record<Direction, number> = { left: 0, down: 1, right: 2, up: 3 }

function slide(grid: Grid, direction: Direction) {
  const turns = TURNS[direction]
  let working = grid
  for (let i = 0; i < turns; i++) working = rotate(working)
  let gained = 0
  working = working.map((row) => {
    const result = slideRow(row)
    gained += result.gained
    return result.row
  })
  for (let i = 0; i < (4 - turns) % 4; i++) working = rotate(working)
  const moved = working.some((row, r) => row.some((value, c) => value !== grid[r][c]))
  return { grid: working, gained, moved }
}

function canMove(grid: Grid) {
  return grid.some((row, r) =>
    row.some((value, c) => value === 0 || value === row[c + 1] || value === grid[r + 1]?.[c]),
  )
}

interface State { grid: Grid; score: number; best: number; status: Status }
type Action = { type: 'move'; direction: Direction; roll: Roll } | { type: 'restart'; rolls: [Roll, Roll] }

function newGrid([first, second]: [Roll, Roll]): Grid {
  const empty = Array.from({ length: SIZE }, () => Array<number>(SIZE).fill(0))
  return addTile(addTile(empty, first), second)
}

function reducer(state: State, action: Action): State {
  if (action.type === 'restart') {
    return { grid: newGrid(action.rolls), score: 0, best: state.best, status: 'playing' }
  }
  if (state.status !== 'playing') return state
  const { grid: slid, gained, moved } = slide(state.grid, action.direction)
  if (!moved) return state
  const grid = addTile(slid, action.roll)
  const score = state.score + gained
  const won = grid.some((row) => row.some((value) => value >= 2048))
  return { grid, score, best: Math.max(state.best, score), status: won ? 'won' : canMove(grid) ? 'playing' : 'lost' }
}

function initialState(): State {
  let best = 0
  try {
    best = Number.parseInt(localStorage.getItem(BEST_KEY) ?? '0', 10) || 0
  } catch {
    // stockage indisponible : le record ne sera simplement pas mémorisé
  }
  return { grid: newGrid([roll(), roll()]), score: 0, best, status: 'playing' }
}

const KEYS: Record<string, Direction> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' }

export default function Game2048({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const move = useCallback((direction: Direction) => dispatch({ type: 'move', direction, roll: roll() }), [])
  const restart = () => dispatch({ type: 'restart', rolls: [roll(), roll()] })

  useEffect(() => {
    try {
      localStorage.setItem(BEST_KEY, String(state.best))
    } catch {
      // stockage indisponible
    }
  }, [state.best])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const direction = KEYS[event.key]
      if (!direction) return
      event.preventDefault()
      move(direction)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [move])

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const dx = event.changedTouches[0].clientX - start.x
    const dy = event.changedTouches[0].clientY - start.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left')
    else move(dy > 0 ? 'down' : 'up')
  }

  return (
    <GameModal title="2048" subtitle={t.games.hint2048} onClose={onClose}>
      <div className="g2048-bar">
        <p><span>{t.games.score}</span><strong>{state.score}</strong></p>
        <p><span>{t.games.best}</span><strong>{state.best}</strong></p>
        <button type="button" className="bracket bracket-small" onClick={restart}><span className="bracket-label">{t.games.newGame}</span></button>
      </div>

      <div
        className="g2048-board"
        onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY } }}
        onTouchEnd={onTouchEnd}
      >
        {state.grid.flat().map((value, index) => (
          // La clé inclut la valeur : une tuile qui change est remontée et rejoue son animation.
          <span key={`${index}-${value}`} className="g2048-tile" data-value={value}>{value || ''}</span>
        ))}
        {state.status !== 'playing' && (
          <div className="game-result" role="status">
            <p>{state.status === 'won' ? t.games.won : t.games.lost}</p>
            <button type="button" className="bracket bracket-small" onClick={restart}><span className="bracket-label">{t.games.retry}</span></button>
          </div>
        )}
      </div>
    </GameModal>
  )
}
