import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useContent } from '../context/ContentContext'

export default function Categories() {
  const { categories: CATEGORIES } = useContent()
  return (
    <section id="categories" className="container-x py-16 sm:py-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="kicker mb-3"
          >
            ( 01 ) — Browse the wardrobe
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            Find your style.
          </motion.h2>
        </div>
        <p className="max-w-sm text-brand-muted text-sm leading-relaxed">
          Shop by category and discover looks that suit your mood, any occasion,
          and elevate your everyday rotation.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {CATEGORIES.map((c, i) => (
          <motion.a
            key={(c as any)._id || c.label}
            href="#new"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: (i % 4) * 0.08, duration: 0.5 }}
            className={`group relative overflow-hidden rounded-3xl bg-brand-sand ${
              i === 0 ? 'md:col-span-1 lg:row-span-2 lg:aspect-auto aspect-[3/4]' : 'aspect-[3/4]'
            }`}
          >
            <img
              src={c.image}
              alt={c.label}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end text-white">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                {c.count}
              </span>
              <div className="flex items-center justify-between mt-1">
                <h3 className="font-display text-2xl sm:text-3xl font-medium">{c.label}</h3>
                <span className="grid place-items-center w-9 h-9 rounded-full bg-white text-brand-ink translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
