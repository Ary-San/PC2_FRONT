import { useEffect, useState } from 'react'
import { api, errorCode, errorMessage, type Ticket } from '../api'
import { Button, QueryState, StatusBadge } from '../components'

export default function MyTickets() {
  const [version, setVersion] = useState(0)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    api
      .get<Ticket[]>('/me/tickets')
      .then((res) => {
        setTickets(res.data)
        setError('')
      })
      .catch(() => setError('No se pudieron cargar tus solicitudes.'))
      .finally(() => setLoading(false))
  }, [version])

  const retry = () => {
    setLoading(true)
    setVersion((v) => v + 1)
  }

  const close = async (id: number) => {
    setActionError('')
    try {
      await api.patch(`/tickets/${id}/close`)
    } catch (err) {
      setActionError(
        errorCode(err) === 'INVALID_STATE'
          ? 'La solicitud ya no está abierta.'
          : errorMessage(err, 'No se pudo cerrar la solicitud.'),
      )
    }
    setVersion((v) => v + 1)
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">Mis solicitudes</h1>
      {actionError && <p className="text-red-600">{actionError}</p>}
      <QueryState loading={loading} error={error} onRetry={retry} />
      {!loading && !error && (
        tickets.length === 0 ? (
          <p className="text-gray-500">No tienes solicitudes.</p>
        ) : (
          <ul className="space-y-2">
            {tickets.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 rounded bg-white p-4 shadow">
                <div>
                  <p className="font-medium">{t.resourceName}</p>
                  <p className="text-sm text-gray-600">{t.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge active={t.status === 'OPEN'} label={t.status === 'OPEN' ? 'Abierta' : 'Cerrada'} />
                  {t.status === 'OPEN' && <Button onClick={() => close(t.id)}>Cerrar</Button>}
                </div>
              </li>
            ))}
          </ul>
        )
      )}
    </>
  )
}
