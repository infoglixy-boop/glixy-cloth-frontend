import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { Btn, Card, Input, Modal, PageHeader, StatusBadge } from '../ui'

type User = {
  _id: string
  name: string
  email: string
  phone: string
  cart: any[]
  wishlist: string[]
  lastLoginAt: string | null
  createdAt: string
  orderCount?: number
  lifetimeValue?: number
  lastOrderAt?: string | null
}

type UserDetail = User & {
  orders: Array<{
    _id: string
    orderNumber: string
    total: number
    status: string
    createdAt: string
    items: Array<{ name: string; qty: number; price: number; image?: string }>
  }>
}

export default function UsersPage() {
  const [items, setItems] = useState<User[]>([])
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<UserDetail | null>(null)

  async function load() {
    setItems(await api<User[]>('/users'))
  }
  useEffect(() => { load() }, [])

  async function openUser(u: User) {
    const detail = await api<UserDetail>(`/users/${u._id}`)
    setOpen(detail)
  }

  async function del(u: User) {
    if (!confirm(`Delete user ${u.email}?`)) return
    await api(`/users/${u._id}`, { method: 'DELETE' })
    load()
    setOpen(null)
  }

  const filtered = items.filter(
    (u) =>
      !q ||
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase()) ||
      (u.phone || '').includes(q)
  )

  const totalLTV = items.reduce((s, u) => s + (u.lifetimeValue || 0), 0)
  const totalOrders = items.reduce((s, u) => s + (u.orderCount || 0), 0)

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle={`${items.length} registered · ${totalOrders} orders · ₹${totalLTV.toLocaleString('en-IN')} LTV`}
        action={<Input placeholder="Search name, email, phone…" value={q} onChange={(e) => setQ(e.target.value)} className="!w-72" />}
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase">
              <tr className="text-left">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Orders</th>
                <th className="px-4 py-2">LTV</th>
                <th className="px-4 py-2">Last order</th>
                <th className="px-4 py-2">Joined</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-6 text-center text-slate-400">No users{q ? ' match' : ' yet'}</td></tr>
              )}
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-medium">{u.name}</td>
                  <td className="px-4 py-2 text-xs">{u.email}</td>
                  <td className="px-4 py-2 text-xs">{u.phone || '—'}</td>
                  <td className="px-4 py-2 text-xs">{u.orderCount || 0}</td>
                  <td className="px-4 py-2 text-xs">₹{(u.lifetimeValue || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-2 text-xs text-slate-500">
                    {u.lastOrderAt ? new Date(u.lastOrderAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <Btn variant="ghost" onClick={() => openUser(u)}>View</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open ? `Customer · ${open.name}` : ''}>
        {open && (
          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Stat label="Lifetime value" value={`₹${(open.lifetimeValue || 0).toLocaleString('en-IN')}`} />
              <Stat label="Orders" value={String(open.orderCount || 0)} />
              <Stat label="Wishlist" value={String((open.wishlist || []).length)} />
              <Stat label="Cart items" value={String((open.cart || []).length)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-500">Email</div>
                <div>{open.email}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Phone</div>
                <div>{open.phone || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Joined</div>
                <div>{new Date(open.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Last login</div>
                <div>{open.lastLoginAt ? new Date(open.lastLoginAt).toLocaleString() : '—'}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Order history</h4>
              {open.orders.length === 0 ? (
                <div className="text-slate-400 text-sm py-3">No orders yet.</div>
              ) : (
                <div className="border border-slate-200 rounded divide-y divide-slate-100">
                  {open.orders.map((o) => (
                    <div key={o._id} className="px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-xs">{o.orderNumber}</div>
                        <StatusBadge value={o.status} />
                      </div>
                      <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
                        <span>{new Date(o.createdAt).toLocaleString()}</span>
                        <span className="font-semibold text-slate-900">₹{o.total}</span>
                      </div>
                      <div className="flex gap-2 mt-2 overflow-x-auto">
                        {o.items.slice(0, 6).map((it, i) =>
                          it.image ? (
                            <img key={i} src={it.image} alt="" className="w-10 h-12 object-cover rounded bg-slate-100 shrink-0" />
                          ) : (
                            <div key={i} className="w-10 h-12 rounded bg-slate-100 shrink-0 text-[8px] grid place-items-center text-slate-400 p-1 text-center">
                              {it.name.slice(0, 12)}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between">
              <a href={`mailto:${open.email}`} className="text-xs text-slate-600 underline">Email customer</a>
              <Btn variant="danger" onClick={() => del(open)}>Delete user</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded p-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-lg font-semibold mt-0.5">{value}</div>
    </div>
  )
}
