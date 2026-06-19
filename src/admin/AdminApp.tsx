import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { api, getAdminToken, setAdminToken } from '../api/client'
import AdminLayout from './AdminLayout'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import ProductsPage from './pages/ProductsPage'
import OrdersPage from './pages/OrdersPage'
import UsersPage from './pages/UsersPage'
import CategoriesPage from './pages/CategoriesPage'
import HeroPage from './pages/HeroPage'
import LookbookPage from './pages/LookbookPage'
import InfoPagesPage from './pages/InfoPagesPage'
import NewsletterPage from './pages/NewsletterPage'
import MessagesPage from './pages/MessagesPage'
import SettingsPage from './pages/SettingsPage'
import SiteSettingsPage from './pages/SiteSettingsPage'
import CouponsPage from './pages/CouponsPage'
import MediaPage from './pages/MediaPage'

export type AdminInfo = { id: string; email: string; name: string; role: string }

export default function AdminApp() {
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState<AdminInfo | null>(null)

  useEffect(() => {
    const t = getAdminToken()
    if (!t) {
      setLoading(false)
      return
    }
    api<AdminInfo>('/admin/me')
      .then((a) => setAdmin(a))
      .catch(() => setAdminToken(null))
      .finally(() => setLoading(false))
  }, [])

  function handleLogin(token: string, who: AdminInfo) {
    setAdminToken(token)
    setAdmin(who)
  }

  function handleLogout() {
    setAdminToken(null)
    setAdmin(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">Loading admin…</div>
      </div>
    )
  }

  if (!admin) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    )
  }

  return (
    <AdminLayout admin={admin} onLogout={handleLogout}>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="hero" element={<HeroPage />} />
        <Route path="lookbook" element={<LookbookPage />} />
        <Route path="info" element={<InfoPagesPage />} />
        <Route path="newsletter" element={<NewsletterPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="site-settings" element={<SiteSettingsPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  )
}
