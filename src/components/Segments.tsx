import { useState } from 'react'
import { SERVERS, inr } from '../data/servers'
import { useExpert } from './expertContext'
import { selectServer } from '../router'
import { gc } from './glass/dots'
import { Grain } from './glass/Grain'
import './glass/glass.css'
import './segments.css'

const COPY = {
  B2B: {
    title: ['Infrastructure your', 'board can sign off.'],
    lead: 'For startups, enterprises and public teams that need dedicated hardware, clear contracts and someone senior on the phone.',
    points: [
      ['Named account engineer', 'One person who knows your stack, on WhatsApp, Slack and phone.'],
      ['99.99% SLA with credits', 'Written into the contract, paid automatically when we miss.'],
      ['GST invoices & POs', 'Monthly or annual billing, net-30 terms for approved accounts.'],
      ['Private networking', 'VLANs, cross-connects and dedicated IP blocks across regions.'],
    ],
    picks: ['forge', 'titan', 'helix', 'rack'],
    cta: 'Talk to a solutions expert',
  },
  B2C: {
    title: ['A real server,', 'priced for one person.'],
    lead: 'For developers, gamers, creators and students who want root access to real hardware without an enterprise contract.',
    points: [
      ['Live in 60 seconds', 'Pick a plan, pay, and SSH in before your coffee cools.'],
      ['UPI & card billing', 'Monthly plans, cancel anytime, no surprise bandwidth bills.'],
      ['One-click apps', 'Game servers, WordPress, AI notebooks and VPNs ready to go.'],
      ['Humans on chat', 'Real engineers answer — even on the ₹499 plan.'],
    ],
    picks: ['nano', 'spark', 'arena', 'studio'],
    cta: 'Ask an expert for free',
  },
} as const

export default function Segments() {
  const [seg, setSeg] = useState<'B2B' | 'B2C'>('B2B')
  const talk = useExpert()
  const c = COPY[seg]

  const pick = selectServer

  return (
    <section className="seg grid-bg" id="segments" aria-labelledby="seg-title">
      <div className="seg__inner">
        <div className="seg__head">
          <span className="eyebrow">Business &amp; Personal</span>
          <div className="seg__toggle" role="tablist" aria-label="Customer type">
            <span className={`seg__pill ${seg === 'B2C' ? 'is-r' : ''}`} aria-hidden="true" />
            <button role="tab" aria-selected={seg === 'B2B'} onClick={() => setSeg('B2B')}>
              For Business <small>B2B</small>
            </button>
            <button role="tab" aria-selected={seg === 'B2C'} onClick={() => setSeg('B2C')}>
              For You <small>B2C</small>
            </button>
          </div>
        </div>

        <div className="seg__body" key={seg}>
          <div className="seg__copy">
            <h2 id="seg-title">
              {c.title.map((l) => (
                <span className="sl" key={l}>
                  <span>{l}</span>
                </span>
              ))}
            </h2>
            <p className="seg__lead">{c.lead}</p>
            <ul className="seg__points">
              {c.points.map(([h, t]) => (
                <li key={h}>
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="m4.5 10.5 3.5 3.5 7.5-8" />
                  </svg>
                  <div>
                    <b>{h}</b>
                    <span>{t}</span>
                  </div>
                </li>
              ))}
            </ul>
            <button className="btn btn--primary" onClick={() => talk({ audience: seg })}>
              {c.cta}
            </button>
          </div>

          <ul className="seg__plans">
            {c.picks.map((id, i) => {
              const s = SERVERS.find((x) => x.id === id)!
              return (
                <li key={id} className={`plan ${gc(i, 'gc--dense')}`} style={{ '--i': i, '--a': s.accent } as React.CSSProperties}>
                  <div className="plan__top">
                    <span className="plan__code">{s.code}</span>
                    <span className="plan__led" />
                  </div>
                  <h3>{s.name}</h3>
                  <p className="plan__tag">{s.tagline}</p>
                  <dl>
                    <div>
                      <dt>CPU</dt>
                      <dd>{s.cpu}</dd>
                    </div>
                    <div>
                      <dt>{s.gpu ? 'GPU' : 'RAM'}</dt>
                      <dd>{s.gpu ?? s.ram}</dd>
                    </div>
                  </dl>
                  <div className="plan__foot">
                    <p>
                      <b>{inr(s.price)}</b>
                      <span>/mo</span>
                    </p>
                    <button className="gc-pill" onClick={() => pick(s.id)} aria-label={`View ${s.name} in the rack`}>
                      View in rack →
                    </button>
                  </div>
                  <Grain />
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
