import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useContent } from '../context/ContentContext'

export default function Promo() {
  const { settings } = useContent()
  const p = settings.promo
  if (!p || !p.heading) return null
  return (
    <section className="container-x py-6">
      <motion.a
        href={p.href || '#new'}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative block overflow-hidden rounded-3xl min-h-[280px] sm:min-h-[360px] text-white"
      >
        {p.image && (
          <img
            src={p.image}
            alt={p.heading}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />

        <div className="relative h-full flex flex-col justify-end p-8 sm:p-12 max-w-2xl [text-shadow:0_2px_18px_rgba(0,0,0,0.45)]">
          {p.kicker && (
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/90 mb-3">
              {p.kicker}
            </span>
          )}
          <h3 className="font-display text-4xl sm:text-6xl font-medium leading-tight text-white">
            {p.heading}
          </h3>
          {p.subheading && <p className="mt-3 text-base sm:text-lg text-white/90 max-w-md">{p.subheading}</p>}
          <span className="mt-6 inline-flex w-fit items-center gap-2 bg-white text-brand-ink font-medium text-sm tracking-wide pl-6 pr-4 py-3.5 rounded-full group-hover:bg-brand group-hover:text-white transition-colors">
            {p.cta || 'SHOP NOW'}
            <span className="grid place-items-center w-6 h-6 rounded-full bg-brand-ink text-white group-hover:bg-white group-hover:text-brand transition-colors">
              <ArrowUpRight size={14} />
            </span>
          </span>
        </div>
      </motion.a>
    </section>
  )
}
