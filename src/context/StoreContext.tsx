import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useContent } from './ContentContext'

type CartItem = { id: string; qty: number }

export type InfoPageKey =
  | 'about'
  | 'careers'
  | 'sustainability'
  | 'privacy'
  | 'terms'
  | 'shipping'
  | 'returns'
  | 'faqs'
  | 'track'
  | 'contact'

type StoreState = {
  cart: CartItem[]
  wish: string[]
  cartOpen: boolean
  wishOpen: boolean
  loginOpen: boolean
  chatOpen: boolean
  infoPage: InfoPageKey | null
  user: string | null

  addToCart: (id: string) => void
  changeQty: (id: string, delta: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  toggleWish: (id: string) => void
  isWished: (id: string) => boolean
  cartCount: number
  wishCount: number
  cartTotal: number

  setCartOpen: (v: boolean) => void
  setWishOpen: (v: boolean) => void
  setLoginOpen: (v: boolean) => void
  setChatOpen: (v: boolean) => void
  setInfoPage: (key: InfoPageKey | null) => void
  login: (name: string) => void
  logout: () => void

  toast: string | null
  pushToast: (msg: string) => void
}

const StoreCtx = createContext<StoreState | null>(null)

function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const { findProduct } = useContent()
  const [cart, setCart] = useState<CartItem[]>(() => readLS('glixy_cart', []))
  const [wish, setWish] = useState<string[]>(() => readLS('glixy_wish', []))
  const [user, setUser] = useState<string | null>(() =>
    readLS<string | null>('glixy_user', null)
  )

  const [cartOpen, setCartOpen] = useState(false)
  const [wishOpen, setWishOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [infoPage, setInfoPage] = useState<InfoPageKey | null>(null)

  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('glixy_cart', JSON.stringify(cart))
  }, [cart])
  useEffect(() => {
    localStorage.setItem('glixy_wish', JSON.stringify(wish))
  }, [wish])
  useEffect(() => {
    if (user) localStorage.setItem('glixy_user', JSON.stringify(user))
    else localStorage.removeItem('glixy_user')
  }, [user])

  const pushToast = useCallback((msg: string) => {
    setToast(msg)
    const t = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(t)
  }, [])

  const addToCart = useCallback(
    (id: string) => {
      setCart((c) => {
        const found = c.find((i) => i.id === id)
        if (found) return c.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
        return [...c, { id, qty: 1 }]
      })
      pushToast('Added to bag ✓')
    },
    [pushToast]
  )

  const changeQty = useCallback((id: string, delta: number) => {
    setCart((c) =>
      c
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    )
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCart((c) => c.filter((i) => i.id !== id))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const toggleWish = useCallback(
    (id: string) => {
      setWish((w) => {
        if (w.includes(id)) {
          pushToast('Removed from wishlist')
          return w.filter((x) => x !== id)
        }
        pushToast('Added to wishlist ♥')
        return [...w, id]
      })
    },
    [pushToast]
  )

  const isWished = useCallback((id: string) => wish.includes(id), [wish])

  const login = useCallback(
    (name: string) => {
      setUser(name)
      pushToast(`Welcome, ${name.split(' ')[0]} 👋`)
    },
    [pushToast]
  )
  const logout = useCallback(() => {
    setUser(null)
    pushToast('Signed out')
  }, [pushToast])

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart])
  const wishCount = wish.length
  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, i) => {
        const p = findProduct(i.id)
        return p ? sum + p.price * i.qty : sum
      }, 0),
    [cart, findProduct]
  )

  const value: StoreState = {
    cart,
    wish,
    cartOpen,
    wishOpen,
    loginOpen,
    chatOpen,
    infoPage,
    user,
    addToCart,
    changeQty,
    removeFromCart,
    clearCart,
    toggleWish,
    isWished,
    cartCount,
    wishCount,
    cartTotal,
    setCartOpen,
    setWishOpen,
    setLoginOpen,
    setChatOpen,
    setInfoPage,
    login,
    logout,
    toast,
    pushToast,
  }

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
