import { useEffect, useRef, useState, type ReactNode } from 'react'
import { SAMPLE_DATA } from '../../data/metrics'
import DotText from '../glass/DotText'
import { Grain } from '../glass/Grain'
import { gc } from '../glass/dots'
import '../glass/glass.css'
import './charts.css'

export { BarChart, DonutChart, LineChart, RadarChart, RadialChart } from './ApexKit'
export type { BarRow, LineSeries } from './ApexKit'

/* ---------- helpers ---------- */
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useSize(ref: React.RefObject<HTMLElement | null>) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return w
}

function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.35) {
  // reduced motion: everything is drawn from the start
  const [seen, setSeen] = useState(reducedMotion)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, seen, threshold])
  return seen
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

/** 0 → 1 over `dur` ms once `run` turns true (eased). Drives the counting numbers. */
function useProgress(run: boolean, dur = 1300, delay = 0) {
  const [t, setT] = useState(() => (reducedMotion() ? 1 : 0))
  useEffect(() => {
    if (!run) return
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const p = Math.min(1, Math.max(0, (now - start - delay) / dur))
      setT(p)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, dur, delay])
  return easeOut(t)
}

const SURFACE = '#ffffff'

/* ---------- small pieces ---------- */
export function SampleBadge() {
  if (!SAMPLE_DATA) return null
  return (
    <span className="ch-sample" title="Placeholder figures — replace in src/data/metrics.ts">
      Sample data
    </span>
  )
}

export function Legend({ items }: { items: { name: string; color: string }[] }) {
  return (
    <ul className="ch-legend">
      {items.map((i) => (
        <li key={i.name}>
          <span className="ch-key" style={{ background: i.color }} />
          {i.name}
        </li>
      ))}
    </ul>
  )
}

