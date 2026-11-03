import { COMPLIANCE, PAYMENTS, POLICIES, SECURITY, type ComplianceStatus } from '../data/company'
import { BUSINESS_STATS, MRR, SERIES, UPTIME_90, UPTIME_FACTS } from '../data/metrics'
import { ChartCard, LineChart, SampleBadge, StatTile, UptimeBars } from './charts/Charts'
import { useExpert } from './expertContext'
import Link from './Link'
import { Grain } from './glass/Grain'
import './glass/glass.css'
import './sections.css'

const STATUS: Record<ComplianceStatus, string> = {
  certified: 'Certified',
  'in-progress': 'In progress',
  planned: 'Planned',
}


export default function Trust() {
  const talk = useExpert()
  const growth = MRR.values[MRR.values.length - 1] / MRR.values[0]

  return (
    <section className="sec sec--tint" id="trust" aria-labelledby="trust-title">
      <div className="sec__inner">
        <header className="sec__head">
          <span className="eyebrow">Trust & transparency</span>
          <h2 id="trust-title">Open books. Open status. Nothing hidden.</h2>
          <p>
            Customers, auditors and lenders all ask the same questions: will you stay up, will you be around, and who
            is accountable? Here are our answers.
          </p>
        </header>

        <div className="sec__grid sec__grid--2">
          <ChartCard title="Uptime, last 90 days" sub="All regions · each bar is one day" id="uptime">
            <UptimeBars days={UPTIME_90} />
            <dl className="ufacts">
              {UPTIME_FACTS.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="ufoot">Every incident gets a public post-mortem within 72 hours.</p>
          </ChartCard>

          <ChartCard
            title="Monthly recurring revenue"
            sub={`₹ lakh · ${growth.toFixed(1)}× in 12 months`}
            table={{ head: ['Month', '₹ lakh'], rows: MRR.x.map((m, i) => [m, MRR.values[i]]) }}
          >
            <LineChart area x={MRR.x} format={(n) => `₹${n}L`} series={[{ name: 'MRR', color: SERIES.glixy.color, values: MRR.values }]} height={240} />
          </ChartCard>
        </div>

        <div className="sec__stats sec__stats--4">
          {BUSINESS_STATS.map((s, i) => (
            <StatTile key={s.label} label={s.label} value={s.value} note={s.delta} i={i} />
          ))}
        </div>

        <div className="trust__block" id="compliance">
          <div className="trust__title">
            <h3>Compliance & certifications</h3>
            <SampleBadge />
          </div>
          <ul className="comp">
            {COMPLIANCE.map((c) => (
              <li key={c.name} className={`comp__item comp--${c.status}`}>
                <span className="comp__seal" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z" />
                    {c.status === 'certified' && <path d="m8.5 12 2.5 2.5 4.5-5" />}
                  </svg>
                </span>
                <div>
                  <b>{c.name}</b>
                  <p>{c.what}</p>
                </div>
                <span className="comp__status">{STATUS[c.status]}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="trust__block">
          <h3 className="trust__title">Security & operations</h3>
          <ul className="sec-ops">
            {SECURITY.map(([h, t]) => (
              <li key={h}>
                <b>{h}</b>
                <p>{t}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="trust__cols">
          <div className="trust__card">
            <h3>Policies</h3>
            <ul className="plist">
              {POLICIES.map((p) => (
                <li key={p.id}>
                  <Link to={`/policies#${p.id}`}>{p.label} →</Link>
                </li>
              ))}
            </ul>
            <h3 className="mt">Billing & payments</h3>
            <ul className="plist plist--plain">
              {PAYMENTS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="trust__card trust__card--accent gc gc--speed gc--dense" id="lenders">
            <span className="eyebrow">For investors & lenders</span>
            <h3>Due diligence, made easy.</h3>
            <p>
              Request our company profile, financial statements, customer contracts summary and growth projections. We
              answer bank and investor questions within two working days.
            </p>
            <button className="gc-pill" onClick={() => talk({ audience: 'B2B', note: 'Investor / lender enquiry — please share company profile and financials' })}>
              Request the data room
            </button>
            <Grain />
          </div>
        </div>
      </div>
    </section>
  )
}
