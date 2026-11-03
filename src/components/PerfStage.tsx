import { useEffect, useRef, useState } from 'react'
import { navigate } from '../router'
import DotText from './glass/DotText'
import { Grain } from './glass/Grain'
import './glass/glass.css'
import './perfstage.css'

const CDN_A = 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/'
const CDN_B = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/'

const CARD_MEDIA = {
  speed: { poster: CDN_A + '167977c6-8539-46b1-9a15-8dba566f50b8.png', src: CDN_B + 'hf_20260826_130045_1a612b69-4854-4b34-8043-ccb91f2c60af.mp4' },
  context: { poster: CDN_A + '0446d1d5-e65e-4db5-8090-3e30d09afc43.png', src: CDN_B + 'hf_20260826_130054_dd005674-d693-4d81-80a5-357f7f10b3a3.mp4' },
  connections: { poster: CDN_A + 'da8d0242-4dee-4f6d-813f-a5887e86ad77.png', src: CDN_B + 'hf_20260826_130103_7550f407-f14b-40a6-9616-7a26d7a8bd9f.mp4' },
}

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const TICKS = Array.from({ length: 23 }, (_, i) => {
  const a = ((190 + i * 5) * Math.PI) / 180
  const inner = i % 5 === 0 ? 129 : 133
  return {
    x1: 163 + Math.cos(a) * 142,
    y1: 163 + Math.sin(a) * 142,
    x2: 163 + Math.cos(a) * inner,
    y2: 163 + Math.sin(a) * inner,
    w: i % 5 === 0 ? 1.5 : 1,
  }
})

function Media({ m }: { m: { poster: string; src: string } }) {
  return <video className="card__media gc__media" autoPlay muted loop playsInline preload="auto" aria-hidden="true" poster={m.poster} src={m.src} />
}

function Gauge() {
  return (
    <svg className="gauge" viewBox="0 0 326 326" aria-hidden="true">
      <defs>
        <linearGradient id="gaugeArc" gradientUnits="userSpaceOnUse" x1="7" y1="136" x2="312" y2="109">
          <stop offset="0" stopColor="#ff9ab7" stopOpacity=".06" />
          <stop offset=".08" stopColor="#ff8caf" stopOpacity=".44" />
          <stop offset=".34" stopColor="#ff6796" stopOpacity=".94" />
          <stop offset=".58" stopColor="#ff6796" stopOpacity="1" />
          <stop offset=".82" stopColor="#ffe7ed" stopOpacity=".74" />
          <stop offset=".94" stopColor="#fff8fa" stopOpacity=".28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gaugeShadow" gradientUnits="userSpaceOnUse" x1="11" y1="136" x2="308" y2="110">
          <stop offset="0" stopColor="#6e1639" stopOpacity=".04" />
          <stop offset=".09" stopColor="#6e1639" stopOpacity=".17" />
          <stop offset=".52" stopColor="#72163d" stopOpacity=".18" />
          <stop offset=".78" stopColor="#7b1a43" stopOpacity=".1" />
          <stop offset="1" stopColor="#7b1a43" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="radarBeam" gradientUnits="userSpaceOnUse" cx="163" cy="163" r="145">
          <stop offset=".3" stopColor="#650f35" stopOpacity="0" />
          <stop offset=".45" stopColor="#650f35" stopOpacity=".025" />
          <stop offset=".7" stopColor="#650f35" stopOpacity=".065" />
          <stop offset=".9" stopColor="#650f35" stopOpacity=".08" />
          <stop offset="1" stopColor="#650f35" stopOpacity=".05" />
        </radialGradient>
        <linearGradient id="radarBeamEdge" gradientUnits="userSpaceOnUse" x1="238" y1="33" x2="190.5" y2="115.4">
          <stop offset="0" stopColor="#ffe7ef" stopOpacity=".19" />
          <stop offset=".48" stopColor="#ffd1df" stopOpacity=".11" />
          <stop offset=".82" stopColor="#ffc6d7" stopOpacity=".045" />
          <stop offset="1" stopColor="#ffc6d7" stopOpacity="0" />
        </linearGradient>
        <filter id="radarSoft">
          <feGaussianBlur stdDeviation="1.35" />
        </filter>
        <filter id="radarHalo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5.2" />
        </filter>
        <filter id="gaugeBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="11" />
        </filter>
      </defs>
      <path d="M11.34 136.26A154 154 0 0 1 307.71 110.33" fill="none" strokeWidth="3.2" strokeLinecap="round" stroke="url(#gaugeShadow)" />
      <path d="M6.91 135.48A158.5 158.5 0 0 1 311.94 108.79" fill="none" strokeWidth="2.2" strokeLinecap="round" stroke="url(#gaugeArc)" />
      <path d="M19.22 137.65A146 146 0 0 1 236 36.56" fill="none" strokeWidth="1.15" stroke="rgba(255,166,194,.31)" />
      <g className="radar">
      <path d="M238 33.1A150 150 0 0 1 277.9 66.6L199.8 119.5A55 55 0 0 0 190.5 115.4Z" fill="#6a1238" opacity=".022" filter="url(#radarHalo)" />
      <path className="radar-sweep" d="M238 33.1A150 150 0 0 1 277.9 66.6L199.8 119.5A55 55 0 0 0 190.5 115.4Z" fill="url(#radarBeam)" filter="url(#radarSoft)" />
      <path d="M238 33.1L190.5 115.4" stroke="url(#radarBeamEdge)" strokeWidth="1.25" strokeLinecap="round" filter="url(#radarSoft)" />
      </g>
      <g>
        {TICKS.map((t, i) => (
          <line key={i} className="tick" x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} strokeWidth={t.w} />
        ))}
      </g>
      <ellipse cx="225" cy="166" rx="92" ry="76" fill="#fff" opacity=".055" filter="url(#gaugeBlur)" />
    </svg>
  )
}

