import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { Btn, Card, PageHeader } from '../ui'

type Sub = { _id: string; email: string; source: string; active: boolean; createdAt: string }

export default function NewsletterPage() {
  const [items, setItems] = useState<Sub[]>([])
  async function load() { setItems(await api<Sub[]>('/newsletter')) }
  useEffect(() => { load() }, [])

  async function del(s: Sub) {
    if (!confirm(`Remove ${s.email}?`)) return
    await api(`/newsletter/${s._id}`, { method: 'DELETE' }); load()
  }

  function exportCsv() {
    const rows = ['email,source,createdAt', ...items.map((s) => `${s.email},${s.source},${s.createdAt}`)]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'subscribers.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader
        title="Newsletter Subscribers"
        subtitle={`${items.length} subscribers`}
        action={<Btn variant="ghost" onClick={exportCsv}>Export CSV</Btn>}
      />
      <Card>
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-500 uppercase">
            <tr className="text-left">
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Source</th>
              <th className="px-4 py-2">Joined</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">No subscribers</td></tr>
            )}
            {items.map((s) => (
              <tr key={s._id}>
                <td className="px-4 py-2">{s.email}</td>
                <td className="px-4 py-2 text-xs">{s.source}</td>
                <td className="px-4 py-2 text-xs text-slate-500">{new Date(s.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 text-right">
                  <Btn variant="danger" onClick={() => del(s)}>Remove</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
