import { useState } from 'react'
import { Heart, Menu, Search, ShoppingBag, Sparkles, User, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore } from '../context/StoreContext'

const links = ['MEN', 'WOMEN', 'T-SHIRTS', 'OVERSIZED', 'SHIRTS', 'BOTTOMWEAR', 'WINTERWEAR']

export default function Header() {
  const [navOpen, setNavOpen] = useState(false)
  const [search, setSearch] = useState('')
  const {
    cartCount,
    wishCount,
    user,
    setCartOpen,
    setWishOpen,
    setLoginOpen,
    setChatOpen,
    logout,
  } = useStore()

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100"
    >
      <div className="container-x flex items-center gap-3 sm:gap-6 py-3">
        <button
          aria-label="Menu"
          onClick={() => setNavOpen((v) => !v)}
          className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg"
        >
          {navOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <a href="#" className="font-display text-3xl sm:text-4xl font-medium tracking-tight shrink-0">
          Glixy<span className="text-brand">.</span>
        </a>

        <nav className="hidden lg:flex items-center gap-5 ml-2">
          {links.map((l, i) => (
            <a
              key={l}
              href="#"
              className={`text-xs font-semibold tracking-wide hover:text-brand transition-colors ${
                i === 0 ? 'text-brand' : 'text-brand-ink'
              }`}
            >
              {l}
            </a>
          ))}
          <a href="#sale" className="text-xs font-bold tracking-wide text-brand bg-brand/10 px-2.5 py-1 rounded-full">
            SALE
          </a>
        </nav>

        <div className="hidden md:flex flex-1 max-w-md ml-auto bg-gray-50 rounded-xl px-3 py-2 items-center gap-2">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products, brands..."
            className="bg-transparent text-sm flex-1 outline-none placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-1 ml-auto md:ml-0">
          <button
            onClick={() => setChatOpen(true)}
            aria-label="AI Dress Advisor"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-brand text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Sparkles size={14} /> AI Stylist
          </button>

          {user ? (
            <button
              onClick={logout}
              title={`Hi ${user} • click to logout`}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold">
                {user[0].toUpperCase()}
              </span>
              <span className="text-xs font-medium text-brand-ink hidden lg:inline">
                {user.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              aria-label="Account"
              onClick={() => setLoginOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <User size={20} />
            </button>
          )}

          <IconBadge
            count={wishCount}
            label="Wishlist"
            onClick={() => setWishOpen(true)}
          >
            <Heart size={20} />
          </IconBadge>
          <IconBadge
            count={cartCount}
            label="Cart"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag size={20} />
          </IconBadge>
        </div>
      </div>

      {navOpen && (
        <motion.nav
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
        >
          <div className="container-x flex flex-col py-3">
            {links.map((l) => (
              <a
                key={l}
                href="#"
                onClick={() => setNavOpen(false)}
                className="py-2.5 text-sm font-semibold text-brand-ink hover:text-brand"
              >
                {l}
              </a>
            ))}
            <a
              href="#sale"
              onClick={() => setNavOpen(false)}
              className="py-2.5 text-sm font-bold text-brand"
            >
              SALE
            </a>
          </div>
        </motion.nav>
      )}
    </motion.header>
  )
}

function IconBadge({
  count,
  label,
  onClick,
  children,
}: {
  count: number
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
    >
      {children}
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  )
}
