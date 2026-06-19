import { useState } from 'react'
import { api } from '../../api/client'
import type { AdminInfo } from '../AdminApp'

type Props = {
  onLogin: (token: string, admin: AdminInfo) => void
}

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState('admin@glixy.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErr(null)
    try {
      const res = await api<{ token: string; admin: AdminInfo }>('/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        auth: false,
      })
      onLogin(res.token, res.admin)
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm bg-white rounded-lg shadow-xl p-7"
      >
        <div className="text-center mb-6">
          <div className="text-2xl font-bold tracking-wide">GLIXY</div>
          <div className="text-xs uppercase tracking-widest text-slate-500">Admin Sign In</div>
        </div>

        <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />

        <label className="block text-xs font-medium text-slate-600 mb-1">Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-slate-900"
        />

        {err && <div className="text-xs text-red-600 mb-3">{err}</div>}

        <button
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white py-2.5 rounded text-sm font-medium"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-[11px] text-slate-400 text-center mt-5">
          Default: admin@glixy.com / admin123 — change after first login.
        </p>
      </form>
    </div>
  )
}
