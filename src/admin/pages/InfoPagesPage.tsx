import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { Btn, Card, Field, Input, Modal, PageHeader, Textarea } from '../ui'

type Section = { heading: string; body: string[] }
type Info = {
  _id?: string
  key: string
  title: string
  kicker: string
  intro: string
  sections: Section[]
}

const empty: Info = { key: '', title: '', kicker: '', intro: '', sections: [{ heading: '', body: [''] }] }

export default function InfoPagesPage() {
  const [items, setItems] = useState<Info[]>([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Info>(empty)

  async function load() {
    const data = await api<Record<string, Info>>('/info')
    setItems(Object.values(data))
  }
  useEffect(() => { load() }, [])

  async function save() {
    try {
      if (editing._id) await api(`/info/${editing._id}`, { method: 'PUT', body: JSON.stringify(editing) })
      else await api('/info', { method: 'POST', body: JSON.stringify(editing) })
      setOpen(false); load()
    } catch (e: any) { alert(e.message) }
  }
  async function del(i: Info) {
    if (!i._id || !confirm(`Delete "${i.title}"?`)) return
    await api(`/info/${i._id}`, { method: 'DELETE' }); load()
  }

  function setSection(idx: number, patch: Partial<Section>) {
    setEditing({
      ...editing,
      sections: editing.sections.map((s, i) => (i === idx ? { ...s, ...patch } : s)),
    })
  }
  function addSection() {
    setEditing({ ...editing, sections: [...editing.sections, { heading: '', body: [''] }] })
  }
  function removeSection(idx: number) {
    setEditing({ ...editing, sections: editing.sections.filter((_, i) => i !== idx) })
  }

  return (
    <div>
      <PageHeader
        title="Info Pages"
        subtitle="About, Privacy, Terms, Shipping, FAQs, Contact…"
        action={<Btn onClick={() => { setEditing(empty); setOpen(true) }}>+ New Page</Btn>}
      />

      <Card>
        <table className="w-full text-sm">
          <thead className="text-xs text-slate-500 uppercase">
            <tr className="text-left">
              <th className="px-4 py-2">Key</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Kicker</th>
              <th className="px-4 py-2">Sections</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((p) => (
              <tr key={p._id}>
                <td className="px-4 py-2 font-mono text-xs">{p.key}</td>
                <td className="px-4 py-2 font-medium">{p.title}</td>
                <td className="px-4 py-2 text-xs">{p.kicker}</td>
                <td className="px-4 py-2 text-xs">{p.sections?.length || 0}</td>
                <td className="px-4 py-2 text-right whitespace-nowrap">
                  <Btn variant="ghost" onClick={() => { setEditing(p); setOpen(true) }}>Edit</Btn>
                  <Btn variant="danger" className="ml-1" onClick={() => del(p)}>Delete</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title={editing._id ? 'Edit Page' : 'New Page'}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Key (slug)"><Input value={editing.key} onChange={(e) => setEditing({ ...editing, key: e.target.value })} /></Field>
          <Field label="Title"><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
          <div className="col-span-2"><Field label="Kicker"><Input value={editing.kicker} onChange={(e) => setEditing({ ...editing, kicker: e.target.value })} /></Field></div>
          <div className="col-span-2"><Field label="Intro"><Textarea rows={3} value={editing.intro} onChange={(e) => setEditing({ ...editing, intro: e.target.value })} /></Field></div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">Sections</h4>
            <Btn variant="ghost" onClick={addSection}>+ Section</Btn>
          </div>
          <div className="space-y-3">
            {editing.sections.map((s, idx) => (
              <div key={idx} className="border border-slate-200 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    placeholder="Heading"
                    value={s.heading}
                    onChange={(e) => setSection(idx, { heading: e.target.value })}
                  />
                  <Btn variant="danger" onClick={() => removeSection(idx)}>×</Btn>
                </div>
                <Textarea
                  rows={4}
                  placeholder="One paragraph per line"
                  value={s.body.join('\n')}
                  onChange={(e) => setSection(idx, { body: e.target.value.split('\n').filter(Boolean) })}
                />
              </div>
            ))}
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
