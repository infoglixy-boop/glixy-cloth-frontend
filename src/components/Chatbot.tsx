import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Send, ShoppingBag, Sparkles, X } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { ALL_PRODUCTS, img, type Product } from '../data/products'

type Msg =
  | { from: 'bot' | 'user'; text: string }
  | { from: 'bot'; text: string; picks: Product[] }

const QUICK = [
  'Party outfit under ₹1500',
  'Casual everyday tee',
  'Something for winter',
  'Gym & joggers',
]

function pick(text: string): Product[] {
  const t = text.toLowerCase()

  const priceMatch = t.match(/under\s*₹?\s*(\d+)/) || t.match(/below\s*₹?\s*(\d+)/)
  const maxPrice = priceMatch ? parseInt(priceMatch[1], 10) : Infinity

  let candidates = ALL_PRODUCTS.filter((p) => p.price <= maxPrice)

  const want = (kw: string[]) => kw.some((k) => t.includes(k))

  if (want(['party', 'club', 'rave', 'night', 'date'])) {
    candidates = candidates.filter((p) =>
      ['shirts', 'oversized', 'jackets'].includes(p.category)
    )
  } else if (want(['casual', 'everyday', 'daily', 'basic'])) {
    candidates = candidates.filter((p) => ['tees', 'oversized'].includes(p.category))
  } else if (want(['winter', 'cold', 'warm', 'hoodie', 'jacket'])) {
    candidates = candidates.filter((p) => ['hoodies', 'jackets'].includes(p.category))
  } else if (want(['gym', 'workout', 'sport', 'jogger', 'run', 'training'])) {
    candidates = candidates.filter((p) =>
      ['joggers', 'bottomwear'].includes(p.category)
    )
  } else if (want(['shirt', 'formal', 'office'])) {
    candidates = candidates.filter((p) => p.category === 'shirts')
  } else if (want(['tee', 't-shirt', 'tshirt', 'graphic'])) {
    candidates = candidates.filter((p) => ['tees', 'oversized'].includes(p.category))
  } else if (want(['sale', 'discount', 'cheap', 'budget', 'offer'])) {
    candidates = candidates
      .filter((p) => p.mrp - p.price > 600)
      .sort((a, b) => b.mrp - b.price - (a.mrp - a.price))
  }

  if (!candidates.length) candidates = ALL_PRODUCTS
  return candidates.slice(0, 3)
}

function reply(text: string, picks: Product[]): string {
  const t = text.toLowerCase()
  if (!picks.length) return "I couldn't find a match. Try a vibe like party, gym, winter or casual."
  if (t.includes('party')) return "Here's a bold lineup for going out — drop one in your bag and you're set:"
  if (t.includes('winter') || t.includes('cold')) return 'Cosy picks to keep the cold out:'
  if (t.includes('gym') || t.includes('workout')) return 'Built for movement — these will take a beating:'
  if (t.includes('casual') || t.includes('everyday')) return 'Easy everyday rotation, you really can\'t go wrong with these:'
  if (t.includes('shirt')) return 'Sharp shirts that work day-to-night:'
  if (t.includes('sale') || t.includes('discount')) return 'Best discounts live right now:'
  return "Here's a quick edit from the catalog based on what you said:"
}

export default function Chatbot() {
  const { chatOpen, setChatOpen, addToCart } = useStore()
  const [log, setLog] = useState<Msg[]>([
    {
      from: 'bot',
      text: "Hey 👋 I'm Glixy's AI stylist. Tell me a vibe or occasion and I'll pick fits for you.",
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [log, typing])

  const ask = (text: string) => {
    if (!text.trim()) return
    setLog((l) => [...l, { from: 'user', text }])
    setInput('')
    setTyping(true)
    window.setTimeout(() => {
      const picks = pick(text)
      const r = reply(text, picks)
      setLog((l) => [...l, { from: 'bot', text: r, picks }])
      setTyping(false)
    }, 650)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    ask(input)
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setChatOpen(!chatOpen)}
        aria-label={chatOpen ? 'Close stylist' : 'Open AI stylist'}
        className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-brand text-white shadow-cardHover flex items-center justify-center hover:opacity-95 transition-opacity"
      >
        {chatOpen ? <X size={22} /> : <Sparkles size={22} />}
      </motion.button>

      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-24 right-5 z-40 w-[min(380px,calc(100vw-2.5rem))] h-[560px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
          >
            <div className="bg-gradient-to-r from-purple-600 to-brand text-white px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">Glixy AI Stylist</p>
                <p className="text-[11px] text-white/80">Online • answers in seconds</p>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                aria-label="Close"
                className="p-1.5 hover:bg-white/10 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 bg-gray-50 flex flex-col gap-3">
              {log.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-2 ${
                    m.from === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] text-sm px-3.5 py-2.5 rounded-2xl whitespace-pre-line ${
                      m.from === 'bot'
                        ? 'bg-white text-brand-ink border border-gray-100 rounded-bl-sm'
                        : 'bg-brand-ink text-white rounded-br-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                  {'picks' in m && m.picks.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 w-full max-w-[85%]">
                      {m.picks.map((p) => (
                        <div
                          key={p.id}
                          className="bg-white rounded-xl overflow-hidden border border-gray-100"
                        >
                          <div className="aspect-square overflow-hidden bg-gray-100">
                            <img
                              src={img(p.id)}
                              alt={p.name}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-2">
                            <p className="text-[11px] font-semibold text-brand-ink leading-tight line-clamp-2">
                              {p.name}
                            </p>
                            <p className="text-[11px] font-bold mt-0.5">₹{p.price}</p>
                            <button
                              onClick={() => addToCart(p.id)}
                              className="mt-1.5 w-full inline-flex items-center justify-center gap-1 bg-brand-ink text-white text-[10px] font-bold py-1.5 rounded-md hover:bg-brand transition-colors"
                            >
                              <ShoppingBag size={10} /> ADD
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {typing && (
                <div className="self-start bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm text-brand-muted flex gap-1 items-center">
                  <Dot delay={0} />
                  <Dot delay={0.15} />
                  <Dot delay={0.3} />
                </div>
              )}
            </div>

            <div className="px-3 py-2 border-t border-gray-100 bg-white">
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => ask(q)}
                    className="shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full bg-gray-100 text-brand-ink hover:bg-gray-200 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <form onSubmit={onSubmit} className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your vibe..."
                  className="flex-1 min-w-0 text-sm px-3 py-2.5 rounded-xl bg-gray-50 placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-ink/10 transition"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  className="w-10 h-10 shrink-0 rounded-xl bg-brand-ink text-white flex items-center justify-center hover:bg-brand transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="w-1.5 h-1.5 rounded-full bg-brand-muted"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, delay }}
    />
  )
}
