import { useCallback, useEffect, useState } from 'react'
import { useI18n } from './i18n'

type Grid = number[][]

const SIZE = 4

function createEmpty(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0))
}

function addRandom(grid: Grid): Grid {
  const g = grid.map((r) => [...r])
  const empties: [number, number][] = []
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (g[r][c] === 0) empties.push([r, c])
  if (empties.length === 0) return g
  const [r, c] = empties[Math.floor(Math.random() * empties.length)]
  g[r][c] = Math.random() < 0.9 ? 2 : 4
  return g
}

function initGrid(): Grid {
  return addRandom(addRandom(createEmpty()))
}

function slideRow(row: number[]): { row: number[]; score: number } {
  const filtered = row.filter((v) => v !== 0)
  let score = 0
  const merged: number[] = []
  let i = 0
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      merged.push(filtered[i] * 2)
      score += filtered[i] * 2
      i += 2
    } else {
      merged.push(filtered[i])
      i++
    }
  }
  while (merged.length < SIZE) merged.push(0)
  return { row: merged, score }
}

function moveLeft(grid: Grid): { grid: Grid; score: number; moved: boolean } {
  let score = 0
  let moved = false
  const next = grid.map((row) => {
    const { row: newRow, score: s } = slideRow(row)
    score += s
    if (newRow.some((v, i) => v !== row[i])) moved = true
    return newRow
  })
  return { grid: next, score, moved }
}

function rotate90(grid: Grid): Grid {
  return grid[0].map((_, c) => grid.map((row) => row[c]).reverse())
}

function move(grid: Grid, dir: 'left' | 'right' | 'up' | 'down'): { grid: Grid; score: number; moved: boolean } {
  let g = grid
  let rotations = 0
  if (dir === 'right') rotations = 2
  if (dir === 'up') rotations = 3
  if (dir === 'down') rotations = 1
  for (let i = 0; i < rotations; i++) g = rotate90(g)
  const result = moveLeft(g)
  let ng = result.grid
  const reverseRots = (4 - rotations) % 4
  for (let i = 0; i < reverseRots; i++) ng = rotate90(ng)
  return { grid: ng, score: result.score, moved: result.moved }
}

function hasWon(grid: Grid): boolean {
  return grid.some((row) => row.some((v) => v >= 2048))
}

function canMove(grid: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return true
      if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true
      if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true
    }
  }
  return false
}

const tileColors: Record<number, { bg: string; color: string }> = {
  0:    { bg: 'rgba(255,255,255,0.04)', color: 'transparent' },
  2:    { bg: '#1e3a5f', color: '#c8deff' },
  4:    { bg: '#1a4a7a', color: '#bdd6ff' },
  8:    { bg: '#1a5fa8', color: '#fff' },
  16:   { bg: '#2171c8', color: '#fff' },
  32:   { bg: '#2585e8', color: '#fff' },
  64:   { bg: '#1a9fd4', color: '#fff' },
  128:  { bg: '#17b8c4', color: '#fff' },
  256:  { bg: '#14c89c', color: '#fff' },
  512:  { bg: '#12d47a', color: '#fff' },
  1024: { bg: '#4de04c', color: '#0a1a0a' },
  2048: { bg: 'linear-gradient(135deg, #ffd700, #ff8c00)', color: '#1a0a00' },
}

function getTileStyle(val: number): React.CSSProperties {
  const t = tileColors[val] ?? { bg: '#ff4444', color: '#fff' }
  return {
    background: t.bg,
    color: t.color,
    fontSize: val >= 1024 ? '1.1rem' : val >= 128 ? '1.35rem' : '1.7rem',
  }
}

interface Props {
  onClose: () => void
}

export default function Game2048({ onClose }: Props) {
  const { t } = useI18n()
  const [grid, setGrid] = useState<Grid>(initGrid)
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => {
    try { return parseInt(localStorage.getItem('2048-best') ?? '0', 10) } catch { return 0 }
  })
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)

  const updateBest = (newScore: number) => {
    setBest(prev => {
      const next = Math.max(prev, newScore)
      try { localStorage.setItem('2048-best', String(next)) } catch {}
      return next
    })
  }

  const restart = () => {
    setGrid(initGrid())
    setScore(0)
    setStatus('playing')
  }

  const handleMove = useCallback(
    (dir: 'left' | 'right' | 'up' | 'down') => {
      if (status !== 'playing') return
      setGrid((prev) => {
        const { grid: ng, score: s, moved } = move(prev, dir)
        if (!moved) return prev
        setScore((sc) => {
          const next = sc + s
          updateBest(next)
          return next
        })
        const withNew = addRandom(ng)
        if (hasWon(withNew)) setStatus('won')
        else if (!canMove(withNew)) setStatus('lost')
        return withNew
      })
    },
    [status]
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, 'left' | 'right' | 'up' | 'down'> = {
        ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
      }
      if (map[e.key]) { e.preventDefault(); handleMove(map[e.key]) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleMove])

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return
    const dx = e.changedTouches[0].clientX - touchStart.x
    const dy = e.changedTouches[0].clientY - touchStart.y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)
    if (Math.max(absDx, absDy) < 30) return
    if (absDx > absDy) handleMove(dx > 0 ? 'right' : 'left')
    else handleMove(dy > 0 ? 'down' : 'up')
    setTouchStart(null)
  }

  return (
    <div className="game-modal-overlay" onClick={onClose}>
      <div className="game-modal" onClick={(e) => e.stopPropagation()}>
        <div className="game-header">
          <div className="game-title-row">
            <h2 className="game-title">2048</h2>
            <button className="game-close" onClick={onClose}>✕</button>
          </div>
          <div className="g2048-scores">
            <div className="g2048-score-box">
              <span className="score-label">{t.games.score}</span>
              <span className="score-val">{score}</span>
            </div>
            <div className="g2048-score-box">
              <span className="score-label">{t.games.best}</span>
              <span className="score-val">{best}</span>
            </div>
            <button className="g2048-new" onClick={restart}>{t.games.newGame}</button>
          </div>
        </div>

        {status !== 'playing' && (
          <div className="game-overlay-msg">
            <p>{status === 'won' ? t.games.won : t.games.lost}</p>
            <button className="btn-primary" onClick={restart}>{t.games.retry}</button>
          </div>
        )}

        <div
          className="g2048-grid"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {grid.map((row, r) =>
            row.map((val, c) => (
              <div
                key={`${r}-${c}`}
                className={`g2048-tile ${val > 0 ? 'g2048-tile--filled' : ''}`}
                style={getTileStyle(val)}
              >
                {val > 0 ? val : ''}
              </div>
            ))
          )}
        </div>
        <p className="game-hint">{t.games.hint2048}</p>
      </div>
    </div>
  )
}