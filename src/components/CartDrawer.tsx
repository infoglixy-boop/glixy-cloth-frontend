import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { useContent } from '../context/ContentContext'
import { productImg } from '../data/products'

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    changeQty,
    removeFromCart,
    cartTotal,
    clearCart,
    pushToast,
    user,
  } = useStore()
  const { findProduct } = useContent()

  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', line1: '', city: '', pincode: '' })
  const [submitting, setSubmitting] = useState(false)
  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState<{ code: string; discount: number } | null>(null)
  const [couponMsg, setCouponMsg] = useState<string | null>(null)

  const applyCoupon = async () => {
    if (!coupon.trim()) return
    setCouponMsg(null)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon.trim(), subtotal: cartTotal }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'invalid')
      setApplied({ code: data.code, discount: data.discount })
      setCouponMsg(`Saved ₹${data.discount} with ${data.code}`)
    } catch (e: any) {
      setApplied(null)
      setCouponMsg(e.message)
    }
  }

  const grandTotal = Math.max(0, cartTotal - (applied?.discount || 0))

  const openCheckout = () => {
    if (!cart.length) {
      pushToast('Your bag is empty!')
      return
    }
    setForm((f) => ({ ...f, name: f.name || user || '' }))
    setCheckoutOpen(true)
  }

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const items = cart
        .map((c) => {
          const p = findProduct(c.id)
          if (!p) return null
          return {
            productId: p.id,
            name: p.name,
            price: p.price,
            qty: c.qty,
            image: productImg(p),
          }
        })
        .filter(Boolean)

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          email: form.email,
          phone: form.phone,
          address: { line1: form.line1, city: form.city, pincode: form.pincode },
          items,
          paymentMethod: 'cod',
          couponCode: applied?.code,
        }),
      })
      if (!res.ok) throw new Error('failed')
      const order = await res.json()
      pushToast(`Order placed! ${order.orderNumber}`)
      clearCart()
      setApplied(null)
      setCoupon('')
      setCheckoutOpen(false)
      setCartOpen(false)
    } catch {
      pushToast('Order failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
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
                <ShoppingBag size={18} /> {checkoutOpen ? 'CHECKOUT' : 'YOUR BAG'}
              </h3>
              <button
                onClick={() => (checkoutOpen ? setCheckoutOpen(false) : setCartOpen(false))}
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {!checkoutOpen && (
              <div className="flex-1 overflow-y-auto px-5 py-4">
                {cart.length === 0 ? (
                  <div className="text-center text-brand-muted py-16">
                    <ShoppingBag size={36} className="mx-auto mb-3 text-gray-300" />
                    <p className="font-medium text-brand-ink">Your bag is empty.</p>
                    <p className="text-sm mt-1">Start shopping to fill it up!</p>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-4">
                    {cart.map((it) => {
                      const p = findProduct(it.id)
                      if (!p) return null
                      return (
                        <li key={it.id} className="flex gap-3">
                          <img
                            src={productImg(p)}
                            alt={p.name}
                            className="w-20 h-24 object-cover rounded-xl shrink-0 bg-gray-100"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] uppercase tracking-wide text-brand-muted">{p.brand}</p>
                            <h5 className="text-sm font-semibold text-brand-ink line-clamp-2 leading-snug">
                              {p.name}
                            </h5>
                            <div className="mt-1 font-bold text-brand-ink">₹{p.price}</div>
                            <div className="mt-2 inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => changeQty(p.id, -1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100"
                                aria-label="Decrease"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="px-3 text-sm font-semibold">{it.qty}</span>
                              <button
                                onClick={() => changeQty(p.id, 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-gray-100"
                                aria-label="Increase"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(p.id)}
                            aria-label="Remove"
                            className="text-brand-muted hover:text-brand transition-colors self-start p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )}

            {checkoutOpen && (
              <form onSubmit={placeOrder} className="flex-1 overflow-y-auto px-5 py-4 space-y-3 text-sm">
                <Input label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                <Input label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                <Input label="Address line" value={form.line1} onChange={(v) => setForm({ ...form, line1: v })} required />
                <div className="grid grid-cols-2 gap-2">
                  <Input label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
                  <Input label="Pincode" value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} required />
                </div>
                <p className="text-xs text-brand-muted">Payment: Cash on Delivery</p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand-ink text-white font-bold text-sm tracking-wider py-3.5 rounded-xl hover:bg-brand transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Placing…' : `PLACE ORDER · ₹${grandTotal}`}
                </button>
              </form>
            )}

            {!checkoutOpen && (
              <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-white">
                {cart.length > 0 && (
                  <div className="flex gap-2">
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                      placeholder="COUPON CODE"
                      className="flex-1 min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono uppercase tracking-wide focus:outline-none focus:border-brand-ink"
                    />
                    <button
                      onClick={applyCoupon}
                      type="button"
                      className="text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponMsg && (
                  <p className={`text-xs ${applied ? 'text-emerald-600' : 'text-red-600'}`}>{couponMsg}</p>
                )}
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between text-brand-muted">
                    <span>Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  {applied && (
                    <div className="flex items-center justify-between text-emerald-600">
                      <span>Discount ({applied.code})</span>
                      <span>− ₹{applied.discount}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                    <span className="text-sm text-brand-muted">Total</span>
                    <span className="font-display text-2xl font-bold text-brand-ink">₹{grandTotal}</span>
                  </div>
                </div>
                <button
                  onClick={openCheckout}
                  disabled={!cart.length}
                  className="w-full bg-brand-ink text-white font-bold text-sm tracking-wider py-3.5 rounded-xl hover:bg-brand transition-colors disabled:opacity-50"
                >
                  CHECKOUT
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-wide text-brand-muted mb-1">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-ink"
      />
    </label>
  )
}
