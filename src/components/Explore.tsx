import { BENCH_INDEX, CUSTOMER_MIX, MRR, SAMPLE_DATA, SERIES, TRAIN_TIME } from '../data/metrics'
import { Sparkline } from './charts/Charts'
import CountUp from './glass/CountUp'
import Link from './Link'
import { gc } from './glass/dots'
import { Grain } from './glass/Grain'
import './glass/glass.css'
import './explore.css'

const avg = (a: number[]) => a.reduce((x, y) => x + y, 0) / a.length

const CARDS = [
  {
    to: '/benchmarks',
    k: 'Benchmarks',
    stat: `${(avg(BENCH_INDEX.series.glixy) / 100).toFixed(1)}×`,
    note: 'throughput vs a public-cloud VM',
    spark: null,
    bars: (['glixy', 'cloud', 'vps'] as const).map((k) => ({ ...SERIES[k], value: avg(BENCH_INDEX.series[k]) })),
  },
  {
    to: '/ai',
    k: 'AI Training',
    stat: `${(TRAIN_TIME.series.glixy![0] / TRAIN_TIME.series.glixy![3]).toFixed(1)}× faster`,
    note: `fine-tuning on ${TRAIN_TIME.x[3]} GPUs vs 1 — near-linear scaling`,
    spark: TRAIN_TIME.series.glixy!.map((h) => TRAIN_TIME.series.glixy![0] / h),
  },
  {
    to: '/customers',
    k: 'Customers',
    stat: `${CUSTOMER_MIX.length} segments`,
    note: 'from students to banks and studios',
    spark: null,
    mix: true,
  },
  {
    to: '/trust',
    k: 'Trust',
    stat: `${(MRR.values[MRR.values.length - 1] / MRR.values[0]).toFixed(1)}×`,
    note: 'revenue growth in 12 months',
    spark: MRR.values,
  },
  {
    to: '/mission',
    k: 'Mission',
    stat: 'Own the metal',
    note: 'why Glixy exists, and what we promise',
    spark: null,
  },
]

// gentle 3D tilt that follows the pointer
const tilt = (e: React.PointerEvent<HTMLElement>) => {
  if (e.pointerType !== 'mouse') return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  el.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`)
  el.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`)
  el.style.setProperty('--mx', `${((x + 0.5) * 100).toFixed(1)}%`)
  el.style.setProperty('--my', `${((y + 0.5) * 100).toFixed(1)}%`)
}
const untilt = (e: React.PointerEvent<HTMLElement>) => {
  const el = e.currentTarget
  el.style.setProperty('--rx', '0deg')
  el.style.setProperty('--ry', '0deg')
}

export default function Explore() {
  return (
    <section className="sec sec--tint" id="explore" aria-labelledby="explore-title">
      <div className="sec__inner">
        <header className="sec__head">
          <span className="eyebrow">Explore Glixy</span>
          <h2 id="explore-title">The numbers, the people, the promise.</h2>
          <p>Each part of Glixy has its own page — open one to see the full charts and details.</p>
        </header>
        <ul className="xp">
          {CARDS.map((c, i) => (
            <li key={c.to} style={{ '--i': i } as React.CSSProperties}>
              <Link
                to={c.to}
                className={`xp__card ${gc(i, 'gc--live')}`}
                style={{ '--i': i } as React.CSSProperties}
                onPointerMove={tilt}
                onPointerLeave={untilt}
              >
                <span className="xp__k">
                  {c.k}
                  <svg viewBox="0 0 18 10" aria-hidden="true">
                    <path d="M13 1l4 4-4 4M17 5H1" />
                  </svg>
                </span>
                <b className="xp__stat">
                  <CountUp value={c.stat} />
                </b>
                <span className="xp__note">{c.note}</span>
                {c.spark ? (
                  <Sparkline values={c.spark} color="#ffffff" />
                ) : 'bars' in c && c.bars ? (
                  <span className="xp__bars" aria-hidden="true">
                    {c.bars.map((b, j) => (
                      <span key={b.name} title={b.name}>
                        <i style={{ width: `${(b.value / Math.max(...c.bars!.map((x) => x.value))) * 100}%`, background: b.color, transitionDelay: `${j * 110}ms` }} />
                      </span>
                    ))}
                  </span>
                ) : 'mix' in c ? (
                  <span className="xp__mix" aria-hidden="true">
                    {CUSTOMER_MIX.map((m, j) => (
                      <span key={m.label} style={{ flexGrow: m.value, background: m.color, transitionDelay: `${j * 90}ms` }} />
                    ))}
                  </span>
                ) : (
                  <svg className="xp__g" viewBox="-10 -10 124 120" aria-hidden="true">
                    <path d="M93.5 25.9A47 42 0 1 0 102 50H62" pathLength={1} />
                  </svg>
                )}
                <Grain />
              </Link>
            </li>
          ))}
        </ul>
        {SAMPLE_DATA && <p className="sec__fine">Figures on these cards are sample data until replaced with measured numbers.</p>}
      </div>
    </section>
  )
}
