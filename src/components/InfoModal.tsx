import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Mail, MapPin, Phone, Search, X } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { useContent } from '../context/ContentContext'
import { INFO_PAGES as STATIC_INFO_PAGES } from '../data/info'

export default function InfoModal() {
  const { infoPage, setInfoPage, pushToast } = useStore()
  const { info: INFO_PAGES } = useContent()

  useEffect(() => {
    if (infoPage) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [infoPage])

  return (
    <AnimatePresence>
      {infoPage && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setInfoPage(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
          />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            className="fixed inset-0 z-[70] flex items-stretch justify-center p-3 sm:p-6 pointer-events-none"
          >
            <div className="relative pointer-events-auto bg-brand-cream w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <Hero pageKey={infoPage} pages={INFO_PAGES as any} />
              <button
                onClick={() => setInfoPage(null)}
                aria-label="Close"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors z-10"
              >
                <X size={18} />
              </button>
              <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8">
                <Body pageKey={infoPage} pushToast={pushToast} pages={INFO_PAGES as any} />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Hero({ pageKey, pages }: { pageKey: keyof typeof STATIC_INFO_PAGES; pages: typeof STATIC_INFO_PAGES }) {
  const page = pages[pageKey]
  return (
    <div className="bg-brand-ink text-white px-6 sm:px-10 pt-8 pb-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brand mb-4">
        {page.kicker}
      </p>
      <h2 className="font-display italic text-4xl sm:text-5xl leading-[1.05] tracking-tight max-w-2xl">
        {page.title}
      </h2>
      <p className="mt-4 text-sm sm:text-base text-white/75 max-w-xl leading-relaxed">
        {page.intro}
      </p>
    </div>
  )
}

function Body({
  pageKey,
  pushToast,
  pages,
}: {
  pageKey: keyof typeof STATIC_INFO_PAGES
  pushToast: (msg: string) => void
  pages: typeof STATIC_INFO_PAGES
}) {
  const page = pages[pageKey]

  if (pageKey === 'track') return <TrackForm pushToast={pushToast} />
  if (pageKey === 'contact') return <ContactBody page={page} pushToast={pushToast} />

  return (
    <div className="flex flex-col gap-7 max-w-2xl">
      {page.sections.map((s, i) => (
        <section key={i}>
          {s.heading && (
            <h3 className="font-display text-xl sm:text-2xl text-brand-ink mb-2">
              {s.heading}
            </h3>
          )}
          <div className="flex flex-col gap-2 text-sm sm:text-[15px] text-brand-ink/80 leading-relaxed">
            {s.body.map((line, j) => (
              <p key={j}>{line}</p>
            ))}
          </div>
        </section>
      ))}
      <p className="mt-4 text-xs text-brand-muted">
        Have more questions?{' '}
        <button
          type="button"
          className="text-brand font-semibold hover:underline"
          onClick={() => pushToast('hello@glixy.in')}
        >
          hello@glixy.in
        </button>
      </p>
    </div>
  )
}

function TrackForm({ pushToast }: { pushToast: (msg: string) => void }) {
  const [order, setOrder] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<null | {
    state: string
    eta: string
    courier: string
  }>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!order.trim()) return
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(order.trim())}`)
      if (!res.ok) throw new Error('not found')
      const data = await res.json()
      const courierMap: Record<string, string> = {
        pending: 'Awaiting payment',
        confirmed: 'Packed & dispatched',
        shipped: 'In transit',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
      }
      setStatus({
        state: courierMap[data.status] || data.status,
        eta: data.status === 'delivered' ? 'Delivered' : '2-4 working days',
        courier: 'Glixy Logistics',
      })
      pushToast('Order found ✓')
    } catch {
      pushToast('Order not found')
      setStatus(null)
    }
  }

  return (
    <div className="max-w-xl">
      <form onSubmit={submit} className="flex flex-col gap-3">
        <Field label="Order number">
          <input
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            required
            placeholder="GLX-2026-04219"
            className="w-full bg-transparent outline-none text-sm font-mono uppercase tracking-wide"
          />
        </Field>
        <Field label="Email or phone">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@glixy.in or +91 9876543210"
            className="w-full bg-transparent outline-none text-sm"
          />
        </Field>
        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center gap-2 bg-brand-ink text-white text-sm font-medium tracking-wide px-6 py-3.5 rounded-full hover:bg-brand transition-colors"
        >
          <Search size={16} /> Track my order
        </button>
      </form>

      {status && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl bg-white border border-brand-ink/10 p-5"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand mb-1">
            {status.courier} • Order {order.toUpperCase()}
          </p>
          <h3 className="font-display text-2xl text-brand-ink">{status.state}</h3>
          <p className="text-sm text-brand-muted mt-1">ETA: {status.eta}</p>
          <div className="mt-4 grid grid-cols-4 gap-1.5">
            {['Packed', 'Dispatched', 'In transit', 'Delivered'].map((s, n) => (
              <div key={s}>
                <div
                  className={`h-1 rounded-full ${
                    n <= 2 ? 'bg-brand' : 'bg-brand-ink/10'
                  }`}
                />
                <p className="text-[10px] mt-1 text-brand-muted">{s}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

function ContactBody({
  page,
  pushToast,
}: {
  page: (typeof STATIC_INFO_PAGES)[keyof typeof STATIC_INFO_PAGES]
  pushToast: (msg: string) => void
}) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('failed')
      pushToast('Message sent — we will reply shortly')
      setForm({ name: '', email: '', message: '' })
    } catch {
      pushToast('Could not send. Try again.')
    }
  }
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-3xl">
      <div className="flex flex-col gap-5">
        {page.sections.map((s, i) => (
          <section key={i}>
            <h3 className="font-display text-xl text-brand-ink mb-2">{s.heading}</h3>
            <div className="flex flex-col gap-1 text-sm text-brand-ink/80 leading-relaxed">
              {s.body.map((line, j) => (
                <p key={j} className="flex items-center gap-2">
                  {s.heading?.startsWith('HQ') ? (
                    <MapPin size={14} className="text-brand-muted" />
                  ) : line.includes('@') ? (
                    <Mail size={14} className="text-brand-muted" />
                  ) : line.match(/\+?\d/) ? (
                    <Phone size={14} className="text-brand-muted" />
                  ) : null}
                  {line}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <h3 className="font-display text-xl text-brand-ink mb-1">Send a message</h3>
        <Field label="Your name">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Jane Doe"
            className="w-full bg-transparent outline-none text-sm"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            placeholder="you@glixy.in"
            className="w-full bg-transparent outline-none text-sm"
          />
        </Field>
        <Field label="Message">
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows={4}
            placeholder="How can we help?"
            className="w-full bg-transparent outline-none text-sm resize-none"
          />
        </Field>
        <button
          type="submit"
          className="group inline-flex items-center justify-center gap-2 bg-brand text-white text-sm font-medium tracking-wide pl-6 pr-4 py-3.5 rounded-full hover:bg-brand-ink transition-colors"
        >
          Send message
          <span className="grid place-items-center w-6 h-6 rounded-full bg-white text-brand group-hover:bg-brand-ink group-hover:text-white transition-colors">
            <ArrowUpRight size={14} />
          </span>
        </button>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-muted">
        {label}
      </span>
      <div className="bg-white border border-brand-ink/10 rounded-xl px-4 py-3 focus-within:border-brand-ink transition-colors">
        {children}
      </div>
    </label>
  )
}