function TileWall() {
  return (
    <div className="context-glow" aria-hidden="true">
      <svg className="context-backdrop" viewBox="0 0 429 554" preserveAspectRatio="none">
        <defs>
          <filter id="tileSoft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.4" />
          </filter>
          <filter id="groutSoft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6.5" />
          </filter>
          <linearGradient id="tTLf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d4b0ee" stopOpacity=".05" />
            <stop offset="1" stopColor="#c6bbff" stopOpacity=".18" />
          </linearGradient>
          <linearGradient id="tTCf" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#d5c2ff" stopOpacity=".22" />
            <stop offset=".35" stopColor="#e0bdff" stopOpacity=".26" />
            <stop offset=".7" stopColor="#f2a0ee" stopOpacity=".32" />
            <stop offset="1" stopColor="#ff96da" stopOpacity=".34" />
          </linearGradient>
          <linearGradient id="tTRf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe8da" stopOpacity=".56" />
            <stop offset=".5" stopColor="#f9c6d0" stopOpacity=".26" />
            <stop offset="1" stopColor="#eba4bf" stopOpacity=".08" />
          </linearGradient>
          <linearGradient id="tMLf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c7a6f0" stopOpacity=".3" />
            <stop offset="1" stopColor="#9c62c8" stopOpacity=".16" />
          </linearGradient>
          <linearGradient id="tMCf" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e3b6f5" stopOpacity=".2" />
            <stop offset="1" stopColor="#d77ac5" stopOpacity=".22" />
          </linearGradient>
          <linearGradient id="tMRf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e858b8" stopOpacity=".52" />
            <stop offset=".55" stopColor="#e6459c" stopOpacity=".46" />
            <stop offset="1" stopColor="#de74ba" stopOpacity=".16" />
          </linearGradient>
          <linearGradient id="tSheen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".28" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="deepX" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7a2442" stopOpacity=".55" />
            <stop offset=".35" stopColor="#e2806c" stopOpacity=".45" />
            <stop offset=".7" stopColor="#ec9ac4" stopOpacity=".42" />
            <stop offset="1" stopColor="#a7b4ff" stopOpacity=".35" />
          </linearGradient>
          <radialGradient id="hazeTR">
            <stop offset="0" stopColor="#ffe4ec" stopOpacity=".5" />
            <stop offset="1" stopColor="#ffe4ec" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="plum">
            <stop offset="0" stopColor="#6b2a7c" stopOpacity=".45" />
            <stop offset="1" stopColor="#6b2a7c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g filter="url(#tileSoft)">
          <rect x="-24" y="22" width="106" height="149" rx="15" fill="url(#tTLf)" />
          <rect x="88" y="22" width="247" height="150" rx="15" fill="url(#tTCf)" />
          <rect x="88" y="22" width="247" height="46" rx="15" fill="url(#tSheen)" />
          <rect x="346" y="22" width="111" height="147" rx="15" fill="url(#tTRf)" />
          <rect x="346" y="22" width="111" height="46" rx="15" fill="url(#tSheen)" />
          <rect x="-24" y="177" width="108" height="174" rx="15" fill="url(#tMLf)" />
          <rect x="-24" y="177" width="108" height="52" rx="15" fill="url(#tSheen)" />
          <rect x="88" y="177" width="247" height="174" rx="15" fill="url(#tMCf)" />
          <rect x="344" y="175" width="113" height="176" rx="15" fill="url(#tMRf)" />
          <rect x="-24" y="384" width="480" height="170" rx="15" fill="url(#deepX)" />
        </g>
        <g filter="url(#groutSoft)" fill="#5a1f5e" opacity=".42">
          <rect x="81" y="30" width="8" height="150" />
          <rect x="338" y="30" width="8" height="322" />
          <rect x="0" y="167" width="429" height="12" />
        </g>
        <ellipse cx="352" cy="86" rx="70" ry="54" fill="url(#hazeTR)" />
        <ellipse cx="75" cy="150" rx="41" ry="27" fill="#fff" opacity=".12" filter="url(#groutSoft)" />
        <ellipse cx="8" cy="334" rx="38" ry="29" fill="url(#plum)" />
        <ellipse cx="56" cy="215" rx="28" ry="31" fill="#b37cf0" opacity=".18" filter="url(#groutSoft)" />
      </svg>
    </div>
  )
}

function ConnectionsMap() {
  return (
    <svg className="connections-map" viewBox="0 0 429 238" preserveAspectRatio="none" aria-hidden="true">
      <g fill="none" stroke="#fff" strokeWidth="1">
        <path opacity=".2" d="M0 5H128c27 0 36 7 39 26 2 16 9 22 24 22h106c16 0 23-8 25-25 2-16 10-23 31-23h76" />
        <path opacity=".3" d="M0 117h46c15 0 22 8 26 25 5 23 12 31 31 31h174c18 0 25-8 30-31 4-17 11-25 26-25h96" />
        <path opacity=".34" d="M0 173h87c15 0 22 7 27 25 4 15 11 22 28 22h140c17 0 25-7 29-22 5-18 12-25 28-25h90" />
        <path opacity=".16" d="M0 228h120c17 0 25-5 28-18 4-15 10-20 28-20h81c18 0 25 6 28 20 4 13 11 18 28 18h116" />
        <path opacity=".26" d="M0 5H429M0 61H429M0 117H429" />
        <path opacity=".09" d="M0 173H429" />
      </g>
      <g fill="none" stroke="#fff8dd" strokeWidth="1.15">
        <path opacity=".52" d="M0 61h95c14 0 22-6 27-20 4-13 12-20 27-20h115c15 0 23 6 27 20 5 14 13 20 28 20h110" />
        <path opacity=".94" d="M0 117h88c15 0 22-8 25-25 4-24 12-31 31-31h129c20 0 27 7 31 31 3 17 10 25 26 25h99" />
      </g>
      <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" className="flow">
        <path pathLength={100} d="M0 61h95c14 0 22-6 27-20 4-13 12-20 27-20h115c15 0 23 6 27 20 5 14 13 20 28 20h110" />
        <path pathLength={100} d="M0 117h88c15 0 22-8 25-25 4-24 12-31 31-31h129c20 0 27 7 31 31 3 17 10 25 26 25h99" />
      </g>
      <circle cx="45" cy="117" r="6.5" fill="#fff" />
      <circle cx="133" cy="61" r="6.5" fill="#fff4a7" />
      <circle cx="189" cy="61" r="6.5" fill="#fff1a4" />
      <circle cx="319" cy="61" r="6.5" fill="#fff4a6" />
      <circle cx="319" cy="117" r="6.5" fill="#fff2a0" />
      {[
        [45, 117],
        [133, 61],
        [189, 61],
        [319, 61],
        [319, 117],
      ].map(([cx, cy], i) => (
        <circle key={i} className="node-ping" cx={cx} cy={cy} r="6.5" fill="none" stroke="#fff4c4" style={{ animationDelay: `${i * 0.45}s` }} />
      ))}
    </svg>
  )
}

/** "Built for Intelligent Performance" — full-viewport stage with three glass metric cards. */
export default function PerfStage() {
  const root = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<'wait' | 'play' | 'done'>(() => (reduce() ? 'done' : 'wait'))

  useEffect(() => {
    const el = root.current
    if (!el || phase !== 'wait') return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        setPhase('play')
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [phase])

  useEffect(() => {
    if (phase !== 'play') return
    // failsafe: the last control settles at ~2.0s
    const t = window.setTimeout(() => setPhase('done'), 3200)
    return () => window.clearTimeout(t)
  }, [phase])

  // metrics count up once the cards have settled in
  const [p, setP] = useState(() => (reduce() ? 1 : 0))
  const started = phase !== 'wait'
  useEffect(() => {
    if (!started || p >= 1) return
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, Math.max(0, (now - start - 900) / 1300))
      setP(1 - Math.pow(1 - t, 3))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started])
  const count = (v: number, dec: number) => (v * (phase === 'wait' ? 0 : p)).toFixed(dec)

  const onEnd = (e: React.AnimationEvent) => {
    if (e.animationName !== 'ps-control-settle') return
    const t = e.target as HTMLElement
    const mobile = window.matchMedia('(max-width: 767px)').matches
    if (t.closest(mobile ? '.card--speed' : '.card--connections')) setPhase('done')
  }

  return (
    <section ref={root} className={`ps ps--${phase}`} aria-labelledby="ps-title" onAnimationEnd={onEnd}>

      <header className="masthead">
        <span className="eyebrow ps__eyebrow">Performance</span>
        <h2 className="headline" id="ps-title">
          <span className="headline__line">
            Built for{' '}
            <span className="dot-word" aria-label="Intelligent">
              <DotText text="Intelligent" pitchX={4} r={1.8} label="Intelligent" />
            </span>
          </span>
          <span className="headline__line">Performance</span>
        </h2>
        <p className="intro">
          Every capability is engineered for speed, scale and<br className="desktop-break" /> contextual understanding, giving your AI the foundation
          <br className="desktop-break" /> to reason, adapt and perform in production.
        </p>
      </header>

      <div className="cards" role="group" aria-label="Performance capabilities">
        <article className="card card--speed gc gc--speed">
          <Media m={CARD_MEDIA.speed} />
          <h3 className="card__title">
            Inference Speed
            <br />
            AI Response Latency
          </h3>
          <Gauge />
          <p className="metric metric--speed">
            <span className="dot-number">
              <DotText text={count(118, 0)} label="118" />
            </span>
            <span className="metric__unit">ms</span>
          </p>
          <p className="caption">
            Average global
            <br />
            response
          </p>
          <button type="button" className="learn-more" onClick={() => navigate('/benchmarks')}>
            Learn More
          </button>
          <Grain />
        </article>

        <article className="card card--context gc gc--context">
          <Media m={CARD_MEDIA.context} />
          <TileWall />
          <h3 className="card__title">
            Context Window
            <br />
            Long-form Understanding
          </h3>
          <div className="context-window" aria-hidden="true">
            <div className="window-lines">
              <span />
              <span />
              <span />
            </div>
            <div className="token-stream">
              {Array.from({ length: 14 }, (_, i) => (
                <i key={i} style={{ animationDelay: `${i * 0.18}s` }} />
              ))}
            </div>
          </div>
          <p className="metric metric--context">
            <span className="dot-number">
              <DotText text={count(2.4, 1)} r={2.32} label="2.4" />
            </span>
            <span className="metric__unit">M</span>
          </p>
          <p className="caption">
            Tokens processed
            <br />
            simultaneously
          </p>
          <button type="button" className="learn-more" onClick={() => navigate('/ai')}>
            Learn More
          </button>
          <Grain />
        </article>

        <article className="card card--connections gc gc--connections">
          <Media m={CARD_MEDIA.connections} />
          <h3 className="card__title">
            Intelligent Connections
            <br />
            Cross-Source Context
          </h3>
          <ConnectionsMap />
          <p className="metric metric--connections">
            <span className="dot-number">
              <DotText text={count(16, 0)} label="16" />
            </span>
            <span className="metric__unit">K</span>
          </p>
          <p className="caption">
            Connected data
            <br />
            sources
          </p>
          <button type="button" className="learn-more" onClick={() => navigate('/servers')}>
            Learn More
          </button>
          <Grain />
        </article>
      </div>
    </section>
  )
}
