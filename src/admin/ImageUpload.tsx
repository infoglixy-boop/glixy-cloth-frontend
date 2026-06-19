import { useRef, useState } from 'react'
import { getAdminToken } from '../api/client'

type Props = {
  value: string
  onChange: (url: string) => void
  className?: string
  height?: number
}

export default function ImageUpload({ value, onChange, className = '', height = 140 }: Props) {
  const ref = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  async function upload(file: File) {
    setErr(null)
    if (!file.type.startsWith('image/')) {
      setErr('Only image files')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErr('Max 5MB')
      return
    }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${getAdminToken() || ''}` },
        body: fd,
      })
      if (!res.ok) {
        const t = await res.json().catch(() => ({}))
        throw new Error(t.error || 'upload failed')
      }
      const data = await res.json()
      onChange(data.url)
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const f = e.dataTransfer.files?.[0]
          if (f) upload(f)
        }}
        onClick={() => ref.current?.click()}
        style={{ height }}
        className={`relative w-full border-2 border-dashed rounded-lg cursor-pointer overflow-hidden flex items-center justify-center transition ${
          dragOver ? 'border-slate-900 bg-slate-50' : 'border-slate-300 hover:border-slate-500 bg-slate-50/50'
        }`}
      >
        {value ? (
          <>
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center text-white text-xs font-medium transition opacity-0 hover:opacity-100">
              Click or drop to replace
            </div>
          </>
        ) : (
          <div className="text-center text-xs text-slate-500 px-3">
            {uploading ? 'Uploading…' : (
              <>
                <div className="text-2xl mb-1">📷</div>
                <div>Click or drag image to upload</div>
                <div className="text-[10px] text-slate-400 mt-1">PNG / JPG / WebP · max 5MB</div>
              </>
            )}
          </div>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) upload(f)
            e.target.value = ''
          }}
        />
      </div>
      <div className="flex items-center gap-2 mt-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="or paste image URL"
          className="flex-1 border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-slate-500 hover:text-red-600"
          >
            Clear
          </button>
        )}
      </div>
      {err && <div className="text-[11px] text-red-600 mt-1">{err}</div>}
    </div>
  )
}
