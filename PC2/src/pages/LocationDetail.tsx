import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, errorCode, errorMessage, type Location, type Ticket } from '../api'
import { Button, Field, inputClass, QueryState, StatusBadge } from '../components'

export default function LocationDetail() {
  const { id } = useParams()
  const [version, setVersion] = useState(0)
  const [location, setLocation] = useState<Location | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [description, setDescription] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    Promise.all([api.get<Location>(`/locations/${id}`), api.get<Ticket[]>('/me/tickets')])
      .then(([loc, mine]) => {
        setLocation(loc.data)
        setTickets(mine.data.filter((t) => t.resourceId === loc.data.id))
        setError('')
      })
      .catch((err) => setError(errorCode(err) === 'NOT_FOUND' ? 'El espacio no existe.' : 'No se pudo cargar el espacio.'))
      .finally(() => setLoading(false))
  }, [id, version])

  const retry = () => {
    setLoading(true)
    setVersion((v) => v + 1)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    setSuccess('')
    const text = description.trim()
    if (text.length < 10 || text.length > 200) {
      setFieldError('La descripción debe tener entre 10 y 200 caracteres.')
      return
    }
    setFieldError('')
    setSending(true)
    try {
      await api.post(`/locations/${id}/tickets`, { description: text })
      setDescription('')
      setSuccess('Solicitud creada.')
      setVersion((v) => v + 1)
    } catch (err) {
      setFormError(
        errorCode(err) === 'LOCATION_CLOSED'
          ? 'El espacio está cerrado y no admite solicitudes.'
          : errorMessage(err, 'No se pudo crear la solicitud.'),
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <Link to="/locations" className="text-blue-600">Volver al listado</Link>
      <QueryState loading={loading} error={error} onRetry={retry} />
      {!loading && !error && location && (
        <>
          <div className="space-y-1 rounded bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">{location.name}</h1>
              <StatusBadge active={location.status === 'OPEN'} label={location.status === 'OPEN' ? 'Abierto' : 'Cerrado'} />
            </div>
            <p className="text-gray-600">{location.building} · Piso {location.floor}</p>
            <p>{location.description}</p>
          </div>

          <form onSubmit={submit} noValidate className="space-y-3 rounded bg-white p-4 shadow">
            <h2 className="text-lg font-semibold">Nueva solicitud</h2>
            <Field label="Descripción" error={fieldError}>
              <textarea className={inputClass} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </Field>
            {formError && <p className="text-red-600">{formError}</p>}
            {success && <p className="text-green-700">{success}</p>}
            <Button type="submit" disabled={sending}>Enviar solicitud</Button>
          </form>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Mis solicitudes en este espacio</h2>
            {tickets.length === 0 ? (
              <p className="text-gray-500">No tienes solicitudes en este espacio.</p>
            ) : (
              <ul className="space-y-2">
                {tickets.map((t) => (
                  <li key={t.id} className="flex items-center justify-between rounded bg-white p-3 shadow">
                    <span>{t.description}</span>
                    <StatusBadge active={t.status === 'OPEN'} label={t.status === 'OPEN' ? 'Abierta' : 'Cerrada'} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </>
  )
}
