import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { Btn, Card, Field, Input, Modal, PageHeader, Select } from '../ui'
import ImageUpload from '../ImageUpload'

type Product = {
  _id?: string
  slug: string
  brand: string
  name: string
  description?: string
  price: number
  mrp: number
  badge: string
  image: string
  seed?: string
  category: string
  section: 'new' | 'best' | 'sale'
  stock: number
  sizes: string[]
  active: boolean
}

const empty: Product = {
  slug: '',
  brand: 'Glixy Originals',
  name: '',
  description: '',
  price: 0,
  mrp: 0,
  badge: '',
  image: '',
  seed: '',
  category: 'tees',
  section: 'new',
  stock: 100,
  sizes: ['S', 'M', 'L', 'XL'],
  active: true,
}

const CATS = ['tees', 'oversized', 'shirts', 'hoodies', 'joggers', 'jackets', 'bottomwear']
const SECTIONS = ['new', 'best', 'sale']

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([])
  const [filter, setFilter] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState<Product>(empty)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const data = await api<Product[]>('/products?active=false')
      setItems(data)
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openNew() {
    setEditing(empty)
    setOpenForm(true)
  }
  function openEdit(p: Product) {
    setEditing(p)
    setOpenForm(true)
  }

  async function save() {
    try {
      const body = { ...editing }
      if (editing._id) {
        await api(`/products/${editing._id}`, { method: 'PUT', body: JSON.stringify(body) })
      } else {
        await api('/products', { method: 'POST', body: JSON.stringify(body) })
      }
      setOpenForm(false)
      load()
    } catch (e: any) {
      alert(e.message)
    }
  }

  async function del(p: Product) {
    if (!p._id) return
    if (!confirm(`Delete "${p.name}"?`)) return
    await api(`/products/${p._id}`, { method: 'DELETE' })
    load()
  }

  const filtered = items.filter(
    (p) =>
      !filter ||
      p.name.toLowerCase().includes(filter.toLowerCase()) ||
      p.slug.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${items.length} total`}
        action={
          <div className="flex gap-2">
            <Input
              placeholder="Search…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="!w-56"
            />
            <Btn onClick={openNew}>+ New Product</Btn>
          </div>
        }
      />

      {err && <div className="text-red-600 text-sm mb-3">{err}</div>}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase">
              <tr className="text-left">
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Section</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr><td colSpan={8} className="px-4 py-6 text-center text-slate-400">Loading…</td></tr>
              )}
              {!loading && filtered.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-2">
                    {p.image ? (
                      <img src={p.image} alt="" className="w-10 h-10 rounded object-cover bg-slate-100" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-slate-100" />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.slug} · {p.brand}</div>
                  </td>
                  <td className="px-4 py-2 text-xs">{p.category}</td>
                  <td className="px-4 py-2 text-xs uppercase">{p.section}</td>
                  <td className="px-4 py-2">
                    ₹{p.price}
                    <span className="text-xs text-slate-400 line-through ml-1">₹{p.mrp}</span>
                  </td>
                  <td className="px-4 py-2 text-xs">{p.stock}</td>
                  <td className="px-4 py-2 text-xs">{p.active ? '✓' : '—'}</td>
                  <td className="px-4 py-2 text-right whitespace-nowrap">
                    <Btn variant="ghost" onClick={() => openEdit(p)}>Edit</Btn>
                    <Btn variant="danger" className="ml-1" onClick={() => del(p)}>Delete</Btn>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-6 text-center text-slate-400">No products</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={openForm} onClose={() => setOpenForm(false)} title={editing._id ? 'Edit Product' : 'New Product'}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Slug (unique)">
            <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
          </Field>
          <Field label="Brand">
            <Input value={editing.brand} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} />
          </Field>
          <Field label="Name">
            <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          </Field>
          <Field label="Badge">
            <Input value={editing.badge} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} />
          </Field>
          <Field label="Price (₹)">
            <Input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: +e.target.value })} />
          </Field>
          <Field label="MRP (₹)">
            <Input type="number" value={editing.mrp} onChange={(e) => setEditing({ ...editing, mrp: +e.target.value })} />
          </Field>
          <Field label="Category">
            <Select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
              {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Section">
            <Select value={editing.section} onChange={(e) => setEditing({ ...editing, section: e.target.value as any })}>
              {SECTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <div className="col-span-2">
            <Field label="Product image">
              <ImageUpload
                value={editing.image}
                onChange={(url) => setEditing({ ...editing, image: url })}
                height={180}
              />
            </Field>
          </div>
          <Field label="Stock">
            <Input type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: +e.target.value })} />
          </Field>
          <div className="col-span-2">
            <Field label="Sizes (comma separated)">
              <Input
                value={editing.sizes.join(',')}
                onChange={(e) => setEditing({ ...editing, sizes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
              />
            </Field>
          </div>
          <div className="col-span-2">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={editing.active}
                onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
              />
              Active (visible on storefront)
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <Btn variant="ghost" onClick={() => setOpenForm(false)}>Cancel</Btn>
          <Btn onClick={save}>{editing._id ? 'Save changes' : 'Create'}</Btn>
        </div>
      </Modal>
    </div>
  )
}
