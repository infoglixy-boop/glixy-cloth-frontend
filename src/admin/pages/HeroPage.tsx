import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { Btn, Card, Field, Input, Modal, PageHeader, Textarea } from '../ui'
import ImageUpload from '../ImageUpload'

type Hero = {
  _id?: string
  kicker: string
  title: string
  sub: string
  cta: string
  href: string
  image: string
  order: number
  active: boolean
}

const empty: Hero = { kicker: '', title: '', sub: '', cta: 'SHOP NOW', href: '#new', image: '', order: 0, active: true }

export default function HeroPage() {
  const [items, setItems] = useState<Hero[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Hero>(empty)

  async function load() {
    setItems(await api<Hero[]>('/hero/all'))
  }
  useEffect(() => { load() }, [])

  async function save() {
    try {
      if (editing._id) await api(`/hero/${editing._id}`, { method: 'PUT', body: JSON.stringify(editing) })
      else await api('/hero', { method: 'POST', body: JSON.stringify(editing) })
      setOpen(false); load()
    } catch (e: any) { alert(e.message) }
  }
  async function del(h: Hero) {
    if (!h._id || !confirm('Delete this slide?')) return
    await api(`/hero/${h._id}`, { method: 'DELETE' }); load()
  }

  return (
    <div>
      <PageHeader
        title="Hero Slides"
        subtitle={`${items.length} slides on storefront`}
        action={<Btn onClick={() => { setEditing(empty); setOpen(true) }}>+ New Slide</Btn>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((h) => (
          <Card key={h._id} className="overflow-hidden">
            {h.image && <img src={h.image} className="w-full h-40 object-cover bg-slate-100" />}
            <div className="p-4">
              <div className="text-xs uppercase tracking-widest text-slate-500">{h.kicker}</div>
              <div className="font-bold text-lg whitespace-pre-line">{h.title}</div>
              <div className="text-xs text-slate-600 mt-1">{h.sub}</div>
              <div className="text-xs mt-2 text-slate-500">CTA: {h.cta} → {h.href}</div>
              <div className="flex gap-2 mt-3">
                <Btn variant="ghost" onClick={() => { setEditing(h); setOpen(true) }}>Edit</Btn>
                <Btn variant="danger" onClick={() => del(h)}>Delete</Btn>
                <span className="ml-auto text-xs text-slate-400">order {h.order} · {h.active ? 'active' : 'hidden'}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing._id ? 'Edit Slide' : 'New Slide'}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Kicker"><Input value={editing.kicker} onChange={(e) => setEditing({ ...editing, kicker: e.target.value })} /></Field>
          <Field label="CTA Label"><Input value={editing.cta} onChange={(e) => setEditing({ ...editing, cta: e.target.value })} /></Field>
          <div className="col-span-2"><Field label="Title (use \\n for new line)"><Textarea rows={2} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field></div>
          <div className="col-span-2"><Field label="Subtitle"><Textarea rows={2} value={editing.sub} onChange={(e) => setEditing({ ...editing, sub: e.target.value })} /></Field></div>
          <div className="col-span-2">
            <Field label="Slide image">
              <ImageUpload value={editing.image} onChange={(url) => setEditing({ ...editing, image: url })} height={180} />
            </Field>
          </div>
          <Field label="CTA Link"><Input value={editing.href} onChange={(e) => setEditing({ ...editing, href: e.target.value })} /></Field>
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
