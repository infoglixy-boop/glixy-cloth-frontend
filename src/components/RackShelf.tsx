import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { KINDS, KIND_LABEL, REGIONS, SERVERS, inr, type Server } from '../data/servers'
import { BladeFront, ServerCover } from './ServerArt'
import { useExpert } from './expertContext'
import { takePendingServer } from '../router'
import Logo from './Logo'
import WhatsAppLink from './WhatsApp'
import { waServer } from '../data/contact'
import './shelf.css'

const N = SERVERS.length
const COPIES = 3
const TOTAL = N * COPIES
const START = 4 + N // Forge Business, middle copy

const mod = (a: number, n: number) => ((a % n) + n) % n
const smooth = (x: number) => x * x * (3 - 2 * x)
const B = (r: number) => (Math.abs(r) < 1 ? (r + Math.sin(Math.PI * r) / Math.PI) / 2 : Math.sign(r) * 0.5)
const rel = (v: number, s: number) => mod(v - s + TOTAL / 2, TOTAL) - TOTAL / 2

const BLOBS: [number, number, number][] = [
  [150, 330, 0],
  [340, 600, 120],
  [250, 120, 220],
  [90, 760, 300],
  [400, 250, 360],
  [260, 860, 420],
  [230, 470, 180],
]

/* ---------- Rack occupancy (deterministic per server + region) ---------- */
function seeded(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

function occupancy(server: Server, region: string): boolean[] {
  if (server.units >= 42) return Array(42).fill(false)
  const rnd = seeded(server.id + region)
  const taken = Array(42).fill(false)
  let u = 0
  while (u < 42) {
    const len = 1 + Math.floor(rnd() * 4)
    const busy = rnd() < 0.52
    for (let k = 0; k < len && u < 42; k++, u++) taken[u] = busy
  }
  return taken
}

function fits(taken: boolean[], start: number, units: number) {
  if (start + units > 42) return false
  for (let k = start; k < start + units; k++) if (taken[k]) return false
  return true
}

function firstFree(taken: boolean[], units: number) {
  for (let s = 0; s <= 42 - units; s++) if (fits(taken, s, units)) return s
  return -1
}

/* ---------- Detail sheet contents ---------- */
function Detail({ s, onClose, onTalk }: { s: Server; onClose: () => void; onTalk: (note: string) => void }) {
  const [region, setRegion] = useState(REGIONS[0])
  const taken = useMemo(() => occupancy(s, region), [s, region])
  const [pick, setPick] = useState<{ region: string; start: number } | null>(null)
  const [hoverU, setHoverU] = useState(-1)
  const start = pick && pick.region === region ? pick.start : firstFree(taken, s.units)
  const setStart = (u: number) => setPick({ region, start: u })

  const cabinet = useMemo(() => {
    const rnd = seeded(s.id + region + 'cab')
    return `${String.fromCharCode(65 + Math.floor(rnd() * 8))}${String(1 + Math.floor(rnd() * 24)).padStart(2, '0')}`
  }, [s.id, region])

  const freeCount = taken.filter((t) => !t).length
  const slotLabel =
    start < 0
      ? 'No free block here — try another region'
      : s.units >= 42
        ? `Cabinet ${cabinet} · whole rack`
        : s.units === 1
          ? `Cabinet ${cabinet} · U${42 - start}`
          : `Cabinet ${cabinet} · U${42 - start - s.units + 1}–U${42 - start}`

  const note = `Selected: ${s.name} (${s.code}) · ${region} · ${start < 0 ? 'slot to be assigned' : slotLabel}`
  const preview = hoverU >= 0 && fits(taken, hoverU, s.units) ? hoverU : -1

  const specs: [string, string][] = [
    ['Processor', s.cpu],
    ['Memory', s.ram],
    ['Storage', s.storage],
    ['Network', s.network],
    ...(s.gpu ? ([['Accelerators', s.gpu]] as [string, string][]) : []),
    ['Footprint', `${s.units}U`],
  ]

  return (
    <>
      <div className="detail__bar">
        <button className="box lbl" onClick={onClose}>
          Close ✕
        </button>
        <div className="detail__logo" aria-hidden="true">
          <Logo height={20} />
          <span>RACKS</span>
        </div>
        <span className="lbl detail__step">
          {s.code} · {KIND_LABEL[s.kind]}
        </span>
      </div>

      <div className="detail__grid">
        <div className="detail__text">
          <div className="dm">
            <p className="dm__in lbl detail__sub">
              {s.code} / {KIND_LABEL[s.kind]} / {s.audience === 'B2B' ? 'Business' : 'Personal'}
            </p>
          </div>
          <div className="dm">
            <h2 className="dm__in detail__title">{s.name}</h2>
          </div>
          <div className="dm">
            <p className="dm__in detail__tag">{s.tagline}</p>
          </div>
          <div className="dm">
            <p className="dm__in lbl detail__meta">
              {inr(s.price)} / MONTH · {s.setup}
            </p>
          </div>
          <div className="dm">
            <p className="dm__in detail__desc">{s.description}</p>
          </div>
          <div className="dm">
            <dl className="dm__in detail__specs">
              {specs.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="dm">
            <div className="dm__in detail__regions" role="radiogroup" aria-label="Region">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  role="radio"
                  aria-checked={r === region}
                  className={r === region ? 'is-on' : ''}
                  onClick={() => setRegion(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="dm">
            <p className="dm__in detail__slot">
              <span className="lbl">Your slot</span>
              <b>
                {region} · {slotLabel}
              </b>
            </p>
          </div>
          <div className="dm">
            <div className="dm__in detail__cta">
              <button className="btn btn--primary" onClick={() => onTalk(note)}>
                Talk to Expert
              </button>
              <button className="btn btn--glass glass" onClick={() => onTalk(`Reserve request — ${note}`)}>
                Reserve this slot
              </button>
              <WhatsAppLink className="btn detail__wa" href={waServer(s.name, inr(s.price))}>
                WhatsApp
              </WhatsAppLink>
            </div>
          </div>
        </div>

        <div className="detail__visual">
          <div className="detail__poster">
            <svg viewBox="0 0 474 900" aria-hidden="true">
              <defs>
                <filter id="ink" x="-30%" y="-30%" width="160%" height="160%">
                  <feTurbulence type="fractalNoise" baseFrequency=".011" numOctaves="3" seed="7" result="n" />
                  <feDisplacementMap in="SourceGraphic" in2="n" scale="120" xChannelSelector="R" yChannelSelector="G" />
                </filter>
                <mask id="ink-mask" maskUnits="userSpaceOnUse" x="-200" y="-200" width="874" height="1300">
                  <g filter="url(#ink)" fill="#fff">
                    {BLOBS.map(([cx, cy], i) => (
                      <circle key={i} className="blob" cx={cx} cy={cy} r="0" />
                    ))}
                  </g>
                </mask>
                <clipPath id="poster-clip">
                  <rect width="474" height="900" rx="6" />
                </clipPath>
              </defs>
              <g clipPath="url(#poster-clip)" mask="url(#ink-mask)">
                <ServerCover s={s} uid="poster" />
              </g>
            </svg>
          </div>

          <div className="rack3d" aria-label={`42U rack in ${region}, ${freeCount} free units`}>
            <div className="rack3d__head lbl">
              <span>{cabinet}</span>
              <span>{freeCount} free</span>
            </div>
            <div className="rack3d__body" onMouseLeave={() => setHoverU(-1)}>
              {taken.map((t, u) => {
                const sel = start >= 0 && u >= start && u < start + s.units
                const pre = preview >= 0 && u >= preview && u < preview + s.units
                return (
                  <button
                    key={u}
                    className={`ru${t ? ' is-taken' : ''}${sel ? ' is-sel' : ''}${pre && !sel ? ' is-pre' : ''}`}
                    disabled={t || s.units >= 42}
                    aria-label={`U${42 - u}${t ? ' occupied' : ' free'}`}
                    onMouseEnter={() => setHoverU(u)}
                    onClick={() => fits(taken, u, s.units) && setStart(u)}
                  >
                    <i>{42 - u}</i>
                  </button>
                )
              })}
            </div>
            <div className="rack3d__legend lbl">
              <span>
                <i className="k k--sel" />
                Yours
              </span>
              <span>
                <i className="k k--free" />
                Free
              </span>
              <span>
                <i className="k k--taken" />
                Taken
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ---------- The shelf ---------- */
export default function RackShelf() {
  const talk = useExpert()
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const probe = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const indicator = useRef<HTMLSpanElement>(null)
  const capRefs = useRef<(HTMLDivElement | null)[]>([])
  const ring = useRef<HTMLButtonElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const sheet = useRef<HTMLDivElement>(null)
  const api = useRef<{ open: () => void; close: () => void; go: (d: number) => void; tab: (i: number) => void }>(null)
  const [detailIdx, setDetailIdx] = useState(START % N)

  const tapes = useMemo(() => Array.from({ length: TOTAL }, (_, v) => ({ v, s: SERVERS[v % N] })), [])

  useEffect(() => {
    const sec = section.current!
    const stg = stage.current!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    const tapeEls = Array.from(stg.querySelectorAll<HTMLDivElement>('.tape'))
    const spineEls = tapeEls.map((t) => t.querySelector<HTMLDivElement>('.sp')!)
    const coverEls = tapeEls.map((t) => t.querySelector<HTMLDivElement>('.cv')!)
    const lift = new Float32Array(TOTAL)
    const masks = capRefs.current

    const st = {
      s: START,
      T: START,
      hover: -1,
      active: -1,
      mx: -1e4,
      my: -1e4,
      cx: -1e4,
      cy: -1e4,
      tiltX: 0,
      tiltY: 0,
      onCover: false,
      isOpen: false,
      dragging: false,
      inside: false,
      overBtn: false,
      inView: false,
      H: 0,
      ws: 0,
      d: 0,
      gap: 0,
      W: 0,
      SH: 0,
    }

    const measure = () => {
      st.H = probe.current!.getBoundingClientRect().height
      st.ws = (st.H * 142) / 840
      st.d = (st.H * 474) / 900
      st.gap = st.H * 0.03
      st.W = sec.clientWidth
      st.SH = sec.clientHeight
      stg.style.setProperty('--ws', `${st.ws}px`)
      stg.style.setProperty('--d', `${st.d}px`)
      stg.style.setProperty('--Hp', `${st.H}px`)
      placeIndicator()
    }

    /* ----- caption swap through masks ----- */
    const caption = (idx: number, dir: number) => {
      const srv = SERVERS[idx]
      const texts = [srv.name, `${srv.code} / ${KIND_LABEL[srv.kind]}`, `${inr(srv.price)} / mo · ${srv.audience}`]
      capRefs.current.forEach((mask, i) => {
        if (!mask) return
        const span = document.createElement('span')
        span.textContent = texts[i]
        const olds = Array.from(mask.children) as HTMLElement[]
        mask.appendChild(span)
        if (reduce || !olds.length) {
          olds.forEach((o) => o.remove())
          return
        }
        const opts: KeyframeAnimationOptions = { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' }
        span.animate([{ transform: `translateY(${dir * 105}%)` }, { transform: 'translateY(0)' }], opts)
        olds.forEach((o) => {
          if (o.dataset.leaving) return
          o.dataset.leaving = '1'
          const cur = getComputedStyle(o).transform
          o.animate([{ transform: cur === 'none' ? 'translateY(0)' : cur }, { transform: `translateY(${-dir * 105}%)` }], opts).onfinish =
            () => o.remove()
        })
      })
    }

    const tabBtns = () => Array.from(tabsRef.current!.querySelectorAll<HTMLButtonElement>('button'))
    function placeIndicator() {
      if (st.active < 0) return
      const k = KINDS.findIndex((t) => t.id === SERVERS[st.active].kind)
      const btns = tabBtns()
      const b = btns[k]
      if (!b || !indicator.current) return
      indicator.current.style.width = `${b.offsetWidth}px`
      indicator.current.style.transform = `translateX(${b.offsetLeft}px)`
      btns.forEach((x, i) => x.classList.toggle('is-on', i === k))
    }

    const setActive = (idx: number, dir: number) => {
      if (idx === st.active) return
      st.active = idx
      caption(idx, dir || 1)
      placeIndicator()
    }

    /* ----- open / close the detail sheet ----- */
    const activeCoverRect = () => {
      const v = mod(Math.round(st.s), TOTAL)
      return coverEls[v].getBoundingClientRect()
    }

    let blobRaf = 0
    const runInk = () => {
      const circles = Array.from(sheet.current!.querySelectorAll<SVGCircleElement>('.blob'))
      circles.forEach((c) => c.setAttribute('r', '0'))
      const t0 = performance.now() + (reduce ? -5000 : 520)
      cancelAnimationFrame(blobRaf)
      const tick = (now: number) => {
        const t = now - t0
        circles.forEach((c, i) => {
          const p = Math.min(1, Math.max(0, (t - BLOBS[i][2]) / 1250))
          c.setAttribute('r', String(720 * (1 - Math.pow(1 - p, 3))))
        })
        if (t < 2400) blobRaf = requestAnimationFrame(tick)
      }
      blobRaf = requestAnimationFrame(tick)
    }

    const open = () => {
      if (st.isOpen) return
      st.T = Math.round(st.T)
      const idx = mod(Math.round(st.s), N)
      flushSync(() => setDetailIdx(idx))
      const el = sheet.current!
      const r = activeCoverRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      st.isOpen = true
      document.body.classList.add('lock')
      el.scrollTop = 0
      el.classList.add('is-open')
      el.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`
      const from = `inset(${r.top}px ${vw - r.right}px ${vh - r.bottom}px ${r.left}px round 4px)`
      el.getAnimations().forEach((a) => a.cancel())
      el.animate(
        [
          { clipPath: from, transform: 'rotate(-4.5deg)' },
          { clipPath: 'inset(0px 0px 0px 0px round 0px)', transform: 'rotate(0deg)' },
        ],
        { duration: reduce ? 1 : 1050, easing: 'cubic-bezier(.76,0,.18,1)', fill: 'both' },
      )
      el.querySelectorAll<HTMLElement>('.rack3d').forEach((n) =>
        n.animate([{ clipPath: 'inset(100% -60px -60px -60px)' }, { clipPath: 'inset(-60px -60px -60px -60px)' }], {
          duration: reduce ? 1 : 1100,
          delay: reduce ? 0 : 900,
          easing: 'cubic-bezier(.2,.8,.2,1)',
          fill: 'both',
        }),
      )
      el.querySelectorAll<HTMLElement>('.dm__in, .detail__bar > *').forEach((n, i) =>
        n.animate([{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }], {
          duration: reduce ? 1 : 900,
          delay: reduce ? 0 : 620 + i * 60,
          easing: 'cubic-bezier(.2,.8,.2,1)',
          fill: 'both',
        }),
      )
      runInk()
      window.setTimeout(() => el.querySelector<HTMLButtonElement>('.detail__bar button')?.focus({ preventScroll: true }), 50)
    }

    const close = () => {
      if (!st.isOpen) return
      const el = sheet.current!
      const r = activeCoverRect()
      const vw = window.innerWidth
      const vh = window.innerHeight
      el.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`
      const a = el.animate(
        [
          { clipPath: 'inset(0px 0px 0px 0px round 0px)', transform: 'rotate(0deg)' },
          {
            clipPath: `inset(${r.top}px ${vw - r.right}px ${vh - r.bottom}px ${r.left}px round 4px)`,
            transform: 'rotate(-4.5deg)',
          },
        ],
        { duration: reduce ? 1 : 850, easing: 'cubic-bezier(.76,0,.18,1)', fill: 'both' },
      )
      st.isOpen = false
      a.onfinish = () => {
        el.classList.remove('is-open')
        el.getAnimations({ subtree: true }).forEach((x) => x.cancel())
        cancelAnimationFrame(blobRaf)
        if (!document.querySelector('.expert')) document.body.classList.remove('lock')
      }
    }

    const go = (d: number) => {
      st.T = Math.round(st.T) + d
    }
    const tab = (k: number) => {
      const kind = KINDS[k].id
      const target = kind === 'all' ? 0 : SERVERS.findIndex((s) => s.kind === kind)
      const cur = Math.round(st.T)
      const delta = mod(target - mod(cur, N) + N / 2, N) - N / 2
      st.T = cur + delta
    }
    api.current = { open, close, go, tab }

    // "View in rack" buttons elsewhere on the page glide the shelf to that server
    const onSelect = (e: Event) => {
      const target = SERVERS.findIndex((x) => x.id === (e as CustomEvent<string>).detail)
      if (target < 0) return
      const cur = Math.round(st.T)
      st.T = cur + (mod(target - mod(cur, N) + N / 2, N) - N / 2)
    }
    window.addEventListener('glixy:select', onSelect)
    // arrived from another page's "View in rack" button
    const waiting = takePendingServer()
    if (waiting) onSelect(new CustomEvent('glixy:select', { detail: waiting }))

    /* ----- inputs ----- */
    const onTapeClick = (v: number) => (e: MouseEvent) => {
      if (suppressClick) {
        suppressClick = false
        return
      }
      e.stopPropagation()
      const r = rel(v, st.s)
      if (Math.abs(r) < 0.5) open()
      else st.T = Math.round(st.T + r)
    }
    const clickHandlers = tapeEls.map((t, v) => {
      const h = onTapeClick(v)
      t.addEventListener('click', h)
      t.addEventListener('pointerenter', () => (st.hover = v))
      t.addEventListener('pointerleave', () => st.hover === v && (st.hover = -1))
      return h
    })

    const wrap = stg.parentElement!
    let dragX0 = 0
    let dragT0 = 0
    let pressed = false
    let suppressClick = false
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      pressed = true
      dragX0 = e.clientX
      dragT0 = st.T
    }
    const onMove = (e: PointerEvent) => {
      const r = sec.getBoundingClientRect()
      st.mx = e.clientX - r.left
      st.my = e.clientY - r.top
      if (!pressed) return
      const dx = e.clientX - dragX0
      if (!st.dragging && Math.abs(dx) > 5) {
        st.dragging = true
        wrap.setPointerCapture(e.pointerId)
      }
      if (st.dragging) st.T = dragT0 - dx / (st.ws + st.gap)
    }
    const onUp = () => {
      if (st.dragging) {
        st.T = Math.round(st.T)
        suppressClick = true
        window.setTimeout(() => (suppressClick = false), 0)
      }
      pressed = false
      st.dragging = false
    }
    wrap.addEventListener('pointerdown', onDown)
    sec.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)

    const onEnter = () => (st.inside = true)
    const onLeave = () => {
      st.inside = false
      st.hover = -1
    }
    sec.addEventListener('pointerenter', onEnter)
    sec.addEventListener('pointerleave', onLeave)
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      st.overBtn = !!t.closest('button, a') && !t.closest('.tape')
    }
    sec.addEventListener('pointerover', onOver)

    let wheelTimer = 0
    const onWheel = (e: WheelEvent) => {
      if (st.isOpen) return
      const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX
      if (Math.abs(dx) <= Math.abs(e.deltaY) && !e.shiftKey) return // vertical scroll belongs to the page
      e.preventDefault()
      st.T += (dx / (st.ws + st.gap)) * 0.5
      window.clearTimeout(wheelTimer)
      wheelTimer = window.setTimeout(() => (st.T = Math.round(st.T)), 160)
    }
    wrap.addEventListener('wheel', onWheel, { passive: false })

    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('.expert')) return
      if (st.isOpen) {
        if (e.key === 'Escape') close()
        return
      }
      if (!st.inView) return
      const tag = (document.activeElement?.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        go(-1)
      } else if (e.key === 'Enter' && (document.activeElement === document.body || sec.contains(document.activeElement))) {
        if (!(document.activeElement as HTMLElement)?.closest?.('button, a')) open()
      }
    }
    window.addEventListener('keydown', onKey)

    const io = new IntersectionObserver(([en]) => (st.inView = en.intersectionRatio > 0.55), { threshold: [0, 0.55, 1] })
    io.observe(sec)

    const ro = new ResizeObserver(measure)
    ro.observe(sec)
    measure()
    // tab widths change once the web fonts arrive
    document.fonts?.ready.then(measure)
    setActive(mod(START, N), 1)

    /* ----- one rAF loop ----- */
    let raf = 0
    let last = performance.now()
    let cursorState = ''
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const { H, ws, d, gap, W } = st
      const cyShelf = st.SH / 2

      const k = reduce ? 1e3 : st.dragging ? 18 : 5.2
      st.s += (st.T - st.s) * (1 - Math.exp(-k * dt))
      if (Math.abs(st.T - st.s) < 1e-4) st.s = st.T
      const loops = Math.trunc(st.s / TOTAL)
      if (Math.abs(loops) >= 4) {
        st.s -= loops * TOTAL
        st.T -= loops * TOTAL
      }
      setActive(mod(Math.round(st.s), N), Math.sign(st.T - st.s))

      // tilt towards the cursor
      const settled = Math.abs(st.T - st.s) < 0.3
      st.onCover =
        st.inside &&
        !st.isOpen &&
        settled &&
        Math.abs(st.mx - W / 2) < 0.55 * d &&
        Math.abs(st.my - cyShelf) < 0.55 * H
      const tY = st.onCover ? ((st.mx - W / 2) / (0.55 * d)) * 9 : st.inside ? ((st.mx - W / 2) / W) * 5 : 0
      const tX = st.onCover ? (-(st.my - cyShelf) / (H / 2)) * 6 : 0
      const te = reduce ? 1 : 1 - Math.exp(-7 * dt)
      st.tiltY += (tY - st.tiltY) * te
      st.tiltX += (tX - st.tiltX) * te

      const le = reduce ? 1 : 1 - Math.exp(-12 * dt)
      const limit = W / 2 + 1.5 * d
      for (let v = 0; v < TOTAL; v++) {
        const el = tapeEls[v]
        const r = rel(v, st.s)
        const x = r * (ws + gap) + (d - ws + 1.6 * gap) * B(r)
        if (Math.abs(x) > limit) {
          if (el.style.visibility !== 'hidden') el.style.visibility = 'hidden'
          continue
        }
        if (el.style.visibility) el.style.visibility = ''
        const target = st.hover === v && Math.abs(r) > 0.5 && !st.isOpen ? 1 : 0
        lift[v] += (target - lift[v]) * le
        const o = smooth(Math.max(0, 1 - Math.abs(r)))
        const ry = -90 * o + st.tiltY * o
        const rx = st.tiltX * o
        const rz = -4.5 * o
        const tz = o * 0.2 * H
        const ty = -o * 0.025 * H - lift[v] * 0.045 * H
        el.style.transform = `translate3d(${x.toFixed(2)}px,${ty.toFixed(2)}px,${tz.toFixed(2)}px) rotateZ(${rz.toFixed(3)}deg) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`
        el.style.zIndex = String(Math.round(100 - Math.abs(r) * 4))
        spineEls[v].style.setProperty('--shade', (o * 0.55).toFixed(3))
        coverEls[v].style.setProperty('--shade', ((1 - o) * 0.5).toFixed(3))
      }

      // play ring
      if (ring.current) {
        const sc = st.isOpen ? 0 : smooth(Math.max(0, 1 - Math.abs(st.T - st.s) * 3))
        ring.current.style.left = `${W / 2 - 0.5 * d - 6}px`
        ring.current.style.top = `${cyShelf + 0.36 * H}px`
        ring.current.style.transform = `translate(-50%,-50%) scale(${sc.toFixed(3)})`
      }

      // custom cursor
      if (fine && cursor.current) {
        const c = cursor.current
        if (st.cx < -1e3) {
          st.cx = st.mx
          st.cy = st.my
        }
        const ce = 1 - Math.exp(-16 * dt)
        st.cx += (st.mx - st.cx) * ce
        st.cy += (st.my - st.cy) * ce
        c.style.transform = `translate3d(${st.cx}px,${st.cy}px,0)`
        const hv = st.hover >= 0 ? Math.abs(rel(st.hover, st.s)) > 0.5 : false
        const next = !st.inside || st.isOpen ? 'off' : st.onCover ? 'open' : st.overBtn ? 'btn' : hv ? 'spine' : ''
        if (next !== cursorState) {
          cursorState = next
          c.className = `rcursor${next ? ' is-' + next : ''}`
        }
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(blobRaf)
      ro.disconnect()
      io.disconnect()
      tapeEls.forEach((t, v) => t.removeEventListener('click', clickHandlers[v]))
      wrap.removeEventListener('pointerdown', onDown)
      sec.removeEventListener('pointermove', onMove)
      sec.removeEventListener('pointerenter', onEnter)
      sec.removeEventListener('pointerleave', onLeave)
      sec.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      wrap.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('glixy:select', onSelect)
      masks.forEach((m) => m && (m.innerHTML = ''))
    }
  }, [])

  const s = SERVERS[detailIdx]

  return (
    <section className="shelf grid-bg" id="racks" aria-label="Server rack shelf" ref={section}>
      <div className="shelf__probe" ref={probe} />
      <h2 className="sr-only">Pick a machine and claim your rack slot</h2>

      <div className="shelf__top">
        <span className="eyebrow">Rack &amp; slot selector</span>
        <div className="shelf__logo" aria-hidden="true">
          <Logo height={20} />
          <span>RACKS</span>
        </div>
        <span className="lbl shelf__right">6 regions · Tier IV</span>
      </div>

      <nav className="shelf__tabs" aria-label="Server types" ref={tabsRef}>
        <span className="shelf__ind" ref={indicator} />
        {KINDS.map((k, i) => (
          <button key={k.id} className="box lbl" onClick={() => api.current?.tab(i)}>
            {k.label}
          </button>
        ))}
      </nav>

      <div className="shelf__wrap">
        <div className="stage" ref={stage}>
          {tapes.map(({ v, s: srv }) => (
            <div className="tape" key={v} data-v={v}>
              <div className="sp">
                <BladeFront s={srv} uid={`${v}`} />
              </div>
              <div className="cv">
                <ServerCover s={srv} uid={`${v}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="shelf__play" ref={ring} aria-label="Open server" onClick={() => api.current?.open()}>
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2 1l9 5-9 5z" />
        </svg>
      </button>

      <div className="shelf__cap" aria-live="polite">
        <div className="cmask cmask--title" ref={(e) => { capRefs.current[0] = e }} />
        <div className="cmask cmask--sub lbl" ref={(e) => { capRefs.current[1] = e }} />
        <div className="cmask cmask--year" ref={(e) => { capRefs.current[2] = e }} />
      </div>

      <button className="shelf__arrow shelf__arrow--l" aria-label="Previous server" onClick={() => api.current?.go(-1)}>
        <svg viewBox="0 0 18 10" aria-hidden="true">
          <path d="M5 1 1 5l4 4M1 5h16" />
        </svg>
      </button>
      <button className="shelf__arrow shelf__arrow--r" aria-label="Next server" onClick={() => api.current?.go(1)}>
        <svg viewBox="0 0 18 10" aria-hidden="true">
          <path d="M13 1l4 4-4 4M17 5H1" />
        </svg>
      </button>

      <div className="shelf__foot">
        <span className="lbl">Drag · swipe · ← → · click to open</span>
        <button className="lbl shelf__talk" onClick={() => talk({ audience: s.audience })}>
          Not sure? Talk to an expert →
        </button>
      </div>

      <div className="rcursor is-off" ref={cursor} aria-hidden="true">
        <span className="rcursor__ring" />
        <span className="rcursor__dot" />
        <span className="rcursor__label">
          OPEN
          <br />
          SPECS
        </span>
      </div>

      {createPortal(
        <div className="detail grid-bg" role="dialog" aria-modal="true" aria-label={`${s.name} details`} ref={sheet}>
          <Detail
            key={s.id}
            s={s}
            onClose={() => api.current?.close()}
            onTalk={(note) => talk({ server: `${s.name} (${s.code})`, audience: s.audience, note })}
          />
        </div>,
        document.body,
      )}
    </section>
  )
}
