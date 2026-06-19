import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { Btn, Card, Field, Input, Modal, PageHeader } from '../ui'
import ImageUpload from '../ImageUpload'

type Cat = {
  _id?: string
  key: string
  label: string
  count: string
  image: string
  order: number
  active: boolean
}

const empty: Cat = { key: '', label: '', count: '', image: '', order: 0, active: true }

export default function CategoriesPage() {
  const [items, setItems] = useState<Cat[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Cat>(empty)

  async function load() {
    const data = await api<Cat[]>('/categories/all')
    setItems(data)
  }
  useEffect(() => { load() }, [])

  async function save() {
    try {
      if (editing._id) await api(`/categories/${editing._id}`, { method: 'PUT', body: JSON.stringify(editing) })
      else await api('/categories', { method: 'POST', body: JSON.stringify(editing) })
      setOpen(false); load()
    } catch (e: any) { alert(e.message) }
  }
  async function del(c: Cat) {
    if (!c._id || !confirm(`Delete "${c.label}"?`)) return
    await api(`/categories/${c._id}`, { method: 'DELETE' }); load()
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle={`${items.length} categories`}
        action={<Btn onClick={() => { setEditing(empty); setOpen(true) }}>+ New Category</Btn>}
      />
      <Card>
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-500 uppercase">
            <tr className="text-left">
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Key</th>
              <th className="px-4 py-2">Label</th>
              <th className="px-4 py-2">Count</th>
              <th className="px-4 py-2">Order</th>
              <th className="px-4 py-2">Active</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((c) => (
              <tr key={c._id}>
                <td className="px-4 py-2">{c.image && <img src={c.image} className="w-10 h-10 rounded object-cover bg-slate-100" />}</td>
                <td className="px-4 py-2 text-xs font-mono">{c.key}</td>
                <td className="px-4 py-2 font-medium">{c.label}</td>
                <td className="px-4 py-2 text-xs">{c.count}</td>
                <td className="px-4 py-2 text-xs">{c.order}</td>
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

      <Modal open={open} onClose={() => setOpen(false)} title={editing._id ? 'Edit Category' : 'New Category'}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Key (slug)"><Input value={editing.key} onChange={(e) => setEditing({ ...editing, key: e.target.value })} /></Field>
          <Field label="Label"><Input value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} /></Field>
          <Field label="Count text"><Input value={editing.count} onChange={(e) => setEditing({ ...editing, count: e.target.value })} /></Field>
          <Field label="Order"><Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: +e.target.value })} /></Field>
          <div className="col-span-2">
            <Field label="Category image">
              <ImageUpload value={editing.image} onChange={(url) => setEditing({ ...editing, image: url })} height={160} />
            </Field>
          </div>
          <div className="col-span-2">
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
