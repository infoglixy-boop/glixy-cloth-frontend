import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NAV } from '../data/nav'
import { inr, LOWEST } from '../data/servers'
import { waServer } from '../data/contact'
import { selectServer, useLocation } from '../router'
import WhatsAppLink from './WhatsApp'
import { useExpert } from './expertContext'
import Link from './Link'
import Logo from './Logo'
import './siteheader.css'

export default function SiteHeader() {
  const { path } = useLocation()
  const talk = useExpert()
  const [menu, setMenu] = useState(false)
  const [solid, setSolid] = useState(false)
  const [hidden, setHidden] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const ind = useRef<HTMLSpanElement>(null)
  const [menuPath, setMenuPath] = useState(path)

  // close the mobile menu whenever the route changes
  if (menuPath !== path) {
    setMenuPath(path)
    setMenu(false)
  }

  // solid background once scrolled; hide while scrolling down, show on the way up
  useEffect(() => {
    let last = window.scrollY
    const on = () => {
      const y = window.scrollY
      setSolid(y > 12)
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 240)
        last = y
      }
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // slide the active-page indicator under the current link
  useLayoutEffect(() => {
    const nav = navRef.current
    const bar = ind.current
    if (!nav || !bar) return
    const place = () => {
      const a = nav.querySelector<HTMLElement>('a[aria-current="page"]')
      if (!a) {
        bar.style.opacity = '0'
        return
      }
      bar.style.opacity = '1'
      bar.style.width = `${a.offsetWidth}px`
      bar.style.transform = `translateX(${a.offsetLeft}px)`
    }
    place()
    document.fonts?.ready.then(place)
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [path])

  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu])

  const active = (to: string) => path === to || path.startsWith(to + '/')

  return (
    <header className={`sh${solid || path !== '/' ? ' is-solid' : ''}${hidden && !menu ? ' is-hidden' : ''}${menu ? ' is-menu' : ''}`}>
      <div className="sh__promo">
        <span className="sh__promo-badge">Lowest price</span>
        <span className="sh__promo-text">
          Dedicated servers from <b>{inr(LOWEST.price)}/mo</b>
          <span className="sh__promo-more"> · {LOWEST.name} · {LOWEST.setup.toLowerCase()}</span>
        </span>
        <button className="sh__promo-cta" onClick={() => selectServer(LOWEST.id)}>
          Get it →
        </button>
        <WhatsAppLink className="sh__promo-wa" href={waServer(LOWEST.name, inr(LOWEST.price))}>
          <span>WhatsApp</span>
        </WhatsAppLink>
      </div>
      <div className="sh__bar">
        <Link to="/" className="sh__brand" aria-label="Glixy home">
          <Logo height={26} replayKey={path} />
        </Link>

        <nav className="sh__nav" aria-label="Primary" ref={navRef}>
          <span className="sh__ind" ref={ind} aria-hidden="true" />
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} aria-current={active(n.to) ? 'page' : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="sh__right">
          <Link to="/contact" className="sh__link" aria-current={active('/contact') ? 'page' : undefined}>
            Contact
          </Link>
          <button className="sh__cta" onClick={() => talk()}>
            Talk to Expert
          </button>
        </div>

        <button
          className="sh__menu"
          aria-label={menu ? 'Close menu' : 'Open menu'}
          aria-expanded={menu}
          aria-controls="sh-panel"
          onClick={() => setMenu((m) => !m)}
        >
          <span />
          <span />
        </button>
      </div>

      {menu && (
        <div className="sh__panel" id="sh-panel">
          <Link to="/" aria-current={path === '/' ? 'page' : undefined} style={{ '--i': 0 } as React.CSSProperties}>
            Home
          </Link>
          {[...NAV, { label: 'Contact', to: '/contact' }].map((n, i) => (
            <Link key={n.to} to={n.to} aria-current={active(n.to) ? 'page' : undefined} style={{ '--i': i + 1 } as React.CSSProperties}>
              {n.label}
              <svg viewBox="0 0 18 10" aria-hidden="true">
                <path d="M13 1l4 4-4 4M17 5H1" />
              </svg>
            </Link>
          ))}
          <div className="sh__panel-row">
            <button
              className="btn btn--primary"
              onClick={() => {
                setMenu(false)
                talk()
              }}
            >
              Talk to Expert
            </button>
            <WhatsAppLink className="btn sh__wa-btn">WhatsApp</WhatsAppLink>
          </div>
        </div>
      )}
      <span className="sh__progress" key={path} aria-hidden="true" />
    </header>
  )
}
