import { useState } from 'react'
import PageHead from '../components/PageHead'
import ExpertForm from '../components/ExpertForm'
import { COMPANY } from '../data/company'
import { REGIONS } from '../data/servers'
import WhatsAppLink from '../components/WhatsApp'
import '../components/expert.css'
import '../components/sections.css'

const FAQ = [
  ['How fast do you reply?', 'An engineer reads every request. Most get a reply within the hour during Indian business hours, and within a working day otherwise.'],
  ['Can I visit the data centre?', 'Yes — business and colocation customers can book a guided visit. Ask in the form and we’ll arrange access.'],
  ['Do you offer a trial?', 'We can lend a machine for a 72-hour trial so you can test your real workload before you commit.'],
  ['Which payment methods do you accept?', 'UPI, cards, NEFT and RTGS, with GST invoices. Approved business accounts can pay by purchase order on net-30 terms.'],
]

export default function ContactPage() {
  const [nonce, setNonce] = useState(0)
  const channels: [string, string, string][] = [
    ['Email', COMPANY.supportEmail, `mailto:${COMPANY.supportEmail}`],
    ['Phone', COMPANY.supportPhone, `tel:${COMPANY.supportPhone.replace(/\s+/g, '')}`],
  ].filter(([, v]) => v) as [string, string, string][]

  return (
    <>
      <PageHead
        eyebrow="Contact"
        title={['Talk to a human', 'who runs servers.']}
        lead="Sales, support, partnerships or due diligence — send us a note and a real engineer will get back to you."
      />
      <section className="sec" aria-label="Contact form and details">
        <div className="sec__inner contact">
          <div className="expert__panel contact__form">
            <ExpertForm key={nonce} titleId="contact-title" onDone={() => setNonce((n) => n + 1)} doneLabel="Send another request" />
          </div>
          <aside className="contact__side">
            <div className="trust__card">
              <h3>Reach us directly</h3>
              <WhatsAppLink className="btn contact__wa">Chat on WhatsApp</WhatsAppLink>
              {channels.length ? (
                <ul className="plist">
                  {channels.map(([k, v, href]) => (
                    <li key={k}>
                      <a href={href}>
                        {k}: {v}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="contact__muted">The form is the fastest way to reach us — it goes straight to the on-call team.</p>
              )}
              <h3 className="mt">Regions</h3>
              <ul className="contact__regions">
                {REGIONS.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="trust__card">
              <h3>Common questions</h3>
              <div className="faq faq--compact">
                {FAQ.map(([q, a]) => (
                  <details key={q}>
                    <summary>{q}</summary>
                    <p>{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
