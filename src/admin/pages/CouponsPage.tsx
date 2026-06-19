import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { Btn, Card, Field, Input, Modal, PageHeader, Select } from '../ui'

type Coupon = {
  _id?: string
  code: string
  description: string
  type: 'percent' | 'flat'
  value: number
  minOrder: number
  maxDiscount: number
  usageLimit: number
  used: number
  expiresAt: string | null
  active: boolean
}

const empty: Coupon = {
  code: '',
  description: '',
  type: 'percent',
  value: 10,
  minOrder: 0,
  maxDiscount: 0,
  usageLimit: 0,
  used: 0,
  expiresAt: null,
  active: true,
}

export default function CouponsPage() {
  const [items, setItems] = useState<Coupon[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Coupon>(empty)

  async function load() {
    setItems(await api<Coupon[]>('/coupons'))
  }
  useEffect(() => { load() }, [])

  async function save() {
    try {
      if (editing._id) await api(`/coupons/${editing._id}`, { method: 'PUT', body: JSON.stringify(editing) })
      else await api('/coupons', { method: 'POST', body: JSON.stringify(editing) })
      setOpen(false); load()
    } catch (e: any) { alert(e.message) }
  }
  async function del(c: Coupon) {
    if (!c._id || !confirm(`Delete coupon ${c.code}?`)) return
    await api(`/coupons/${c._id}`, { method: 'DELETE' }); load()
  }

  return (
    <div>
      <PageHeader
        title="Coupons"
        subtitle={`${items.length} codes`}
        action={<Btn onClick={() => { setEditing(empty); setOpen(true) }}>+ New Coupon</Btn>}
      />
      <Card>
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-500 uppercase">
            <tr className="text-left">
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">Discount</th>
              <th className="px-4 py-2">Min order</th>
              <th className="px-4 py-2">Used / Limit</th>
              <th className="px-4 py-2">Expires</th>
              <th className="px-4 py-2">Active</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-400">No coupons yet</td></tr>
            )}
            {items.map((c) => (
              <tr key={c._id}>
                <td className="px-4 py-2 font-mono font-bold">{c.code}</td>
                <td className="px-4 py-2">
                  {c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}
                  {c.maxDiscount > 0 && c.type === 'percent' && (
                    <span className="text-xs text-slate-400"> · max ₹{c.maxDiscount}</span>
                  )}
                </td>
                <td className="px-4 py-2 text-xs">{c.minOrder ? `₹${c.minOrder}` : '—'}</td>
                <td className="px-4 py-2 text-xs">{c.used}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
                <td className="px-4 py-2 text-xs">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}</td>
                <td className="px-4 py-2 text-xs">{c.active ? '✓' : '—'}</td>
                <td className="px-4 py-2 text-right whitespace-nowrap">
                  <Btn variant="ghost" onClick={() => { setEditing(c); setOpen(true) }}>Edit</Btn>
                  <Btn variant="danger" className="ml-1" onClick={() => del(c)}>Delete</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing._id ? 'Edit Coupon' : 'New Coupon'}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Code (uppercase)">
            <Input value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })} placeholder="WELCOME10" />
          </Field>
          <Field label="Type">
            <Select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value as any })}>
              <option value="percent">Percent off</option>
              <option value="flat">Flat ₹ off</option>
            </Select>
          </Field>
          <Field label={editing.type === 'percent' ? 'Percent (1–100)' : 'Amount (₹)'}>
            <Input type="number" value={editing.value} onChange={(e) => setEditing({ ...editing, value: +e.target.value })} />
          </Field>
          <Field label="Max discount (₹, 0 = no cap)">
            <Input type="number" value={editing.maxDiscount} onChange={(e) => setEditing({ ...editing, maxDiscount: +e.target.value })} />
          </Field>
          <Field label="Min order (₹)">
            <Input type="number" value={editing.minOrder} onChange={(e) => setEditing({ ...editing, minOrder: +e.target.value })} />
          </Field>
          <Field label="Usage limit (0 = unlimited)">
            <Input type="number" value={editing.usageLimit} onChange={(e) => setEditing({ ...editing, usageLimit: +e.target.value })} />
          </Field>
          <div className="col-span-2">
            <Field label="Description"><Input value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
          </div>
          <Field label="Expires on">
            <Input
              type="date"
              value={editing.expiresAt ? editing.expiresAt.slice(0, 10) : ''}
              onChange={(e) => setEditing({ ...editing, expiresAt: e.target.value || null })}
            />
          </Field>
          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
              Active
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
          <Btn onClick={save}>{editing._id ? 'Save' : 'Create'}</Btn>
        </div>
      </Modal>
    </div>
  )
}
