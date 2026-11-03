import { CUSTOMER_MIX } from '../data/metrics'
import { SERVERS } from '../data/servers'
import { ChartCard, DonutChart } from './charts/Charts'
import { selectServer } from '../router'
import { gc } from './glass/dots'
import { Grain } from './glass/Grain'
import './glass/glass.css'
import './sections.css'

const WHO: { who: string; pain: string; gain: string[]; plan: string; icon: string }[] = [
  {
    who: 'Startups & SaaS',
    pain: 'Cloud bills that grow faster than revenue.',
    gain: ['Flat monthly pricing', 'Up to 2× faster per rupee', 'Free migration help'],
    plan: 'forge',
    icon: 'M4 18l5-6 4 3 7-9',
  },
  {
    who: 'E-commerce & D2C',
    pain: 'Sale-day traffic that times out checkouts.',
    gain: ['Burst-ready dedicated cores', 'Private DB servers', 'DDoS shield on every port'],
    plan: 'titan',
    icon: 'M5 7h14l-1.5 9h-11zM9 7a3 3 0 0 1 6 0',
  },
  {
    who: 'Fintech & BFSI',
    pain: 'Regulators asking where customer data lives.',
    gain: ['Data stays in India', 'Single-tenant hardware', 'Audit logs & access trails'],
    plan: 'atlas',
    icon: 'M4 10h16M6 10v7M10 10v7M14 10v7M18 10v7M3 19h18M12 4l9 4H3z',
  },
  {
    who: 'AI / ML teams',
    pain: 'Pre-empted GPUs and lost training runs.',
    gain: ['Reserved, never pre-empted GPUs', 'RDMA between nodes', 'Fixed cost per run'],
    plan: 'helix',
    icon: 'M12 3v4M12 17v4M3 12h4M17 12h4M7 7l2 2M15 15l2 2M7 17l2-2M15 9l2-2M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  },
  {
    who: 'Gaming studios',
    pain: 'Lag spikes and attacks during peak hours.',
    gain: ['5 GHz cores, low ping', 'Game-aware DDoS filtering', 'One-click server installers'],
    plan: 'arena',
    icon: 'M7 9v4M5 11h4M15 10h.01M17 12h.01M8 6h8a5 5 0 0 1 4.6 7l-1 2.3a2.5 2.5 0 0 1-4.4.3L14 14h-4l-1.2 1.6a2.5 2.5 0 0 1-4.4-.3l-1-2.3A5 5 0 0 1 8 6z',
  },
  {
    who: 'Media & creators',
    pain: 'Renders and encodes that eat whole days.',
    gain: ['Big NVMe scratch space', 'Unmetered bandwidth', 'Overnight render boxes'],
    plan: 'studio',
    icon: 'M4 6h12v12H4zM16 10l4-2v8l-4-2',
  },
  {
    who: 'Government & PSUs',
    pain: 'Sovereign hosting with tender-ready paperwork.',
    gain: ['Indian regions only', 'Private cages & racks', 'GST invoicing & POs'],
    plan: 'rack',
    icon: 'M12 3l8 4v2H4V7zM5 9v8M9 9v8M15 9v8M19 9v8M3 19h18',
  },
  {
    who: 'Students & developers',
    pain: 'Wanting a real server without a credit line.',
    gain: ['Root server from ₹499', 'UPI monthly billing', 'Human help on chat'],
    plan: 'nano',
    icon: 'M4 6h16v10H4zM8 20h8M12 16v4M8 10l2 2-2 2M12 14h4',
  },
]

export default function Customers() {
  const pick = selectServer

  return (
    <section className="sec" id="customers" aria-labelledby="who-title">
      <div className="sec__inner">
        <header className="sec__head">
          <span className="eyebrow">Who runs on Glixy</span>
          <h2 id="who-title">Built for anyone who has outgrown shared hosting.</h2>
          <p>From a student’s first server to a bank’s private cage — here is who uses Glixy, and what they get out of it.</p>
        </header>

        <ul className="who">
          {WHO.map((w, i) => {
            const s = SERVERS.find((x) => x.id === w.plan)!
            return (
              <li key={w.who} className={`who__card ${gc(i, 'gc--dense')}`}>
                <span className="who__ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d={w.icon} />
                  </svg>
                </span>
                <h3>{w.who}</h3>
                <p className="who__pain">{w.pain}</p>
                <ul>
                  {w.gain.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
                <button className="gc-pill" onClick={() => pick(s.id)}>
                  Best fit: <b>{s.name}</b> →
                </button>
                <Grain />
              </li>
            )
          })}
        </ul>

        <ChartCard
          className="sec__wide"
          title="Customer mix"
          sub="Share of active customers by segment"
          table={{ head: ['Segment', 'Share'], rows: CUSTOMER_MIX.map((c) => [c.label, `${c.value}%`]) }}
        >
          <DonutChart parts={CUSTOMER_MIX} title="All customers" />
        </ChartCard>
      </div>
    </section>
  )
}
