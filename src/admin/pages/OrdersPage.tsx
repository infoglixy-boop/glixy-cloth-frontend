import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { Btn, Card, Input, Modal, PageHeader, Select, StatusBadge } from '../ui'

type HistoryItem = { status: string; note: string; at: string }
type Order = {
  _id: string
  orderNumber: string
  customerName: string
  email: string
  phone: string
  address: any
  items: Array<{ productId: string; name: string; price: number; qty: number; image?: string; size?: string }>
  subtotal: number
  shipping: number
  discount: number
  couponCode: string
  total: number
  status: string
  statusHistory: HistoryItem[]
  trackingNumber: string
  courier: string
  expectedDeliveryAt: string | null
  paymentMethod: string
  paid: boolean
  notes: string
  createdAt: string
}

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
const COURIERS = ['', 'Delhivery', 'BlueDart', 'XpressBees', 'Ekart', 'India Post', 'DTDC']

export default function OrdersPage() {
  const [items, setItems] = useState<Order[]>([])
  const [open, setOpen] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [q, setQ] = useState('')

  async function load() {
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    if (q) params.set('q', q)
    const data = await api<Order[]>(`/orders${params.toString() ? `?${params}` : ''}`)
    setItems(data)
  }

  useEffect(() => {
    const t = setTimeout(load, 200)
    return () => clearTimeout(t)
  }, [statusFilter, q])

  async function changeStatus(o: Order, status: string, note = '') {
    const updated = await api<Order>(`/orders/${o._id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    })
    load()
    if (open?._id === o._id) setOpen(updated)
  }

  async function patch(o: Order, body: Partial<Order>) {
    const updated = await api<Order>(`/orders/${o._id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
    load()
    if (open?._id === o._id) setOpen(updated)
  }

  async function del(o: Order) {
    if (!confirm(`Delete order ${o.orderNumber}?`)) return
    await api(`/orders/${o._id}`, { method: 'DELETE' })
    load()
    setOpen(null)
  }

  const printInvoice = (o: Order) => {
    const html = invoiceHtml(o)
    const w = window.open('', '_blank', 'width=800,height=900')
    if (!w) return
    w.document.write(html)
    w.document.close()
    setTimeout(() => w.print(), 250)
  }

  const summary = {
    revenue: items.reduce((s, o) => s + o.total, 0),
    pending: items.filter((o) => o.status === 'pending').length,
    shipped: items.filter((o) => o.status === 'shipped').length,
    delivered: items.filter((o) => o.status === 'delivered').length,
  }

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle={`${items.length} matching · ₹${summary.revenue.toLocaleString('en-IN')}`}
        action={
          <div className="flex gap-2">
            <Input placeholder="Search order # / customer / email" value={q} onChange={(e) => setQ(e.target.value)} className="!w-72" />
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="!w-40">
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <MiniStat label="Pending" value={summary.pending} accent="bg-amber-500" />
        <MiniStat label="Shipped" value={summary.shipped} accent="bg-indigo-500" />
        <MiniStat label="Delivered" value={summary.delivered} accent="bg-emerald-500" />
        <MiniStat label="Total" value={items.length} accent="bg-slate-700" />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase">
              <tr className="text-left">
                <th className="px-4 py-2">Order #</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Payment</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-6 text-center text-slate-400">No orders</td></tr>
              )}
              {items.map((o) => (
                <tr key={o._id} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-mono text-xs">{o.orderNumber}</td>
                  <td className="px-4 py-2">
                    <div className="font-medium">{o.customerName}</div>
                    <div className="text-xs text-slate-500">{o.email}</div>
                  </td>
                  <td className="px-4 py-2 text-xs">{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                  <td className="px-4 py-2">₹{o.total}</td>
                  <td className="px-4 py-2 text-xs uppercase">
                    {o.paymentMethod}
                    <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded ${o.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {o.paid ? 'PAID' : 'UNPAID'}
                    </span>
                  </td>
                  <td className="px-4 py-2"><StatusBadge value={o.status} /></td>
                  <td className="px-4 py-2 text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">
                    <Btn variant="ghost" onClick={() => setOpen(o)}>View</Btn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open ? `Order ${open.orderNumber}` : ''}>
        {open && (
          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-500">Customer</div>
                <div className="font-medium">{open.customerName}</div>
                <div className="text-xs">{open.email}{open.phone ? ` · ${open.phone}` : ''}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Payment</div>
                <div className="font-medium uppercase">{open.paymentMethod}</div>
                <label className="inline-flex items-center gap-1.5 mt-1 text-xs">
                  <input
                    type="checkbox"
                    checked={open.paid}
                    onChange={(e) => patch(open, { paid: e.target.checked })}
                  />
                  Mark as paid
                </label>
              </div>
            </div>

            {open.address && Object.keys(open.address).length > 0 && (
              <div>
                <div className="text-xs text-slate-500 mb-1">Shipping address</div>
                <div className="bg-slate-50 p-3 rounded text-sm space-y-0.5">
                  {Object.entries(open.address).map(([k, v]) => (
                    <div key={k}><span className="text-slate-500 capitalize">{k}: </span>{String(v)}</div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs text-slate-500 mb-1">Items ({open.items.reduce((s, i) => s + i.qty, 0)})</div>
              <div className="border border-slate-200 rounded divide-y divide-slate-100">
                {open.items.map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-3 py-2">
                    {it.image ? (
                      <img src={it.image} className="w-10 h-12 rounded object-cover bg-slate-100" />
                    ) : (
                      <div className="w-10 h-12 rounded bg-slate-100" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{it.name}</div>
                      <div className="text-xs text-slate-500">Qty {it.qty}{it.size ? ` · ${it.size}` : ''} · ₹{it.price}</div>
                    </div>
                    <div>₹{it.price * it.qty}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded p-3 space-y-1 text-sm">
              <Row label="Subtotal" value={`₹${open.subtotal}`} />
              <Row label="Shipping" value={open.shipping === 0 ? 'FREE' : `₹${open.shipping}`} />
              {open.discount > 0 && <Row label={`Discount ${open.couponCode ? `(${open.couponCode})` : ''}`} value={`− ₹${open.discount}`} />}
              <div className="border-t border-slate-200 pt-1 mt-1">
                <Row label="Total" value={`₹${open.total}`} bold />
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Shipment</h4>
              <div className="grid grid-cols-3 gap-2">
                <label className="block">
                  <span className="block text-[11px] text-slate-500 mb-1">Courier</span>
                  <Select value={open.courier} onChange={(e) => patch(open, { courier: e.target.value })}>
                    {COURIERS.map((c) => <option key={c} value={c}>{c || '— none —'}</option>)}
                  </Select>
                </label>
                <label className="block">
                  <span className="block text-[11px] text-slate-500 mb-1">Tracking #</span>
                  <Input
                    value={open.trackingNumber}
                    onChange={(e) => setOpen({ ...open, trackingNumber: e.target.value })}
                    onBlur={() => patch(open, { trackingNumber: open.trackingNumber })}
                  />
                </label>
                <label className="block">
                  <span className="block text-[11px] text-slate-500 mb-1">Expected delivery</span>
                  <Input
                    type="date"
                    value={open.expectedDeliveryAt ? open.expectedDeliveryAt.slice(0, 10) : ''}
                    onChange={(e) => patch(open, { expectedDeliveryAt: e.target.value as any })}
                  />
                </label>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Status timeline</h4>
              <ol className="border-l-2 border-slate-200 pl-4 space-y-2.5">
                {open.statusHistory.slice().reverse().map((h, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-slate-900 ring-4 ring-white" />
                    <div className="flex items-center gap-2">
                      <StatusBadge value={h.status} />
                      <span className="text-xs text-slate-400">{new Date(h.at).toLocaleString()}</span>
                    </div>
                    {h.note && <div className="text-xs text-slate-600 mt-0.5">{h.note}</div>}
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
              <span className="text-xs text-slate-500">Change status:</span>
              <Select value={open.status} onChange={(e) => changeStatus(open, e.target.value)} className="!w-40">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
              <Btn variant="ghost" onClick={() => printInvoice(open)}>Invoice / Print</Btn>
              <div className="flex-1" />
              <Btn variant="danger" onClick={() => del(open)}>Delete</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function MiniStat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${accent}`} />
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? 'font-semibold' : 'text-slate-600'}>{label}</span>
      <span className={bold ? 'font-bold' : ''}>{value}</span>
    </div>
  )
}

function invoiceHtml(o: Order) {
  const rows = o.items
    .map(
      (it) => `<tr>
        <td>${it.name}${it.size ? ` (${it.size})` : ''}</td>
        <td style="text-align:center">${it.qty}</td>
        <td style="text-align:right">₹${it.price}</td>
        <td style="text-align:right">₹${it.price * it.qty}</td>
      </tr>`
    )
    .join('')
  const addr = Object.values(o.address || {}).filter(Boolean).join(', ')
  return `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${o.orderNumber}</title>
  <style>
    body{font-family:-apple-system,system-ui,sans-serif;color:#0f172a;padding:32px;max-width:760px;margin:auto}
    h1{margin:0 0 4px;font-size:22px}
    table{width:100%;border-collapse:collapse;margin-top:18px}
    th,td{border-bottom:1px solid #e2e8f0;padding:8px 6px;text-align:left;font-size:13px}
    th{background:#f8fafc;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#64748b}
    .right{text-align:right} .muted{color:#64748b;font-size:12px}
    .totals{margin-top:14px;text-align:right;font-size:14px}
    .totals .grand{font-weight:700;font-size:18px;margin-top:6px}
  </style></head><body>
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div>
        <h1>GLIXY</h1>
        <div class="muted">Streetwear · Mumbai</div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:600">Invoice ${o.orderNumber}</div>
        <div class="muted">${new Date(o.createdAt).toLocaleString()}</div>
        <div class="muted" style="text-transform:uppercase">${o.status}</div>
      </div>
    </div>
    <hr style="margin:18px 0;border:none;border-top:1px solid #e2e8f0" />
    <div><strong>Bill to:</strong> ${o.customerName}<br>${o.email}${o.phone ? ` · ${o.phone}` : ''}<br><span class="muted">${addr}</span></div>
    <table>
      <thead><tr><th>Item</th><th class="right" style="text-align:center">Qty</th><th class="right">Price</th><th class="right">Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="totals">
      <div>Subtotal: ₹${o.subtotal}</div>
      <div>Shipping: ${o.shipping === 0 ? 'FREE' : '₹' + o.shipping}</div>
      ${o.discount > 0 ? `<div>Discount${o.couponCode ? ' (' + o.couponCode + ')' : ''}: − ₹${o.discount}</div>` : ''}
      <div class="grand">Total: ₹${o.total}</div>
      <div class="muted" style="margin-top:6px">Payment: ${o.paymentMethod.toUpperCase()} · ${o.paid ? 'Paid' : 'Unpaid'}</div>
    </div>
    <p class="muted" style="margin-top:24px">Thank you for shopping with Glixy.</p>
  </body></html>`
}
