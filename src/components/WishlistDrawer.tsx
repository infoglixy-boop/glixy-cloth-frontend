import { AnimatePresence, motion } from 'framer-motion'
import { Heart, ShoppingBag, X } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { useContent } from '../context/ContentContext'
import { productImg } from '../data/products'

export default function WishlistDrawer() {
  const { wish, wishOpen, setWishOpen, toggleWish, addToCart } = useStore()
  const { findProduct } = useContent()

  return (
    <AnimatePresence>
      {wishOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setWishOpen(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-display text-lg font-bold tracking-wide flex items-center gap-2">
                <Heart size={18} /> WISHLIST
              </h3>
              <button
                onClick={() => setWishOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {wish.length === 0 ? (
                <div className="text-center text-brand-muted py-16">
                  <Heart size={36} className="mx-auto mb-3 text-gray-300" />
                  <p className="font-medium text-brand-ink">No favourites yet.</p>
                  <p className="text-sm mt-1">Tap the heart on a product to save it here.</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {wish.map((id) => {
                    const p = findProduct(id)
                    if (!p) return null
                    return (
                      <li key={id} className="flex gap-3">
                        <img
                          src={productImg(p)}
                          alt={p.name}
                          className="w-20 h-24 object-cover rounded-xl shrink-0 bg-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] uppercase tracking-wide text-brand-muted">
                            {p.brand}
                          </p>
                          <h5 className="text-sm font-semibold text-brand-ink line-clamp-2 leading-snug">
                            {p.name}
                          </h5>
                          <div className="mt-1 font-bold text-brand-ink">₹{p.price}</div>
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => addToCart(id)}
                              className="inline-flex items-center gap-1.5 bg-brand-ink text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-brand transition-colors"
                            >
                              <ShoppingBag size={12} /> ADD
                            </button>
                            <button
                              onClick={() => toggleWish(id)}
                              className="text-xs font-semibold text-brand-muted hover:text-brand transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
