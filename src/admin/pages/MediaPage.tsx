import { useEffect, useState } from 'react'
import { api, getAdminToken } from '../../api/client'
import { Btn, Card, PageHeader } from '../ui'

type FileInfo = { url: string; name: string; size: number; mtime: number }

export default function MediaPage() {
  const [items, setItems] = useState<FileInfo[]>([])
  const [busy, setBusy] = useState(false)

  async function load() {
    setItems(await api<FileInfo[]>('/admin/upload'))
  }
  useEffect(() => { load() }, [])

  async function upload(file: File) {
    if (!file) return
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getAdminToken() || ''}` },
        body: fd,
      })
      load()
    } finally {
      setBusy(false)
    }
  }

  async function del(name: string) {
    if (!confirm(`Delete ${name}?`)) return
    await api(`/admin/upload/${encodeURIComponent(name)}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <PageHeader
        title="Media Library"
        subtitle={`${items.length} files uploaded`}
        action={
          <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded">
            {busy ? 'Uploading…' : '+ Upload image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) upload(f)
                e.target.value = ''
              }}
            />
          </label>
        }
      />

      {items.length === 0 ? (
        <Card className="p-10 text-center text-slate-400 text-sm">
          No files uploaded yet. Drop or upload images here, then reference them in products / hero / promo.
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((f) => (
            <Card key={f.name} className="overflow-hidden">
              <div className="aspect-square bg-slate-100">
                <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-2.5">
                <div className="text-xs font-medium truncate" title={f.name}>{f.name}</div>
                <div className="text-[10px] text-slate-500">{(f.size / 1024).toFixed(1)} KB</div>
                <div className="flex gap-1 mt-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(f.url)}
                    className="text-[11px] flex-1 bg-slate-100 hover:bg-slate-200 rounded py-1"
                  >
                    Copy URL
                  </button>
                  <Btn variant="danger" onClick={() => del(f.name)}>×</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
