import { useSyncExternalStore } from 'react'

/*
 * A tiny History-API router: real URLs (/benchmarks, /trust …), back/forward,
 * and in-page hashes (/policies#sla). The dev server and `vite preview` already
 * fall back to index.html; a production host needs the same SPA rewrite.
 */
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((f) => f())

if (typeof window !== 'undefined') window.addEventListener('popstate', notify)

const subscribe = (f: () => void) => {
  listeners.add(f)
  return () => listeners.delete(f)
}

/** Sub-path the site is served from ('' locally, '/glixy-cloth-frontend' on GitHub Pages). */
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

/** App path → real URL path. */
export const withBase = (to: string) => (to.startsWith('/') ? BASE + to : to)

const stripBase = (p: string) => (BASE && p.startsWith(BASE) ? p.slice(BASE.length) || '/' : p)

const snapshot = () => stripBase(window.location.pathname) + window.location.hash

export function useLocation() {
  const full = useSyncExternalStore(subscribe, snapshot, () => '/')
  const i = full.indexOf('#')
  return { path: normalize(i < 0 ? full : full.slice(0, i)), hash: i < 0 ? '' : full.slice(i + 1) }
}

export function normalize(p: string) {
  return p.length > 1 ? p.replace(/\/+$/, '') : p
}

export function navigate(to: string) {
  const url = new URL(withBase(to), window.location.href)
  const same = normalize(url.pathname) === normalize(window.location.pathname)
  if (same && url.hash) {
    // same page: just scroll to the anchor
    window.history.pushState(null, '', url.pathname + url.hash)
    scrollToHash(url.hash.slice(1))
    notify()
    return
  }
  if (same && !url.hash) {
    window.history.pushState(null, '', url.pathname)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    notify()
    return
  }
  window.history.pushState(null, '', url.pathname + url.hash)
  notify()
}

export function scrollToHash(id: string, smooth = true) {
  const el = id && document.getElementById(decodeURIComponent(id))
  if (!el) return false
  const head = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sh-h')) || 104
  const top = el.getBoundingClientRect().top + window.scrollY - head - 8
  window.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'instant' })
  return true
}

/* ---------- "View in rack" from anywhere ---------- */
let pending: string | null = null

/** Glide the rack shelf to a server, switching to the Servers page if the shelf is not on this one. */
export function selectServer(id: string) {
  const shelf = document.getElementById('racks')
  if (shelf) {
    window.dispatchEvent(new CustomEvent('glixy:select', { detail: id }))
    scrollToHash('racks')
    return
  }
  pending = id
  navigate('/servers#racks')
}

export function takePendingServer() {
  const p = pending
  // cleared on the next tick so React StrictMode's double effect run still sees it
  if (p) window.setTimeout(() => (pending = null), 0)
  return p
}
