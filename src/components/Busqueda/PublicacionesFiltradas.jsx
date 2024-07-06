import { toast, Toaster } from 'sonner'
import { Publication } from '../publicaciones/Publication'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchPublicacionesFiltradas } from './fetchPublicaciones'

export const PublicacionesFiltradas = () => {
  const { query } = useParams()
  const [publications, setPublications] = useState([])

  const handleError = (message) => {
    toast.error(message)
  }

  useEffect(() => {
    if (query) {
      fetchPublicacionesFiltradas(setPublications, query)
    }
  }, [query])

  return (
    <div className="flex min-h-screen flex-col">
      <Toaster position="bottom-right" />
      {publications.length === 0 ? (
        <h1>No hay publicaciones que coincidan con el criterio de búsqueda!</h1>
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:p-6 lg:grid-cols-4">
          {publications.map((publication, index) => (
            <Publication key={index} publication={publication} onError={handleError} />
          ))}
        </section>
      )}
    </div>
  )
}
