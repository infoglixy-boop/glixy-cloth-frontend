import { useState } from 'react'
import { SERVERS } from '../data/servers'
import type { ExpertPrefill } from './expertContext'

type Status = 'idle' | 'sending' | 'sent' | 'error'

/** The "talk to an expert" form. Posts to the backend's /api/contact route. */
export default function ExpertForm({
  prefill = {},
  onDone,
  titleId = 'expert-title',
  doneLabel = 'Done',
}: {
  prefill?: ExpertPrefill
  onDone: () => void
  titleId?: string
  doneLabel?: string
}) {
  const [status, setStatus] = useState<Status>('idle')
  const [audience, setAudience] = useState<'B2B' | 'B2C'>(prefill.audience ?? 'B2B')

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const server = String(f.get('server') || '')
    const company = String(f.get('company') || '')
    const lines = [`Customer type: ${audience === 'B2B' ? 'Business' : 'Personal'}`]
    if (company) lines.push(`${audience === 'B2B' ? 'Company' : 'Use case'}: ${company}`)
    if (server) lines.push(`Interested in: ${server}`)
    if (prefill.note) lines.push(prefill.note)
    lines.push('', String(f.get('message') || ''))
    const message = lines.join('\n')
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'),
          email: f.get('email'),
          phone: f.get('phone'),
          subject: `Talk to an expert — ${server || 'General'}`,
          message,
        }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {status === 'sent' ? (
        <div className="expert__done">
          <div className="expert__tick" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </div>
          <h2 id={titleId}>Request received.</h2>
          <p>An infrastructure expert will reach out shortly to plan your setup.</p>
          <button className="btn btn--primary" onClick={onDone}>
            {doneLabel}
          </button>
        </div>
      ) : (
        <form onSubmit={submit}>
          <span className="eyebrow">Talk to an expert</span>
          <h2 id={titleId}>Let’s plan your servers.</h2>
          <p className="expert__lead">
            Tell us what you run. A real engineer replies with a sizing plan, a rack slot and a price — no bots.
          </p>

          <div className="expert__seg" role="radiogroup" aria-label="Customer type">
            {(['B2B', 'B2C'] as const).map((a) => (
              <button
                key={a}
                type="button"
                role="radio"
                aria-checked={audience === a}
                className={audience === a ? 'is-on' : ''}
                onClick={() => setAudience(a)}
              >
                {a === 'B2B' ? 'For my business' : 'For myself'}
              </button>
            ))}
          </div>

          <div className="expert__grid">
            <label>
              <span>Full name</span>
              <input name="name" required autoComplete="name" placeholder="Your name" />
            </label>
            <label>
              <span>Work email</span>
              <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" />
            </label>
            <label>
              <span>Phone</span>
              <input name="phone" type="tel" autoComplete="tel" placeholder="+91" />
            </label>
            {audience === 'B2B' ? (
              <label>
                <span>Company</span>
                <input name="company" autoComplete="organization" placeholder="Company name" />
              </label>
            ) : (
              <label>
                <span>Use case</span>
                <input name="company" placeholder="Game server, website, AI…" />
              </label>
            )}
            <label className="span2">
              <span>Server of interest</span>
              <select name="server" defaultValue={prefill.server ?? ''}>
                <option value="">Not sure yet — help me choose</option>
                {SERVERS.map((s) => (
                  <option key={s.id} value={`${s.name} (${s.code})`}>
                    {s.name} — {s.code}
                  </option>
                ))}
              </select>
            </label>
            {prefill.note && <p className="expert__note span2">{prefill.note}</p>}
            <label className="span2">
              <span>What are you running?</span>
              <textarea name="message" required rows={3} placeholder="Workload, traffic, budget, timeline…" />
            </label>
          </div>

          {status === 'error' && (
            <p className="expert__err" role="alert">
              We couldn’t send that right now. Please check your connection and try again.
            </p>
          )}

          <button className="btn btn--primary expert__submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Request a call back'}
            <svg viewBox="0 0 20 10" aria-hidden="true">
              <path d="M1 5h17M14 1l4 4-4 4" />
            </svg>
          </button>
        </form>
      )}
    </>
  )
}
