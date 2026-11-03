import { useEffect, useRef, type CSSProperties } from 'react'
import { useExpert } from './expertContext'
import './inside.css'

/* A cuboid made of five CSS faces. Origin = centre of its footprint on the floor. */
interface BoxSpec {
  id: string
  x: number
  y: number
  z: number
  w: number // along x
  d: number // along y (depth)
  h: number // height (z)
  c: string // base colour
  lift: number // how far it rises when exploded
  part: number // which story step it belongs to (-1 = none)
  top?: string // optional top-face background
  cls?: string
}

const PARTS = [
  {
    k: '01',
    title: 'The chassis',
    body: 'A 2U steel enclosure with tool-less rails. Every Glixy machine slides into a dual-fed, locked cabinet in a Tier IV hall.',
    stat: '2U · 19-inch rack',
  },
  {
    k: '02',
    title: 'Motherboard',
    body: 'Server-grade boards with remote management, so we can power-cycle, re-image or fix your box without touching it.',
    stat: 'Out-of-band IPMI',
  },
  {
    k: '03',
    title: 'Processors',
    body: 'Up to two sockets and 96 physical cores. Dedicated means dedicated — no shared vCPU, no noisy neighbours.',
    stat: 'Up to 2 × 48 cores',
  },
  {
    k: '04',
    title: 'Memory',
    body: 'ECC DDR5 across every channel. Errors are corrected before they ever reach your database.',
    stat: 'Up to 2 TB ECC',
  },
  {
    k: '05',
    title: 'NVMe storage',
    body: 'Hot-swap NVMe in the front bays, mirrored by default. Swap a failing drive while the server keeps running.',
    stat: '7 GB/s per drive',
  },
  {
    k: '06',
    title: 'Accelerators',
    body: 'Optional data-centre GPUs on a full-bandwidth bus for training, inference, rendering and simulation.',
    stat: 'Up to 8 GPUs',
  },
  {
    k: '07',
    title: 'Cooling',
    body: 'A wall of redundant, hot-swap fans pushes cold aisle air front-to-back. Lose one and the rest speed up.',
    stat: 'N+1 fans',
  },
  {
    k: '08',
    title: 'Power & network',
    body: 'Two power supplies on separate feeds and bonded uplinks to two switches. Nothing in the path is single.',
    stat: 'A+B power · 2 × 25 Gbps',
  },
]

const BOXES: BoxSpec[] = [
  // chassis tray
  { id: 'tray', x: 0, y: 0, z: 0, w: 640, d: 420, h: 18, c: '#2a2833', lift: 0, part: 0, top: '#1a1922' },
  { id: 'wallL', x: -316, y: 0, z: 18, w: 8, d: 420, h: 56, c: '#34323f', lift: 0, part: 0 },
  { id: 'wallR', x: 316, y: 0, z: 18, w: 8, d: 420, h: 56, c: '#34323f', lift: 0, part: 0 },
  { id: 'wallB', x: 0, y: -206, z: 18, w: 624, d: 8, h: 56, c: '#34323f', lift: 0, part: 0 },
  // motherboard
  {
    id: 'board',
    x: -20,
    y: -40,
    z: 18,
    w: 560,
    d: 300,
    h: 4,
    c: '#2b1a10',
    lift: 24,
    part: 1,
    top: `linear-gradient(90deg, rgba(255,160,90,.14) 1px, transparent 1px) 0 0/22px 22px, linear-gradient(rgba(255,160,90,.14) 1px, transparent 1px) 0 0/22px 22px, linear-gradient(135deg, #2b1a10, #22140b)`,
  },
  // CPUs (heatsinks)
  { id: 'cpu1', x: -150, y: -50, z: 22, w: 96, d: 96, h: 46, c: '#3d3b49', lift: 130, part: 2, cls: 'fins' },
  { id: 'cpu2', x: 40, y: -50, z: 22, w: 96, d: 96, h: 46, c: '#3d3b49', lift: 130, part: 2, cls: 'fins' },
  // RAM sticks
  ...[-222, -212, -202, -88, -78, -68, 102, 112, 122].map((x, i) => ({
    id: `ram${i}`,
    x,
    y: -50,
    z: 22,
    w: 5,
    d: 150,
    h: 40,
    c: '#c2410c',
    lift: 175,
    part: 3,
    top: '#f76707',
  })),
  // NVMe front bays
  ...[-240, -160, -80, 0].map((x, i) => ({
    id: `nvme${i}`,
    x,
    y: 170,
    z: 18,
    w: 70,
    d: 60,
    h: 34,
    c: '#2f2d3a',
    lift: 80,
    part: 4,
    top: 'linear-gradient(#383645, #2a2833)',
  })),
  // GPU card
  { id: 'gpu', x: 180, y: -130, z: 22, w: 230, d: 60, h: 48, c: '#3a2414', lift: 200, part: 5, top: 'linear-gradient(90deg,#7a3a12,#4a240c)' },
  // fans
  ...[-240, -150, -60, 30, 120].map((x, i) => ({
    id: `fan${i}`,
    x,
    y: 90,
    z: 18,
    w: 78,
    d: 22,
    h: 52,
    c: '#24232c',
    lift: 110,
    part: 6,
    cls: 'fanbox',
  })),
  // PSUs + NIC
  { id: 'psu1', x: 240, y: 60, z: 18, w: 110, d: 70, h: 40, c: '#3a3846', lift: 70, part: 7 },
  { id: 'psu2', x: 240, y: 150, z: 18, w: 110, d: 70, h: 40, c: '#3a3846', lift: 70, part: 7 },
  { id: 'nic', x: 160, y: 30, z: 22, w: 60, d: 90, h: 10, c: '#4a2a10', lift: 160, part: 7, top: 'linear-gradient(135deg,#b8560f,#6a300a)' },
  // lid (rises highest)
  { id: 'lid', x: 0, y: 0, z: 74, w: 640, d: 420, h: 6, c: '#3a3846', lift: 200, part: -1, cls: 'lid' },
]

