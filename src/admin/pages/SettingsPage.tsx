import { useState } from 'react'
import { api } from '../../api/client'
import { Btn, Card, Field, Input, PageHeader } from '../ui'

export default function SettingsPage() {
  const [curr, setCurr] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null); setMsg(null)
    if (next !== confirm) { setErr('passwords do not match'); return }
    setLoading(true)
    try {
      await api('/admin/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword: curr, newPassword: next }),
      })
      setMsg('Password updated.')
      setCurr(''); setNext(''); setConfirm('')
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <PageHeader title="Settings" subtitle="Account & security" />

      <Card className="p-5">
        <h3 className="font-semibold text-sm mb-3">Change Password</h3>
        <form onSubmit={submit} className="space-y-3">
          <Field label="Current password"><Input type="password" value={curr} onChange={(e) => setCurr(e.target.value)} required /></Field>
          <Field label="New password (min 6)"><Input type="password" value={next} onChange={(e) => setNext(e.target.value)} required /></Field>
          <Field label="Confirm new password"><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required /></Field>
          {err && <div className="text-red-600 text-xs">{err}</div>}
          {msg && <div className="text-emerald-600 text-xs">{msg}</div>}
          <Btn disabled={loading}>{loading ? 'Saving…' : 'Update password'}</Btn>
        </form>
      </Card>
    </div>
  )
}
