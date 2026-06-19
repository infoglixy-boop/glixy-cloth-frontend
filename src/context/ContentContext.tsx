import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  PRODUCTS as STATIC_PRODUCTS,
  HERO_SLIDES as STATIC_HERO,
  LOOKBOOK as STATIC_LOOK,
  CATEGORIES as STATIC_CATS,
  type Product,
  type HeroSlide,
  type Look,
  type Category,
} from '../data/products'
import { INFO_PAGES as STATIC_INFO, type InfoPage } from '../data/info'
import type { InfoPageKey } from './StoreContext'

type ApiProduct = {
  _id: string
  slug: string
  brand: string
  name: string
  price: number
  mrp: number
  badge: string
  image?: string
  seed?: string
  category: Product['category']
  section: 'new' | 'best' | 'sale'
}

export type Link = { label: string; href: string }
export type Usp = { icon: string; title: string; body: string }
export type PromoSettings = { kicker: string; heading: string; subheading: string; cta: string; href: string; image: string }
export type FooterCol = { title: string; links: Link[] }

export type SiteSettings = {
  storeName: string
  storeTagline: string
  logo: string
  favicon: string
  announceText: string
  announceActive: boolean
  marqueeItems: string[]
  promo: PromoSettings
  usps: Usp[]
  footerColumns: FooterCol[]
  socialLinks: Link[]
  contactEmail: string
  contactPhone: string
  contactAddress: string
  shippingFreeOver: number
  shippingFlat: number
  codEnabled: boolean
  currency: string
}

const DEFAULT_SETTINGS: SiteSettings = {
  storeName: 'GLIXY',
  storeTagline: 'Wear your story',
  logo: '',
  favicon: '',
  announceText: 'Free shipping on orders over ₹999 · Cash on delivery available',
  announceActive: true,
  marqueeItems: ['NEW DROP EVERY FRIDAY', 'MADE IN INDIA', 'FREE SHIPPING ₹999+', '15-DAY EASY RETURNS', 'COD AVAILABLE'],
  promo: {
    kicker: 'LIMITED DROP',
    heading: 'Cop the new capsule.',
    subheading: 'Heavyweight cotton, screen-printed in Mumbai. While stocks last.',
    cta: 'SHOP THE DROP',
    href: '#new',
    image: '/products/s7.jpg',
  },
  usps: [
    { icon: 'truck', title: 'Free shipping ₹999+', body: 'Across India in 2-6 working days.' },
    { icon: 'rotate-ccw', title: '15-day returns', body: 'Free pick-up, no questions asked.' },
    { icon: 'shield-check', title: 'Secure payments', body: 'UPI, cards, COD — all accepted.' },
    { icon: 'leaf', title: 'GOTS cotton', body: 'Organic, traceable, made better.' },
  ],
  footerColumns: [],
  socialLinks: [],
  contactEmail: 'hello@glixy.in',
  contactPhone: '+91 98765 43210',
  contactAddress: '',
  shippingFreeOver: 999,
  shippingFlat: 49,
  codEnabled: true,
  currency: '₹',
}

type ContentState = {
  products: Record<'new' | 'best' | 'sale', Product[]>
  allProducts: Product[]
  hero: HeroSlide[]
  lookbook: Look[]
  categories: Category[]
  info: Record<InfoPageKey, InfoPage>
  settings: SiteSettings
  loading: boolean
  findProduct: (id: string) => Product | undefined
}

const ContentCtx = createContext<ContentState | null>(null)

function apiProductToLocal(p: ApiProduct): Product {
  return {
    id: p.slug,
    brand: p.brand,
    name: p.name,
    price: p.price,
    mrp: p.mrp,
    badge: p.badge || '',
    seed: p.seed || p.slug,
    category: p.category,
    image: p.image || '',
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState(STATIC_PRODUCTS)
  const [hero, setHero] = useState(STATIC_HERO)
  const [lookbook, setLookbook] = useState(STATIC_LOOK)
  const [categories, setCategories] = useState(STATIC_CATS)
  const [info, setInfo] = useState(STATIC_INFO)
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [p, h, l, c, i, s] = await Promise.all([
          fetch('/api/products/grouped').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/hero').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/lookbook').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/categories').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/info').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/settings').then((r) => (r.ok ? r.json() : null)),
        ])
        if (cancelled) return
        if (p && p.new) {
          setProducts({
            new: (p.new || []).map(apiProductToLocal),
            best: (p.best || []).map(apiProductToLocal),
            sale: (p.sale || []).map(apiProductToLocal),
          })
        }
        if (h && h.length) setHero(h as HeroSlide[])
        if (l && l.length) setLookbook(l as Look[])
        if (c && c.length) setCategories(c as Category[])
        if (i && typeof i === 'object') {
          setInfo({ ...STATIC_INFO, ...(i as Record<InfoPageKey, InfoPage>) })
        }
        if (s) setSettings({ ...DEFAULT_SETTINGS, ...s })
      } catch {
        /* silent — fallbacks already in state */
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<ContentState>(() => {
    const all = [...products.new, ...products.best, ...products.sale]
    return {
      products,
      allProducts: all,
      hero,
      lookbook,
      categories,
      info,
      settings,
      loading,
      findProduct: (id: string) => all.find((p) => p.id === id),
    }
  }, [products, hero, lookbook, categories, info, settings, loading])

  return <ContentCtx.Provider value={value}>{children}</ContentCtx.Provider>
}

export function useContent() {
  const v = useContext(ContentCtx)
  if (!v) throw new Error('useContent must be used inside ContentProvider')
  return v
}
