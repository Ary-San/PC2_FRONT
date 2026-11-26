import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, PAGE_SIZE, type Location, type Page } from '../api'
import { Pagination, QueryState, StatusBadge } from '../components'

export default function Dashboard() {
  const [page, setPage] = useState(1)
  const [version, setVersion] = useState(0)
  const [data, setData] = useState<Page<Location> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get<Page<Location>>('/locations', { params: { page, size: PAGE_SIZE } })
      .then((res) => {
        setData(res.data)
        setError('')
      })
      .catch(() => setError('No se pudo cargar la lista de espacios.'))
      .finally(() => setLoading(false))
  }, [page, version])

  const retry = () => {
    setLoading(true)
    setVersion((v) => v + 1)
  }

  const changePage = (p: number) => {
    setLoading(true)
    setPage(p)
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">Espacios del campus</h1>
      <QueryState loading={loading} error={error} onRetry={retry} />
      {!loading && !error && data && (
        <>
          {data.items.length === 0 ? (
            <p className="text-gray-500">No hay espacios para mostrar.</p>
          ) : (
            <ul className="space-y-2">
              {data.items.map((l) => (
                <li key={l.id}>
                  <Link to={`/locations/${l.id}`} className="flex items-center justify-between rounded bg-white p-4 shadow hover:bg-gray-100">
                    <div>
                      <p className="font-medium">{l.name}</p>
                      <p className="text-sm text-gray-600">{l.building} · Piso {l.floor}</p>
                      <p className="text-sm text-gray-600">{l.description}</p>
                    </div>
                    <StatusBadge active={l.status === 'OPEN'} label={l.status === 'OPEN' ? 'Abierto' : 'Cerrado'} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Pagination page={data.page} totalPages={data.totalPages} onChange={changePage} />
        </>
      )}
    </>
  )
}
