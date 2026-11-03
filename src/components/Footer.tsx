import { useEffect, useRef } from 'react'
import { NAV } from '../data/nav'
import { inr, LOWEST } from '../data/servers'
import { waLink, waServer } from '../data/contact'
import WhatsAppLink from './WhatsApp'
import { selectServer, useLocation, withBase } from '../router'
import { useExpert } from './expertContext'
import Link from './Link'
import Logo from './Logo'
import './footer.css'

const VIDEO =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/4d01c727-d9c5-47c8-a778-35a451ffd39f.mp4'
const POSTER =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261014_121838_c97d0940-f430-4304-8573-4f47ee44f447.png'

const MENU: [string, string][] = [
  ['Home', '/'],
  ...NAV.map((n) => [n.label === 'Trust' ? 'Trust & compliance' : n.label, n.to] as [string, string]),
  ['Contact', '/contact'],
]
const ESSENTIALS: [string, string][] = [
  ['Support', '/contact'],
  ['Network status', '/trust#uptime'],
  ['Privacy policy', '/policies#privacy'],
  ['Service level agreement', '/policies#sla'],
  ['Acceptable use', '/policies#aup'],
  ['All policies', '/policies'],
]
const PRODUCTS: [string, string][] = [
  ['Glixy Nano', 'nano'],
  ['Forge Business', 'forge'],
  ['Titan Enterprise', 'titan'],
  ['Helix GPU', 'helix'],
  ['Vault Storage', 'vault'],
  ['Colo 1U Slot', 'colo1'],
  ['Full Rack 42U', 'rack'],
]

export default function Footer() {
  const talk = useExpert()
  const { path } = useLocation()
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = video.current
    if (!v) return
    v.muted = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      v.removeAttribute('autoplay')
      v.pause()
      return
    }
    // only play while visible
    const io = new IntersectionObserver(([en]) => (en.isIntersecting ? v.play().catch(() => {}) : v.pause()))
    io.observe(v)
    return () => io.disconnect()
  }, [])

  return (
    <footer className="footer" id="footer">
      <div className="footer__stage" aria-hidden="true">
        <video ref={video} className="footer__video" src={VIDEO} poster={POSTER} muted loop playsInline preload="metadata" />
      </div>
      <div className="footer__wordmark" aria-hidden="true">
        <Logo onView height={200} label="" className="footer__logo" />
      </div>
      <div className="footer__fog" aria-hidden="true" />

      <div className="footer__content">
        <div className="brand">
          <Link className="brand__logo" to="/" aria-label="Glixy home">
            <Logo height={30} />
          </Link>
          <h2 className="brand__title">The cloud you can touch.</h2>
          <p className="brand__text">
            Glixy racks dedicated servers, GPU pods and colocation slots across six regions — for businesses that need
            contracts and SLAs, and for people who just need a box that never sleeps.
          </p>
          <button className="brand__cta" onClick={() => talk()}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 13v-1a8 8 0 0 1 16 0v1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <rect x="3" y="13" width="4.5" height="7" rx="1.6" />
              <rect x="16.5" y="13" width="4.5" height="7" rx="1.6" />
            </svg>
            Talk to an expert
          </button>
          <div className="brand__deal">
            <span className="brand__deal-k">Lowest price</span>
            <p className="brand__deal-price">
              <b>{inr(LOWEST.price)}</b>
              <span>/mo</span>
            </p>
            <p className="brand__deal-what">
              {LOWEST.name} · {LOWEST.cpu} · {LOWEST.ram} · {LOWEST.setup.toLowerCase()}
            </p>
            <div className="brand__deal-row">
              <button className="brand__deal-cta" onClick={() => selectServer(LOWEST.id)}>
                Get {LOWEST.name} →
              </button>
              <WhatsAppLink className="brand__deal-wa" href={waServer(LOWEST.name, inr(LOWEST.price))}>
                WhatsApp
              </WhatsAppLink>
            </div>
          </div>
          <ul className="brand__status" aria-label="Glixy status">
            <li className="chip">
              <span className="chip__dot" aria-hidden="true" />
              All systems operational
            </li>
            <li className="chip">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 11a8 8 0 1 0-2.3 5.7" />
                <path d="M20 4v7h-7" />
              </svg>
              99.99% · last 90 days
            </li>
            <li className="chip">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6L3.2 9.4l6.1-.8Z" />
              </svg>
              Rated 4.9 avg
            </li>
          </ul>
          <p className="brand__copy">© 2026 Glixy. All rights reserved.</p>
        </div>

        <nav className="col col--menu" aria-label="Menu">
          <h3 className="col__title">Menu</h3>
          <ul className="col__list">
            {MENU.map(([l, h]) => (
              <li key={l}>
                <Link to={h} aria-current={path === h ? 'page' : undefined}>
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav className="col" aria-label="Essentials">
          <h3 className="col__title">Essentials</h3>
          <ul className="col__list">
            {ESSENTIALS.map(([l, h]) => (
              <li key={l}>
                <Link to={h}>{l}</Link>
              </li>
            ))}
            <li>
              <a href={waLink()} target="_blank" rel="noopener noreferrer">
                WhatsApp us
              </a>
            </li>
          </ul>
        </nav>
        <nav className="col" aria-label="Products">
          <h3 className="col__title">Products</h3>
          <ul className="col__list">
            {PRODUCTS.map(([l, id]) => (
              <li key={l}>
                <a
                  href={withBase('/servers#racks')}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey) return
                    e.preventDefault()
                    selectServer(id)
                  }}
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
