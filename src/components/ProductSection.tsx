import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Product } from '../data/products'
import ProductCard from './ProductCard'

export default function ProductSection({
  id,
  index,
  title,
  subtitle,
  products,
}: {
  id: string
  index: string
  title: string
  subtitle: string
  products: Product[]
}) {
  return (
    <section id={id} className="container-x py-16 sm:py-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="kicker mb-3"
          >
            {index} — {subtitle}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title"
          >
            {title}
          </motion.h2>
        </div>
        <a
          href="#"
          className="group inline-flex items-center gap-2 text-sm font-medium text-brand-ink hover:text-brand transition-colors"
        >
          View all
          <span className="grid place-items-center w-7 h-7 rounded-full border border-brand-ink/20 group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-colors">
            <ArrowUpRight size={14} />
          </span>
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </section>
  )
}
