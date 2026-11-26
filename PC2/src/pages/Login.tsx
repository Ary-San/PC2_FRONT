import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { Button, Field, inputClass } from '../components'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      const { data } = await api.post<{ token: string }>('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      navigate('/locations')
    } catch {
      setError('Correo o contraseña incorrectos.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <form onSubmit={submit} className="mx-auto max-w-sm space-y-4 rounded bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">Iniciar sesión</h1>
        <Field label="Correo">
          <input type="email" required className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Contraseña">
          <input type="password" required className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {error && <p className="text-red-600">{error}</p>}
        <Button type="submit" disabled={sending} className="w-full">Entrar</Button>
        <p className="text-sm">¿No tienes cuenta? <Link to="/register" className="text-blue-600">Regístrate</Link></p>
      </form>
    </div>
  )
}
