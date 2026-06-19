import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useContent } from '../context/ContentContext'

export default function Lookbook() {
  const { lookbook: LOOKBOOK } = useContent()
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])

  return (
    <section ref={ref} className="relative overflow-hidden bg-brand-ink text-white my-6">
      {/* Hero banner */}
      <div className="relative h-[70vh] min-h-[460px] overflow-hidden">
        <motion.img
          src="/products/look1.jpg"
          alt="Glixy lookbook"
          style={{ y }}
          className="absolute inset-0 w-full h-[125%] object-cover opacity-65"
        />
        {/* darker scrim so the centered text stays legible */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/30 via-brand-ink/55 to-brand-ink" />

        {/* Centered content */}
        <div className="relative h-full container-x flex flex-col items-center justify-center text-center [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand mb-4"
          >
            ( 02 ) — The Lookbook
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-medium leading-[1.05] tracking-tight text-white max-w-3xl mx-auto"
          >
            Crafted for every mood,
            <br className="hidden sm:block" />
            made to be noticed.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-sm sm:text-base text-white/80 max-w-xl mx-auto leading-relaxed"
          >
            Curated drops, layered fits and statement pieces — shot in our Mumbai studio
            and styled for the streets.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            href="#best"
            className="mt-8 inline-flex items-center gap-2 bg-white text-brand-ink font-medium text-sm pl-6 pr-4 py-3.5 rounded-full hover:bg-brand hover:text-white transition-colors group"
          >
            Shop the looks
            <span className="grid place-items-center w-6 h-6 rounded-full bg-brand-ink text-white group-hover:bg-white group-hover:text-brand transition-colors">
              <ArrowUpRight size={14} />
            </span>
          </motion.a>
        </div>
      </div>

      {/* 4-image lookbook strip */}
      <div className="container-x py-14 sm:py-20">
        <div className="flex items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand mb-2">
              Latest looks
            </p>
            <h3 className="font-display text-2xl sm:text-4xl font-medium leading-tight text-white">
              Style stories, served fresh.
            </h3>
          </div>
          <a
            href="#new"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-white/70 hover:text-brand transition-colors"
          >
            View all <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {LOOKBOOK.map((l, i) => (
            <motion.a
              key={(l as any)._id || l.title}
              href="#new"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4]"
            >
              <img
                src={l.image}
                alt={l.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* stronger scrim for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-brand block mb-1.5">
                    {l.tag}
                  </span>
                  <h4 className="font-display text-lg sm:text-2xl font-medium leading-tight text-white truncate">
                    {l.title}
                  </h4>
                </div>
                <span className="shrink-0 grid place-items-center w-9 h-9 rounded-full bg-white text-brand-ink translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
