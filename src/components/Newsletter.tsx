import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'newsletter-section' }),
      })
    } catch {
      /* still mark done to feel responsive */
    }
    setDone(true)
    setEmail('')
  }

  return (
    <section className="relative overflow-hidden bg-brand-sand">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(60% 80% at 80% 0%, rgba(194,86,47,0.35), transparent), radial-gradient(50% 70% at 10% 100%, rgba(25,21,18,0.18), transparent)',
        }}
      />

      <div className="relative container-x py-20 sm:py-28 grid lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="kicker mb-4">( 06 ) — Members only</p>
          <h2 className="section-title italic max-w-xl leading-[0.95]">
            Join the gang. <br />
            Get <span className="text-brand">₹200 off</span> your first drop.
          </h2>
          <p className="mt-5 text-brand-ink/70 max-w-md leading-relaxed">
            One thoughtful email a week — new drops, the lookbook, behind-the-scenes
            from the studio, and the occasional ridiculously good discount. Unsubscribe
            anytime.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-card border border-brand-ink/5 p-6 sm:p-8"
        >
          {done ? (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-14 h-14 rounded-full bg-brand text-white grid place-items-center mb-4">
                <Check size={22} strokeWidth={2.5} />
              </div>
              <h3 className="font-display italic text-2xl text-brand-ink">
                You're in.
              </h3>
              <p className="mt-2 text-sm text-brand-ink/70 max-w-sm">
                Check your inbox for the ₹200 off code — it lands in under a minute.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-muted">
                Your email
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@glixy.in"
                  className="flex-1 min-w-0 px-4 py-3.5 rounded-full text-brand-ink text-sm placeholder-brand-muted/70 outline-none border border-brand-ink/10 focus:border-brand-ink transition-colors"
                />
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 bg-brand-ink text-white text-sm font-medium tracking-wide pl-6 pr-4 py-3.5 rounded-full hover:bg-brand transition-colors"
                >
                  Subscribe
                  <span className="grid place-items-center w-6 h-6 rounded-full bg-white text-brand-ink group-hover:bg-brand-ink group-hover:text-white transition-colors">
                    <ArrowUpRight size={14} />
                  </span>
                </button>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-brand-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Check size={11} className="text-brand" /> No spam
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={11} className="text-brand" /> Unsubscribe anytime
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={11} className="text-brand" /> One mail a week
                </span>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
