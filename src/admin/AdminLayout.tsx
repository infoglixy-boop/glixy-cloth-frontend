import { NavLink, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { AdminInfo } from './AdminApp'

type Props = {
  admin: AdminInfo
  onLogout: () => void
  children: ReactNode
}

type Link = { to: string; label: string; icon: string; group?: string }

const links: Link[] = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '⏶', group: 'Overview' },

  { to: '/admin/products', label: 'Products', icon: '◫', group: 'Catalog' },
  { to: '/admin/categories', label: 'Categories', icon: '⊞', group: 'Catalog' },
  { to: '/admin/media', label: 'Media Library', icon: '🖼', group: 'Catalog' },

  { to: '/admin/orders', label: 'Orders', icon: '⛬', group: 'Sales' },
  { to: '/admin/coupons', label: 'Coupons', icon: '🏷', group: 'Sales' },
  { to: '/admin/users', label: 'Customers', icon: '☻', group: 'Sales' },

  { to: '/admin/hero', label: 'Hero Slides', icon: '◰', group: 'Content' },
  { to: '/admin/lookbook', label: 'Lookbook', icon: '◔', group: 'Content' },
  { to: '/admin/info', label: 'Info Pages', icon: '☷', group: 'Content' },
  { to: '/admin/site-settings', label: 'Site Settings', icon: '✦', group: 'Content' },

  { to: '/admin/newsletter', label: 'Newsletter', icon: '✉', group: 'Communication' },
  { to: '/admin/messages', label: 'Messages', icon: '☎', group: 'Communication' },

  { to: '/admin/settings', label: 'Account', icon: '⚙', group: 'System' },
]

export default function AdminLayout({ admin, onLogout, children }: Props) {
  const loc = useLocation()
  const current = [...links].sort((a, b) => b.to.length - a.to.length).find((l) => loc.pathname.startsWith(l.to))?.label || 'Admin'

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="text-lg font-bold tracking-wide">GLIXY</div>
          <div className="text-xs uppercase tracking-widest text-slate-400">Admin Panel</div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {Object.entries(
            links.reduce<Record<string, Link[]>>((acc, l) => {
              const g = l.group || ''
              if (!acc[g]) acc[g] = []
              acc[g].push(l)
              return acc
            }, {})
          ).map(([group, group_links]) => (
            <div key={group} className="mb-2">
              {group && (
                <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-widest text-slate-500">
                  {group}
                </div>
              )}
              {group_links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded text-sm transition ${
                      isActive
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`
                  }
                >
                  <span className="w-5 text-center text-base opacity-80">{l.icon}</span>
                  <span>{l.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-slate-800 p-4 text-xs text-slate-400">
          <div className="font-medium text-slate-200">{admin.name}</div>
          <div className="truncate">{admin.email}</div>
          <button
            onClick={onLogout}
            className="mt-3 w-full rounded bg-slate-800 hover:bg-slate-700 text-slate-100 py-1.5 text-xs"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 px-6 flex items-center justify-between bg-white border-b border-slate-200">
          <h1 className="text-base font-semibold">{current}</h1>
          <a
            href="/"
            className="text-xs text-slate-500 hover:text-slate-900 underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            View store ↗
          </a>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}
