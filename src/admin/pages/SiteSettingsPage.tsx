import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { Btn, Card, Field, Input, PageHeader, Textarea } from '../ui'
import ImageUpload from '../ImageUpload'

type Link = { label: string; href: string }
type FooterCol = { title: string; links: Link[] }
type Usp = { icon: string; title: string; body: string }
type Promo = { kicker: string; heading: string; subheading: string; cta: string; href: string; image: string }

type Settings = {
  _id?: string
  storeName: string
  storeTagline: string
  logo: string
  favicon: string
  announceText: string
  announceActive: boolean
  marqueeItems: string[]
  promo: Promo
  usps: Usp[]
  footerColumns: FooterCol[]
  socialLinks: Link[]
  contactEmail: string
  contactPhone: string
  contactAddress: string
  shippingFreeOver: number
  shippingFlat: number
  codEnabled: boolean
  currency: string
}

const tabs = [
  { id: 'brand', label: 'Brand' },
  { id: 'banners', label: 'Announce & Marquee' },
  { id: 'promo', label: 'Promo Banner' },
  { id: 'usps', label: 'USPs' },
  { id: 'footer', label: 'Footer & Social' },
  { id: 'contact', label: 'Contact' },
  { id: 'shipping', label: 'Shipping' },
] as const

export default function SiteSettingsPage() {
  const [s, setS] = useState<Settings | null>(null)
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('brand')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    api<Settings>('/settings').then(setS)
  }, [])

  if (!s) return <div className="text-slate-500 text-sm">Loading settings…</div>

  async function save() {
    setSaving(true)
    setMsg(null)
    try {
      const updated = await api<Settings>('/settings', {
        method: 'PUT',
        body: JSON.stringify(s),
      })
      setS(updated)
      setMsg('Settings saved ✓')
      setTimeout(() => setMsg(null), 2500)
    } catch (e: any) {
      setMsg(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Site Settings"
        subtitle="Everything on the storefront — branding, banners, promo, USPs, footer, contact, shipping."
        action={
          <div className="flex items-center gap-3">
            {msg && <span className="text-xs text-emerald-600">{msg}</span>}
            <Btn onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save all changes'}</Btn>
          </div>
        }
      />

      <div className="flex gap-1 mb-4 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap ${
              tab === t.id ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'brand' && (
        <Card className="p-5 space-y-4 max-w-3xl">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Store name"><Input value={s.storeName} onChange={(e) => setS({ ...s, storeName: e.target.value })} /></Field>
            <Field label="Tagline"><Input value={s.storeTagline} onChange={(e) => setS({ ...s, storeTagline: e.target.value })} /></Field>
            <Field label="Currency symbol"><Input value={s.currency} onChange={(e) => setS({ ...s, currency: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Logo"><ImageUpload value={s.logo} onChange={(url) => setS({ ...s, logo: url })} height={140} /></Field>
            <Field label="Favicon"><ImageUpload value={s.favicon} onChange={(url) => setS({ ...s, favicon: url })} height={140} /></Field>
          </div>
        </Card>
      )}

      {tab === 'banners' && (
        <Card className="p-5 space-y-5 max-w-3xl">
          <div>
            <Field label="Announce bar text">
              <Input value={s.announceText} onChange={(e) => setS({ ...s, announceText: e.target.value })} />
            </Field>
            <label className="inline-flex items-center gap-2 text-sm mt-2">
              <input type="checkbox" checked={s.announceActive} onChange={(e) => setS({ ...s, announceActive: e.target.checked })} />
              Show announce bar
            </label>
          </div>
          <div>
            <Field label="Marquee items (one per line)">
              <Textarea
                rows={6}
                value={s.marqueeItems.join('\n')}
                onChange={(e) => setS({ ...s, marqueeItems: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean) })}
              />
            </Field>
          </div>
        </Card>
      )}

      {tab === 'promo' && (
        <Card className="p-5 space-y-3 max-w-3xl">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Kicker"><Input value={s.promo.kicker} onChange={(e) => setS({ ...s, promo: { ...s.promo, kicker: e.target.value } })} /></Field>
            <Field label="CTA Label"><Input value={s.promo.cta} onChange={(e) => setS({ ...s, promo: { ...s.promo, cta: e.target.value } })} /></Field>
            <div className="col-span-2"><Field label="Heading"><Input value={s.promo.heading} onChange={(e) => setS({ ...s, promo: { ...s.promo, heading: e.target.value } })} /></Field></div>
            <div className="col-span-2"><Field label="Subheading"><Textarea rows={2} value={s.promo.subheading} onChange={(e) => setS({ ...s, promo: { ...s.promo, subheading: e.target.value } })} /></Field></div>
            <Field label="CTA Link"><Input value={s.promo.href} onChange={(e) => setS({ ...s, promo: { ...s.promo, href: e.target.value } })} /></Field>
          </div>
          <Field label="Banner image">
            <ImageUpload value={s.promo.image} onChange={(url) => setS({ ...s, promo: { ...s.promo, image: url } })} height={180} />
          </Field>
        </Card>
      )}

      {tab === 'usps' && (
        <Card className="p-5 max-w-3xl">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-600">Selling points shown below the bestsellers section.</p>
            <Btn variant="ghost" onClick={() => setS({ ...s, usps: [...s.usps, { icon: 'star', title: 'New USP', body: '' }] })}>+ Add USP</Btn>
          </div>
          <div className="space-y-3">
            {s.usps.map((u, i) => (
              <div key={i} className="border border-slate-200 rounded p-3 grid grid-cols-12 gap-2 items-end">
                <div className="col-span-2">
                  <Field label="Icon name">
                    <Input value={u.icon} onChange={(e) => updateAt(s, setS, 'usps', i, { ...u, icon: e.target.value })} placeholder="truck" />
                  </Field>
                </div>
                <div className="col-span-3">
                  <Field label="Title">
                    <Input value={u.title} onChange={(e) => updateAt(s, setS, 'usps', i, { ...u, title: e.target.value })} />
                  </Field>
                </div>
                <div className="col-span-6">
                  <Field label="Body">
                    <Input value={u.body} onChange={(e) => updateAt(s, setS, 'usps', i, { ...u, body: e.target.value })} />
                  </Field>
                </div>
                <div className="col-span-1 flex justify-end">
                  <Btn variant="danger" onClick={() => setS({ ...s, usps: s.usps.filter((_, j) => j !== i) })}>×</Btn>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-3">Icon names from <a className="underline" href="https://lucide.dev/icons" target="_blank">lucide.dev</a> (e.g. truck, shield-check, leaf, rotate-ccw, star)</p>
        </Card>
      )}

      {tab === 'footer' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Footer columns</h3>
              <Btn variant="ghost" onClick={() => setS({ ...s, footerColumns: [...s.footerColumns, { title: 'New', links: [] }] })}>+ Column</Btn>
            </div>
            <div className="space-y-3">
              {s.footerColumns.map((col, ci) => (
                <div key={ci} className="border border-slate-200 rounded p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input value={col.title} onChange={(e) => updateAt(s, setS, 'footerColumns', ci, { ...col, title: e.target.value })} placeholder="Column title" />
                    <Btn variant="danger" onClick={() => setS({ ...s, footerColumns: s.footerColumns.filter((_, i) => i !== ci) })}>×</Btn>
                  </div>
                  <div className="space-y-1.5">
                    {col.links.map((l, li) => (
                      <div key={li} className="flex gap-1.5">
                        <Input
                          value={l.label}
                          placeholder="Label"
                          onChange={(e) => {
                            const links = [...col.links]
                            links[li] = { ...l, label: e.target.value }
                            updateAt(s, setS, 'footerColumns', ci, { ...col, links })
                          }}
                        />
                        <Input
                          value={l.href}
                          placeholder="#about or https://…"
                          onChange={(e) => {
                            const links = [...col.links]
                            links[li] = { ...l, href: e.target.value }
                            updateAt(s, setS, 'footerColumns', ci, { ...col, links })
                          }}
                        />
                        <Btn variant="danger" onClick={() => {
                          const links = col.links.filter((_, j) => j !== li)
                          updateAt(s, setS, 'footerColumns', ci, { ...col, links })
                        }}>×</Btn>
                      </div>
                    ))}
                    <Btn variant="ghost" onClick={() => updateAt(s, setS, 'footerColumns', ci, { ...col, links: [...col.links, { label: '', href: '' }] })}>+ Add link</Btn>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Social links</h3>
              <Btn variant="ghost" onClick={() => setS({ ...s, socialLinks: [...s.socialLinks, { label: '', href: '' }] })}>+ Add</Btn>
            </div>
            <div className="space-y-2">
              {s.socialLinks.map((l, i) => (
                <div key={i} className="flex gap-1.5">
                  <Input value={l.label} placeholder="Instagram" onChange={(e) => updateAt(s, setS, 'socialLinks', i, { ...l, label: e.target.value })} />
                  <Input value={l.href} placeholder="https://…" onChange={(e) => updateAt(s, setS, 'socialLinks', i, { ...l, href: e.target.value })} />
                  <Btn variant="danger" onClick={() => setS({ ...s, socialLinks: s.socialLinks.filter((_, j) => j !== i) })}>×</Btn>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'contact' && (
        <Card className="p-5 space-y-3 max-w-2xl">
          <Field label="Contact email"><Input value={s.contactEmail} onChange={(e) => setS({ ...s, contactEmail: e.target.value })} /></Field>
          <Field label="Contact phone"><Input value={s.contactPhone} onChange={(e) => setS({ ...s, contactPhone: e.target.value })} /></Field>
          <Field label="Address"><Textarea rows={3} value={s.contactAddress} onChange={(e) => setS({ ...s, contactAddress: e.target.value })} /></Field>
        </Card>
      )}

      {tab === 'shipping' && (
        <Card className="p-5 space-y-3 max-w-xl">
          <Field label="Free shipping over (₹)">
            <Input type="number" value={s.shippingFreeOver} onChange={(e) => setS({ ...s, shippingFreeOver: +e.target.value })} />
          </Field>
          <Field label="Flat shipping rate (₹)">
            <Input type="number" value={s.shippingFlat} onChange={(e) => setS({ ...s, shippingFlat: +e.target.value })} />
          </Field>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={s.codEnabled} onChange={(e) => setS({ ...s, codEnabled: e.target.checked })} />
            Cash on Delivery enabled
          </label>
        </Card>
      )}
    </div>
  )
}

function updateAt<T extends keyof Settings>(
  s: Settings,
  setS: (v: Settings) => void,
  key: T,
  idx: number,
  value: any
) {
  const arr = [...(s[key] as any[])]
  arr[idx] = value
  setS({ ...s, [key]: arr } as Settings)
}
