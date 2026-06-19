import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { Btn, Card, Field, Input, Modal, PageHeader } from '../ui'
import ImageUpload from '../ImageUpload'

type Look = {
  _id?: string
  image: string
  tag: string
  title: string
  order: number
  active: boolean
}

const empty: Look = { image: '', tag: '', title: '', order: 0, active: true }

export default function LookbookPage() {
  const [items, setItems] = useState<Look[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Look>(empty)

  async function load() { setItems(await api<Look[]>('/lookbook/all')) }
  useEffect(() => { load() }, [])

  async function save() {
    try {
      if (editing._id) await api(`/lookbook/${editing._id}`, { method: 'PUT', body: JSON.stringify(editing) })
      else await api('/lookbook', { method: 'POST', body: JSON.stringify(editing) })
      setOpen(false); load()
    } catch (e: any) { alert(e.message) }
  }
  async function del(l: Look) {
    if (!l._id || !confirm('Delete this look?')) return
    await api(`/lookbook/${l._id}`, { method: 'DELETE' }); load()
  }

  return (
    <div>
      <PageHeader
        title="Lookbook"
        action={<Btn onClick={() => { setEditing(empty); setOpen(true) }}>+ New Look</Btn>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((l) => (
          <Card key={l._id} className="overflow-hidden">
            {l.image && <img src={l.image} className="w-full h-48 object-cover bg-slate-100" />}
            <div className="p-3">
              <div className="text-[10px] uppercase tracking-widest text-slate-500">{l.tag}</div>
              <div className="font-semibold text-sm">{l.title}</div>
              <div className="text-xs text-slate-400 mt-1">order {l.order}</div>
              <div className="flex gap-2 mt-2">
                <Btn variant="ghost" onClick={() => { setEditing(l); setOpen(true) }}>Edit</Btn>
                <Btn variant="danger" onClick={() => del(l)}>Delete</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing._id ? 'Edit Look' : 'New Look'}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tag"><Input value={editing.tag} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} /></Field>
          <Field label="Title"><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
          <div className="col-span-2">
            <Field label="Lookbook image">
              <ImageUpload value={editing.image} onChange={(url) => setEditing({ ...editing, image: url })} height={200} />
            </Field>
          </div>
          <Field label="Order"><Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: +e.target.value })} /></Field>
          <div className="flex items-center">
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
