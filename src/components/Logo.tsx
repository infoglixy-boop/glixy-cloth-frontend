import { useEffect, useRef, useState } from 'react'
import './logo.css'

/*
 * The Glixy mark: a single orange G. When it opens, L I X Y slide out from
 * behind it and the dot hops across onto the "i". Closing folds them back.
 *
 * mode "auto"   → opens shortly after mount, replays on hover and when `replayKey` changes
 * mode "toggle" → click to open / close (the logo is its own button)
 */
type Props = {
  height?: number
  mode?: 'auto' | 'toggle'
  replayKey?: string
  className?: string
  label?: string
  /** auto mode: wait until the logo scrolls into view before opening */
  onView?: boolean
}

const LETTERS = [
  { d: 'M144 0V92H214', from: -36, open: 0, close: 0.12 },
  { d: 'M248 32V100', from: -140, open: 0.04, close: 0.08 },
  { d: 'M293 0L381 100M381 0L293 100', from: -200, open: 0.08, close: 0.04 },
  { d: 'M428 0L473 52L518 0M473 52V100', from: -330, open: 0.12, close: 0 },
]

export default function Logo({ height = 30, mode = 'auto', replayKey, className = '', label = 'Glixy', onView = false }: Props) {
  const [open, setOpen] = useState(false)
  const [played, setPlayed] = useState(false)
  const busy = useRef(false)
  const mounted = useRef(false)
  const root = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(!onView)

  useEffect(() => {
    if (visible || !root.current) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.4 })
    io.observe(root.current)
    return () => io.disconnect()
  }, [visible])
  const timers = useRef<number[]>([])

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))

  // auto mode: open after mount, and replay (fold → open) whenever replayKey changes
  useEffect(() => {
    if (mode !== 'auto' || !visible) return
    const list = timers.current
    let t2 = 0
    const first = !mounted.current
    // first run: just open. Later runs (route change): fold, then open again.
    const t1 = window.setTimeout(
      () => {
        setPlayed(true)
        mounted.current = true
        if (first) {
          setOpen(true)
          return
        }
        setOpen(false)
        t2 = window.setTimeout(() => setOpen(true), 560)
      },
      first ? 450 : 80,
    )
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      list.forEach(clearTimeout)
    }
  }, [mode, replayKey, visible])

  const replay = () => {
    if (mode !== 'auto' || busy.current || !open) return
    busy.current = true
    setPlayed(true)
    setOpen(false)
    later(() => setOpen(true), 560)
    later(() => (busy.current = false), 1300)
  }

  const svg = (
    <svg viewBox="-4 -4 540 108" style={{ height }} aria-hidden="true">
      <path className="glogo__ink" d="M93.5 25.9A47 42 0 1 0 102 50H62" />
      {LETTERS.map((l) => (
        <g
          key={l.d}
          className="glogo__letter"
          style={{ '--from': `${l.from}px`, '--open-delay': `${l.open}s`, '--close-delay': `${l.close}s` } as React.CSSProperties}
        >
          <path className="glogo__ink" d={l.d} />
        </g>
      ))}
      <g className="glogo__dot-x">
        <g className={`glogo__dot-y${played ? ' played' : ''}${played && !open ? ' closing' : ''}`}>
          <circle cx="248" cy="12" r="10" />
        </g>
      </g>
    </svg>
  )

  if (mode === 'toggle') {
    return (
      <button
        type="button"
        className={`glogo glogo--btn${open ? ' is-open' : ''} ${className}`}
        aria-label={label}
        aria-expanded={open}
        onClick={() => {
          setPlayed(true)
          setOpen((o) => !o)
        }}
      >
        {svg}
      </button>
    )
  }

  return (
    <span ref={root} className={`glogo${open ? ' is-open' : ''} ${className}`} onMouseEnter={replay} role="img" aria-label={label}>
      {svg}
    </span>
  )
}
