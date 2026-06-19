import { Heart, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { discount, productImg, type Product } from '../data/products'
import { useStore } from '../context/StoreContext'

export default function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const { addToCart, toggleWish, isWished } = useStore()
  const wished = isWished(p.id)
  const off = discount(p.mrp, p.price)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: (index % 4) * 0.06, duration: 0.5 }}
      className="group"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand-sand">
        <img
          src={productImg(p)}
          alt={p.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <span className="pill absolute top-3 left-3 bg-white/90 backdrop-blur text-brand-ink">
          {p.badge}
        </span>
        <button
          onClick={() => toggleWish(p.id)}
          aria-label="Wishlist"
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors ${
            wished ? 'text-brand' : 'text-brand-ink'
          }`}
        >
          <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={() => addToCart(p.id)}
          className="absolute bottom-3 inset-x-3 bg-brand-ink/95 backdrop-blur text-white text-xs font-medium tracking-wide py-3 rounded-full flex items-center justify-center gap-2 translate-y-[130%] group-hover:translate-y-0 transition-transform duration-300"
        >
          <ShoppingBag size={14} /> Add to bag
        </button>
      </div>
      <div className="pt-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-brand-muted">
          {p.brand}
        </p>
        <h3 className="font-sans text-sm sm:text-[15px] font-medium text-brand-ink mt-1 leading-snug line-clamp-1">
          {p.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="font-semibold text-brand-ink">₹{p.price}</span>
          <span className="text-xs text-brand-muted line-through">₹{p.mrp}</span>
          <span className="text-xs text-brand font-semibold">{off}% off</span>
        </div>
      </div>
    </motion.div>
  )
}
