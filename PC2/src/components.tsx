import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom'

export const inputClass = 'w-full rounded border border-gray-300 px-3 py-2'

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error && <span className="block text-sm text-red-600">{error}</span>}
    </label>
  )
}

export function Button({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 ${className}`}
    />
  )
}

export function QueryState({ loading, error, onRetry }: { loading: boolean; error: string; onRetry: () => void }) {
  if (loading) return <p className="text-gray-500">Cargando...</p>
  if (error)
    return (
      <div className="space-y-2">
        <p className="text-red-600">{error}</p>
        <Button onClick={onRetry}>Reintentar</Button>
      </div>
    )
  return null
}

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  return (
    <div className="flex items-center gap-4">
      <Button disabled={page <= 1} onClick={() => onChange(page - 1)}>Anterior</Button>
      <span>Página {page} de {Math.max(totalPages, 1)}</span>
      <Button disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Siguiente</Button>
    </div>
  )
}

export function StatusBadge({ label, active }: { label: string; active: boolean }) {
  const color = active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
  return <span className={`rounded px-2 py-0.5 text-sm ${color}`}>{label}</span>
}

export function ProtectedLayout() {
  const navigate = useNavigate()
  if (!localStorage.getItem('token')) return <Navigate to="/login" replace />

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center gap-4 border-b bg-white px-6 py-3">
        <Link to="/locations" className="font-semibold">AulaSoporte</Link>
        <Link to="/my-tickets" className="text-blue-600">Mis solicitudes</Link>
        <button onClick={logout} className="ml-auto text-red-600">Cerrar sesión</button>
      </nav>
      <main className="mx-auto max-w-3xl space-y-4 p-6">
        <Outlet />
      </main>
    </div>
  )
}
