import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useExpert } from './expertContext'
import Link from './Link'
import { Grain } from './glass/Grain'
import './glass/glass.css'
import './hero.css'

const ART_VIDEO =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/435a4fe7-e43b-4e7c-af78-0be083e73569.mp4'
const ART_STILL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/782a4a52-4c1e-4471-bb0c-aa232927f4a6.webp'

const LINES = ['Bare metal', 'built for what', 'you run next.']

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [still] = useState(reducedMotion)
  const talk = useExpert()

  // One Web Animations timeline on load, then the page is static.
  useLayoutEffect(() => {
    const el = root.current
    if (!el || reducedMotion()) return
    const ease = 'cubic-bezier(.2,.8,.2,1)'
    // while the boot splash is up, hold the entrance until it lifts
    const boot = document.getElementById('boot') && !document.getElementById('boot')!.classList.contains('is-out') ? 1450 : 0
    const q = (s: string) => Array.from(el.querySelectorAll<HTMLElement>(s))
    const anims: Animation[] = []
    const rise = (n: HTMLElement, delay: number, from = 'translateY(18px)', dur = 800) =>
      anims.push(
        n.animate([{ opacity: 0, transform: from }, { opacity: 1, transform: 'none' }], {
          duration: dur,
          delay: delay + boot,
          easing: ease,
          fill: 'backwards',
        }),
      )

    q('.hl > span').forEach((n, i) =>
      anims.push(
        n.animate([{ transform: 'translateY(108%)' }, { transform: 'none' }], {
          duration: 1050,
          delay: boot + 320 + i * 120,
          easing: ease,
          fill: 'backwards',
        }),
      ),
    )
    q('.hero__sub').forEach((n) => rise(n, 760))
    q('.hero__btns > *').forEach((n, i) =>
      anims.push(
        n.animate(
          [
            { opacity: 0, transform: `translateY(16px) scale(${i === 0 ? 1.015 : 1})` },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 800, delay: boot + 900 + i * 90, easing: ease, fill: 'backwards' },
        ),
      ),
    )
    q('.hero__stats > li').forEach((n, i) => rise(n, 1080 + i * 90, 'translateY(14px)'))
    q('.hero__art').forEach((n) =>
      anims.push(
        n.animate([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], {
          duration: 1600,
          delay: boot + 200,
          easing: ease,
          fill: 'backwards',
        }),
      ),
    )
    q('.hcard').forEach((n, i) => rise(n, 1300 + i * 140, 'translateY(28px)', 900))
    return () => anims.forEach((a) => a.cancel())
  }, [])

  useEffect(() => {
    const v = video.current
    if (!v) return
    v.muted = true
    v.play().catch(() => {})
  }, [])

  return (
    <section className="hero grid-bg" id="top" ref={root}>
      <div className="hero__canvas">
        <div className="hero__copy">
          <h1 className="hero__h1">
            {LINES.map((l) => (
              <span className="hl" key={l}>
                <span>{l}</span>
              </span>
            ))}
          </h1>
          <p className="hero__sub">
            Glixy racks dedicated servers, GPU pods and colocation slots for businesses and builders — live in
            minutes, backed by engineers you can call.
          </p>
          <div className="hero__btns">
            <Link className="hbtn hbtn--primary" to="/#racks">
              Explore Racks
            </Link>
            <button className="hbtn hbtn--glass glass" onClick={() => talk()}>
              Talk to Expert
            </button>
          </div>
          <ul className="hero__stats">
            <li>
              <b>6</b>
              <span>regions</span>
            </li>
            <li>
              <b>99.99%</b>
              <span>uptime SLA</span>
            </li>
          </ul>
        </div>

        <div className="hero__stage">
          <div className="hero__art" aria-hidden="true">
            {still ? (
              <img src={ART_STILL} alt="" />
            ) : (
              <video ref={video} src={ART_VIDEO} poster={ART_STILL} autoPlay muted loop playsInline preload="auto" />
            )}
          </div>

          <article className="hcard hcard--a gc gc--speed">
            <span className="hcard__icon" aria-hidden="true">
              <svg viewBox="0 0 32 32">
                <rect x="6" y="5" width="20" height="6" rx="1.5" />
                <rect x="6" y="13" width="20" height="6" rx="1.5" />
                <rect x="6" y="21" width="20" height="6" rx="1.5" />
                <circle cx="10" cy="8" r=".9" className="f" />
                <circle cx="10" cy="16" r=".9" className="f" />
                <circle cx="10" cy="24" r=".9" className="f" />
                <path d="M15 8h7M15 16h7M15 24h7" />
              </svg>
            </span>
            <div>
              <p className="hcard__kicker">Bare Metal</p>
              <h3 className="hcard__title">
                GLX Titan: Dedicated,
                <br />
                Single-Tenant Compute.
              </h3>
            </div>
            <Grain />
          </article>

          <article className="hcard hcard--b gc gc--connections">
            <span className="hcard__icon" aria-hidden="true">
              <svg viewBox="0 0 32 32">
                <path d="M5 27V9l5-3v4l6-4 6 4V6l5 3v18Z" />
                <path d="M12 27v-6a4 4 0 0 1 8 0v6" />
                <rect x="13.5" y="13" width="5" height="4" rx=".8" />
                <path d="M14.5 13v-1.4a1.5 1.5 0 0 1 3 0V13" />
              </svg>
            </span>
            <div>
              <p className="hcard__kicker">Colocation</p>
              <h3 className="hcard__title">
                VAULT: Secure Rack Slots
                <br />
                in Tier IV Data Halls.
              </h3>
            </div>
            <Grain />
          </article>
        </div>

      </div>
    </section>
  )
}
