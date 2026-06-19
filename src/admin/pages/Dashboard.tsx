import { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { api } from '../../api/client'
import { Card, StatusBadge } from '../ui'

type Analytics = {
  range: { days: number; since: string }
  cards: {
    revenue: number
    prevRevenue: number
    orders: number
    prevOrders: number
    avgOrder: number
    newUsers: number
    newSubscribers: number
    totalProducts: number
    totalUsers: number
    totalSubs: number
    totalOrders: number
  }
  series: Array<{ date: string; revenue: number; orders: number; users: number; subscribers: number }>
  statusBreakdown: Array<{ status: string; count: number }>
  topProducts: Array<{ _id: string; name: string; qty: number; revenue: number }>
  recentOrders: Array<{ _id: string; orderNumber: string; customerName: string; total: number; status: string; createdAt: string }>
  recentMessages: Array<{ _id: string; name: string; email: string; subject: string; createdAt: string }>
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  shipped: '#6366f1',
  delivered: '#10b981',
  cancelled: '#ef4444',
}

function pct(curr: number, prev: number) {
  if (!prev) return curr > 0 ? 100 : 0
  return Math.round(((curr - prev) / prev) * 100)
}

function StatCard({
  label,
  value,
  delta,
  accent = 'from-slate-900 to-slate-700',
  prefix = '',
}: {
  label: string
  value: number | string
  delta?: number
  accent?: string
  prefix?: string
}) {
  const up = (delta || 0) >= 0
  return (
    <div className="relative bg-white rounded-xl border border-slate-200 p-5 overflow-hidden">
      <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${accent}`} />
      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">{label}</div>
      <div className="text-3xl font-bold mt-1 text-slate-900">
        {prefix}
        {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
      </div>
      {typeof delta === 'number' && (
        <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${up ? 'text-emerald-600' : 'text-red-600'}`}>
          {up ? '▲' : '▼'} {Math.abs(delta)}%
          <span className="text-slate-400 font-normal">vs prev period</span>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [days, setDays] = useState(30)
  const [d, setD] = useState<Analytics | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    setD(null)
    api<Analytics>(`/admin/analytics?days=${days}`).then(setD).catch((e) => setErr(e.message))
  }, [days])

  if (err) return <div className="text-red-600 text-sm">{err}</div>
  if (!d) return <div className="text-slate-500 text-sm">Loading…</div>

  const { cards, series, statusBreakdown, topProducts, recentOrders, recentMessages } = d

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-500">Last {days} days · live from MongoDB</p>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white overflow-hidden text-xs">
          {[7, 30, 90, 365].map((n) => (
            <button
              key={n}
              onClick={() => setDays(n)}
              className={`px-3 py-1.5 ${days === n ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {n}d
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Revenue" value={cards.revenue} prefix="₹" delta={pct(cards.revenue, cards.prevRevenue)} accent="from-emerald-500 to-teal-500" />
        <StatCard label="Orders" value={cards.orders} delta={pct(cards.orders, cards.prevOrders)} accent="from-indigo-500 to-violet-500" />
        <StatCard label="Avg Order" value={cards.avgOrder} prefix="₹" accent="from-amber-500 to-orange-500" />
        <StatCard label="New Users" value={cards.newUsers} accent="from-sky-500 to-cyan-500" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={cards.totalProducts} accent="from-slate-700 to-slate-500" />
        <StatCard label="Total Customers" value={cards.totalUsers} accent="from-slate-700 to-slate-500" />
        <StatCard label="Subscribers" value={cards.totalSubs} accent="from-slate-700 to-slate-500" />
        <StatCard label="All-time Orders" value={cards.totalOrders} accent="from-slate-700 to-slate-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Revenue trend</h3>
            <span className="text-xs text-slate-400">{days}-day series</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={series}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={fmt} width={70} />
              <Tooltip formatter={(v: any) => fmt(Number(v))} />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-3">Orders by status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusBreakdown.length ? statusBreakdown : [{ status: 'no data', count: 1 }]}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={3}
              >
                {(statusBreakdown.length ? statusBreakdown : [{ status: 'no data', count: 1 }]).map((s, i) => (
                  <Cell key={i} fill={STATUS_COLORS[s.status] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Orders per day</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-3">New users & subscribers</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="users" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Users" />
              <Line type="monotone" dataKey="subscribers" stroke="#d946ef" strokeWidth={2} dot={false} name="Subscribers" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <h3 className="font-semibold mb-3">Top products by revenue</h3>
          {topProducts.length === 0 ? (
            <div className="text-sm text-slate-400 py-4">No sales yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topProducts} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={fmt} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={180} />
                <Tooltip formatter={(v: any) => fmt(Number(v))} />
                <Bar dataKey="revenue" fill="#0f172a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-3">Recent activity</h3>
          <ul className="space-y-3 text-sm max-h-[280px] overflow-y-auto pr-1">
            {recentMessages.map((m) => (
              <li key={m._id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 grid place-items-center text-xs">✉</div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{m.name} · {m.subject || 'message'}</div>
                  <div className="text-xs text-slate-400">{new Date(m.createdAt).toLocaleString()}</div>
                </div>
              </li>
            ))}
            {recentOrders.slice(0, 4).map((o) => (
              <li key={o._id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-xs">₹</div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{o.customerName} placed order ₹{o.total}</div>
                  <div className="text-xs text-slate-400">{o.orderNumber} · {new Date(o.createdAt).toLocaleString()}</div>
                </div>
              </li>
            ))}
            {recentMessages.length === 0 && recentOrders.length === 0 && (
              <li className="text-slate-400 text-sm">Quiet so far.</li>
            )}
          </ul>
        </Card>
      </div>

      <Card>
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold">Recent orders</h3>
          <a href="/admin/orders" className="text-xs text-slate-500 hover:text-slate-900">View all →</a>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-500 uppercase">
            <tr className="text-left">
              <th className="px-5 py-2">Order</th>
              <th className="px-5 py-2">Customer</th>
              <th className="px-5 py-2">Total</th>
              <th className="px-5 py-2">Status</th>
              <th className="px-5 py-2">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {recentOrders.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-6 text-slate-400 text-center">No orders yet</td></tr>
            )}
            {recentOrders.map((o) => (
              <tr key={o._id}>
                <td className="px-5 py-2 font-mono text-xs">{o.orderNumber}</td>
                <td className="px-5 py-2">{o.customerName}</td>
                <td className="px-5 py-2">₹{o.total}</td>
                <td className="px-5 py-2"><StatusBadge value={o.status} /></td>
                <td className="px-5 py-2 text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
