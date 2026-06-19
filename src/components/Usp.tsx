import { motion } from 'framer-motion'
import {
  Truck,
  RotateCcw,
  BadgeCheck,
  Lock,
  Leaf,
  ShieldCheck,
  Star,
  Tag,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { useContent } from '../context/ContentContext'

const ICONS: Record<string, LucideIcon> = {
  truck: Truck,
  'rotate-ccw': RotateCcw,
  'badge-check': BadgeCheck,
  lock: Lock,
  leaf: Leaf,
  'shield-check': ShieldCheck,
  star: Star,
  tag: Tag,
  sparkles: Sparkles,
}

export default function Usp() {
  const { settings } = useContent()
  const items = settings.usps && settings.usps.length ? settings.usps : []
  if (!items.length) return null
  return (
    <section className="border-y border-brand-ink/10 bg-brand-sand/40">
      <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
        {items.map((it, i) => {
          const Icon = ICONS[it.icon] || Sparkles
          return (
            <motion.div
              key={`${it.title}-${i}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-full bg-white shadow-card flex items-center justify-center text-brand shrink-0">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-ink leading-tight">{it.title}</p>
                <p className="text-xs text-brand-muted mt-0.5">{it.body}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
