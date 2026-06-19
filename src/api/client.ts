const TOKEN_KEY = 'glixy_admin_token'

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAdminToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function api<T = any>(
  path: string,
  opts: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((opts.headers as Record<string, string>) || {}),
  }
  if (opts.auth !== false) {
    const t = getAdminToken()
    if (t) headers.Authorization = `Bearer ${t}`
  }
  const res = await fetch(`/api${path}`, { ...opts, headers })
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    const msg = (data && data.error) || res.statusText || 'request failed'
    throw new Error(msg)
  }
  return data as T
}
