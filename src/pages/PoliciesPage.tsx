import { useEffect, useState } from 'react'
import PageHead from '../components/PageHead'
import { POLICIES } from '../data/company'
import { scrollToHash } from '../router'
import '../components/sections.css'

/*
 * Plain-language summaries of each policy. These are DRAFTS so the pages are
 * not empty — have a lawyer review and replace them before going live.
 */
const BODY: Record<string, string[]> = {
  sla: [
    'Monthly uptime target of 99.99% for network and power on dedicated servers and colocation.',
    'If we miss it, you get service credits on the next invoice, scaled to the downtime — no claim forms.',
    'Planned maintenance is announced at least 72 hours ahead and does not count as downtime.',
  ],
  refund: [
    'Monthly plans can be cancelled at any time; service runs until the end of the paid month.',
    'Setup fees for custom hardware and colocation are non-refundable once work has started.',
    'Refunds for billing errors are processed to the original payment method within 7 working days.',
  ],
  privacy: [
    'We collect only what we need to run your account: contact details, billing details and service logs.',
    'Your data on your servers is yours. We do not access it except to provide support you ask for, or where the law requires.',
    'You can ask to see, correct or delete your personal data, in line with India’s DPDP Act 2023.',
  ],
  terms: [
    'You are responsible for what runs on your servers and for keeping your credentials secure.',
    'Prices are in Indian rupees and exclude GST unless stated.',
    'Either party can end a monthly agreement with notice before the next billing date.',
  ],
  aup: [
    'No spam, malware, phishing, attacks on other networks, or content that is illegal in India or the hosting region.',
    'We act on verified abuse reports and will contact you before suspending a service unless there is immediate harm.',
  ],
  disclosure: [
    'Found a security issue in Glixy systems? Report it through the contact form with “Security” in the message.',
    'We acknowledge reports within 2 working days and will not take legal action against good-faith research.',
  ],
}

export default function PoliciesPage() {
  const [active, setActive] = useState(POLICIES[0].id)

  // highlight the policy currently on screen: the last one whose heading has passed the header
  useEffect(() => {
    const on = () => {
      let cur = POLICIES[0].id
      for (const p of POLICIES) {
        const el = document.getElementById(p.id)
        if (el && el.getBoundingClientRect().top <= 160) cur = p.id
      }
      setActive(cur)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <>
      <PageHead
        eyebrow="Policies"
        title={['The fine print,', 'in plain words.']}
        lead="Service levels, refunds, privacy, terms and acceptable use — summarised so you know exactly what you are signing up for."
      />
      <section className="sec" aria-label="Policies">
        <div className="sec__inner pol">
          <nav className="pol__toc" aria-label="Policies">
            {POLICIES.map((p) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                aria-current={active === p.id ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  setActive(p.id)
                  if (scrollToHash(p.id)) window.history.replaceState(null, '', `#${p.id}`)
                }}
              >
                {p.label}
              </a>
            ))}
          </nav>
          <div className="pol__body">
            <p className="pol__draft" role="note">
              Draft summaries — the full legal documents are being finalised. For a signed copy of any policy, contact us.
            </p>
            {POLICIES.map((p) => (
              <article key={p.id} id={p.id} className="pol__item">
                <h2>{p.label}</h2>
                <ul>
                  {(BODY[p.id] ?? []).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
