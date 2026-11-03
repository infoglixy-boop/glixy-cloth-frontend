import { useEffect, useRef } from 'react'
import './mission.css'

const MISSION =
  'Our mission is to make serious infrastructure feel simple — real hardware, honest prices and engineers you can actually call.'
const VISION =
  'We see a future where every builder, from a student in a hostel room to a national enterprise, owns a slice of the cloud they can touch.'

const VALUES = [
  ['Own the metal', 'We buy, rack and run our own servers. No resold capacity, no mystery hosts.'],
  ['Price in daylight', 'One monthly number. No egress traps, no setup fees hidden in footnotes.'],
  ['Uptime is a promise', 'Redundant power, cooling and network on every rack — and credits when we slip.'],
  ['Humans first', 'An engineer answers every ticket, from a ₹499 plan to a 42U cage.'],
]

const NUMBERS = [
  ['24/7', 'engineers on call'],
  ['6', 'regions across 3 continents'],
  ['< 4 min', 'median first response'],
]

function Words({ text, accent }: { text: string; accent: string[] }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className={`w${accent.some((a) => w.toLowerCase().includes(a)) ? ' w--a' : ''}`}>
          {w}{' '}
        </span>
      ))}
    </>
  )
}

export default function Mission() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const paras = Array.from(el.querySelectorAll<HTMLElement>('.mv__big'))
    const words = paras.map((p) => Array.from(p.querySelectorAll<HTMLElement>('.w')))
    if (reduce) {
      words.flat().forEach((w) => w.classList.add('is-lit'))
      return
    }
    let raf = 0
    const lit = paras.map(() => -1)
    const tick = () => {
      const vh = window.innerHeight
      paras.forEach((p, i) => {
        const r = p.getBoundingClientRect()
        const prog = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)))
        const n = Math.round(prog * words[i].length)
        if (n !== lit[i]) {
          lit[i] = n
          words[i].forEach((w, k) => w.classList.toggle('is-lit', k < n))
        }
      })
      raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([en]) => {
      cancelAnimationFrame(raf)
      if (en.isIntersecting) raf = requestAnimationFrame(tick)
    })
    io.observe(el)

    const reveal = new IntersectionObserver(
      (ens) =>
        ens.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in')
            reveal.unobserve(en.target)
          }
        }),
      { threshold: 0.2 },
    )
    el.querySelectorAll('.rv').forEach((n) => reveal.observe(n))
    return () => {
      io.disconnect()
      reveal.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="mv" id="mission" ref={root} aria-labelledby="mv-title">
      <div className="mv__inner">
        <h2 id="mv-title" className="sr-only">
          Mission and vision
        </h2>

        <div className="mv__block">
          <span className="eyebrow">Our mission</span>
          <p className="mv__big">
            <Words text={MISSION} accent={['simple', 'call']} />
          </p>
        </div>

        <div className="mv__block">
          <span className="eyebrow">Our vision</span>
          <p className="mv__big">
            <Words text={VISION} accent={['builder', 'touch']} />
          </p>
        </div>

        <ul className="mv__values">
          {VALUES.map(([h, t], i) => (
            <li key={h} className="rv glass" style={{ '--i': i } as React.CSSProperties}>
              <span className="mv__n">0{i + 1}</span>
              <h3>{h}</h3>
              <p>{t}</p>
            </li>
          ))}
        </ul>

        <ul className="mv__nums">
          {NUMBERS.map(([n, l], i) => (
            <li key={l} className="rv" style={{ '--i': i } as React.CSSProperties}>
              <b>{n}</b>
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
