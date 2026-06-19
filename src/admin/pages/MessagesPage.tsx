import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { Btn, Card, Modal, PageHeader, Select, StatusBadge } from '../ui'

type Msg = {
  _id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: string
  createdAt: string
}

const STATUSES = ['new', 'read', 'replied', 'archived']

export default function MessagesPage() {
  const [items, setItems] = useState<Msg[]>([])
  const [open, setOpen] = useState<Msg | null>(null)
  async function load() { setItems(await api<Msg[]>('/contact')) }
  useEffect(() => { load() }, [])

  async function changeStatus(m: Msg, status: string) {
    await api(`/contact/${m._id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
    load(); if (open) setOpen({ ...open, status })
  }
  async function del(m: Msg) {
    if (!confirm('Delete message?')) return
    await api(`/contact/${m._id}`, { method: 'DELETE' }); load(); setOpen(null)
  }

  return (
    <div>
      <PageHeader title="Contact Messages" subtitle={`${items.length} total`} />
      <Card>
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-500 uppercase">
            <tr className="text-left">
              <th className="px-4 py-2">From</th>
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">When</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No messages</td></tr>
            )}
            {items.map((m) => (
              <tr key={m._id} className="hover:bg-slate-50">
                <td className="px-4 py-2">
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-slate-500">{m.email}</div>
                </td>
                <td className="px-4 py-2 text-xs">{m.subject || '—'}</td>
                <td className="px-4 py-2"><StatusBadge value={m.status} /></td>
                <td className="px-4 py-2 text-xs text-slate-500">{new Date(m.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 text-right">
                  <Btn variant="ghost" onClick={() => { setOpen(m); if (m.status === 'new') changeStatus(m, 'read') }}>Open</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open ? `From ${open.name}` : ''}>
        {open && (
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-xs text-slate-500">Email</div>
              <div>{open.email}{open.phone ? ` · ${open.phone}` : ''}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Subject</div>
              <div>{open.subject || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Message</div>
              <div className="whitespace-pre-wrap bg-slate-50 p-3 rounded text-sm">{open.message}</div>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
              <Select value={open.status} onChange={(e) => changeStatus(open, e.target.value)} className="!w-40">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
              <a href={`mailto:${open.email}?subject=Re: ${open.subject || ''}`} className="text-xs text-slate-600 underline">
                Reply via email
              </a>
              <div className="flex-1" />
              <Btn variant="danger" onClick={() => del(open)}>Delete</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
