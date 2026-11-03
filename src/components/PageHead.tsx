import type { ReactNode } from 'react'
import { scrollToHash } from '../router'
import Link from './Link'
import './pagehead.css'

/** Banner at the top of every inner page: breadcrumb, title, lead and jump links. */
export default function PageHead({
  eyebrow,
  title,
  lead,
  jumps = [],
  children,
}: {
  eyebrow: string
  title: string[]
  lead: string
  jumps?: [string, string][]
  children?: ReactNode
}) {
  return (
    <section className="ph grid-bg">
      <div className="ph__glow" aria-hidden="true" />
      <svg className="ph__mark" viewBox="-14 -14 136 128" aria-hidden="true">
        <circle cx="54" cy="50" r="60" className="ph__ring" pathLength={1} />
        <path d="M93.5 25.9A47 42 0 1 0 102 50H62" className="ph__g" pathLength={1} />
      </svg>

      <div className="ph__inner">
        <nav className="ph__crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{eyebrow}</span>
        </nav>
        <h1 className="ph__h1">
          {title.map((l, i) => (
            <span className="ph__line" key={l}>
              <span style={{ animationDelay: `${120 + i * 110}ms` }}>{l}</span>
            </span>
          ))}
        </h1>
        <p className="ph__lead">{lead}</p>
        {jumps.length > 0 && (
          <ul className="ph__jumps" aria-label="On this page">
            {jumps.map(([label, id], i) => (
              <li key={id} style={{ animationDelay: `${520 + i * 70}ms` }}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    if (scrollToHash(id)) window.history.replaceState(null, '', `#${id}`)
                  }}
                >
                  {label}
                  <svg viewBox="0 0 10 10" aria-hidden="true">
                    <path d="M5 1v8M1.5 5.5 5 9l3.5-3.5" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        )}
        {children}
      </div>
    </section>
  )
}