function Box({ b }: { b: BoxSpec }) {
  const style = {
    '--w': `${b.w}px`,
    '--d': `${b.d}px`,
    '--h': `${b.h}px`,
    '--c': b.c,
    '--top': b.top ?? b.c,
  } as CSSProperties
  return (
    <div className={`bx ${b.cls ?? ''}`} data-id={b.id} style={style}>
      <i className="f f--top" />
      <i className="f f--front" />
      <i className="f f--back" />
      <i className="f f--right" />
      <i className="f f--left" />
    </div>
  )
}

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)

export default function InsideServer() {
  const talk = useExpert()
  const sec = useRef<HTMLElement>(null)
  const world = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = sec.current!
    const w = world.current!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nodes = BOXES.map((b) => ({ b, el: w.querySelector<HTMLElement>(`[data-id="${b.id}"]`)! }))
    const steps = Array.from(textRef.current!.querySelectorAll<HTMLElement>('.istep'))
    const dots = Array.from(el.querySelectorAll<HTMLElement>('.inside__dots li'))
    const glow = nodes.map(() => 0)
    let p = 0
    let target = 0
    let raf = 0
    let last = performance.now()
    let shown = -2

    const read = () => {
      const r = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      target = clamp(-r.top / Math.max(1, total))
    }

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      read()
      p += (target - p) * (reduce ? 1 : 1 - Math.exp(-6 * dt))

      // timeline: 0–.12 intro + lid opens, .12–.22 explode, .22–.94 one step per part, then settle
      const open = ease(clamp(p / 0.12))
      const explode = ease(clamp((p - 0.08) / 0.14))
      const stepF = clamp((p - 0.22) / 0.72) * PARTS.length
      const active = p < 0.2 ? -1 : Math.min(PARTS.length - 1, Math.floor(stepF))

      const rotZ = -38 + p * 70
      const rotX = 62 - open * 6
      const scale = 0.84 + open * 0.06 - explode * 0.12
      w.style.transform = `translateY(${(explode * 40).toFixed(1)}px) scale(${scale.toFixed(3)}) rotateX(${rotX.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg)`

      const ge = reduce ? 1 : 1 - Math.exp(-8 * dt)
      nodes.forEach(({ b, el: n }, i) => {
        const isOn = b.part === active
        glow[i] += ((isOn ? 1 : 0) - glow[i]) * ge
        let z = b.z + b.lift * explode
        let y = b.y
        if (b.id === 'lid') {
          // the lid lifts off and slides back out of the way
          z = b.z + open * 60 + b.lift * explode
          y = b.y - explode * 380
        }
        z += glow[i] * 60
        n.style.transform = `translate3d(${b.x}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px)`
        const dim = active < 0 || b.id === 'lid' ? 1 : 0.45 + glow[i] * 0.75
        n.style.setProperty('--dim', dim.toFixed(3))
        n.style.setProperty('--glow', glow[i].toFixed(3))
      })

      if (active !== shown) {
        const prev = shown
        shown = active
        steps.forEach((s, i) => {
          const on = i === active + 1 // index 0 is the intro card
          s.classList.toggle('is-on', on)
          if (on && !reduce)
            s.querySelectorAll<HTMLElement>('.im > *').forEach((m, k) =>
              m.animate(
                [{ transform: `translateY(${active > prev ? 105 : -105}%)` }, { transform: 'translateY(0)' }],
                { duration: 700, delay: k * 60, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' },
              ),
            )
        })
        dots.forEach((d, i) => d.classList.toggle('is-on', i === active))
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`
      raf = requestAnimationFrame(frame)
    }

    // only animate while the section is near the viewport
    const io = new IntersectionObserver(([en]) => {
      cancelAnimationFrame(raf)
      if (en.isIntersecting) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="inside" id="inside" ref={sec} aria-labelledby="inside-title">
      <div className="inside__sticky grid-bg">
        <div className="inside__text" ref={textRef}>
          <div className="istep is-on">
            <div className="im">
              <span className="eyebrow">Inside a Glixy server</span>
            </div>
            <div className="im">
              <h2 id="inside-title">
                Open the lid.
                <br />
                See what you rent.
              </h2>
            </div>
            <div className="im">
              <p>Scroll to take a real 2U server apart, layer by layer — the exact hardware your workloads run on.</p>
            </div>
          </div>
          {PARTS.map((pt) => (
            <div className="istep" key={pt.k}>
              <div className="im">
                <span className="istep__k">{pt.k} / 08</span>
              </div>
              <div className="im">
                <h3>{pt.title}</h3>
              </div>
              <div className="im">
                <p>{pt.body}</p>
              </div>
              <div className="im">
                <span className="istep__stat">{pt.stat}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="inside__scene" aria-hidden="true">
          <div className="inside__world" ref={world}>
            <div className="inside__floor" />
            {BOXES.map((b) => (
              <Box key={b.id} b={b} />
            ))}
          </div>
        </div>

        <ol className="inside__dots" aria-hidden="true">
          {PARTS.map((pt) => (
            <li key={pt.k}>
              <span>{pt.title}</span>
            </li>
          ))}
        </ol>

        <div className="inside__foot">
          <span className="inside__bar">
            <span ref={barRef} />
          </span>
          <button className="inside__cta" onClick={() => talk({ note: 'Asked from: Inside a server — custom build' })}>
            Spec a custom build →
          </button>
        </div>
      </div>
    </section>
  )
}
