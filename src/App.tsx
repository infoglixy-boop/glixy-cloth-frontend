import { useEffect, useLayoutEffect, type ComponentType } from 'react'
import { ExpertProvider } from './components/Expert'
import SiteHeader from './components/SiteHeader'
import { GlassDefs } from './components/glass/Grain'
import Footer from './components/Footer'
import FloatingCta from './components/FloatingCta'
import Home from './pages/Home'
import ServersPage from './pages/ServersPage'
import BenchmarksPage from './pages/BenchmarksPage'
import AiPage from './pages/AiPage'
import CustomersPage from './pages/CustomersPage'
import TrustPage from './pages/TrustPage'
import MissionPage from './pages/MissionPage'
import ContactPage from './pages/ContactPage'
import PoliciesPage from './pages/PoliciesPage'
import NotFound from './pages/NotFound'
import { scrollToHash, useLocation } from './router'

const ROUTES: Record<string, { page: ComponentType; title: string }> = {
  '/': { page: Home, title: 'Glixy — Dedicated Servers, GPU Racks & Colocation' },
  '/servers': { page: ServersPage, title: 'Servers & rack slots — Glixy' },
  '/benchmarks': { page: BenchmarksPage, title: 'Benchmarks — Glixy' },
  '/ai': { page: AiPage, title: 'AI & model training — Glixy' },
  '/customers': { page: CustomersPage, title: 'Customers — Glixy' },
  '/trust': { page: TrustPage, title: 'Trust & compliance — Glixy' },
  '/mission': { page: MissionPage, title: 'Mission & vision — Glixy' },
  '/contact': { page: ContactPage, title: 'Contact — Glixy' },
  '/policies': { page: PoliciesPage, title: 'Policies — Glixy' },
}

// Blocks that fade up as they scroll into view, on every page.
const REVEAL = [
  '.sec__head',
  '.sec__stats > *',
  '.sec__grid > *',
  '.sec__wide',
  '.who > li',
  '.comp > li',
  '.pipe > li',
  '.benefits > li',
  '.sec-ops > li',
  '.trust__cols > *',
  '.trust__title',
  '.xp > li',
  '.gpu > li',
  '.faq > details',
  '.cta-band__inner > *',
  '.pol__item',
  '.contact > *',
  '.cat__bar',
].join(',')

function useReveal(path: string) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = Array.from(document.querySelectorAll<HTMLElement>(`main ${REVEAL.split(',').join(', main ')}`))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    els.forEach((el) => {
      if (el.classList.contains('is-in')) return
      const i = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0
      el.style.setProperty('--rv-d', `${Math.min(i, 7) * 70}ms`)
      el.classList.add('rv')
      io.observe(el)
    })
    return () => io.disconnect()
  }, [path])
}

if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'

export default function App() {
  const { path, hash } = useLocation()
  const route = ROUTES[path]
  const Page = route?.page ?? NotFound

  useEffect(() => {
    document.title = route?.title ?? 'Page not found — Glixy'
  }, [route])

  // new page: start at the top, or at the #anchor once the layout has settled
  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    const t1 = window.setTimeout(() => scrollToHash(hash, false), 60)
    const t2 = window.setTimeout(() => scrollToHash(hash, true), 450)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
    // only on page change — same-page hash jumps are handled by navigate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  useReveal(path)

  return (
    <ExpertProvider>
      <GlassDefs />
      <SiteHeader />
      <main key={path} className="page">
        <Page />
      </main>
      <Footer />
      <FloatingCta />
    </ExpertProvider>
  )
}
