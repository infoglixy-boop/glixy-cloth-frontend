import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  ArrowUpRight,
  MapPin,
  Mail,
  Phone,
  Globe,
  type LucideIcon,
} from 'lucide-react'
import { useStore, type InfoPageKey } from '../context/StoreContext'
import { useContent } from '../context/ContentContext'

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  facebook: Facebook,
  youtube: Youtube,
}

const INFO_KEYS: InfoPageKey[] = [
  'about', 'careers', 'sustainability', 'privacy', 'terms',
  'shipping', 'returns', 'faqs', 'track', 'contact',
]

export default function Footer() {
  const { setChatOpen, setInfoPage } = useStore()
  const { settings } = useContent()

  const handleLink = (href: string) => {
    if (!href) return
    if (href.startsWith('#')) {
      const k = href.slice(1).toLowerCase() as InfoPageKey
      if (INFO_KEYS.includes(k)) {
        setInfoPage(k)
        return
      }
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      return
    }
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  return (
    <footer className="bg-brand-ink text-brand-cream">
      <div className="container-x pt-16 sm:pt-24 pb-10 border-b border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <h2 className="font-display italic text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-3xl">
            Join the
            <br />
            {settings.storeName} Gang.
          </h2>
          <div className="max-w-sm">
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              Not sure what to wear? Ask our AI stylist for a fit tailored to your
              vibe, occasion and budget — no sign-up needed.
            </p>
            <button
              onClick={() => setChatOpen(true)}
              className="group inline-flex items-center gap-2 bg-brand text-white font-medium text-sm pl-6 pr-4 py-3.5 rounded-full hover:bg-white hover:text-brand-ink transition-colors"
            >
              Ask the AI Stylist
              <span className="grid place-items-center w-6 h-6 rounded-full bg-white text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                <ArrowUpRight size={14} />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="container-x py-7 grid sm:grid-cols-3 gap-5 border-b border-white/10 text-sm">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-white/10 grid place-items-center text-brand"><Mail size={15} /></span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/45 font-mono">Email</p>
            <a href={`mailto:${settings.contactEmail}`} className="text-white/85 hover:text-brand transition-colors">{settings.contactEmail}</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-white/10 grid place-items-center text-brand"><Phone size={15} /></span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/45 font-mono">Support</p>
            <span className="text-white/85">{settings.contactPhone}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-white/10 grid place-items-center text-brand"><MapPin size={15} /></span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/45 font-mono">HQ</p>
            <span className="text-white/85">{settings.contactAddress}</span>
          </div>
        </div>
      </div>

      <div className="container-x py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <a href="#" className="font-display text-4xl font-medium italic tracking-tight">
            {settings.storeName.charAt(0).toUpperCase() + settings.storeName.slice(1).toLowerCase()}
            <span className="text-brand">.</span>
          </a>
          <p className="mt-4 text-sm text-white/60 max-w-xs leading-relaxed">
            {settings.storeTagline}. Officially licensed merch & original streetwear,
            crafted in heavyweight cotton for the bold.
          </p>
          <div className="mt-6 flex gap-2">
            {settings.socialLinks.map((s) => {
              const Icon = SOCIAL_ICONS[s.label.toLowerCase()] || Globe
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand flex items-center justify-center transition-colors"
                >
                  <Icon size={16} />
                </a>
              )
            })}
          </div>
        </div>
        {settings.footerColumns.map((c) => (
          <div key={c.title}>
            <h4 className="font-mono text-[11px] font-medium tracking-[0.2em] mb-5 text-white/50">
              {c.title.toUpperCase()}
            </h4>
            <ul className="flex flex-col gap-3">
              {c.links.map((l) => (
                <li key={l.label}>
                  <button
                    type="button"
                    onClick={() => handleLink(l.href)}
                    className="text-sm text-white/80 hover:text-brand transition-colors text-left"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {['VISA', 'M-CARD', 'RUPAY', 'AMEX', 'UPI', settings.codEnabled ? 'COD' : null].filter(Boolean).map((p) => (
              <span
                key={p as string}
                className="text-[10px] font-mono font-semibold tracking-[0.15em] border border-white/15 text-white/70 px-2.5 py-1 rounded-full"
              >
                {p}
              </span>
            ))}
          </div>
          <p className="text-xs text-white/45 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>© {new Date().getFullYear()} {settings.storeName} Lifestyle Pvt. Ltd.</span>
            <button onClick={() => setInfoPage('terms')} className="hover:text-brand transition-colors">Terms</button>
            <button onClick={() => setInfoPage('privacy')} className="hover:text-brand transition-colors">Privacy</button>
            <button onClick={() => setInfoPage('faqs')} className="hover:text-brand transition-colors">FAQs</button>
          </p>
        </div>
      </div>
    </footer>
  )
}