export function ChartCard({
  title,
  sub,
  legend,
  children,
  table,
  className = '',
  id,
}: {
  title: string
  sub?: string
  legend?: { name: string; color: string }[]
  children: ReactNode
  table?: { head: string[]; rows: (string | number)[][] }
  className?: string
  id?: string
}) {
  // bumping `run` remounts the plot, so its draw-in animation plays again
  const [run, setRun] = useState(0)
  return (
    <figure className={`ch-card ${className}`} id={id}>
      <figcaption className="ch-head">
        <div>
          <h3>{title}</h3>
          {sub && <p>{sub}</p>}
        </div>
        <div className="ch-head__side">
          <SampleBadge />
          <button className="ch-replay" onClick={() => setRun((r) => r + 1)} aria-label={`Replay the ${title} chart animation`} title="Replay animation">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12a8 8 0 1 0 2.4-5.7" />
              <path d="M4 4v4.5h4.5" />
            </svg>
          </button>
        </div>
      </figcaption>
      {legend && legend.length > 1 && <Legend items={legend} />}
      <div key={run} className="ch-body">
        {children}
      </div>
      {table && (
        <details className="ch-table">
          <summary>View as table</summary>
          <table>
            <thead>
              <tr>
                {table.head.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, k) => (
                    <td key={k}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </figure>
  )
}

/** Counts the first number in `value` up from zero when the tile scrolls into view ("₹43k", "1,240", "−76%"). */
export function StatTile({ label, value, note, i = 0 }: { label: string; value: string; note?: string; i?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, 0.5)
  const p = useProgress(seen, 1400)
  const m = value.match(/\d[\d,]*(\.\d+)?/)
  let shown = value
  let cur = ''
  if (m && m.index !== undefined) {
    const raw = m[0]
    const target = parseFloat(raw.replace(/,/g, ''))
    const dec = m[1] ? m[1].length - 1 : 0
    cur = (target * p).toLocaleString('en-US', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
      useGrouping: raw.includes(','),
    })
    shown = value.slice(0, m.index) + cur + value.slice(m.index + raw.length)
  }
  return (
    <div className={`ch-stat ${gc(i, 'gc--dense')}${seen ? ' is-seen' : ''}`} ref={ref}>
      <p className="ch-stat__label">{label}</p>
      <p className="ch-stat__value" aria-label={value}>
        <span className="sr-only">{shown}</span>
        {m && m.index !== undefined ? (
          <span className="ch-stat__dots" aria-hidden="true">
            {value.slice(0, m.index) && <span className="ch-stat__unit">{value.slice(0, m.index)}</span>}
            <DotText text={cur} r={1.75} />
            {value.slice(m.index + m[0].length) && <span className="ch-stat__unit">{value.slice(m.index + m[0].length)}</span>}
          </span>
        ) : (
          <span aria-hidden="true">{shown}</span>
        )}
      </p>
      {note && <p className="ch-stat__note">{note}</p>}
      <span className="ch-stat__bar" aria-hidden="true" />
      <Grain />
    </div>
  )
}

interface Tip {
  x: number
  y: number
  title: string
  rows: { name: string; color: string; value: string }[]
}

function Tooltip({ tip }: { tip: Tip | null }) {
  if (!tip) return null
  return (
    <div className="ch-tip" style={{ left: tip.x, top: tip.y }} role="status">
      <p className="ch-tip__t">{tip.title}</p>
      {tip.rows.map((r) => (
        <p key={r.name} className="ch-tip__r">
          <span className="ch-key" style={{ background: r.color }} />
          <span>{r.name}</span>
          <b>{r.value}</b>
        </p>
      ))}
    </div>
  )
}

/* ---------- 90-day uptime strip ---------- */
export function UptimeBars({ days }: { days: number[] }) {
  const [tip, setTip] = useState<Tip | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const w = useSize(box)
  const seen = useInView(box)
  const p = useProgress(seen, 1600, 300)
  const status = (v: number) =>
    v >= 100 ? { c: '#0ca30c', n: 'Operational' } : v >= 99.9 ? { c: '#fab219', n: 'Minor degradation' } : { c: '#ec835a', n: 'Partial outage' }
  const avg = days.reduce((a, b) => a + b, 0) / days.length
  return (
    <div className="ch-plot" ref={box}>
      <div className={`ch-uptime${seen ? ' is-seen' : ''}`} onPointerLeave={() => setTip(null)}>
        {days.map((v, i) => {
          const s = status(v)
          return (
            <span
              key={i}
              style={{ background: s.c, '--i': i } as React.CSSProperties}
              onPointerMove={(e) => {
                const r = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect()
                setTip({
                  x: Math.max(0, Math.min(e.clientX - r.left + 10, w - 230)),
                  y: -70,
                  title: `${90 - i} days ago`,
                  rows: [{ name: s.n, color: s.c, value: `${v.toFixed(2)}%` }],
                })
              }}
            />
          )
        })}
      </div>
      <div className="ch-uptime__axis">
        <span>90 days ago</span>
        <b>{(avg * p).toFixed(3)}% uptime</b>
        <span>Today</span>
      </div>
      <ul className="ch-legend ch-legend--status">
        <li>
          <span className="ch-ico" style={{ background: '#0ca30c' }}>✓</span>Operational
        </li>
        <li>
          <span className="ch-ico" style={{ background: '#fab219', color: '#1c140d' }}>!</span>Minor degradation
        </li>
        <li>
          <span className="ch-ico" style={{ background: '#ec835a' }}>×</span>Partial outage
        </li>
      </ul>
      <Tooltip tip={tip} />
    </div>
  )
}

/* ---------- Tiny self-drawing sparkline (used on teaser cards) ---------- */
export function Sparkline({ values, color = '#e8590c', height = 56 }: { values: number[]; color?: string; height?: number }) {
  const box = useRef<HTMLDivElement>(null)
  const w = useSize(box)
  const seen = useInView(box, 0.6)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const pad = 6
  const sx = (i: number) => pad + (i / (values.length - 1)) * (w - pad * 2)
  const sy = (v: number) => pad + (1 - (v - min) / Math.max(1e-9, max - min)) * (height - pad * 2)
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join('')
  const last = values.length - 1
  return (
    <div className="ch-spark" ref={box} aria-hidden="true">
      {w > 0 && (
        <svg width={w} height={height} className={seen ? 'is-seen' : ''}>
          <path d={`${d}L${sx(last)},${height}L${sx(0)},${height}Z`} fill={color} className="ch-area" fillOpacity="0.12" />
          <path d={d} pathLength={1} fill="none" stroke={color} className="ch-line" />
          <circle cx={sx(last)} cy={sy(values[last])} r={3.5} fill={color} stroke={SURFACE} strokeWidth={2} className="ch-end" />
          {seen && <circle cx={sx(last)} cy={sy(values[last])} r={3.5} fill="none" stroke={color} className="ch-pulse" />}
        </svg>
      )}
    </div>
  )
}
