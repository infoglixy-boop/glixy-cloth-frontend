export type Product = {
  id: string
  brand: string
  name: string
  price: number
  mrp: number
  badge: string
  seed: string
  category: 'tees' | 'oversized' | 'shirts' | 'hoodies' | 'joggers' | 'jackets' | 'bottomwear'
  image?: string
}

// Local, pre-downloaded apparel images (never blank). One file per product id.
export const img = (idOrSeed: string) => `/products/${idOrSeed}.jpg`
export const productImg = (p: Product) => p.image || `/products/${p.id}.jpg`

export const PRODUCTS: Record<'new' | 'best' | 'sale', Product[]> = {
  new: [
    { id: 'n1', brand: 'Glixy Originals', name: 'Cosmic Drift Oversized Tee', price: 799, mrp: 1299, badge: 'NEW', seed: 'glixy1', category: 'oversized' },
    { id: 'n2', brand: 'Glixy Originals', name: 'Midnight Graphic Tee', price: 699, mrp: 1199, badge: 'NEW', seed: 'glixy2', category: 'tees' },
    { id: 'n3', brand: 'Glixy Streetwear', name: 'Neon Pulse Hoodie', price: 1499, mrp: 2499, badge: 'NEW', seed: 'glixy3', category: 'hoodies' },
    { id: 'n4', brand: 'Glixy Originals', name: 'Retro Wave Printed Shirt', price: 1099, mrp: 1799, badge: 'NEW', seed: 'glixy4', category: 'shirts' },
    { id: 'n5', brand: 'Glixy Active', name: 'Flex Tapered Joggers', price: 999, mrp: 1599, badge: 'NEW', seed: 'glixy5', category: 'joggers' },
    { id: 'n6', brand: 'Glixy Originals', name: 'Vintage Logo Oversized Tee', price: 749, mrp: 1299, badge: 'NEW', seed: 'glixy6', category: 'oversized' },
    { id: 'n7', brand: 'Glixy Streetwear', name: 'Urban Cargo Pants', price: 1299, mrp: 2199, badge: 'NEW', seed: 'glixy7', category: 'bottomwear' },
    { id: 'n8', brand: 'Glixy Originals', name: 'Sketch Art Half Sleeve Tee', price: 649, mrp: 1099, badge: 'NEW', seed: 'glixy8', category: 'tees' },
  ],
  best: [
    { id: 'b1', brand: 'Glixy Originals', name: 'Classic Black Oversized Tee', price: 699, mrp: 1199, badge: 'BESTSELLER', seed: 'best1', category: 'oversized' },
    { id: 'b2', brand: 'Glixy Streetwear', name: 'Storm Grey Pullover Hoodie', price: 1399, mrp: 2299, badge: 'HOT', seed: 'best2', category: 'hoodies' },
    { id: 'b3', brand: 'Glixy Originals', name: 'Anime Hero Graphic Tee', price: 799, mrp: 1399, badge: 'BESTSELLER', seed: 'best3', category: 'tees' },
    { id: 'b4', brand: 'Glixy Active', name: 'Everyday Cotton Joggers', price: 899, mrp: 1499, badge: 'HOT', seed: 'best4', category: 'joggers' },
    { id: 'b5', brand: 'Glixy Originals', name: 'Checkered Casual Shirt', price: 1199, mrp: 1999, badge: 'BESTSELLER', seed: 'best5', category: 'shirts' },
    { id: 'b6', brand: 'Glixy Originals', name: 'Typography Oversized Tee', price: 749, mrp: 1299, badge: 'HOT', seed: 'best6', category: 'oversized' },
    { id: 'b7', brand: 'Glixy Streetwear', name: 'Faded Denim Jacket', price: 1899, mrp: 3299, badge: 'BESTSELLER', seed: 'best7', category: 'jackets' },
    { id: 'b8', brand: 'Glixy Originals', name: 'Minimal Crew Neck Tee', price: 599, mrp: 999, badge: 'HOT', seed: 'best8', category: 'tees' },
  ],
  sale: [
    { id: 's1', brand: 'Glixy Originals', name: 'Galaxy Print Tee', price: 449, mrp: 1299, badge: '65% OFF', seed: 'sale1', category: 'tees' },
    { id: 's2', brand: 'Glixy Active', name: 'Slim Fit Track Pants', price: 699, mrp: 1799, badge: '61% OFF', seed: 'sale2', category: 'bottomwear' },
    { id: 's3', brand: 'Glixy Streetwear', name: 'Zip-Up Fleece Hoodie', price: 999, mrp: 2499, badge: '60% OFF', seed: 'sale3', category: 'hoodies' },
    { id: 's4', brand: 'Glixy Originals', name: 'Striped Polo Tee', price: 549, mrp: 1399, badge: '61% OFF', seed: 'sale4', category: 'tees' },
    { id: 's5', brand: 'Glixy Originals', name: 'Abstract Art Shirt', price: 799, mrp: 1899, badge: '58% OFF', seed: 'sale5', category: 'shirts' },
    { id: 's6', brand: 'Glixy Active', name: 'Mesh Training Shorts', price: 399, mrp: 999, badge: '60% OFF', seed: 'sale6', category: 'bottomwear' },
    { id: 's7', brand: 'Glixy Originals', name: 'Camo Oversized Tee', price: 549, mrp: 1399, badge: '61% OFF', seed: 'sale7', category: 'oversized' },
    { id: 's8', brand: 'Glixy Streetwear', name: 'Distressed Jeans', price: 1199, mrp: 2999, badge: '60% OFF', seed: 'sale8', category: 'bottomwear' },
  ],
}

export const ALL_PRODUCTS: Product[] = [...PRODUCTS.new, ...PRODUCTS.best, ...PRODUCTS.sale]

export const findProduct = (id: string) => ALL_PRODUCTS.find((p) => p.id === id)

export const discount = (mrp: number, price: number) =>
  Math.round(((mrp - price) / mrp) * 100)

export type Category = {
  label: string
  count: string
  image: string
  key: Product['category']
}

export const CATEGORIES: Category[] = [
  { label: 'T-Shirts', count: '120+ styles', image: '/products/cat-tees.jpg', key: 'tees' },
  { label: 'Oversized', count: '80+ styles', image: '/products/cat-oversized.jpg', key: 'oversized' },
  { label: 'Shirts', count: '60+ styles', image: '/products/cat-shirts.jpg', key: 'shirts' },
  { label: 'Hoodies', count: '45+ styles', image: '/products/cat-hoodies.jpg', key: 'hoodies' },
  { label: 'Joggers', count: '40+ styles', image: '/products/cat-joggers.jpg', key: 'joggers' },
  { label: 'Jackets', count: '30+ styles', image: '/products/cat-jackets.jpg', key: 'jackets' },
  { label: 'Bottomwear', count: '50+ styles', image: '/products/cat-bottomwear.jpg', key: 'bottomwear' },
]

export type HeroSlide = {
  kicker: string
  title: string
  sub: string
  cta: string
  href: string
  image: string
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    kicker: '',
    title: '',
    sub: '',
    cta: '',
    href: '#shirts',
    image: '/products/362e0880-0063-4ea2-af01-033cb7985185.png',
  },
  {
    kicker: '',
    title: '',
    sub: '',
    cta: '',
    href: '#tees',
    image: '/products/71fcb5dd-802c-4fed-9b4f-41828fdac28b.png',
  },
  {
    kicker: '',
    title: '',
    sub: '',
    cta: '',
    href: '#new',
    image: '/products/eb4e9cac-b250-4e9e-85c0-7c23af0dadcc.png',
  },
  {
    kicker: '',
    title: '',
    sub: '',
    cta: '',
    href: '#bottomwear',
    image: '/products/153bfe28-225b-4c6f-a361-8cd33bca6216.png',
  },
  {
    kicker: '',
    title: '',
    sub: '',
    cta: '',
    href: '#new',
    image: '/products/e747c1ab-fe69-421e-bc03-f1ac0015570d.png',
  },
]

export type Look = {
  image: string
  tag: string
  title: string
}

export const LOOKBOOK: Look[] = [
  { image: '/products/look1.jpg', tag: 'STREETWEAR', title: 'The Layered Look' },
  { image: '/products/look2.jpg', tag: 'ESSENTIALS', title: 'Everyday Staples' },
  { image: '/products/look3.jpg', tag: 'STATEMENT', title: 'Bold & Graphic' },
  { image: '/products/look4.jpg', tag: 'CLEAN FIT', title: 'Minimal Mondays' },
]
